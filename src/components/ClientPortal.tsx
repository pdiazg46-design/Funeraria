"use client";

import React, { useState } from 'react';
import { User, MapPin, Box, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import { regionesChile, comunasChile } from '../data/geografia';

interface AtaudDB { id: number; nombre: string; material: string; precioBaseCLP: number; imagenUrl: string | null; }

export default function ClientPortal({ catalogos = [] }: { catalogos?: AtaudDB[] }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    contactoNombre: '', contactoTel: '+56 ', contactoEmail: '',
    difuntoNombre: '', difuntoRut: '', prevision: '', afp: '',
    origenRegion: '', origen: '',
    destino1Region: '', destino1: '',
    destino2Region: '', destino2: '',
    origenCalle: '', origenNumero: '', origenVilla: '',
    destino1Calle: '', destino1Numero: '', destino1Villa: '',
    destino2Calle: '', destino2Numero: '', destino2Villa: '',
    ataudSeleccionado: null as number | null
  });

  const getImagenParaAtaud = (nombre: string) => {
    const n = nombre.toUpperCase();
    if (n.includes('BÁSICO') || n.includes('BASICO') || n.includes('PARVULO') || n.includes('PÁRVULO')) return '/Plan Básico.jpeg';
    if (n.includes('PREMIUM') || n.includes('PLAN III')) return '/Plan III.jpeg';
    if (n.includes('CLÁSICA') || n.includes('CLASICA') || n.includes('PLAN II')) return '/Plan II.jpeg';
    if (n.includes('PLAN I')) return '/Plan I.jpeg';
    return '/Plan II.jpeg'; // fallback elegante
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => Math.max(1, prev - 1));

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9kK]/g, '').toUpperCase();
    if (value.length > 1) {
      const dv = value.slice(-1);
      const rut = value.slice(0, -1);
      value = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
    }
    setFormData({ ...formData, difuntoRut: value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^\d+]/g, '');
    if (!input.startsWith('+56')) input = '+56 ' + input.replace(/\+/g, '');
    let digits = input.replace(/\D/g, '');
    if (digits.startsWith('56')) digits = digits.substring(2);
    let formatted = '+56';
    if (digits.length > 0) formatted += ' ' + digits.substring(0, 1);
    if (digits.length > 1) formatted += ' ' + digits.substring(1, 5);
    if (digits.length > 5) formatted += ' ' + digits.substring(5, 9);
    setFormData({ ...formData, contactoTel: formatted });
  };

  const StepperIcon = ({ icon: Icon, active, completed }: any) => (
    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 border
      ${completed ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 
        active ? 'bg-slate-800 border-amber-500/30 text-white shadow-[0_0_10px_rgba(245,158,11,0.25)]' : 
        'bg-slate-900/50 border-slate-700/50 text-slate-600'}`}>
      {completed ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
    </div>
  );

  return (
    <div className="glass-panel w-full rounded-[1.5rem] p-3 md:p-5 relative overflow-hidden flex flex-col justify-between max-h-[85vh]">
      
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/5 blur-[80px] rounded-full pointer-events-none"></div>

      {/* Stepper Superior Ultra-Compacto */}
      <div className="flex justify-between items-center mb-4 relative z-10 w-full max-w-4xl mx-auto">
        <div className="absolute left-10 right-10 top-1/2 h-[2px] bg-slate-800/80 -z-10 -translate-y-1/2 hidden sm:block"></div>
        {[
          { icon: User, label: "Contacto" },
          { icon: ShieldCheck, label: "Fallecido" },
          { icon: MapPin, label: "Logística" },
          { icon: Box, label: "Catálogo" }
        ].map((item, i) => {
          const stepNum = i + 1;
          const active = stepNum === step;
          const completed = stepNum < step;
          return (
            <div key={i} className="flex flex-col items-center gap-1 bg-[#0a0f1c] sm:bg-transparent px-2">
              <StepperIcon icon={item.icon} active={active} completed={completed} />
              <span className={`text-[9px] md:text-[10px] uppercase tracking-wider font-bold hidden sm:block transition-colors ${active ? 'text-amber-400' : completed ? 'text-slate-400' : 'text-slate-600'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 flex-grow flex flex-col justify-center w-full">
        {step === 1 && (
          <div className="animate-in w-full max-w-5xl mx-auto">
            <div className="text-center mb-3">
              <h2 className="text-xl md:text-2xl font-serif text-white mb-0.5">Datos del Familiar</h2>
              <p className="text-slate-400 text-xs font-light">Identificación para comprobante.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-3">
                <label className="block text-[10px] md:text-xs uppercase tracking-widest text-slate-500 mb-1 font-bold">Nombre Completo</label>
                <input type="text" value={formData.contactoNombre} onChange={e => setFormData({...formData, contactoNombre: e.target.value.toUpperCase()})} className="input-premium uppercase w-full rounded-xl px-4 py-2 text-lg md:text-xl font-bold tracking-wider" placeholder="EJ. ANA SILVA" />
              </div>
              <div className="lg:col-span-1">
                <label className="block text-[10px] md:text-xs uppercase tracking-widest text-slate-500 mb-1 font-bold">Teléfono Móvil</label>
                <input type="tel" value={formData.contactoTel} onChange={handlePhoneChange} className="input-premium w-full rounded-xl px-4 py-2 text-lg md:text-xl font-bold tracking-wide" placeholder="+56 X XXXX XXXX" maxLength={16} />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-[10px] md:text-xs uppercase tracking-widest text-slate-500 mb-1 font-bold">Correo Electrónico</label>
                <input type="email" value={formData.contactoEmail} onChange={e => setFormData({...formData, contactoEmail: e.target.value.toUpperCase()})} className="input-premium uppercase w-full rounded-xl px-4 py-2 text-lg md:text-xl font-bold tracking-wider" placeholder="CORREO@EJEMPLO.COM" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in w-full max-w-5xl mx-auto">
            <div className="text-center mb-3">
              <h2 className="text-xl md:text-2xl font-serif text-white mb-0.5">Datos del Fallecido</h2>
              <p className="text-slate-400 text-xs font-light">Evaluamos cobertura para descuentos.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[10px] md:text-xs uppercase tracking-widest text-slate-500 mb-1 font-bold">Nombre Completo</label>
                <input type="text" value={formData.difuntoNombre} onChange={e => setFormData({...formData, difuntoNombre: e.target.value.toUpperCase()})} className="input-premium uppercase w-full rounded-xl px-4 py-2 text-lg md:text-xl font-bold tracking-wider" placeholder="NOMBRE DEL DIFUNTO" />
              </div>
              <div>
                <label className="block text-[10px] md:text-xs uppercase tracking-widest text-slate-500 mb-1 font-bold">RUT (Solo Números y K)</label>
                <input type="text" value={formData.difuntoRut} onChange={handleRutChange} className="input-premium uppercase w-full rounded-xl px-4 py-2 text-lg md:text-xl font-bold tracking-widest" placeholder="XX.XXX.XXX-X" maxLength={12} />
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-800">
              <label className="block text-[10px] uppercase tracking-widest text-amber-500 mb-2 text-center font-bold">Tipo de Previsión del Fallecido</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {['IPS', 'AFP', 'NINGUNA'].map((tipo) => (
                  <button 
                    key={tipo}
                    onClick={() => setFormData({...formData, prevision: tipo, afp: tipo === 'AFP' ? formData.afp : ''})}
                    className={`py-2 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1
                      ${formData.prevision === tipo 
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300 border-b-4' 
                        : 'border-slate-700 hover:border-slate-500 text-slate-400 bg-slate-900/50 hover:bg-slate-800'}`}
                  >
                    <ShieldCheck className={`w-5 h-5 md:w-6 md:h-6 ${formData.prevision === tipo ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="font-bold text-[10px] md:text-xs tracking-widest">{tipo === 'NINGUNA' ? 'PARTICULAR' : tipo}</span>
                  </button>
                ))}
              </div>

              {formData.prevision === 'AFP' && (
                <div className="animate-in fade-in mt-2 py-1.5 px-3 border border-amber-500/30 bg-amber-500/10 rounded-xl mx-auto w-full max-w-xl">
                  <select 
                    className="input-premium uppercase w-full rounded-lg px-3 py-1.5 text-sm md:text-base appearance-none font-bold text-center outline-none focus:border-amber-400 transition-colors tracking-widest"
                    value={formData.afp}
                    onChange={(e) => setFormData({...formData, afp: e.target.value.toUpperCase()})}
                  >
                    <option value="">-- SELECCIONAR INSTITUCIÓN (AFP) --</option>
                    {['CAPITAL', 'CUPRUM', 'HABITAT', 'MODELO', 'PLANVITAL', 'PROVIDA', 'UNO'].map(afp => (
                      <option key={afp} value={afp} className="text-slate-900 font-bold">AFP {afp}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in w-full">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-serif text-white mb-0.5">Logística y Traslados</h2>
              <p className="text-slate-400 text-xs font-light">Especifique ubicaciones para el kilometraje exacto.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full">
              {[
                { label: 'A. Origen', keyId: 'origen' },
                { label: 'B. Destino 1', keyId: 'destino1' },
                { label: 'C. Destino 2', keyId: 'destino2', optional: true }
              ].map((bloque, index) => (
                 <div key={index} className="px-3 py-3 border border-slate-800/80 rounded-xl bg-slate-900/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800 shrink-0">
                        <MapPin className="w-3 h-3 text-amber-500" />
                      </div>
                      <label className="block text-sm font-serif text-amber-50 truncate">{bloque.label} {bloque.optional && <span className="text-[9px] font-sans text-slate-500 uppercase ml-1 block">Opcional</span>}</label>
                    </div>
                    
                    <div className="space-y-2">
                      <select 
                        className="input-premium uppercase w-full rounded-lg px-3 py-1.5 text-xs md:text-sm appearance-none font-bold tracking-wider"
                        value={formData[(bloque.keyId + "Region") as keyof typeof formData] as string}
                        onChange={(e) => setFormData({...formData, [bloque.keyId + "Region"]: e.target.value, [bloque.keyId]: ''})}
                      >
                        <option value="" className="text-slate-900 bg-slate-100">-- SELECCIONAR REGIÓN --</option>
                        {regionesChile.map(r => <option key={r.id} value={r.id} className="text-slate-900 bg-slate-50">{r.nombre}</option>)}
                      </select>
                      <select 
                        className="input-premium uppercase w-full rounded-lg px-3 py-1.5 text-xs md:text-sm appearance-none font-bold tracking-wider disabled:opacity-50"
                        value={formData[bloque.keyId as keyof typeof formData] as string}
                        onChange={(e) => setFormData({...formData, [bloque.keyId]: e.target.value})}
                        disabled={!formData[(bloque.keyId + "Region") as keyof typeof formData]}
                      >
                        <option value="" className="text-slate-900 bg-slate-100">-- SELECCIONAR COMUNA --</option>
                        {comunasChile
                          .filter(c => c.regionId === formData[(bloque.keyId + "Region") as keyof typeof formData])
                          .map(c => <option key={c.id} value={c.id} className="text-slate-900 bg-slate-50">{c.nombre}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mt-2 space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex gap-2">
                      <input type="text" placeholder="CALLE / AVE." value={formData[(bloque.keyId + "Calle") as keyof typeof formData] as string} onChange={(e) => setFormData({...formData, [bloque.keyId + "Calle"]: e.target.value.toUpperCase()})} className="input-premium uppercase w-2/3 rounded-lg px-3 py-1.5 text-xs md:text-sm font-bold tracking-widest" />
                      <input type="text" placeholder="N°" value={formData[(bloque.keyId + "Numero") as keyof typeof formData] as string} onChange={(e) => setFormData({...formData, [bloque.keyId + "Numero"]: e.target.value.toUpperCase()})} className="input-premium uppercase w-1/3 rounded-lg px-3 py-1.5 text-xs md:text-sm text-center font-bold tracking-widest" />
                    </div>
                    <input type="text" placeholder="VILLA / REF." value={formData[(bloque.keyId + "Villa") as keyof typeof formData] as string} onChange={(e) => setFormData({...formData, [bloque.keyId + "Villa"]: e.target.value.toUpperCase()})} className="input-premium uppercase w-full rounded-lg px-3 py-1.5 text-xs md:text-sm font-bold tracking-widest" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in w-full">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-serif text-white mb-0.5">Selección de Urna</h2>
              <p className="text-slate-400 text-xs font-light">Sujeto a descuentos previsionales.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {catalogos.length === 0 && (
                <div className="col-span-3 text-center py-10 text-slate-500 text-sm">
                  Cargando catálogo en tiempo real...
                </div>
              )}
              {catalogos.map(ataud => (
                <div 
                  key={ataud.id} 
                  onClick={() => setFormData({...formData, ataudSeleccionado: ataud.id})}
                  className={`group relative rounded-xl border-2 p-2 cursor-pointer transition-all duration-300 overflow-hidden
                    ${formData.ataudSeleccionado === ataud.id 
                      ? 'border-amber-500 bg-slate-900 shadow-[0_10px_20px_-10px_rgba(245,158,11,0.4)]' 
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'}`}
                >
                  <div className="h-24 md:h-32 w-full mb-2 rounded-lg overflow-hidden relative border border-slate-700/50">
                    <img src={ataud.imagenUrl || getImagenParaAtaud(ataud.nombre)} alt={ataud.nombre} className={`w-full h-full object-cover transition-transform duration-1000 ${formData.ataudSeleccionado === ataud.id ? 'scale-110' : 'group-hover:scale-105 opacity-80'}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  </div>
                  
                  <div className="relative z-10 px-2 pb-1 text-center">
                    <h4 className="font-serif text-sm md:text-base text-white mb-0.5 uppercase tracking-wide">{ataud.nombre}</h4>
                    <p className="text-amber-500 font-bold text-lg md:text-xl mb-2 tracking-widest">${ataud.precioBaseCLP.toLocaleString('es-CL')}</p>
                    
                    <div className="flex flex-wrap justify-center gap-1">
                      <span className="px-2 py-0.5 bg-slate-950 border border-slate-700 rounded-md text-[8px] text-slate-300 uppercase tracking-widest font-bold">
                        {ataud.material}
                      </span>
                    </div>
                  </div>

                  {formData.ataudSeleccionado === ataud.id && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 p-1 rounded-full z-20">
                      <Check className="w-3 h-3 font-bold" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global Nav Bottom Ultra-Compacto */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 relative z-20">
        <button 
          onClick={handleBack} 
          className={`px-4 py-2 md:px-5 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          ← VOLVER
        </button>
        
        <button 
          onClick={step < 4 ? handleNext : () => alert('Confirmado al Servidor')} 
          className={`px-6 py-2 md:px-8 md:py-3 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center gap-2
            ${step === 4 
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30' 
              : 'bg-white hover:bg-slate-200 text-slate-900 shadow-white/10'}`}
        >
          {step < 4 ? 'CONTINUAR' : 'PROCESAR SOLICITUD'}
          {step < 4 && <ChevronRight className="w-4 h-4 opacity-80" />}
        </button>
      </div>

    </div>
  );
}
