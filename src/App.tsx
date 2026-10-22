/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Pictogram,
  ContextState,
  UserPreferences,
  PredictedPhrase,
  FitzgeraldCategory,
} from './types/aac';
import {
  CORE_PICTOGRAMS,
  INITIAL_FRINGE_PICTOGRAMS,
  CONTEXT_PRESETS,
} from './data/initialPictograms';
import { Header } from './components/Header';
import { SentenceStrip } from './components/SentenceStrip';
import { PredictivePhraseBar } from './components/PredictivePhraseBar';
import { ContextCameraPanel } from './components/ContextCameraPanel';
import { AACBoard } from './components/AACBoard';
import { ArchitectureSpecModal } from './components/ArchitectureSpecModal';
import { EmergencyModal } from './components/EmergencyModal';
import { SettingsModal } from './components/SettingsModal';
import { speechService } from './services/speechService';

export default function App() {
  // User accessibility preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    inputMode: 'gaze', // Default to eye tracking simulation / dwell click
    dwellTimeMs: 800,
    highContrast: false,
    soundFeedback: true,
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    preferredVoice: 'auto',
    useGeminiTTS: false,
    privacyOnDeviceOnly: true,
  });

  // Multimodal sensory context state (Default: Cafeteria)
  const defaultPreset = CONTEXT_PRESETS[0];
  const [context, setContext] = useState<ContextState>({
    venue: defaultPreset.venue,
    category: 'cafeteria',
    detectedObjects: defaultPreset.objects,
    lighting: defaultPreset.lighting,
    noiseLevelDb: defaultPreset.noiseDb,
    timeOfDay: defaultPreset.time,
    emergencyRisk: defaultPreset.emergencyRisk,
    gpsCoordinates: defaultPreset.gps,
    gpsAddress: defaultPreset.address,
    cameraActive: false,
    usingRealWebcam: false,
    lastAnalysisLatencyMs: 42,
    engineUsed: 'On-Device NPU',
  });

  // Pictograms data
  const [corePictograms] = useState<Pictogram[]>(CORE_PICTOGRAMS);
  const [fringePictograms, setFringePictograms] = useState<Pictogram[]>(() => {
    // Reorder fringe initially by cafeteria priority
    const priority = defaultPreset.fringeIdsPriority;
    return [...INITIAL_FRINGE_PICTOGRAMS].sort((a, b) => {
      const idxA = priority.indexOf(a.id);
      const idxB = priority.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  });

  // Predictive rapid phrases (One-tap / Zero-navigation communication)
  const [predictedPhrases, setPredictedPhrases] = useState<PredictedPhrase[]>(
    defaultPreset.predictedPhrases
  );

  // Communication sentence builder strip
  const [selectedSymbols, setSelectedSymbols] = useState<Pictogram[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<FitzgeraldCategory | 'all'>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Modals state
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Switch context preset (Cafeteria, Hospital, Supermarket, Transport, Home)
  const applyContextPreset = (presetId: string) => {
    const preset = CONTEXT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setContext((prev) => ({
      ...prev,
      venue: preset.venue,
      category: preset.id as any,
      detectedObjects: preset.objects,
      lighting: preset.lighting,
      noiseLevelDb: preset.noiseDb,
      timeOfDay: preset.time,
      emergencyRisk: preset.emergencyRisk,
      gpsCoordinates: preset.gps,
      gpsAddress: preset.address,
      lastAnalysisLatencyMs: Math.floor(Math.random() * 20) + 35,
      engineUsed: 'On-Device NPU',
    }));

    setPredictedPhrases(preset.predictedPhrases);

    // Dynamic reordering of fringe vocabulary to minimize travel distance (Fitts's Law)
    const priority = preset.fringeIdsPriority;
    setFringePictograms((prev) => {
      return [...prev].sort((a, b) => {
        const idxA = priority.indexOf(a.id);
        const idxB = priority.indexOf(b.id);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
      });
    });

    if (preferences.soundFeedback) {
      speechService.playHapticBeep('select');
    }
  };

  // Run AI scene analysis (Webcam frame or simulated context trigger)
  const handleRunAiAnalysis = async (imageBase64?: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType: 'image/jpeg',
          venueContext: context.venue,
          coordinates: context.gpsCoordinates,
          ambientData: {
            noise: `${context.noiseLevelDb} dB`,
            time: context.timeOfDay,
          },
          processingMode: preferences.privacyOnDeviceOnly ? 'on-device' : 'cloud',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data;

        if (data) {
          setContext((prev) => ({
            ...prev,
            venue: data.detectedVenue || prev.venue,
            detectedObjects: data.detectedObjects || prev.detectedObjects,
            emergencyRisk: Boolean(data.emergencyPotential),
            lastAnalysisLatencyMs: result.latencyMs || 45,
            engineUsed: result.source?.includes('Gemini')
              ? 'Gemini 3.8 Flash Vision'
              : 'On-Device NPU',
          }));

          if (data.predictedPhrases && data.predictedPhrases.length > 0) {
            setPredictedPhrases(
              data.predictedPhrases.map((p: any, i: number) => ({
                id: `ai-p-${i}`,
                phrase: p.phrase,
                category: p.category || 'General',
                urgency: p.urgency || 'normal',
                confidence: p.confidence || 0.9,
              }))
            );
          }
        }
      }
    } catch (err) {
      console.warn('AI analysis error, fallback maintained:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Select a pictogram card
  const handleSelectPictogram = (pic: Pictogram) => {
    setSelectedSymbols((prev) => [...prev, pic]);
    // Single word audio preview if in tap/gaze mode
    speechService.speak(pic.audioVoiceText || pic.label, {
      speed: preferences.voiceSpeed,
      pitch: preferences.voicePitch,
      useGeminiTTS: preferences.useGeminiTTS,
    });
  };

  const handleRemoveLast = () => {
    setSelectedSymbols((prev) => prev.slice(0, -1));
  };

  const handleClearAll = () => {
    setSelectedSymbols([]);
  };

  const handlePhraseSpoken = (phrase: string) => {
    // Add words to sentence strip or preview
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        preferences.highContrast ? 'bg-black text-white' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Header bar */}
      <Header
        preferences={preferences}
        context={context}
        onOpenSpecModal={() => setIsSpecModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      {/* Sentence Strip (Central AAC accumulator & speech engine) */}
      <SentenceStrip
        selectedSymbols={selectedSymbols}
        onRemoveLast={handleRemoveLast}
        onClearAll={handleClearAll}
        userPreferences={preferences}
      />

      {/* One-Tap Predictive Phrase Bar (Solves the folder traversal problem) */}
      <PredictivePhraseBar
        phrases={predictedPhrases}
        inputMode={preferences.inputMode}
        dwellTimeMs={preferences.dwellTimeMs}
        soundFeedback={preferences.soundFeedback}
        onPhraseSpoken={handlePhraseSpoken}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-5">
        {/* Multimodal Sensory Context Panel (Camera & Geolocation) */}
        <ContextCameraPanel
          context={context}
          onUpdateContext={(updates) => setContext((prev) => ({ ...prev, ...updates }))}
          onApplyContextPreset={applyContextPreset}
          onRunAiAnalysis={handleRunAiAnalysis}
          isAnalyzing={isAnalyzing}
          userPreferences={preferences}
        />

        {/* AAC Board (Core Vocabulary Anchor + Dynamic Predictive Grid) */}
        <AACBoard
          corePictograms={corePictograms}
          fringePictograms={fringePictograms}
          selectedCategoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          onSelectPictogram={handleSelectPictogram}
          userPreferences={preferences}
          onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        />
      </main>

      {/* Footer Informative Note */}
      <footer className="bg-slate-950 border-t border-slate-900 py-3 px-4 text-center text-xs text-slate-500">
        <p>
          EcoSense AAC — Sistema de Comunicación Aumentativa y Adaptativa con IA Multimodal On-Device
          y Preservación de Memoria Motora.
        </p>
      </footer>

      {/* Product Specification & System Architecture Modal */}
      <ArchitectureSpecModal
        isOpen={isSpecModalOpen}
        onClose={() => setIsSpecModalOpen(false)}
      />

      {/* Emergency SOS Medical Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* User Accessibility Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        preferences={preferences}
        onUpdatePreferences={(updates) => setPreferences((prev) => ({ ...prev, ...updates }))}
      />
    </div>
  );
}
