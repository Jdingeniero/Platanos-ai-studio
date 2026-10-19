import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Folder, 
  FileText, 
  Server, 
  Download, 
  ExternalLink, 
  ArrowLeft,
  Calendar,
  CheckCircle,
  FileCode,
  ShieldCheck,
  Cpu,
  Key,
  AlertTriangle,
  Copy,
  Check,
  Sliders,
  LogOut,
  Award,
  ShieldAlert
} from 'lucide-react';
import { TARGET_DOMAIN } from './data/targetCompany';
import { OFFICIAL_CHALLENGES, Challenge } from './data/challenges';
import { 
  HoneypotIncident, 
  isIndexedPath, 
  isHoneypotTrap,
  recordHoneypotIncident, 
  getHoneypotLogs, 
  clearHoneypotLogs 
} from './data/honeypot';
import { usePageMeta } from './hooks/usePageMeta';
import { Inicio } from './pages/Inicio';
import { QuienesSomos } from './pages/QuienesSomos';
import { Instalaciones } from './pages/Instalaciones';
import { Catalogo } from './pages/Catalogo';
import { Contacto } from './pages/Contacto';
import { Actualidad } from './pages/Actualidad';
import { Prensa2024 } from './pages/Prensa2024';
import { Documentos } from './pages/Documentos';
import { Recursos } from './pages/Recursos';
import { NotFound } from './pages/NotFound';
import { RetosModal, MilestoneRecord } from './components/RetosModal';
import { HoneypotAlertModal } from './components/HoneypotAlertModal';

const STORAGE_CHALLENGES_KEY = 'platanos_completed_challenges_v5';
const STORAGE_MILESTONES_KEY = 'platanos_osint_milestones_v5';
const STORAGE_AUTH_KEY = 'platanos_intranet_auth_v3';
const STORAGE_HINTS_KEY = 'platanos_hints_requested_v4';

// Proactive purge of obsolete legacy keys that pre-populated 7/13 challenges
try {
  const legacyKeys = [
    'platanos_osint_milestones_v2',
    'platanos_osint_milestones_v3',
    'platanos_osint_milestones_v4',
    'platanos_completed_challenges_v1',
    'platanos_completed_challenges_v2',
    'platanos_completed_challenges_v3',
    'platanos_completed_challenges_v4',
    'platanos_intranet_auth_v1',
    'platanos_intranet_auth_v2'
  ];
  legacyKeys.forEach(k => localStorage.removeItem(k));
} catch {}

const INTERNAL_PAGE_META: Record<string, { title: string; description: string }> = {
  '/actualidad': {
    title: 'Actualidad | Plátanos del Norte S.L.',
    description: 'Actualidad corporativa, acuerdos agrícolas y comunicados oficiales de Plátanos del Norte S.L.'
  },
  '/404': {
    title: '404 - Página no encontrada | Plátanos del Norte S.L.',
    description: 'Error 404: La página solicitada no existe en el servidor web.'
  },
  '/prensa-2024': {
    title: 'Sala de prensa 2024 | Plátanos del Norte S.L.',
    description: 'Comunicados oficiales, notas de prensa y convenios agrícolas de Plátanos del Norte S.L. durante el ejercicio 2024.'
  },
  '/documentos': {
    title: 'Documentos públicos | Plátanos del Norte S.L.',
    description: 'Repositorio público de tarifas comerciales, calendarios de recogida y fichas técnicas oficiales.'
  },
  '/recursos': {
    title: 'Index of /recursos/',
    description: 'Apache directory index of /recursos/ containing public logos, brand guidelines and marketing assets.'
  },
  '/internal-docs/': {
    title: 'Index of /internal-docs/',
    description: 'Apache/2.4.52 (Ubuntu) Server at platanosdelnorte.es Port 443'
  },
  '/backup-2023/': {
    title: 'Index of /backup-2023/',
    description: 'Apache/2.4.52 (Ubuntu) Server at platanosdelnorte.es Port 443'
  },
  '/chat/logs/': {
    title: 'Index of /chat/logs/',
    description: 'Apache/2.4.52 (Ubuntu) Server at platanosdelnorte.es Port 443'
  },
  '/admin-panel': {
    title: 'Acceso Intranet Operaciones | Plátanos del Norte S.L.',
    description: 'Portal restringido de gestión SCADA y cámaras frigoríficas.'
  },
  '/robots.txt': {
    title: 'robots.txt | Plátanos del Norte S.L.',
    description: 'Configuración de rastreadores web para Plátanos del Norte S.L.'
  },
  '/sitemap.xml': {
    title: 'sitemap.xml | Plátanos del Norte S.L.',
    description: 'Índice XML de rastreo con 11 URLs públicas e indexables.'
  }
};

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedNewsId, setSelectedNewsId] = useState<number>(1);

  // Sync title & description for internal utility routes
  useEffect(() => {
    const meta = INTERNAL_PAGE_META[currentPath];
    if (meta) {
      document.title = meta.title;
      let m = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!m) {
        m = document.createElement('meta');
        m.name = 'description';
        document.head.appendChild(m);
      }
      m.setAttribute('content', meta.description);
    }
  }, [currentPath]);

  // Authentication State for Intranet
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_AUTH_KEY) === 'true';
  });
  const [usernameInput, setUsernameInput] = useState<string>('cmendizabal');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // SCADA Chamber Interactive States
  const [chamber4Temp, setChamber4Temp] = useState<number>(13.8);
  const [chamber4Ethylene, setChamber4Ethylene] = useState<number>(1000);
  const [chamberStatusMessage, setChamberStatusMessage] = useState<string | null>(null);

  // Completed Challenges tracking (x / total)
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_CHALLENGES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Milestone Records (Chained CTF flags)
  const [milestones, setMilestones] = useState<MilestoneRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_MILESTONES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Hints / Advice requested tracking per challenge (Pedir consejo)
  const [requestedHints, setRequestedHints] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(STORAGE_HINTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });

  const handleRequestHint = (challengeId: string) => {
    setRequestedHints(prev => {
      const current = prev[challengeId] || 0;
      const challenge = OFFICIAL_CHALLENGES.find(c => c.id === challengeId);
      const maxHints = challenge?.hints?.length || 3;
      if (current >= maxHints) return prev;
      const updated = { ...prev, [challengeId]: current + 1 };
      localStorage.setItem(STORAGE_HINTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const [showLogDrawer, setShowLogDrawer] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const [honeypotLogs, setHoneypotLogs] = useState<HoneypotIncident[]>(getHoneypotLogs);
  const [activeHoneypotIncident, setActiveHoneypotIncident] = useState<HoneypotIncident | null>(null);
  const [isHoneypotAlertOpen, setIsHoneypotAlertOpen] = useState<boolean>(false);
  const [modalInitialTab, setModalInitialTab] = useState<'challenges' | 'honeypot'>('challenges');
  const [trappedPath, setTrappedPath] = useState<string>('');

  const showNotification = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3500);
  };

  const checkHoneypotAccess = (path: string) => {
    if (isHoneypotTrap(path)) {
      const incident = recordHoneypotIncident(path);
      if (incident) {
        setHoneypotLogs(getHoneypotLogs());
        setActiveHoneypotIncident(incident);
        setIsHoneypotAlertOpen(true);
      }
    }
  };

  const registerChallenge = (challengeId: string) => {
    const challenge = OFFICIAL_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return;

    const hintsUsed = requestedHints[challengeId] || 0;

    setCompletedChallengeIds(prev => {
      if (prev.includes(challengeId)) return prev;
      const updated = [...prev, challengeId];
      localStorage.setItem(STORAGE_CHALLENGES_KEY, JSON.stringify(updated));
      const hintsNote = hintsUsed === 0 ? ' (¡0 ayudas pedidas!)' : ` (${hintsUsed} ayuda${hintsUsed > 1 ? 's' : ''} pedida${hintsUsed > 1 ? 's' : ''})`;
      showNotification(`¡Reto Superado (${updated.length}/${OFFICIAL_CHALLENGES.length})! ${challenge.code}: ${challenge.title}${hintsNote}`);
      return updated;
    });

    setMilestones(prev => {
      if (prev.some(m => m.id === challengeId)) return prev;
      const newRecord: MilestoneRecord = {
        id: challengeId,
        code: challenge.code,
        title: challenge.title,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        flag: challenge.flag,
        description: challenge.shortDesc,
        hintsUsed: hintsUsed
      };
      const updated = [...prev, newRecord];
      localStorage.setItem(STORAGE_MILESTONES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleValidateFlag = (challengeId: string, flagInput: string): boolean => {
    const challenge = OFFICIAL_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return false;
    const cleanInput = flagInput.trim().replace(/^["']|["']$/g, '').replace(/[.,;:]+$/, '').trim().toUpperCase();
    if (challenge.flag.toUpperCase() === cleanInput || challenge.flag.toUpperCase() === flagInput.trim().toUpperCase()) {
      registerChallenge(challenge.id);
      return true;
    }
    return false;
  };

  const handleResetProgress = () => {
    if (window.confirm('¿Deseas reiniciar tu progreso en los 13 retos y el contador de ayudas para volver a practicarlos?')) {
      setCompletedChallengeIds([]);
      setMilestones([]);
      setRequestedHints({});
      setIsAuthenticated(false);
      try {
        const keysToRemove = [
          STORAGE_CHALLENGES_KEY,
          STORAGE_MILESTONES_KEY,
          STORAGE_HINTS_KEY,
          STORAGE_AUTH_KEY,
          'platanos_osint_milestones_v2',
          'platanos_osint_milestones_v3',
          'platanos_osint_milestones_v4',
          'platanos_osint_milestones_v5',
          'platanos_completed_challenges_v1',
          'platanos_completed_challenges_v2',
          'platanos_completed_challenges_v3',
          'platanos_completed_challenges_v4',
          'platanos_completed_challenges_v5',
          'platanos_intranet_auth_v1',
          'platanos_intranet_auth_v2',
          'platanos_intranet_auth_v3'
        ];
        keysToRemove.forEach(k => localStorage.removeItem(k));
      } catch {}
      showNotification('Progreso reiniciado: 0/13 retos y ayudas a 0.');
    }
  };

  const isInitialMount = React.useRef(true);

  // Sync with browser URL / history on initial load and back/forward navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const p = window.location.pathname;
      const search = window.location.search;
      const isDirectAccess = isInitialMount.current;
      isInitialMount.current = false;

      // Honeypot check: ONLY activates on explicit Disallow trap routes
      checkHoneypotAccess(p);

      // Passive challenges: only awarded on direct link access (from Google Dork search result / direct URL)
      // Never unlocked by clicking internal navigation buttons.
      if (isDirectAccess) {
        if (p === '/robots.txt') {
          registerChallenge('reto-1');
        } else if (p.startsWith('/prensa-2024')) {
          registerChallenge('pasivo-1');
        } else if (p.startsWith('/catalogo')) {
          registerChallenge('pasivo-2');
        } else if (p === '/documentos' || p === '/documentos/') {
          registerChallenge('pasivo-3');
        } else if (p.startsWith('/recursos')) {
          registerChallenge('pasivo-6');
        } else if (p.startsWith('/internal-docs')) {
          registerChallenge('reto-2');
        } else if (p.startsWith('/backup-2023') || p.startsWith('/chat/logs')) {
          registerChallenge('reto-3');
        }
      }

      // Route Dispatcher
      if (p === '/' || p === '') {
        setCurrentPath('/');
      } else if (p === '/robots.txt') {
        setCurrentPath('/robots.txt');
      } else if (p === '/sitemap.xml') {
        setCurrentPath('/sitemap.xml');
      } else if (p === '/quienes-somos' || p.startsWith('/quienes-somos')) {
        setCurrentPath('/quienes-somos');
      } else if (p === '/instalaciones' || p.startsWith('/instalaciones')) {
        setCurrentPath('/instalaciones');
      } else if (p === '/catalogo' || p.startsWith('/catalogo')) {
        setCurrentPath('/catalogo');
      } else if (p === '/contacto' || p.startsWith('/contacto')) {
        setCurrentPath('/contacto');
      } else if (p === '/actualidad' || p.startsWith('/actualidad')) {
        setCurrentPath('/actualidad');
        if (search.includes('id=')) {
          const params = new URLSearchParams(search);
          const id = parseInt(params.get('id') || '1', 10);
          setSelectedNewsId(id);
        }
      } else if (p === '/prensa-2024' || p.startsWith('/prensa-2024')) {
        setCurrentPath('/prensa-2024');
      } else if (p === '/documentos' || p === '/documentos/') {
        setCurrentPath('/documentos');
      } else if (p === '/recursos' || p.startsWith('/recursos')) {
        setCurrentPath('/recursos');
      } else if (p.startsWith('/admin-panel')) {
        setCurrentPath('/admin-panel');
      } else if (p.startsWith('/internal-docs')) {
        setCurrentPath('/internal-docs/');
      } else if (p.startsWith('/backup-2023')) {
        setCurrentPath('/backup-2023/');
      } else if (p.startsWith('/chat/logs')) {
        setCurrentPath('/chat/logs/');
      } else if (
        p.startsWith('/rh-nominas') || 
        p.startsWith('/staging-api') || 
        p.startsWith('/camaras-cctv') || 
        p.startsWith('/cgi-bin')
      ) {
        setCurrentPath('/honeypot-trap');
        setTrappedPath(p);
      } else {
        // Soft-404 eliminated: unknown routes render NotFound with true 404 state without triggering honeypot
        setCurrentPath('/404');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path: string, queryParam?: number) => {
    let targetUrl = path;
    if (queryParam !== undefined) {
      targetUrl = `${path}?id=${queryParam}`;
      setSelectedNewsId(queryParam);
    }
    try {
      if (window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState({}, '', targetUrl);
      }
    } catch (e) {
      console.warn('History pushState error:', e);
    }
    setCurrentPath(path);
    // Honeypot check only activates on sensitive trap routes
    checkHoneypotAccess(path);

    // Unlocking challenges by clicking in-app navigation buttons is forbidden.
    // Challenges require direct link access or explicit flag submission in CTF modal.
    if (
      path.startsWith('/rh-nominas') || 
      path.startsWith('/staging-api') || 
      path.startsWith('/camaras-cctv') || 
      path.startsWith('/cgi-bin')
    ) {
      setCurrentPath('/honeypot-trap');
      setTrappedPath(path);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const userClean = usernameInput.trim().toLowerCase();
    const passClean = passwordInput.trim();

    // Check valid credentials leaked in control_acceso_proveedores_2023.xls, db_dump_preprod.sql and chat logs!
    const isCmendizabal = (userClean === 'cmendizabal' || userClean === 'carlos.mendizabal' || userClean === 'c.mendizabal') && 
                          (passClean === 'PlatanosCandina2023*!' || passClean === 'PlatanosMySQL2023!#');
    const isAdmin = (userClean === 'admin' || userClean === 'admin@platanosdelnorte.es') && 
                    (passClean === 'PlatanosAdmin2023!' || passClean === 'PlatanosCandina2023*!');

    if (isCmendizabal || isAdmin) {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_AUTH_KEY, 'true');
      registerChallenge('reto-5');
      showNotification('¡Acceso concedido! Entrando en la Intranet de Operaciones...');
    } else {
      setLoginError('Credenciales incorrectas o cuenta de usuario bloqueada. Revisa los ficheros de acceso internos.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_AUTH_KEY);
    setPasswordInput('');
  };

  const handleAdjustChamber = (deltaTemp: number, deltaEthylene: number) => {
    setChamber4Temp(prev => Math.round((prev + deltaTemp) * 10) / 10);
    setChamber4Ethylene(prev => prev + deltaEthylene);
    setChamberStatusMessage('Comando SCADA transmitido al PLC Siemens S7-1200 en 10.0.4.12:102.');
    registerChallenge('reto-6');
    setTimeout(() => setChamberStatusMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-amber-300 selection:text-slate-950">
      
      {/* =========================================================================
          Top Bar: Authentic Corporate Header
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element Brand Wordmark */}
          <button 
            onClick={() => navigateTo('/')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-base shadow-xs">
              🍌
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                Plátanos del Norte S.L.
              </span>
              <span className="text-[11px] text-slate-500 block leading-tight">
                Maduración y Distribución Frutícola · Santander
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => navigateTo('/')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700 py-1' : ''
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => navigateTo('/quienes-somos')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/quienes-somos' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700 py-1' : ''
              }`}
            >
              Quiénes Somos / Equipo
            </button>
            <button
              onClick={() => navigateTo('/instalaciones')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/instalaciones' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700 py-1' : ''
              }`}
            >
              Instalaciones & Cámaras
            </button>
            <button
              onClick={() => navigateTo('/catalogo')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/catalogo' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700 py-1' : ''
              }`}
            >
              Catálogo Comercial
            </button>
            <button
              onClick={() => navigateTo('/actualidad')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/actualidad' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700 py-1' : ''
              }`}
            >
              Actualidad
            </button>
            <button
              onClick={() => navigateTo('/contacto')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/contacto' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700 py-1' : ''
              }`}
            >
              Contacto
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action (Intranet Login / Status) */}
          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <button
                onClick={() => navigateTo('/admin-panel')}
                className="px-3.5 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Intranet Activa (cmendizabal)</span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('/admin-panel')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-600" />
                <span>Acceso Intranet</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          Main Content Routing
         ========================================================================= */}
      <main className="flex-1">

        {/* =====================================================================
            1. HOME PAGE (/)
           ===================================================================== */}
        {currentPath === '/' && <Inicio navigateTo={navigateTo} />}

        {/* =====================================================================
            2. QUIÉNES SOMOS / EQUIPO (/quienes-somos)
           ===================================================================== */}
        {currentPath === '/quienes-somos' && <QuienesSomos />}

        {/* =====================================================================
            3. INSTALACIONES & CÁMARAS (/instalaciones)
           ===================================================================== */}
        {currentPath === '/instalaciones' && <Instalaciones />}

        {/* =====================================================================
            4. CATÁLOGO COMERCIAL (/catalogo)
           ===================================================================== */}
        {currentPath === '/catalogo' && <Catalogo />}

        {/* =====================================================================
            5. ACTUALIDAD Y SALA DE COMUNICACIÓN (/actualidad)
           ===================================================================== */}
        {currentPath === '/actualidad' && (
          <Actualidad initialArticleId={selectedNewsId} />
        )}

        {/* =====================================================================
            PÁGINA 404 REAL (/404)
           ===================================================================== */}
        {currentPath === '/404' && (
          <NotFound currentPath={window.location.pathname} onNavigate={navigateTo} />
        )}

        {/* =====================================================================
            6. CONTACTO (/contacto)
           ===================================================================== */}
        {currentPath === '/contacto' && <Contacto />}

        {/* =====================================================================
            7. SALA DE PRENSA 2024 (/prensa-2024)
           ===================================================================== */}
        {currentPath === '/prensa-2024' && <Prensa2024 />}

        {/* =====================================================================
            8. DOCUMENTOS PÚBLICOS (/documentos)
           ===================================================================== */}
        {currentPath === '/documentos' && <Documentos />}

        {/* =====================================================================
            9. RECURSOS GRÁFICOS - INDEX OF SIMULADO (/recursos)
           ===================================================================== */}
        {currentPath === '/recursos' && <Recursos />}

        {/* =====================================================================
            HONEYPOT DECOY TRAP SCREEN (/rh-nominas, /staging-api, /camaras-cctv, /cgi-bin)
           ===================================================================== */}
        {currentPath === '/honeypot-trap' && (
          <div className="py-12 px-6 max-w-4xl mx-auto space-y-6">
            <div className="bg-rose-950/40 border-2 border-rose-600 rounded-2xl p-8 text-white space-y-5 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-500">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wider font-mono">
                    403 Forbidden · Sensor Trampa Honeypot Activado
                  </h2>
                  <p className="text-xs text-rose-300 font-sans mt-0.5">
                    Intento de acceso a recurso restringido y no indexado interceptado
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 space-y-2 border border-rose-900/50">
                <p className="text-rose-400 font-bold">
                  [ALERTA DE SEGURIDAD SOC · ACCESO NO AUTORIZADO REGISTRADO]
                </p>
                <p>Ruta solicitada: <span className="text-amber-400">{trappedPath || '/recurso-oculto'}</span></p>
                <p>Directiva robots.txt: <span className="text-rose-400 font-bold">Disallow (No rastrear / Privado)</span></p>
                <p>Firma de conexión: <span className="text-emerald-400">192.168.1.105 (Identificada)</span></p>
                <p>Timestamp: <span className="text-slate-400">{new Date().toLocaleTimeString('es-ES')}</span></p>
                <p className="text-slate-500 pt-2 border-t border-slate-800">
                  Esta ruta actúa como trampa honeypot corporativa. Al intentar explorarla, se ha evidenciado un escaneo activo de directorios no indexados.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigateTo('/')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Volver a la Web Principal
                </button>
                <button
                  onClick={() => {
                    setModalInitialTab('honeypot');
                    setShowLogDrawer(true);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Ver Registro Forense Honeypot</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            7. RAW robots.txt (/robots.txt)
           ===================================================================== */}
        {currentPath === '/robots.txt' && (
          <div className="py-8 px-6 max-w-4xl mx-auto space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 font-sans">
              <div className="flex items-center gap-2">
                <button onClick={() => navigateTo('/')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-slate-900 text-sm">https://{TARGET_DOMAIN}/robots.txt</span>
              </div>
              <a 
                href="/robots.txt" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-mono"
              >
                <span>Ver archivo plano</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <pre className="p-6 bg-slate-950 text-emerald-400 rounded-xl border border-slate-800 text-xs leading-relaxed overflow-x-auto shadow-inner font-mono">
              {`# robots.txt para Plátanos del Norte S.L.
# Generado automáticamente por CMS el 2023-11-10
User-agent: *

# Áreas públicas de catálogo, prensa y documentación (Indexables en Google)
Allow: /
Allow: /quienes-somos
Allow: /instalaciones
Allow: /catalogo
Allow: /contacto
Allow: /actualidad
Allow: /prensa-2024
Allow: /documentos
Allow: /recursos
Allow: /documentos/catalogo_comercial_platanos_canarias_2024.pdf
Allow: /documentos/tarifa_mayorista_2024.pdf
Allow: /documentos/calendario_recogida_2024.xlsx

# Rutas restringidas - NO RASTREAR NI INDEXAR EN MOTORES DE BÚSQUEDA
Disallow: /admin-panel/
Disallow: /internal-docs/
Disallow: /backup-2023/
Disallow: /chat/logs/
Disallow: /rh-nominas/
Disallow: /staging-api/
Disallow: /camaras-cctv/
Disallow: /cgi-bin/

# NOTA PARA EL ADMINISTRADOR (c.mendizabal):
# Recuerda no subir las auditorías de Candina al directorio /internal-docs/ sin contraseña
# La sincronización nocturna con GitHub corre desde el cron de las 03:00

Sitemap: https://platanos-del-norte.ai.studio/sitemap.xml

# FLAG-01-ROBOTS-REVEALED`}
            </pre>
          </div>
        )}

        {/* =====================================================================
            7b. PUBLIC SITEMAP.XML VISUALIZER
           ===================================================================== */}
        {currentPath === '/sitemap.xml' && (
          <div className="py-8 px-6 max-w-4xl mx-auto space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-300 font-sans">
              <div>
                <h1 className="text-xl font-bold font-mono text-slate-900">sitemap.xml</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mapa del sitio XML con todas las rutas públicas e indexables (12 entradas oficiales)
                </p>
              </div>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-mono"
              >
                <span>Descargar XML crudo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <pre className="p-6 bg-slate-950 text-emerald-400 rounded-xl border border-slate-800 text-xs leading-relaxed overflow-x-auto shadow-inner font-mono">
              {`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://platanos-del-norte.ai.studio/</loc><priority>1.0</priority></url>
  <url><loc>https://platanos-del-norte.ai.studio/quienes-somos</loc><priority>0.8</priority></url>
  <url><loc>https://platanos-del-norte.ai.studio/instalaciones</loc><priority>0.8</priority></url>
  <url><loc>https://platanos-del-norte.ai.studio/catalogo</loc><priority>0.8</priority></url>
  <url><loc>https://platanos-del-norte.ai.studio/contacto</loc><priority>0.6</priority></url>
  <url><loc>https://platanos-del-norte.ai.studio/actualidad</loc><priority>0.8</priority></url>
  <url><loc>https://platanos-del-norte.ai.studio/prensa-2024</loc><priority>0.7</priority></url>
  <url><loc>https://platanos-del-norte.ai.studio/documentos</loc><priority>0.7</priority></url>
  <url><loc>https://platanos-del-norte.ai.studio/recursos</loc><priority>0.7</priority></url>
  <url><loc>https://platanos-del-norte.ai.studio/documentos/catalogo_comercial_platanos_canarias_2024.pdf</loc><priority>0.5</priority></url>
  <url><loc>https://platanos-del-norte.ai.studio/documentos/tarifa_mayorista_2024.pdf</loc><priority>0.5</priority></url>
  <url><loc>https://platanos-del-norte.ai.studio/documentos/calendario_recogida_2024.xlsx</loc><priority>0.5</priority></url>
</urlset>`}
            </pre>
          </div>
        )}

        {/* =====================================================================
            8. OPEN DIRECTORY LISTING /internal-docs/ (Index of)
           ===================================================================== */}
        {currentPath === '/internal-docs/' && (
          <div className="py-8 px-6 max-w-5xl mx-auto space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-300 font-sans">
              <div>
                <h1 className="text-2xl font-bold font-mono text-slate-900">Index of /internal-docs/</h1>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">
                  Apache/2.4.52 (Ubuntu) Server at {TARGET_DOMAIN} Port 443
                </p>
              </div>
              <button
                onClick={() => navigateTo('/')}
                className="px-3 py-1 text-xs font-sans text-slate-600 hover:text-slate-900 bg-slate-100 rounded border border-slate-300 cursor-pointer"
              >
                Volver a la Web
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs bg-white">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-sans">
                  <tr>
                    <th className="p-3 font-semibold">Nombre del Archivo</th>
                    <th className="p-3 font-semibold">Última Modificación</th>
                    <th className="p-3 font-semibold">Tamaño</th>
                    <th className="p-3 text-right font-semibold">Descarga Directa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 flex items-center gap-2">
                      <Folder className="w-4 h-4 text-amber-500" />
                      <button onClick={() => navigateTo('/')} className="text-blue-600 hover:underline cursor-pointer">
                        Parent Directory/
                      </button>
                    </td>
                    <td className="p-3 text-slate-400">-</td>
                    <td className="p-3 text-slate-400">-</td>
                    <td className="p-3 text-right">-</td>
                  </tr>

                  {/* Real File 1: auditoria_interna_seguridad_2023.pdf */}
                  <tr className="hover:bg-amber-50/50">
                    <td className="p-3 flex items-center gap-2 font-bold text-slate-900">
                      <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>auditoria_interna_seguridad_2023.pdf</span>
                    </td>
                    <td className="p-3 text-slate-600">2023-11-14 11:22</td>
                    <td className="p-3 text-slate-600 font-bold">2.6 KB</td>
                    <td className="p-3 text-right">
                      <a
                        href="/internal-docs/auditoria_interna_seguridad_2023.pdf"
                        download="auditoria_interna_seguridad_2023.pdf"
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-sans text-xs font-semibold rounded inline-flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar PDF</span>
                      </a>
                    </td>
                  </tr>

                  {/* Real File 2: especificaciones_camaras_maduracion_v2.pdf */}
                  <tr className="hover:bg-amber-50/50">
                    <td className="p-3 flex items-center gap-2 font-bold text-slate-900">
                      <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>especificaciones_camaras_maduracion_v2.pdf</span>
                    </td>
                    <td className="p-3 text-slate-600">2023-09-02 16:38</td>
                    <td className="p-3 text-slate-600 font-bold">1.9 KB</td>
                    <td className="p-3 text-right">
                      <a
                        href="/internal-docs/especificaciones_camaras_maduracion_v2.pdf"
                        download="especificaciones_camaras_maduracion_v2.pdf"
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-sans text-xs font-semibold rounded inline-flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar PDF</span>
                      </a>
                    </td>
                  </tr>

                  {/* Real File 3: control_acceso_proveedores_2023.xls (filetype:xls "password") */}
                  <tr className="hover:bg-amber-50/50">
                    <td className="p-3 flex items-center gap-2 font-bold text-slate-900">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>control_acceso_proveedores_2023.xls</span>
                      <span className="text-[10px] font-sans font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded ml-1">
                        Contiene Claves Intranet
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">2023-10-18 08:30</td>
                    <td className="p-3 text-slate-600 font-bold">892 B</td>
                    <td className="p-3 text-right">
                      <a
                        href="/internal-docs/control_acceso_proveedores_2023.xls"
                        download="control_acceso_proveedores_2023.xls"
                        onClick={() => registerChallenge('reto-4')}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-sans text-xs font-semibold rounded inline-flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar XLS</span>
                      </a>
                    </td>
                  </tr>

                  {/* Real File 4: config_vpn_teletrabajo_personal.ovpn */}
                  <tr className="hover:bg-amber-50/50">
                    <td className="p-3 flex items-center gap-2 font-bold text-slate-900">
                      <FileCode className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>config_vpn_teletrabajo_personal.ovpn</span>
                    </td>
                    <td className="p-3 text-slate-600">2023-10-05 19:12</td>
                    <td className="p-3 text-slate-600 font-bold">722 B</td>
                    <td className="p-3 text-right">
                      <a
                        href="/internal-docs/config_vpn_teletrabajo_personal.ovpn"
                        download="config_vpn_teletrabajo_personal.ovpn"
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs font-semibold rounded inline-flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar OVPN</span>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-slate-400 text-[11px] font-mono">
              Apache/2.4.52 (Ubuntu) Server at {TARGET_DOMAIN} Port 443
            </div>
          </div>
        )}

        {/* =====================================================================
            9. OPEN DIRECTORY LISTING /backup-2023/ (Index of)
           ===================================================================== */}
        {currentPath === '/backup-2023/' && (
          <div className="py-8 px-6 max-w-5xl mx-auto space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-300 font-sans">
              <div>
                <h1 className="text-2xl font-bold font-mono text-slate-900">Index of /backup-2023/</h1>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">
                  Apache/2.4.52 (Ubuntu) Server at {TARGET_DOMAIN} Port 443
                </p>
              </div>
              <button
                onClick={() => navigateTo('/')}
                className="px-3 py-1 text-xs font-sans text-slate-600 hover:text-slate-900 bg-slate-100 rounded border border-slate-300 cursor-pointer"
              >
                Volver a la Web
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs bg-white">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-sans">
                  <tr>
                    <th className="p-3 font-semibold">Nombre del Archivo</th>
                    <th className="p-3 font-semibold">Última Modificación</th>
                    <th className="p-3 font-semibold">Tamaño</th>
                    <th className="p-3 text-right font-semibold">Descarga Directa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 flex items-center gap-2">
                      <Folder className="w-4 h-4 text-amber-500" />
                      <button onClick={() => navigateTo('/')} className="text-blue-600 hover:underline cursor-pointer">
                        Parent Directory/
                      </button>
                    </td>
                    <td className="p-3 text-slate-400">-</td>
                    <td className="p-3 text-slate-400">-</td>
                    <td className="p-3 text-right">-</td>
                  </tr>

                  {/* Real File 1: db_dump_preprod.sql */}
                  <tr className="hover:bg-rose-50/50">
                    <td className="p-3 flex items-center gap-2 font-bold text-slate-900">
                      <Server className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>db_dump_preprod.sql</span>
                      <span className="text-[10px] font-sans font-semibold text-rose-700 bg-rose-100 border border-rose-300 px-1.5 py-0.5 rounded ml-2">
                        MySQL dump con Passwords
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">2023-11-02 03:00</td>
                    <td className="p-3 text-slate-800 font-bold">2.4 KB</td>
                    <td className="p-3 text-right">
                      <a
                        href="/backup-2023/db_dump_preprod.sql"
                        download="db_dump_preprod.sql"
                        onClick={() => registerChallenge('reto-4')}
                        className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white font-sans text-xs font-semibold rounded inline-flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar SQL</span>
                      </a>
                    </td>
                  </tr>

                  {/* Real File 2: db_backup_preprod_20231102.sql.gz */}
                  <tr className="hover:bg-rose-50/50">
                    <td className="p-3 flex items-center gap-2 font-bold text-slate-900">
                      <Server className="w-4 h-4 text-slate-600 shrink-0" />
                      <span>db_backup_preprod_20231102.sql.gz</span>
                    </td>
                    <td className="p-3 text-slate-600">2023-11-02 03:00</td>
                    <td className="p-3 text-slate-800 font-bold">1.2 KB</td>
                    <td className="p-3 text-right">
                      <a
                        href="/backup-2023/db_backup_preprod_20231102.sql.gz"
                        download="db_backup_preprod_20231102.sql.gz"
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs font-semibold rounded inline-flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar GZ</span>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-slate-400 text-[11px] font-mono">
              Apache/2.4.52 (Ubuntu) Server at {TARGET_DOMAIN} Port 443
            </div>
          </div>
        )}

        {/* =====================================================================
            10. CHAT LOGS /chat/logs/ ("index of" / "chat/logs")
           ===================================================================== */}
        {currentPath === '/chat/logs/' && (
          <div className="py-8 px-6 max-w-5xl mx-auto space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-300 font-sans">
              <div>
                <h1 className="text-2xl font-bold font-mono text-slate-900">Index of /chat/logs/</h1>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">
                  Apache/2.4.52 (Ubuntu) Server at {TARGET_DOMAIN} Port 443
                </p>
              </div>
              <button
                onClick={() => navigateTo('/')}
                className="px-3 py-1 text-xs font-sans text-slate-600 hover:text-slate-900 bg-slate-100 rounded border border-slate-300 cursor-pointer"
              >
                Volver a la Web
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs bg-white">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-sans">
                  <tr>
                    <th className="p-3 font-semibold">Nombre del Archivo</th>
                    <th className="p-3 font-semibold">Última Modificación</th>
                    <th className="p-3 font-semibold">Tamaño</th>
                    <th className="p-3 text-right font-semibold">Descarga Directa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 flex items-center gap-2">
                      <Folder className="w-4 h-4 text-amber-500" />
                      <button onClick={() => navigateTo('/')} className="text-blue-600 hover:underline cursor-pointer">
                        Parent Directory/
                      </button>
                    </td>
                    <td className="p-3 text-slate-400">-</td>
                    <td className="p-3 text-slate-400">-</td>
                    <td className="p-3 text-right">-</td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 flex items-center gap-2 font-bold text-slate-900">
                      <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                      <span>conversacion_soporte_it_202311.log</span>
                      <span className="text-[10px] font-sans font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded ml-1">
                        Chat Log Soporte
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">2023-11-01 10:18</td>
                    <td className="p-3 text-slate-600 font-bold">1.1 KB</td>
                    <td className="p-3 text-right">
                      <a
                        href="/chat/logs/conversacion_soporte_it_202311.log"
                        download="conversacion_soporte_it_202311.log"
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-semibold rounded inline-flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar LOG</span>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-slate-400 text-[11px] font-mono">
              Apache/2.4.52 (Ubuntu) Server at {TARGET_DOMAIN} Port 443
            </div>
          </div>
        )}

        {/* =====================================================================
            11. INTRANET ADMIN LOGIN & AUTHENTICATED SCADA DASHBOARD
           ===================================================================== */}
        {currentPath === '/admin-panel' && (
          <div>
            {!isAuthenticated ? (
              /* LOGIN FORM */
              <div className="py-16 px-6 max-w-md mx-auto">
                <div className="border border-slate-200 rounded-2xl p-8 bg-white shadow-lg space-y-6">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl mx-auto mb-2">
                      🍌
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Intranet Operaciones</h2>
                    <p className="text-xs text-slate-500">Plátanos del Norte S.L. · Acceso Restringido</p>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Usuario Corporativo / LDAP:</label>
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="cmendizabal"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Contraseña de Intranet:</label>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Introduce la clave encontrada en los archivos"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Pista: Busca la contraseña en <code>control_acceso_proveedores_2023.xls</code> o en los logs/dumps.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Iniciar Sesión en Intranet
                    </button>
                  </form>

                  <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
                    Aviso: El uso no autorizado de este sistema está monitorizado conforme a la normativa vigente.
                  </div>
                </div>
              </div>
            ) : (
              /* AUTHENTICATED INTRANET / SCADA CONTROL PANEL (SENSITIVE INFO UNLOCKED) */
              <div className="py-10 px-6 max-w-6xl mx-auto space-y-8">
                
                {/* Active Session Header */}
                <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shrink-0">
                      👨‍💻
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">Intranet Candina · Panel de Control de Cámaras</span>
                        <span className="text-[10px] bg-emerald-700 text-white font-mono px-2 py-0.5 rounded font-bold">
                          NIVEL 3: DEV & SCADA
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Sesión iniciada como <strong>Carlos Mendizábal Ruiz</strong> (<code>c.mendizabal@platanosdelnorte.es</code>) · IP Origen: <code>192.168.10.45</code>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-slate-500" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>

                {/* SCADA Telemetry & Industrial Controls */}
                <div className="border border-slate-200 rounded-2xl p-6 bg-white space-y-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-emerald-700" />
                        <span>Telemetría en Vivo de Cámaras Frigoríficas (PLC Siemens S7-1200 en 10.0.4.12:102)</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Control de temperatura de pulpa y dosificación de etileno en Santander.</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded">
                      ● SCADA EN LÍNEA
                    </span>
                  </div>

                  {chamberStatusMessage && (
                    <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-xs text-emerald-950 font-mono animate-in fade-in">
                      {chamberStatusMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                      <span className="text-slate-500 font-sans block text-[11px]">Cámara 1 (Gáldar)</span>
                      <p className="text-xl font-bold text-slate-900 mt-1">13.5 °C</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Etileno: 980 ppm</p>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                      <span className="text-slate-500 font-sans block text-[11px]">Cámara 2 (La Palma)</span>
                      <p className="text-xl font-bold text-slate-900 mt-1">14.1 °C</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Etileno: 1020 ppm</p>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                      <span className="text-slate-500 font-sans block text-[11px]">Cámara 3 (Tenerife)</span>
                      <p className="text-xl font-bold text-slate-900 mt-1">13.7 °C</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Etileno: 990 ppm</p>
                    </div>

                    <div className="p-4 border border-emerald-300 rounded-xl bg-emerald-50/50">
                      <span className="text-emerald-800 font-sans font-bold block text-[11px]">Cámara 4 (Alarma Reciente)</span>
                      <p className="text-xl font-bold text-emerald-950 mt-1">{chamber4Temp} °C</p>
                      <p className="text-emerald-800 text-[11px] mt-0.5">Etileno: {chamber4Ethylene} ppm</p>
                    </div>
                  </div>

                  {/* Chamber 4 Manual Controls */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <span className="font-bold text-slate-800 text-xs font-sans flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-emerald-700" />
                      <span>Comandos Manuales de Calibración Térmica (Cámara 4):</span>
                    </span>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                      <button
                        onClick={() => handleAdjustChamber(-0.2, 0)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 font-bold cursor-pointer"
                      >
                        -0.2 °C (Enfriar)
                      </button>
                      <button
                        onClick={() => handleAdjustChamber(+0.2, 0)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 font-bold cursor-pointer"
                      >
                        +0.2 °C (Calentar)
                      </button>
                      <button
                        onClick={() => handleAdjustChamber(0, +50)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-bold cursor-pointer"
                      >
                        +50 ppm Gas Etileno
                      </button>
                      <button
                        onClick={() => handleAdjustChamber(0, -50)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold cursor-pointer"
                      >
                        -50 ppm Gas Etileno
                      </button>
                    </div>
                  </div>
                </div>

                {/* Secret Production API Keys & SSH Gateways */}
                <div className="border border-slate-200 rounded-2xl p-6 bg-white space-y-4 shadow-xs">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Key className="w-5 h-5 text-amber-600" />
                    <span>Secretos de Producción y Credenciales Maestras (Fuga Crítica)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-4 bg-slate-950 text-slate-200 rounded-xl space-y-1 border border-slate-800">
                      <span className="text-slate-400 block text-[11px] font-sans">Token de API Producción:</span>
                      <p className="text-emerald-400 font-bold">Bearer pltn_live_sec_994812a4b8891040faec91</p>
                      <span className="text-slate-400 block text-[11px] font-sans pt-2">Webhook de Notificaciones Slack:</span>
                      <p className="text-slate-300 text-[11px] truncate">https://hooks.slack.com/services/T05PDN981/B06AB1908/38f90ab9c9018e19ba</p>
                    </div>

                    <div className="p-4 bg-slate-950 text-slate-200 rounded-xl space-y-1 border border-slate-800">
                      <span className="text-slate-400 block text-[11px] font-sans">Acceso SSH a Terminal SCADA:</span>
                      <p className="text-emerald-400 font-bold">ssh operator@10.0.4.12 -p 2202</p>
                      <span className="text-slate-400 block text-[11px] font-sans pt-2">Clave Criptográfica VPN Perimetral:</span>
                      <p className="text-amber-400 font-bold">vpn-secret-key-platanos-991</p>
                    </div>
                  </div>
                </div>

                {/* Classified Confidential Document Level 3 */}
                <div className="border border-rose-200 bg-rose-50/50 rounded-2xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-rose-600 text-white rounded-xl shadow-xs">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">informe_restringido_aduanas_precios_2024.pdf</h4>
                          <span className="text-[10px] bg-rose-700 text-white font-mono px-2 py-0.5 rounded font-bold">
                            NIVEL 3 CLASIFICADO
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Acuerdos confidenciales de precios por tonelada con Mercadona y Eroski · Cuentas bancarias corporativas Banco Santander.
                        </p>
                      </div>
                    </div>

                    <a
                      href="/internal-docs/informe_restringido_aduanas_precios_2024.pdf"
                      download="informe_restringido_aduanas_precios_2024.pdf"
                      onClick={() => registerChallenge('reto-7')}
                      className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0 shadow-xs cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Expediente Nivel 3</span>
                    </a>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </main>

      {/* =========================================================================
          Authentic Corporate Footer (Linked to public indexable resources)
         ========================================================================= */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8 px-6 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-800">Plátanos del Norte S.L. · CIF B-39824102</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Polígono Candina, Nave 14, 39011 Santander, Cantabria · Tel. +34 942 22 18 90</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-500 text-[11px]">
            <span>© 2024 Plátanos del Norte S.L.</span>
            <button onClick={() => navigateTo('/quienes-somos')} className="hover:text-emerald-800 hover:underline cursor-pointer">
              Quiénes somos
            </button>
            <button onClick={() => navigateTo('/instalaciones')} className="hover:text-emerald-800 hover:underline cursor-pointer">
              Instalaciones
            </button>
            <button onClick={() => navigateTo('/catalogo')} className="hover:text-emerald-800 hover:underline cursor-pointer">
              Catálogo comercial
            </button>
            <button onClick={() => navigateTo('/actualidad')} className="hover:text-emerald-800 hover:underline cursor-pointer">
              Actualidad
            </button>
            <button onClick={() => navigateTo('/contacto')} className="hover:text-emerald-800 hover:underline cursor-pointer">
              Contacto
            </button>
            <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-emerald-800 hover:underline font-mono">
              Sitemap XML
            </a>
            <span className="text-slate-400">·</span>
            <span className="hover:text-slate-800 cursor-default">Aviso Legal</span>
            <span className="hover:text-slate-800 cursor-default">Política de Privacidad</span>
            <span className="text-emerald-800 font-semibold cursor-default">Plátano de Canarias IGP</span>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          Floating OSINT Retos Progress Badge (x/13) & Honeypot Sensor Count
         ========================================================================= */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <button
          onClick={() => {
            setModalInitialTab('challenges');
            setShowLogDrawer(true);
          }}
          className="group px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2.5 transition-all hover:scale-105 border border-slate-700 cursor-pointer"
        >
          <div className={`w-2.5 h-2.5 rounded-full ${completedChallengeIds.length === OFFICIAL_CHALLENGES.length ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
          <Award className="w-4 h-4 text-amber-400" />
          <span>Retos OSINT: <strong className="text-emerald-400 font-mono text-sm">{completedChallengeIds.length}/{OFFICIAL_CHALLENGES.length}</strong></span>
          <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-300 border border-slate-700">
            {Math.round((completedChallengeIds.length / OFFICIAL_CHALLENGES.length) * 100)}%
          </span>
          {honeypotLogs.length > 0 && (
            <span 
              onClick={(e) => {
                e.stopPropagation();
                setModalInitialTab('honeypot');
                setShowLogDrawer(true);
              }}
              className="text-[10px] bg-rose-600 hover:bg-rose-500 text-white font-mono px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors"
              title="Accesos no indexados detectados por el Honeypot"
            >
              <ShieldAlert className="w-3 h-3" />
              <span>{honeypotLogs.length}</span>
            </span>
          )}
        </button>
      </div>

      {/* Retos Modal (x/total, progressive hidden tips, requested help count & Honeypot detections) */}
      <RetosModal
        isOpen={showLogDrawer}
        onClose={() => {
          setShowLogDrawer(false);
          setModalInitialTab('challenges');
        }}
        challenges={OFFICIAL_CHALLENGES}
        completedChallengeIds={completedChallengeIds}
        milestones={milestones}
        honeypotLogs={honeypotLogs}
        initialTab={modalInitialTab}
        requestedHints={requestedHints}
        onRequestHint={handleRequestHint}
        onValidateFlag={handleValidateFlag}
        onReset={handleResetProgress}
        onClearHoneypotLogs={() => {
          clearHoneypotLogs();
          setHoneypotLogs([]);
        }}
      />

      {/* Honeypot Active Hacking Interception Modal (Ventana emergente) */}
      <HoneypotAlertModal
        isOpen={isHoneypotAlertOpen}
        incident={activeHoneypotIncident}
        onClose={() => setIsHoneypotAlertOpen(false)}
        onOpenAudit={() => {
          setIsHoneypotAlertOpen(false);
          setModalInitialTab('honeypot');
          setShowLogDrawer(true);
        }}
      />

      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastNotification}</span>
        </div>
      )}

    </div>
  );
}
