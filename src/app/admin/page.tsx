export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-serif mb-8 text-slate-900 tracking-wide">Panel de Mando Operacional</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:border-amber-400 transition-colors">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Servicios Activos</h3>
          <p className="text-4xl font-bold text-amber-500">0</p>
          <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-colors"></div>
        </div>
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:border-amber-400 transition-colors">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Proveedores</h3>
          <p className="text-4xl font-bold text-slate-900">0</p>
        </div>
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:border-amber-400 transition-colors">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Productos de Catálogo</h3>
          <p className="text-4xl font-bold text-slate-900">0</p>
        </div>
      </div>
    </div>
  );
}
