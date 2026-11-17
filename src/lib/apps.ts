import type { App } from "@/types/app";

export const apps: App[] = [
  {
    id: "siska",
    name: "SISKA",
    description: "Sistem Informasi Pengaduan Kekerasan Seksual",
    href: "/siska",
    category: "Pelaporan",
    status: "active",
    authProvider: "firebase",
    externalUrl: "https://siska-theta.vercel.app",
  },
  {
    id: "campusfix",
    name: "CampusFix",
    description: "Pelaporan kerusakan dan kebutuhan fasilitas kampus",
    href: "/campusfix",
    category: "Fasilitas Kampus",
    status: "active",
    authProvider: "supabase",
    externalUrl: "https://campusfix.vercel.app",
  },
  {
    id: "sukaketemu",
    name: "SukaKetemu",
    description: "Informasi barang hilang dan ditemukan",
    href: "/sukaketemu",
    category: "Lost & Found",
    status: "active",
    authProvider: "supabase",
    externalUrl: "https://sukaketemu.vercel.app",
  },
];
