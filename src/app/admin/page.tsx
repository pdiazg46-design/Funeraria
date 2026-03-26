export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-3xl font-serif mb-8 text-white tracking-wide">Panel de Mando Operacional</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Servicios Activos</h3>
          <p className="text-4xl font-bold text-amber-500">0</p>
          <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors"></div>
        </div>
        <div className="p-6 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Proveedores</h3>
          <p className="text-4xl font-bold text-white">0</p>
        </div>
        <div className="p-6 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Productos de Catálogo</h3>
          <p className="text-4xl font-bold text-white">0</p>
        </div>
      </div>
    </div>
  );
}
