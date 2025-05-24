import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

class VoiceControlService {
  private static instance: VoiceControlService;
  private commands: Map<string, () => void>;

  private constructor() {
    this.commands = new Map();
  }

  static getInstance(): VoiceControlService {
    if (!VoiceControlService.instance) {
      VoiceControlService.instance = new VoiceControlService();
    }
    return VoiceControlService.instance;
  }

  registerCommand(phrase: string, action: () => void) {
    this.commands.set(phrase.toLowerCase(), action);
  }

  handleCommand(transcript: string) {
    const command = transcript.toLowerCase();
    for (const [phrase, action] of this.commands.entries()) {
      if (command.includes(phrase)) {
        action();
        break;
      }
    }
  }

  startListening() {
    if (SpeechRecognition.browserSupportsSpeechRecognition()) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      console.error('Speech recognition not supported');
    }
  }

  stopListening() {
    SpeechRecognition.stopListening();
  }
}

export const voiceControlService = VoiceControlService.getInstance();