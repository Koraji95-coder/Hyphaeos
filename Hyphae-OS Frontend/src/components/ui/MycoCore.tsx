import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, AlertTriangle, Cpu, Brain } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SystemEvent {
  id: string;
  type: 'alert' | 'status' | 'info';
  message: string;
  timestamp: Date;
}

const MycoCore: React.FC = () => {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const addEvent = (event: Omit<SystemEvent, 'id' | 'timestamp'>) => {
    setEvents(prev => [...prev, {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }]);
  };

  useEffect(() => {
    // Simulate system events
    const intervals = [
      setInterval(() => {
        const statusEvents = [
          `Memory optimization complete. Current usage: ${Math.floor(Math.random() * 30 + 60)}%`,
          `Neural pathway efficiency: ${Math.floor(Math.random() * 10 + 90)}%`,
          `Active nodes: ${Math.floor(Math.random() * 50 + 100)}`,
        ];
        addEvent({
          type: 'status',
          message: statusEvents[Math.floor(Math.random() * statusEvents.length)],
        });
      }, 15000),

      setInterval(() => {
        const infoEvents = [
          'Synaptic connections rebalanced for optimal performance',
          'New neural pathway established in sector gamma',
          'Quantum entanglement stabilized across neural mesh',
        ];
        addEvent({
          type: 'info',
          message: infoEvents[Math.floor(Math.random() * infoEvents.length)],
        });
      }, 25000),
    ];

    // Initial connection event
    addEvent({
      type: 'alert',
      message: `Neural link established. Device ${user?.deviceId} connected.`,
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const getEventIcon = (type: SystemEvent['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-fungal-400" />;
      case 'status':
        return <Cpu className="w-4 h-4 text-spore-400" />;
      case 'info':
        return <Brain className="w-4 h-4 text-hyphae-400" />;
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed bottom-4 right-4 w-96 bg-dark-200/90 backdrop-blur-md rounded-xl border border-hyphae-500/20 shadow-lg overflow-hidden ${
        isMinimized ? 'h-12' : 'h-96'
      }`}
    >
      <div 
        className="p-3 border-b border-hyphae-500/20 flex items-center justify-between cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center">
          <Terminal className="w-5 h-5 text-hyphae-400 mr-2" />
          <span className="text-white font-medium">MycoCore Console</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-fungal-500" />
          <div className="w-2 h-2 rounded-full bg-spore-500" />
          <div className="w-2 h-2 rounded-full bg-hyphae-500" />
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[calc(100%-3rem)]"
          >
            <div 
              ref={scrollRef}
              className="h-full overflow-y-auto p-4 font-mono text-sm space-y-3"
            >
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="mt-1">{getEventIcon(event.type)}</div>
                  <div>
                    <p className="text-gray-300">{event.message}</p>
                    <p className="text-xs text-gray-500">
                      {event.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MycoCore;