import React from 'react';
import { Download, Calendar } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

interface InicioProps {
  navigateTo: (path: string, queryParam?: number) => void;
}

export function Inicio({ navigateTo }: InicioProps) {
  usePageMeta(
    'Plátanos del Norte S.L. | Plátano y aguacate de Gran Canaria',
    'Cooperativa platanera del norte de Gran Canaria. Maduración y distribución de plátano con denominación de origen.',
    ''
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-semibold mb-6">
            <span>Plátano de Canarias IGP</span>
            <span>·</span>
            <span>Maduración en Atmósfera Controlada</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl leading-tight">
            Líderes en la maduración y distribución frigorífica de Plátano de Canarias en la Cornisa Cantábrica
          </h1>
          <p className="mt-6 text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
            Con más de 3.500 m² de instalaciones en el Polígono Candina (Santander), recibimos la fruta directamente por transporte marítimo y abastecemos a las principales cadenas de distribución garantizando el punto exacto de dulzor y frescura.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-semibold">
            <a
              href="/documentos/catalogo_comercial_platanos_canarias_2024.pdf"
              download="catalogo_comercial_platanos_canarias_2024.pdf"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Catálogo Oficial 2024 (PDF)</span>
            </a>
            <button
              onClick={() => navigateTo('/quienes-somos')}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Conocer al Equipo Técnico
            </button>
          </div>
        </div>
      </section>

      {/* Feature Blocks */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Infraestructura y Tecnología Frutícola</h2>
          <p className="text-sm text-slate-600 mt-2">
            Control exhaustivo de la cadena de frío, temperatura de pulpa y dosificación de etileno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base mb-4">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base">8 Cámaras Automatizadas</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Sistemas SCADA con autómatas Siemens para curvas térmicas controladas entre 13°C y 14.5°C e inyección de gas etileno para maduración gradual.
            </p>
          </div>

          <div className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base mb-4">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base">Alianzas en Origen (Gáldar y La Palma)</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Convenios anuales con cooperativas de Gáldar (Gran Canaria) y Los Llanos de Aridane (La Palma) para garantizar abastecimiento continuo.
            </p>
          </div>

          <div className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base mb-4">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base">Flota con Telemetría GPS</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Vehículos refrigerados que mantienen el registro continuo de temperatura desde las naves de Candina hasta los lineales del supermercado.
            </p>
          </div>
        </div>
      </section>

      {/* News Section with dynamic ID parameters */}
      <section className="bg-slate-50 py-16 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Actualidad Corporativa y Comunicados</h2>
              <p className="text-sm text-slate-600 mt-1">Notas de prensa, convenios agrícolas e informes del sector.</p>
            </div>
            <span className="text-xs font-mono text-slate-500">Última actualización: Noviembre 2023</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => navigateTo('/actualidad', 1)}
              className="p-6 bg-white border border-slate-200 rounded-xl hover:border-emerald-600 cursor-pointer transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>15 de Octubre de 2023</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base hover:text-emerald-700">
                Plátanos del Norte amplía su acuerdo de suministro con la cooperativa agrícola de Gáldar
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                El acuerdo comercial cerrado con productores de Gáldar (Gran Canaria) garantiza 1.200 toneladas adicionales de plátano para la campaña de invierno.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Ruta: /actualidad</span>
                <span className="text-emerald-700 font-sans font-semibold">Leer comunicado →</span>
              </div>
            </div>

            <div 
              onClick={() => navigateTo('/actualidad', 2)}
              className="p-6 bg-white border border-slate-200 rounded-xl hover:border-emerald-600 cursor-pointer transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>28 de Octubre de 2023</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base hover:text-emerald-700">
                Concesión de subvención de eficiencia energética por la Dirección General de Desarrollo Rural
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                Resolución oficial del expediente administrativo para la modernización de los compresores y aislamiento térmico en el Polígono Candina.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Ruta: /actualidad</span>
                <span className="text-emerald-700 font-sans font-semibold">Leer comunicado →</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
