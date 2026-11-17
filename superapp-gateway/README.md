# Super App Gateway

Gateway Vercel untuk meneruskan request ke portal dan tiga aplikasi upstream.

## Sebelum deploy

Edit `vercel.json`:
- Ganti `https://YOUR-PORTAL.vercel.app/` dengan URL deployment portal.
- Domain upstream SISKA, CampusFix, dan SukaKetemu sudah diisi sesuai domain aktif yang diberikan.

Hubungkan domain custom Super App hanya ke project gateway. Gateway meneruskan `/` ke portal dan prefix aplikasi ke deployment upstream.

## Prefix

Konfigurasi meneruskan `/siska/...` ke upstream `/siska/...`, demikian pula aplikasi lainnya. Upstream harus dikonfigurasi dengan base path yang sesuai. Lihat `../integration-guides/UPSTREAM-PREFIX.md`.

Deploy aplikasi gateway sebagai project Vercel terpisah dengan Root Directory `superapp-gateway`.
