import React from 'react';
import { UserPreferences, InputMode } from '../types/aac';
import {
  Settings,
  X,
  Eye,
  MousePointer,
  Layers,
  Volume2,
  Sliders,
  ShieldCheck,
  Sparkles,
  Contrast,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-teal-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Ajustes de Accesibilidad & Entrada
              </h2>
              <p className="text-xs text-slate-400">
                Personalización de seguimiento ocular, conmutador y voz
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm">
          {/* Method of Access */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Modo de Acceso / Interacción
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onUpdatePreferences({ inputMode: 'gaze' })}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition cursor-pointer ${
                  preferences.inputMode === 'gaze'
                    ? 'bg-teal-950/60 border-teal-400 text-teal-200 ring-2 ring-teal-400/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Eye className="w-5 h-5 text-teal-400" />
                <span className="text-xs font-bold">Fijación Ocular (Gaze Dwell)</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdatePreferences({ inputMode: 'tap' })}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition cursor-pointer ${
                  preferences.inputMode === 'tap'
                    ? 'bg-teal-950/60 border-teal-400 text-teal-200 ring-2 ring-teal-400/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <MousePointer className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold">Pulsación Simple Directa</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdatePreferences({ inputMode: 'switch' })}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition cursor-pointer ${
                  preferences.inputMode === 'switch'
                    ? 'bg-teal-950/60 border-teal-400 text-teal-200 ring-2 ring-teal-400/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Layers className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-bold">Conmutador (Barrido)</span>
              </button>
            </div>
          </div>

          {/* Dwell time slider */}
          {preferences.inputMode === 'gaze' && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-300">
                  Tiempo de Fijación (Dwell Time):
                </span>
                <span className="text-xs font-mono font-bold text-teal-400">
                  {preferences.dwellTimeMs} ms ({(preferences.dwellTimeMs / 1000).toFixed(2)}s)
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="1600"
                step="50"
                value={preferences.dwellTimeMs}
                onChange={(e) => onUpdatePreferences({ dwellTimeMs: Number(e.target.value) })}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Rápido (400ms)</span>
                <span>Clínico recomendado (800ms)</span>
                <span>Calmado (1600ms)</span>
              </div>
            </div>
          )}

          {/* Accessibility toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <Contrast className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="font-bold text-white text-xs">Modo Alto Contraste (CVI)</div>
                  <div className="text-[11px] text-slate-400">
                    Bordes gruesos y fondo negro para baja visión
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.highContrast}
                onChange={(e) => onUpdatePreferences({ highContrast: e.target.checked })}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="font-bold text-white text-xs">Sonido de Confirmación Háptica</div>
                  <div className="text-[11px] text-slate-400">
                    Bip sutil al pasar la mirada y al confirmar
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.soundFeedback}
                onChange={(e) => onUpdatePreferences({ soundFeedback: e.target.checked })}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="font-bold text-white text-xs">Síntesis Neuronal Gemini TTS</div>
                  <div className="text-[11px] text-slate-400">
                    Voz asistencial natural en español con servidor Gemini
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.useGeminiTTS}
                onChange={(e) => onUpdatePreferences({ useGeminiTTS: e.target.checked })}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer"
          >
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
