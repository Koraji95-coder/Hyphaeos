import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { voiceControlService } from '@/services/voiceControl';

interface VoiceControlProps {
  onLayoutChange?: (layout: string) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onLayoutChange }) => {
  const { isListening, startListening, stopListening } = useVoiceControl();

  useEffect(() => {
    // Register voice commands
    voiceControlService.registerCommand('switch layout', () => {
      onLayoutChange?.('default');
    });
    voiceControlService.registerCommand('dark mode', () => {
      // Toggle dark mode
    });
    voiceControlService.registerCommand('show weather', () => {
      // Show weather widget
    });
  }, [onLayoutChange]);

  return (
    <motion.button
      className={`fixed bottom-4 right-4 p-3 rounded-full ${
        isListening ? 'bg-hyphae-500' : 'bg-dark-200'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => isListening ? stopListening() : startListening()}
    >
      {isListening ? (
        <Mic className="w-6 h-6 text-white" />
      ) : (
        <MicOff className="w-6 h-6 text-gray-400" />
      )}
    </motion.button>
  );
};

export default VoiceControl;