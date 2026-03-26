import Link from 'next/link';
import { LayoutDashboard, Users, Package, FileText } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-gray-900 text-white">
          <h1 className="text-xl font-bold tracking-tight">Admin | Funeraria</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/catalogo" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors">
            <Package className="w-5 h-5" />
            <span className="font-medium">Catálogo</span>
          </Link>
          <Link href="/admin/proveedores" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Proveedores</span>
          </Link>
          <Link href="/admin/servicios" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Servicios</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
