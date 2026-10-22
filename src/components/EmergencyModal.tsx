import React, { useState } from 'react';
import {
  ShieldAlert,
  X,
  Volume2,
  VolumeX,
  PhoneCall,
  AlertTriangle,
  HeartPulse,
  Pill,
  User,
  Check,
} from 'lucide-react';
import { speechService } from '../services/speechService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isPlayingBeacon, setIsPlayingBeacon] = useState(false);
  const emergencyMessage =
    '¡Atención por favor! Soy una persona con dificultades del habla y necesito asistencia médica inmediata. Por favor lea mi información en pantalla.';

  if (!isOpen) return null;

  const toggleBeaconVoice = async () => {
    if (isPlayingBeacon) {
      speechService.stop();
      setIsPlayingBeacon(false);
    } else {
      setIsPlayingBeacon(true);
      speechService.playHapticBeep('emergency');
      await speechService.speak(emergencyMessage, { speed: 0.95 });
      setIsPlayingBeacon(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-red-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-red-500 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Urgent Red Banner */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 animate-bounce" />
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider">
                Tarjeta Médica de Emergencia (SOS)
              </h2>
              <p className="text-xs text-red-100 font-semibold">
                Comunicación prioritaria de salud y auxilio
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Audio Beacon Button */}
          <button
            type="button"
            onClick={toggleBeaconVoice}
            className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-black text-base uppercase tracking-wider text-white shadow-xl transition-all cursor-pointer ${
              isPlayingBeacon
                ? 'bg-amber-600 animate-pulse'
                : 'bg-red-600 hover:bg-red-500 shadow-red-900/50 hover:scale-[1.01]'
            }`}
          >
            {isPlayingBeacon ? (
              <>
                <VolumeX className="w-6 h-6" />
                <span>Detener Sirena de Voz</span>
              </>
            ) : (
              <>
                <Volume2 className="w-6 h-6" />
                <span>Emitir Baliza de Voz en Alto ("¡Necesito Ayuda!")</span>
              </>
            )}
          </button>

          {/* Quick Notice for Paramedics / Bystanders */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-200 text-sm">
            <div className="flex items-center gap-2 text-red-400 font-extrabold uppercase text-xs mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Instrucción para personal sanitario o acompañante:</span>
            </div>
            <p className="text-xs text-slate-300">
              Esta persona se comunica mediante pictogramas asistenciales EcoSense AAC. Por favor mantenga la calma, hable con frases cortas y claras y observe sus selecciones en la pantalla.
            </p>
          </div>

          {/* Medical Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[11px] mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Alergias Severas</span>
              </div>
              <p className="text-white font-bold text-sm">
                Frutos secos • Penicilina • Lactosa
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[11px] mb-1">
                <HeartPulse className="w-4 h-4 text-red-400" />
                <span>Condición Médica</span>
              </div>
              <p className="text-white font-bold text-sm">
                Discapacidad Motriz / Habla no verbal
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 sm:col-span-2">
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[11px] mb-1">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Contacto de Emergencia Primario</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div>
                  <div className="text-white font-extrabold text-sm">Dra. Elena Gómez (Tutora / Familiar)</div>
                  <div className="text-slate-400 text-xs">+34 612 345 678</div>
                </div>
                <a
                  href="tel:+34612345678"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Llamar</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
          >
            Cerrar Emergencia
          </button>
        </div>
      </div>
    </div>
  );
};
