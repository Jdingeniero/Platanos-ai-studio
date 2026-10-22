import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  Clock, 
  Lock, 
  Lightbulb, 
  RotateCcw, 
  Copy, 
  Check, 
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Compass,
  FileText,
  AlertTriangle,
  Terminal,
  Trash2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Scale,
  Search,
  ExternalLink,
  Send,
  BookOpen
} from 'lucide-react';
import { Challenge } from '../data/challenges';
import { HoneypotIncident } from '../data/honeypot';

export interface MilestoneRecord {
  id: string;
  code: string;
  title: string;
  timestamp: string;
  flag: string;
  description: string;
  hintsUsed?: number;
}

interface RetosModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenges: Challenge[];
  completedChallengeIds: string[];
  milestones: MilestoneRecord[];
  honeypotLogs?: HoneypotIncident[];
  initialTab?: 'challenges' | 'honeypot' | 'legal';
  requestedHints: Record<string, number>;
  onRequestHint: (challengeId: string) => void;
  onValidateFlag?: (challengeId: string, flagInput: string) => boolean;
  onReset: () => void;
  onClearHoneypotLogs?: () => void;
}

export function RetosModal({
  isOpen,
  onClose,
  challenges,
  completedChallengeIds,
  milestones,
  honeypotLogs = [],
  initialTab = 'challenges',
  requestedHints,
  onRequestHint,
  onValidateFlag,
  onReset,
  onClearHoneypotLogs
}: RetosModalProps) {
  const [activeTab, setActiveTab] = useState<'challenges' | 'honeypot' | 'legal'>(initialTab);
  const [copied, setCopied] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'passive' | 'active' | 'pending' | 'completed'>('all');
  const [showResolvedHints, setShowResolvedHints] = useState<Record<string, boolean>>({});
  const [flagInputs, setFlagInputs] = useState<Record<string, string>>({});
  const [flagErrors, setFlagErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const totalChallenges = challenges.length;
  const completedCount = completedChallengeIds.length;
  const percent = Math.round((completedCount / totalChallenges) * 100);
  
  const passiveChallenges = challenges.filter(c => c.phase === 'passive');
  const activeChallenges = challenges.filter(c => c.phase === 'active');
  
  const completedPassiveCount = passiveChallenges.filter(c => completedChallengeIds.includes(c.id)).length;
  const completedActiveCount = activeChallenges.filter(c => completedChallengeIds.includes(c.id)).length;

  const nextChallenge = challenges.find(c => !completedChallengeIds.includes(c.id));

  // Compute total hints requested across all challenges
  const totalHintsRequested = Object.values(requestedHints).reduce((acc, curr) => acc + curr, 0);

  const toggleShowResolvedHint = (challengeId: string) => {
    setShowResolvedHints(prev => ({
      ...prev,
      [challengeId]: !prev[challengeId]
    }));
  };

  const getHintsUsedForChallenge = (challengeId: string): number => {
    const milestone = milestones.find(m => m.id === challengeId);
    if (milestone && milestone.hintsUsed !== undefined) {
      return milestone.hintsUsed;
    }
    return requestedHints[challengeId] || 0;
  };

  const handleFlagSubmit = (challengeId: string, expectedFlag: string) => {
    const inputVal = (flagInputs[challengeId] || '').trim();
    if (!inputVal) {
      setFlagErrors(prev => ({ ...prev, [challengeId]: 'Introduce la flag encontrada' }));
      return;
    }

    const cleanInput = inputVal.replace(/^["']|["']$/g, '').replace(/[.,;:]+$/, '').trim();

    if (cleanInput.toUpperCase() === expectedFlag.toUpperCase() || inputVal.toUpperCase() === expectedFlag.toUpperCase()) {
      setFlagErrors(prev => ({ ...prev, [challengeId]: '' }));
      if (onValidateFlag) {
        onValidateFlag(challengeId, expectedFlag);
      }
    } else {
      setFlagErrors(prev => ({ ...prev, [challengeId]: 'Flag incorrecta. Revisa el valor extraído.' }));
    }
  };

  const handleCopyReport = () => {
    const header = `=================================================================\n` +
      `  INFORME DE EVIDENCIAS FORENSES OSINT - PLÁTANOS DEL NORTE S.L.\n` +
      `=================================================================\n` +
      `Progreso general: ${completedCount}/${totalChallenges} retos superados (${percent}%)\n` +
      `  - Fase 1 (Pasiva / Google Dorks): ${completedPassiveCount}/${passiveChallenges.length}\n` +
      `  - Fases 2-4 (Activa / Intrusión & SCADA): ${completedActiveCount}/${activeChallenges.length}\n` +
      `Total de ayudas/consejos solicitados: ${totalHintsRequested}\n` +
      `Fecha de extracción: ${new Date().toLocaleString('es-ES')}\n` +
      `Objetivo evaluado: https://jdingeniero.github.io/Platanos-ai-studio\n\n`;

    const passiveSectionHeader = `-----------------------------------------------------------------\n` +
      `  FASE 1: RECOPILACIÓN PASIVA (GOOGLE DORKS - PÚBLICO E INDEXADO)\n` +
      `  Alcance: Legal, sin conexión directa ni acceso a áreas restringidas.\n` +
      `-----------------------------------------------------------------\n`;

    const passiveBody = passiveChallenges.map((c) => {
      const isDone = completedChallengeIds.includes(c.id);
      const m = milestones.find(item => item.id === c.id);
      const hintsUsed = getHintsUsedForChallenge(c.id);
      const hintsLabel = hintsUsed === 0 
        ? '0 ayudas (Resolución 100% autónoma)' 
        : `${hintsUsed} ayuda${hintsUsed > 1 ? 's' : ''} pedida${hintsUsed > 1 ? 's' : ''}`;

      if (isDone && m) {
        return `[✓ SUPERADO] ${c.code}: ${c.title}\n` +
          `  - Operador Dork: ${c.operator || 'Google Dork'}\n` +
          `  - Marca de tiempo: ${m.timestamp}\n` +
          `  - Flag de verificación: ${c.flag}\n` +
          `  - Evidencia: ${c.shortDesc}\n` +
          `  - Ayudas solicitadas en la resolución: ${hintsLabel}\n`;
      } else {
        return `[  PENDIENTE] ${c.code}: ${c.title}\n` +
          `  - Operador Dork: ${c.operator || 'Google Dork'}\n` +
          `  - Objetivo: ${c.shortDesc}\n` +
          `  - Ayudas solicitadas hasta ahora: ${hintsLabel}\n`;
      }
    }).join('\n');

    const activeSectionHeader = `\n-----------------------------------------------------------------\n` +
      `  FASES 2-4: HACKING ACTIVO, INTRUSIÓN Y ACCESO SCADA\n` +
      `  Alcance: Traspasa el perímetro público. Deja huella en servidor.\n` +
      `-----------------------------------------------------------------\n`;

    const activeBody = activeChallenges.map((c) => {
      const isDone = completedChallengeIds.includes(c.id);
      const m = milestones.find(item => item.id === c.id);
      const hintsUsed = getHintsUsedForChallenge(c.id);
      const hintsLabel = hintsUsed === 0 
        ? '0 ayudas (Resolución 100% autónoma)' 
        : `${hintsUsed} ayuda${hintsUsed > 1 ? 's' : ''} pedida${hintsUsed > 1 ? 's' : ''}`;

      if (isDone && m) {
        return `[✓ SUPERADO] ${c.code}: ${c.title}\n` +
          `  - Técnica: ${c.dorkSuggestion}\n` +
          `  - Marca de tiempo: ${m.timestamp}\n` +
          `  - Flag de verificación: ${c.flag}\n` +
          `  - Evidencia: ${c.shortDesc}\n` +
          `  - Ayudas solicitadas en la resolución: ${hintsLabel}\n`;
      } else {
        return `[  PENDIENTE] ${c.code}: ${c.title}\n` +
          `  - Técnica requerida: ${c.dorkSuggestion}\n` +
          `  - Objetivo: ${c.shortDesc}\n` +
          `  - Ayudas solicitadas hasta ahora: ${hintsLabel}\n`;
      }
    }).join('\n');

    let honeypotSection = '';
    if (honeypotLogs.length > 0) {
      honeypotSection = `\n=================================================================\n` +
        `  REGISTRO DE DETECCIONES HONEYPOT (HACKING ACTIVO / NO INDEXADO)\n` +
        `=================================================================\n` +
        `Total accesos no indexados detectados: ${honeypotLogs.length}\n\n` +
        honeypotLogs.map((log, idx) => 
          `[INCIDENTE #${idx + 1}] ${log.timestamp} | ${log.path}\n` +
          `  - Categoría: ${log.category}\n` +
          `  - IP Origen: ${log.simulatedIp}\n` +
          `  - Telemetría: ${log.reason}\n`
        ).join('\n');
    }

    const legalFooter = `\n=================================================================\n` +
      `  ADVERTENCIA DE COMPLIANCE LEGAL Y RESPONSABILIDAD PENAL\n` +
      `=================================================================\n` +
      `El hacking activo fuera de entornos controlados está tipificado en el Código Penal español:\n` +
      `  • Art. 197 CP: Descubrimiento y revelación de secretos (1 a 4 años de prisión).\n` +
      `  • Art. 197 bis CP: Acceso ilícito a sistemas informáticos (6 meses a 2 años de prisión).\n` +
      `  • Art. 264 CP: Daños informáticos y sabotaje a SCADA/infraestructura (2 a 5 años de prisión).\n` +
      `Todas las acciones activas quedan registradas en el Honeypot con IP y marca de tiempo.\n` +
      `-----------------------------------------------------------------\n` +
      `Fin del informe de auditoría.\n`;

    navigator.clipboard.writeText(header + passiveSectionHeader + passiveBody + activeSectionHeader + activeBody + honeypotSection + legalFooter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredChallenges = challenges.filter(c => {
    const isDone = completedChallengeIds.includes(c.id);
    if (filterMode === 'completed') return isDone;
    if (filterMode === 'pending') return !isDone;
    if (filterMode === 'passive') return c.phase === 'passive';
    if (filterMode === 'active') return c.phase === 'active';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/80 rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <span>Plataforma OSINT &amp; Laboratorio de Auditoría</span>
                  <span className="font-mono text-sm px-2.5 py-0.5 rounded-full bg-slate-900 text-emerald-400 font-bold">
                    {completedCount}/{totalChallenges}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                  <span>Fase 1 Pasiva (Google Dorks) + Fases 2-4 Activas (Intrusión &amp; SCADA)</span>
                  <span>·</span>
                  <span className="font-mono text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {totalHintsRequested === 0 ? '0 ayudas pedidas (100% Autónomo)' : `${totalHintsRequested} ayudas solicitadas`}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-100/60 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`py-3 px-4 border-b-2 font-medium flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
              activeTab === 'challenges'
                ? 'border-emerald-600 text-emerald-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Retos OSINT ({completedCount}/{totalChallenges})</span>
          </button>

          <button
            onClick={() => setActiveTab('honeypot')}
            className={`py-3 px-4 border-b-2 font-medium flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
              activeTab === 'honeypot'
                ? 'border-rose-600 text-rose-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Sensor Honeypot ({honeypotLogs.length} alertas)</span>
            {honeypotLogs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[10px]">
                {honeypotLogs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`py-3 px-4 border-b-2 font-medium flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
              activeTab === 'legal'
                ? 'border-indigo-600 text-indigo-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Debrief Legal &amp; Código Penal</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {activeTab === 'challenges' && (
            <>
              {/* Progress Banner */}
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-slate-200">Progreso Total de la Auditoría:</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      {completedCount} de {totalChallenges} Retos Superados
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-slate-300">
                    <span className="text-amber-400 font-semibold">
                      💡 {totalHintsRequested} ayudas pedidas
                    </span>
                    <span className="text-slate-400">
                      {percent}% Completado
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 via-sky-400 to-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-0.5 font-mono gap-2">
                  <span className={completedPassiveCount === 6 ? 'text-emerald-400 font-bold' : ''}>
                    Fase 1: Dorks Pasivos ({completedPassiveCount}/6)
                  </span>
                  <span className={completedActiveCount >= 3 ? 'text-emerald-400 font-bold' : ''}>
                    Fase 2-3: Fuga e Intrusión ({Math.min(completedActiveCount, 5)}/5)
                  </span>
                  <span className={completedActiveCount === 7 ? 'text-emerald-400 font-bold' : ''}>
                    Fase 4: SCADA &amp; Exfiltración ({completedActiveCount >= 6 ? completedActiveCount - 5 : 0}/2)
                  </span>
                </div>
              </div>

              {/* Next Challenge Recommendation (Hints hidden by default) */}
              {nextChallenge ? (
                <div className={`p-4 border-2 rounded-xl space-y-3 ${
                  nextChallenge.phase === 'passive'
                    ? 'bg-sky-500/10 border-sky-500/40'
                    : 'bg-amber-500/10 border-amber-500/40'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
                      <Lightbulb className={`w-4 h-4 shrink-0 ${nextChallenge.phase === 'passive' ? 'text-sky-600' : 'text-amber-600'}`} />
                      <span className={nextChallenge.phase === 'passive' ? 'text-sky-900' : 'text-amber-900'}>
                        Siguiente Reto: {nextChallenge.code} · {nextChallenge.phaseLabel}
                      </span>
                    </div>
                    {nextChallenge.operator && (
                      <span className="font-mono text-[11px] bg-sky-100 text-sky-900 px-2 py-0.5 rounded font-bold border border-sky-300">
                        Operador: {nextChallenge.operator}
                      </span>
                    )}
                  </div>

                  <h4 className="text-slate-900 font-bold text-sm">
                    {nextChallenge.title}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {nextChallenge.shortDesc}
                  </p>

                  {/* Hidden / Progressive Clues for Next Challenge */}
                  <div className="space-y-2 pt-1 border-t border-slate-200">
                    {(() => {
                      const hintsCount = requestedHints[nextChallenge.id] || 0;
                      const hints = nextChallenge.hints || [nextChallenge.hint];
                      const maxHints = hints.length;

                      if (hintsCount === 0) {
                        return (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white/90 rounded-lg border border-slate-300">
                            <div className="text-xs text-slate-600">
                              <span className="font-semibold text-slate-900 block">🔒 Ayuda oculta para este reto</span>
                              <span>Ponte a prueba resolviéndolo de forma autónoma. Si necesitas un empujón, solicita un consejo:</span>
                            </div>
                            <button
                              onClick={() => onRequestHint(nextChallenge.id)}
                              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
                            >
                              <Lightbulb className="w-3.5 h-3.5" />
                              <span>Pedir consejo (1/{maxHints})</span>
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-2">
                          <div className="space-y-1.5">
                            {hints.slice(0, hintsCount).map((hintText, idx) => (
                              <div key={idx} className="p-2.5 bg-white rounded-lg border border-amber-300 text-xs space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono block">
                                  Pista {idx + 1} ({idx === 0 ? 'Orientación' : idx === 1 ? 'Operador/Técnica' : 'Dork / Paso a paso'}):
                                </span>
                                <p className="text-slate-800 leading-relaxed font-medium">
                                  {hintText}
                                </p>
                              </div>
                            ))}
                          </div>

                          {hintsCount < maxHints ? (
                            <button
                              onClick={() => onRequestHint(nextChallenge.id)}
                              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Lightbulb className="w-3.5 h-3.5" />
                              <span>Pedir siguiente consejo ({hintsCount + 1}/{maxHints})</span>
                            </button>
                          ) : (
                            <div className="p-2 bg-amber-100 text-amber-900 rounded text-center text-xs font-mono font-semibold">
                              ✓ Has desbloqueado todos los consejos disponibles ({maxHints}/{maxHints})
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                </div>
              ) : (
                <div className="p-5 bg-emerald-500/10 border-2 border-emerald-500/40 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-xs">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-emerald-950">
                        ¡Auditoría Completa Superada ({totalChallenges}/{totalChallenges})!
                      </h4>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Has dominado la Fase 1 pasiva con Google Dorks y las Fases 2 a 4 de intrusión, elevación de privilegios, manipulación SCADA y exfiltración.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-emerald-200 flex justify-end">
                    <button
                      onClick={() => setActiveTab('legal')}
                      className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Scale className="w-4 h-4" />
                      <span>Ver Debrief Legal y Compliance Penal</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Challenge Filter & List */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Catálogo de Retos ({challenges.length})</span>
                  </h4>
                  <div className="flex flex-wrap items-center gap-1 text-xs">
                    <button
                      onClick={() => setFilterMode('all')}
                      className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                        filterMode === 'all' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Todos ({challenges.length})
                    </button>
                    <button
                      onClick={() => setFilterMode('passive')}
                      className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                        filterMode === 'passive' ? 'bg-sky-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Fase 1 Pasiva ({passiveChallenges.length})
                    </button>
                    <button
                      onClick={() => setFilterMode('active')}
                      className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                        filterMode === 'active' ? 'bg-amber-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Fases Activas ({activeChallenges.length})
                    </button>
                    <button
                      onClick={() => setFilterMode('pending')}
                      className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                        filterMode === 'pending' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Pendientes ({totalChallenges - completedCount})
                    </button>
                    <button
                      onClick={() => setFilterMode('completed')}
                      className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                        filterMode === 'completed' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Superados ({completedCount})
                    </button>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {filteredChallenges.map((challenge, index) => {
                    const isDone = completedChallengeIds.includes(challenge.id);
                    const milestone = milestones.find(m => m.id === challenge.id);
                    const hintsUsed = getHintsUsedForChallenge(challenge.id);
                    const hintsList = challenge.hints || [challenge.hint];
                    const maxHints = hintsList.length;

                    return (
                      <div 
                        key={challenge.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isDone 
                            ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs' 
                            : challenge.phase === 'passive'
                              ? 'bg-white border-slate-200 hover:border-sky-300'
                              : 'bg-white border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">
                              {isDone ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                  <Check className="w-4 h-4 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 border border-slate-300 flex items-center justify-center font-mono text-xs font-bold">
                                  {index + 1}
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                                  challenge.phase === 'passive'
                                    ? 'bg-sky-50 text-sky-800 border-sky-200'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}>
                                  {challenge.code}
                                </span>
                                {challenge.operator && (
                                  <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200 font-semibold">
                                    {challenge.operator}
                                  </span>
                                )}
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {challenge.phaseLabel}
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-900 text-sm">
                                {challenge.title}
                              </h4>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {challenge.shortDesc}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            {isDone ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                                ✓ Conseguido
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 font-mono">
                                ⏳ Pendiente
                              </span>
                            )}
                            {isDone && milestone && (
                              <span className="block text-[10px] text-slate-400 font-mono mt-1">
                                {milestone.timestamp}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* RESOLUTION SECTION: Indicator of how many helps were requested */}
                        {isDone && (
                          <div className="mt-3.5 space-y-2">
                            <div className="p-2.5 rounded-lg border text-xs font-mono flex flex-wrap items-center justify-between gap-2 bg-white">
                              <div className="flex items-center gap-2">
                                {hintsUsed === 0 ? (
                                  <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                    <span>Superado sin ayudas (0 consejos pedidos) · ¡Máxima puntuación!</span>
                                  </span>
                                ) : hintsUsed === 1 ? (
                                  <span className="flex items-center gap-1.5 font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                                    <Lightbulb className="w-3.5 h-3.5 text-sky-600" />
                                    <span>Superado con 1 ayuda solicitada</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Superado con {hintsUsed} ayudas solicitadas</span>
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => toggleShowResolvedHint(challenge.id)}
                                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-sans"
                              >
                                <span>{showResolvedHints[challenge.id] ? 'Ocultar pistas' : 'Ver pistas'}</span>
                                {showResolvedHints[challenge.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            </div>

                            {showResolvedHints[challenge.id] && (
                              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs">
                                <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wide block">
                                  Consejos asociados a este reto:
                                </span>
                                {hintsList.map((h, hIdx) => (
                                  <div key={hIdx} className="text-slate-600 leading-relaxed pl-2 border-l-2 border-slate-300">
                                    <strong className="text-slate-700">Pista {hIdx + 1}:</strong> {h}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Flag box */}
                            <div className="p-2.5 bg-slate-900 rounded-lg text-emerald-400 font-mono text-xs font-bold flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span>Flag: {challenge.flag}</span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-sans font-normal">Verificado</span>
                            </div>
                          </div>
                        )}

                        {/* PENDING SECTION: Hint hidden by default, shown step-by-step as user asks for advice */}
                        {!isDone && (
                          <div className="mt-3.5 space-y-3">
                            
                            {/* Interactive Flag Submission Box */}
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Validación de Flag en Cliente:</span>
                                </label>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Formato: FLAG-...
                                </span>
                              </div>

                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={flagInputs[challenge.id] || ''}
                                  onChange={(e) => {
                                    setFlagInputs(prev => ({ ...prev, [challenge.id]: e.target.value }));
                                    setFlagErrors(prev => ({ ...prev, [challenge.id]: '' }));
                                  }}
                                  placeholder={`Pega aquí la ${challenge.flag.split('-')[0]}-...`}
                                  className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button
                                  onClick={() => handleFlagSubmit(challenge.id, challenge.flag)}
                                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 shadow-xs"
                                >
                                  <Send className="w-3 h-3 text-emerald-400" />
                                  <span>Validar</span>
                                </button>
                              </div>

                              {flagErrors[challenge.id] && (
                                <p className="text-[11px] text-rose-600 font-medium">
                                  {flagErrors[challenge.id]}
                                </p>
                              )}
                            </div>

                            {/* Progressive Hint Request Box */}
                            {hintsUsed === 0 ? (
                              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="text-xs text-slate-600 space-y-0.5">
                                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Ayuda oculta (0/{maxHints} pistas solicitadas)</span>
                                  </div>
                                  <p className="text-[11px] text-slate-500">
                                    Las pistas están ocultas para permitirte resolver el reto de forma autónoma.
                                  </p>
                                </div>
                                <button
                                  onClick={() => onRequestHint(challenge.id)}
                                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
                                >
                                  <Lightbulb className="w-3.5 h-3.5" />
                                  <span>Pedir consejo (1/{maxHints})</span>
                                </button>
                              </div>
                            ) : (
                              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2.5">
                                <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 pb-1.5">
                                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                                    <Lightbulb className="w-4 h-4 text-amber-600" />
                                    <span>Consejos solicitados: {hintsUsed} de {maxHints}</span>
                                  </div>
                                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                                    {hintsUsed} {hintsUsed === 1 ? 'ayuda pedida' : 'ayudas pedidas'}
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  {hintsList.slice(0, hintsUsed).map((hintText, hIndex) => (
                                    <div key={hIndex} className="p-2 bg-white rounded border border-amber-200 text-xs space-y-0.5">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono block">
                                        Pista {hIndex + 1} ({hIndex === 0 ? 'Orientación' : hIndex === 1 ? 'Operador/Técnica' : 'Dork / Solución guiada'}):
                                      </span>
                                      <p className="text-slate-800 leading-relaxed font-medium">
                                        {hintText}
                                      </p>
                                    </div>
                                  ))}
                                </div>

                                {hintsUsed < maxHints ? (
                                  <button
                                    onClick={() => onRequestHint(challenge.id)}
                                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <Lightbulb className="w-3.5 h-3.5" />
                                    <span>Pedir siguiente consejo ({hintsUsed + 1}/{maxHints})</span>
                                  </button>
                                ) : (
                                  <div className="p-2 bg-amber-100/80 text-amber-900 rounded text-center text-[11px] font-mono font-semibold">
                                    ✓ Todos los consejos disponibles para este reto han sido desbloqueados ({maxHints}/{maxHints}).
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {activeTab === 'honeypot' && (
            <div className="space-y-4">
              {/* Honeypot Intro */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-rose-950">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide text-rose-800">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Detección de Hacking Activo / Trampas Honeypot</span>
                  </div>
                  {honeypotLogs.length > 0 && onClearHoneypotLogs && (
                    <button
                      onClick={onClearHoneypotLogs}
                      className="text-xs text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Limpiar registro</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-rose-800/90 leading-relaxed">
                  Cuando un alumno o auditor navega hacia recursos que <strong>no están en el sitemap de Google</strong> (como /internal-docs/, /backup-2023/, /chat/logs/, /admin-panel, o rutas trampa de robots.txt), el sensor honeypot intercepta la petición y la cataloga como <strong>Hacking Activo</strong> en lugar de búsqueda pasiva indexada.
                </p>
              </div>

              {/* Incidents Table / List */}
              {honeypotLogs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 space-y-2">
                  <ShieldCheck className="w-8 h-8 mx-auto text-emerald-500" />
                  <p className="text-sm font-semibold text-slate-700">Sin incidentes de hacking activo registrados todavía</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Solo has visitado páginas públicas indexadas (/prensa-2024, /documentos, /recursos, /quienes-somos, /instalaciones, /catalogo, /contacto). Si navegas hacia directorios privados o archivos ocultos, se activará el honeypot.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-1">
                    <span>{honeypotLogs.length} EVENTOS INTERCEPTADOS EN ESTA SESIÓN</span>
                    <span>ORIGEN: CLIENTE AUDITOR (192.168.1.105)</span>
                  </div>

                  <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                    {honeypotLogs.map((incident, i) => (
                      <div 
                        key={incident.id} 
                        className="p-3 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-500" />
                            <span>INCIDENTE #{honeypotLogs.length - i}</span>
                          </span>
                          <span className="text-slate-400">{incident.timestamp}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px]">
                          <div>
                            <span className="text-slate-500 block">Ruta no indexada accedida:</span>
                            <span className="text-emerald-400 font-bold">{incident.path}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Clasificación:</span>
                            <span className="text-amber-400">{incident.category}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">IP Simulada / Origen:</span>
                            <span className="text-slate-300">{incident.simulatedIp}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Motivo Detección:</span>
                            <span className="text-slate-400 truncate block" title={incident.reason}>{incident.reason}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-6">
              {/* Debrief Header */}
              <div className="p-5 bg-indigo-950 text-white rounded-2xl space-y-3 border border-indigo-800">
                <div className="flex items-center gap-2 text-indigo-300 font-mono text-xs font-bold uppercase tracking-wider">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>Debrief Legal &amp; Compliance en Ciberseguridad</span>
                </div>
                <h3 className="text-lg font-black text-white">
                  Límites Penales entre OSINT Pasivo y Delito de Intrusión Informática
                </h3>
                <p className="text-xs text-indigo-200 leading-relaxed">
                  En este laboratorio has experimentado la frontera exacta donde termina la recopilación de inteligencia de fuentes abiertas (OSINT) y comienza el <strong>Hacking Activo</strong> sancionable por el Código Penal.
                </p>
              </div>

              {/* Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Fase 1: Recopilación Pasiva (Legal)</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Consultar páginas que los motores de búsqueda (Google) han indexado libremente mediante operadores (<code>site:</code>, <code>filetype:</code>, <code>inurl:</code>) <strong>no interactúa con el servidor de la víctima</strong>. Los datos provienen de la caché pública del buscador y no vulneran medidas de seguridad perimetral.
                  </p>
                  <span className="inline-block text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Sin impacto en logs ni Honeypot
                  </span>
                </div>

                <div className="p-4 bg-rose-50/70 border border-rose-300 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Fases 2-4: Intrusión Activa (Delito)</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Al introducir manualmente rutas vetadas en <code>robots.txt</code>, descargar ficheros de contraseñas, autenticarse como otro empleado y alterar el SCADA, <strong>se establece conexión directa no autorizada</strong>. Toda acción queda registrada con IP, agente y marca de tiempo en los cortafuegos y Honeypots.
                  </p>
                  <span className="inline-block text-[10px] font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                    Trazabilidad forense total en servidores
                  </span>
                </div>
              </div>

              {/* Penal Code Articles */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Artículos Aplicables del Código Penal Español (Ley Orgánica 10/1995)</span>
                </h4>

                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 font-mono text-sm">Artículo 197 CP · Revelación y Descubrimiento de Secretos</span>
                      <span className="text-[11px] font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">1 a 4 años de prisión</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Castiga a quien, para descubrir los secretos o vulnerar la intimidad de otro, sin su consentimiento, se apodere de sus papeles, cartas, mensajes de correo electrónico o cualesquiera otros documentos o efectos personales, interceptare sus telecomunicaciones o utilizare artificios técnicos de escucha, transmisión, grabación o reproducción del sonido o de la imagen.
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono pt-1">
                      → Se consuma al extraer y descargar el fichero de contraseñas <code>control_acceso_proveedores_2023.xls</code> o el expediente confidencial Nivel 3.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 font-mono text-sm">Artículo 197 bis CP · Acceso Ilícito a Sistemas Informáticos</span>
                      <span className="text-[11px] font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">6 meses a 2 años de prisión</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Sanciona a quien por cualquier medio o procedimiento, vulnerando las medidas de seguridad establecidas para impedirlo, y sin estar debidamente autorizado, acceda o facilite a otro el acceso al conjunto o a una parte de un sistema de información o se mantenga en él en contra de la voluntad de quien tenga el legítimo derecho a excluirlo.
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono pt-1">
                      → Se consuma al acceder al panel privado <code>/admin-panel</code> utilizando credenciales filtradas de otro usuario.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 font-mono text-sm">Artículo 264 CP · Daños Informáticos y Sabotaje SCADA</span>
                      <span className="text-[11px] font-mono text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300 font-bold">2 a 5 años de prisión</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      El que por cualquier medio, sin autorización y de manera grave borrase, dañase, deteriorase, alterase, suprimiese o hiciese inaccesibles datos informáticos, programas informáticos o documentos electrónicos ajenos. Las penas se agravan sustancialmente cuando se ataca una <strong>infraestructura crítica</strong> o el suministro de servicios esenciales (cámaras frigoríficas de la cadena alimentaria).
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono pt-1">
                      → Se consuma al forzar comandos sobre el PLC industrial de la Cámara 4 de maduración de etileno.
                    </p>
                  </div>
                </div>
              </div>

              {/* Rules of Engagement */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <span className="font-bold block text-sm">Condición indispensable en Auditorías Reales (Pentesting):</span>
                <p className="leading-relaxed">
                  Para realizar pruebas activas de intrusión es <strong>legalmente obligatorio contar con un contrato previo de encargo por escrito</strong> (Rules of Engagement) firmado por los apoderados legales de la entidad propietaria, delimitando IPs de origen, horarios y sistemas autorizados. Cualquier prueba no amparada en dicha autorización escrita es delito.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Informe Forense Copiado!' : 'Copiar Informe de Evidencias'}</span>
            </button>

            <button
              onClick={onReset}
              className="px-3 py-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reiniciar retos para volver a practicarlos"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Auditoría</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-mono text-xs">
            <span>
              Pasivos: <strong className="text-sky-700 font-bold">{completedPassiveCount}/6</strong>
            </span>
            <span>·</span>
            <span>
              Activos: <strong className="text-amber-700 font-bold">{completedActiveCount}/7</strong>
            </span>
            <span>·</span>
            <span>
              Total: <strong className="text-slate-900 font-bold">{completedCount}/{totalChallenges}</strong>
            </span>
            <span>·</span>
            <span className="text-amber-700 font-bold">
              💡 {totalHintsRequested} ayudas
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
