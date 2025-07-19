import { useState, useRef, useCallback } from "react";
import { useApp } from "@/contexts/AppContext";
import { generateId } from "@/contexts/AppContext";

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  error: string | null;
  audioLevel: number;
}

export function useVoiceRecording(): UseVoiceRecordingReturn {
  const { state, dispatch } = useApp();
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      audioStreamRef.current = stream;

      // Set up audio analysis for visualization
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Start audio level monitoring
      monitorAudioLevel();

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      dispatch({ type: "SET_RECORDING", payload: true });

      // Start duration timer
      setDuration(0);
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 0.1);
      }, 100);

      // Add notification
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: generateId(),
          title: "Recording Started",
          message: "Voice recording is now active",
          type: "success",
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start recording";
      setError(errorMessage);

      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: generateId(),
          title: "Recording Error",
          message: errorMessage,
          type: "error",
          timestamp: new Date().toISOString(),
        },
      });
    }
  }, [dispatch]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !state.isRecording) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm;codecs=opus",
        });

        // Save recording to context
        const recording = {
          id: generateId(),
          blob,
          duration,
          timestamp: new Date().toISOString(),
        };

        dispatch({ type: "ADD_VOICE_RECORDING", payload: recording });

        // Add notification
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: generateId(),
            title: "Recording Saved",
            message: `Voice recording (${duration.toFixed(1)}s) saved successfully`,
            type: "success",
            timestamp: new Date().toISOString(),
          },
        });

        resolve(blob);
      };

      mediaRecorderRef.current.stop();

      // Clean up
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      dispatch({ type: "SET_RECORDING", payload: false });
      setDuration(0);
      setAudioLevel(0);
    });
  }, [state.isRecording, duration, dispatch]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
  }, [state.isRecording]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Resume duration timer
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 0.1);
      }, 100);
    }
  }, [isPaused]);

  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const updateLevel = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average volume
      const average =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalizedLevel = average / 255;

      setAudioLevel(normalizedLevel);

      if (state.isRecording && !isPaused) {
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      }
    };

    updateLevel();
  }, [state.isRecording, isPaused]);

  return {
    isRecording: state.isRecording,
    isPaused,
    duration,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    error,
    audioLevel,
  };
}

// Utility function to convert audio blob to URL for playback
export function createAudioURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

// Utility function to download audio recording
export function downloadRecording(
  blob: Blob,
  filename: string = "voice-recording.webm",
) {
  const url = createAudioURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Simulate speech-to-text transcription
export async function transcribeAudio(blob: Blob): Promise<string> {
  // In a real app, this would call a speech-to-text API
  return new Promise((resolve) => {
    setTimeout(() => {
      const sampleTranscriptions = [
        "नमस्ते, मैं coding सीखना चाहता हूं",
        "Hello, I want to learn web development",
        "मुझे JavaScript में help चाहिए",
        "Can you help me with React components?",
        "मैं mobile app development में interested हूं",
        "I want to understand data structures better",
      ];

      const randomTranscription =
        sampleTranscriptions[
          Math.floor(Math.random() * sampleTranscriptions.length)
        ];

      resolve(randomTranscription);
    }, 1500); // Simulate processing time
  });
}
