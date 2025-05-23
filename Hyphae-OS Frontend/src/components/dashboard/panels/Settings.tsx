import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Zap, 
  HelpCircle,
  Cloud,
  Package,
  LogOut
} from 'lucide-react';
import Button from '../../ui/Button';

interface SettingsProps {
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('account');
  
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

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
    { id: 'performance', label: 'Performance', icon: <Zap size={18} /> },
    { id: 'plugins', label: 'Plugins', icon: <Package size={18} /> },
    { id: 'cloud', label: 'Cloud Sync', icon: <Cloud size={18} /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle size={18} /> },
  ];

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
          System Settings
        </motion.h1>
        <motion.p 
          className="text-gray-400"
          variants={itemVariants}
        >
          Configure HyphaeOS system preferences and account settings
        </motion.p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="lg:col-span-1"
          variants={itemVariants}
        >
          <div className="bg-dark-200/80 backdrop-blur-sm rounded-xl border border-dark-100/50 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-dark-100/50">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <SettingsIcon size={18} className="mr-2 text-primary-400" />
                Settings
              </h2>
            </div>
            
            <div className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-500/20 text-primary-300'
                        : 'text-gray-400 hover:bg-dark-100/50 hover:text-white'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
              
              <div className="p-2 mt-2">
                <Button
                  variant="ghost"
                  fullWidth
                  icon={<LogOut size={18} />}
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="lg:col-span-3"
          variants={itemVariants}
        >
          <div className="bg-dark-200/80 backdrop-blur-sm rounded-xl border border-dark-100/50 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-dark-100/50">
              <h2 className="text-lg font-semibold text-white flex items-center">
                {tabs.find(tab => tab.id === activeTab)?.icon}
                <span className="ml-2">{tabs.find(tab => tab.id === activeTab)?.label} Settings</span>
              </h2>
            </div>
            
            <div className="p-6">
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="w-32 h-32 rounded-full bg-primary-500/20 flex items-center justify-center mb-4 md:mb-0 md:mr-8">
                      <User size={48} className="text-primary-400" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Admin User</h3>
                      <p className="text-gray-400 mb-4">System Administrator</p>
                      
                      <div className="flex space-x-3">
                        <Button variant="primary" size="sm">
                          Change Avatar
                        </Button>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-dark-100/50 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Username</label>
                        <input
                          type="text"
                          value="admin"
                          className="w-full px-4 py-2 bg-dark-300/70 border border-dark-100/50 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:outline-none transition-all text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                          type="email"
                          value="admin@hyphae.ai"
                          className="w-full px-4 py-2 bg-dark-300/70 border border-dark-100/50 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:outline-none transition-all text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Role</label>
                        <select className="w-full px-4 py-2 bg-dark-300/70 border border-dark-100/50 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:outline-none transition-all text-white">
                          <option>Administrator</option>
                          <option>Operator</option>
                          <option>Analyst</option>
                          <option>Viewer</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Language</label>
                        <select className="w-full px-4 py-2 bg-dark-300/70 border border-dark-100/50 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:outline-none transition-all text-white">
                          <option>English (US)</option>
                          <option>English (UK)</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                          <option>Japanese</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm text-gray-400 mb-1">Bio</label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-2 bg-dark-300/70 border border-dark-100/50 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:outline-none transition-all text-white"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button variant="ghost" className="mr-3">
                        Cancel
                      </Button>
                      <Button variant="primary">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-dark-300/70 border border-dark-100/50 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:outline-none transition-all text-white"
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-dark-300/70 border border-dark-100/50 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:outline-none transition-all text-white"
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-dark-300/70 border border-dark-100/50 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:outline-none transition-all text-white"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="primary">
                        Update Password
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t border-dark-100/50 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h3>
                    
                    <div className="p-4 rounded-lg bg-dark-300/50 border border-dark-100/30 mb-4">
                      <div className="flex items-start">
                        <div className="p-2 rounded-lg bg-warning-500/20 mr-4">
                          <Shield size={20} className="text-warning-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-1">Enable 2FA for Enhanced Security</h4>
                          <p className="text-sm text-gray-400">
                            Two-factor authentication adds an extra layer of security to your account. 
                            In addition to your password, you'll need a code from your phone.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="primary">
                      Enable Two-Factor Authentication
                    </Button>
                  </div>
                  
                  <div className="border-t border-dark-100/50 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Security Log</h3>
                    
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded-lg bg-dark-300/50 border border-dark-100/30 flex justify-between items-center"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">
                              {index === 0 ? 'Successful login' : index === 1 ? 'Password changed' : 'New device detected'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {index === 0 ? '2 hours ago' : index === 1 ? '3 days ago' : '1 week ago'} • 
                              IP: 192.168.{index + 1}.{index + 10}
                            </p>
                          </div>
                          <div>
                            <span className={`text-xs px-2 py-1 rounded-md ${
                              index === 0 
                                ? 'bg-success-500/20 text-success-300' 
                                : 'bg-primary-500/20 text-primary-300'
                            }`}>
                              {index === 0 ? 'Success' : 'Info'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="ghost" size="sm">
                        View Full Log
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab !== 'account' && activeTab !== 'security' && (
                <div className="p-6 flex flex-col items-center justify-center">
                  <div className={`p-4 rounded-full bg-${activeTab === 'plugins' ? 'secondary' : 'primary'}-500/20 mb-4`}>
                    {tabs.find(tab => tab.id === activeTab)?.icon && React.cloneElement(
                      tabs.find(tab => tab.id === activeTab)?.icon as React.ReactElement, 
                      { size: 32, className: `text-${activeTab === 'plugins' ? 'secondary' : 'primary'}-400` }
                    )}
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">
                    {tabs.find(tab => tab.id === activeTab)?.label} Settings
                  </h3>
                  <p className="text-gray-400 text-center max-w-md mb-8">
                    This settings panel is under development. Check back soon for additional configuration options.
                  </p>
                  <Button variant="primary">
                    Coming Soon
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;