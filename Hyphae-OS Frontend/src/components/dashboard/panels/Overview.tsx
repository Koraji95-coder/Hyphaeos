import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Zap, 
  Clock, 
  ArrowUpRight, 
  Brain, 
  AlertTriangle 
} from 'lucide-react';
import StatusCard from '../../ui/StatusCard';
import RecentActivity from '../widgets/RecentActivity';
import SystemMetrics from '../widgets/SystemMetrics';

const Overview: React.FC = () => {
  // Sample data - would come from API in a real app
  const systemStatus = {
    activeAgents: 3,
    totalAgents: 5,
    memoryUsage: 72,
    cpuUsage: 48,
    uptime: '5d 12h 37m',
    activeProcesses: 8,
    pendingTasks: 2,
    warnings: 1,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <motion.div
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-2xl lg:text-3xl font-bold text-white mb-2"
          variants={itemVariants}
        >
          System Overview
        </motion.h1>
        <motion.p 
          className="text-gray-400"
          variants={itemVariants}
        >
          HyphaeOS is operating at optimal parameters
        </motion.p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatusCard 
          title="Agents Active"
          value={`${systemStatus.activeAgents}/${systemStatus.totalAgents}`}
          icon={<Users size={20} />}
          trend="up"
          trendValue="20%"
          color="primary"
          variants={itemVariants}
        />
        
        <StatusCard 
          title="Memory Usage"
          value={`${systemStatus.memoryUsage}%`}
          icon={<Brain size={20} />}
          trend="up"
          trendValue="8%"
          color="secondary"
          variants={itemVariants}
        />
        
        <StatusCard 
          title="CPU Allocation"
          value={`${systemStatus.cpuUsage}%`}
          icon={<Zap size={20} />}
          trend="down"
          trendValue="5%"
          color="accent"
          variants={itemVariants}
        />
        
        <StatusCard 
          title="System Uptime"
          value={systemStatus.uptime}
          icon={<Clock size={20} />}
          trend="stable"
          trendValue="0%"
          color="success"
          variants={itemVariants}
        />
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="lg:col-span-2"
          variants={itemVariants}
        >
          <SystemMetrics />
        </motion.div>
        
        <motion.div
          variants={itemVariants}
        >
          <RecentActivity />
        </motion.div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-dark-200/80 backdrop-blur-sm rounded-xl p-6 border border-dark-100/50 shadow-lg"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Active Processes</h2>
            <span className="bg-primary-500/20 text-primary-300 rounded-full px-2 py-1 text-xs font-medium">
              {systemStatus.activeProcesses} Running
            </span>
          </div>
          
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-dark-300/50 border border-dark-100/30"
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    index < systemStatus.activeProcesses ? 'bg-success-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="text-white font-medium">Process #{index + 1001}</p>
                    <p className="text-xs text-gray-400">Runtime: {Math.floor(Math.random() * 60)} min</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`text-xs font-medium ${
                    index < systemStatus.activeProcesses ? 'text-success-400' : 'text-gray-500'
                  }`}>
                    {index < systemStatus.activeProcesses ? 'Active' : 'Inactive'}
                  </span>
                  <button className="ml-4 p-1.5 rounded-full hover:bg-dark-100/50 text-gray-400 hover:text-white">
                    <Activity size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-dark-200/80 backdrop-blur-sm rounded-xl p-6 border border-dark-100/50 shadow-lg"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">System Alerts</h2>
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${
              systemStatus.warnings > 0 
                ? 'bg-warning-500/20 text-warning-300' 
                : 'bg-success-500/20 text-success-300'
            }`}>
              {systemStatus.warnings} Warnings
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-warning-500/10 border border-warning-500/20">
              <div className="flex items-start">
                <div className="bg-warning-500/20 p-2 rounded-lg mr-3">
                  <AlertTriangle size={18} className="text-warning-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Memory Allocation Warning</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Agent Neuroweave is using more memory than expected. Consider optimizing or reallocating resources.
                  </p>

                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">12 min ago</span>
                    <button className="ml-4 text-xs text-primary-400 hover:text-primary-300">
                      Investigate <ArrowUpRight size={12} className="inline ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-dark-300/50 border border-dark-100/30">
              <div className="flex items-start">
                <div className="bg-success-500/20 p-2 rounded-lg mr-3">
                  <Activity size={18} className="text-success-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">System Maintenance Complete</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Routine maintenance tasks completed successfully. All systems operating normally.
                  </p>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">1 hour ago</span>
                    <button className="ml-4 text-xs text-primary-400 hover:text-primary-300">
                      View Report <ArrowUpRight size={12} className="inline ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-dark-300/50 border border-dark-100/30">
              <div className="flex items-start">
                <div className="bg-secondary-500/20 p-2 rounded-lg mr-3">
                  <Brain size={18} className="text-secondary-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Model Training Complete</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Agent SporeLink has completed model training with improved accuracy of +2.7%.
                  </p>

                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">3 hours ago</span>
                    <button className="ml-4 text-xs text-primary-400 hover:text-primary-300">
                      View Details <ArrowUpRight size={12} className="inline ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Overview;