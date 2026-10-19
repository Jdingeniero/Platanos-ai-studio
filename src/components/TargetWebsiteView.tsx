import React, { useState } from 'react';
import { 
  Globe, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Lock, 
  FileText, 
  Folder, 
  ExternalLink, 
  AlertTriangle, 
  Eye, 
  PlusCircle, 
  Check, 
  ShieldAlert,
  Server,
  UserCheck,
  FileCode,
  Download
} from 'lucide-react';
import { TARGET_DOMAIN, TARGET_FILES, TARGET_EMPLOYEES, ROBOTS_TXT_CONTENT } from '../data/targetCompany';
import { TargetFileItem } from '../types/osint';

interface TargetWebsiteViewProps {
  onInspectFile: (file: TargetFileItem) => void;
  onAddFindingToReport: (title: string, dork: string, details: string) => void;
  onNavigateToGitHub: () => void;
}

export const TargetWebsiteView: React.FC<TargetWebsiteViewProps> = ({
  onInspectFile,
  onAddFindingToReport,
  onNavigateToGitHub,
}) => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [urlInput, setUrlInput] = useState<string>(`https://${TARGET_DOMAIN}/`);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setUrlInput(`https://${TARGET_DOMAIN}${path === '/' ? '' : path}`);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let cleaned = urlInput.replace(/^https?:\/\//i, '').replace(new RegExp(`^${TARGET_DOMAIN}`, 'i'), '');
    if (!cleaned.startsWith('/')) cleaned = '/' + cleaned;
    setCurrentPath(cleaned);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Context */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 mb-1">
              <span>Entorno Objetivo Ficticio</span>
              <span aria-hidden="true">·</span>
              <span>Santander, Cantabria</span>
              <span aria-hidden="true">·</span>
              <span>Infraestructura Simulada</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Plátanos del Norte S.L. — Portal Corporativo
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Simulador navegable de la empresa objetivo. Puedes navegar por las pestañas o ingresar directamente rutas en la barra de direcciones como <code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono text-slate-800">/robots.txt</code>, <code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono text-slate-800">/internal-docs/</code> o <code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono text-slate-800">/backup-2023/</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleNavigate('/robots.txt')}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-slate-600" />
              <span>Ver robots.txt</span>
            </button>
            <button
              onClick={() => handleNavigate('/internal-docs/')}
              className="px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Folder className="w-3.5 h-3.5 text-amber-700" />
              <span>/internal-docs/ (Index of)</span>
            </button>
            <button
              onClick={() => handleNavigate('/backup-2023/')}
              className="px-3 py-1.5 text-xs font-medium bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Server className="w-3.5 h-3.5 text-rose-700" />
              <span>/backup-2023/</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Browser Window */}
      <div className="bg-white border border-slate-300 rounded-xl shadow-md overflow-hidden">
        {/* Browser Chrome Header */}
        <div className="bg-slate-100 border-b border-slate-300 px-4 py-2.5 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button 
              onClick={() => handleNavigate('/')}
              className="p-1 hover:text-slate-700 transition-colors"
              title="Inicio"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleNavigate(currentPath)}
              className="p-1 hover:text-slate-700 transition-colors"
              title="Recargar"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
            <div className="w-full flex items-center bg-white border border-slate-300 rounded-lg px-3 py-1 text-xs text-slate-700 shadow-inner focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
              <Lock className="w-3 h-3 text-emerald-600 mr-2 shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-transparent outline-none font-mono text-xs"
                placeholder={`https://${TARGET_DOMAIN}/...`}
              />
            </div>
          </form>

          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            Apache/2.4.52 (Ubuntu)
          </span>
        </div>

        {/* Website Content Area */}
        <div className="min-h-[560px] bg-white">
          {/* Path 1: robots.txt */}
          {currentPath === '/robots.txt' && (
            <div className="p-6 font-mono text-xs text-slate-800 bg-slate-900 text-slate-100 min-h-[560px]">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">Archivo detectado:</span>
                  <span>https://{TARGET_DOMAIN}/robots.txt</span>
                </div>
                <button
                  onClick={() => {
                    onAddFindingToReport(
                      'Fuga de rutas y notas internas en robots.txt',
                      `site:${TARGET_DOMAIN} inurl:robots.txt`,
                      'El archivo robots.txt prohíbe el rastreo de carpetas críticas como /admin-panel/, /internal-docs/ y /backup-2023/, e incluye un comentario confidencial con el usuario c.mendizabal.'
                    );
                    showToast('¡Hallazgo guardado en tu Cuaderno de Entrega!');
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-sans font-medium flex items-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Añadir a mi Informe</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed text-slate-200">
                {ROBOTS_TXT_CONTENT}
              </pre>

              <div className="mt-6 p-4 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs font-sans">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-300">Análisis Forense OSINT del robots.txt</h4>
                    <p className="mt-1 leading-relaxed">
                      El administrador cometió dos errores graves: <strong>seguridad por oscuridad</strong> (asumir que <code>Disallow</code> bloquea el acceso en vez de solo pedir amablemente a los motores que no indexen) y <strong>fuga de notas internas</strong> con el nombre del usuario y la existencia del cron de backups de las 03:00.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleNavigate('/internal-docs/')}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium"
                      >
                        Explorar /internal-docs/
                      </button>
                      <button
                        onClick={() => handleNavigate('/backup-2023/')}
                        className="px-2.5 py-1 bg-amber-700 hover:bg-amber-600 text-white rounded text-xs font-medium"
                      >
                        Explorar /backup-2023/
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Path 2: Open Directory /internal-docs/ */}
          {currentPath === '/internal-docs/' && (
            <div className="p-8 font-mono text-sm text-slate-800 min-h-[560px]">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 font-sans">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 font-mono">Index of /internal-docs/</h1>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">Vulnerabilidad detectada: Directory Browsing / AutoIndex habilitado en Apache</p>
                </div>
                <button
                  onClick={() => {
                    onAddFindingToReport(
                      'Directorio Abierto (Index of /internal-docs/) con documentos confidenciales',
                      `site:${TARGET_DOMAIN} intitle:"index of" "internal-docs"`,
                      'El servidor web tiene habilitado el módulo mod_autoindex sin Options -Indexes, permitiendo listar y descargar auditorías internas, esquemas SCADA y perfiles VPN sin autenticación.'
                    );
                    showToast('¡Hallazgo guardado en tu Cuaderno de Entrega!');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Añadir a mi Informe</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-2 font-semibold">Nombre del Fichero</th>
                      <th className="pb-2 font-semibold">Última Modificación</th>
                      <th className="pb-2 font-semibold">Tamaño</th>
                      <th className="pb-2 font-semibold">Tipo</th>
                      <th className="pb-2 text-right font-semibold">Acción Forense</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 flex items-center gap-2">
                        <Folder className="w-4 h-4 text-amber-500" />
                        <button onClick={() => handleNavigate('/')} className="text-blue-600 hover:underline">
                          Parent Directory/
                        </button>
                      </td>
                      <td className="py-2.5 text-slate-500">-</td>
                      <td className="py-2.5 text-slate-500">-</td>
                      <td className="py-2.5 text-slate-500">Directorio</td>
                      <td className="py-2.5 text-right">-</td>
                    </tr>

                    {TARGET_FILES.filter(f => f.path.startsWith('/internal-docs/')).map(file => (
                      <tr key={file.id} className="hover:bg-amber-50/50">
                        <td className="py-3 flex items-center gap-2 font-medium text-slate-900">
                          <FileText className="w-4 h-4 text-rose-500" />
                          <span>{file.name}</span>
                          {file.isConfidential && (
                            <span className="text-[10px] font-sans font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                              Confidencial
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-slate-600">{file.lastModified}</td>
                        <td className="py-3 text-slate-600 font-mono">{file.size}</td>
                        <td className="py-3 text-slate-600">{file.mimeType}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2 font-sans">
                            <button
                              onClick={() => onInspectFile(file)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspeccionar Metadatos</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center font-mono">
                <span>Apache/2.4.52 (Ubuntu) Server at {TARGET_DOMAIN} Port 443</span>
                <span className="text-rose-600 font-semibold font-sans">Fallo de bastionado: Desactivar mod_autoindex</span>
              </div>
            </div>
          )}

          {/* Path 3: Open Directory /backup-2023/ */}
          {currentPath === '/backup-2023/' && (
            <div className="p-8 font-mono text-sm text-slate-800 min-h-[560px]">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 font-sans">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 font-mono">Index of /backup-2023/</h1>
                  <p className="text-xs text-rose-600 font-sans mt-0.5 font-semibold">¡Alerta Crítica! Copia de base de datos MySQL expuesta al público</p>
                </div>
                <button
                  onClick={() => {
                    onAddFindingToReport(
                      'Copia de Seguridad MySQL (.sql.gz) accesible públicamente',
                      `site:${TARGET_DOMAIN} inurl:backup filetype:sql OR filetype:gz`,
                      'El archivo db_backup_preprod_20231102.sql.gz de 14.2MB está en el DocumentRoot del servidor web, exponiendo hashes de contraseñas de usuarios administradores y esquema de base de datos.'
                    );
                    showToast('¡Hallazgo guardado en tu Cuaderno de Entrega!');
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Añadir a mi Informe</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-2 font-semibold">Nombre del Fichero</th>
                      <th className="pb-2 font-semibold">Última Modificación</th>
                      <th className="pb-2 font-semibold">Tamaño</th>
                      <th className="pb-2 text-right font-semibold">Acción Forense</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 flex items-center gap-2">
                        <Folder className="w-4 h-4 text-amber-500" />
                        <button onClick={() => handleNavigate('/')} className="text-blue-600 hover:underline">
                          Parent Directory/
                        </button>
                      </td>
                      <td className="py-2.5 text-slate-500">-</td>
                      <td className="py-2.5 text-slate-500">-</td>
                      <td className="py-2.5 text-right">-</td>
                    </tr>

                    {TARGET_FILES.filter(f => f.path.startsWith('/backup-2023/')).map(file => (
                      <tr key={file.id} className="hover:bg-rose-50/50 bg-rose-50/20">
                        <td className="py-3 flex items-center gap-2 font-medium text-slate-900">
                          <Server className="w-4 h-4 text-rose-600" />
                          <span>{file.name}</span>
                          <span className="text-[10px] font-sans font-semibold text-rose-700 bg-rose-100 border border-rose-300 px-1.5 py-0.5 rounded">
                            Base de Datos Staging
                          </span>
                        </td>
                        <td className="py-3 text-slate-600">{file.lastModified}</td>
                        <td className="py-3 text-slate-600 font-mono font-bold text-rose-700">{file.size}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => onInspectFile(file)}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded font-sans flex items-center gap-1 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Metadatos y Hashes</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 p-4 bg-slate-900 rounded-lg text-slate-200 text-xs font-mono">
                <div className="text-emerald-400 font-bold mb-1"># Inspección previa de cabecera SQL (gzip decompressed sample):</div>
                <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`-- MySQL dump 10.19 Distrib 8.0.34, for Linux (x86_64)
-- Host: db-master.internal.platanosdelnorte.es Database: platanos_preprod_db
-- ------------------------------------------------------
CREATE TABLE \`usuarios_admin\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`username\` varchar(50) NOT NULL,
  \`email\` varchar(100) NOT NULL,
  \`password_hash\` varchar(255) NOT NULL,
  \`rol\` varchar(30) DEFAULT 'operador',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`usuarios_admin\` VALUES 
(1,'admin','admin@platanosdelnorte.es','$2b$12$KIXsJk3eQxI4x8B2lP.W2eZJmN.eA7uH1jC6v2w8...','superadmin'),
(2,'cmendizabal','c.mendizabal@platanosdelnorte.es','$2b$12$yT6fWp9rL1zC...','devops_systems');`}
                </pre>
              </div>
            </div>
          )}

          {/* Path 4: Quiénes Somos / Equipo */}
          {currentPath === '/quienes-somos/' && (
            <div className="p-8 max-w-5xl mx-auto space-y-8">
              <div className="border-b border-slate-200 pb-5">
                <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">Plátanos del Norte S.L.</span>
                <h1 className="text-2xl font-bold text-slate-900 mt-1">Equipo Directivo y Operaciones</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Profesionales dedicados a la excelencia de la maduración de plátano en Santander.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TARGET_EMPLOYEES.map(emp => (
                  <div key={emp.id} className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-base shrink-0 shadow-sm">
                        {emp.avatarPlaceholderText}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-900 text-base">{emp.name}</h3>
                          {emp.githubAlias && (
                            <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                              @{emp.githubAlias}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-emerald-700 mt-0.5">{emp.role}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{emp.department}</p>

                        <div className="mt-3 text-xs text-slate-600 space-y-1">
                          <p><strong className="text-slate-700">Email:</strong> {emp.email}</p>
                          <p><strong className="text-slate-700">Tel:</strong> {emp.phone}</p>
                          <p className="text-slate-500 text-xs italic mt-2">{emp.bio}</p>
                        </div>

                        {emp.githubAlias && (
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500">Huella técnica GitHub</span>
                            <button
                              onClick={onNavigateToGitHub}
                              className="px-2.5 py-1 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Ver Perfil @{emp.githubAlias}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Path 5: Default / Home Page */}
          {(currentPath === '/' || currentPath === '/instalaciones/' || currentPath === '/contacto/') && (
            <div>
              {/* Corporate Header */}
              <div className="border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                    🍌
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Plátanos del Norte S.L.</h2>
                    <p className="text-[11px] text-slate-500">Santander · Polígono Candina · Nave 14</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
                  <button onClick={() => handleNavigate('/')} className="hover:text-emerald-700">Inicio</button>
                  <button onClick={() => handleNavigate('/quienes-somos/')} className="hover:text-emerald-700">Quiénes Somos</button>
                  <button onClick={() => handleNavigate('/internal-docs/')} className="text-amber-700 hover:text-amber-900 font-semibold">Documentos Internos</button>
                  <button onClick={() => handleNavigate('/robots.txt')} className="text-slate-500 hover:text-slate-900 font-mono">robots.txt</button>
                </div>
              </div>

              {/* Hero Banner */}
              <div className="p-8 md:p-12 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white">
                <div className="max-w-3xl">
                  <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Distribución Agroalimentaria Fría</span>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-white">
                    Maduración experta y distribución de Plátano de Canarias en el Norte
                  </h1>
                  <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                    Operamos más de 3.500 m² de cámaras frigoríficas con atmósfera controlada en el Polígono Candina (Santander). Abastecemos a cadenas de supermercados y canal Horeca en Cantabria, Asturias, País Vasco y norte de Castilla y León.
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <button
                      onClick={() => onInspectFile(TARGET_FILES[TARGET_FILES.length - 1])}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Catálogo 2024 (PDF)</span>
                    </button>
                    <button
                      onClick={() => handleNavigate('/quienes-somos/')}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg text-xs transition-colors"
                    >
                      Ver Organigrama y Equipo
                    </button>
                  </div>
                </div>
              </div>

              {/* Highlights Strip */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div className="p-5 border border-slate-200 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3">
                    01
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Cámaras con Inyección de Etileno</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    8 cámaras con sensores Siemens SCADA automatizados para calibrar el punto óptimo de madurez y dulzor de cada lote.
                  </p>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3">
                    02
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Flota Refrigerada con GPS</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Control térmico continuo entre 13°C y 14.5°C para garantizar la cadena de frío desde el puerto hasta el lineal.
                  </p>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3">
                    03
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Certificación IGP Plátano Canario</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Trazabilidad completa desde las plantaciones de La Palma y Tenerife hasta nuestros almacenes en Santander.
                  </p>
                </div>
              </div>

              {/* Corporate Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-8 py-6 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="font-semibold text-slate-700">Plátanos del Norte S.L. · CIF B-39824102</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Polígono Candina, Nave 14, 39011 Santander, Cantabria</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => handleNavigate('/robots.txt')} className="text-slate-600 hover:underline">robots.txt</button>
                  <button onClick={() => handleNavigate('/quienes-somos/')} className="text-slate-600 hover:underline">Equipo</button>
                  <button onClick={() => handleNavigate('/internal-docs/')} className="text-amber-700 hover:underline">Acceso Interno</button>
                </div>
              </div>
            </div>
          )}
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
