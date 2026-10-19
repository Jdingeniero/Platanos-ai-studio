import React from 'react';
import { 
  Globe, 
  Search, 
  Layers, 
  FileText, 
  ShieldCheck, 
  Terminal,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => setActiveTab('simulator')}
          className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
            🍌
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            OSINT Lab <span className="text-slate-400 font-normal">· Plátanos del Norte</span>
          </span>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
              activeTab === 'simulator'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Motor Google Dorks</span>
          </button>

          <button
            onClick={() => setActiveTab('target-web')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
              activeTab === 'target-web'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Web Empresa Objetivo</span>
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
              activeTab === 'modules'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Técnicas OSINT</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
              activeTab === 'report'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Cuaderno Alumno</span>
          </button>

          <button
            onClick={() => setActiveTab('teacher')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
              activeTab === 'teacher'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Panel Docente</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenReportModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Mi Entrega</span>
          </button>
        </div>
      </div>
    </header>
  );
};
