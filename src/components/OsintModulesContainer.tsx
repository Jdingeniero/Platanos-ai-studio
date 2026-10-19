import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  FileSearch, 
  Bot, 
  GitBranch, 
  Network, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ModuleMetadataForensics } from './modules/ModuleMetadataForensics';
import { ModuleWebCrawlers } from './modules/ModuleWebCrawlers';
import { ModuleSocmintGithub } from './modules/ModuleSocmintGithub';
import { ModulePassiveDns } from './modules/ModulePassiveDns';
import { TargetFileItem } from '../types/osint';

interface OsintModulesContainerProps {
  selectedFile: TargetFileItem | null;
  onSelectFile: (file: TargetFileItem) => void;
  onAddFindingToReport: (title: string, dork: string, details: string) => void;
  onNavigateToTargetWeb: () => void;
  onNavigateToSimulator: () => void;
  initialModule?: number;
}

export const OsintModulesContainer: React.FC<OsintModulesContainerProps> = ({
  selectedFile,
  onSelectFile,
  onAddFindingToReport,
  onNavigateToTargetWeb,
  onNavigateToSimulator,
  initialModule = 2,
}) => {
  const [activeModule, setActiveModule] = useState<number>(initialModule);

  const modules = [
    {
      id: 1,
      title: 'Módulo 1: Google Hacking & Dorks',
      subtitle: 'Operadores avanzados y simulador de motor de búsqueda',
      icon: Search,
      isExternalNav: true,
      onSelect: onNavigateToSimulator
    },
    {
      id: 2,
      title: 'Módulo 2: Metadatos Forenses',
      subtitle: 'Extracción de EXIF, XMP, autores y GPS en PDFs',
      icon: FileSearch,
      isExternalNav: false
    },
    {
      id: 3,
      title: 'Módulo 3: Crawlers & robots.txt',
      subtitle: 'Rastreo web, indexación y vulnerabilidad Directory Listing',
      icon: Bot,
      isExternalNav: false
    },
    {
      id: 4,
      title: 'Módulo 4: SOCMINT & GitHub',
      subtitle: 'Pivote de identidades de empleados y fugas de código',
      icon: GitBranch,
      isExternalNav: false
    },
    {
      id: 5,
      title: 'Módulo 5: DNS & Infraestructura',
      subtitle: 'Certificate Transparency Logs, registros SPF y WHOIS',
      icon: Network,
      isExternalNav: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Module Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (m.isExternalNav && m.onSelect) {
                    m.onSelect();
                  } else {
                    setActiveModule(m.id);
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div className="text-left">
                  <span>{m.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Content */}
      <div>
        {activeModule === 2 && (
          <ModuleMetadataForensics
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
            onAddFindingToReport={onAddFindingToReport}
          />
        )}

        {activeModule === 3 && (
          <ModuleWebCrawlers
            onNavigateToTargetWeb={onNavigateToTargetWeb}
            onAddFindingToReport={onAddFindingToReport}
          />
        )}

        {activeModule === 4 && (
          <ModuleSocmintGithub
            onAddFindingToReport={onAddFindingToReport}
          />
        )}

        {activeModule === 5 && (
          <ModulePassiveDns
            onAddFindingToReport={onAddFindingToReport}
          />
        )}
      </div>
    </div>
  );
};
