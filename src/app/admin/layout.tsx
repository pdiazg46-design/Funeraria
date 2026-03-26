import Link from 'next/link';
import { LayoutDashboard, Users, Package, FileText, Settings, ShieldCheck } from 'lucide-react';
import AdminRootScaler from '@/components/admin/AdminRootScaler';
import LogoutButton from '@/components/admin/LogoutButton';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const rol = (session?.user as any)?.rol;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30">
      <AdminRootScaler />
      
      {/* Sidebar - Compacted */}
      <aside className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950 text-white">
          <ShieldCheck className="w-5 h-5 text-amber-500 mr-2" />
          <h1 className="text-sm font-serif font-black tracking-widest pl-2">B&D ADMIN</h1>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {/* Admin / Super Admin general links */}
          {(rol === 'SUPER_ADMIN' || rol === 'ADMINISTRADOR') && (
            <>
              <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors font-bold uppercase tracking-widest text-xs">
                <LayoutDashboard className="w-4 h-4" /> Inicio
              </Link>
              <Link href="/admin/servicios" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors font-bold uppercase tracking-widest text-xs">
                <FileText className="w-4 h-4" /> Servicios
              </Link>
              <Link href="/admin/catalogo" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors font-bold uppercase tracking-widest text-xs">
                <Package className="w-4 h-4" /> Catálogo
              </Link>
              <Link href="/admin/proveedores" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors font-bold uppercase tracking-widest text-xs">
                <Users className="w-4 h-4" /> Proveedores
              </Link>
            </>
          )}

          {/* Provider restricted view */}
          {rol === 'PROVEEDOR' && (
            <Link href="/admin/servicios" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors font-bold uppercase tracking-widest text-xs">
              <FileText className="w-4 h-4" /> Mis Asignaciones
            </Link>
          )}
          
          {/* User Management View */}
          {rol === 'SUPER_ADMIN' && (
            <Link href="/admin/usuarios" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors font-bold uppercase tracking-widest text-xs mt-6 border-t border-slate-800/50 pt-4">
              <Settings className="w-4 h-4" /> Accesos & Staff
            </Link>
          )}
        </nav>
        
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="mb-4 px-3">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sesión Actual</p>
            <p className="text-[10px] font-mono font-bold text-amber-500 truncate mt-1">{session?.user?.email}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 relative">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-amber-900/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 w-full">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
