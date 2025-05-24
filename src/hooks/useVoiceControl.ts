import { useEffect } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import { voiceControlService } from '@/services/voiceControl';

export function useVoiceControl() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      voiceControlService.handleCommand(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  return {
    isListening: listening,
    startListening: voiceControlService.startListening,
    stopListening: voiceControlService.stopListening
  };
}