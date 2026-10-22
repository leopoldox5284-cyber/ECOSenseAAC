import React, { useState } from 'react';
import { Pictogram, UserPreferences } from '../types/aac';
import { PictogramIcon } from './PictogramIcon';
import { Volume2, VolumeX, Trash2, Delete, Sparkles, Copy, Check, Play } from 'lucide-react';
import { speechService } from '../services/speechService';

interface Props {
  selectedSymbols: Pictogram[];
  onRemoveLast: () => void;
  onClearAll: () => void;
  userPreferences: UserPreferences;
  onSpeakSentence?: (text: string) => void;
}

export const SentenceStrip: React.FC<Props> = ({
  selectedSymbols,
  onRemoveLast,
  onClearAll,
  userPreferences,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate continuous natural Spanish sentence
  const sentenceText = selectedSymbols
    .map((s) => s.audioVoiceText || s.label)
    .join(' ')
    .trim();

  const handleSpeak = async () => {
    if (!sentenceText) return;
    setIsSpeaking(true);
    speechService.playHapticBeep('select');

    try {
      await speechService.speak(sentenceText, {
        speed: userPreferences.voiceSpeed,
        pitch: userPreferences.voicePitch,
        useGeminiTTS: userPreferences.useGeminiTTS,
      });
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleCopy = () => {
    if (!sentenceText) return;
    navigator.clipboard.writeText(sentenceText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-slate-900/95 border-b border-slate-800 backdrop-blur-xl px-4 py-3 sticky top-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Message accumulator box */}
        <div className="flex-1 flex items-center min-h-[64px] bg-slate-950/80 rounded-2xl border border-slate-700/80 p-2 overflow-x-auto gap-2 scrollbar-thin scrollbar-thumb-slate-700">
          {selectedSymbols.length === 0 ? (
            <div className="flex items-center gap-2 text-slate-500 italic text-sm pl-3 select-none">
              <Sparkles className="w-4 h-4 text-teal-400/70" />
              <span>Toca o fija la mirada en los pictogramas para construir tu frase...</span>
            </div>
          ) : (
            selectedSymbols.map((symbol, idx) => (
              <div
                key={`${symbol.id}-${idx}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-600 shrink-0 text-white shadow-sm animate-in fade-in zoom-in duration-150"
              >
                <PictogramIcon name={symbol.iconName} className="w-6 h-6 shrink-0 text-teal-300" />
                <span className="font-extrabold text-xs sm:text-sm uppercase tracking-wide">
                  {symbol.label}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 justify-end shrink-0">
          {/* Backspace single */}
          <button
            type="button"
            onClick={onRemoveLast}
            disabled={selectedSymbols.length === 0}
            className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition"
            title="Borrar último pictograma"
            aria-label="Borrar último pictograma"
          >
            <Delete className="w-5 h-5" />
          </button>

          {/* Clear all */}
          <button
            type="button"
            onClick={onClearAll}
            disabled={selectedSymbols.length === 0}
            className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:text-red-400 hover:bg-red-950/30 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition"
            title="Borrar frase completa"
            aria-label="Borrar frase completa"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          {/* Copy sentence */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={selectedSymbols.length === 0}
            className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition"
            title="Copiar texto de la frase"
            aria-label="Copiar texto"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          </button>

          {/* SPEAK ALOUD BUTTON (Primary Accessible Trigger) */}
          <button
            type="button"
            onClick={handleSpeak}
            disabled={selectedSymbols.length === 0 || isSpeaking}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-black text-sm sm:text-base uppercase tracking-wider text-white shadow-lg transition-all select-none cursor-pointer ${
              selectedSymbols.length > 0
                ? isSpeaking
                  ? 'bg-amber-600 animate-pulse'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
            aria-label="Vocalizar frase en voz alta"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-6 h-6 animate-spin text-white" />
                <span>Hablando...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-6 h-6" />
                <span>Vocalizar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
