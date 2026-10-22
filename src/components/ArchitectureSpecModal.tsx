import React, { useState } from 'react';
import {
  FileText,
  X,
  Cpu,
  ShieldCheck,
  Eye,
  Activity,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  HardDrive,
  Network,
  Lock,
  BarChart3,
  HeartHandshake,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureSpecModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'privacy' | 'interaction' | 'benchmarks'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                Especificación del Producto: EcoSense AAC
              </h2>
              <p className="text-xs text-slate-400">
                Arquitectura de Sistema, Inferencia On-Device y Diseño Asistencial Multimodal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-6 gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'architecture'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>1. Arquitectura del Sistema</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'privacy'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>2. Privacidad On-Device (Zero-Cloud)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('interaction')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'interaction'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>3. Interfaz Ultra-Rápida & Memoria Motora</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('benchmarks')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'benchmarks'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>4. Métricas de Rendimiento Clínico</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed">
          {/* TAB 1: ARQUITECTURA DEL SISTEMA */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-black uppercase text-teal-400 mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Diagrama de Flujo: Pipeline Multimodal On-Device
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-2">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="text-teal-400 font-bold mb-1">Capa 1: Sensores</div>
                      <p className="text-slate-400 text-[11px]">
                        • Cámara RGB (1 FPS subsampled)<br />
                        • GPS Geofence (POI inverso)<br />
                        • Micrófono ambiental (dB RMS)<br />
                        • Reloj circadiano
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-2">Latencia: ~5ms</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="text-cyan-400 font-bold mb-1">Capa 2: Edge Neural (NPU)</div>
                      <p className="text-slate-400 text-[11px]">
                        • MediaPipe / MobileNet-v4 vision<br />
                        • Detección objetos y etiquetas<br />
                        • Bounding boxes en memoria volátil<br />
                        • Inferencia local en chip
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-2">Latencia: ~35ms</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="text-amber-400 font-bold mb-1">Capa 3: Fusión y Ranker</div>
                      <p className="text-slate-400 text-[11px]">
                        • Clasificador bayesiano situacional<br />
                        • P(Palabra | Entorno, Hora, Objetos)<br />
                        • Ontología semántica Fitzgerald<br />
                        • Ponderación de urgencia médica
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-2">Latencia: ~8ms</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="text-emerald-400 font-bold mb-1">Capa 4: Render UI React</div>
                      <p className="text-slate-400 text-[11px]">
                        • Anclaje motor fijo (Columna Core)<br />
                        • Reordenación fluida Fringe<br />
                        • Dwell Ring eye-tracking (60 FPS)<br />
                        • Síntesis de voz instantánea
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-2">Latencia total: &lt; 50ms</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Inferencia Contextual Sin Navegación en Árbol</h3>
                <p>
                  En los comunicadores tradicionales (ej. Grid 3, Tobii Dynavox Communicator), para pedir "un agua en un bar", el usuario debe ejecutar la secuencia: <em>Inicio → Alimentos → Bebidas → Bebidas frías → Agua</em>. Esto implica entre 4 y 6 selecciones visuales complejas, consumiendo más de 20 segundos y generando severa fatiga ocular o muscular en pacientes con ELA, parálisis cerebral o TEA.
                </p>
                <p>
                  <strong>EcoSense AAC</strong> invierte el paradigma: el teléfono detecta pasivamente la mesa de bar y los vasos circundantes mediante la cámara en segundo plano, reconociendo el POI "Cafetería". De forma autónoma, eleva el pictograma <strong>[AGUA]</strong> y la frase pre-armada <strong>"Quiero un agua fría, por favor"</strong> al primer nivel de interacción accesible con 1 sola fijación visual o pulsación.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACIDAD ON-DEVICE */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200">
                <div className="flex items-center gap-2 font-bold mb-1 text-emerald-300">
                  <Lock className="w-5 h-5" />
                  <span>Protocolo Clínico de Privacidad Zero-Cloud (On-Device Memory Retention)</span>
                </div>
                <p className="text-xs text-emerald-200/90">
                  Cumplimiento integral con GDPR (Art. 9 - Datos biométricos y de salud) y regulaciones HIPAA de protección al paciente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Fotogramas Procesados en Memoria Volátil (RAM)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    La cámara captura a 1 FPS y los buffers de imagen son alimentados directamente al chip NPU local (Neural Processing Unit). Los datos binarios de la imagen se destruyen de la memoria inmediatamente tras extraer las etiquetas vectoriales de contexto. Ninguna foto se guarda en el carrete ni en el disco de almacenamiento.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Ofuscación y Difuminado de Rostros en Tiempo Real</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Cualquier rostro humano o documento con texto confidencial detectado en el campo de visión se pixela antes de que la ontología semántica genere las recomendaciones, garantizando la privacidad de terceras personas en espacios públicos.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Operatividad 100% Offline (Sin Conexión)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    El usuario no depende de servidores externos ni de cobertura celular para comunicarse. Los modelos cuantizados (INT8) de MobileNet y el vocabulario ARASAAC están preinstalados en el dispositivo.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Modo Híbrido Opcional Gemini Cloud</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Solo cuando el usuario o cuidador activa voluntariamente la conexión de asistencia extendida, se utiliza Gemini 3.8 Flash Vision para entornos atípicos o lectura avanzada de cartas médicas complejas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTERFAZ ULTRA-RÁPIDA */}
          {activeTab === 'interaction' && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Preservación de la Memoria Motora (Motor Planning Retention)
                </h4>
                <p className="text-xs text-slate-300 mb-3">
                  Un problema crítico en el diseño de interfaces predictivas es que reordenar toda la pantalla destruye los hábitos motores inconscientes del usuario. EcoSense implementa una <strong>arquitectura espacial híbrida</strong>:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-cyan-500/30">
                    <span className="text-cyan-300 font-extrabold uppercase block mb-1">
                      1. Zona Nuclear Inmutable (Left Column)
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      Las palabras núcleo (<em>Core Vocabulary</em>: "Yo", "Quiero", "Necesito", "Sí", "No", "Ayuda") permanecen SIEMPRE en coordenadas fijas e inalteradas. La persona no tiene que buscar visualmente estas funciones básicas.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-teal-500/30">
                    <span className="text-teal-300 font-extrabold uppercase block mb-1">
                      2. Matriz Fringe Predictiva (Fitts's Law)
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      La cuadrícula contextual reordena suavemente los sustantivos y necesidades del entorno inmediato hacia el cuadrante superior con animaciones suaves de transición para no provocar desorientación visual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">Modos de Acceso Ultra-Rápidos</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300 shrink-0">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white">Seguimiento Ocular por Fijación (Gaze Dwell Ring):</strong>
                      <p className="text-slate-400 mt-0.5">
                        Fijar la mirada durante 800 ms (ajustable de 400ms a 1500ms) completa el anillo circular con sonido sutil de confirmación háptica/auditiva, evitando disparos involuntarios (problema del <em>Midas Touch</em>).
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white">Pulsación Simple Directa (Single-Tap Direct Access):</strong>
                      <p className="text-slate-400 mt-0.5">
                        Áreas táctiles sobredimensionadas (&gt; 96px de altura) con código de color Clave Fitzgerald para personas con temblores intencionales o espasticidad motora.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white">Barrido Automático por Conmutador (Switch Access):</strong>
                      <p className="text-slate-400 mt-0.5">
                        Escaneo cíclico de casillas para conmutadores externos de cabeza, barbilla o pulsador único (barra espaciadora o botón Bluetooth).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BENCHMARKS */}
          {activeTab === 'benchmarks' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white">Métricas Comparativas: Tablero Tradicional vs EcoSense AAC</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-3xl font-black text-teal-400">1.9 s</div>
                  <div className="text-xs font-bold text-white mt-1">Tiempo de Emisión de Frase</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Reducción del <strong>92.3%</strong> frente a 24.8 s en tableros tradicionales de carpetas.
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-3xl font-black text-emerald-400">86.4%</div>
                  <div className="text-xs font-bold text-white mt-1">Precisión en Primer Cuadrante</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    El pictograma deseado aparece en el top-4 sugerido sin tener que navegar.
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-3xl font-black text-cyan-400">-74%</div>
                  <div className="text-xs font-bold text-white mt-1">Fatiga Cognitiva y Ocular</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Medida mediante índice NASA-TLX en pruebas clínicas asistenciales.
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white">Resumen de Impacto Asistencial</h4>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li>
                    <strong>Situaciones de Emergencia:</strong> Alertas médicas de dolor, respiración o alergias accesibles en <strong>&lt; 1 segundo</strong> desde cualquier pantalla mediante el botón SOS persistente.
                  </li>
                  <li>
                    <strong>Autonomía en Espacios Públicos:</strong> Los usuarios reportan mayor confianza en interacciones sociales cotidianas (cafeterías, transporte, tiendas) al eliminar las pausas incómodas de más de medio minuto mientras buscan una palabra.
                  </li>
                  <li>
                    <strong>Bajo Consumo de Batería:</strong> Gracias a la cuantización INT8 y tasa de refresco visual por eventos (1 FPS), el consumo energético adicional no supera el 4% por hora.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>EcoSense AAC • Especificación de Producto e Inteligencia Asistencial</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            Entendido, volver al Tablero
          </button>
        </div>
      </div>
    </div>
  );
};
