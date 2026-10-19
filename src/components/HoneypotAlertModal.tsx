import React from 'react';
import { ShieldAlert, AlertTriangle, Eye, Terminal, ArrowRight, X } from 'lucide-react';
import { HoneypotIncident } from '../data/honeypot';

interface HoneypotAlertModalProps {
  isOpen: boolean;
  incident: HoneypotIncident | null;
  onClose: () => void;
  onOpenAudit: () => void;
}

export function HoneypotAlertModal({
  isOpen,
  incident,
  onClose,
  onOpenAudit
}: HoneypotAlertModalProps) {
  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-white font-sans">
        
        {/* Top Warning Banner */}
        <div className="bg-rose-600 px-6 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span className="font-mono text-xs font-black tracking-widest uppercase">
              Sensor Honeypot Corporativo · Detección de Hacking Activo
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-rose-100 hover:text-white p-1 rounded hover:bg-rose-700/50 cursor-pointer"
            title="Cerrar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 shrink-0 mt-1">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">
                Acceso a Contenido NO Indexado Detectado
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Has navegado directamente a una ruta o recurso que <strong>no figura en el sitemap.xml ni en los motores de búsqueda</strong>. Este comportamiento ha activado el sistema trampa (honeypot) para registrar el sondeo.
              </p>
            </div>
          </div>

          {/* Incident Telemetry Box */}
          <div className="bg-slate-950 border border-rose-500/30 rounded-xl p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>TELEMETRÍA DE INTRUSIÓN CAPTURADA</span>
              </span>
              <span className="text-[11px] text-slate-500">{incident.timestamp}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-slate-500 block">Ruta Interceptada:</span>
                <span className="text-amber-400 font-bold break-all">{incident.path}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Clasificación:</span>
                <span className="text-rose-400 font-bold">{incident.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block">IP Registrada:</span>
                <span className="text-emerald-400 font-mono">{incident.simulatedIp}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Estado en Registro:</span>
                <span className="text-sky-400 font-bold">Sellado en Auditoría</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
              <span className="text-slate-500">Motivo del sensor: </span>
              <span>{incident.reason}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200/90 leading-relaxed">
            💡 <strong>Nota pedagógica para el alumno:</strong> En una auditoría real, acceder a directorios que no están en Google demuestra que has utilizado técnicas activas (fuzzing, inspección de robots.txt o navegación arbitraria) en lugar de dorks pasivos indexados.
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onClose();
                onOpenAudit();
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-rose-900/30"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Registro Forense y Retos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Entendido / Continuar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
