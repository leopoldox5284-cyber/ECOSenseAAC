import React from 'react';
import {
  Sparkles,
  ShieldAlert,
  Settings,
  FileText,
  Eye,
  MousePointer,
  Layers,
  MapPin,
  Lock,
} from 'lucide-react';
import { UserPreferences, ContextState } from '../types/aac';

interface Props {
  preferences: UserPreferences;
  context: ContextState;
  onOpenSpecModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenEmergencyModal: () => void;
}

export const Header: React.FC<Props> = ({
  preferences,
  context,
  onOpenSpecModal,
  onOpenSettingsModal,
  onOpenEmergencyModal,
}) => {
  return (
    <header className="bg-slate-950 border-b border-slate-800 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                EcoSense <span className="text-teal-400">AAC</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-teal-950/60 border border-teal-500/30 text-[10px] font-bold text-teal-300">
                Contextual & Multimodal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                {context.venue}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {preferences.inputMode === 'gaze' && (
                  <>
                    <Eye className="w-3 h-3 text-teal-400" />
                    <span>Fijación {preferences.dwellTimeMs}ms</span>
                  </>
                )}
                {preferences.inputMode === 'tap' && (
                  <>
                    <MousePointer className="w-3 h-3 text-emerald-400" />
                    <span>Pulsación Simple</span>
                  </>
                )}
                {preferences.inputMode === 'switch' && (
                  <>
                    <Layers className="w-3 h-3 text-purple-400" />
                    <span>Barrido Conmutador</span>
                  </>
                )}
              </span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:flex items-center gap-1 text-emerald-400">
                <Lock className="w-3 h-3" />
                <span>On-Device</span>
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Spec Button */}
          <button
            type="button"
            onClick={onOpenSpecModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-teal-300 hover:text-white border border-teal-500/30 text-xs font-bold transition shadow-sm cursor-pointer"
            title="Ver especificación del producto y arquitectura técnica"
          >
            <FileText className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">Especificación de Producto</span>
            <span className="sm:hidden">Spec</span>
          </button>

          {/* Emergency SOS Button */}
          <button
            type="button"
            onClick={onOpenEmergencyModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-xs font-black shadow-md shadow-red-950/50 border border-red-400/80 transition cursor-pointer"
            title="Abrir tarjeta SOS médica"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SOS</span>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettingsModal}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title="Ajustes de accesibilidad y entrada"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
