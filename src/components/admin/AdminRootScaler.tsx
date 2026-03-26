"use client";

import { useEffect } from "react";

export default function AdminRootScaler() {
  useEffect(() => {
    // Escala matemáticamente todos los 'rem' de Tailwind a un 80% (12.8px base) 
    // Logrando un aspecto táctico, compacto y ejecutivo de alta densidad.
    document.documentElement.style.fontSize = "80%";
    
    return () => {
      // Restaura la vista de Marketing/ClientPortal al destruir este layout
      document.documentElement.style.fontSize = "100%";
    };
  }, []);

  return null;
}
