import React, { useState } from 'react';
import { PredictedPhrase, InputMode } from '../types/aac';
import { Zap, Volume2, Sparkles, AlertTriangle, Check } from 'lucide-react';
import { speechService } from '../services/speechService';

interface Props {
  phrases: PredictedPhrase[];
  inputMode: InputMode;
  dwellTimeMs: number;
  soundFeedback: boolean;
  onPhraseSpoken: (phrase: string) => void;
}

export const PredictivePhraseBar: React.FC<Props> = ({
  phrases,
  inputMode,
  dwellTimeMs,
  soundFeedback,
  onPhraseSpoken,
}) => {
  const [activePhraseId, setActivePhraseId] = useState<string | null>(null);

  const handleTriggerPhrase = async (p: PredictedPhrase) => {
    setActivePhraseId(p.id);
    if (soundFeedback) {
      speechService.playHapticBeep(p.urgency === 'critica' ? 'emergency' : 'select');
    }
    onPhraseSpoken(p.phrase);
    await speechService.speak(p.phrase);
    setTimeout(() => setActivePhraseId(null), 1200);
  };

  if (!phrases || phrases.length === 0) return null;

  return (
    <div className="w-full bg-slate-900/80 border-b border-slate-800/80 py-2.5 px-4 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-teal-400 shrink-0 pr-2 border-r border-slate-700/60 select-none">
          <Zap className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>Acceso Rápido:</span>
        </div>

        <div className="flex items-center gap-2">
          {phrases.map((phrase) => {
            const isCritical = phrase.urgency === 'critica';
            const isHigh = phrase.urgency === 'alta';
            const isActive = activePhraseId === phrase.id;

            return (
              <button
                key={phrase.id}
                type="button"
                onClick={() => handleTriggerPhrase(phrase)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-150 shrink-0 select-none cursor-pointer ${
                  isCritical
                    ? 'bg-red-950/60 border-red-500/80 text-red-200 hover:bg-red-900/80 shadow-md shadow-red-950/40'
                    : isHigh
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-200 hover:bg-amber-900/60'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700/90 hover:border-teal-500/50'
                } ${isActive ? 'ring-2 ring-teal-400 scale-[1.02]' : ''}`}
                title={phrase.reason || 'Frase inferida por visión y contexto'}
              >
                {isCritical ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 animate-pulse" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0 group-hover:rotate-12 transition-transform" />
                )}
                <span>{phrase.phrase}</span>
                <Volume2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:text-teal-300 transition-opacity" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
