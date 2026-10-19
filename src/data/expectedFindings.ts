import { ExpectedFinding } from '../types/osint';
import { TARGET_DOMAIN } from './targetCompany';

export const EXPECTED_FINDINGS: ExpectedFinding[] = [
  {
    id: 'find-robots-leak',
    code: 'HF-01',
    category: 'Robots / Indexado',
    title: 'Exposición de rutas sensibles y notas internas en robots.txt',
    severity: 'Alta',
    recommendedDork: `site:${TARGET_DOMAIN} inurl:robots.txt`,
    whereFound: `https://${TARGET_DOMAIN}/robots.txt`,
    evidence: 'Directivas Disallow revelan /admin-panel/, /internal-docs/, /backup-2023/, /rh-nominas/ y comentario confidencial firmado por c.mendizabal.',
    cyberRisk: 'El archivo robots.txt es público y los atacantes lo utilizan como mapa directo de carpetas de alto valor que el administrador deseaba mantener ocultas.',
    defensiveFix: 'Nunca utilizar robots.txt como control de acceso. Proteger los directorios mediante autenticación HTTP / IAM (401/403) y configurar encabezados HTTP "X-Robots-Tag: noindex, nofollow".',
    points: 15
  },
  {
    id: 'find-open-directory',
    code: 'HF-02',
    category: 'Directorio Abierto',
    title: 'Listado automático de ficheros activo (Directory Browsing / Index of)',
    severity: 'Crítica',
    recommendedDork: `site:${TARGET_DOMAIN} intitle:"index of"`,
    whereFound: `https://${TARGET_DOMAIN}/internal-docs/`,
    evidence: 'Servidor Apache responde con índice navegable que expone documentos de auditoría, esquemas SCADA y perfiles VPN.',
    cyberRisk: 'Permite a cualquier usuario no autenticado descargar la totalidad de archivos de una carpeta sin necesidad de conocer sus nombres.',
    defensiveFix: 'Deshabilitar el módulo de indexación automática: en Apache añadir "Options -Indexes" en .htaccess o en el VirtualHost; en Nginx asegurar "autoindex off;".',
    points: 15
  },
  {
    id: 'find-pdf-auditoria-meta',
    code: 'HF-03',
    category: 'Metadatos',
    title: 'Fuga de identidad de administrador, ruta local y credenciales en metadatos PDF',
    severity: 'Crítica',
    recommendedDork: `site:${TARGET_DOMAIN} filetype:pdf auditoria`,
    whereFound: `https://${TARGET_DOMAIN}/internal-docs/auditoria_interna_seguridad_2023.pdf`,
    evidence: 'Metadatos EXIF/XMP revelan autor "Carlos Mendizábal", software Word 2016 en macOS, IP NAS 192.168.10.45 y clave SNMP "public_platanos". Coordenadas GPS de Santander.',
    cyberRisk: 'Facilita campañas dirigidas de spear phishing contra Carlos Mendizábal, descubrimiento de subredes privadas (192.168.10.0/24) y ataque SNMP por contraseñas por defecto.',
    defensiveFix: 'Sanitizar metadatos antes de publicar documentos mediante herramientas automatizadas en el pipeline CI/CD o utilidades como exiftool (-all=) o Mat2.',
    points: 15
  },
  {
    id: 'find-sql-backup',
    code: 'HF-04',
    category: 'Credenciales',
    title: 'Copia de seguridad de base de datos comprimida accesible en la web pública',
    severity: 'Crítica',
    recommendedDork: `site:${TARGET_DOMAIN} (ext:sql OR ext:gz) inurl:backup`,
    whereFound: `https://${TARGET_DOMAIN}/backup-2023/db_backup_preprod_20231102.sql.gz`,
    evidence: 'Archivo de 14.2 MB que contiene volcado MySQL completo con hashes bcrypt de contraseñas de usuarios administrativos y clientes.',
    cyberRisk: 'Compromiso total de la confidencialidad de datos (RGPD) y posibilidad de crackeo offline de contraseñas de usuarios con privilegios.',
    defensiveFix: 'Los backups jamás deben residir dentro del DocumentRoot (/var/www/html) del servidor web. Deben almacenarse en un bucket S3/Cloud Storage privado con cifrado en reposo.',
    points: 20
  },
  {
    id: 'find-vpn-leak',
    code: 'HF-05',
    category: 'Credenciales',
    title: 'Perfil OpenVPN con certificado y clave embebida expuesto públicamente',
    severity: 'Crítica',
    recommendedDork: `site:${TARGET_DOMAIN} filetype:ovpn`,
    whereFound: `https://${TARGET_DOMAIN}/internal-docs/config_vpn_teletrabajo_personal.ovpn`,
    evidence: 'Archivo .ovpn con servidor remoto vpn.platanosdelnorte.es:1194 y certificado de cliente válido a nombre de carlos.mendizabal.',
    cyberRisk: 'Un atacante puede importar el perfil en un cliente OpenVPN e ingresar directamente a la red interna corporativa saltándose el perímetro defensivo.',
    defensiveFix: 'Revocar inmediatamente el certificado en la entidad certificadora (CRL). Forzar autenticación multifactor (MFA/2FA) en la pasarela VPN.',
    points: 15
  },
  {
    id: 'find-github-leak',
    code: 'HF-06',
    category: 'GitHub / Fuga de Código',
    title: 'Fuga de credenciales de base de datos y webhook de Slack en repositorio personal de GitHub',
    severity: 'Crítica',
    recommendedDork: `site:github.com "platanosdelnorte" OR "cmendi-dev"`,
    whereFound: 'https://github.com/cmendi-dev/platanos-api-scripts (archivo backup_sync.sh)',
    evidence: 'El empleado Carlos Mendizábal publicó un script con contraseña de base de datos MySQL en texto plano (PlatanosMySQL2023!#) y Webhook de Slack corporativo.',
    cyberRisk: 'Acceso a la base de datos staging e inyección de notificaciones o exfiltración mediante el canal de mensajería interna de Slack.',
    defensiveFix: 'Revocar credenciales y rotar contraseñas. Implementar herramientas de análisis de secretos en pre-commit (TruffleHog, Gitleaks, GitHub Secret Scanning).',
    points: 15
  },
  {
    id: 'find-scada-leak',
    code: 'HF-07',
    category: 'Subdominios / DNS',
    title: 'Exposición de topología SCADA y puerto industrial PLC Siemens S7',
    severity: 'Alta',
    recommendedDork: `site:${TARGET_DOMAIN} intext:"Siemens" OR intext:"SCADA"`,
    whereFound: `https://${TARGET_DOMAIN}/internal-docs/especificaciones_camaras_maduracion_v2.pdf`,
    evidence: 'Documento técnico revela IP interna 10.0.4.12 ejecutando autómata Siemens S7 en puerto 102 ISO-on-TCP para la maduración de fruta con gas etileno.',
    cyberRisk: 'Facilita ataques dirigidos a entornos OT/ICS. La manipulación de atmósferas de etileno puede arruinar cargamentos de fruta o generar riesgo físico.',
    defensiveFix: 'Aislar las redes de control industrial (OT) de las redes corporativas (IT) siguiendo la norma IEC 62443 / modelo Purdue, sin salida directa ni manuales públicos.',
    points: 10
  },
  {
    id: 'find-carlos-profile',
    code: 'HF-08',
    category: 'GitHub / Fuga de Código',
    title: 'Pivote OSINT de identidad: Organigrama a perfil público en redes y GitHub',
    severity: 'Media',
    recommendedDork: `site:${TARGET_DOMAIN} "Carlos Mendizábal" OR site:linkedin.com "Carlos Mendizábal" "Plátanos"`,
    whereFound: `https://${TARGET_DOMAIN}/quienes-somos/ -> GitHub cmendi-dev`,
    evidence: 'El nombre y rol del empleado en la web corporativa permite localizar su alias técnico "cmendi-dev", correlacionando su actividad profesional y repositorios.',
    cyberRisk: 'Proporciona el vector inicial para ingeniería social, spear phishing y descubrimiento de repositorios shadow-IT.',
    defensiveFix: 'Políticas de seguridad de la información sobre divulgación pública de nombres de administradores de sistemas y uso de cuentas corporativas separadas.',
    points: 10
  }
];

export const GRADING_RUBRIC_CRITERIA = [
  {
    section: '1. Introducción a Google Hacking',
    maxPoints: 20,
    weight: '20%',
    description: 'Claridad en la definición de Google Hacking / Dorks, distinción entre recopilación pasiva vs activa, y justificación de por qué no genera tráfico directo contra la víctima.'
  },
  {
    section: '2. Operadores de Búsqueda Avanzada',
    maxPoints: 25,
    weight: '25%',
    description: 'Identificación correcta de al menos 10 operadores (site, filetype, intitle, inurl, intext, cache, etc.) con sintaxis exacta y casos prácticos de seguridad informática.'
  },
  {
    section: '3. Práctica de Búsquedas (Mínimo 5 Hallazgos)',
    maxPoints: 25,
    weight: '25%',
    description: 'Documentación rigurosa de al menos 5 hallazgos con el dork utilizado, tipo de información buscada, resultados obtenidos y análisis del riesgo e impacto en ciberseguridad.'
  },
  {
    section: '4. Reflexión Ética y Legal',
    maxPoints: 20,
    weight: '20%',
    description: 'Madurez en responder cuándo es legítimo el uso de Google Dorks, los riesgos del mal uso (LODPD, Código Penal español art. 197 bis), y fronteras éticas del ethical hacking.'
  },
  {
    section: '5. Conclusiones y Recomendaciones Técnicas',
    maxPoints: 10,
    weight: '10%',
    description: 'Propuesta de medidas defensivas concretas (sanitización de metadatos, desactivación de Directory Browsing, bastionado de robots.txt, y control de fugas en GitHub).'
  }
];

export const GITHUB_PAGES_DEPLOYMENT_GUIDE = {
  title: 'Guía de Despliegue en GitHub Pages y Alta en Google Search Console',
  steps: [
    {
      step: 1,
      title: 'Crear repositorio en GitHub',
      detail: 'Crea un nuevo repositorio público en GitHub con el nombre "platanos-del-norte" (o tu nombre preferido).',
      codeSnippet: `git init platanos-del-norte\ncd platanos-del-norte`
    },
    {
      step: 2,
      title: 'Subir archivos estáticos preparados',
      detail: 'Coloca index.html, robots.txt, la carpeta /internal-docs/ con los PDFs de muestra y sitemap.xml en la rama main.',
      codeSnippet: `git add .\ngit commit -m "feat: initial commit target company"\ngit branch -M main\ngit remote add origin https://github.com/[TU_USUARIO]/platanos-del-norte.git\ngit push -u origin main`
    },
    {
      step: 3,
      title: 'Activar GitHub Pages',
      detail: 'En GitHub -> Settings -> Pages -> Build and deployment -> Source: "Deploy from a branch" -> Branch: "main" / "/ (root)". Guarda los cambios. Tu web estará disponible en https://[TU_USUARIO].github.io/platanos-del-norte/',
      codeSnippet: null
    },
    {
      step: 4,
      title: 'Acelerar indexación en Google Search Console',
      detail: 'Ve a https://search.google.com/search-console/ -> Añadir propiedad -> Prefijo de URL -> Introduce tu URL de GitHub Pages. Valida la propiedad mediante etiqueta HTML meta en el <head> de tu index.html.',
      codeSnippet: `<meta name="google-site-verification" content="TU_CODIGO_DE_VERIFICACION" />`
    },
    {
      step: 5,
      title: 'Enviar Sitemap y Forzar Rastreo ("Solicitar Indexación")',
      detail: '1. En Search Console -> "Sitemaps" -> Envía sitemap.xml.\n2. En la barra superior de "Inspección de URLs" busca tu URL principal y las rutas clave (/robots.txt, /internal-docs/auditoria_interna_seguridad_2023.pdf) y haz clic en "Solicitar indexación". En 24 a 72 horas los alumnos podrán usar Google Dorks reales sobre tu web.',
      codeSnippet: null
    }
  ]
};
