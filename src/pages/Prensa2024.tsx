import React from 'react';
import { Newspaper, Calendar, Award, CheckCircle, Tag } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export function Prensa2024() {
  usePageMeta(
    'Sala de prensa 2024 | Plátanos del Norte S.L.',
    'Comunicados oficiales, notas de prensa y convenios agrícolas de Plátanos del Norte S.L. durante el ejercicio 2024.',
    '/prensa-2024'
  );

  return (
    <div className="py-12 px-6 max-w-5xl mx-auto space-y-10">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-800 font-bold">
          <Newspaper className="w-4 h-4" />
          <span>Gabinete de Comunicación</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Sala de Prensa y Comunicados Oficiales 2024</h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Histórico de notas de prensa, reconocimientos institucionales y acuerdos con cooperativas agrícolas de Gran Canaria.
        </p>
      </div>

      <div className="space-y-6">
        <article className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Calendar className="w-3.5 h-3.5" /> 14 de Febrero de 2024
            </span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Nota Oficial N-04/24</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Plátanos del Norte S.L. amplía su capacidad de maduración controlada en el Polígono Candina
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            La cooperativa ha completado la actualización técnica de su sistema SCADA en las Cámaras 3 y 4 de maduración en Santander. El nuevo sistema permite un control micrométrico del flujo de etileno para asegurar que cada piña de plátano con IGP procedente del norte de Gran Canaria madure con los estándares óptimos de azúcares y consistencia.
          </p>
        </article>

        <article className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Calendar className="w-3.5 h-3.5" /> 22 de Enero de 2024
            </span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Convenio Agrícola</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Firma del acuerdo de comercialización preferente con agricultores de Gáldar y Arucas
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Se ha ratificado el calendario de cortes y transporte marítimo refrigerado semanal con la naviera Armas-Trasmediterránea, conectando el Puerto de Las Palmas con el Puerto de Santander en 84 horas de travesía.
          </p>
        </article>
      </div>

      {/* Corporate Metadata & Discreet Flag as requested: FLAG-D1-SITE-MAPPED */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-mono">
          <span>Contacto de prensa: comunicacion@platanosdelnorte.es</span>
          <span>·</span>
          <span className="text-slate-400 text-[11px]" title="Identificador sitemap">
            Ref: <span className="text-slate-500 font-bold select-all">FLAG-D1-SITE-MAPPED</span>
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Índice sitemap.xml verificado
        </span>
      </div>
    </div>
  );
}
