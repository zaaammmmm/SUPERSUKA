
# Super App Starter

Starter untuk menguji portal Super App dan Vercel gateway. Tiga aplikasi tetap berada di repository dan deployment masing-masing.

## Isi ZIP

- `superapp-portal/`: Next.js 15 + Auth0 SDK v4, UI sederhana, daftar aplikasi.
- `superapp-gateway/`: konfigurasi Vercel rewrites untuk tiga deployment aktif.
- `integration-guides/`: konfigurasi prefix yang perlu diterapkan pada aplikasi yang sudah ada.

## Domain upstream yang digunakan

- SISKA: https://siska.vercel.app
- CampusFix: https://campusfix.vercel.app
- SukaKetemu: https://sukaketemu.vercel.app

## 1. Jalankan portal secara lokal

```bash
cd superapp-portal
cp .env.example .env.local
npm install
npm run dev
```

Buka http://localhost:3000.

Portal dapat menampilkan halaman dan tautan aplikasi tanpa Auth0. Untuk mengaktifkan login, isi variabel Auth0 di `.env.local` dan daftarkan callback lokal di Auth0.

## 2. Konfigurasi Auth0

Buat aplikasi Auth0 bertipe **Regular Web Application**. Isi:

- Allowed Callback URLs: `http://localhost:3000/auth/callback`
- Allowed Logout URLs: `http://localhost:3000`
- Allowed Web Origins: `http://localhost:3000`

Isi `.env.local`:
- `APP_BASE_URL=http://localhost:3000`
- `AUTH0_DOMAIN=tenant-kamu.auth0.com`
- `AUTH0_CLIENT_ID=...`
- `AUTH0_CLIENT_SECRET=...`
- `AUTH0_SECRET=` secret acak minimal 32 karakter

Buat secret dengan:
```bash
openssl rand -hex 32
```

Untuk produksi, ganti URL localhost dengan domain portal yang sebenarnya dan masukkan environment variables melalui Vercel. Jangan commit `.env.local`.

## 3. Gateway

`superapp-gateway/vercel.json` memakai **prefix-preserving rewrite**. Contoh `/siska/dashboard` diteruskan ke `https://siska.vercel.app/siska/dashboard`.

Ini berarti aplikasi upstream wajib disiapkan untuk prefix:
- SISKA: Next.js `basePath: "/siska"`
- CampusFix: Vite `base: "/campusfix/"`
- SukaKetemu: sesuaikan `base` framework menjadi `/sukaketemu/`

Panduan konfigurasi ada di `integration-guides/`.

Deploy folder `superapp-gateway` sebagai project Vercel terpisah. Hubungkan domain custom Super App ke project gateway. Root `/` tidak ditangani oleh gateway; root domain perlu diarahkan ke project portal melalui konfigurasi domain/deployment yang sesuai.

### Penting tentang portal dan gateway

Vercel satu domain tidak bisa secara bersamaan terpasang sebagai primary domain ke dua project terpisah. Untuk model dua project, gunakan salah satu pendekatan:
1. **Untuk percobaan ini:** deploy portal dan gateway sebagai dua project Vercel. Jadikan gateway sebagai satu-satunya project yang memegang domain custom. Rewrite `/` pada gateway meneruskan halaman utama ke deployment portal.
2. Alternatifnya, gabungkan konfigurasi rewrites ke project portal dan gunakan satu project Vercel saja.

Contoh `vercel.json` gateway sudah menyertakan rewrite root ke `https://YOUR-PORTAL.vercel.app/`. Ganti `YOUR-PORTAL` dengan hostname deployment portal yang sebenarnya sebelum deploy.

## 4. Batasan penting

- ZIP ini tidak berisi source SISKA, CampusFix, atau SukaKetemu; hanya konfigurasi integrasi dan panduannya.
- Rewrite saja tidak otomatis membuat aplikasi kompatibel dengan subpath. Base path, asset, API endpoint, redirect, auth callback, cookie, dan PWA service worker harus diuji.
- Auth0 pada portal **belum** membuat sesi Firebase atau Supabase. Federasi Auth0 → Firebase dan Auth0 → Supabase adalah tahap integrasi terpisah.
- Jangan menganggap autentikasi portal sebagai otorisasi aplikasi. Setiap aplikasi tetap wajib memvalidasi sesi dan role lokalnya.
- Uji di domain staging terlebih dahulu. Jangan mengubah domain produksi sebelum semua alur lolos pengujian.
