import React from 'react';
import { FileText, Download } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export function Catalogo() {
  usePageMeta(
    'Catálogo comercial 2024 | Plátanos del Norte S.L.',
    'Catálogo comercial 2024 en PDF de Plátanos del Norte S.L.',
    '/catalogo'
  );

  return (
    <div className="py-12 px-6 max-w-5xl mx-auto space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold">Catálogo y Fichas Técnicas</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Variedades y Calibres 2024</h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Descarga los catálogos y especificaciones oficiales para mayoristas, canal Horeca y cooperativas asociadas.
        </p>
      </div>

      <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">catalogo_comercial_platanos_canarias_2024.pdf</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">1.9 KB · Documento Oficial con Metadatos</p>
            </div>
          </div>

          <a
            href="/Platanos-ai-studio/documentos/catalogo_comercial_platanos_canarias_2024.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Abrir en Visor PDF</span>
          </a>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Identificador de publicación:</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-900 rounded font-bold border border-slate-300">FLAG-D2-TITLE-FOUND</span>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-sans font-medium">
            Página pública indexada en Google (intitle:"catálogo comercial")
          </span>
        </div>
      </div>
    </div>
  );
}
