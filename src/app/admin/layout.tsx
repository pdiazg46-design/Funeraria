import Link from 'next/link';
import { LayoutDashboard, Users, Package, FileText } from 'lucide-react';
import AdminRootScaler from '@/components/admin/AdminRootScaler';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30">
      <AdminRootScaler />
      {/* Sidebar - Compacted */}
      <aside className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950 text-white">
          <h1 className="text-xl font-serif text-amber-500 tracking-wide">Admin | Funeraria</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium tracking-wide">Dashboard</span>
          </Link>
          <Link href="/admin/catalogo" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors">
            <Package className="w-5 h-5" />
            <span className="font-medium tracking-wide">Catálogo</span>
          </Link>
          <Link href="/admin/proveedores" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium tracking-wide">Proveedores</span>
          </Link>
          <Link href="/admin/servicios" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium tracking-wide">Servicios</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950 relative">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-amber-900/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="p-4 md:p-8 relative z-10 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
