import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  FolderGit2, 
  Terminal, 
  ExternalLink, 
  PlusCircle, 
  Check, 
  AlertTriangle, 
  Copy, 
  User, 
  ShieldAlert, 
  Key, 
  FileCode,
  Lock
} from 'lucide-react';
import { SIMULATED_GITHUB_REPO, TARGET_EMPLOYEES } from '../../data/targetCompany';

interface ModuleSocmintGithubProps {
  onAddFindingToReport: (title: string, dork: string, details: string) => void;
}

export const ModuleSocmintGithub: React.FC<ModuleSocmintGithubProps> = ({
  onAddFindingToReport,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'commits' | 'socmint-flow'>('code');
  const [selectedFile, setSelectedFile] = useState<string>('backup_sync.sh');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentFileContent = SIMULATED_GITHUB_REPO.files.find(f => f.name === selectedFile)?.content || '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>Módulo 4</span>
              <span aria-hidden="true">·</span>
              <span>SOCMINT & Fuga de Código Fuente</span>
              <span aria-hidden="true">·</span>
              <span>Perfil de Empleado & Repositorios Git</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Investigación en Redes Sociales y Auditoría de Secretos en GitHub
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              El eslabón humano es habitualmente el origen de las mayores brechas. A través de la técnica de <strong>pivote de alias</strong>, partiendo del nombre de un empleado en la web corporativa, localizamos su perfil de GitHub personal con scripts que contienen contraseñas en texto plano y webhooks internos.
            </p>
          </div>

          <button
            onClick={() => {
              onAddFindingToReport(
                'Fuga de credenciales MySQL y Webhooks en GitHub personal del empleado',
                `site:github.com "platanosdelnorte" OR "${SIMULATED_GITHUB_REPO.owner}"`,
                `Repositorio: https://github.com/${SIMULATED_GITHUB_REPO.owner}/${SIMULATED_GITHUB_REPO.repoName}\nArchivo: backup_sync.sh expone contraseña de base de datos MySQL 'PlatanosMySQL2023!#' y URL privada de Webhook de Slack.`
              );
              showToast('¡Hallazgo de GitHub añadido a tu Cuaderno!');
            }}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Guardar Hallazgo en Informe</span>
          </button>
        </div>
      </div>

      {/* Pivoting Diagram / SOCMINT Flow Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-3">
          Técnica de Pivote OSINT: De la Web Corporativa al Repositorio de Código
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-900 block">Paso 1: Identificación</span>
            <p className="text-slate-600 mt-1">Web corporativa revela a Carlos Mendizábal Ruiz como administrador de sistemas IT.</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-900 block">Paso 2: Búsqueda de Alias</span>
            <p className="text-slate-600 mt-1">Búsqueda con Google Dorks y redes descubre el alias técnico: <code>cmendi-dev</code>.</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-900 block">Paso 3: Análisis de Repos</span>
            <p className="text-slate-600 mt-1">Localización de repositorio público <code>platanos-api-scripts</code> con código de la empresa.</p>
          </div>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <span className="font-bold text-rose-900 block">Paso 4: Extracción de Secretos</span>
            <p className="text-rose-700 mt-1">Revisión del código y del historial de commits revela credenciales activas y tokens de API.</p>
          </div>
        </div>
      </div>

      {/* Simulated GitHub UI Container */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-md">
        {/* GitHub Header Bar */}
        <div className="bg-slate-900 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs border border-slate-700">
              🐙
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-sm">github.com /</span>
                <span className="font-bold font-mono text-sm text-white">{SIMULATED_GITHUB_REPO.owner}</span>
                <span className="text-slate-400 font-mono text-sm">/</span>
                <span className="font-bold font-mono text-sm text-emerald-400">{SIMULATED_GITHUB_REPO.repoName}</span>
                <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                  {SIMULATED_GITHUB_REPO.visibility}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{SIMULATED_GITHUB_REPO.repoDescription}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'code' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
              }`}
            >
              Archivos ({SIMULATED_GITHUB_REPO.files.length})
            </button>
            <button
              onClick={() => setActiveTab('commits')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'commits' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5 text-amber-400" />
              <span>Commits ({SIMULATED_GITHUB_REPO.commitHistory.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Code View */}
        {activeTab === 'code' && (
          <div className="p-6 space-y-4">
            {/* File Switcher */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs">
              <span className="font-semibold text-slate-500">Archivos en la rama main:</span>
              {SIMULATED_GITHUB_REPO.files.map(file => (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file.name)}
                  className={`px-2.5 py-1 rounded font-mono text-xs transition-colors flex items-center gap-1.5 ${
                    selectedFile === file.name
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{file.name}</span>
                  {file.name === 'backup_sync.sh' && (
                    <span className="w-2 h-2 rounded-full bg-rose-500" title="Contiene credenciales" />
                  )}
                </button>
              ))}
            </div>

            {/* Code Highlighting Window */}
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-slate-100 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 font-sans text-xs">
                <span className="text-slate-400 font-mono">{selectedFile} (100% rama pública)</span>
                {selectedFile === 'backup_sync.sh' && (
                  <span className="text-rose-400 font-semibold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                    ⚠ Fuga de Token y Clave MySQL
                  </span>
                )}
              </div>
              <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
                {currentFileContent}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Commits History Diff */}
        {activeTab === 'commits' && (
          <div className="p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h4 className="font-bold text-slate-900 text-sm">Historial de Revisiones Git (Commit Diff Analysis)</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Los desarrolladores a menudo borran un archivo o cambian una clave en el commit más reciente, pero el secreto permanece expuesto para siempre en el historial de Git si no se purga con herramientas específicas.
              </p>
            </div>

            <div className="space-y-4">
              {SIMULATED_GITHUB_REPO.commitHistory.map(commit => (
                <div key={commit.hash} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <GitCommit className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900 text-xs">{commit.message}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                      <span>Commit {commit.hash}</span>
                      <span>·</span>
                      <span>{commit.date}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-sans mb-2">
                    <strong>Autor del commit:</strong> <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">{commit.author}</code>
                  </p>

                  <div className="bg-slate-950 rounded-lg p-3 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                    <pre className="text-emerald-400">{commit.diff}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Defensive Secret Scanning Box */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 space-y-3">
        <h4 className="font-bold text-white text-sm flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-400" />
          <span>Herramientas de Prevención y Remediación en Git</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="font-bold text-emerald-400 block font-mono">Gitleaks / TruffleHog</span>
            <p className="text-slate-400 mt-1">Escáneres automáticos de secretos y claves regex ejecutados como hooks de pre-commit.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="font-bold text-emerald-400 block font-mono">git-filter-repo / BFG</span>
            <p className="text-slate-400 mt-1">Herramientas para reescribir el historial de commits y extirpar contraseñas commiteadas por error.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="font-bold text-emerald-400 block font-mono">Rotación Inmediata</span>
            <p className="text-slate-400 mt-1">Una clave expuesta en un repo público debe considerarse comprometida en menos de 60 segundos.</p>
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
