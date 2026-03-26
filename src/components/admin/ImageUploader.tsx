"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";

export default function ImageUploader({ defaultValue = "" }: { defaultValue?: string }) {
  const [preview, setPreview] = useState(defaultValue);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Redimensionamiento inteligente a 800px máximo para mantener bases de datos ligeras
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 800;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Exportamos a Base64 con calidad al 70%
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setPreview(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full flex items-end">
      <input type="hidden" name="imagenUrl" value={preview} />
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-slate-700/80 rounded-xl bg-slate-950 hover:bg-slate-900 hover:border-amber-500 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[95px] relative overflow-hidden group"
      >
        {preview ? (
          <img src={preview} alt="Vista previa" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
        ) : null}
        
        <div className="relative z-10 flex flex-col items-center gap-1.5 p-2 rounded-lg">
          <Upload className="w-4 h-4 text-amber-500" />
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">
            {preview ? "CAMBIAR FOTO" : "SUBIR FOTO"}
          </span>
        </div>
      </div>
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImageChange} 
      />
    </div>
  );
}
