import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Brain, Sprout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import MyceliumBackground from '../effects/MyceliumBackground';

interface LoginPanelProps {
  onSuccess: () => void;
}

const LoginPanel: React.FC<LoginPanelProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [focusedInput, setFocusedInput] = useState<'username' | 'password' | null>(null);
  
  const panelRef = useRef<HTMLDivElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        setCursorPosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Auto-focus username input on mount
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        onSuccess();
      } else {
        setError('Neural connection failed. Please verify your credentials.');
      }
    } catch (err) {
      setError('A synaptic disruption occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };

  const tendrils = Array.from({ length: 6 }).map((_, i) => ({
    rotate: (360 / 6) * i,
    delay: i * 0.1,
  }));

  return (
    <motion.div 
      className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-dark-300"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <MyceliumBackground cursorPosition={cursorPosition} />
      
      <motion.div 
        ref={panelRef}
        className="w-full max-w-md p-8 rounded-3xl bg-dark-200/40 backdrop-blur-md border border-hyphae-500/20 shadow-xl z-10 overflow-hidden"
        variants={itemVariants}
      >
        <div className="relative">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-hyphae-500/10 to-spore-500/5 rounded-3xl"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, rgba(143, 82, 255, 0.1) 0%, rgba(168, 240, 0, 0.05) 100%)',
                'radial-gradient(circle at 100% 100%, rgba(143, 82, 255, 0.1) 0%, rgba(168, 240, 0, 0.05) 100%)'
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          
          <motion.div className="text-center mb-8 relative" variants={itemVariants}>
            <div className="relative inline-block">
              <motion.div 
                className="w-24 h-24 rounded-full bg-hyphae-500/10 flex items-center justify-center"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Brain className="w-12 h-12 text-hyphae-400" />
                
                {tendrils.map((tendril, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ rotate: tendril.rotate }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      delay: tendril.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div 
                      className="absolute top-1/2 left-1/2 w-1 h-16 origin-bottom"
                      style={{
                        background: 'linear-gradient(to top, rgba(168, 240, 0, 0.3), transparent)',
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 mt-4 flex items-center justify-center gap-2">
              <Sprout className="w-6 h-6 text-green-400" />
              HyphaeOS
            </h1>

            <p className="text-hyphae-300/70">Mycelial Intelligence Network</p>
          </motion.div>

          {error && (
            <motion.div 
              className="p-4 mb-6 rounded-xl bg-fungal-500/10 border border-fungal-500/20 text-fungal-300 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            <motion.div className="space-y-5" variants={itemVariants}>
              <div className="relative group">
                <motion.div
                  className="absolute inset-0 bg-hyphae-500/5 rounded-xl"
                  animate={focusedInput === 'username' ? {
                    boxShadow: [
                      'inset 0 0 20px rgba(143, 82, 255, 0.1)',
                      'inset 0 0 30px rgba(143, 82, 255, 0.2)',
                      'inset 0 0 20px rgba(143, 82, 255, 0.1)',
                    ],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <input
                  ref={usernameRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Neural ID"
                  className="w-full px-6 py-4 bg-transparent border border-hyphae-500/20 rounded-xl focus:ring-2 focus:ring-hyphae-500/30 focus:border-hyphae-500/50 focus:outline-none transition-all text-white placeholder-hyphae-300/50"
                  required
                />
              </div>

              <div className="relative group">
                <motion.div
                  className="absolute inset-0 bg-hyphae-500/5 rounded-xl"
                  animate={focusedInput === 'password' ? {
                    boxShadow: [
                      'inset 0 0 20px rgba(143, 82, 255, 0.1)',
                      'inset 0 0 30px rgba(143, 82, 255, 0.2)',
                      'inset 0 0 20px rgba(143, 82, 255, 0.1)',
                    ],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Synaptic Key"
                  className="w-full px-6 py-4 bg-transparent border border-hyphae-500/20 rounded-xl focus:ring-2 focus:ring-hyphae-500/30 focus:border-hyphae-500/50 focus:outline-none transition-all text-white placeholder-hyphae-300/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-hyphae-300/50 hover:text-hyphae-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div className="mt-8" variants={itemVariants}>
              <Button
                type="submit"
                isLoading={isLoading}
                fullWidth
                className="bg-gradient-to-r from-hyphae-500 to-spore-500 hover:from-hyphae-600 hover:to-spore-600"
              >
                Initialize Neural Link
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPanel;