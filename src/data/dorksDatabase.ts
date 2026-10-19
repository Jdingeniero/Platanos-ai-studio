import { GoogleOperator, SearchResult } from '../types/osint';
import { TARGET_DOMAIN, TARGET_FILES, TARGET_EMPLOYEES, ROBOTS_TXT_CONTENT, SIMULATED_GITHUB_REPO } from './targetCompany';

export const GOOGLE_OPERATORS: GoogleOperator[] = [
  {
    operator: 'site:',
    syntax: 'site:dominio.com',
    description: 'Restringe la búsqueda a un dominio, subdominio o TLD específico.',
    purposeInSecurity: 'Permite acotar el perímetro del objetivo para descubrir todas sus páginas indexadas, subdominios ocultos o archivos expuestos sin ruido exterior.',
    practicalExample: `site:${TARGET_DOMAIN}`,
    educationalLevel: 'Básico'
  },
  {
    operator: 'filetype: / ext:',
    syntax: 'filetype:pdf / ext:doc',
    description: 'Filtra resultados devolviendo únicamente archivos con una extensión de fichero concreta.',
    purposeInSecurity: 'Localiza documentos ofimáticos (PDF, DOCX, XLSX) que suelen contener metadatos forenses, copias de seguridad (.sql, .bak, .zip) o ficheros de configuración (.ovpn, .conf).',
    practicalExample: `site:${TARGET_DOMAIN} filetype:pdf`,
    educationalLevel: 'Básico'
  },
  {
    operator: 'intitle:',
    syntax: 'intitle:"palabra clave"',
    description: 'Obliga a que el título HTML (<title>) contenga el término o frase exacta entre comillas.',
    purposeInSecurity: 'Fundamental para encontrar directorios web desprotegidos con listado automático ("Index of /"), portales de login ("Login", "Dashboard") o paneles phpMyAdmin.',
    practicalExample: `site:${TARGET_DOMAIN} intitle:"index of"`,
    educationalLevel: 'Básico'
  },
  {
    operator: 'inurl:',
    syntax: 'inurl:palabra',
    description: 'Busca páginas cuya dirección web (URL) contenga una cadena o parámetro específico.',
    purposeInSecurity: 'Descubre rutas administrativas (/admin, /wp-admin), endpoints de API (/api/v1/), directorios temporales (/backup, /test) o parámetros potencialmente vulnerables (?id=, ?file=).',
    practicalExample: `site:${TARGET_DOMAIN} inurl:admin`,
    educationalLevel: 'Básico'
  },
  {
    operator: 'intext:',
    syntax: 'intext:"texto exacto"',
    description: 'Obliga a que el cuerpo visible del texto de la página contenga la cadena buscada.',
    purposeInSecurity: 'Detecta avisos de confidencialidad ("uso interno", "strictly confidential"), errores de base de datos ("SQL syntax error"), marcas de software o credenciales por defecto.',
    practicalExample: `site:${TARGET_DOMAIN} intext:"confidencial"`,
    educationalLevel: 'Básico'
  },
  {
    operator: 'allintitle:',
    syntax: 'allintitle:palabra1 palabra2',
    description: 'Exige que todas las palabras listadas estén presentes en el título de la página.',
    purposeInSecurity: 'Permite refinar búsquedas de paneles específicos como consolas de gestión o webcams sin tener que repetir el operador.',
    practicalExample: `site:${TARGET_DOMAIN} allintitle:intranet acceso`,
    educationalLevel: 'Intermedio'
  },
  {
    operator: 'allinurl:',
    syntax: 'allinurl:palabra1 palabra2',
    description: 'Exige que todas las palabras aparezcan dentro de la estructura de la URL.',
    purposeInSecurity: 'Excelente para cazar carpetas anidadas de backups y logs, por ejemplo /logs/2023/ o /wp-content/uploads/.',
    practicalExample: `site:${TARGET_DOMAIN} allinurl:internal docs`,
    educationalLevel: 'Intermedio'
  },
  {
    operator: 'cache:',
    syntax: 'cache:dominio.com/pagina',
    description: 'Muestra la instantánea almacenada por los rastreadores de Google de una página concreta.',
    purposeInSecurity: 'Permite consultar versiones anteriores de una web borrada o modificada por un administrador tras un incidente, sin enviar peticiones directas al servidor de la víctima (100% pasivo).',
    practicalExample: `cache:${TARGET_DOMAIN}`,
    educationalLevel: 'Intermedio'
  },
  {
    operator: 'link:',
    syntax: 'link:dominio.com',
    description: 'Muestra páginas web externas que contienen enlaces apuntando al objetivo.',
    purposeInSecurity: 'Mapea la red de relaciones comerciales, proveedores tecnológicos, foros de soporte o menciones públicas de terceros hacia la infraestructura corporativa.',
    practicalExample: `link:${TARGET_DOMAIN}`,
    educationalLevel: 'Intermedio'
  },
  {
    operator: 'related:',
    syntax: 'related:dominio.com',
    description: 'Muestra sitios web que el algoritmo de Google clasifica como temática o sectorialmente similares.',
    purposeInSecurity: 'Útil en inteligencia de amenazas para identificar competidores directos, servicios del mismo holding empresarial o webs clonadas/phishing.',
    practicalExample: `related:${TARGET_DOMAIN}`,
    educationalLevel: 'Avanzado'
  },
  {
    operator: 'Operadores booleanos (AND, OR, NOT / -)',
    syntax: 'palabra1 OR palabra2 -palabra3',
    description: 'Combina o excluye términos mediante lógica booleana y el signo de resta (-) para filtrar ruido.',
    purposeInSecurity: 'Elimina falsos positivos de tiendas de terceros o páginas de bienvenida para centrarse en archivos de configuración sensibles.',
    practicalExample: `site:${TARGET_DOMAIN} (password OR clave OR token) -comercial`,
    educationalLevel: 'Avanzado'
  },
  {
    operator: 'Búsqueda de comodín (*)',
    syntax: '"servidor * no responde"',
    description: 'El asterisco (*) actúa como comodín para cualquier término dentro de una frase exacta.',
    purposeInSecurity: 'Localiza patrones de mensajes de error de servidores o rutas desconocidas en scripts compilados.',
    practicalExample: `site:${TARGET_DOMAIN} intext:"copyright 202* Plátanos del Norte"`,
    educationalLevel: 'Avanzado'
  }
];

export interface ParsedQuery {
  raw: string;
  siteFilter?: string;
  filetypeFilter?: string;
  intitleFilter?: string;
  inurlFilter?: string;
  intextFilter?: string;
  freeTextKeywords: string[];
  isCacheQuery: boolean;
  hasErrors: boolean;
  detectedOperators: string[];
}

export function parseGoogleQuery(query: string): ParsedQuery {
  const result: ParsedQuery = {
    raw: query,
    freeTextKeywords: [],
    isCacheQuery: false,
    hasErrors: false,
    detectedOperators: []
  };

  const tokens = query.trim().split(/\s+/);

  for (const token of tokens) {
    if (token.startsWith('site:')) {
      result.siteFilter = token.substring(5).toLowerCase();
      result.detectedOperators.push('site:');
    } else if (token.startsWith('filetype:') || token.startsWith('ext:')) {
      const parts = token.split(':');
      result.filetypeFilter = parts[1].toLowerCase();
      result.detectedOperators.push(token.startsWith('filetype:') ? 'filetype:' : 'ext:');
    } else if (token.startsWith('intitle:')) {
      result.intitleFilter = token.substring(8).replace(/["']/g, '').toLowerCase();
      result.detectedOperators.push('intitle:');
    } else if (token.startsWith('inurl:')) {
      result.inurlFilter = token.substring(6).replace(/["']/g, '').toLowerCase();
      result.detectedOperators.push('inurl:');
    } else if (token.startsWith('intext:')) {
      result.intextFilter = token.substring(7).replace(/["']/g, '').toLowerCase();
      result.detectedOperators.push('intext:');
    } else if (token.startsWith('cache:')) {
      result.isCacheQuery = true;
      result.detectedOperators.push('cache:');
    } else if (token.length > 0) {
      result.freeTextKeywords.push(token.replace(/["']/g, '').toLowerCase());
    }
  }

  return result;
}

// Master simulated indexed documents database
export const ALL_SIMULATED_PAGES: SearchResult[] = [
  {
    id: 'res-home',
    title: 'Plátanos del Norte S.L. | Maduración y Distribución Frutícola Cantabria',
    url: `https://${TARGET_DOMAIN}/`,
    snippet: 'Empresa especializada en la importación directa de Plátano de Canarias IGP, maduración en cámaras industriales de atmósfera controlada en Santander y distribución a toda la cornisa cantábrica.',
    matchedDorkCategory: 'General / Home',
    cachedHtml: `<h1>Plátanos del Norte S.L.</h1><p>Líderes en distribución de plátano en Cantabria, Asturias y País Vasco.</p>`
  },
  {
    id: 'res-quienes-somos',
    title: 'Nuestro Equipo Directivo y Técnico - Plátanos del Norte S.L.',
    url: `https://${TARGET_DOMAIN}/quienes-somos/`,
    snippet: 'Conozca al equipo: Marta Revilla (Dirección General), Rodrigo Arango (Director Financiero), Elena Soto (Calidad) y Carlos Mendizábal (Responsable de Sistemas IT y Logística Frigorífica).',
    matchedDorkCategory: 'Personal / Empleados',
    findingReferenceId: 'find-carlos-profile'
  },
  {
    id: 'res-instalaciones',
    title: 'Instalaciones y Cámaras de Maduración - Polígono Candina Santander',
    url: `https://${TARGET_DOMAIN}/instalaciones/`,
    snippet: 'Nuestras 8 cámaras frigoríficas cuentan con inyección controlada de etileno y monitoreo térmico en tiempo real. Ubicación en Polígono Candina, Santander.',
    matchedDorkCategory: 'Instalaciones'
  },
  {
    id: 'res-robots-txt',
    title: `robots.txt - Configuración de Rastreadores Web (${TARGET_DOMAIN})`,
    url: `https://${TARGET_DOMAIN}/robots.txt`,
    snippet: 'User-agent: * Disallow: /admin-panel/ Disallow: /internal-docs/ Disallow: /backup-2023/ Disallow: /rh-nominas/ # NOTA INTERNA c.mendizabal: no subir auditorías de Candina sin clave.',
    matchedDorkCategory: 'Robots.txt / Rastreo',
    findingReferenceId: 'find-robots-leak',
    confidentialBadge: 'Fuga de Rutas Críticas'
  },
  {
    id: 'res-directory-internal-docs',
    title: 'Index of /internal-docs/',
    url: `https://${TARGET_DOMAIN}/internal-docs/`,
    snippet: 'Apache/2.4.52 (Ubuntu) Server at platanosdelnorte.es Port 443. Parent Directory | auditoria_interna_seguridad_2023.pdf | especificaciones_camaras_maduracion_v2.pdf | config_vpn_teletrabajo_personal.ovpn',
    matchedDorkCategory: 'Directorio Abierto',
    findingReferenceId: 'find-open-directory',
    confidentialBadge: 'Directory Listing Activo'
  },
  {
    id: 'res-directory-backups',
    title: 'Index of /backup-2023/',
    url: `https://${TARGET_DOMAIN}/backup-2023/`,
    snippet: 'Apache/2.4.52 (Ubuntu) Server at platanosdelnorte.es Port 443. Parent Directory | db_backup_preprod_20231102.sql.gz 14.2MB 2023-11-02 03:00',
    matchedDorkCategory: 'Backups Expuestos',
    findingReferenceId: 'find-sql-backup',
    confidentialBadge: 'Copia de Base de Datos Expuesta'
  },
  {
    id: 'res-pdf-auditoria',
    title: '[PDF] Auditoría Interna de Infraestructura y Redes - Naves Candina v1.3',
    url: `https://${TARGET_DOMAIN}/internal-docs/auditoria_interna_seguridad_2023.pdf`,
    snippet: 'Documento técnico elaborado por Carlos Mendizábal. Detalle de subredes VLAN 10 (192.168.10.0/24), servidor NAS Synology 192.168.10.45 y comunidad SNMP de cámaras: public_platanos.',
    matchedDorkCategory: 'Metadatos / Documentos',
    filetype: 'PDF',
    findingReferenceId: 'find-pdf-auditoria-meta',
    confidentialBadge: 'Metadatos & Credenciales'
  },
  {
    id: 'res-pdf-camaras',
    title: '[PDF] Especificaciones Técnicas y Protocolo Cámaras de Maduración v2',
    url: `https://${TARGET_DOMAIN}/internal-docs/especificaciones_camaras_maduracion_v2.pdf`,
    snippet: 'Directrices de atmósferas modificadas para fruta. Controladores Siemens S7-1200 en IP interna 10.0.4.12:102. Autora: Elena Soto González. Comentarios de revisión de cmendizabal.',
    matchedDorkCategory: 'Metadatos / SCADA',
    filetype: 'PDF',
    findingReferenceId: 'find-scada-leak',
    confidentialBadge: 'Topología SCADA'
  },
  {
    id: 'res-pdf-presupuesto',
    title: '[PDF] Plan Financiero y Previsiones de Compra en Origen 2024 - CONFIDENCIAL',
    url: `https://${TARGET_DOMAIN}/internal-docs/presupuesto_confidencial_exportacion_2024.pdf`,
    snippet: 'Dirección Financiera: Rodrigo Arango Díaz. Acuerdos de compraventa de plátanos con cooperativas canarias. Datos bancarios corporativos y márgenes brutos por canal.',
    matchedDorkCategory: 'Metadatos / Finanzas',
    filetype: 'PDF',
    findingReferenceId: 'find-presupuesto-meta',
    confidentialBadge: 'Información Financiera'
  },
  {
    id: 'res-ovpn-vpn',
    title: 'config_vpn_teletrabajo_personal.ovpn - Perfil de Conexión Remota',
    url: `https://${TARGET_DOMAIN}/internal-docs/config_vpn_teletrabajo_personal.ovpn`,
    snippet: 'client dev tun proto udp remote vpn.platanosdelnorte.es 1194 resolv-retry infinite. <ca>-----BEGIN CERTIFICATE----- ... <cert> CN=carlos.mendizabal',
    matchedDorkCategory: 'Configuraciones / VPN',
    findingReferenceId: 'find-vpn-leak',
    confidentialBadge: 'Perfil VPN & Certificados'
  },
  {
    id: 'res-catalogo-publico',
    title: '[PDF] Catálogo Comercial y Variedades Plátanos del Norte 2024',
    url: `https://${TARGET_DOMAIN}/documentos/catalogo_comercial_platanos_canarias_2024.pdf`,
    snippet: 'Catálogo de presentación de calibres Extra y Primera, maduración bajo norma de calidad y distribución en Cantabria y norte de España.',
    matchedDorkCategory: 'Catálogo Público',
    filetype: 'PDF'
  },
  {
    id: 'res-github-cmendi',
    title: 'cmendi-dev/platanos-api-scripts: Scripts de mantenimiento de servidores y backup',
    url: 'https://github.com/cmendi-dev/platanos-api-scripts',
    snippet: 'Public repository by Carlos Mendizábal. backup_sync.sh: mysqldump -h db-master.internal.platanosdelnorte.es -u preprod_user -p"PlatanosMySQL2023!#". Slack webhook y tokens de autenticación.',
    matchedDorkCategory: 'GitHub / Fuga de Código',
    findingReferenceId: 'find-github-leak',
    confidentialBadge: 'Claves en GitHub'
  },
  {
    id: 'res-admin-login',
    title: 'Acceso Administración y Panel de Operaciones - Plátanos del Norte',
    url: `https://${TARGET_DOMAIN}/admin-panel/login.php`,
    snippet: 'Panel de control restringido. Ingrese sus credenciales corporativas LDAP / Active Directory. Servidor protegido por cortafuegos perimetral.',
    matchedDorkCategory: 'Paneles de Acceso',
    findingReferenceId: 'find-admin-panel'
  }
];

export function executeSimulatedDorkSearch(query: string): SearchResult[] {
  if (!query || query.trim() === '') {
    return ALL_SIMULATED_PAGES.slice(0, 4);
  }

  const parsed = parseGoogleQuery(query);

  return ALL_SIMULATED_PAGES.filter(page => {
    // Check site:
    if (parsed.siteFilter) {
      if (parsed.siteFilter === TARGET_DOMAIN || parsed.siteFilter === 'platanosdelnorte' || parsed.siteFilter === 'www.platanosdelnorte.es') {
        if (!page.url.includes(TARGET_DOMAIN)) return false;
      } else if (parsed.siteFilter === 'github.com' || parsed.siteFilter === 'github') {
        if (!page.url.includes('github.com')) return false;
      } else if (!page.url.toLowerCase().includes(parsed.siteFilter)) {
        return false;
      }
    }

    // Check filetype / ext
    if (parsed.filetypeFilter) {
      const ext = parsed.filetypeFilter.replace('.', '');
      if (ext === 'pdf') {
        if (!page.url.endsWith('.pdf') && page.filetype !== 'PDF') return false;
      } else if (ext === 'sql' || ext === 'gz') {
        if (!page.url.includes('.sql') && !page.url.includes('.gz')) return false;
      } else if (ext === 'ovpn') {
        if (!page.url.includes('.ovpn')) return false;
      } else if (!page.url.toLowerCase().includes(`.${ext}`)) {
        return false;
      }
    }

    // Check intitle:
    if (parsed.intitleFilter) {
      const titleLower = page.title.toLowerCase();
      if (!titleLower.includes(parsed.intitleFilter)) return false;
    }

    // Check inurl:
    if (parsed.inurlFilter) {
      const urlLower = page.url.toLowerCase();
      if (!urlLower.includes(parsed.inurlFilter)) return false;
    }

    // Check intext:
    if (parsed.intextFilter) {
      const combinedText = `${page.title} ${page.snippet}`.toLowerCase();
      if (!combinedText.includes(parsed.intextFilter)) return false;
    }

    // Check free text keywords
    if (parsed.freeTextKeywords.length > 0) {
      const combinedAll = `${page.title} ${page.snippet} ${page.url}`.toLowerCase();
      const anyMatch = parsed.freeTextKeywords.some(keyword => combinedAll.includes(keyword));
      if (!anyMatch) return false;
    }

    return true;
  });
}
