import React, { useState } from 'react';
import { 
  Bot, 
  FolderLock, 
  AlertTriangle, 
  CheckCircle, 
  PlusCircle, 
  Check, 
  Code2, 
  ShieldCheck, 
  Terminal,
  HelpCircle
} from 'lucide-react';
import { ROBOTS_TXT_CONTENT, TARGET_DOMAIN } from '../../data/targetCompany';

interface ModuleWebCrawlersProps {
  onNavigateToTargetWeb: () => void;
  onAddFindingToReport: (title: string, dork: string, details: string) => void;
}

export const ModuleWebCrawlers: React.FC<ModuleWebCrawlersProps> = ({
  onNavigateToTargetWeb,
  onAddFindingToReport,
}) => {
  const [testPath, setTestPath] = useState<string>('/admin-panel/');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check testPath against robots.txt directives
  const isDisallowed = ['/admin-panel/', '/internal-docs/', '/backup-2023/', '/rh-nominas/', '/staging-api/', '/camaras-cctv/'].some(
    p => testPath.startsWith(p)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>Módulo 3</span>
              <span aria-hidden="true">·</span>
              <span>Rastreo Web & Fugas de Servidor</span>
              <span aria-hidden="true">·</span>
              <span>robots.txt & Directory Browsing</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Análisis de Rastreadores (Crawlers) y Exposición de Rutas
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Comprende cómo los motores de búsqueda como Googlebot interpretan <code className="font-mono text-slate-800">robots.txt</code>, por qué <strong>no es un mecanismo de seguridad</strong> y cómo la configuración errónea de <code className="font-mono text-slate-800">Directory Browsing</code> permite a atacantes listar el contenido íntegro de carpetas protegidas.
            </p>
          </div>

          <button
            onClick={() => {
              onAddFindingToReport(
                'Fuga de arquitectura web mediante robots.txt y Directory Listing',
                `site:${TARGET_DOMAIN} inurl:robots.txt`,
                'El fichero robots.txt expone rutas reservadas como /backup-2023/ y /internal-docs/. El servidor Apache no tenía deshabilitado el módulo de listado, permitiendo descargar los ficheros.'
              );
              showToast('¡Hallazgo guardado en tu Cuaderno de Entrega!');
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Guardar Hallazgo en Informe</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: robots.txt Interactive Sandbox */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Simulador de Evaluación de Directivas robots.txt</span>
            </h3>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              RFC 9309
            </span>
          </div>

          {/* Interactive Path Tester */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Comprobar comportamiento del crawler frente a una ruta:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testPath}
                onChange={(e) => setTestPath(e.target.value)}
                placeholder="/ruta-a-probar/"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => setTestPath('/backup-2023/')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-mono"
              >
                /backup-2023/
              </button>
              <button
                onClick={() => setTestPath('/quienes-somos/')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-mono"
              >
                /quienes-somos/
              </button>
            </div>
          </div>

          {/* Crawler Decision Box */}
          <div className={`p-4 rounded-xl border text-xs ${
            isDisallowed 
              ? 'bg-rose-50 border-rose-200 text-rose-900' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-start gap-3">
              {isDisallowed ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-sm">
                  {isDisallowed 
                    ? 'Directiva Disallow Aplicada (Googlebot NO rastreará)' 
                    : 'Directiva Allow / Permitida (Googlebot rastreará e indexará)'}
                </p>
                <p className="leading-relaxed">
                  {isDisallowed 
                    ? 'Importante: Los motores de búsqueda éticos respetan Disallow, pero si otra web enlaza a esta ruta, Google aún podría indexar la URL sin contenido. Además, un atacante usará esta lista como su primer objetivo de intrusión.'
                    : 'La ruta es accesible e indexable por cualquier buscador de internet de forma transparente.'}
                </p>
              </div>
            </div>
          </div>

          {/* Visual Code of robots.txt */}
          <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-slate-200 space-y-1 border border-slate-800">
            <div className="text-emerald-400 font-bold mb-2 font-sans flex items-center justify-between">
              <span>Archivo actual alojado en https://{TARGET_DOMAIN}/robots.txt</span>
              <button
                onClick={onNavigateToTargetWeb}
                className="text-xs text-slate-400 hover:text-white underline font-sans"
              >
                Abrir en Web
              </button>
            </div>
            <pre className="text-[11px] leading-relaxed overflow-x-auto text-slate-300">
              {ROBOTS_TXT_CONTENT}
            </pre>
          </div>
        </div>

        {/* Right: Open Directory Listing & Hardening Remediation */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-amber-600" />
              <span>Vulnerabilidad: Directory Listing (Index of)</span>
            </h3>
            <span className="text-[11px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-semibold">
              CWE-548
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
            <h4 className="font-bold text-amber-900">¿Por qué ocurre el listado automático?</h4>
            <p className="leading-relaxed">
              Cuando un cliente solicita una carpeta web (ej. <code>/internal-docs/</code>) y en ella no existe ningún archivo por defecto (como <code>index.html</code>, <code>index.php</code>), servidores como Apache o Nginx generan automáticamente una página HTML con la lista de ficheros existentes si la directiva de autoindexado está activa.
            </p>
          </div>

          {/* Defensive Hardening Code Examples */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cómo solucionar la vulnerabilidad (Remediación en Servidor)</span>
            </h4>

            {/* Apache Fix */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 text-xs font-mono text-slate-100">
              <div className="text-slate-400 text-[11px] mb-1 font-sans"># En Servidores Apache (.htaccess o VirtualHost):</div>
              <p className="text-emerald-400 font-bold">Options -Indexes</p>
              <p className="text-slate-400 text-[11px] mt-1 font-sans">
                El signo menos (-) antes de <code>Indexes</code> desactiva la generación del listado y devuelve un error 403 Forbidden.
              </p>
            </div>

            {/* Nginx Fix */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 text-xs font-mono text-slate-100">
              <div className="text-slate-400 text-[11px] mb-1 font-sans"># En Servidores Nginx (/etc/nginx/sites-available/...):</div>
              <p className="text-emerald-400 font-bold">autoindex off;</p>
              <p className="text-slate-400 text-[11px] mt-1 font-sans">
                Garantiza que cualquier petición sin archivo índice sea rechazada con 403 Forbidden.
              </p>
            </div>

            {/* Noindex Header Fix */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 text-xs font-mono text-slate-100">
              <div className="text-slate-400 text-[11px] mb-1 font-sans"># Cabecera HTTP anti-indexado (en caso de rutas privadas):</div>
              <p className="text-emerald-400 font-bold">Header set X-Robots-Tag "noindex, nofollow, noarchive"</p>
            </div>
          </div>
        </div>
      </div>

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
