import "@/styles/globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-lavender-card">
      <header className="border-b border-ink/10 px-6 py-4">
        <p className="font-display text-lg text-ink">Admin Panel</p>
      </header>
      {children}
    </div>
  );
}
