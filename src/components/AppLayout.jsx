import Header from "./Header";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
