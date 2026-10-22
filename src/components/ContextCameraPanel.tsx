import React, { useState, useRef, useEffect } from 'react';
import { ContextState, UserPreferences } from '../types/aac';
import { CONTEXT_PRESETS } from '../data/initialPictograms';
import {
  Camera,
  Video,
  VideoOff,
  MapPin,
  Volume2,
  Sun,
  Moon,
  Clock,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Sparkles,
  Coffee,
  HeartPulse,
  ShoppingCart,
  Bus,
  Home,
  AlertTriangle,
  Upload,
} from 'lucide-react';

interface Props {
  context: ContextState;
  onUpdateContext: (partial: Partial<ContextState>) => void;
  onApplyContextPreset: (presetId: string) => void;
  onRunAiAnalysis: (imageBase64?: string) => Promise<void>;
  isAnalyzing: boolean;
  userPreferences: UserPreferences;
}

const presetIcons: Record<string, React.ElementType> = {
  cafeteria: Coffee,
  hospital: HeartPulse,
  supermercado: ShoppingCart,
  transporte: Bus,
  casa: Home,
};

export const ContextCameraPanel: React.FC<Props> = ({
  context,
  onUpdateContext,
  onApplyContextPreset,
  onRunAiAnalysis,
  isAnalyzing,
  userPreferences,
}) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start real webcam
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      onUpdateContext({ cameraActive: true, usingRealWebcam: true });
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Permiso de cámara no disponible o denegado. Puedes usar la simulación contextual.');
      setIsCameraActive(false);
      onUpdateContext({ cameraActive: false, usingRealWebcam: false });
    }
  };

  // Stop real webcam
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    onUpdateContext({ cameraActive: false, usingRealWebcam: false });
  };

  // Capture frame from webcam and trigger AI analysis
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) {
      // Just analyze current simulated scene
      onRunAiAnalysis();
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.8);
    await onRunAiAnalysis(base64);
  };

  // Handle uploaded photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        onRunAiAnalysis(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      {/* Header and Privacy Shield */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Sensor Multimodal & Inferencia de Contexto
            </h2>
            <p className="text-xs text-slate-400">
              Visión por computador + Geolocalización POI + Sensor acústico
            </p>
          </div>
        </div>

        {/* On-Device Privacy Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Privacidad On-Device (0 PII en nube)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Visual Feeder (Live Webcam or Context Simulation Viewfinder) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="relative w-full aspect-video sm:h-52 bg-slate-950 rounded-2xl overflow-hidden border border-slate-700/80 shadow-inner flex items-center justify-center">
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                {/* AI HUD Overlay for Camera */}
                <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between border-2 border-teal-500/30">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-teal-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      LIVE FEED • 1.0 FPS SAMPLING
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-slate-300">
                      NPU ACTIVE
                    </span>
                  </div>

                  {/* Synthetic object target boxes */}
                  <div className="flex flex-wrap gap-1.5 max-w-full">
                    {context.detectedObjects.slice(0, 3).map((obj, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-teal-950/80 border border-teal-400/60 text-teal-200 text-[10px] font-mono"
                      >
                        [✓ {obj}]
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Simulated Scene Viewfinder Graphic */
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-900 to-slate-950 relative">
                <div className="p-3.5 rounded-full bg-slate-800/80 border border-slate-700 text-teal-400 mb-2">
                  {React.createElement(presetIcons[context.category] || Coffee, {
                    className: 'w-7 h-7',
                  })}
                </div>
                <h4 className="text-sm font-bold text-white mb-0.5">{context.venue}</h4>
                <p className="text-xs text-slate-400 max-w-xs line-clamp-2">
                  Objetos detectados: {context.detectedObjects.join(', ')}
                </p>

                {/* Simulated AI scanning beam */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse opacity-70" />
              </div>
            )}
          </div>

          {/* Camera controls */}
          <div className="flex items-center gap-2">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
              >
                <Video className="w-4 h-4 text-teal-400" />
                <span>Activar Cámara Real</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950/40 text-red-300 text-xs font-bold border border-slate-700 transition"
              >
                <VideoOff className="w-4 h-4" />
                <span>Detener Cámara</span>
              </button>
            )}

            {/* Upload image */}
            <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer transition">
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Re-analyze scene button */}
            <button
              type="button"
              onClick={captureAndAnalyze}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-teal-900/30 transition select-none cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Infiriendo...' : 'Re-inferir'}</span>
            </button>
          </div>

          {cameraError && (
            <div className="text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-500/30 rounded-lg p-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>{cameraError}</span>
            </div>
          )}
        </div>

        {/* Right Column: Presets + Live Environmental Sensory Data */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-3">
          {/* Quick Context Switcher (Situaciones de la vida real) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Escenarios y Geolocalización POI:
              </span>
              <span className="text-[11px] text-teal-400/80">Simulación interactiva de entorno</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CONTEXT_PRESETS.map((preset) => {
                const isSelected = context.category === preset.id;
                const PresetIcon = presetIcons[preset.id] || Coffee;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onApplyContextPreset(preset.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition select-none cursor-pointer ${
                      isSelected
                        ? 'bg-teal-950/60 border-teal-400 text-teal-100 ring-1 ring-teal-400 shadow-md'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected ? 'bg-teal-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      <PresetIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{preset.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.venue}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sensory Telemetry Strip */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Ubicación</div>
                <div className="font-semibold truncate" title={context.gpsAddress}>
                  {context.gpsAddress}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Volume2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Ruido Amb.</div>
                <div className="font-semibold">{context.noiseLevelDb} dB (Acu.)</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Sun className="w-4 h-4 text-yellow-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Iluminación</div>
                <div className="font-semibold capitalize">{context.lighting}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Motor IA</div>
                <div className="font-semibold text-emerald-300 text-[11px] truncate">
                  {context.lastAnalysisLatencyMs}ms ({context.engineUsed})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
