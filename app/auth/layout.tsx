export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-br from-[#1a1d2e] via-[#272a41] to-[#1a1d2e]">
      <main className="flex-1">{children}</main>
    </div>
  );
}
