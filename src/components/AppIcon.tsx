const paths: Record<string, React.ReactNode> = {
  // Perisai: pelaporan yang aman
  siska: <><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></>,
  // Kunci pas: perbaikan fasilitas
  campusfix: <><path d="M14.5 6.2a4.5 4.5 0 005.3 5.3l-8.7 8.7a2.2 2.2 0 01-3.1-3.1l8.7-8.7a4.5 4.5 0 00-5.3-5.3l2.2 2.2-.8 2.7-2.7.8-2.2-2.2a4.5 4.5 0 006.6-.4z" /></>,
  // Kaca pembesar: barang hilang dan ditemukan
  sukaketemu: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="M16 16l4.5 4.5M8 10.8h5.6M10.8 8v5.6" /></>,
};

const fallback = <path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z" />;

export default function AppIcon({ id, size = 22 }: { id: string; size?: number }) {
  return (
    <span className="app-icon" aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {paths[id] ?? fallback}
      </svg>
    </span>
  );
}
