import React from 'react';
import { ExternalLink } from 'lucide-react';
import { TARGET_EMPLOYEES } from '../data/targetCompany';
import { usePageMeta } from '../hooks/usePageMeta';

export function QuienesSomos() {
  usePageMeta(
    'Quiénes somos | Plátanos del Norte S.L.',
    'Cooperativa platanera del norte de Gran Canaria. Equipo y contacto.',
    '/quienes-somos'
  );

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto space-y-10">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold">Organigrama Corporativo</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Equipo Directivo y Responsables Técnicos</h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Nuestra plantilla técnica y de operaciones coordina las recepciones en el puerto de Santander y supervisa el funcionamiento de las cámaras de maduración en Candina.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TARGET_EMPLOYEES.map(emp => (
          <div key={emp.id} className="border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-colors shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-lg shrink-0">
                {emp.avatarPlaceholderText}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg">{emp.name}</h3>
                  {emp.githubAlias && (
                    <span className="text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                      @{emp.githubAlias}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">{emp.role}</p>
                <p className="text-xs text-slate-500">{emp.department}</p>

                <div className="mt-4 text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p><strong>Email Corporativo:</strong> <span className="font-mono text-slate-800">{emp.email}</span></p>
                  <p><strong>Teléfono Directo:</strong> {emp.phone}</p>
                  <p className="text-slate-500 italic pt-1">{emp.bio}</p>
                </div>

                {emp.githubAlias && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">Repositorio y Scripts IT:</span>
                    <a
                      href={`https://github.com/${emp.githubAlias}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                    >
                      <span>github.com/{emp.githubAlias}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
