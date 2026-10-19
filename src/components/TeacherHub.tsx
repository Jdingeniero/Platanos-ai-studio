import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Copy, 
  ExternalLink, 
  Check, 
  HelpCircle, 
  BookOpen, 
  FileCode, 
  Globe, 
  Search,
  Award,
  Layers,
  Terminal
} from 'lucide-react';
import { EXPECTED_FINDINGS, GRADING_RUBRIC_CRITERIA, GITHUB_PAGES_DEPLOYMENT_GUIDE } from '../data/expectedFindings';
import { ROBOTS_TXT_CONTENT, SITEMAP_XML_CONTENT, TARGET_DOMAIN } from '../data/targetCompany';

export const TeacherHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'findings' | 'rubric' | 'github-deploy'>('findings');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadStaticPack = () => {
    const staticIndexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Plátanos del Norte S.L. - Distribución y Maduración de Plátano en Cantabria</title>
  <meta name="description" content="Empresa líder en maduración y distribución de plátano con DOP en Santander y cornisa cantábrica.">
  <meta name="robots" content="index, follow">
</head>
<body style="font-family: sans-serif; padding: 40px; line-height: 1.6; max-width: 900px; margin: auto;">
  <h1>Plátanos del Norte S.L.</h1>
  <p>Polígono Candina, Nave 14, 39011 Santander (Cantabria)</p>
  <hr>
  <h2>Nuestras Instalaciones</h2>
  <p>Operamos 8 cámaras de maduración con atmósfera controlada de etileno.</p>
  <h2>Equipo Directivo</h2>
  <ul>
    <li>Marta Revilla (Directora General)</li>
    <li>Rodrigo Arango (Director Financiero)</li>
    <li>Carlos Mendizábal (Responsable de Sistemas IT y Logística)</li>
    <li>Elena Soto (Control de Calidad)</li>
  </ul>
  <h2>Documentación Pública</h2>
  <p><a href="catalogo_comercial_2024.pdf">Descargar Catálogo Comercial 2024 (PDF)</a></p>
  <hr>
  <p><small>&copy; 2024 Plátanos del Norte S.L. - Todos los derechos reservados.</small></p>
</body>
</html>`;

    const blob = new Blob([staticIndexHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>Módulo del Profesor</span>
              <span aria-hidden="true">·</span>
              <span>Solucionario & Criterios de Evaluación</span>
              <span aria-hidden="true">·</span>
              <span>Despliegue GitHub Pages</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Panel del Docente: Solucionario y Rúbrica de Corrección
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Herramienta para el profesorado: consulta la lista de hallazgos esperados (clave de corrección), la rúbrica oficial de 100 puntos y las instrucciones para desplegar la empresa ficticia en GitHub Pages y darla de alta en Google Search Console para toda la clase.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('findings')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'findings' ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Lista de Hallazgos ({EXPECTED_FINDINGS.length})
            </button>
            <button
              onClick={() => setActiveTab('rubric')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'rubric' ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Rúbrica de Calificación (100 pts)
            </button>
            <button
              onClick={() => setActiveTab('github-deploy')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'github-deploy' ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Despliegue GitHub Pages</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Expected Findings Table (Solucionario) */}
      {activeTab === 'findings' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Solucionario Maestro: 8 Hallazgos Esperados en la Empresa Ficticia
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Utiliza esta tabla para contrastar los Google Dorks y las evidencias aportadas por los alumnos en la Sección 3 de su entrega.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
              Puntuación Máxima: 100 Puntos
            </span>
          </div>

          <div className="space-y-4">
            {EXPECTED_FINDINGS.map((finding) => (
              <div
                key={finding.id}
                className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors bg-white space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                      {finding.code}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{finding.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      finding.severity === 'Crítica' ? 'bg-rose-100 text-rose-800' :
                      finding.severity === 'Alta' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      Severidad: {finding.severity}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                      +{finding.points} pts
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block">Google Dork Recomendado / Esperado:</span>
                    <code className="text-emerald-800 font-bold font-mono text-[11px] block mt-1 bg-emerald-50/50 p-1.5 rounded border border-emerald-200">
                      {finding.recommendedDork}
                    </code>
                    <span className="text-slate-500 font-semibold block mt-2">Ubicación / Fichero:</span>
                    <p className="font-mono text-slate-700 text-[11px] mt-0.5">{finding.whereFound}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block">Evidencia Técnica Descubierta:</span>
                    <p className="text-slate-700 mt-1 leading-relaxed">{finding.evidence}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-2.5 bg-rose-50/60 rounded-lg text-rose-950">
                    <span className="font-bold text-rose-900 block">Riesgo en Ciberseguridad:</span>
                    <p className="mt-0.5 leading-relaxed">{finding.cyberRisk}</p>
                  </div>
                  <div className="p-2.5 bg-emerald-50/60 rounded-lg text-emerald-950">
                    <span className="font-bold text-emerald-900 block">Medida Defensiva / Bastionado:</span>
                    <p className="mt-0.5 leading-relaxed">{finding.defensiveFix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Grading Rubric */}
      {activeTab === 'rubric' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Rúbrica de Evaluación Académica (Conforme al PDF)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Criterios de corrección oficiales establecidos en la sección "Evaluación" de las instrucciones de la actividad.
            </p>
          </div>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
            {GRADING_RUBRIC_CRITERIA.map((criterion, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{criterion.section}</span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Ponderación: {criterion.weight}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{criterion.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-base font-bold text-slate-900">{criterion.maxPoints} pts</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900">Consejos Pedagógicos para el Docente:</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Verificar que el alumno no se limite a enumerar operadores genéricos, sino que demuestre comprensión de por qué <code>filetype:pdf</code> o <code>intitle:"index of"</code> son efectivos para OSINT.</li>
              <li>Exigir que los 5 hallazgos contengan la captura de pantalla o texto del dork y no una simple URL.</li>
              <li>Evaluar con rigor la sección de reflexión ética: el alumno debe citar las implicaciones legales (RGPD en la Unión Europea y Código Penal para accesos no autorizados).</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: GitHub Pages Deployment Guide */}
      {activeTab === 'github-deploy' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Cómo Desplegar "Plátanos del Norte" en GitHub Pages y Google Search Console
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Guía paso a paso para que todos los alumnos practiquen con Google real sobre el mismo repositorio indexado.
              </p>
            </div>
            <button
              onClick={handleDownloadStaticPack}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar index.html estático</span>
            </button>
          </div>

          {/* Steps Accordion */}
          <div className="space-y-4">
            {GITHUB_PAGES_DEPLOYMENT_GUIDE.steps.map((st) => (
              <div key={st.step} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {st.step}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{st.title}</h3>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed pl-9 whitespace-pre-line">
                  {st.detail}
                </p>

                {st.codeSnippet && (
                  <div className="pl-9 pt-1">
                    <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto">
                      {st.codeSnippet}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Copy Files Container */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Archivos Listos para Copiar y Pegar en tu Repositorio de GitHub Pages:
            </h3>

            {/* robots.txt Copy Box */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs text-slate-800">robots.txt</span>
                <button
                  onClick={() => handleCopy(ROBOTS_TXT_CONTENT, 'robots-copy')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs flex items-center gap-1"
                >
                  {copiedKey === 'robots-copy' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'robots-copy' ? 'Copiado' : 'Copiar contenido'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 text-slate-300 font-mono text-[11px] rounded-lg overflow-x-auto max-h-40">
                {ROBOTS_TXT_CONTENT}
              </pre>
            </div>

            {/* sitemap.xml Copy Box */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs text-slate-800">sitemap.xml</span>
                <button
                  onClick={() => handleCopy(SITEMAP_XML_CONTENT, 'sitemap-copy')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs flex items-center gap-1"
                >
                  {copiedKey === 'sitemap-copy' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'sitemap-copy' ? 'Copiado' : 'Copiar contenido'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 text-slate-300 font-mono text-[11px] rounded-lg overflow-x-auto max-h-40">
                {SITEMAP_XML_CONTENT}
              </pre>
            </div>

            {/* Exiftool Command Generator */}
            <div className="p-4 bg-emerald-950 text-emerald-100 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Cómo sembrar metadatos reales en un PDF de muestra (Comando ExifTool):</span>
              </h4>
              <p className="leading-relaxed">
                Ejecuta este comando en tu terminal para inyectar los metadatos de Carlos Mendizábal y las coordenadas GPS en cualquier PDF antes de subirlo a tu GitHub Pages:
              </p>
              <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto">
{`exiftool -Author="Carlos Mendizábal" \\
  -Creator="Microsoft Word 2016" \\
  -Title="Auditoría Interna de Infraestructura - Candina v1.3" \\
  -Keywords="candina; santander; synology; vlan10; snmp:public_platanos" \\
  -GPSLatitude="43.4568" -GPSLatitudeRef="N" \\
  -GPSLongitude="3.8321" -GPSLongitudeRef="W" \\
  auditoria_interna_seguridad_2023.pdf`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
