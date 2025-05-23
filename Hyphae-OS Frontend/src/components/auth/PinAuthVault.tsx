import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ParticleBackground from '../ui/ParticleBackground';
import Button from '../ui/Button';

interface PinAuthVaultProps {
  onSuccess: () => void;
  onBack: () => void;
}

const PinAuthVault: React.FC<PinAuthVaultProps> = ({ onSuccess, onBack }) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const { verifyPin, user } = useAuth();

  useEffect(() => {
    // Check if pin is complete (all digits filled)
    const isComplete = pin.every(digit => digit !== '');
    if (isComplete) {
      handleVerify();
    }
  }, [pin]);

  const handleDigitChange = (index: number, value: string) => {
    if (value === '' || /^[0-9]$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      
      // Move to next input if value is entered
      if (value !== '' && index < 3) {
        setActiveIndex(index + 1);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      setActiveIndex(index - 1);
    }
  };

  const handleVerify = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      const pinCode = pin.join('');
      const success = await verifyPin(pinCode);
      
      if (success) {
        setIsVerified(true);
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        setError('Invalid PIN. Please try again.');
        setPin(['', '', '', '']);
        setActiveIndex(0);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };

  return (
    <motion.div 
      className="relative min-h-screen w-full flex items-center justify-center p-4"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <ParticleBackground />
      
      <motion.div 
        className="w-full max-w-md p-8 rounded-2xl bg-dark-200/80 backdrop-blur-md border border-dark-100/30 shadow-xl z-10"
        variants={itemVariants}
      >
        <motion.button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-dark-100/50 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </motion.button>
        
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div 
            className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full ${
              isVerified ? 'bg-success-500/20' : 'bg-secondary-500/20'
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {isVerified ? (
              <ShieldCheck className="w-8 h-8 text-success-400" />
            ) : (
              <Shield className="w-8 h-8 text-secondary-400" />
            )}
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">PinAuth Vault</h1>
          <p className="text-gray-400 text-sm">
            Welcome back, <span className="text-secondary-300">{user?.username || 'User'}</span>
          </p>
        </motion.div>

        {error && (
          <motion.div 
            className="p-3 mb-4 rounded-lg bg-error-500/20 text-error-300 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <motion.div className="mb-8" variants={itemVariants}>
          <p className="text-center text-gray-300 mb-6">Enter your 4-digit security PIN</p>
          
          <div className="flex justify-center space-x-4">
            {pin.map((digit, index) => (
              <motion.div
                key={index}
                className={`relative w-14 h-16 flex items-center justify-center border-2 rounded-lg ${
                  activeIndex === index
                    ? 'border-secondary-500 shadow-glow-secondary'
                    : digit
                    ? 'border-gray-500'
                    : 'border-gray-700'
                }`}
                whileTap={activeIndex === index ? { scale: 0.95 } : {}}
                animate={activeIndex === index ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="text"
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => setActiveIndex(index)}
                  maxLength={1}
                  className="w-full h-full bg-transparent text-center text-xl font-bold text-white focus:outline-none"
                  autoFocus={index === 0}
                />
                {digit && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    •
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="mt-6" variants={itemVariants}>
          <Button
            type="button"
            onClick={handleVerify}
            isLoading={isLoading}
            disabled={!pin.every(digit => digit !== '')}
            fullWidth
          >
            {isVerified ? "Authenticated" : "Verify PIN"}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PinAuthVault;