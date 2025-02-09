import { AuthProvider } from "@/context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white">Painel de Controle</nav>
        <main className="container mx-auto p-4">{children}</main>
      </div>
    </AuthProvider>
  );
}
