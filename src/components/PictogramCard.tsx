import React, { useState, useRef, useEffect } from 'react';
import { Pictogram, FitzgeraldCategory, InputMode } from '../types/aac';
import { PictogramIcon } from './PictogramIcon';
import { Sparkles, Eye, AlertCircle } from 'lucide-react';
import { speechService } from '../services/speechService';

interface Props {
  pictogram: Pictogram;
  inputMode: InputMode;
  dwellTimeMs: number;
  highContrast: boolean;
  soundFeedback: boolean;
  isScanningTarget?: boolean;
  onSelect: (pic: Pictogram) => void;
  compact?: boolean;
}

const categoryStyles: Record<
  FitzgeraldCategory,
  {
    base: string;
    border: string;
    text: string;
    badge: string;
    ringColor: string;
    hcBorder: string;
  }
> = {
  pronoun: {
    base: 'bg-pink-950/30 hover:bg-pink-900/40',
    border: 'border-pink-500/60',
    text: 'text-pink-100',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    ringColor: '#ec4899',
    hcBorder: 'border-pink-400',
  },
  verb: {
    base: 'bg-emerald-950/30 hover:bg-emerald-900/40',
    border: 'border-emerald-500/60',
    text: 'text-emerald-100',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    ringColor: '#10b981',
    hcBorder: 'border-emerald-400',
  },
  noun: {
    base: 'bg-amber-950/30 hover:bg-amber-900/40',
    border: 'border-amber-500/60',
    text: 'text-amber-100',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    ringColor: '#f59e0b',
    hcBorder: 'border-amber-300',
  },
  adjective: {
    base: 'bg-blue-950/30 hover:bg-blue-900/40',
    border: 'border-blue-500/60',
    text: 'text-blue-100',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    ringColor: '#3b82f6',
    hcBorder: 'border-blue-400',
  },
  social: {
    base: 'bg-purple-950/30 hover:bg-purple-900/40',
    border: 'border-purple-500/60',
    text: 'text-purple-100',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    ringColor: '#a855f7',
    hcBorder: 'border-purple-400',
  },
  place: {
    base: 'bg-orange-950/30 hover:bg-orange-900/40',
    border: 'border-orange-500/60',
    text: 'text-orange-100',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    ringColor: '#f97316',
    hcBorder: 'border-orange-400',
  },
  emergency: {
    base: 'bg-red-950/50 hover:bg-red-900/60',
    border: 'border-red-500 shadow-lg shadow-red-950/50',
    text: 'text-red-100',
    badge: 'bg-red-500/30 text-red-200 border-red-500/50 font-bold animate-pulse',
    ringColor: '#ef4444',
    hcBorder: 'border-red-500',
  },
};

export const PictogramCard: React.FC<Props> = ({
  pictogram,
  inputMode,
  dwellTimeMs,
  highContrast,
  soundFeedback,
  isScanningTarget = false,
  onSelect,
  compact = false,
}) => {
  const [dwellProgress, setDwellProgress] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const dwellStartTime = useRef<number | null>(null);
  const dwellTimer = useRef<number | null>(null);

  const style = categoryStyles[pictogram.category] || categoryStyles.noun;

  // Cleanup dwell timers
  const clearDwell = () => {
    setIsHovered(false);
    setDwellProgress(0);
    dwellStartTime.current = null;
    if (dwellTimer.current) {
      cancelAnimationFrame(dwellTimer.current);
      dwellTimer.current = null;
    }
  };

  const handleMouseEnter = () => {
    if (inputMode !== 'gaze') return;
    setIsHovered(true);
    dwellStartTime.current = performance.now();
    if (soundFeedback) {
      speechService.playHapticBeep('hover');
    }

    const animateDwell = (now: number) => {
      if (!dwellStartTime.current) return;
      const elapsed = now - dwellStartTime.current;
      const progress = Math.min(100, (elapsed / dwellTimeMs) * 100);
      setDwellProgress(progress);

      if (progress >= 100) {
        if (soundFeedback) {
          speechService.playHapticBeep(pictogram.urgency === 'critica' ? 'emergency' : 'select');
        }
        onSelect(pictogram);
        clearDwell();
      } else {
        dwellTimer.current = requestAnimationFrame(animateDwell);
      }
    };

    dwellTimer.current = requestAnimationFrame(animateDwell);
  };

  const handleMouseLeave = () => {
    if (inputMode === 'gaze') {
      clearDwell();
    }
  };

  const handleClick = () => {
    if (soundFeedback) {
      speechService.playHapticBeep(pictogram.urgency === 'critica' ? 'emergency' : 'select');
    }
    onSelect(pictogram);
  };

  useEffect(() => {
    return () => {
      if (dwellTimer.current) cancelAnimationFrame(dwellTimer.current);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col items-center justify-between rounded-2xl transition-all duration-150 select-none cursor-pointer focus:outline-none ${
        compact ? 'p-2.5 min-h-[96px]' : 'p-3.5 min-h-[128px] sm:min-h-[142px]'
      } ${
        highContrast
          ? `bg-black border-4 ${style.hcBorder} text-white shadow-xl`
          : `border-2 ${style.border} ${style.base} backdrop-blur-md shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`
      } ${
        isScanningTarget
          ? 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-slate-900 scale-105 z-20 animate-pulse'
          : ''
      }`}
      aria-label={`${pictogram.label}, categoría ${pictogram.category}`}
    >
      {/* Dynamic Dwell Progress Overlay (Eye Tracking / Fijación de Mirada) */}
      {inputMode === 'gaze' && isHovered && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
          <div
            className="absolute inset-0 bg-white/10 transition-all"
            style={{
              clipPath: `inset(${100 - dwellProgress}% 0 0 0)`,
            }}
          />
          {/* Circular Countdown Ring in corner */}
          <div className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-slate-950/80 shadow">
            <svg className="w-7 h-7 transform -rotate-90">
              <circle
                cx="14"
                cy="14"
                r="11"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-slate-700"
                fill="none"
              />
              <circle
                cx="14"
                cy="14"
                r="11"
                stroke={style.ringColor}
                strokeWidth="2.5"
                strokeDasharray="69.1"
                strokeDashoffset={69.1 - (69.1 * dwellProgress) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all"
              />
            </svg>
            <Eye className="w-3 h-3 absolute text-white" />
          </div>
        </div>
      )}

      {/* Top Meta Tag: Suggested or Urgency */}
      <div className="w-full flex items-center justify-between text-[10px] font-semibold tracking-wider">
        {pictogram.suggestedReason ? (
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border ${style.badge} max-w-[90%] truncate`}
            title={pictogram.suggestedReason}
          >
            <Sparkles className="w-2.5 h-2.5 shrink-0 text-cyan-300" />
            <span className="truncate">{pictogram.suggestedReason}</span>
          </span>
        ) : pictogram.isCore ? (
          <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">
            Fijo
          </span>
        ) : (
          <span className="text-[10px] uppercase opacity-60">{pictogram.category}</span>
        )}

        {pictogram.urgency === 'critica' && (
          <span className="flex items-center gap-0.5 text-red-400 text-[10px] font-black uppercase">
            <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
            SOS
          </span>
        )}
      </div>

      {/* Pictogram Central Symbol (High legibility graphic) */}
      <div className="my-auto py-1 flex items-center justify-center transition-transform group-hover:scale-110">
        <PictogramIcon
          name={pictogram.iconName}
          className={`${compact ? 'w-8 h-8' : 'w-11 h-11 sm:w-12 sm:h-12'} ${
            highContrast ? 'text-white' : style.text
          }`}
        />
      </div>

      {/* Pictogram Word Label (Fitzgerald Key Typography) */}
      <div className="w-full text-center">
        <span
          className={`block font-extrabold uppercase tracking-wide leading-tight truncate ${
            compact ? 'text-xs' : 'text-sm sm:text-base'
          } ${highContrast ? 'text-white' : 'text-slate-100'}`}
        >
          {pictogram.label}
        </span>
      </div>
    </button>
  );
};
