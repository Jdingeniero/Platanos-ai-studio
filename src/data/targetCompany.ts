import { TargetFileItem, EmployeeProfile } from '../types/osint';

export const TARGET_DOMAIN = 'platanosdelnorte.es';
export const TARGET_COMPANY_NAME = 'Plátanos del Norte S.L.';

export const TARGET_FILES: TargetFileItem[] = [
  {
    id: 'file-auditoria-2023',
    name: 'auditoria_interna_seguridad_2023.pdf',
    path: '/internal-docs/auditoria_interna_seguridad_2023.pdf',
    size: '1.8 MB',
    lastModified: '2023-11-14 11:24:02',
    mimeType: 'application/pdf',
    isConfidential: true,
    description: 'Informe técnico de auditoría y revisión de sistemas de las naves de maduración de Santander.',
    metadata: {
      title: 'Auditoría Interna de Infraestructura y Redes - Naves Candina v1.3',
      author: 'Carlos Mendizábal',
      creatorTool: 'Microsoft® Word 2016 (v16.0.4266.1001)',
      producer: 'macOS Version 13.5 (Build 22G74) Quartz PDFContext',
      creationDate: '2023-10-28 09:15:33 UTC',
      modifyDate: '2023-11-14 11:22:10 UTC',
      operatingSystem: 'macOS Ventura (MacBook-Pro-de-Carlos.local)',
      internalIp: '192.168.10.45 (NAS Synology DiskStation DS920+)',
      softwareVersion: 'Synology DSM 7.1-42661',
      gpsCoordinates: {
        lat: 43.4568,
        lng: -3.8321,
        locationName: 'Polígono Industrial Candina, Nave 14, 39011 Santander (Cantabria)'
      },
      leakedInfo: [
        'Nombre del autor y usuario del sistema: Carlos Mendizábal (cmendizabal)',
        'Ruta local de origen: /Users/carlosm/Documents/Trabajo/Platanos_Norte/Auditoria_Final.docx',
        'IP del NAS de almacenamiento interno: 192.168.10.45',
        'Comunidad SNMP de cámaras de maduración: public_platanos',
        'Credenciales de acceso a panel CCTV: admin / PlatanosSegura2023'
      ],
      rawExif: {
        'File:FileName': 'auditoria_interna_seguridad_2023.pdf',
        'File:FileSize': '1843200 bytes',
        'File:FileType': 'PDF',
        'PDF:PDFVersion': '1.7',
        'PDF:Linearized': 'No',
        'PDF:Author': 'Carlos Mendizábal <c.mendizabal@platanosdelnorte.es>',
        'PDF:Creator': 'Microsoft® Word para Mac v16.0',
        'PDF:Producer': 'Quartz PDFContext (macOS 13.5)',
        'PDF:CreateDate': '2023:10:28 09:15:33+01:00',
        'PDF:ModifyDate': '2023:11:14 11:22:10+01:00',
        'PDF:Keywords': 'candina; santander; vlan10; scada; synology; vpn-carlos',
        'PDF:Company': 'Plátanos del Norte S.L.',
        'XMP:CreatorTool': 'Microsoft Word for Mac 16.0',
        'XMP:DocumentID': 'uuid:a492f1b0-9821-4f1a-b67e-39987e9120bc',
        'GPS:Latitude': '43 deg 27\' 24.48" N',
        'GPS:Longitude': '3 deg 49\' 55.56" W'
      }
    }
  },
  {
    id: 'file-camaras-scada',
    name: 'especificaciones_camaras_maduracion_v2.pdf',
    path: '/internal-docs/especificaciones_camaras_maduracion_v2.pdf',
    size: '3.4 MB',
    lastModified: '2023-09-02 16:40:15',
    mimeType: 'application/pdf',
    isConfidential: true,
    description: 'Manual de configuración de controladores industriales de etileno y temperatura.',
    metadata: {
      title: 'Protocolo de Inyección de Etileno y Control Térmico - PLC Siemens S7',
      author: 'Elena Soto González',
      creatorTool: 'Canva Pro Desktop Export / Adobe InDesign CC 2022',
      producer: 'Adobe PDF Library 16.0.7',
      creationDate: '2023-08-30 14:02:11 UTC',
      modifyDate: '2023-09-02 16:38:00 UTC',
      operatingSystem: 'Windows 10 Pro 22H2 (DESKTOP-PLTN-OPS02)',
      internalIp: '10.0.4.12:102 (Siemens S7-1200 ISO-on-TCP)',
      softwareVersion: 'TIA Portal v17',
      gpsCoordinates: {
        lat: 43.4568,
        lng: -3.8321,
        locationName: 'Nave Frigorífica 2 - Muelle de Carga Santander'
      },
      leakedInfo: [
        'Autora: Elena Soto González (Directora Técnica de Planta)',
        'IP de Autómata SCADA industrial: 10.0.4.12 (puerto 102)',
        'Revisión: Borrador interno con comentarios de "cmendizabal" visibles en capas ocultas',
        'Servidor MQTT de telemetría de maduración: mqtt.platanosdelnorte.es:1883 (sin TLS obligatorio)'
      ],
      rawExif: {
        'File:FileName': 'especificaciones_camaras_maduracion_v2.pdf',
        'File:FileSize': '3565158 bytes',
        'PDF:Author': 'Elena Soto González',
        'PDF:Creator': 'Adobe InDesign 17.2',
        'PDF:Producer': 'Adobe PDF Library 16.0.7',
        'PDF:CreateDate': '2023:08:30 14:02:11+02:00',
        'PDF:ModifyDate': '2023:09:02 16:38:00+02:00',
        'XMP:Title': 'Especificaciones Técnicas Cámaras 1 a 6',
        'XMP:Subject': 'Confidencial - Uso interno operaciones norte'
      }
    }
  },
  {
    id: 'file-presupuesto-exportacion',
    name: 'presupuesto_confidencial_exportacion_2024.pdf',
    path: '/internal-docs/presupuesto_confidencial_exportacion_2024.pdf',
    size: '890 KB',
    lastModified: '2024-01-10 18:05:44',
    mimeType: 'application/pdf',
    isConfidential: true,
    description: 'Previsiones financieras de compra en origen (La Palma / Tenerife) y distribución retail.',
    metadata: {
      title: 'Plan Financiero y Márgenes de Distribución Norte 2024 - CONFIDENCIAL',
      author: 'Rodrigo Arango Díaz',
      creatorTool: 'LibreOffice 7.5.3 Calc -> PDF',
      producer: 'LibreOffice 7.5',
      creationDate: '2024-01-10 17:50:12 UTC',
      modifyDate: '2024-01-10 18:04:19 UTC',
      operatingSystem: 'Ubuntu 22.04 LTS (arango-laptop)',
      internalIp: '192.168.10.12',
      leakedInfo: [
        'Autor: Rodrigo Arango Díaz (CFO / Director Financiero)',
        'Precios de compra mayorista por tonelada y acuerdos con cooperativas de La Palma',
        'Número de cuenta bancaria corporativa en Banco Santander: ES76 0049 1500 21 2810492817',
        'Cif corporativo: B-39824102'
      ],
      rawExif: {
        'File:FileName': 'presupuesto_confidencial_exportacion_2024.pdf',
        'File:FileSize': '911360 bytes',
        'PDF:Author': 'Rodrigo Arango Díaz <r.arango@platanosdelnorte.es>',
        'PDF:Creator': 'Writer / Calc LibreOffice 7.5',
        'PDF:Producer': 'LibreOffice 7.5',
        'PDF:CreateDate': '2024:01:10 17:50:12+01:00',
        'PDF:Title': 'Presupuesto Estratégico 2024'
      }
    }
  },
  {
    id: 'file-backup-sql',
    name: 'db_backup_preprod_20231102.sql.gz',
    path: '/backup-2023/db_backup_preprod_20231102.sql.gz',
    size: '14.2 MB',
    lastModified: '2023-11-02 03:00:11',
    mimeType: 'application/gzip',
    isConfidential: true,
    description: 'Copia de seguridad semanal de la base de datos de pedidos y clientes de prueba (staging).',
    metadata: {
      title: 'MySQL Dump Export - platanos_preprod_db',
      author: 'mysqldump v10.19 Distrib 8.0.34',
      creatorTool: 'cron script (/opt/scripts/backup_sync.sh)',
      producer: 'GNU gzip 1.10',
      creationDate: '2023-11-02 03:00:01 UTC',
      modifyDate: '2023-11-02 03:00:11 UTC',
      internalIp: '172.24.0.5 (Docker container: db-preprod)',
      leakedInfo: [
        'Esquema SQL de tablas: `usuarios_admin`, `clientes_distribucion`, `albaranes`, `claves_api`',
        'Hashes de contraseñas de usuarios en formato bcrypt ($2b$12$...): admin, cmendizabal, rarango',
        'Host de base de datos interno: db-master.internal.platanosdelnorte.es'
      ],
      rawExif: {
        'File:FileName': 'db_backup_preprod_20231102.sql.gz',
        'File:FileSize': '14889728 bytes',
        'Archive:Compression': 'gzip deflate'
      }
    }
  },
  {
    id: 'file-vpn-ovpn',
    name: 'config_vpn_teletrabajo_personal.ovpn',
    path: '/internal-docs/config_vpn_teletrabajo_personal.ovpn',
    size: '8.4 KB',
    lastModified: '2023-10-05 19:12:00',
    mimeType: 'text/plain',
    isConfidential: true,
    description: 'Perfil de conexión OpenVPN para acceso remoto de administradores de sistemas.',
    metadata: {
      title: 'OpenVPN Client Profile - Carlos Mendizábal',
      author: 'cmendizabal',
      creatorTool: 'Easy-RSA v3.0.8 / Nano Editor',
      producer: 'OpenVPN 2.5.5',
      creationDate: '2023-10-05 19:10:00 UTC',
      modifyDate: '2023-10-05 19:12:00 UTC',
      leakedInfo: [
        'Servidor VPN remoto: vpn.platanosdelnorte.es (puerto UDP 1194)',
        'Subred interna mapeada tras conexión: 192.168.10.0/24 y 10.0.4.0/24',
        'Certificado de cliente incluido directamente en texto plano: CN=carlos.mendizabal',
        'Firma de clave CA corporativa'
      ],
      rawExif: {
        'File:FileName': 'config_vpn_teletrabajo_personal.ovpn',
        'File:FileSize': '8600 bytes',
        'File:MIMEType': 'text/x-c'
      }
    }
  },
  {
    id: 'file-catalogo-publico',
    name: 'catalogo_comercial_platanos_canarias_2024.pdf',
    path: '/Platanos-ai-studio/documentos/catalogo_comercial_platanos_canarias_2024.pdf',
    size: '4.2 MB',
    lastModified: '2024-01-15 10:00:00',
    mimeType: 'application/pdf',
    isConfidential: false,
    description: 'Catálogo de variedades, calibres y certificados de Denominación de Origen Protegida (DOP).',
    metadata: {
      title: 'Plátanos del Norte - Catálogo Comercial Hostelería y Supermercados 2024',
      author: 'Departamento de Marketing y Comunicación',
      creatorTool: 'Adobe InDesign 2023',
      producer: 'Adobe PDF Library 17.0',
      creationDate: '2024-01-14 12:00:00 UTC',
      modifyDate: '2024-01-15 09:45:00 UTC',
      leakedInfo: [
        'Documento corporativo público oficial',
        'Contacto comercial: ventas@platanosdelnorte.es',
        'Registro Sanitario: RSIPAC 21.04982/S'
      ],
      rawExif: {
        'File:FileName': 'catalogo_comercial_platanos_canarias_2024.pdf',
        'PDF:Author': 'Plátanos del Norte S.L.',
        'PDF:Keywords': 'platano de canarias; dop; maduracion; fruta fresca; distribucion norte'
      }
    }
  }
];

export const TARGET_EMPLOYEES: EmployeeProfile[] = [
  {
    id: 'emp-carlos',
    name: 'Carlos Mendizábal Ruiz',
    role: 'Responsable de Sistemas IT & Infraestructura Frigorífica',
    department: 'Tecnología y Operaciones Logísticas',
    email: 'c.mendizabal@platanosdelnorte.es',
    phone: '+34 942 88 19 40 (Ext. 204)',
    bio: 'Ingeniero técnico en informática. Apasionado del despliegue en Linux, automatización con bash, sensores IoT y control de maduración con gas etileno.',
    githubAlias: 'cmendi-dev',
    githubRepoName: 'platanos-api-scripts',
    avatarPlaceholderText: 'CM',
    socialFootprint: [
      {
        platform: 'GitHub',
        url: 'https://github.com/cmendi-dev',
        leakNotes: 'Repositorio público con scripts bash de sincronización que contienen URLs internas de staging y un webhook de Slack.'
      },
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/carlos-mendizabal-dev-santander',
        leakNotes: 'Menciona en su experiencia que administra firewalls Fortinet y servidores Synology DSM en Plátanos del Norte S.L.'
      },
      {
        platform: 'X (Twitter)',
        url: 'https://x.com/cmendi_sys',
        leakNotes: 'Comenta sobre la migración de las cámaras de Santander a Docker y consultas sobre certificados VPN caducados.'
      }
    ]
  },
  {
    id: 'emp-marta',
    name: 'Marta Revilla Barquín',
    role: 'Consejera Delegada / Directora General',
    department: 'Dirección General',
    email: 'marta.revilla@platanosdelnorte.es',
    phone: '+34 942 88 19 40 (Ext. 201)',
    bio: 'Más de 20 años en el sector hortofrutícola impulsando la distribución de plátano con denominación de origen canaria en la cornisa cantábrica.',
    avatarPlaceholderText: 'MR',
    socialFootprint: [
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/marta-revilla-hortofruticola',
        leakNotes: 'Publica fotos de visitas a las cooperativas en Tenerife y firma comunicados institucionales.'
      }
    ]
  },
  {
    id: 'emp-elena',
    name: 'Elena Soto González',
    role: 'Jefa de Planta y Control de Calidad',
    department: 'Operaciones',
    email: 'elena.soto@platanosdelnorte.es',
    phone: '+34 942 88 19 40 (Ext. 207)',
    bio: 'Bióloga especializada en fisiología vegetal y control de maduración acelerada bajo atmósferas controladas.',
    avatarPlaceholderText: 'ES',
    socialFootprint: [
      {
        platform: 'ResearchGate',
        url: 'https://researchgate.net/profile/Elena-Soto-Gonzalez-Platanos',
        leakNotes: 'Papers sobre curvas de maduración y dosificación de etileno en almacenes portuarios.'
      }
    ]
  },
  {
    id: 'emp-rodrigo',
    name: 'Rodrigo Arango Díaz',
    role: 'Director Financiero & Compras',
    department: 'Finanzas',
    email: 'r.arango@platanosdelnorte.es',
    phone: '+34 942 88 19 40 (Ext. 203)',
    bio: 'Economista encargado de la tesorería corporativa, negociaciones arancelarias y presupuestos anuales de exportación.',
    avatarPlaceholderText: 'RA',
    socialFootprint: [
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/rodrigo-arango-cfo',
        leakNotes: 'Confirma uso de software ERP SAGE 200 y banca online Banco Santander para la tesorería de la empresa.'
      }
    ]
  }
];

export const ROBOTS_TXT_CONTENT = `# robots.txt para https://platanosdelnorte.es/
# Generado automáticamente por CMS el 2023-11-10
User-agent: *

# Áreas públicas de catálogo y prensa
Allow: /
Allow: /quienes-somos/
Allow: /instalaciones/
Allow: /documentos/catalogo_comercial_platanos_canarias_2024.pdf

# Rutas protegidas - NO RASTREAR NI INDEXAR EN MOTORES DE BÚSQUEDA
Disallow: /admin-panel/
Disallow: /internal-docs/
Disallow: /backup-2023/
Disallow: /rh-nominas/
Disallow: /staging-api/
Disallow: /camaras-cctv/
Disallow: /cgi-bin/

# NOTA PARA EL ADMINISTRADOR (c.mendizabal):
# Recuerda no subir las auditorías de Candina al directorio /internal-docs/ sin contraseña
# La sincronización nocturna con GitHub corre desde el cron de las 03:00

Sitemap: https://jdingeniero.github.io/Platanos-ai-studio/sitemap.xml

# FLAG-01-ROBOTS-REVEALED
`;

export const SITEMAP_XML_CONTENT = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://jdingeniero.github.io/Platanos-ai-studio/</loc><priority>1.0</priority></url>
  <url><loc>https://jdingeniero.github.io/Platanos-ai-studio/quienes-somos</loc><priority>0.8</priority></url>
  <url><loc>https://jdingeniero.github.io/Platanos-ai-studio/instalaciones</loc><priority>0.8</priority></url>
  <url><loc>https://jdingeniero.github.io/Platanos-ai-studio/catalogo</loc><priority>0.8</priority></url>
  <url><loc>https://jdingeniero.github.io/Platanos-ai-studio/contacto</loc><priority>0.6</priority></url>
  <url><loc>https://jdingeniero.github.io/Platanos-ai-studio/prensa-2024</loc><priority>0.7</priority></url>
  <url><loc>https://jdingeniero.github.io/Platanos-ai-studio/documentos</loc><priority>0.7</priority></url>
  <url><loc>https://jdingeniero.github.io/Platanos-ai-studio/recursos</loc><priority>0.7</priority></url>
  <url><loc>https://jdingeniero.github.io/Platanos-ai-studio/documentos/catalogo_comercial_platanos_canarias_2024.pdf</loc><priority>0.5</priority></url>
  <url><loc>https://jdingeniero.github.io/Platanos-ai-studio/documentos/tarifa_mayorista_2024.pdf</loc><priority>0.5</priority></url>
  <url><loc>https://jdingeniero.github.io/Platanos-ai-studio/documentos/calendario_recogida_2024.xlsx</loc><priority>0.5</priority></url>
</urlset>`;

export const SIMULATED_GITHUB_REPO = {
  owner: 'cmendi-dev',
  ownerFullName: 'Carlos Mendizábal',
  ownerBio: 'DevOps & Systems Administrator @ Plátanos del Norte S.L. 🍌 Fan de Bash, Ansible y Grafana. Santander, Spain.',
  ownerEmail: 'carlos.mendizabal@platanosdelnorte.es',
  repoName: 'platanos-api-scripts',
  repoDescription: 'Colección de scripts de mantenimiento, backup de base de datos y sincronización de sensores para Plátanos del Norte.',
  stars: 3,
  forks: 0,
  visibility: 'Public (¡Fuga de información!)',
  files: [
    {
      name: 'backup_sync.sh',
      content: `#!/bin/bash
# ==============================================================================
# Script de sincronización de copias de seguridad de naves Candina
# Autor: Carlos Mendizábal (@cmendi-dev)
# Empresa: Plátanos del Norte S.L.
# ==============================================================================

BACKUP_DIR="/var/www/platanos/backup-2023"
REMOTE_HOST="db-master.internal.platanosdelnorte.es"
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/T05PDN981/B06AB1908/38f90ab9c9018e19ba"
API_AUTH_TOKEN="Bearer pltn_live_sec_994812a4b8891040faec91"

echo "[INFO] Iniciando volcado de preproducción..."
mysqldump -h $REMOTE_HOST -u preprod_user -p"PlatanosMySQL2023!#" platanos_preprod_db | gzip > $BACKUP_DIR/db_backup_preprod_$(date +%Y%m%d).sql.gz

# Notificar al canal interno #it-alertas
curl -X POST -H 'Content-type: application/json' --data '{"text":"Backup completado con éxito en servidor Santander"}' $SLACK_WEBHOOK_URL
`
    },
    {
      name: 'connect_vpn.sh',
      content: `#!/bin/bash
# Conexión rápida a la VPN corporativa desde casa
# Recordatorio: El certificado está en /internal-docs/config_vpn_teletrabajo_personal.ovpn
sudo openvpn --config /etc/openvpn/client/platanos_carlos.ovpn --auth-user-pass /etc/openvpn/.credentials
`
    },
    {
      name: 'README.md',
      content: `# platanos-api-scripts
Repositorio de utilidades internas para el mantenimiento de servidores de Plátanos del Norte S.L.

### Entornos
- Producción: \`https://platanosdelnorte.es\`
- Staging / API Dev: \`https://api-dev.platanosdelnorte.es\` (VLAN 10)
- SCADA Telemetría: \`10.0.4.12:102\` (Puerto ISO-on-TCP)

Contacto: c.mendizabal@platanosdelnorte.es
`
    }
  ],
  commitHistory: [
    {
      hash: 'a7f920c',
      date: 'Hace 4 meses',
      message: 'quick fix: update staging webhook credentials and auth token',
      author: 'Carlos Mendizábal <carlos.mendizabal@platanosdelnorte.es>',
      diff: `+ SLACK_WEBHOOK_URL="https://hooks.slack.com/services/T05PDN981/B06AB1908/38f90ab9c9018e19ba"
+ API_AUTH_TOKEN="Bearer pltn_live_sec_994812a4b8891040faec91"`
    },
    {
      hash: '91bc04e',
      date: 'Hace 6 meses',
      message: 'añadida ruta al directorio /backup-2023 para volcados nocturnos',
      author: 'Carlos Mendizábal <cmendi-dev@users.noreply.github.com>',
      diff: `+ BACKUP_DIR="/var/www/platanos/backup-2023"`
    },
    {
      hash: '3d88190',
      date: 'Hace 8 meses',
      message: 'Initial commit: scripts de monitoreo para servidores Santander',
      author: 'Carlos Mendizábal <carlos.mendizabal@platanosdelnorte.es>',
      diff: '+ README.md initial version'
    }
  ]
};

export const PASSIVE_INFRASTRUCTURE_DATA = {
  domain: 'platanosdelnorte.es',
  registrar: 'Nominalia Internet S.L.',
  whois: {
    domainName: 'platanosdelnorte.es',
    status: 'ACTIVE',
    registeredOn: '2019-04-12',
    expiresOn: '2027-04-12',
    registrantName: 'Rodrigo Arango Díaz (Plátanos del Norte S.L.)',
    registrantEmail: 'r.arango@platanosdelnorte.es',
    registrantCity: 'Santander',
    registrantCountry: 'ES',
    nameServers: [
      'ns1.nominalia.com (194.30.0.119)',
      'ns2.nominalia.com (194.30.0.120)'
    ]
  },
  dnsRecords: [
    { type: 'A', name: 'platanosdelnorte.es', value: '185.132.44.18', ttl: 3600, notes: 'Servidor Web Apache/2.4.52 (Ubuntu)' },
    { type: 'A', name: 'www.platanosdelnorte.es', value: '185.132.44.18', ttl: 3600, notes: 'CNAME alias a dominio raíz' },
    { type: 'A', name: 'vpn.platanosdelnorte.es', value: '185.132.44.22', ttl: 1800, notes: 'Servidor OpenVPN Gateway (acceso IT remoto)' },
    { type: 'A', name: 'api-dev.platanosdelnorte.es', value: '185.132.44.29', ttl: 300, notes: 'Entorno Staging/Desarrollo (expuesto sin firewall IP)' },
    { type: 'MX', name: 'platanosdelnorte.es', value: '10 mail.platanosdelnorte.es (185.132.44.19)', ttl: 3600, notes: 'Servidor de correo corporativo Postfix' },
    { type: 'TXT', name: 'platanosdelnorte.es', value: 'v=spf1 ip4:185.132.44.19 ip4:185.132.44.29 include:_spf.google.com ~all', ttl: 3600, notes: 'Registro SPF (revela IP de api-dev permitida para enviar correos)' }
  ],
  certificateTransparencyLogs: [
    {
      loggedAt: '2023-10-15',
      issuer: "Let's Encrypt Authority X3",
      commonName: '*.platanosdelnorte.es',
      dnsNames: ['platanosdelnorte.es', 'www.platanosdelnorte.es', 'vpn.platanosdelnorte.es', 'api-dev.platanosdelnorte.es', 'camaras-candina.platanosdelnorte.es']
    },
    {
      loggedAt: '2023-04-10',
      issuer: 'Sectigo RSA Domain Validation',
      commonName: 'platanosdelnorte.es',
      dnsNames: ['platanosdelnorte.es', 'mail.platanosdelnorte.es']
    }
  ]
};
