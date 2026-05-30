import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send } from 'lucide-react';

interface VoiceRecorderProps {
  onResult: (transcript: string, voiceData?: string) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onResult,
  isRecording,
  setIsRecording
}) => {
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [audioData, setAudioData] = useState<string | null>(null);
  const [toneResult, setToneResult] = useState<{ mood: string; intensity: number; confidence: number; pitchHz: number | null; volumeRms: number | null } | null>(null);
  const [liveTone, setLiveTone] = useState<{ mood: string; intensity: number; confidence: number; pitchHz: number | null; volumeRms: number | null } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const muteGainRef = useRef<GainNode | null>(null);
  const pcmBuffersRef = useRef<Float32Array[]>([]);
  const sampleRateRef = useRef<number>(44100);
  const rafIdRef = useRef<number | null>(null);
  const pitchHistoryRef = useRef<number[]>([]);
  const rmsHistoryRef = useRef<number[]>([]);
  const pendingTranscriptRef = useRef<string>('');
  const HISTORY_SIZE = 60; // ~1s at 60fps

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
    }

    // Check if audio recording is supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          // Permission granted and audio recording is supported
        })
        .catch(() => {
          // Permission denied or audio recording not supported
        });
    }
  }, []);

  const startRecording = () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    // Check for internet connection before starting
    if (!navigator.onLine) {
      setError('No internet connection detected. Please check your network and try again.');
      return;
    }

    setError('');
    setTranscript('');
    setIsRecording(true);
    setAudioData(null);
    audioChunksRef.current = [];

    // Start audio recording for mood analysis
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          // Stop live tone analysis loop when recording ends
          stopLiveAnalysis();

          // Prefer PCM-captured buffers to create a proper WAV
          let audioBlob: Blob | null = null;
          if (pcmBuffersRef.current.length > 0) {
            try {
              audioBlob = encodeWAVFromFloat32(pcmBuffersRef.current, sampleRateRef.current);
            } catch (e) {
              console.warn('Failed to encode WAV from PCM, falling back to recorder chunks', e);
            }
          }
          if (!audioBlob) {
            audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          }
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setAudioData(base64data);
            const finalTranscript = (pendingTranscriptRef.current || transcript || '').trim();
            try {
              onResult(finalTranscript, base64data);
            } catch (e) {
              console.warn('onResult dispatch failed', e);
            } finally {
              pendingTranscriptRef.current = '';
            }
          };

          // Perform voice tone analysis (non-blocking for result dispatch)
          analyzeAudioTone(audioBlob)
            .then(res => setToneResult(res))
            .catch(err => {
              console.error('Tone analysis failed:', err);
              setToneResult(null);
            });
        };

        mediaRecorder.start();
        // Start real-time tone analysis while recording
        startLiveAnalysis(stream);
      })
      .catch(error => {
        console.error("Error accessing microphone:", error);
        setError('Could not access microphone for voice analysis');
      });

    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      // Set a timeout to handle cases where the recognition doesn't start properly
      const timeoutId = setTimeout(() => {
        if (isRecording) {
          setError('Speech recognition timed out. Please try again.');
          setIsRecording(false);
          try {
            recognition.abort();
          } catch (e) {
            console.error('Error aborting recognition:', e);
          }
        }
      }, 120000); // 120 second timeout

      recognition.onstart = () => {
        console.log('Speech recognition started');
      };

      recognition.onresult = (event: any) => {
        clearTimeout(timeoutId);
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        pendingTranscriptRef.current = transcript;

        // Stop the media recorder to process the audio data
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        } else {
          // If recorder already inactive, dispatch result immediately (no audio)
          try {
            onResult(transcript, undefined);
          } catch { }
        }
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        clearTimeout(timeoutId);
        console.error('Speech recognition error:', event.error);

        if (event.error === 'network') {
          setError('Please check your internet connection and try again.');
        } else if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access and try again.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please speak more clearly and try again.');
        } else if (event.error === 'aborted') {
          setError('Speech recognition was aborted. Please try again.');
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }

        setIsRecording(false);
      };

      recognition.onend = () => {
        clearTimeout(timeoutId);
        setIsRecording(false);
        // Stop live tone analysis if running
        stopLiveAnalysis();
      };

      recognition.start();
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      setError('Failed to start speech recognition. Please try again.');
      setIsRecording(false);
    }
  };

  // Simple audio tone analysis using Web Audio API
  async function analyzeAudioTone(blob: Blob): Promise<{ mood: string; intensity: number; confidence: number; pitchHz: number | null; volumeRms: number | null }> {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const sampleRate = audioBuffer.sampleRate;
    const channelData = audioBuffer.getChannelData(0);

    // Sample multiple windows across the buffer to get robust metrics
    const windows = 6;
    const windowSize = Math.min(4096, Math.floor(channelData.length / windows));
    const pitches: number[] = [];
    const rmss: number[] = [];
    for (let w = 0; w < windows; w++) {
      const start = w * windowSize;
      const end = Math.min(channelData.length, start + windowSize);
      const frame = channelData.slice(start, end);
      // RMS for this frame
      let sumSq = 0;
      for (let i = 0; i < frame.length; i++) sumSq += frame[i] * frame[i];
      const frameRms = Math.sqrt(sumSq / frame.length);
      rmss.push(frameRms);
      // Pitch for this frame
      const framePitch = estimatePitchAutocorrelation(frame, sampleRate);
      if (framePitch) pitches.push(framePitch);
    }
    const avgRms = rmss.length ? rmss.reduce((a, b) => a + b, 0) / rmss.length : 0;
    const avgPitch = pitches.length ? pitches.reduce((a, b) => a + b, 0) / pitches.length : null;
    const stdRms = rmss.length ? Math.sqrt(rmss.reduce((a, b) => a + (b - avgRms) * (b - avgRms), 0) / rmss.length) : 0;
    const stdPitch = pitches.length && avgPitch ? Math.sqrt(pitches.reduce((a, b) => a + (b - avgPitch) * (b - avgPitch), 0) / pitches.length) : null;

    // Heuristic mood mapping combining tone and transcript hints
    const t = (transcript || '').toLowerCase();
    let mood = 'neutral';
    let intensity = 50;

    const highPitch = (avgPitch ?? 0) > 240;
    const lowPitch = (avgPitch ?? 0) > 0 && (avgPitch ?? 0) < 115;
    const highVolume = avgRms > 0.05;
    const lowVolume = avgRms < 0.025;

    const hasWork = t.includes('work') || t.includes('works') || t.includes('worked') || t.includes('working') || t.includes('busy') || t.includes('tasks') || t.includes('deadline');

    if (t.includes('stressed') || t.includes('anxious') || t.includes('nervous')) {
      mood = 'anxious';
      intensity = Math.min(90, Math.round((highPitch ? 80 : 60) + (highVolume ? 10 : 0)));
    } else if (t.includes('sad') || t.includes('down') || t.includes('depressed')) {
      mood = 'sad';
      intensity = Math.min(85, Math.round((lowPitch ? 70 : 50) + (lowVolume ? 10 : 0)));
    } else if (t.includes('happy') || t.includes('excited') || t.includes('great') || t.includes('good')) {
      mood = 'happy';
      intensity = Math.min(90, Math.round((highPitch ? 75 : 65) + (highVolume ? 10 : 0)));
    } else if (hasWork) {
      // Work-related cues: use tone to decide stressed vs tired
      if (highVolume || (stdRms ?? 0) > 0.01) {
        mood = 'stressed'; intensity = 72;
      } else if (lowPitch || lowVolume) {
        mood = 'tired'; intensity = 55;
      }
    } else {
      // Tone-only inference with variability
      const highVariability = (stdRms ?? 0) > 0.01 || (stdPitch ?? 0) > 25;
      const lowVariability = (stdRms ?? 0) < 0.006 && (stdPitch ?? 0) < 15;

      if (highVolume && (highPitch || !lowPitch) && highVariability) {
        mood = 'stressed'; intensity = 75;
      } else if (lowPitch && lowVolume && lowVariability) {
        mood = 'peaceful'; intensity = 55;
      } else if (highPitch && !highVolume && !lowVolume && (highVariability || !lowVariability)) {
        mood = 'worried'; intensity = 60;
      } else if (highPitch && highVolume && highVariability) {
        mood = 'excited'; intensity = 72;
      } else if (highVolume && !highPitch && highVariability) {
        mood = 'angry'; intensity = 70;
      } else if (lowVolume && lowVariability && !lowPitch) {
        mood = 'relaxed'; intensity = 55;
      } else if (lowPitch && !lowVolume && lowVariability) {
        mood = 'tired'; intensity = 50;
      } else if (lowVolume && lowVariability) {
        mood = 'bored'; intensity = 45;
      } else if (!lowVolume && !highVolume && lowVariability) {
        mood = 'confident'; intensity = 60;
      } else if ((avgPitch ?? 0) >= 150 && (avgPitch ?? 0) <= 220 && avgRms >= 0.02 && avgRms <= 0.04 && lowVariability) {
        mood = 'calm'; intensity = 55;
      } else {
        // Anti-neutral fallback: prefer calm/bored depending on volume
        if (avgRms < 0.028) { mood = 'bored'; intensity = 45; }
        else { mood = 'calm'; intensity = 55; }
      }
    }

    const confidence = Math.round(Math.min(90, Math.max(35,
      ((avgPitch ? 20 : 0) + (highVolume || lowVolume ? 20 : 10) + ((stdRms ?? 0) > 0.01 ? 10 : 0))
    )));

    try { audioContext.close(); } catch { }

    return {
      mood,
      intensity,
      confidence,
      pitchHz: avgPitch || null,
      volumeRms: avgRms || null
    };
  }

  function estimatePitchAutocorrelation(frame: Float32Array, sampleRate: number): number | null {
    const n = frame.length;
    const autocorr = new Float32Array(n);
    for (let lag = 0; lag < n; lag++) {
      let sum = 0;
      for (let i = 0; i < n - lag; i++) {
        sum += frame[i] * frame[i + lag];
      }
      autocorr[lag] = sum;
    }
    let peakLag = -1;
    let peakVal = 0;
    for (let lag = Math.floor(sampleRate / 400); lag < Math.floor(sampleRate / 60); lag++) {
      const val = autocorr[lag];
      if (val > peakVal) {
        peakVal = val;
        peakLag = lag;
      }
    }
    if (peakLag > 0) {
      return sampleRate / peakLag;
    }
    return null;
  }

  // Real-time analysis helpers
  function computeRMS(data: Float32Array): number {
    let sumSq = 0;
    for (let i = 0; i < data.length; i++) sumSq += data[i] * data[i];
    return Math.sqrt(sumSq / data.length);
  }

  function mapToneToMood(pitchHz: number | null, rms: number, t: string, stats?: { avgPitch: number | null; avgRms: number; stdPitch: number | null; stdRms: number }): { mood: string; intensity: number; confidence: number } {
    const lower = (t || '').toLowerCase();
    let mood = 'neutral';
    let intensity = 50;
    const avgPitch = stats?.avgPitch ?? pitchHz ?? null;
    const avgRms = stats?.avgRms ?? rms;
    const stdPitch = stats?.stdPitch ?? null;
    const stdRms = stats?.stdRms ?? 0;
    const highPitch = (avgPitch ?? 0) > 240;
    const lowPitch = (avgPitch ?? 0) > 0 && (avgPitch ?? 0) < 115;
    const highVolume = avgRms > 0.05;
    const lowVolume = avgRms < 0.025;
    const highVariability = (stdRms ?? 0) > 0.01 || (stdPitch ?? 0) > 25;
    const lowVariability = (stdRms ?? 0) < 0.006 && (stdPitch ?? 0) < 15;

    const hasPos = lower.includes('happy') || lower.includes('great') || lower.includes('good') || lower.includes('excited') || lower.includes('wonderful') || lower.includes('joy');
    const hasSad = lower.includes('sad') || lower.includes('down') || lower.includes('depressed') || lower.includes('lonely');
    const hasStress = lower.includes('stressed') || lower.includes('anxious') || lower.includes('nervous');
    const hasAnger = lower.includes('angry') || lower.includes('mad') || lower.includes('irritated') || lower.includes('upset') || lower.includes('frustrated');
    const hasWorry = lower.includes('worried') || lower.includes('worry') || lower.includes('concerned') || lower.includes('uneasy');
    const hasPeace = lower.includes('peaceful') || lower.includes('serene') || lower.includes('tranquil');
    const hasWork = lower.includes('work') || lower.includes('works') || lower.includes('worked') || lower.includes('working') || lower.includes('busy') || lower.includes('tasks') || lower.includes('deadline');

    if (hasStress) {
      mood = lower.includes('stressed') ? 'stressed' : 'anxious';
      intensity = Math.min(90, Math.round((highPitch ? 80 : 60) + (highVolume ? 10 : 0)));
    } else if (hasSad) {
      mood = 'sad';
      intensity = Math.min(85, Math.round((lowPitch ? 70 : 50) + (lowVolume ? 10 : 0)));
    } else if (hasPos) {
      mood = 'happy';
      intensity = Math.min(90, Math.round((highPitch ? 75 : 65) + (highVolume ? 10 : 0)));
    } else if (hasAnger) {
      mood = 'angry';
      intensity = Math.min(90, Math.round((highVolume ? 75 : 65) + (highVariability ? 10 : 0)));
    } else if (hasWorry) {
      mood = 'worried';
      intensity = Math.min(85, Math.round((highPitch ? 70 : 60) + (!highVolume ? 5 : 0)));
    } else if (hasPeace) {
      mood = 'peaceful';
      intensity = 55;
    } else if (hasWork) {
      if (highVolume || highVariability) { mood = 'stressed'; intensity = 72; }
      else if (lowPitch || lowVolume) { mood = 'tired'; intensity = 55; }
    } else {
      if (highVolume && (highPitch || !lowPitch) && highVariability) {
        mood = 'stressed'; intensity = 75;
      } else if (lowPitch && lowVolume && lowVariability) {
        mood = 'peaceful'; intensity = 55;
      } else if (highPitch && !highVolume && !lowVolume && (highVariability || !lowVariability)) {
        mood = 'worried'; intensity = 60;
      } else if (highPitch && highVolume && highVariability) {
        mood = 'excited'; intensity = 72;
      } else if (highVolume && !highPitch && highVariability) {
        mood = 'angry'; intensity = 70;
      } else if (lowPitch && !lowVolume && lowVariability) {
        mood = 'tired'; intensity = 50;
      } else if (lowVolume && lowVariability) {
        mood = 'bored'; intensity = 45;
      } else if (!lowVolume && !highVolume && lowVariability) {
        mood = 'confident'; intensity = 60;
      } else if (lowVolume && !lowPitch && lowVariability) {
        mood = 'relaxed'; intensity = 55;
      } else if (lowPitch && lowVolume) {
        mood = 'calm'; intensity = 55;
      } else if ((avgPitch ?? 0) >= 150 && (avgPitch ?? 0) <= 220 && avgRms >= 0.02 && avgRms <= 0.04 && lowVariability) {
        mood = 'calm'; intensity = 55;
      } else {
        // Anti-neutral fallback
        if (avgRms < 0.028) { mood = 'bored'; intensity = 45; }
        else { mood = 'calm'; intensity = 55; }
      }
    }
    const confidence = Math.round(Math.min(90, Math.max(35,
      ((avgPitch ? 20 : 0) + (highVolume || lowVolume ? 20 : 10) + (highVariability ? 10 : 0))
    )));
    return { mood, intensity, confidence };
  }

  function startLiveAnalysis(stream: MediaStream) {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      sampleRateRef.current = ctx.sampleRate || 44100;
      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      source.connect(analyser);

      // Capture raw PCM using ScriptProcessor (deprecated but widely supported)
      try {
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;
        const muteGain = ctx.createGain();
        muteGain.gain.value = 0; // prevent playback/echo
        muteGainRef.current = muteGain;

        source.connect(processor);
        processor.connect(muteGain);
        muteGain.connect(ctx.destination);

        pcmBuffersRef.current = [];
        processor.onaudioprocess = (e: AudioProcessingEvent) => {
          const input = e.inputBuffer.getChannelData(0);
          // Copy the frame to avoid holding references to the same buffer
          pcmBuffersRef.current.push(new Float32Array(input));
        };
      } catch (e) {
        console.warn('Failed to init ScriptProcessor for PCM capture', e);
      }

      const buffer = new Float32Array(analyser.fftSize);
      const loop = () => {
        if (!analyserRef.current || !audioContextRef.current) return;
        analyserRef.current.getFloatTimeDomainData(buffer);
        const rms = computeRMS(buffer);
        const pitchHz = estimatePitchAutocorrelation(buffer, audioContextRef.current.sampleRate);
        const stats = pushHistoryAndComputeStats(pitchHz ?? null, rms);
        const mapped = mapToneToMood(pitchHz, rms, transcript, stats);
        setLiveTone({ mood: mapped.mood, intensity: mapped.intensity, confidence: mapped.confidence, pitchHz: pitchHz || null, volumeRms: rms });
        rafIdRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch (e) {
      console.warn('Live analysis init failed', e);
      setLiveTone(null);
    }
  }

  function stopLiveAnalysis() {
    if (rafIdRef.current) {
      try { cancelAnimationFrame(rafIdRef.current); } catch { }
      rafIdRef.current = null;
    }
    try { audioContextRef.current?.close(); } catch { }
    analyserRef.current = null;
    sourceRef.current = null;
    try { processorRef.current?.disconnect(); } catch { }
    try { muteGainRef.current?.disconnect(); } catch { }
    processorRef.current = null;
    muteGainRef.current = null;
    audioContextRef.current = null;
    pitchHistoryRef.current = [];
    rmsHistoryRef.current = [];
  }

  // Encode Float32 PCM buffers to a mono 16-bit PCM WAV Blob
  function encodeWAVFromFloat32(buffers: Float32Array[], sampleRate: number): Blob {
    // Concatenate Float32 buffers
    const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
    const floatData = new Float32Array(totalLength);
    let offset = 0;
    for (const b of buffers) {
      floatData.set(b, offset);
      offset += b.length;
    }

    // Convert to 16-bit PCM
    const bytesPerSample = 2;
    const blockAlign = 1 * bytesPerSample; // mono
    const byteRate = sampleRate * blockAlign;
    const dataSize = floatData.length * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');
    // fmt chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // PCM chunk size
    view.setUint16(20, 1, true);  // audio format = PCM
    view.setUint16(22, 1, true);  // channels = 1
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // bits per sample
    // data chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // PCM samples
    let idx = 44;
    for (let i = 0; i < floatData.length; i++, idx += 2) {
      const s = Math.max(-1, Math.min(1, floatData[i]));
      view.setInt16(idx, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return new Blob([view], { type: 'audio/wav' });
  }

  function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  function pushHistoryAndComputeStats(pitch: number | null, rms: number): { avgPitch: number | null; avgRms: number; stdPitch: number | null; stdRms: number } {
    if (pitch && isFinite(pitch)) {
      pitchHistoryRef.current.push(pitch);
      if (pitchHistoryRef.current.length > HISTORY_SIZE) pitchHistoryRef.current.shift();
    }
    rmsHistoryRef.current.push(rms);
    if (rmsHistoryRef.current.length > HISTORY_SIZE) rmsHistoryRef.current.shift();

    const avgRms = rmsHistoryRef.current.reduce((a, b) => a + b, 0) / (rmsHistoryRef.current.length || 1);
    const stdRms = Math.sqrt(rmsHistoryRef.current.reduce((a, b) => a + (b - avgRms) * (b - avgRms), 0) / (rmsHistoryRef.current.length || 1));
    const avgPitch = pitchHistoryRef.current.length ? (pitchHistoryRef.current.reduce((a, b) => a + b, 0) / pitchHistoryRef.current.length) : null;
    const stdPitch = pitchHistoryRef.current.length && avgPitch ? Math.sqrt(pitchHistoryRef.current.reduce((a, b) => a + (b - avgPitch) * (b - avgPitch), 0) / pitchHistoryRef.current.length) : null;
    return { avgPitch, avgRms, stdPitch, stdRms };
  }

  const stopRecording = () => {
    setIsRecording(false);

    // Stop the media recorder if it's active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    // Ensure live analysis is stopped
    stopLiveAnalysis();
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto bg-white/5 rounded-lg border-2 border-dashed border-white/20 p-4">
      {!isSupported ? (
        <div className="text-center">
          <MicOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Voice recording not supported</p>
        </div>
      ) : (
        <>
          {!showTextInput ? (
            <>
              <motion.button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isRecording ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </motion.button>

              <p className="text-sm text-gray-400 mt-2">
                {isRecording ? 'Listening...' : 'Click to speak'}
              </p>

              {transcript && (
                <div className="mt-2 p-2 bg-white/10 rounded border border-white/10 text-sm text-gray-300 max-w-xs">
                  "{transcript}"
                </div>
              )}

              {isRecording && liveTone && (
                <div className="mt-2 p-2 rounded border border-white/10 text-sm max-w-xs bg-white/5">
                  <div className="font-medium text-white">Live tone: <span className="capitalize">{liveTone.mood}</span></div>
                  <div className="text-gray-400">Intensity: {liveTone.intensity}% · Confidence: {liveTone.confidence}%</div>
                  <div className="text-gray-500">Pitch: {liveTone.pitchHz ? `${Math.round(liveTone.pitchHz)} Hz` : '—'} · Volume: {liveTone.volumeRms ? liveTone.volumeRms.toFixed(3) : '—'}</div>
                </div>
              )}

              {/* Final tone summary intentionally removed per request */}

              {error && (
                <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-sm text-red-300 max-w-xs">
                  {error}
                  <button
                    onClick={() => setShowTextInput(true)}
                    className="ml-2 text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Use text input instead
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full">
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your mood here..."
                  className="flex-1 p-2 bg-white/5 border border-white/20 text-white rounded-l focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && textInput.trim()) {
                      onResult(textInput);
                      setTextInput('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (textInput.trim()) {
                      onResult(textInput);
                      setTextInput('');
                    }
                  }}
                  className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-r"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => {
                    setShowTextInput(false);
                    setError('');
                  }}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Back to voice
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VoiceRecorder;
