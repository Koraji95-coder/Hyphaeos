import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, HardDrive, Layers, RefreshCw, Plus, FolderTree } from 'lucide-react';
import Button from '../../ui/Button';

const MemoryVault: React.FC = () => {
  const [activeEngine, setActiveEngine] = useState('semantic');
  
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

  // Mock memory engines data
  const memoryEngines = [
    { id: 'semantic', name: 'Semantic Network', type: 'primary', size: '14.8 GB', nodes: 1485000 },
    { id: 'episodic', name: 'Episodic Memory', type: 'secondary', size: '8.2 GB', nodes: 724000 },
    { id: 'procedural', name: 'Procedural Knowledge', type: 'auxiliary', size: '5.4 GB', nodes: 392000 },
    { id: 'associative', name: 'Associative Graph', type: 'experimental', size: '2.1 GB', nodes: 148000 },
  ];

  // Mock memory index data for visualization
  const generateIndexData = () => {
    const data = [];
    const categories = ['entities', 'concepts', 'relations', 'facts', 'rules'];
    
    for (let i = 0; i < 20; i++) {
      const size = Math.floor(Math.random() * 100) + 20;
      data.push({
        id: `node-${i}`,
        label: `Memory Cluster ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        size,
        connections: Math.floor(Math.random() * 8) + 1,
      });
    }
    
    return data;
  };
  
  const indexData = generateIndexData();

  const getEngineTypeColor = (type: string) => {
    switch (type) {
      case 'primary':
        return 'bg-primary-500/20 text-primary-400';
      case 'secondary':
        return 'bg-secondary-500/20 text-secondary-400';
      case 'auxiliary':
        return 'bg-accent-500/20 text-accent-400';
      case 'experimental':
        return 'bg-warning-500/20 text-warning-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'entities':
        return 'bg-primary-500/40';
      case 'concepts':
        return 'bg-secondary-500/40';
      case 'relations':
        return 'bg-accent-500/40';
      case 'facts':
        return 'bg-success-500/40';
      case 'rules':
        return 'bg-warning-500/40';
      default:
        return 'bg-gray-500/40';
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Memory Vault
            </h1>
            <p className="text-gray-400">
              Explore and manage agent memory systems and knowledge structures
            </p>
          </motion.div>
          
          <motion.div 
            className="mt-4 md:mt-0 flex space-x-3"
            variants={itemVariants}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search memory indices..."
                className="pl-10 pr-4 py-2 bg-dark-300/70 border border-dark-100/50 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:outline-none transition-all text-white placeholder-gray-500 w-full md:w-64"
              />
            </div>
            
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={16} />}
            >
              New Index
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
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
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Database size={18} className="mr-2 text-primary-400" />
                  Memory Engines
                </h2>
                <button className="p-1.5 rounded-lg hover:bg-dark-100/50 text-gray-400 hover:text-white">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {memoryEngines.map((engine) => (
                  <motion.div
                    key={engine.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      activeEngine === engine.id
                        ? 'bg-dark-100/70 border-primary-500/30'
                        : 'bg-dark-300/50 border-dark-100/30 hover:bg-dark-100/30'
                    }`}
                    onClick={() => setActiveEngine(engine.id)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white">{engine.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getEngineTypeColor(engine.type)}`}>
                        {engine.type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="flex items-center">
                        <HardDrive size={14} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Size</p>
                          <p className="text-sm text-white">{engine.size}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Layers size={14} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Nodes</p>
                          <p className="text-sm text-white">{engine.nodes.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 p-4 rounded-lg bg-primary-500/10 border border-primary-500/20">
                <div className="flex items-start">
                  <FolderTree size={18} className="text-primary-400 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium text-white mb-1">Index Explorer</h3>
                    <p className="text-sm text-gray-400">
                      Select a memory engine to visualize its knowledge structure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="lg:col-span-2"
          variants={itemVariants}
        >
          <div className="bg-dark-200/80 backdrop-blur-sm rounded-xl border border-dark-100/50 shadow-lg overflow-hidden h-full">
            <div className="p-4 border-b border-dark-100/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Layers size={18} className="mr-2 text-secondary-400" />
                  Knowledge Structure
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    Visualizing: <span className="text-white font-medium">
                      {memoryEngines.find(e => e.id === activeEngine)?.name}
                    </span>
                  </span>
                  <button className="p-1.5 rounded-lg hover:bg-dark-100/50 text-gray-400 hover:text-white">
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 h-[500px] flex flex-col">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="text-xs text-gray-400 px-2 py-1 bg-dark-300/50 rounded-lg">
                    Zoom: 100%
                  </span>
                  <span className="text-xs text-gray-400 px-2 py-1 bg-dark-300/50 rounded-lg">
                    Nodes: {indexData.length}
                  </span>
                  <span className="text-xs text-gray-400 px-2 py-1 bg-dark-300/50 rounded-lg">
                    Connections: 67
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="text-xs text-primary-400 hover:text-primary-300">
                    Export
                  </button>
                  <button className="text-xs text-primary-400 hover:text-primary-300">
                    Filter
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-dark-300/50 rounded-lg border border-dark-100/30 relative overflow-hidden">
                {/* Memory Index Visualization */}
                <div className="absolute inset-0 p-4">
                  <div className="w-full h-full relative">
                    {indexData.map((node, index) => {
                      // Calculate a deterministic position based on index
                      const x = 30 + (index % 5) * 120;
                      const y = 30 + Math.floor(index / 5) * 100;
                      
                      return (
                        <motion.div
                          key={node.id}
                          className="absolute"
                          style={{ 
                            left: `${x}px`, 
                            top: `${y}px`,
                            width: `${node.size}px`,
                            height: `${node.size}px`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: 1, 
                            opacity: 0.8,
                            transition: { delay: index * 0.02 }
                          }}
                          whileHover={{ scale: 1.05, opacity: 1 }}
                        >
                          <div 
                            className={`w-full h-full rounded-full ${getCategoryColor(node.category)} flex items-center justify-center cursor-pointer`}
                          >
                            <span className="text-xs text-white font-medium">{node.connections}</span>
                          </div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            <span className="text-xs text-gray-400">{node.category}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                    
                    {/* Add some connection lines */}
                    <svg className="absolute inset-0 w-full h-full z-0">
                      {indexData.slice(0, 15).map((node, index) => {
                        const sourceX = 30 + (index % 5) * 120 + node.size / 2;
                        const sourceY = 30 + Math.floor(index / 5) * 100 + node.size / 2;
                        
                        // Connect to 1-3 other nodes
                        return Array.from({ length: Math.min(3, node.connections) }).map((_, i) => {
                          const targetIndex = (index + i + 1) % indexData.length;
                          const targetNode = indexData[targetIndex];
                          const targetX = 30 + (targetIndex % 5) * 120 + targetNode.size / 2;
                          const targetY = 30 + Math.floor(targetIndex / 5) * 100 + targetNode.size / 2;
                          
                          return (
                            <motion.line
                              key={`${node.id}-${targetNode.id}-${i}`}
                              x1={sourceX}
                              y1={sourceY}
                              x2={targetX}
                              y2={targetY}
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="1"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ 
                                pathLength: 1, 
                                opacity: 0.3,
                                transition: { delay: index * 0.03, duration: 0.5 }
                              }}
                            />
                          );
                        });
                      }).flat()}
                    </svg>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 bg-dark-200/90 backdrop-blur-sm rounded-lg border border-dark-100/50 p-3">
                  <div className="flex items-center text-xs text-gray-400">
                    <Search size={14} className="mr-2" />
                    <span>Hover over nodes to see details. Click to expand connections.</span>
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

export default MemoryVault;