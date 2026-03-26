"use client";

import React, { useState, useEffect } from 'react';

interface CurrencyInputProps {
  name: string;
  defaultValue?: string | number;
  placeholder?: string;
  className?: string;
}

export default function CurrencyInput({ name, defaultValue, placeholder, className }: CurrencyInputProps) {
  const formatCurrency = (val: string | number) => {
    if (val === undefined || val === null) return "";
    const clean = String(val).replace(/\D/g, "");
    if (!clean) return "";
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const [val, setVal] = useState(formatCurrency(defaultValue || ""));

  // Sincronizar si cambia el defaultValue remotamente (ej. al seleccionar otro item para editar)
  useEffect(() => {
    setVal(formatCurrency(defaultValue || ""));
  }, [defaultValue]);

  return (
    <input
      type="text"
      name={name}
      value={val}
      onChange={(e) => setVal(formatCurrency(e.target.value))}
      placeholder={placeholder}
      className={className}
      required
      autoComplete="off"
    />
  );
}
