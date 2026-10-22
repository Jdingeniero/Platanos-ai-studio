export interface Challenge {
  id: string;
  code: string;
  title: string;
  flag: string;
  shortDesc: string;
  hint: string;
  dorkSuggestion: string;
  hints: string[];
  phase: 'passive' | 'active';
  operator?: string;
  phaseLabel: string;
}

export const OFFICIAL_CHALLENGES: Challenge[] = [
  // =========================================================================
  // FASE 1: RECOPILACIÓN PASIVA (Google Dorks en Contenido Público e Indexado)
  // =========================================================================
  {
    id: 'pasivo-1',
    code: 'DORK-01',
    title: 'Mapeo de Páginas Públicas Indexadas con Operador site:',
    flag: 'FLAG-D1-SITE-MAPPED',
    shortDesc: 'Localización de la sala de prensa 2024 oculta del navbar pero indexada en el sitemap de Google.',
    hint: 'Usa el operador site: para acotar las búsquedas al dominio de la cooperativa y descubrir páginas públicas no visibles en el menú.',
    dorkSuggestion: 'site:jdingeniero.github.io/Platanos-ai-studio prensa',
    operator: 'site:',
    phase: 'passive',
    phaseLabel: 'Fase 1: Pasiva (Google Dorks)',
    hints: [
      'Un analista OSINT busca limitar las respuestas de Google a un único dominio objetivo para mapear todo su contenido público.',
      'El operador site: restringe la búsqueda exclusivamente al dominio indicado (ej. site:jdingeniero.github.io/Platanos-ai-studio).',
      'Ejecuta site:jdingeniero.github.io/Platanos-ai-studio prensa-2024 o revisa el sitemap enlazado en el pie de página para acceder a /prensa-2024 y copiar la flag.'
    ]
  },
  {
    id: 'pasivo-2',
    code: 'DORK-02',
    title: 'Búsqueda por Título de Página con Operador intitle:',
    flag: 'FLAG-D2-TITLE-FOUND',
    shortDesc: 'Filtrado de páginas corporativas que contengan específicamente "catálogo comercial" en su etiqueta HTML <title>.',
    hint: 'Busca páginas cuyo título contenga las palabras exactas "catálogo comercial".',
    dorkSuggestion: 'site:jdingeniero.github.io/Platanos-ai-studio intitle:"catálogo comercial"',
    operator: 'intitle:',
    phase: 'passive',
    phaseLabel: 'Fase 1: Pasiva (Google Dorks)',
    hints: [
      'Los títulos HTML (<title>) definen la temática principal de cada página web y son indexados de forma prioritaria por Google.',
      'El operador intitle:"palabra o frase" obliga a que el término aparezca exactamente en el título de la página.',
      'Combina site:jdingeniero.github.io/Platanos-ai-studio intitle:"catálogo comercial" para navegar a /catalogo y ver la flag visible en la ficha técnica.'
    ]
  },
  {
    id: 'pasivo-3',
    code: 'DORK-03',
    title: 'Descubrimiento de Directorios Públicos con Operador inurl:',
    flag: 'FLAG-D3-URL-FOUND',
    shortDesc: 'Detección del repositorio público de documentación oficial filtrando la cadena en la propia URL.',
    hint: 'Busca URLs de la cooperativa que contengan la palabra clave "documentos".',
    dorkSuggestion: 'site:jdingeniero.github.io/Platanos-ai-studio inurl:documentos',
    operator: 'inurl:',
    phase: 'passive',
    phaseLabel: 'Fase 1: Pasiva (Google Dorks)',
    hints: [
      'Muchas empresas organizan sus recursos públicos bajo ramas de URL temáticas como /docs, /documentos o /descargas.',
      'El operador inurl: filtra las páginas cuya dirección URL incluya la cadena buscada.',
      'Usa site:jdingeniero.github.io/Platanos-ai-studio inurl:documentos para descubrir el índice público /documentos y copiar la flag.'
    ]
  },
  {
    id: 'pasivo-4',
    code: 'DORK-04',
    title: 'Extracción de Tarifas Comerciales con Operador filetype:pdf',
    flag: 'FLAG-D4-PDF-FOUND',
    shortDesc: 'Localización y descarga directa de documentos PDF indexados para examinar su contenido textual.',
    hint: 'Filtra documentos en formato PDF que contengan información de tarifas o precios mayoristas.',
    dorkSuggestion: 'site:jdingeniero.github.io/Platanos-ai-studio filetype:pdf tarifa',
    operator: 'filetype:pdf',
    phase: 'passive',
    phaseLabel: 'Fase 1: Pasiva (Google Dorks)',
    hints: [
      'Google indexa el contenido completo del texto incrustado dentro de los archivos PDF corporativos.',
      'El operador filetype:pdf (o ext:pdf) localiza documentos descargables en dicho formato.',
      'Lanza site:jdingeniero.github.io/Platanos-ai-studio filetype:pdf mayorista para descargar tarifa_mayorista_2024.pdf y leer la firma FLAG-D4-PDF-FOUND.'
    ]
  },
  {
    id: 'pasivo-5',
    code: 'DORK-05',
    title: 'Análisis de Metadatos en Hojas de Cálculo con filetype:xlsx',
    flag: 'FLAG-D5-METADATA',
    shortDesc: 'Descarga del calendario agrícola en formato Excel y extracción de la autoría oculta en los metadatos del documento.',
    hint: 'Localiza hojas de cálculo XLSX indexadas e inspecciona sus metadatos (autor/creador) con exiftool o las propiedades del archivo.',
    dorkSuggestion: 'site:jdingeniero.github.io/Platanos-ai-studio filetype:xlsx (+ inspeccionar metadatos con exiftool)',
    operator: 'filetype:xlsx',
    phase: 'passive',
    phaseLabel: 'Fase 1: Pasiva (Google Dorks)',
    hints: [
      'Los documentos ofimáticos (Word, Excel) guardan metadatos internos que no aparecen en las celdas visibles pero que revelan nombres de autores y softwares.',
      'Usa filetype:xlsx para encontrar el archivo de calendario de recogida. Tras descargarlo, examina las propiedades del archivo o ejecuta exiftool calendario_recogida_2024.xlsx.',
      'En el campo "Author / Creator" o "Title" del fichero XLSX encontrarás la clave FLAG-D5-METADATA.'
    ]
  },
  {
    id: 'pasivo-6',
    code: 'DORK-06',
    title: 'Detección de Directorio Abierto Público con intitle:"index of"',
    flag: 'FLAG-D6-OPENDIR',
    shortDesc: 'Identificación de réplicas de indexado de directorios Apache públicos con recursos benignos indexados.',
    hint: 'Busca directorios con indexado automático Apache habilitado usando la clásica cadena "index of" en el título.',
    dorkSuggestion: 'site:jdingeniero.github.io/Platanos-ai-studio intitle:"index of" recursos',
    operator: 'intitle:"index of"',
    phase: 'passive',
    phaseLabel: 'Fase 1: Pasiva (Google Dorks)',
    hints: [
      'Cuando un servidor web Apache no encuentra un index.html en una carpeta permitida, genera un listado de ficheros con el título "Index of /".',
      'El dork intitle:"index of" permite encontrar estos listados automáticos en cualquier servidor web.',
      'Lanza site:jdingeniero.github.io/Platanos-ai-studio intitle:"index of" recursos para acceder al directorio público /recursos/ y copiar la flag.'
    ]
  },

  // =========================================================================
  // FASES 2, 3 y 4: INTRUSIÓN Y ACCESO ACTIVO (Hacking Activo / Fuera de Google)
  // =========================================================================
  {
    id: 'reto-1',
    code: 'ACTIVO-01',
    title: 'Descubrimiento de Directivas de Rastreo en robots.txt',
    flag: 'FLAG-01-ROBOTS-REVEALED',
    shortDesc: 'Identificación de directivas Disallow que intentan ocultar rutas internas a motores de búsqueda.',
    hint: 'Inspecciona manualmente el archivo estándar de directivas de rastreo en la raíz (/robots.txt) para ver qué carpetas intenta ocultar el administrador a Google.',
    dorkSuggestion: 'Navegación directa manual a /robots.txt (Pivoting desde la raíz, no indexado en Google)',
    phase: 'active',
    phaseLabel: 'Fase 2: Intrusión (Pivoting robots.txt)',
    hints: [
      '¿Dónde configuran habitualmente los administradores web las reglas de rastreo para Googlebot? Existe un fichero estándar en la raíz del dominio.',
      'Esta técnica no es un Google Dork, sino pivoting manual: los motores de búsqueda respetan robots.txt, pero los atacantes lo leen directamente para hallar directorios ocultos.',
      'Navega a la URL /robots.txt en tu navegador para leer todas las rutas privadas que la empresa intentó vetar a los buscadores con directivas Disallow:.'
    ]
  },
  {
    id: 'reto-2',
    code: 'ACTIVO-02',
    title: 'Explotación de Directorio Abierto No Indexado (/internal-docs/)',
    flag: 'FLAG-02-DIR-LISTING-EXPOSED',
    shortDesc: 'Acceso manual a un listado de directorios vetado en robots.txt con documentos internos y hojas ofimáticas sin protección.',
    hint: 'Prueba a navegar a la ruta privada revelada en robots.txt: /internal-docs/.',
    dorkSuggestion: 'Pivoting manual: navegar directamente a /internal-docs/ (Hacking Activo detectado por Honeypot)',
    phase: 'active',
    phaseLabel: 'Fase 2: Intrusión (Fuga de Ficheros)',
    hints: [
      'En robots.txt descubriste rutas marcadas con Disallow:. Al estar vetadas, Google nunca las indexa; debes pivotar introduciendo la ruta a mano.',
      'Acceder a una ruta privada vetada a los buscadores constituye Hacking Activo y activa las alertas del sensor Honeypot de la cooperativa.',
      'Navega directamente a la ruta /internal-docs/ para inspeccionar los documentos internos y hojas de cálculo expuestas sin autenticación.'
    ]
  },
  {
    id: 'reto-3',
    code: 'ACTIVO-03',
    title: 'Fuga de Respaldos de BD y Logs No Indexados (/backup-2023/ o /chat/logs/)',
    flag: 'FLAG-03-BACKUP-LOGS-LEAK',
    shortDesc: 'Localización de volcados SQL (db_dump_preprod.sql) o registros de chat de soporte IT con credenciales.',
    hint: 'Explora las otras rutas sensibles vetadas en robots.txt: /backup-2023/ o /chat/logs/.',
    dorkSuggestion: 'Pivoting manual: navegar a /backup-2023/ o /chat/logs/ (Rutas vetadas en Google)',
    phase: 'active',
    phaseLabel: 'Fase 2: Intrusión (Fuga de Ficheros)',
    hints: [
      'Los administradores suelen dejar copias de seguridad de bases de datos o historiales de soporte en subcarpetas vetadas al robot de Google.',
      'Pivota manualmente navegando a las otras rutas descubiertas en robots.txt que el administrador intentó mantener ocultas.',
      'Navega a /backup-2023/ para localizar el volcado db_dump_preprod.sql o visita /chat/logs/ para leer las conversaciones de soporte con filtraciones.'
    ]
  },
  {
    id: 'reto-4',
    code: 'ACTIVO-04',
    title: 'Extracción de Credenciales en Archivo Interno',
    flag: 'FLAG-04-PASSWORD-IN-FILE',
    shortDesc: 'Descarga y análisis de control_acceso_proveedores_2023.xls o db_dump_preprod.sql con contraseñas.',
    hint: 'Descarga el archivo Excel "control_acceso_proveedores_2023.xls" en /internal-docs/ o el dump SQL en /backup-2023/ y revisa las credenciales de Carlos Mendizábal.',
    dorkSuggestion: 'Análisis forense de documentos obtenidos en directorios privados no indexados',
    phase: 'active',
    phaseLabel: 'Fase 3: Intrusión (Extracción de Credenciales)',
    hints: [
      'Una vez dentro de los directorios no indexados, inspecciona los archivos ofimáticos o volcados SQL en busca de tablas de usuarios y contraseñas.',
      'Presta especial atención a ficheros como hojas de cálculo de control de acceso o volcados SQL de preproducción. Busca usuarios de Operaciones.',
      'Descarga "control_acceso_proveedores_2023.xls" en /internal-docs/ o abre "db_dump_preprod.sql". Encontrarás el usuario "cmendizabal" con la contraseña "PlatanosCandina2023*!".'
    ]
  },
  {
    id: 'reto-5',
    code: 'ACTIVO-05',
    title: 'Intrusión y Acceso a la Intranet Corporativa (/admin-panel)',
    flag: 'FLAG-05-INTRANET-UNLOCKED',
    shortDesc: 'Autenticación exitosa en el panel privado de administración con las claves filtradas (Art. 197 bis CP).',
    hint: 'Pulsa el botón "Acceso Intranet" en la barra superior o ve a /admin-panel e inicia sesión con el usuario "cmendizabal" y la contraseña hallada.',
    dorkSuggestion: 'Login en portal restringido /admin-panel con cmendizabal / PlatanosCandina2023*!',
    phase: 'active',
    phaseLabel: 'Fase 3: Intrusión (Acceso No Autorizado)',
    hints: [
      'Ya dispones de credenciales operativas válidas. Ahora debes encontrar el portal de acceso restringido para los empleados de la cooperativa.',
      'En la barra de navegación superior encontrarás el enlace "Acceso Intranet", o puedes acceder directamente a la ruta /admin-panel.',
      'Inicia sesión en /admin-panel con el usuario "cmendizabal" y la contraseña "PlatanosCandina2023*!". Se desbloqueará el panel de control operativo.'
    ]
  },
  {
    id: 'reto-6',
    code: 'ACTIVO-06',
    title: 'Manipulación de Parámetros SCADA de Maduración',
    flag: 'FLAG-06-SCADA-TAKEOVER',
    shortDesc: 'Interacción con el panel SCADA para regular la temperatura o etileno de la Cámara 4 (Art. 264 CP / Infraestructura Crítica).',
    hint: 'Una vez dentro de la intranet, busca los mandos manuales de calibración de la Cámara 4 y pulsa cualquier ajuste térmico o de dosificación de etileno.',
    dorkSuggestion: 'Comandos manuales sobre autómata PLC 10.0.4.12:102 en red industrial OT',
    phase: 'active',
    phaseLabel: 'Fase 4: Control Industrial SCADA (Sabotaje)',
    hints: [
      'Dentro de la intranet privada hay un sistema SCADA que monitoriza las cámaras frigoríficas industriales de maduración de plátano.',
      'Localiza los controles de la Cámara 4 (Nave Principal). Observa los paneles de temperatura y partes por millón (ppm) de gas etileno.',
      'Pulsa cualquiera de los botones de ajuste térmico (+0.5°C o -0.5°C) o de dosificación de etileno para forzar un comando sobre el autómata PLC.'
    ]
  },
  {
    id: 'reto-7',
    code: 'ACTIVO-07',
    title: 'Exfiltración de Expediente Confidencial Nivel 3',
    flag: 'FLAG-07-CONFIDENTIAL-EXFIL',
    shortDesc: 'Descarga del documento clasificado "informe_restringido_aduanas_precios_2024.pdf" con precios y cuentas bancarias (Art. 197 CP).',
    hint: 'En la parte inferior de la intranet activa, pulsa en "Descargar Expediente Nivel 3" para completar la exfiltración final.',
    dorkSuggestion: 'Descarga de informe_restringido_aduanas_precios_2024.pdf (Exfiltración de Secretos Comerciales)',
    phase: 'active',
    phaseLabel: 'Fase 4: Exfiltración de Información Confidencial',
    hints: [
      'Para culminar la auditoría, debes demostrar la capacidad de exfiltrar información clasificada de alto impacto económico.',
      'Al final del panel de la intranet se encuentra la sección de "Archivos y Expedientes Confidenciales Nivel 3".',
      'Haz clic en el botón "Descargar Expediente Nivel 3" para descargar el informe reservado con acuerdos de precios y completar todos los retos.'
    ]
  }
];
