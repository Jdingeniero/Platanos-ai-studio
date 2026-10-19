import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export function Contacto() {
  usePageMeta(
    'Contacto | Plátanos del Norte S.L.',
    'Contacto directo y atención comercial: info@platanosdelnorte.es. Polígono Candina, Santander.',
    '/contacto'
  );

  return (
    <div className="py-12 px-6 max-w-5xl mx-auto space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold">Contacto Corporativo</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Sede Central y Almacenes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-600">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block text-sm">Dirección de Instalaciones:</strong>
              <span>Polígono Industrial Candina, Nave 14</span>
              <span className="block">39011 Santander, Cantabria</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block text-sm">Centralita:</strong>
              <span>+34 942 88 19 40</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block text-sm">Correo Electrónico:</strong>
              <span>info@platanosdelnorte.es</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <h3 className="font-bold text-slate-900 text-sm">Datos Fiscales</h3>
          <p><strong>Razón Social:</strong> Plátanos del Norte S.L.</p>
          <p><strong>NIF / CIF:</strong> B-39824102</p>
          <p><strong>Registro Mercantil:</strong> Cantabria, Tomo 1092, Folio 84, Hoja S-28190</p>
        </div>
      </div>
    </div>
  );
}
