import React from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Terminal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RoleIndicator: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getRoleConfig = () => {
    switch (user.role) {
      case 'owner':
        return {
          icon: Shield,
          color: 'text-hyphae-400',
          bgColor: 'bg-hyphae-500/20',
          borderColor: 'border-hyphae-500/30',
          label: 'System Owner',
        };
      case 'admin':
        return {
          icon: User,
          color: 'text-spore-400',
          bgColor: 'bg-spore-500/20',
          borderColor: 'border-spore-500/30',
          label: 'Administrator',
        };
      case 'system':
        return {
          icon: Terminal,
          color: 'text-fungal-400',
          bgColor: 'bg-fungal-500/20',
          borderColor: 'border-fungal-500/30',
          label: 'System Agent',
        };
    }
  };

  const config = getRoleConfig();
  const Icon = config?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center px-3 py-1.5 rounded-lg ${config?.bgColor} ${config?.borderColor} border`}
    >
      {Icon && <Icon className={`w-4 h-4 ${config?.color} mr-2`} />}
      <span className={`text-sm font-medium ${config?.color}`}>
        {config?.label}
      </span>
    </motion.div>
  );
};

export default RoleIndicator;