import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  PlusCircle, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight,
  BookOpen,
  Filter,
  Eye,
  Terminal
} from 'lucide-react';
import { TARGET_DOMAIN } from '../data/targetCompany';
import { GOOGLE_OPERATORS, executeSimulatedDorkSearch, parseGoogleQuery, ALL_SIMULATED_PAGES } from '../data/dorksDatabase';
import { SearchResult, TargetFileItem } from '../types/osint';
import { TARGET_FILES } from '../data/targetCompany';

interface GoogleSearchSimulatorProps {
  onInspectFileByName: (filename: string) => void;
  onAddFindingToReport: (title: string, dork: string, details: string) => void;
  onNavigateToTargetWeb: () => void;
  onNavigateToGitHub: () => void;
}

export const GoogleSearchSimulator: React.FC<GoogleSearchSimulatorProps> = ({
  onInspectFileByName,
  onAddFindingToReport,
  onNavigateToTargetWeb,
  onNavigateToGitHub,
}) => {
  const [query, setQuery] = useState<string>(`site:${TARGET_DOMAIN} filetype:pdf`);
  const [activeTab, setActiveTab] = useState<'results' | 'operators' | 'dork-lab'>('results');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const parsedQuery = useMemo(() => parseGoogleQuery(query), [query]);
  const searchResults = useMemo(() => executeSimulatedDorkSearch(query), [query]);

  const presetDorks = [
    {
      label: 'Documentos PDF sensibles',
      query: `site:${TARGET_DOMAIN} filetype:pdf`,
      tip: 'Localiza informes de auditoría, presupuestos y manuales de operaciones.'
    },
    {
      label: 'Directorio Abierto (Index of)',
      query: `site:${TARGET_DOMAIN} intitle:"index of"`,
      tip: 'Detecta servidores Apache/Nginx con autoindex habilitado sin fichero index.html.'
    },
    {
      label: 'Archivos de configuración y backups',
      query: `site:${TARGET_DOMAIN} (ext:sql OR ext:gz OR ext:ovpn)`,
      tip: 'Busca volcados de base de datos y perfiles de conexión remota a la red privada.'
    },
    {
      label: 'Paneles de login y administración',
      query: `site:${TARGET_DOMAIN} inurl:admin`,
      tip: 'Identifica portales de acceso a CMS o consolas de administración.'
    },
    {
      label: 'Fuga de código en GitHub',
      query: `site:github.com "platanosdelnorte"`,
      tip: 'Descubre repositorios públicos de empleados con claves y scripts internos.'
    },
    {
      label: 'Menciones de confidencialidad',
      query: `site:${TARGET_DOMAIN} intext:"confidencial"`,
      tip: 'Filtra páginas o documentos con sellos explícitos de secreto corporativo.'
    }
  ];

  const handleApplyPreset = (dork: string) => {
    setQuery(dork);
    setActiveTab('results');
  };

  const handleOpenRealGoogle = () => {
    const encoded = encodeURIComponent(query);
    window.open(`https://www.google.com/search?q=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>Módulo 1</span>
              <span aria-hidden="true">·</span>
              <span>Motor de Búsqueda Avanzada</span>
              <span aria-hidden="true">·</span>
              <span>Simulador de SERP Google</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Laboratorio de Google Hacking & Dorks
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Practica consultas pasivas de recolección de información sobre <strong className="text-slate-800">{TARGET_DOMAIN}</strong>. Analiza los resultados como lo haría Google tras indexar la web en Google Search Console.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'results' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Resultados ({searchResults.length})
            </button>
            <button
              onClick={() => setActiveTab('operators')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'operators' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>12 Operadores (PDF)</span>
            </button>
          </div>
        </div>

        {/* Google Input Field */}
        <div className="mt-6">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-slate-400">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Introduce un Google Dork, ej: site:platanosdelnorte.es filetype:pdf"
              className="w-full pl-12 pr-32 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
            <div className="absolute right-3 flex items-center gap-2">
              <button
                onClick={handleOpenRealGoogle}
                title="Lanzar consulta en el motor Google real (nueva pestaña)"
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm transition-colors"
              >
                <ExternalLink className="w-3 h-3 text-slate-500" />
                <span className="hidden sm:inline">Google Real</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Dork Presets */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-600">
          <span className="font-semibold text-slate-500 shrink-0">Dorks rápidos:</span>
          {presetDorks.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(item.query)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 text-slate-700 font-mono text-[11px]"
              title={item.tip}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Real-time Query Syntax Breakdown Card */}
        {parsedQuery.detectedOperators.length > 0 && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>Desglose de Sintaxis Dork Detectada:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {parsedQuery.siteFilter && (
                <div className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700">
                  <span className="font-mono text-emerald-700 font-semibold">site:</span> {parsedQuery.siteFilter}
                </div>
              )}
              {parsedQuery.filetypeFilter && (
                <div className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700">
                  <span className="font-mono text-emerald-700 font-semibold">filetype:</span> {parsedQuery.filetypeFilter}
                </div>
              )}
              {parsedQuery.intitleFilter && (
                <div className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700">
                  <span className="font-mono text-emerald-700 font-semibold">intitle:</span> "{parsedQuery.intitleFilter}"
                </div>
              )}
              {parsedQuery.inurlFilter && (
                <div className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700">
                  <span className="font-mono text-emerald-700 font-semibold">inurl:</span> {parsedQuery.inurlFilter}
                </div>
              )}
              {parsedQuery.intextFilter && (
                <div className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700">
                  <span className="font-mono text-emerald-700 font-semibold">intext:</span> "{parsedQuery.intextFilter}"
                </div>
              )}
              {parsedQuery.freeTextKeywords.length > 0 && (
                <div className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700">
                  <span className="text-slate-500 font-semibold">Términos libres:</span> {parsedQuery.freeTextKeywords.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content: Results vs Operators Reference */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Cerca de {searchResults.length} resultados indexados para la consulta</span>
            <span>Simulador pasivo (Sin enviar tráfico a la víctima)</span>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No se encontraron resultados para este Dork</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Prueba a ajustar los operadores, buscar en el dominio <code className="text-emerald-700 font-mono">site:{TARGET_DOMAIN}</code> o seleccionar uno de los dorks rápidos arriba.
              </p>
              <button
                onClick={() => setQuery(`site:${TARGET_DOMAIN}`)}
                className="mt-4 px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                Ver todo lo indexado del dominio
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((result) => {
                const isGithub = result.url.includes('github.com');
                const isPdf = result.url.endsWith('.pdf') || result.filetype === 'PDF';
                const isDirectory = result.title.includes('Index of');

                return (
                  <div
                    key={result.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* URL Breadcrumb */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="font-mono text-emerald-800 text-[11px] truncate max-w-lg">
                            {result.url}
                          </span>
                          {result.confidentialBadge && (
                            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded whitespace-nowrap">
                              {result.confidentialBadge}
                            </span>
                          )}
                        </div>

                        {/* Title as Link */}
                        <h3 className="text-base font-semibold text-blue-700 hover:underline cursor-pointer">
                          {result.title}
                        </h3>

                        {/* Snippet */}
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {result.snippet}
                        </p>

                        {/* Tags & Meta */}
                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">Categoría: {result.matchedDorkCategory}</span>
                          {result.filetype && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono text-rose-700 font-semibold">Formato: {result.filetype}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 shrink-0">
                        {isPdf && (
                          <button
                            onClick={() => {
                              const filename = result.url.split('/').pop() || '';
                              onInspectFileByName(filename);
                            }}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspeccionar Metadatos</span>
                          </button>
                        )}

                        {isGithub && (
                          <button
                            onClick={onNavigateToGitHub}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Terminal className="w-3.5 h-3.5" />
                            <span>Ver Repositorio GitHub</span>
                          </button>
                        )}

                        {isDirectory && (
                          <button
                            onClick={onNavigateToTargetWeb}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>Explorar Directorio</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onAddFindingToReport(
                              result.title,
                              query,
                              `URL localizada: ${result.url}\nResumen del hallazgo: ${result.snippet}`
                            );
                            showToast('¡Hallazgo registrado en tu Cuaderno de Entrega!');
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-slate-600" />
                          <span>Guardar en Informe</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Operators Reference Table (Section 2 of Assignment) */}
      {activeTab === 'operators' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Catálogo de Operadores Avanzados de Google (Sección 2 de la Actividad)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Guía completa de los 12 operadores requeridos por la práctica docente. Puedes hacer clic en "Probar este operador" para ensayarlo en el simulador.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {GOOGLE_OPERATORS.map((op, idx) => (
              <div key={idx} className="py-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {op.operator}
                    </span>
                    <span className="text-xs font-mono text-slate-500">Sintaxis: {op.syntax}</span>
                    <span className="text-[11px] text-slate-400">· Nivel: {op.educationalLevel}</span>
                  </div>

                  <button
                    onClick={() => handleApplyPreset(op.practicalExample)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded flex items-center gap-1 self-start sm:self-auto transition-colors font-mono"
                  >
                    <span>Probar: {op.practicalExample}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Definición:</strong> {op.description}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong className="text-slate-800">Uso en Auditoría de Seguridad / Ciberseguridad:</strong> {op.purposeInSecurity}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
