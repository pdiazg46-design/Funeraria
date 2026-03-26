import ClientPortal from '@/components/ClientPortal';

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center selection:bg-amber-500/30">
      
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0">
        {/* Background Image: Abstract solemn/elegant dark marble or floral texture */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
        {/* Dark elegant gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/95 to-slate-950"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-[95%] xl:max-w-screen-2xl mx-auto px-2 py-4 md:py-6 flex flex-col items-center">
        
        {/* Solemn Header - Compacted */}
        <div className="text-center mb-4 animate-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-[9px] sm:text-[10px] font-medium tracking-widest uppercase mb-2">
            Plataforma Operativa
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-2 tracking-tight drop-shadow-lg">
            Asistencia <span className="italic text-slate-300">Integral</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-xs md:text-sm leading-relaxed font-light hidden sm:block">
            Acompañamiento experto y respetuoso. Gestione logística y servicios sin contratiempos.
          </p>
        </div>

        {/* Formulario / Cotizador */}
        <div className="w-full">
          <ClientPortal />
        </div>

      </div>
      
      {/* Footer minimalista */}
      <footer className="relative z-10 pb-8 pt-12 text-slate-600 text-xs text-center font-light">
        © {new Date().getFullYear()} Plataforma de Corretaje Funerario. Sistema encriptado de punta a punta.
      </footer>
    </main>
  );
}
