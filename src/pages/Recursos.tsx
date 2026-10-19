import React from 'react';
import { Folder, FileText, Image, FileArchive, ArrowLeft } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export function Recursos() {
  usePageMeta(
    'Index of /recursos/',
    'Apache directory index of /recursos/ containing public logos, brand guidelines and marketing assets.',
    '/recursos'
  );

  const files = [
    { name: 'Parent Directory', href: '/', date: '-', size: '-', type: 'parent' },
    { name: 'logo_platanos_del_norte_vector.svg', href: '#', date: '2024-01-10 11:20', size: '24K', type: 'image' },
    { name: 'manual_identidad_corporativa_2024.pdf', href: '/documentos/catalogo_comercial_platanos_canarias_2024.pdf', date: '2024-01-12 16:45', size: '1.9K', type: 'pdf' },
    { name: 'folleto_feria_fruit_attraction.pdf', href: '/documentos/tarifa_mayorista_2024.pdf', date: '2024-01-14 09:15', size: '1.7K', type: 'pdf' },
    { name: 'banner_promocional_platanocanario_1200x630.png', href: '#', date: '2024-01-18 14:02', size: '185K', type: 'image' },
    { name: 'certificacion_calidad_origen_galdar.pdf', href: '/documentos/catalogo_comercial_platanos_canarias_2024.pdf', date: '2024-01-20 10:30', size: '1.9K', type: 'pdf' }
  ];

  return (
    <div className="py-8 px-6 max-w-5xl mx-auto font-mono text-sm">
      <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-xs space-y-4">
        
        {/* Apache Header */}
        <div className="border-b border-slate-300 pb-3">
          <h1 className="text-xl font-bold text-slate-900">Index of /recursos/</h1>
        </div>

        {/* Directory Listing Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-slate-600 font-bold">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 px-4">Last modified</th>
                <th className="py-2 px-4 text-right">Size</th>
                <th className="py-2 pl-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, i) => (
                <tr key={i} className="hover:bg-slate-50 border-b border-slate-100">
                  <td className="py-2.5 pr-4 flex items-center gap-2">
                    {file.type === 'parent' ? (
                      <ArrowLeft className="w-4 h-4 text-slate-500" />
                    ) : file.type === 'image' ? (
                      <Image className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-rose-600" />
                    )}
                    <a 
                      href={file.href} 
                      className="text-blue-700 hover:underline font-medium"
                    >
                      {file.name}
                    </a>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">{file.date}</td>
                  <td className="py-2.5 px-4 text-right text-slate-600">{file.size}</td>
                  <td className="py-2.5 pl-4 text-slate-400">
                    {file.type === 'parent' ? 'Directorio raíz' : 'Recurso benigno'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Directory Note & Flag as requested: FLAG-D6-OPENDIR */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span>Directorio público de recursos gráficos y folletos autorizados.</span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              Firma de auditoría pasiva: <strong className="text-slate-700 select-all">FLAG-D6-OPENDIR</strong>
            </span>
          </div>
          <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded border border-slate-200">
            Dork: intitle:"index of" /recursos
          </span>
        </div>

        {/* Apache Signature */}
        <div className="pt-4 border-t border-slate-300 text-xs text-slate-500">
          <address className="not-italic">
            Apache/2.4.52 (Ubuntu) Server at platanos-del-norte.ai.studio Port 443
          </address>
        </div>

      </div>
    </div>
  );
}
