import React, { useState } from 'react';
import { 
  Network, 
  Shield, 
  Server, 
  Globe, 
  PlusCircle, 
  Check, 
  Search, 
  Lock, 
  AlertTriangle 
} from 'lucide-react';
import { PASSIVE_INFRASTRUCTURE_DATA, TARGET_DOMAIN } from '../../data/targetCompany';

interface ModulePassiveDnsProps {
  onAddFindingToReport: (title: string, dork: string, details: string) => void;
}

export const ModulePassiveDns: React.FC<ModulePassiveDnsProps> = ({
  onAddFindingToReport,
}) => {
  const [activeTab, setActiveTab] = useState<'dns' | 'ct-logs' | 'whois'>('dns');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
              <span>Módulo 5</span>
              <span aria-hidden="true">·</span>
              <span>Reconocimiento Pasivo de Red</span>
              <span aria-hidden="true">·</span>
              <span>DNS, Registros SPF & Certificate Transparency</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Infraestructura, Subdominios y Registros Públicos
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              En una auditoría pasiva, nunca enviamos escaneos de puertos directos con Nmap al objetivo. En su lugar, consultamos servidores intermedios de nombres de dominio (DNS), registros WHOIS y los libros públicos de transparencia de certificados (Certificate Transparency Logs de Google) para enumerar la infraestructura sin que salte ninguna alarma en el firewall perimetral.
            </p>
          </div>

          <button
            onClick={() => {
              onAddFindingToReport(
                'Subdominios de desarrollo (api-dev) y cámaras descubiertos pasivamente',
                `site:*.${TARGET_DOMAIN} -www`,
                'A través de Certificate Transparency Logs y registros SPF del DNS se descubrieron los subdominios: api-dev.platanosdelnorte.es (185.132.44.29) y vpn.platanosdelnorte.es.'
              );
              showToast('¡Hallazgo de infraestructura guardado en el Cuaderno!');
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Guardar Hallazgo en Informe</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('dns')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'dns' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registros DNS ({PASSIVE_INFRASTRUCTURE_DATA.dnsRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('ct-logs')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'ct-logs' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Logs de Transparencia de Certificados (crt.sh)
          </button>
          <button
            onClick={() => setActiveTab('whois')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'whois' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            WHOIS & Registrador
          </button>
        </div>
      </div>

      {/* Tab 1: DNS Records Table */}
      {activeTab === 'dns' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-600" />
              <span>Zona DNS Pública Interrogada (dig ANY {TARGET_DOMAIN})</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Servidor: ns1.nominalia.com</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-sans">
                  <th className="pb-2 font-semibold">Tipo</th>
                  <th className="pb-2 font-semibold">Host</th>
                  <th className="pb-2 font-semibold">Valor / Destino</th>
                  <th className="pb-2 font-semibold">TTL</th>
                  <th className="pb-2 font-semibold font-sans">Relevancia en Auditoría OSINT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PASSIVE_INFRASTRUCTURE_DATA.dnsRecords.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold text-emerald-700">{rec.type}</td>
                    <td className="py-2.5 text-slate-800">{rec.name}</td>
                    <td className="py-2.5 font-bold text-slate-900">{rec.value}</td>
                    <td className="py-2.5 text-slate-500">{rec.ttl}</td>
                    <td className="py-2.5 font-sans text-slate-600 text-[11px]">{rec.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-950 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900">Análisis del registro SPF:</span>
              <p className="mt-0.5 leading-relaxed">
                El registro TXT SPF autoriza a <code>185.132.44.29</code> a enviar correos en nombre de la empresa. Esto revela inmediatamente que existe un host secundario que resultó ser el servidor de desarrollo <code>api-dev</code>, accesible sin restricciones de lista blanca.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Certificate Transparency Logs */}
      {activeTab === 'ct-logs' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Libro de Transparencia de Certificados (Google Certificate Transparency)</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">crt.sh / censys / censys.io</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Cada vez que un administrador solicita un certificado TLS (HTTPS) gratuito (por ejemplo a través de Let's Encrypt), la autoridad de certificación (CA) está obligada a registrar la emisión en un registro público inmutable. Esto permite a los analistas OSINT descubrir <strong>todos los subdominios históricos</strong> generados por la organización.
          </p>

          <div className="space-y-3">
            {PASSIVE_INFRASTRUCTURE_DATA.certificateTransparencyLogs.map((log, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-500 mb-2 font-sans">
                  <span className="font-semibold text-slate-800">Emisor: {log.issuer}</span>
                  <span>Registrado el: {log.loggedAt}</span>
                </div>
                <div className="space-y-1">
                  <p><strong className="text-slate-700 font-sans">Common Name:</strong> {log.commonName}</p>
                  <p className="text-slate-700 font-sans font-semibold mt-2">Nombres Alternativos del Sujeto (SAN / DNS Names):</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {log.dnsNames.map(name => (
                      <span key={name} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800 text-[11px]">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: WHOIS */}
      {activeTab === 'whois' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-600" />
              <span>Consulta WHOIS (Red.es / ESNIC para dominios .es)</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">Estado: ACTIVO</span>
          </div>

          <div className="bg-slate-950 text-slate-200 rounded-xl p-5 font-mono text-xs leading-relaxed overflow-x-auto space-y-1.5 border border-slate-800">
            <p className="text-emerald-400 font-bold mb-2"># WHOIS query output for {TARGET_DOMAIN}:</p>
            <p><span className="text-slate-400">Dominio:</span> {PASSIVE_INFRASTRUCTURE_DATA.whois.domainName}</p>
            <p><span className="text-slate-400">Estado:</span> {PASSIVE_INFRASTRUCTURE_DATA.whois.status}</p>
            <p><span className="text-slate-400">Fecha de Registro:</span> {PASSIVE_INFRASTRUCTURE_DATA.whois.registeredOn}</p>
            <p><span className="text-slate-400">Fecha de Expiración:</span> {PASSIVE_INFRASTRUCTURE_DATA.whois.expiresOn}</p>
            <p><span className="text-slate-400">Titular Registrante:</span> {PASSIVE_INFRASTRUCTURE_DATA.whois.registrantName}</p>
            <p><span className="text-slate-400">Email de Contacto:</span> {PASSIVE_INFRASTRUCTURE_DATA.whois.registrantEmail}</p>
            <p><span className="text-slate-400">Ciudad / País:</span> {PASSIVE_INFRASTRUCTURE_DATA.whois.registrantCity}, {PASSIVE_INFRASTRUCTURE_DATA.whois.registrantCountry}</p>
            <p><span className="text-slate-400">Servidores DNS:</span></p>
            <ul className="pl-4 list-disc text-slate-300">
              {PASSIVE_INFRASTRUCTURE_DATA.whois.nameServers.map(ns => (
                <li key={ns}>{ns}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
