# Práctica Docente: Recopilación Pasiva de Información con Google Dorks y OSINT

**Entorno Objetivo:** Plátanos del Norte S.L.  
**URL de la Web:** `https://ais-pre-jsfls7gnw5bve5lpt7ezh3-200329275950.europe-west2.run.app`  
**Modalidad:** Recopilación pasiva encadenada (OSINT y auditoría de configuraciones web).

---

## 1. Contexto de la Investigación

La empresa **Plátanos del Norte S.L.** es una distribuidora hortofrutícola con sede y naves de maduración en el Polígono Candina de Santander (Cantabria). Recientemente ha recibido avisos sobre posibles descuidos en la exposición de datos e infraestructura en internet.

Como auditores de seguridad, debéis realizar una auditoría de reconocimiento pasivo para descubrir toda la información sensible que un atacante podría encontrar utilizando **Google Dorks** y herramientas forenses básicas, sin alertar a los administradores del sistema.

---

## 2. La Cadena de Retos Progresivos (Chained Exploitation)

La investigación está diseñada de forma **encadenada**. Cada hallazgo os proporcionará las pistas y credenciales necesarias para desbloquear el siguiente nivel:

```
[Web Pública /] 
       │
       ▼
[robots.txt] ──► Revela rutas ocultas: /internal-docs/, /backup-2023/, /chat/logs/
       │
       ▼
[Directorio Abierto] ──► Descarga de control_acceso_proveedores_2023.xls / db_dump_preprod.sql
       │
       ▼
[Fuga de Credenciales] ──► Usuario: cmendizabal | Password: PlatanosCandina2023*!
       │
       ▼
[Portal Intranet /admin-panel] ──► INTRUSIÓN EXITOSA (Nivel 3 Desbloqueado)
       │
       ├─► [Telemetría SCADA] ──► Control de cámaras de etileno (10.0.4.12:102)
       ├─► [Tokens y SSH] ──► Bearer pltn_live_sec_... y clave VPN
       └─► [Expediente Nivel 3] ──► Descarga informe_restringido_aduanas_precios_2024.pdf
```

### Sistema de Registro de Retos y Verificación Forense (x/7)
A medida que vayáis completando cada fase, el sistema generará automáticamente un registro con su correspondiente **Flag de verificación**. 

Podéis pulsar el botón flotante en la esquina inferior derecha de la web:  
👉 **`[🛡 Retos OSINT: x/7]`**  
Allí encontraréis:
- **Contador global de progreso (`x/7`):** Número de retos conseguidos sobre el total.
- **Consejos dinámicos e interactivos:** Consejos progresivos guiados para descubrir cada reto y la técnica recomendada.
- **Historial de evidencias:** Registros con marcas de tiempo, flags verificadas y un botón para **copiar todo el informe forense** al portapapeles.

| Reto | Objetivo del Reto | Flag Esperada |
| :--- | :--- | :--- |
| **RETO-01** | Descubrimiento de directivas de rastreo en `robots.txt` | `FLAG-01-ROBOTS-REVEALED` |
| **RETO-02** | Explotación de Directorio Abierto en `/internal-docs/` | `FLAG-02-DIR-LISTING-EXPOSED` |
| **RETO-03** | Fuga de Respaldos o Chat en `/backup-2023/` o `/chat/logs/` | `FLAG-03-BACKUP-LOGS-LEAK` |
| **RETO-04** | Extracción de Credenciales en Archivo Interno (Excel / SQL / Log) | `FLAG-04-PASSWORD-IN-FILE` |
| **RETO-05** | Intrusión y Acceso a la Intranet (`/admin-panel`) con claves filtradas | `FLAG-05-INTRANET-UNLOCKED` |
| **RETO-06** | Manipulación de Parámetros SCADA de Maduración (Cámara 4) | `FLAG-06-SCADA-TAKEOVER` |
| **RETO-07** | Exfiltración de Expediente Confidencial Nivel 3 (`informe_restringido...pdf`) | `FLAG-07-CONFIDENTIAL-EXFIL` |

---

## 3. Tipos de Búsquedas y Ejemplos de Google Dorks a Utilizar

Durante la auditoría debéis aplicar y documentar operadores avanzados como los siguientes:

### A. Búsqueda de Términos Específicos dentro de un Dominio
- **Sintaxis:** `site:[dominio] [término]`
- **Ejemplo en el mundo real:** `site:www.canarias7.es galdar` (para encontrar todas las noticias relacionadas con la localidad productora canaria de Gáldar).
- **Aplicación en el objetivo:** Buscar menciones sobre cooperativas socias de Canarias en la web (`galdar`, `Candina`, `etileno`).

### B. Búsqueda de Archivos PDF Expuestos y Exclusiones
- **Sintaxis:** `filetype:pdf site:[dominio] [palabra clave]`
- **Ejemplo en el mundo real:**
  - `filetype:pdf site:samsung.com manual lavadora`
  - `filetype:pdf -site:samsung.com manual lavadora` (buscar manuales fuera del dominio oficial).
- **Aplicación en el objetivo:** Localizar documentos PDF internos publicados o indexados inadvertidamente:
  - `filetype:pdf auditoria`
  - `filetype:pdf camaras`
  - Descargar los PDFs encontrados (`auditoria_interna_seguridad_2023.pdf`, `especificaciones_camaras_maduracion_v2.pdf`) para inspeccionar sus **metadatos reales**.

### C. Directorios de Conversaciones y Logs Expuestos
- **Sintaxis:** `"index of" / "chat/logs"` o `"index of" "logs"`
- **Aplicación en el objetivo:** Comprobar si el servidor expone registros de chat de soporte entre administradores:
  - Ruta en el servidor: `/chat/logs/`
  - Descargar el archivo `conversacion_soporte_it_202311.log` y analizar los mensajes sobre contraseñas de intranet y reinicios del autómata industrial.

### D. Volcados de Bases de Datos SQL con Credenciales
- **Sintaxis:** `filetype:sql "MySQL dump" (pass|password|passwd|pwd)`
- **Aplicación en el objetivo:**
  - Localizar carpetas de backup (`/backup-2023/`).
  - Descargar el archivo `db_dump_preprod.sql` o `db_backup_preprod_20231102.sql.gz`.
  - Comprobar la presencia del encabezado `-- MySQL dump 10.19`, las tablas `usuarios_admin`, los hashes de contraseña y las contraseñas temporales en texto claro.

### E. Detección de URLs con Parámetros Numéricos
- **Sintaxis:** `inurl:actualidad?id=` o `inurl:id=`
- **Aplicación en el objetivo:** Identificar páginas dinámicas que reciben parámetros numéricos por GET:
  - Ruta: `/actualidad?id=1` y `/actualidad?id=2`.

### F. Hojas de Cálculo (Excel) con Contraseñas en Texto Plano
- **Sintaxis:** `filetype:xls "password"` o `ext:xlsx "contraseña"`
- **Aplicación en el objetivo:** Localizar en los directorios internos el archivo `control_acceso_proveedores_2023.xls`:
  - Abrir el archivo con Excel o LibreOffice Calc y extraer la fila con el usuario `cmendizabal` y su contraseña de Intranet `PlatanosCandina2023*!`.

### G. Fuga en Ficheros de Rastreadores Web (`robots.txt`)
- Consultar `/robots.txt` para comprobar qué rutas intentaba ocultar el administrador mediante `Disallow:`.
- Identificar notas internas firmadas por el responsable de sistemas (`c.mendizabal`).

---

## 4. Análisis Forense de Metadatos en los PDFs Descargados

Una vez descargados los archivos PDF reales de la web (`/internal-docs/auditoria_interna_seguridad_2023.pdf`), abrid una terminal en vuestro equipo y ejecutad la herramienta **ExifTool** (o `pdfinfo`):

```bash
# Ver todos los metadatos forenses del archivo PDF
exiftool auditoria_interna_seguridad_2023.pdf
```

Debéis documentar en vuestro informe:
1. **Autor:** ¿Qué nombre de usuario y correo electrónico aparece en la etiqueta `Author`?
2. **Software Creador:** ¿Con qué programa ofimático se elaboró el documento?
3. **Producer y Sistema Operativo:** ¿Qué motor PDF y versión de sistema se revela?
4. **Palabras Clave (Keywords):** ¿Qué direcciones IP privadas del NAS Synology, subredes internas (VLAN 10) y cadenas SNMP por defecto (`public_platanos`) están incrustadas?
5. **Coordenadas GPS:** ¿Qué latitud y longitud aparecen en los metadatos y a qué ubicación física de Santander corresponden?

---

## 5. Estructura Requerida para la Entrega del Trabajo

Cada alumno o grupo debe entregar un informe formal (PDF o Markdown) organizado en 6 apartados obligatorios:

1. **Introducción a Google Hacking:** Definición técnica y justificación de por qué es una técnica 100% pasiva.
2. **Catálogo de Operadores (Mínimo 10):** Explicación y ejemplo práctico en seguridad para `site:`, `filetype:`, `intitle:`, `inurl:`, `intext:`, `cache:`, `ext:`, `allinurl:`, booleanos (`OR`, `-`), comodín (`*`).
3. **Bitácora de Búsquedas (Mínimo 5 Hallazgos Detallados):**
   - Google Dork utilizado.
   - Objetivo de la búsqueda.
   - Resultado obtenido y archivo localizado.
   - Relevancia e impacto en ciberseguridad.
4. **Registro de Retos y Flags Conseguidas:**
   - Pegar el informe exportado desde la bitácora forense de la web como prueba de haber superado cada fase encadenada.
5. **Reflexión Ética y Legal:**
   - ¿Cuándo es legítimo usar Google Dorks?
   - ¿Cuáles son los riesgos legales (RGPD, LOPDGDD y Código Penal español art. 197 bis)?
   - ¿Cómo se diferencia una auditoría ética de un delito informático?
6. **Conclusiones y Recomendaciones de Bastionado:**
   - Desactivación de *Directory Browsing* (`Options -Indexes` en Apache, `autoindex off` en Nginx).
   - Sanitización de metadatos en PDFs con `exiftool -all=`.
   - Protección de copias de seguridad fuera del directorio público.
