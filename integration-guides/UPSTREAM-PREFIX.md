# Penyesuaian upstream untuk subpath

Gateway mempertahankan prefix pada destination. Aplikasi upstream perlu melayani path dengan prefix ini.

## SISKA (Next.js)

Pada `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/siska",
};

export default nextConfig;
```

Build dan deploy ulang SISKA. Periksa semua URL absolut, callback autentikasi, API route, dan link yang ditulis manual. `basePath` Next.js diterapkan saat build.

## CampusFix (Vite)

Pada `vite.config.ts`:

```ts
import { defineConfig } from "vite";

export default defineConfig({
  base: "/campusfix/",
});
```

Periksa konfigurasi React Router (jika digunakan), URL asset absolut, API base URL, dan redirect OAuth.

## SukaKetemu

Jika menggunakan Vite:

```ts
export default defineConfig({
  base: "/sukaketemu/",
});
```

Jika PWA:
- `start_url` dan `scope` pada manifest harus berada di `/sukaketemu/`.
- Service Worker harus didaftarkan dengan scope `/sukaketemu/`.
- Pastikan asset precache memakai prefix yang benar.
- Jangan biarkan Service Worker mengontrol `/` karena dapat mengganggu portal.

## Uji wajib

- Buka halaman awal masing-masing prefix.
- Refresh halaman dalam (deep link).
- Periksa CSS, JavaScript, gambar, font, dan favicon.
- Periksa API request dan upload.
- Uji login, logout, callback, dan redirect.
- Uji PWA install/offline untuk SukaKetemu.
- Pastikan deployment lama di domain upstream tetap berjalan.
