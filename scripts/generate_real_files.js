import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Helper to create a minimal, 100% valid PDF with metadata and visible pages
function createValidPdf({ title, author, subject, keywords, creator, producer, creationDate, pageText }) {
  // We construct valid PDF objects
  const objects = [];
  
  // 1: Catalog
  objects.push(`1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj`);

  // 2: Pages
  objects.push(`2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj`);

  // Stream content for page
  // Escape parentheses in text
  const cleanText = pageText.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const lines = cleanText.split('\n');
  let streamLines = ['BT', '/F1 12 Tf', '50 750 Td', '16 TL'];
  lines.forEach((line, i) => {
    if (i === 0) {
      streamLines.push(`(${line}) Tj`);
    } else {
      streamLines.push(`T* (${line}) Tj`);
    }
  });
  streamLines.push('ET');
  const streamBody = streamLines.join('\n');
  const streamLength = Buffer.byteLength(streamBody, 'utf8');

  // 3: Page
  objects.push(`3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 595.28 841.89]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 5 0 R
    >>
  >>
>>
endobj`);

  // 4: Contents stream
  objects.push(`4 0 obj
<<
  /Length ${streamLength}
>>
stream
${streamBody}
endstream
endobj`);

  // 5: Standard Font Helvetica
  objects.push(`5 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
>>
endobj`);

  // 6: Info Dictionary with real metadata
  objects.push(`6 0 obj
<<
  /Title (${title})
  /Author (${author})
  /Subject (${subject})
  /Keywords (${keywords})
  /Creator (${creator})
  /Producer (${producer})
  /CreationDate (${creationDate})
  /ModDate (${creationDate})
>>
endobj`);

  // Now assemble file with xref table
  let pdf = `%PDF-1.4\n%âãÏÓ\n`;
  const offsets = [];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += objects[i] + '\n';
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  for (let i = 0; i < offsets.length; i++) {
    pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }

  pdf += `trailer
<<
  /Size ${objects.length + 1}
  /Root 1 0 R
  /Info 6 0 R
>>
startxref
${xrefOffset}
%%EOF\n`;

  return Buffer.from(pdf, 'utf8');
}

// Ensure directories exist
const publicDir = path.resolve('public');
const internalDocsDir = path.join(publicDir, 'internal-docs');
const backupDir = path.join(publicDir, 'backup-2023');
const chatLogsDir = path.join(publicDir, 'chat', 'logs');
const documentosDir = path.join(publicDir, 'documentos');

[internalDocsDir, backupDir, chatLogsDir, documentosDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. Auditoria Interna PDF
const pdfAuditoria = createValidPdf({
  title: 'Auditoría Interna de Infraestructura y Redes - Naves Candina v1.3',
  author: 'Carlos Mendizábal Ruiz <c.mendizabal@platanosdelnorte.es>',
  subject: 'Auditoría Confidencial Sistemas Candina - Uso Restringido',
  keywords: 'candina; santander; vlan10; nas:192.168.10.45; snmp:public_platanos; gps:43.4568,-3.8321; cctv:PlatanosSegura2023',
  creator: 'Microsoft® Word 2016 para Mac',
  producer: 'macOS Version 13.5 (Build 22G74) Quartz PDFContext',
  creationDate: "D:20231028091533+01'00'",
  pageText: `PLATANOS DEL NORTE S.L. - INFORME TECNICO DE AUDITORIA INTERNA
Fecha: 28 de Octubre de 2023
Elaborado por: Carlos Mendizabal Ruiz (Responsable IT & Sistemas)
Clasificacion: ESTRICTAMENTE CONFIDENCIAL / USO INTERNO

1. RESUMEN DE INFRAESTRUCTURA Y REDES EN NAVES CANDINA (SANTANDER)
- Rango de red local privada: 192.168.10.0/24 (VLAN 10 Operaciones)
- Servidor NAS Synology DiskStation DS920+: IP 192.168.10.45
- Pasarela VPN remota: vpn.platanosdelnorte.es (Puerto UDP 1194)
- Enlace WAN fibra: 185.132.44.18 (Nominalia Internet)

2. DISPOSITIVOS Y HALLAZGOS CRITICOS PENDIENTES DE BASTIONADO
- Camaras frigorificas de vigilancia (CCTV):
  * Direccion: 192.168.10.80 a 192.168.10.88
  * Contrasena de administracion por defecto: admin / PlatanosSegura2023
  * Comunidad SNMP v2c de monitorizacion: public_platanos
- Servidor de base de datos preproduccion:
  * IP interna: 172.24.0.5 (Docker: db-preprod)
  * Script de backup nocturno: /var/www/platanos/backup-2023/
  * Tarea programada: cron diario a las 03:00

3. ACCESO REMOTO
- Recordatorio a tecnicos: El archivo de configuracion OpenVPN se encuentra
  alojado temporalmente en /internal-docs/config_vpn_teletrabajo_personal.ovpn.`
});
fs.writeFileSync(path.join(internalDocsDir, 'auditoria_interna_seguridad_2023.pdf'), pdfAuditoria);

// 2. Camaras Maduracion SCADA PDF
const pdfCamaras = createValidPdf({
  title: 'Especificaciones Tecnicas Camaras 1 a 6 - Protocolo Etileno v2',
  author: 'Elena Soto González <elena.soto@platanosdelnorte.es>',
  subject: 'Control de Atmosferas Modificadas e Inyeccion de Gas Etileno',
  keywords: 'scada; siemens:s7-1200; plc:10.0.4.12; etileno; galdar; canarias; temperatura:13.5C',
  creator: 'Adobe InDesign 17.2 (Macintosh)',
  producer: 'Adobe PDF Library 16.0.7',
  creationDate: "D:20230830140211+02'00'",
  pageText: `PLATANOS DEL NORTE S.L. - ESPECIFICACIONES TECNICAS DE MADURACION
Autora: Elena Soto Gonzalez (Directora Tecnica de Planta)
Supervision de Sistemas: Carlos Mendizabal Ruiz

1. CONTROLADORES INDUSTRIALES SCADA / PLC
- Automata central de planta: Siemens S7-1200
- Direccion IP del PLC: 10.0.4.12:102 (Protocolo ISO-on-TCP)
- Protocolo de telemetria MQTT: mqtt.platanosdelnorte.es:1883

2. DOSIFICACION DE GAS ETILENO
- Concentracion objetivo: 1000 ppm en camara sellada durante 24h.
- Lotes procedentes de cooperativas asociadas en Galdar (Gran Canaria) y La Palma.
- Mantener temperatura de pulpa estricta entre 13.5 C y 14.5 C.`
});
fs.writeFileSync(path.join(internalDocsDir, 'especificaciones_camaras_maduracion_v2.pdf'), pdfCamaras);

// 3. Catalogo Comercial PDF (Publico)
const pdfCatalogo = createValidPdf({
  title: 'Platanos del Norte S.L. - Catalogo Comercial de Variedades 2024',
  author: 'Departamento Comercial - Platanos del Norte S.L.',
  subject: 'Platano de Canarias IGP - Variedades Extra y Primera',
  keywords: 'platano de canarias; dop; galdar; la palma; santander; distribucion hortofruticola',
  creator: 'Adobe InDesign 2023',
  producer: 'Adobe PDF Library 17.0',
  creationDate: "D:20240115094500+01'00'",
  pageText: `PLATANOS DEL NORTE S.L. - CATALOGO COMERCIAL 2024
Distribucion Mayorista de Platano de Canarias IGP en Santander y Cornisa Cantabrica.
Sede: Poligono Candina, Nave 14, 39011 Santander (Cantabria)

ORIGEN Y COOPERATIVAS SOCIAS:
- Cooperativa Agricola del Norte de Gran Canaria (Galdar)
- Cooperativa Agraria de Los Llanos de Aridane (La Palma)

VARIEDADES Y CALIBRES:
- Platano Extra: Calibre >20 cm, maduracion uniforme grado 4 (amarillo suave).
- Platano Primera: Calibre 16 a 20 cm, excelente sabor y motas caracteristicas.
- Contacto Comercial: ventas@platanosdelnorte.es | Tel: +34 942 88 19 40.`
});
fs.writeFileSync(path.join(documentosDir, 'catalogo_comercial_platanos_canarias_2024.pdf'), pdfCatalogo);

// 4. Excel file with passwords: filetype:xls "password"
const xlsContent = `ID\tProveedor\tServicio\tUsuario\tPassword\tEmail_Contacto\tNotas_Seguridad
1\tPlatanos del Norte S.L.\tAcceso Intranet /admin-panel\tcmendizabal\tPlatanosCandina2023*!\tcarlos.mendizabal@platanosdelnorte.es\tCredencial acceso panel SCADA y camaras Candina (FLAG-04-PASSWORD-IN-FILE)
2\tNominalia Internet\tHosting y Dominio .es\tplatanos_admin\tNominaliaPass99*!\tr.arango@platanosdelnorte.es\tRenovacion automatica en abril
3\tGasEtileno Norte\tSuministro Botellas Etileno\toperador_gas\tEtilenoSeguro#24\tpedidos@gasetileno.com\tValvula de seguridad nave 14
4\tTransportes FrioExpress\tFlota Camiones Santander-Bilbao\tlogistica_pltn\tFrio2023Express$\tcarlos.mendizabal@platanosdelnorte.es\tTelemetria GPS camiones
5\tSynology NAS Storage\tAlmacenamiento Auditorias\tadmin\tSynologyAdminCandina2023\tc.mendizabal@platanosdelnorte.es\tIP 192.168.10.45 puerto 5000
6\tMySQL Preproduccion\tBase de Datos Clientes\tpreprod_user\tPlatanosMySQL2023!#\tcmendi-dev@github\tVer script backup_sync.sh
7\tAuditoria Credenciales OSINT\tFiltro Passwords en Fichero\tauditor_sec\tFLAG-04-PASSWORD-IN-FILE\tseguridad@platanosdelnorte.es\tFLAG-04-PASSWORD-IN-FILE
`;
fs.writeFileSync(path.join(internalDocsDir, 'control_acceso_proveedores_2023.xls'), xlsContent);

// 5. OpenVPN config profile (.ovpn)
const ovpnContent = `client
dev tun
proto udp
remote vpn.platanosdelnorte.es 1194
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
cipher AES-256-GCM
auth SHA256

# Perfil personal teletrabajo: Carlos Mendizabal (cmendizabal)
# Subred accesible tras conexion: 192.168.10.0/24 y 10.0.4.0/24

<ca>
-----BEGIN CERTIFICATE-----
MIIB/zCCAaWgAwIBAgIUWj8g7+Yx1QG2N4...
[PLATANOS DEL NORTE CA ROOT CERTIFICATE]
-----END CERTIFICATE-----
</ca>

<cert>
-----BEGIN CERTIFICATE-----
MIICBjCCAbegAwIBAgIUAq12m8k4...
CN=carlos.mendizabal@platanosdelnorte.es
-----END CERTIFICATE-----
</cert>

<key>
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASC...
[PRIVATE KEY - Carlos Mendizabal]
-----END PRIVATE KEY-----
</key>
`;
fs.writeFileSync(path.join(internalDocsDir, 'config_vpn_teletrabajo_personal.ovpn'), ovpnContent);

// 6. SQL Database Dump: filetype:sql "MySQL dump" (pass|password|passwd|pwd)
const sqlDumpContent = `-- MySQL dump 10.19 Distrib 8.0.34, for Linux (x86_64)
-- Host: db-master.internal.platanosdelnorte.es    Database: platanos_preprod_db
-- ------------------------------------------------------
-- Server version	8.0.34-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;

--
-- Table structure for table \`usuarios_admin\`
--

DROP TABLE IF EXISTS \`usuarios_admin\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`usuarios_admin\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`username\` varchar(50) NOT NULL,
  \`email\` varchar(100) NOT NULL,
  \`password_hash\` varchar(255) NOT NULL,
  \`password_clear_temp\` varchar(100) DEFAULT NULL,
  \`rol\` varchar(30) DEFAULT 'operador',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`usuarios_admin\`
--

LOCK TABLES \`usuarios_admin\` WRITE;
/*!40000 ALTER TABLE \`usuarios_admin\` DISABLE KEYS */;
INSERT INTO \`usuarios_admin\` VALUES 
(1,'admin','admin@platanosdelnorte.es','$2b$12$KIXsJk3eQxI4x8B2lP.W2eZJmN.eA7uH1jC6v2w8910aBcDeFgHi','PlatanosAdmin2023!','superadmin'),
(2,'cmendizabal','c.mendizabal@platanosdelnorte.es','$2b$12$yT6fWp9rL1zC3v5b7n8m0k2j4h6g8f1d3s5a7q9w1e3r5t7y9','PlatanosCandina2023*!','devops_systems'),
(3,'rarango','r.arango@platanosdelnorte.es','$2b$12$mN5b8v1c3x7z9a2s4d6f8h0j2k4l6q8w0e2r4t6y8u0i2o4p6','ArangoFinanzas#2024','cfo'),
(4,'esoto','elena.soto@platanosdelnorte.es','$2b$12$pO0i9u8y7t6r5e4w3q2a1s2d3f4g5h6j7k8l9z8x7c6v5b4n3','EtilenoCalidad2023$','calidad');
/*!40000 ALTER TABLE \`usuarios_admin\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`claves_api\`
--

DROP TABLE IF EXISTS \`claves_api\`;
CREATE TABLE \`claves_api\` (
  \`servicio\` varchar(50) NOT NULL,
  \`token_secreto\` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`claves_api\` VALUES
('slack_alertas_it','https://hooks.slack.com/services/T05PDN981/B06AB1908/38f90ab9c9018e19ba'),
('api_maduracion_scada','pltn_live_sec_994812a4b8891040faec91');

-- Token de credenciales OSINT:
-- FLAG-04-PASSWORD-IN-FILE

-- Dump completed on 2023-11-02  3:00:11
`;
fs.writeFileSync(path.join(backupDir, 'db_dump_preprod.sql'), sqlDumpContent);

// Also create .sql.gz
const gzipped = zlib.gzipSync(Buffer.from(sqlDumpContent, 'utf8'));
fs.writeFileSync(path.join(backupDir, 'db_backup_preprod_20231102.sql.gz'), gzipped);

// 7. Chat Logs: "index of" / "chat/logs"
const chatLogContent = `[2023-11-01 10:14:02] [IT-Support] Sesion iniciada entre Carlos Mendizabal (@cmendi-dev) y Elena Soto (@esoto).
[2023-11-01 10:14:22] Elena Soto: Hola Carlos, la camara 4 en Candina dio un pico de 15.2 grados y la alarma salto en el SCADA.
[2023-11-01 10:15:10] Carlos Mendizabal: Revisado. Fue un reinicio del controlador Siemens en la 10.0.4.12 puerto 102. Ya esta estabilizado a 13.8 C.
[2023-11-01 10:16:05] Elena Soto: Perfecto. Por cierto, ¿donde dejaste la clave de acceso a la intranet corporativa (/admin-panel)?
[2023-11-01 10:16:40] Carlos Mendizabal: Puedes entrar con mi usuario 'cmendizabal' y la clave 'PlatanosCandina2023*!'. Tambien deje el listado completo de passwords en /internal-docs/control_acceso_proveedores_2023.xls para compras.
[2023-11-01 10:17:15] Elena Soto: Genial, entro a revisar las graficas de gas etileno. Recuerda proteger esa hoja de calculo.
[2023-11-01 10:17:50] Carlos Mendizabal: Si, el backup diario corre a las 03:00 y lo deja en /backup-2023/db_dump_preprod.sql. Lo subi a mi github personal en cmendi-dev/platanos-api-scripts.
[2023-11-01 10:18:30] Elena Soto: Muy bien, cierro el ticket de soporte. Saludos.
`;
fs.writeFileSync(path.join(chatLogsDir, 'conversacion_soporte_it_202311.log'), chatLogContent);

// 8. Restricted PDF inside Intranet
const pdfRestringido = createValidPdf({
  title: 'Expediente Clasificado: Auditoria Aduanera y Precios Mayoristas 2024',
  author: 'Rodrigo Arango Díaz (CFO) & Carlos Mendizabal',
  subject: 'Documento Confidencial Nivel 3 - Platanos del Norte S.L.',
  keywords: 'aduanas; mercadona:precios; eroski; aranceles; santander; vpn-token:pltn-root-9941',
  creator: 'LibreOffice Calc 7.5.3',
  producer: 'LibreOffice 7.5',
  creationDate: "D:20231120153000+01'00'",
  pageText: `PLATANOS DEL NORTE S.L. - EXPEDIENTE CLASIFICADO NIVEL 3
ACCESO EXCLUSIVO: DIRECCION GENERAL Y RESPONSABLE DE SISTEMAS
Ubicacion: Servidor Seguro Interno Candina (Santander)

1. ACUERDOS PRIVADOS DE DISTRIBUCION (MARGENES Y PRECIOS 2024):
- Mercadona Zona Norte: Suministro de 450 Tn/mes a 0.88 EUR/kg.
- Eroski / Caprabo: Suministro de 320 Tn/mes a 0.92 EUR/kg.
- Cuenta bancaria operativa de liquidacion (Banco Santander):
  ES76 0049 1500 21 2810492817 (Beneficiario: Platanos del Norte S.L.)

2. LLAVE CRIPTOGRAFICA DE PASARELA VPN INTERNA:
- Token de autenticacion perimetral: vpn-secret-key-platanos-991
- Acceso SSH a consola SCADA: ssh operator@10.0.4.12 -p 2202

FIN DEL EXPEDIENTE CLASIFICADO - FLAG-07-CONFIDENTIAL-EXFIL`
});
fs.writeFileSync(path.join(internalDocsDir, 'informe_restringido_aduanas_precios_2024.pdf'), pdfRestringido);

console.log('Real files generated successfully!');
