import React, { useState } from 'react';
import { 
  FileSearch, 
  MapPin, 
  User, 
  HardDrive, 
  Cpu, 
  Calendar, 
  ShieldAlert, 
  Copy, 
  Check, 
  PlusCircle, 
  AlertTriangle,
  Info,
  Terminal,
  Download
} from 'lucide-react';
import { TARGET_FILES } from '../../data/targetCompany';
import { TargetFileItem } from '../../types/osint';

interface ModuleMetadataForensicsProps {
  selectedFile: TargetFileItem | null;
  onSelectFile: (file: TargetFileItem) => void;
  onAddFindingToReport: (title: string, dork: string, details: string) => void;
}

export const ModuleMetadataForensics: React.FC<ModuleMetadataForensicsProps> = ({
  selectedFile,
  onSelectFile,
  onAddFindingToReport,
}) => {
  const currentFile = selectedFile || TARGET_FILES[0];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>Módulo 2</span>
              <span aria-hidden="true">·</span>
              <span>Análisis Forense Básico de Metadatos</span>
              <span aria-hidden="true">·</span>
              <span>EXIF / XMP / PDF Dictionaries</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Inspección de Metadatos y Huellas Digitales en Documentos
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Los archivos ofimáticos (PDF, DOCX, XLSX) conservan información forense oculta que los usuarios no ven en la pantalla: nombres de usuarios locales, rutas de disco, software de edición, direcciones IP de servidores de red interna e incluso coordenadas GPS.
            </p>
          </div>

          <button
            onClick={() => {
              onAddFindingToReport(
                `Metadatos forenses en ${currentFile.name}`,
                `site:platanosdelnorte.es filetype:pdf "${currentFile.metadata.author}"`,
                `Autor extraído: ${currentFile.metadata.author}\nSoftware: ${currentFile.metadata.creatorTool}\nFugas: ${currentFile.metadata.leakedInfo.join(', ')}`
              );
              showToast('¡Hallazgo de metadatos añadido al Cuaderno!');
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Guardar Hallazgo en Informe</span>
          </button>
        </div>

        {/* File Selector Tabs */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-slate-500 shrink-0">Fichero a analizar:</span>
          {TARGET_FILES.map((file) => (
            <button
              key={file.id}
              onClick={() => onSelectFile(file)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors shrink-0 flex items-center gap-1.5 ${
                currentFile.id === file.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{file.name}</span>
              {file.isConfidential && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Extracted Metadata & Security Impact */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Forensic Evidence Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono text-slate-500">{currentFile.path}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{currentFile.metadata.title}</h3>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
                {currentFile.size}
              </span>
            </div>

            {/* Core Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Autor Identificado</span>
                </div>
                <p className="font-bold text-slate-900 text-sm">{currentFile.metadata.author}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Vector de Spear Phishing / Correlación OSINT</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1">
                  <Cpu className="w-3.5 h-3.5 text-blue-600" />
                  <span>Software Creador</span>
                </div>
                <p className="font-bold text-slate-900 text-sm font-mono truncate">{currentFile.metadata.creatorTool}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Versión de software con posibles CVEs</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Fecha de Creación / Modificación</span>
                </div>
                <p className="font-medium text-slate-900 font-mono text-xs">{currentFile.metadata.creationDate}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Modificado: {currentFile.metadata.modifyDate}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1">
                  <HardDrive className="w-3.5 h-3.5 text-purple-600" />
                  <span>Entorno / IP Interna Revelada</span>
                </div>
                <p className="font-mono text-xs font-bold text-slate-900 truncate">
                  {currentFile.metadata.internalIp || currentFile.metadata.operatingSystem || 'No especificada'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Mapeo pasivo de red privada</p>
              </div>
            </div>

            {/* GPS Coordinates Visualization (if present) */}
            {currentFile.metadata.gpsCoordinates && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-emerald-950 text-sm">Geolocalización Forense EXIF Detectada</h4>
                    <p className="text-emerald-900 mt-1 leading-relaxed">
                      El fichero contiene etiquetas GPS originales tomadas en el momento de la edición en las naves de maduración:
                    </p>
                    <div className="mt-2 p-2.5 bg-white border border-emerald-200 rounded-lg font-mono text-xs text-slate-800 flex items-center justify-between">
                      <span>
                        Lat: {currentFile.metadata.gpsCoordinates.lat}° N · Long: {currentFile.metadata.gpsCoordinates.lng}° W
                        <span className="block font-sans text-slate-500 text-[11px] mt-0.5">
                          {currentFile.metadata.gpsCoordinates.locationName}
                        </span>
                      </span>
                      <a
                        href={`https://www.google.com/maps?q=${currentFile.metadata.gpsCoordinates.lat},${currentFile.metadata.gpsCoordinates.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded text-xs font-semibold font-sans transition-colors shrink-0"
                      >
                        Ver en Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Leaked Information List */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Fugas de Seguridad Descubiertas en este Archivo</span>
              </h4>
              <ul className="space-y-2">
                {currentFile.metadata.leakedInfo.map((leak, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-xs text-rose-900 flex items-start gap-2">
                    <span className="font-mono font-bold text-rose-600 shrink-0">#{idx + 1}</span>
                    <span className="leading-relaxed">{leak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Raw EXIF / XMP Dictionary Dump */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-slate-100 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 font-sans">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-xs">Salida de Comando Forense (exiftool -a -u -g1 {currentFile.name})</span>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(currentFile.metadata.rawExif, null, 2), 'raw-exif')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 transition-colors"
              >
                {copiedKey === 'raw-exif' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'raw-exif' ? 'Copiado' : 'Copiar salida'}</span>
              </button>
            </div>

            <div className="space-y-1.5 overflow-x-auto text-[11px] leading-relaxed">
              {Object.entries(currentFile.metadata.rawExif).map(([k, v]) => (
                <div key={k} className="flex gap-4">
                  <span className="text-slate-400 shrink-0 w-44">{k}</span>
                  <span className="text-emerald-300">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Educational & Defensive Remediation Guide */}
        <div className="space-y-6">
          {/* Tooling Guide */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-emerald-600" />
              <span>Herramientas Forenses Reales</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-800 font-mono">exiftool</p>
                <p className="mt-0.5">La herramienta de referencia en línea de comandos para leer, escribir y modificar metadatos.</p>
                <code className="block mt-1.5 p-1.5 bg-slate-900 text-emerald-400 rounded text-[11px] font-mono">
                  exiftool archivo.pdf
                </code>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-800 font-mono">FOCA (Fingerprinting Organizations)</p>
                <p className="mt-0.5">Herramienta clásica española de ciberseguridad para descargar documentos de un dominio y extraer redes, servidores e identidades automáticamente.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-800 font-mono">pdfinfo / pdftotext</p>
                <p className="mt-0.5">Utilidades del paquete Poppler en Linux para inspeccionar el diccionario PDF.</p>
              </div>
            </div>
          </div>

          {/* Remediation / Hardening Card */}
          <div className="bg-emerald-950 text-white rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Medidas Defensivas (Remediación)</span>
            </h3>

            <p className="text-xs text-emerald-100 leading-relaxed">
              Para evitar que adversarios utilicen Google Dorks para perfilar la red de la empresa, se debe aplicar <strong>sanitización de metadatos</strong> previa a la publicación:
            </p>

            <div className="p-3 bg-slate-900 rounded-lg border border-emerald-800 font-mono text-[11px] space-y-2">
              <span className="text-slate-400"># Eliminar todos los metadatos con ExifTool:</span>
              <p className="text-emerald-400">exiftool -all= documento.pdf</p>
              <span className="text-slate-400 block pt-1"># Usar Mat2 (Metadata Anonymisation Toolkit):</span>
              <p className="text-emerald-400">mat2 documento.pdf</p>
            </div>

            <p className="text-[11px] text-emerald-300">
              ✓ Incluir un paso automatizado en el pipeline de CI/CD o CMS para limpiar archivos antes de que se alojen en servidores públicos.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
