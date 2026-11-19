export interface ServiceDefinition {
  id: string;
  name: string;
  origin: string;
  /** Path prefix on the upstream. SISKA currently serves the app below /siska. */
  upstreamBasePath: string;
  enabled: boolean;
  skinEnabled: boolean;
}

const cleanOrigin = (value: string | undefined, fallback: string) =>
  (value || fallback).replace(/\/+$/, "");

/** Only explicitly registered upstreams can be reached through the gateway. */
const GLOBAL_SKIN_ENABLED = process.env.SUPERAPP_SKIN !== "off";

export const SERVICE_REGISTRY: Record<string, ServiceDefinition> = {
  siska: {
    id: "siska",
    name: "SISKA",
    origin: cleanOrigin(process.env.SISKA_ORIGIN, "https://siska-theta.vercel.app"),
    upstreamBasePath: "/siska",
    enabled: true,
    skinEnabled: GLOBAL_SKIN_ENABLED,
  },
  campusfix: {
    id: "campusfix",
    name: "CampusFix",
    origin: cleanOrigin(process.env.CAMPUSFIX_ORIGIN, "https://campusfix.vercel.app"),
    upstreamBasePath: process.env.CAMPUSFIX_BASE_PATH || "/campusfix",
    enabled: true,
    skinEnabled: GLOBAL_SKIN_ENABLED,
  },
  sukeketemu: {
    id: "sukeketemu",
    name: "SukaKetemu",
    origin: cleanOrigin(process.env.SUKAKETEMU_ORIGIN, "https://sukeketemu.vercel.app"),
    upstreamBasePath: process.env.SUKAKETEMU_BASE_PATH || "/sukeketemu",
    enabled: true,
    skinEnabled: GLOBAL_SKIN_ENABLED,
  },
  archive: {
    id: "archive",
    name: "Archive System",
    origin: cleanOrigin(process.env.ARCHIVE_ORIGIN, ""),
    upstreamBasePath: process.env.ARCHIVE_BASE_PATH || "/",
    enabled: Boolean(process.env.ARCHIVE_ORIGIN),
    skinEnabled: GLOBAL_SKIN_ENABLED,
  },
  paas: {
    id: "paas",
    name: "PaaS Praktikum",
    origin: cleanOrigin(process.env.PAAS_ORIGIN, ""),
    upstreamBasePath: process.env.PAAS_BASE_PATH || "/",
    enabled: Boolean(process.env.PAAS_ORIGIN),
    skinEnabled: GLOBAL_SKIN_ENABLED,
  },
};

export function getService(id: string): ServiceDefinition | null {
  const service = SERVICE_REGISTRY[id.toLowerCase()];
  return service?.enabled ? service : null;
}
