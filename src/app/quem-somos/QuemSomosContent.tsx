'use client';

import { Users, MapPin, Heart, Leaf } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

const STATS = [
  { value: '100+', key: 'stat1' as const },
  { value: '500+', key: 'stat2' as const },
  { value: '15+', key: 'stat3' as const },
  { value: 'RJ', key: 'stat4' as const },
];

export function QuemSomosContent() {
  const { t } = useTranslation();

  const VALORES = [
    { icon: Users, title: t.about.val1.title, desc: t.about.val1.desc },
    { icon: Heart, title: t.about.val2.title, desc: t.about.val2.desc },
    { icon: Leaf, title: t.about.val3.title, desc: t.about.val3.desc },
    { icon: MapPin, title: t.about.val4.title, desc: t.about.val4.desc },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-3">
          {t.about.label}
        </p>
        <h1 className="font-serif text-wood-900 text-4xl sm:text-5xl font-semibold leading-tight mb-6">
          {t.about.title}
        </h1>
        <p
          className="text-xl text-wood-600 leading-relaxed max-w-2xl"
          dangerouslySetInnerHTML={{ __html: t.about.lead }}
        />
      </div>

      {/* Stats strip */}
      <div className="mt-16 bg-wood-900 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map(({ value, key }) => (
              <div key={key} className="text-center">
                <p className="font-serif text-terracotta-400 text-4xl font-bold">{value}</p>
                <p className="text-wood-300 text-sm mt-1">{t.about[key]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl mt-16">
        <div className="space-y-6 text-wood-700 leading-relaxed">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
        </div>

        {/* Valores */}
        <h2 className="font-serif text-wood-900 text-2xl font-semibold mt-16 mb-8">
          {t.about.valuesTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {VALORES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 bg-sand-100 rounded-2xl border border-sand-200 flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-terracotta-600/10 flex items-center justify-center flex-shrink-0">
                <Icon strokeWidth={1.5} className="w-5 h-5 text-terracotta-600" />
              </div>
              <div>
                <h3 className="font-semibold text-wood-900 text-sm mb-1">{title}</h3>
                <p className="text-wood-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Vassouras Tec */}
        <div className="mt-16 p-8 bg-wood-900 rounded-3xl">
          <p className="text-terracotta-400 text-xs font-medium uppercase tracking-widest mb-3">
            {t.about.vtLabel}
          </p>
          <h2 className="font-serif text-sand-50 text-2xl font-semibold mb-4">{t.about.vtTitle}</h2>
          <p className="text-wood-300 leading-relaxed">
            {t.about.vtDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
