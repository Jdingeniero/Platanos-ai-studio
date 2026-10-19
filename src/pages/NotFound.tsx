import React, { useEffect } from 'react';
import { AlertCircle, ArrowLeft, Home, Search, FolderGit2 } from 'lucide-react';

interface NotFoundProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function NotFound({ currentPath, onNavigate }: NotFoundProps) {
  useEffect(() => {
    document.title = '404 - Página no encontrada | Plátanos del Norte S.L.';

    // Ensure description reflects 404
    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement('meta');
      desc.name = 'description';
      document.head.appendChild(desc);
    }
    desc.setAttribute('content', 'Error 404: La página solicitada no existe en el servidor de Plátanos del Norte S.L.');

    // Remove or ensure canonical does NOT point to home
    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canon) {
      canon.removeAttribute('href');
    }

    // Add noindex, nofollow for true 404 SEO compliance
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');

    return () => {
      if (robots) {
        robots.setAttribute('content', 'index, follow');
      }
    };
  }, [currentPath]);

  return (
    <div className="py-20 px-6 max-w-2xl mx-auto text-center space-y-6">
      <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mx-auto border border-slate-200">
        <AlertCircle className="w-9 h-9 text-slate-500" />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-slate-600 font-bold font-mono">
          HTTP ERROR 404 · RECURSO NO LOCALIZADO
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Página no encontrada
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed pt-1">
          La ruta solicitada <code className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-xs border border-slate-200">{currentPath}</code> no existe en el servidor web o ha sido trasladada.
        </p>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono max-w-md mx-auto text-left space-y-1">
        <div className="flex items-center justify-between">
          <span>Estado del servidor:</span>
          <span className="font-bold text-slate-700">404 Not Found</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Indexación en motores:</span>
          <span className="text-slate-600">noindex, nofollow</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Honeypot de seguridad:</span>
          <span className="text-emerald-700 font-sans font-medium">Inactivo (Ruta benigna ordinaria)</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => onNavigate('/')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Home className="w-4 h-4 text-emerald-400" />
          <span>Volver a la portada</span>
        </button>
        <button
          onClick={() => onNavigate('/actualidad')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span>Ver Actualidad</span>
        </button>
        <button
          onClick={() => onNavigate('/documentos')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <FolderGit2 className="w-4 h-4 text-slate-500" />
          <span>Documentos públicos</span>
        </button>
      </div>
    </div>
  );
}
