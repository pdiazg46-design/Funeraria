import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createUsuario, deleteUsuario } from "./actions";
import { UserPlus, Trash2, ShieldCheck, Truck, ShieldAlert, Briefcase } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function UsuariosPage() {
  const session = await getServerSession(authOptions);
  
  // Protección RBAC estricta: Solo Super Admins
  if ((session?.user as any)?.rol !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const usuarios = await prisma.usuario.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      rol: { not: "CLIENTE" } // No mostramos los clientes aquí, solo staff
    }
  });

  const getRoleIcon = (rol: string) => {
    switch(rol) {
      case 'SUPER_ADMIN': return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'ADMINISTRADOR': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'PROVEEDOR': return <Truck className="w-4 h-4 text-amber-400" />;
      case 'PROVEEDOR_FUNERARIA': return <Briefcase className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-serif text-slate-900 tracking-wide">Gestión de Accesos (Staff)</h2>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg md:text-xl font-serif text-amber-500 mb-6 flex items-center gap-2">
          <UserPlus className="w-5 h-5"/> Registrar Nuevo Personal
        </h3>
        
        <form action={createUsuario} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Nombre</label>
            <input required type="text" name="nombre" className="w-full border-slate-300 shadow-inner rounded-xl p-3 bg-slate-50 border focus:border-amber-500 text-slate-900 focus:outline-none text-sm" placeholder="Juan Pérez" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Correo (Login)</label>
            <input required type="email" name="email" className="w-full border-slate-300 shadow-inner rounded-xl p-3 bg-slate-50 border focus:border-amber-500 text-slate-900 focus:outline-none text-sm" placeholder="juan@empresa.cl" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Contraseña</label>
            <input required type="text" name="password" className="w-full border-slate-300 shadow-inner rounded-xl p-3 bg-slate-50 border focus:border-amber-500 text-slate-900 focus:outline-none font-mono text-xs" placeholder="clave123" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Nivel de Acceso</label>
            <select name="rol" className="w-full border-slate-300 shadow-inner rounded-xl p-3 bg-slate-50 border focus:border-amber-500 text-slate-900 focus:outline-none font-bold text-xs uppercase tracking-widest">
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="PROVEEDOR">Proveedor (Chofer)</option>
              <option value="PROVEEDOR_FUNERARIA">Proveedor Funeraria</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          <div className="md:col-span-1">
             <button type="submit" className="w-full bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 h-12 font-bold uppercase tracking-widest text-[10px] shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <UserPlus className="w-4 h-4" /> Registrar
              </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="table-fixed w-full divide-y divide-slate-100 min-w-[700px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest w-1/3">Usuario</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest w-1/3">Correo</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest w-1/4">Rol Asignado</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest w-24">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {usuarios.map((u: any) => {
                const action = deleteUsuario.bind(null, u.id);
                return (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-slate-900 truncate">{u.nombre || 'Sin Nombre'}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono truncate">{u.email}</td>
                  <td className="px-6 py-4 truncate">
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                       {getRoleIcon(u.rol)}
                       {u.rol.replace('_', ' ')}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs">
                    {u.email !== session?.user?.email && (
                      <form action={action}>
                        <button type="submit" className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Revocar Acceso">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
