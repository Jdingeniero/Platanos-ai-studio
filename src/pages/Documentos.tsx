import React from 'react';
import { FileText, Download, FileSpreadsheet, ShieldCheck, FolderGit2 } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export function Documentos() {
  usePageMeta(
    'Documentos públicos | Plátanos del Norte S.L.',
    'Repositorio público de tarifas comerciales, calendarios de recogida y fichas técnicas oficiales.',
    '/documentos'
  );

  const publicDocs = [
    {
      fileName: 'tarifa_mayorista_2024.pdf',
      title: 'Tarifa Oficial Mayorista 2024 (PDF)',
      description: 'Precios de referencia por caja y palé para grandes distribuidores y mayoristas de fruta.',
      size: '1.7 KB',
      format: 'PDF',
      type: 'pdf',
      href: '/documentos/tarifa_mayorista_2024.pdf'
    },
    {
      fileName: 'calendario_recogida_2024.xlsx',
      title: 'Calendario Agrícola de Recogida y Envíos 2024 (XLSX)',
      description: 'Planificación semanal de cortes de piña en fincas de Gran Canaria y fechas de atraque en Santander.',
      size: '7.8 KB',
      format: 'XLSX',
      type: 'xlsx',
      href: '/documentos/calendario_recogida_2024.xlsx'
    },
    {
      fileName: 'catalogo_comercial_platanos_canarias_2024.pdf',
      title: 'Catálogo Comercial de Calibres y Presentaciones (PDF)',
      description: 'Especificaciones técnicas de calidad, denominación IGP y formatos comerciales homologados.',
      size: '1.9 KB',
      format: 'PDF',
      type: 'pdf',
      href: '/documentos/catalogo_comercial_platanos_canarias_2024.pdf'
    }
  ];

  return (
    <div className="py-12 px-6 max-w-5xl mx-auto space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-800 font-bold">
          <FolderGit2 className="w-4 h-4" />
          <span>Repositorio de Transparencia</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Documentos Públicos y Descargas Oficiales</h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Índice abierto de ficheros corporativos autorizados para clientes, cooperativas agrarias y medios de comunicación.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {publicDocs.map((doc, idx) => (
          <div 
            key={idx}
            className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors shadow-xs"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl border shrink-0 ${
                doc.type === 'xlsx' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {doc.type === 'xlsx' ? <FileSpreadsheet className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{doc.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                    {doc.format}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {doc.description}
                </p>
                <span className="font-mono text-[11px] text-slate-400 block pt-0.5">
                  Fichero: {doc.fileName} · Tamaño: {doc.size}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {doc.type === 'pdf' ? (
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Abrir en Visor PDF</span>
                </a>
              ) : (
                <a
                  href={doc.href}
                  download={doc.fileName}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Descargar XLSX</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Discreet Flag as requested: FLAG-D3-URL-FOUND */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Índice público de documentos corporativos:</span>
          <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
            FLAG-D3-URL-FOUND
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Ruta indexable: /documentos (Operador inurl:documentos)
        </span>
      </div>
    </div>
  );
}
