export interface HoneypotIncident {
  id: string;
  timestamp: string;
  path: string;
  category: string;
  reason: string;
  simulatedIp: string;
  userAgent: string;
}

export const STORAGE_HONEYPOT_KEY = 'platanos_honeypot_detections_v1';

// Exact sensitive trap routes from robots.txt Disallow directives
export const HONEYPOT_TRAP_ROUTES = [
  '/admin-panel',
  '/internal-docs',
  '/backup-2023',
  '/chat/logs',
  '/rh-nominas',
  '/staging-api',
  '/camaras-cctv',
  '/cgi-bin'
];

export const INDEXED_PATHS = [
  '/',
  '/quienes-somos',
  '/instalaciones',
  '/catalogo',
  '/contacto',
  '/actualidad',
  '/prensa-2024',
  '/documentos',
  '/recursos'
];

/**
 * Checks if a pathname matches the explicit honeypot traps (Disallow sensitive routes or subpaths)
 */
export function isHoneypotTrap(pathname: string): boolean {
  if (!pathname) return false;
  const clean = pathname.split('?')[0].toLowerCase().trim().replace(/\/+$/, '') || '/';
  return HONEYPOT_TRAP_ROUTES.some(trap => clean === trap || clean.startsWith(trap + '/'));
}

export function isIndexedPath(pathname: string): boolean {
  const clean = pathname.split('?')[0].toLowerCase().trim().replace(/\/+$/, '') || '/';
  return INDEXED_PATHS.includes(clean);
}

export function getHoneypotLogs(): HoneypotIncident[] {
  try {
    const raw = localStorage.getItem(STORAGE_HONEYPOT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Records a honeypot detection ONLY if the path is an explicit honeypot trap.
 * Never triggers on public routes, robots.txt, sitemap.xml, or non-existent 404 pages.
 */
export function recordHoneypotIncident(pathname: string, customReason?: string): HoneypotIncident | null {
  if (!isHoneypotTrap(pathname)) {
    return null;
  }

  const clean = pathname.split('?')[0].toLowerCase().trim();
  let category = 'Directorio Restringido (Disallow)';
  let reason = customReason || 'Acceso directo a ruta privada vetada en directivas de rastreo robots.txt.';

  if (clean.startsWith('/internal-docs')) {
    category = 'Exploración de Directorio Privado';
    reason = 'Acceso no autorizado al repositorio interno de auditorías /internal-docs/.';
  } else if (clean.startsWith('/backup-2023')) {
    category = 'Sondeo de Volcados / Respaldos';
    reason = 'Acceso al directorio vetado de respaldos de base de datos /backup-2023/.';
  } else if (clean.startsWith('/chat/logs')) {
    category = 'Inspección de Logs de Chat';
    reason = 'Acceso al registro interno de soporte IT /chat/logs/.';
  } else if (clean.startsWith('/admin-panel')) {
    category = 'Intrusión a Intranet / SCADA';
    reason = 'Intento de acceso a portal administrativo restringido.';
  } else if (
    clean.startsWith('/rh-nominas') || 
    clean.startsWith('/staging-api') || 
    clean.startsWith('/camaras-cctv') || 
    clean.startsWith('/cgi-bin')
  ) {
    category = 'Trampa Honeypot Activa';
    reason = `Activación de ruta señuelo de alta sensibilidad (${clean}) vetada en robots.txt.`;
  }

  const incident: HoneypotIncident = {
    id: `hp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    path: pathname.split('?')[0],
    category,
    reason,
    simulatedIp: '192.168.1.105',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0 (Student-Agent)'
  };

  try {
    const existing = getHoneypotLogs();
    const updated = [incident, ...existing].slice(0, 50); // keep up to 50 logs
    localStorage.setItem(STORAGE_HONEYPOT_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving honeypot log:', e);
  }

  return incident;
}

export function clearHoneypotLogs(): void {
  try {
    localStorage.removeItem(STORAGE_HONEYPOT_KEY);
  } catch {}
}
