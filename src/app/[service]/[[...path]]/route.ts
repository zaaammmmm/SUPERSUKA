import type { NextRequest } from "next/server";
import { getService } from "@/config/services";
import { UNIVERSAL_SKIN_CSS } from "@/lib/universal-skin/styles";
import { UNIVERSAL_SKIN_RUNTIME } from "@/lib/universal-skin/runtime";
import { rewriteGoogleFontCss, transformCss, transformHtml } from "@/lib/universal-skin/transformers/transform";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GOOGLE_FONT_CSS = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
const FONT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const STRIP_RESPONSE = new Set(["connection", "keep-alive", "transfer-encoding", "content-encoding", "content-length", "te", "trailer", "upgrade", "proxy-authenticate", "proxy-authorization", "set-cookie"]);
const STRIP_REQUEST = new Set(["host", "connection", "content-length", "accept-encoding", "if-none-match", "if-modified-since", "x-forwarded-host", "x-forwarded-proto", "x-forwarded-port"]);
const UPSTREAM_TIMEOUT_MS = 30_000;
const CSS_CACHE_MAX = 200;
const cssCache = new Map<string, string>();
const fontCache = new Map<string, { at: number; css: string }>();
const fontFailures = new Map<string, number>();

const textResponse = (body: string, type: string, cache = "public, max-age=300") =>
  new Response(body, { headers: { "content-type": type, "cache-control": cache, "x-content-type-options": "nosniff" } });
const assetPrefix = (id: string) => `/${id}/__superapp/`;

async function serveFontCss(prefix: string): Promise<Response> {
  const cached = fontCache.get(prefix);
  if (cached && Date.now() - cached.at < 86_400_000) return textResponse(cached.css, "text/css; charset=utf-8", "public, max-age=3600, s-maxage=86400");
  if (Date.now() - (fontFailures.get(prefix) ?? 0) < 300_000) return textResponse("/* font unavailable */", "text/css; charset=utf-8", "public, max-age=60");
  try {
    const response = await fetch(GOOGLE_FONT_CSS, { headers: { "user-agent": FONT_UA }, signal: AbortSignal.timeout(2_000) });
    if (!response.ok) throw new Error(`Google Fonts returned ${response.status}`);
    const css = rewriteGoogleFontCss(await response.text(), `${prefix}font/`);
    fontCache.set(prefix, { at: Date.now(), css });
    return textResponse(css, "text/css; charset=utf-8", "public, max-age=3600, s-maxage=86400");
  } catch {
    fontFailures.set(prefix, Date.now());
    return textResponse("/* font unavailable */", "text/css; charset=utf-8", "public, max-age=60");
  }
}

async function serveFontFile(path: string): Promise<Response> {
  if (!/^s\/plusjakartasans\/[\w./-]+$/.test(path) || path.includes("..")) return new Response("Not found", { status: 404 });
  const response = await fetch(`https://fonts.gstatic.com/${path}`, { signal: AbortSignal.timeout(5_000) }).catch(() => null);
  if (!response?.ok || !response.body) return new Response("Not found", { status: 404 });
  return new Response(response.body, { headers: { "content-type": response.headers.get("content-type") ?? "font/woff2", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
}

function rewriteLocation(headers: Headers, origin: string, serviceId: string, upstreamBasePath: string) {
  const location = headers.get("location");
  if (!location) return;
  try {
    const target = new URL(location, origin);
    if (target.origin !== new URL(origin).origin) return;
    const base = upstreamBasePath === "/" ? "" : upstreamBasePath.replace(/\/$/, "");
    const suffix = base && target.pathname.startsWith(`${base}/`) ? target.pathname.slice(base.length) : target.pathname === base ? "/" : target.pathname;
    headers.set("location", `/${serviceId}${suffix}${target.search}${target.hash}`);
  } catch { /* preserve upstream value */ }
}

function rewriteSetCookie(cookie: string, serviceId: string, upstreamBasePath: string) {
  const isHostCookie = /^__Host-/i.test(cookie);
  const prefix = `/${serviceId}`;
  const base = upstreamBasePath === "/" ? "" : upstreamBasePath.replace(/\/$/, "");
  const parts = cookie.split(";").map((part) => part.trim());
  const rewritten = parts.filter((part) => !/^domain=/i.test(part)).map((part) => {
    if (!/^path=/i.test(part) || isHostCookie) return part;
    const originalPath = part.slice(part.indexOf("=") + 1);
    if (originalPath === "/" || originalPath === "") return `Path=${prefix}/`;
    if (base && (originalPath === base || originalPath.startsWith(`${base}/`))) return `Path=${prefix}${originalPath.slice(base.length) || "/"}`;
    return `Path=${prefix}${originalPath.startsWith("/") ? originalPath : `/${originalPath}`}`;
  });
  if (!rewritten.some((part) => /^path=/i.test(part)) && !isHostCookie) rewritten.push(`Path=${prefix}/`);
  return rewritten.join("; ");
}

function copyResponseHeaders(source: Headers, serviceId: string, origin: string, upstreamBasePath: string) {
  const headers = new Headers();
  source.forEach((value, key) => { if (!STRIP_RESPONSE.has(key.toLowerCase())) headers.append(key, value); });
  source.getSetCookie().forEach((cookie) => headers.append("set-cookie", rewriteSetCookie(cookie, serviceId, upstreamBasePath)));
  rewriteLocation(headers, origin, serviceId, upstreamBasePath);
  return headers;
}

function resolveTarget(request: NextRequest, serviceId: string, origin: string, upstreamBasePath: string) {
  const suffix = request.nextUrl.pathname.slice(`/${serviceId}`.length);
  const base = upstreamBasePath === "/" ? "" : upstreamBasePath.replace(/\/$/, "");
  const normalizedSuffix = suffix === "/" ? "" : suffix.replace(/\/$/, "");
  const path = `${base}${normalizedSuffix.startsWith("/") ? normalizedSuffix : normalizedSuffix ? `/${normalizedSuffix}` : ""}` || "/";
  const target = new URL(`${path}${request.nextUrl.search}`, origin);
  if (target.origin !== new URL(origin).origin) throw new Error("Invalid upstream target");
  return target;
}

async function handle(request: NextRequest): Promise<Response> {
  const [, serviceId = ""] = request.nextUrl.pathname.split("/");
  const service = getService(serviceId);
  if (!service) return new Response("Service not found", { status: 404 });
  const prefix = assetPrefix(service.id);
  const internalPath = request.nextUrl.pathname.slice(`/${service.id}`.length);

  if (internalPath.startsWith("/__superapp/")) {
    if (internalPath === "/__superapp/skin.css") return textResponse(UNIVERSAL_SKIN_CSS, "text/css; charset=utf-8");
    if (internalPath === "/__superapp/runtime.js") return textResponse(UNIVERSAL_SKIN_RUNTIME, "text/javascript; charset=utf-8", "public, max-age=300");
    if (internalPath === "/__superapp/font.css") return serveFontCss(prefix);
    if (internalPath.startsWith("/__superapp/font/")) return serveFontFile(internalPath.slice("/__superapp/font/".length));
    return new Response("Not found", { status: 404 });
  }

  let target: URL;
  try { target = resolveTarget(request, service.id, service.origin, service.upstreamBasePath); }
  catch { return new Response("Invalid upstream target", { status: 400 }); }

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!STRIP_REQUEST.has(lower) && !lower.startsWith("x-vercel-")) headers.set(key, value);
  });
  headers.set("x-forwarded-host", request.headers.get("host") ?? request.nextUrl.host);
  headers.set("x-forwarded-proto", request.nextUrl.protocol.replace(":", ""));

  const cacheKey = service.skinEnabled && request.method === "GET" && /(?:^|\/)\_next\/static\/.+\.css$/i.test(target.pathname) ? `${service.id}:${target.href}` : null;
  if (cacheKey) {
    const cached = cssCache.get(cacheKey);
    if (cached !== undefined) return textResponse(cached, "text/css; charset=utf-8", "public, max-age=300, s-maxage=600");
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  let upstream: Response;
  try {
    upstream = await fetch(target, { method: request.method, headers, body: hasBody ? request.body : undefined, redirect: "manual", signal: controller.signal, ...(hasBody ? { duplex: "half" } : {}) } as RequestInit);
  } catch (error) {
    const timedOut = controller.signal.aborted;
    console.error(`[${service.id}-gateway] ${request.method} ${target.href} failed`, error);
    return new Response(`${service.name} ${timedOut ? "tidak merespons (timeout)" : "tidak dapat dihubungi"}.`, { status: timedOut ? 504 : 502, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
  } finally { clearTimeout(timeout); }

  const out = copyResponseHeaders(upstream.headers, service.id, service.origin, service.upstreamBasePath);
  const contentType = upstream.headers.get("content-type") ?? "";
  const noBody = request.method === "HEAD" || [101, 204, 205, 304].includes(upstream.status);

  if (!noBody && service.skinEnabled && /^text\/css\b/i.test(contentType)) {
    const css = transformCss(await upstream.text());
    if (cacheKey) {
      if (cssCache.size >= CSS_CACHE_MAX) cssCache.delete(cssCache.keys().next().value!);
      cssCache.set(cacheKey, css);
    }
    return textResponse(css, "text/css; charset=utf-8", "public, max-age=300, s-maxage=600");
  }
  if (!noBody && service.skinEnabled && /^text\/html\b/i.test(contentType)) {
    const html = transformHtml(await upstream.text(), true, prefix, service.id);
    out.delete("etag");
    out.delete("last-modified");
    out.set("cache-control", "private, no-cache");
    return new Response(html, { status: upstream.status, statusText: upstream.statusText, headers: out });
  }
  return new Response(noBody ? null : upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: out });
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE, handle as HEAD, handle as OPTIONS };
