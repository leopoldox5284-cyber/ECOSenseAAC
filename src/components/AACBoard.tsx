import React, { useState, useEffect } from 'react';
import { Pictogram, FitzgeraldCategory, InputMode, UserPreferences } from '../types/aac';
import { PictogramCard } from './PictogramCard';
import {
  Layers,
  Sparkles,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  Filter,
  CheckCircle,
} from 'lucide-react';

interface Props {
  corePictograms: Pictogram[];
  fringePictograms: Pictogram[];
  selectedCategoryFilter: FitzgeraldCategory | 'all';
  onCategoryFilterChange: (cat: FitzgeraldCategory | 'all') => void;
  onSelectPictogram: (pic: Pictogram) => void;
  userPreferences: UserPreferences;
  onOpenEmergencyModal: () => void;
}

const CATEGORY_TABS: { id: FitzgeraldCategory | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'Todos (Predictivo)', color: 'border-teal-500 text-teal-300' },
  { id: 'emergency', label: 'Emergencia / SOS', color: 'border-red-500 text-red-400' },
  { id: 'verb', label: 'Acciones (Verbos)', color: 'border-emerald-500 text-emerald-400' },
  { id: 'noun', label: 'Cosas (Sustantivos)', color: 'border-amber-500 text-amber-400' },
  { id: 'place', label: 'Lugares / Ir', color: 'border-orange-500 text-orange-400' },
  { id: 'adjective', label: 'Estados / Sentir', color: 'border-blue-500 text-blue-400' },
  { id: 'social', label: 'Social / Cortesía', color: 'border-purple-500 text-purple-400' },
];

export const AACBoard: React.FC<Props> = ({
  corePictograms,
  fringePictograms,
  selectedCategoryFilter,
  onCategoryFilterChange,
  onSelectPictogram,
  userPreferences,
  onOpenEmergencyModal,
}) => {
  // Switch Access scanning simulation state
  const [scanningIndex, setScanningIndex] = useState<number>(-1);

  // Filter fringe cards
  const filteredFringe = fringePictograms.filter((p) => {
    if (selectedCategoryFilter === 'all') return true;
    return p.category === selectedCategoryFilter;
  });

  const allVisibleCards = [...corePictograms, ...filteredFringe];

  // Switch scanning logic
  useEffect(() => {
    if (userPreferences.inputMode !== 'switch') {
      setScanningIndex(-1);
      return;
    }

    const interval = setInterval(() => {
      setScanningIndex((prev) => (prev + 1) % allVisibleCards.length);
    }, 1500);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (scanningIndex >= 0 && scanningIndex < allVisibleCards.length) {
          onSelectPictogram(allVisibleCards[scanningIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [userPreferences.inputMode, allVisibleCards.length, scanningIndex]);

  return (
    <div className="flex flex-col gap-4">
      {/* Category Navigation Bar & Quick SOS banner */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 max-w-full">
          <span className="flex items-center gap-1 text-xs font-bold uppercase text-slate-400 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtro:</span>
          </span>
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategoryFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onCategoryFilterChange(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 select-none cursor-pointer ${
                  isSelected
                    ? `bg-slate-800 ${tab.color} shadow-sm ring-1 ring-slate-600`
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Instant SOS Action */}
        <button
          type="button"
          onClick={onOpenEmergencyModal}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold shadow-lg shadow-red-950/60 border border-red-400 animate-pulse transition shrink-0 select-none cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>BOTÓN SOS MÉDICO</span>
        </button>
      </div>

      {/* Dual Area: 1. Core Vocabulary (Motor memory anchor) & 2. Predictive Fringe Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Fixed Core Vocabulary Zone (Anclaje Motor Inmutable) */}
        <div className="xl:col-span-4 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 shadow-xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                Vocabulario Nuclear (Fijo)
              </h3>
            </div>
            <span
              className="text-[10px] text-slate-400 font-mono"
              title="Posición fija permanente para retención de memoria motora del usuario"
            >
              MEMORIA MOTORA
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-2.5">
            {corePictograms.map((pic, idx) => (
              <PictogramCard
                key={pic.id}
                pictogram={pic}
                inputMode={userPreferences.inputMode}
                dwellTimeMs={userPreferences.dwellTimeMs}
                highContrast={userPreferences.highContrast}
                soundFeedback={userPreferences.soundFeedback}
                isScanningTarget={scanningIndex === idx}
                onSelect={onSelectPictogram}
                compact={false}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Contextual Fringe Grid (Reordenado en tiempo real por Visión + Contexto) */}
        <div className="xl:col-span-8 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 shadow-xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400 animate-spin-slow" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-teal-300">
                Vocabulario Dinámico Predictivo (Visión & Contexto)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              REORDENADO POR IA
            </span>
          </div>

          {filteredFringe.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No hay pictogramas en esta categoría.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {filteredFringe.map((pic, idx) => {
                const globalIndex = corePictograms.length + idx;
                return (
                  <PictogramCard
                    key={pic.id}
                    pictogram={pic}
                    inputMode={userPreferences.inputMode}
                    dwellTimeMs={userPreferences.dwellTimeMs}
                    highContrast={userPreferences.highContrast}
                    soundFeedback={userPreferences.soundFeedback}
                    isScanningTarget={scanningIndex === globalIndex}
                    onSelect={onSelectPictogram}
                    compact={false}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
