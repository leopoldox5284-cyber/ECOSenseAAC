export type FitzgeraldCategory =
  | 'pronoun'      // Rosa / Magenta (Personas / Pronombres)
  | 'verb'         // Verde (Acciones / Verbos)
  | 'noun'         // Amarillo / Ámbar (Sustantivos / Cosas / Objetos)
  | 'adjective'    // Azul (Sentimientos / Cualidades / Estados)
  | 'social'       // Violeta / Púrpura (Fórmulas sociales / Cortesía)
  | 'place'        // Naranja (Lugares / Direcciones)
  | 'emergency';   // Rojo (Urgencias / Salud / Peligro)

export interface Pictogram {
  id: string;
  label: string;
  category: FitzgeraldCategory;
  iconName: string;
  isCore?: boolean;        // Vocabulario nuclear fijo (anclaje motor)
  confidence?: number;     // Confianza del motor predictivo
  suggestedReason?: string;// Razón de sugerencia (ej. "Vaso detectado por cámara")
  audioVoiceText?: string; // Texto exacto a pronunciar si difiere de label
  urgency?: 'normal' | 'alta' | 'critica';
}

export interface ContextState {
  venue: string;
  category: 'cafeteria' | 'hospital' | 'supermercado' | 'transporte' | 'casa' | 'calle';
  detectedObjects: string[];
  lighting: 'normal' | 'tenue' | 'brillante';
  noiseLevelDb: number;
  timeOfDay: 'mañana' | 'tarde' | 'noche';
  emergencyRisk: boolean;
  gpsCoordinates: { lat: number; lng: number } | null;
  gpsAddress: string;
  cameraActive: boolean;
  usingRealWebcam: boolean;
  lastAnalysisLatencyMs: number;
  engineUsed: 'On-Device NPU' | 'Gemini 3.8 Flash Vision';
}

export interface PredictedPhrase {
  id: string;
  phrase: string;
  category: string;
  urgency: 'normal' | 'alta' | 'critica';
  confidence: number;
  reason?: string;
}

export type InputMode = 'gaze' | 'tap' | 'switch';

export interface UserPreferences {
  inputMode: InputMode;
  dwellTimeMs: number;          // Tiempo de fijación ocular (ej. 800ms)
  highContrast: boolean;        // Modo CVI / bajo contraste
  soundFeedback: boolean;       // Bip auditivo en selección
  voiceSpeed: number;           // 0.8 a 1.2
  voicePitch: number;           // 0.8 a 1.2
  preferredVoice: string;       // ID de voz o 'auto'
  useGeminiTTS: boolean;        // Síntesis neuronal Gemini vs WebSpeech
  privacyOnDeviceOnly: boolean; // 100% On-Device sin llamadas cloud
}
