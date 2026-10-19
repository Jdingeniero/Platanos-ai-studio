import React, { useState } from 'react';
import { Newspaper, Calendar, ArrowRight, Tag, ShieldCheck, ChevronRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

interface Article {
  id: number;
  category: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  body: string[];
  tag: string;
}

const ARTICLES: Article[] = [
  {
    id: 1,
    category: 'Acuerdos en Origen',
    title: 'Plátanos del Norte amplía su acuerdo de suministro con la cooperativa agrícola de Gáldar',
    date: '15 de Octubre de 2023',
    author: 'Redacción Operaciones',
    tag: 'Gáldar / IGP',
    summary: 'La cooperativa cántabra garantiza la recepción semanal de 1.200 toneladas de plátano con Denominación de Origen en el puerto de Santander.',
    body: [
      'SANTANDER / GÁLDAR. La dirección de Plátanos del Norte S.L. ha formalizado la renovación y ampliación del convenio comercial con la cooperativa de productores del municipio de Gáldar (Gran Canaria).',
      'Este acuerdo estratégico garantiza la recepción regular de 1.200 toneladas semanales de plátano con sello de Indicación Geográfica Protegida (IGP) en el puerto de Santander, destinadas íntegramente a nuestras naves de maduración en el Polígono Candina.',
      'El transporte se realiza mediante buques de carga frigoríficos especializados con temperatura regulada a 13.5 °C para asegurar la máxima calidad organoléptica del fruto antes de su entrada en las cámaras de etileno.'
    ]
  },
  {
    id: 2,
    category: 'Expediente Oficial',
    title: 'Resolución de concesión de subvención de eficiencia energética por la Dirección General de Desarrollo Rural',
    date: '28 de Octubre de 2023',
    author: 'Expediente: SUBV-AGRI-2023/881',
    tag: 'Sostenibilidad',
    summary: 'Aprobada la modernización de los sistemas frigoríficos de las cámaras 1 a 6 en las instalaciones del Polígono Candina en Santander.',
    body: [
      'SANTANDER. Con fecha 24 de Octubre de 2023 se ha publicado en el Boletín Oficial la resolución favorable para la modernización de los sistemas frigoríficos de las cámaras 1 a 6 de Plátanos del Norte S.L. en Santander.',
      'El proyecto contempla la sustitución de compresores convencionales por maquinaria de velocidad variable y la optimización del control de atmósferas modificadas de etileno reguladas por PLC Siemens S7-1200.',
      'La inversión permitirá reducir un 22% la huella de carbono asociada al proceso de maduración y optimizar los ciclos de acondicionamiento térmico de la fruta.'
    ]
  },
  {
    id: 3,
    category: 'Calidad y Certificaciones',
    title: 'Renovación de la certificación de trazabilidad de la Indicación Geográfica Protegida (IGP)',
    date: '12 de Enero de 2024',
    author: 'Departamento de Calidad',
    tag: 'Auditoría Certificada',
    summary: 'Superada con éxito la auditoría anual de control higiénico-sanitario y maduración controlada.',
    body: [
      'SANTANDER. Las instalaciones de Plátanos del Norte S.L. en Candina han revalidado la certificación de trazabilidad integral para la distribución de plátano de Canarias en la cornisa cantábrica.',
      'El dictamen emitido por los inspectores certificadores destaca la estabilidad en el control microclimático de las naves y la rigurosa calibración de los analizadores de ppm de gas etileno.',
      'Plátanos del Norte reafirma así su compromiso con los más altos estándares de calidad alimentaria para distribuidores mayoristas de Cantabria, País Vasco y Asturias.'
    ]
  }
];

interface ActualidadProps {
  initialArticleId?: number;
}

export function Actualidad({ initialArticleId }: ActualidadProps) {
  usePageMeta(
    'Actualidad | Plátanos del Norte S.L.',
    'Actualidad corporativa, acuerdos agrícolas y comunicados oficiales de Plátanos del Norte S.L.',
    '/actualidad'
  );

  const [selectedId, setSelectedId] = useState<number>(initialArticleId || 1);
  const currentArticle = ARTICLES.find(a => a.id === selectedId) || ARTICLES[0];

  return (
    <div className="py-12 px-6 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-800 font-bold">
          <Newspaper className="w-4 h-4" />
          <span>Sala de Comunicación Oficial</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
          Actualidad y Noticias Corporativas
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-3xl">
          Comunicados de prensa, acuerdos comerciales con cooperativas canarias y resoluciones oficiales de Plátanos del Norte S.L.
        </p>
      </div>

      {/* Main Grid: Articles list + Detail view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Selector */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Artículos Recientes
          </span>
          {ARTICLES.map(article => {
            const isSelected = article.id === selectedId;
            return (
              <button
                key={article.id}
                onClick={() => setSelectedId(article.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all text-xs cursor-pointer flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={isSelected ? 'text-emerald-800 font-semibold' : 'text-slate-500'}>
                    {article.category}
                  </span>
                  <span className="text-slate-400">{article.date.split(' ').slice(2).join(' ')}</span>
                </div>
                <h2 className="font-bold text-slate-900 text-xs leading-snug">
                  {article.title}
                </h2>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-mono">
                    {article.tag}
                  </span>
                  <span className="text-emerald-700 flex items-center font-semibold text-[11px]">
                    Leer <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Article Full View */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3 border-b border-slate-100 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 font-sans">
                {currentArticle.category}
              </span>
              <span className="text-slate-400 text-xs font-mono">·</span>
              <span className="text-slate-500 text-xs flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                {currentArticle.date}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {currentArticle.title}
            </h2>

            <p className="text-xs text-slate-500 font-mono">
              Autor: {currentArticle.author} · Canal Oficial de Distribución
            </p>
          </div>

          <div className="text-slate-700 text-sm leading-relaxed space-y-4 font-sans">
            <p className="font-semibold text-slate-900 text-base leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {currentArticle.summary}
            </p>
            {currentArticle.body.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Página pública indexable: /actualidad</span>
            </div>
            <span className="text-slate-400">Plátanos del Norte S.L. · Prensa Oficial</span>
          </div>
        </div>
      </div>
    </div>
  );
}
