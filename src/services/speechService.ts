class SpeechService {
  private audioCtx: AudioContext | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play subtle feedback beep/click for dwell-gaze or button selection (AudioContext synthesizer)
  public playHapticBeep(type: 'hover' | 'select' | 'alert' | 'emergency') {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'hover') {
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'select') {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'alert') {
        osc.frequency.setValueAtTime(784, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'emergency') {
        // Dual-tone urgent alert
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(660, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      // AudioContext may be restricted before first gesture; silently ignore
    }
  }

  // Speak text using Web Speech API or Gemini Neural TTS
  public async speak(
    text: string,
    options: {
      speed?: number;
      pitch?: number;
      useGeminiTTS?: boolean;
      voiceName?: string;
    } = {}
  ): Promise<void> {
    if (!text || typeof window === 'undefined') return;

    // Stop ongoing speech
    this.stop();

    const { speed = 1.0, pitch = 1.0, useGeminiTTS = false } = options;

    if (useGeminiTTS) {
      try {
        const response = await fetch('/api/speech-synthesis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voiceName: 'Zephyr' }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.audioBase64) {
            const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
            this.currentAudioElement = new Audio(audioSrc);
            await this.currentAudioElement.play();
            return;
          }
        }
      } catch (err) {
        console.warn('Gemini TTS fallback to WebSpeech:', err);
      }
    }

    // Standard client Web Speech API
    if ('speechSynthesis' in window) {
      return new Promise((resolve) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = speed;
        utterance.pitch = pitch;

        // Try selecting an expressive Spanish voice
        const voices = window.speechSynthesis.getVoices();
        const spanishVoice = voices.find(
          (v) =>
            v.lang.startsWith('es') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Mónica') ||
              v.name.includes('Jorge') ||
              v.name.includes('Lucia'))
        ) || voices.find((v) => v.lang.startsWith('es'));

        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();

        window.speechSynthesis.speak(utterance);
      });
    }
  }

  public stop() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (this.currentAudioElement) {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
        this.currentAudioElement = null;
      }
    }
  }
}

export const speechService = new SpeechService();
