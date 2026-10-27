import React from 'react';
import { usePageMeta } from '../hooks/usePageMeta';

export function Instalaciones() {
  usePageMeta(
    'Instalaciones | Plátanos del Norte S.L.',
    'Naves de maduración con atmósfera controlada de etileno e instalaciones industriales en Santander.',
    '/instalaciones'
  );

  return (
    <div className="py-12 px-6 max-w-5xl mx-auto space-y-8"><img src="/Platanos-ai-studio/nave_maduracion_candina.svg" alt="Nave de maduracion - Poligono Candina" className="w-full rounded-lg border border-slate-200" />
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold">Instalaciones Industriales</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Naves Candina: Maduración de Atmósfera Controlada</h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Ubicadas en el Polígono Industrial Candina (Nave 14), 39011 Santander. Nuestras instalaciones cuentan con 8 cámaras estancas aisladas con paneles sándwich de 100 mm de poliuretano.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="p-6 border border-slate-200 rounded-xl space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Control Automatizado SCADA</h3>
          <p className="text-slate-600 leading-relaxed">
            Inyección de gas etileno a 1000 ppm regulado electrónicamente. Medición continua de CO2, humedad y temperatura de pulpa de fruta con sensores Siemens conectados en subred interna (10.0.4.12:102).
          </p>
        </div>

        <div className="p-6 border border-slate-200 rounded-xl space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Servidores Locales y Almacenamiento</h3>
          <p className="text-slate-600 leading-relaxed">
            Supervisado por el departamento de sistemas IT (Carlos Mendizábal). Registro y copias de seguridad de parámetros de maduración en almacenamiento centralizado NAS Synology (192.168.10.45).
          </p>
        </div>
      </div>
    </div>
  );
}
