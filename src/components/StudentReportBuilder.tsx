import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  Printer, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { StudentReportData, StudentFindingEntry } from '../types/osint';
import { GOOGLE_OPERATORS } from '../data/dorksDatabase';
import { TARGET_DOMAIN } from '../data/targetCompany';

interface StudentReportBuilderProps {
  initialFindings?: StudentFindingEntry[];
  onAddFinding?: (finding: StudentFindingEntry) => void;
}

const STORAGE_KEY = 'osint_student_report_v1';

export const StudentReportBuilder: React.FC<StudentReportBuilderProps> = ({
  initialFindings = [],
}) => {
  const [report, setReport] = useState<StudentReportData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved report', e);
      }
    }
    return {
      studentName: 'Alumno/a de Ciberseguridad',
      studentGroup: 'Módulo de Seguridad Ofensiva & OSINT',
      date: new Date().toISOString().split('T')[0],
      section1Intro: 'Google Hacking (o Google Dorks) es la técnica de utilizar operadores de búsqueda avanzados y sintaxis especializada en motores de búsqueda para localizar información, configuraciones y ficheros expuestos de forma involuntaria en servidores web públicos.\n\nSe clasifica estrictamente como recopilación pasiva de información porque el analista o auditor no envía ningún paquete ni petición HTTP directa a los servidores de la empresa objetivo (Plátanos del Norte S.L.). Todas las consultas se dirigen a la base de datos de índices ya rastreados por los servidores de Google, garantizando que el reconocimiento no sea detectable en los logs o firewalls perimetrales de la víctima.',
      section2Operators: GOOGLE_OPERATORS.slice(0, 10).map(op => ({
        operator: op.operator,
        explanation: op.description,
        practicalExample: op.practicalExample
      })),
      section3Findings: [
        {
          id: 'f-1',
          dorkUsed: `site:${TARGET_DOMAIN} inurl:robots.txt`,
          searchObjective: 'Identificar rutas restringidas y comentarios ocultos dejados por el administrador en la configuración de rastreo.',
          obtainedResults: 'El archivo robots.txt prohíbe el rastreo de /admin-panel/, /internal-docs/ y /backup-2023/, e incluye una nota interna firmada por c.mendizabal recordando la ejecución de backups.',
          cyberSecurityRelevance: 'Permite mapear la arquitectura interna sin escanear. Los atacantes aprovechan estas rutas como objetivos prioritarios para comprobar si los directorios carecen de autenticación.',
          timestamp: '2024-01-20 10:15'
        },
        {
          id: 'f-2',
          dorkUsed: `site:${TARGET_DOMAIN} intitle:"index of"`,
          searchObjective: 'Detectar carpetas web con listado automático de ficheros (Directory Browsing) activo.',
          obtainedResults: 'Acceso completo al directorio /internal-docs/ que contiene documentos de auditoría, manuales SCADA y perfiles VPN.',
          cyberSecurityRelevance: 'Fuga crítica de información (CWE-548). Permite descargar documentos ofimáticos confidenciales sin requerir credenciales.',
          timestamp: '2024-01-20 10:30'
        },
        {
          id: 'f-3',
          dorkUsed: `site:${TARGET_DOMAIN} filetype:pdf "Carlos Mendizábal"`,
          searchObjective: 'Localizar documentos ofimáticos PDF que contengan metadatos forenses del personal de sistemas.',
          obtainedResults: 'Fichero auditoria_interna_seguridad_2023.pdf con autor "Carlos Mendizábal", software Word 2016 en macOS, IP del NAS 192.168.10.45 y clave SNMP public_platanos. Coordenadas GPS en Santander.',
          cyberSecurityRelevance: 'Facilita ataques de spear phishing altamente creíbles, descubrimiento de subredes internas (192.168.10.0/24) y explotación de servicios SNMP débiles.',
          timestamp: '2024-01-20 10:45'
        },
        {
          id: 'f-4',
          dorkUsed: `site:${TARGET_DOMAIN} (ext:sql OR ext:gz) inurl:backup`,
          searchObjective: 'Localizar copias de seguridad de bases de datos expuestas en el servidor web.',
          obtainedResults: 'Descubierto db_backup_preprod_20231102.sql.gz (14.2 MB) con el esquema completo de MySQL y hashes de contraseñas de administradores y clientes.',
          cyberSecurityRelevance: 'Compromiso grave de confidencialidad y RGPD. Posibilidad de crackear hashes de contraseña offline mediante fuerza bruta o tablas rainbow.',
          timestamp: '2024-01-20 11:05'
        },
        {
          id: 'f-5',
          dorkUsed: `site:github.com "platanosdelnorte"`,
          searchObjective: 'Investigar repositorios públicos en GitHub vinculados a los empleados de la organización.',
          obtainedResults: 'Repositorio público cmendi-dev/platanos-api-scripts con archivo backup_sync.sh que contiene contraseñas de MySQL en texto plano y webhooks de Slack.',
          cyberSecurityRelevance: 'Vector de acceso inmediato a la base de datos de desarrollo y posibilidad de pivotar hacia otros entornos internos a través de credenciales reutilizadas.',
          timestamp: '2024-01-20 11:20'
        }
      ],
      section4Ethics: {
        whenAppropriate: 'El uso de Google Hacking es apropiado exclusivamente en auditorías de seguridad autorizadas (auditorías defensivas internas o con acuerdo de encargo previo), en investigaciones académicas sobre dominios de laboratorio autorizados, o en labores defensivas de verificación de la propia organización para detectar y mitigar fugas antes que los ciberdelincuentes.',
        associatedRisks: 'El mal uso puede violar normativas de protección de datos (RGPD / LOPDGDD en España) si se descargan o difunden datos personales sin consentimiento. Además, utilizar la información recopilada para acceder sin autorización a sistemas informáticos constituye un delito tipificado en el Código Penal español (artículo 197 bis).',
        distinguishLegitimateVsAbuse: 'La línea divisoria reside en el consentimiento y la finalidad: un uso legítimo (auditoría ética) se realiza con alcance definido, reporta de manera confidencial y responsable al propietario (divulgación coordinada de vulnerabilidades) y nunca descarga ni explota datos privados para beneficio propio. Un uso indebido busca explotar brechas, alterar información o extorsionar a la víctima.'
      },
      section5Conclusions: {
        learnedReflections: 'La recopilación pasiva mediante Google Hacking demuestra que la mayor parte de las brechas de datos se originan por descuidos humanos y malas configuraciones de servidores más que por vulnerabilidades de día cero complejas. Un atacante puede reconstruir el organigrama, subredes internas, versiones de software y credenciales sin levantar sospechas en los sistemas de monitorización.',
        hardeningRecommendations: '1. Sanitización obligatoria de metadatos ofimáticos (con exiftool -all= o mat2) en el pipeline de publicación.\n2. Desactivar Directory Browsing en servidores web (Options -Indexes en Apache, autoindex off en Nginx).\n3. Nunca utilizar robots.txt para "ocultar" contenido; proteger las rutas con autenticación HTTP y usar cabeceras "X-Robots-Tag: noindex".\n4. Implementar escaneo automático de secretos en repositorios de código (TruffleHog, Gitleaks, GitHub Secret Scanning).\n5. Prohibir el almacenamiento de copias de seguridad (.sql, .zip) en el DocumentRoot de servidores públicos.'
      },
      section6PresentationNotes: '1. Introducción (1 min): Contexto de Plátanos del Norte S.L. y concepto de reconocimiento pasivo.\n2. Metodología y Operadores (1 min): Explicación de los 10 operadores más efectivos (site, filetype, intitle, inurl).\n3. Hallazgos Críticos (2 min): Exposición de los 5 hallazgos (robots.txt, /internal-docs/, metadatos PDF, backup SQL y fuga en GitHub cmendi-dev).\n4. Conclusiones y Defensa (1 min): Recomendaciones inmediatas de bastionado (Options -Indexes, sanitización de metadatos y escaneo de secretos).'
    };
  });

  const [activeSection, setActiveSection] = useState<number>(3);
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);
  const [saveIndicator, setSaveIndicator] = useState<boolean>(false);

  // Autosave to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
    setSaveIndicator(true);
    const timer = setTimeout(() => setSaveIndicator(false), 1500);
    return () => clearTimeout(timer);
  }, [report]);

  const handleCopyMarkdown = () => {
    const md = generateMarkdownDocument(report);
    navigator.clipboard.writeText(md);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownDocument(report);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe_google_dorks_${report.studentName.replace(/\s+/g, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddFinding = () => {
    const newEntry: StudentFindingEntry = {
      id: `find-${Date.now()}`,
      dorkUsed: `site:${TARGET_DOMAIN} `,
      searchObjective: 'Describir el objetivo de esta búsqueda...',
      obtainedResults: 'Detallar los enlaces, ficheros o información obtenida...',
      cyberSecurityRelevance: 'Explicar por qué este resultado representa un riesgo de seguridad...',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setReport(prev => ({
      ...prev,
      section3Findings: [...prev.section3Findings, newEntry]
    }));
  };

  const handleDeleteFinding = (id: string) => {
    setReport(prev => ({
      ...prev,
      section3Findings: prev.section3Findings.filter(f => f.id !== id)
    }));
  };

  const handleUpdateFinding = (id: string, field: keyof StudentFindingEntry, val: string) => {
    setReport(prev => ({
      ...prev,
      section3Findings: prev.section3Findings.map(f => {
        if (f.id === id) {
          return { ...f, [field]: val };
        }
        return f;
      })
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>Entrega del Alumno</span>
              <span aria-hidden="true">·</span>
              <span>Conforme al PDF de la Actividad</span>
              <span aria-hidden="true">·</span>
              {saveIndicator && <span className="text-emerald-600 font-bold">Guardado automático</span>}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Cuaderno de Trabajo: Recopilación Pasiva con Google Dorks
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Completa cada sección según los requerimientos del documento de la actividad: definición pasiva, tabla de operadores, registro de al menos 5 hallazgos, reflexión ética, conclusiones de bastionado y notas de presentación.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copiedStatus ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copiedStatus ? 'Copiado al Portapapeles' : 'Copiar Markdown'}</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .MD</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Exportar PDF</span>
            </button>
          </div>
        </div>

        {/* Student Metadata Inputs */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nombre del Estudiante:</label>
            <input
              type="text"
              value={report.studentName}
              onChange={(e) => setReport({ ...report, studentName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Grupo / Curso:</label>
            <input
              type="text"
              value={report.studentGroup}
              onChange={(e) => setReport({ ...report, studentGroup: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Fecha de la Práctica:</label>
            <input
              type="date"
              value={report.date}
              onChange={(e) => setReport({ ...report, date: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveSection(1)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 1 ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            1. Introducción
          </button>
          <button
            onClick={() => setActiveSection(2)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 2 ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            2. Operadores (10)
          </button>
          <button
            onClick={() => setActiveSection(3)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeSection === 3 ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>3. Hallazgos</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] ${
              report.section3Findings.length >= 5 ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-950 font-bold'
            }`}>
              {report.section3Findings.length}/5
            </span>
          </button>
          <button
            onClick={() => setActiveSection(4)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 4 ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            4. Reflexión Ética
          </button>
          <button
            onClick={() => setActiveSection(5)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 5 ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            5. Conclusiones
          </button>
          <button
            onClick={() => setActiveSection(6)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 6 ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            6. Presentación (5 min)
          </button>
        </div>
      </div>

      {/* Printable Report View (Visible when printing, or edited below) */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-8">
        {/* Printable Header */}
        <div className="border-b border-slate-300 pb-5">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold font-mono">
                Actividad Académica de Ciberseguridad
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Recopilación Pasiva de Información con Google Hacking (Google Dorks)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Objetivo de evaluación: Dominio de operadores avanzados, análisis forense de metadatos y concienciación ética en auditoría defensiva.
              </p>
            </div>
            <div className="text-right text-xs text-slate-600 font-mono">
              <p className="font-bold text-slate-900">{report.studentName}</p>
              <p>{report.studentGroup}</p>
              <p>{report.date}</p>
            </div>
          </div>
        </div>

        {/* Section 1: Intro */}
        {(activeSection === 1 || activeSection === 0) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-base">
                1. Introducción a Google Hacking y Recopilación Pasiva
              </h3>
              <span className="text-xs text-slate-500 no-print">Requisito del PDF (Página 1)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed no-print">
              Define qué es Google Hacking o Google Dorks, explica cómo los operadores avanzados se usan para encontrar información específica en sitios web y por qué se considera una forma de recopilación pasiva:
            </p>
            <textarea
              rows={6}
              value={report.section1Intro}
              onChange={(e) => setReport({ ...report, section1Intro: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 leading-relaxed focus:bg-white focus:ring-2 focus:ring-emerald-500 font-sans"
            />
          </div>
        )}

        {/* Section 2: 10 Operators */}
        {(activeSection === 2 || activeSection === 0) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-base">
                2. Exploración de Operadores de Búsqueda Avanzada (Mínimo 10)
              </h3>
              <span className="text-xs text-slate-500 no-print">Requisito del PDF (Página 1)</span>
            </div>

            <p className="text-xs text-slate-600 no-print">
              Tabla requerida con los 10 operadores, su función y casos prácticos en ciberseguridad:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="p-2.5 font-semibold w-28">Operador</th>
                    <th className="p-2.5 font-semibold">Explicación de Uso</th>
                    <th className="p-2.5 font-semibold">Ejemplo Práctico en Seguridad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {report.section2Operators.map((op, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-emerald-800 align-top">
                        {op.operator}
                      </td>
                      <td className="p-2.5 text-slate-700 align-top leading-relaxed">
                        {op.explanation}
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-slate-800 bg-slate-50/50 align-top">
                        {op.practicalExample}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 3: 5 Findings Log */}
        {(activeSection === 3 || activeSection === 0) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  3. Práctica de Búsquedas con Google Dorks (Mínimo 5 Búsquedas Reales)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cada entrada debe detallar: el dork utilizado, información buscada, resultados obtenidos y relevancia en ciberseguridad.
                </p>
              </div>
              <button
                onClick={handleAddFinding}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 no-print"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Búsqueda</span>
              </button>
            </div>

            {report.section3Findings.length < 5 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-2 no-print">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Atención: El enunciado de la práctica exige documentar <strong>al menos 5 búsquedas reales</strong>. Actualmente tienes registradas {report.section3Findings.length}.
                </span>
              </div>
            )}

            <div className="space-y-6">
              {report.section3Findings.map((finding, idx) => (
                <div key={finding.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 text-xs">
                      Búsqueda #{idx + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 font-mono">{finding.timestamp}</span>
                      <button
                        onClick={() => handleDeleteFinding(finding.id)}
                        className="text-slate-400 hover:text-rose-600 no-print"
                        title="Eliminar esta entrada"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        • Google Dork utilizado:
                      </label>
                      <input
                        type="text"
                        value={finding.dorkUsed}
                        onChange={(e) => handleUpdateFinding(finding.id, 'dorkUsed', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded font-mono text-xs text-emerald-800 font-semibold focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        • Descripción del tipo de información buscada:
                      </label>
                      <input
                        type="text"
                        value={finding.searchObjective}
                        onChange={(e) => handleUpdateFinding(finding.id, 'searchObjective', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <label className="font-semibold text-slate-700 block">
                      • Resultados obtenidos:
                    </label>
                    <textarea
                      rows={2}
                      value={finding.obtainedResults}
                      onChange={(e) => handleUpdateFinding(finding.id, 'obtainedResults', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded text-xs text-slate-800 leading-relaxed focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="text-xs space-y-1">
                    <label className="font-semibold text-slate-700 block">
                      • Relevancia en un ejercicio de ciberseguridad / Impacto y Riesgo:
                    </label>
                    <textarea
                      rows={2}
                      value={finding.cyberSecurityRelevance}
                      onChange={(e) => handleUpdateFinding(finding.id, 'cyberSecurityRelevance', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded text-xs text-slate-800 leading-relaxed focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Ethical Reflection */}
        {(activeSection === 4 || activeSection === 0) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-base">
                4. Reflexión Ética sobre el Uso de Google Hacking
              </h3>
              <span className="text-xs text-slate-500 no-print">Requisito del PDF (Página 2)</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  1. ¿Cuándo es apropiado utilizar Google Hacking?
                </label>
                <textarea
                  rows={3}
                  value={report.section4Ethics.whenAppropriate}
                  onChange={(e) => setReport({
                    ...report,
                    section4Ethics: { ...report.section4Ethics, whenAppropriate: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 leading-relaxed focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  2. ¿Cuáles son los riesgos asociados con el mal uso de esta técnica?
                </label>
                <textarea
                  rows={3}
                  value={report.section4Ethics.associatedRisks}
                  onChange={(e) => setReport({
                    ...report,
                    section4Ethics: { ...report.section4Ethics, associatedRisks: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 leading-relaxed focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  3. ¿Cómo se puede distinguir entre un uso legítimo y un uso indebido de Google Dorks?
                </label>
                <textarea
                  rows={3}
                  value={report.section4Ethics.distinguishLegitimateVsAbuse}
                  onChange={(e) => setReport({
                    ...report,
                    section4Ethics: { ...report.section4Ethics, distinguishLegitimateVsAbuse: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 leading-relaxed focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Conclusions & Hardening */}
        {(activeSection === 5 || activeSection === 0) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-base">
                5. Conclusión y Recomendaciones de Bastionado Defensivo
              </h3>
              <span className="text-xs text-slate-500 no-print">Requisito del PDF (Página 2)</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  • Reflexión sobre lo aprendido acerca de recopilación pasiva y Google Hacking:
                </label>
                <textarea
                  rows={3}
                  value={report.section5Conclusions.learnedReflections}
                  onChange={(e) => setReport({
                    ...report,
                    section5Conclusions: { ...report.section5Conclusions, learnedReflections: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 leading-relaxed focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  • Recomendaciones sobre buenas prácticas para proteger la información sensible expuesta en línea:
                </label>
                <textarea
                  rows={4}
                  value={report.section5Conclusions.hardeningRecommendations}
                  onChange={(e) => setReport({
                    ...report,
                    section5Conclusions: { ...report.section5Conclusions, hardeningRecommendations: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 leading-relaxed focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 6: 5-minute Presentation Notes */}
        {(activeSection === 6 || activeSection === 0) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-base">
                6. Guion de Presentación Oral (5 Minutos)
              </h3>
              <span className="text-xs text-slate-500 no-print">Requisito del PDF (Página 2)</span>
            </div>
            <p className="text-xs text-slate-600 no-print">
              Estructura tu exposición oral de 5 minutos resumiendo técnicas de búsqueda utilizadas y hallazgos clave:
            </p>
            <textarea
              rows={4}
              value={report.section6PresentationNotes}
              onChange={(e) => setReport({ ...report, section6PresentationNotes: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 leading-relaxed focus:bg-white focus:ring-1 focus:ring-emerald-500 font-sans"
            />
          </div>
        )}

        {/* Footer Signature Box for Evaluation */}
        <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
          <div>
            <p>Documento generado para la actividad académica de Google Hacking.</p>
            <p className="text-[11px] text-slate-400">Entorno auditado: {TARGET_DOMAIN} (Plátanos del Norte S.L.)</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-slate-700">Calificación del Docente: _____ / 100 pts</p>
            <p className="text-[11px]">Firma / Validación:</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function generateMarkdownDocument(data: StudentReportData): string {
  return `# Actividad: Creación de un Documento sobre Recopilación Pasiva de Información con Google Hacking (Google Dorks)

**Alumno/a:** ${data.studentName}  
**Curso / Módulo:** ${data.studentGroup}  
**Fecha:** ${data.date}  
**Objetivo Evaluado:** Plátanos del Norte S.L. (\`${TARGET_DOMAIN}\`)  

---

## 1. Introducción a Google Hacking

${data.section1Intro}

---

## 2. Exploración de Operadores de Búsqueda Avanzada de Google

| Operador | Explicación de Uso | Ejemplo Práctico en Ciberseguridad |
| :--- | :--- | :--- |
${data.section2Operators.map(op => `| \`${op.operator}\` | ${op.explanation} | \`${op.practicalExample}\` |`).join('\n')}

---

## 3. Práctica de Búsquedas con Google Dorks

${data.section3Findings.map((f, i) => `### Búsqueda #${i + 1}
- **Google Dork utilizado:** \`${f.dorkUsed}\`
- **Descripción del tipo de información buscada:** ${f.searchObjective}
- **Resultados obtenidos:** ${f.obtainedResults}
- **Relevancia en un ejercicio de ciberseguridad:** ${f.cyberSecurityRelevance}
`).join('\n')}

---

## 4. Reflexión Ética sobre el Uso de Google Hacking

### 1. ¿Cuándo es apropiado utilizar Google Hacking?
${data.section4Ethics.whenAppropriate}

### 2. ¿Cuáles son los riesgos asociados con el mal uso de esta técnica?
${data.section4Ethics.associatedRisks}

### 3. ¿Cómo se puede distinguir entre un uso legítimo y un uso indebido de Google Dorks?
${data.section4Ethics.distinguishLegitimateVsAbuse}

---

## 5. Conclusión y Recomendaciones

### Reflexión sobre lo aprendido:
${data.section5Conclusions.learnedReflections}

### Recomendaciones sobre buenas prácticas de protección y bastionado:
${data.section5Conclusions.hardeningRecommendations}

---

## 6. Guion de Presentación Oral (5 Minutos)

${data.section6PresentationNotes}
`;
}
