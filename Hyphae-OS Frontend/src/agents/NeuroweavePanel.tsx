// 🧠 NeuroweavePanel – formerly "Cortexa"
import React, { useState, useEffect } from 'react';
import { fetchNeuroweaveData } from '@/services/api';
import Button from '@/components/ui/Button';


const NeuroweavePanel: React.FC = () => {
  const [data, setData] = useState<string>('Activating cognitive threads...');
  const [error, setError] = useState<string>('');

  const loadNeuroweaveData = async () => {
    setError('');
    setData('Linking neural fibers...');
    try {
      const res = await fetchNeuroweaveData();
      setData(JSON.stringify(res, null, 2));
    } catch (err) {
      console.error('[NeuroweavePanel] Error fetching data:', err);
      setError('Neuroweave link disrupted. Check connectivity.');
    }
  };

  useEffect(() => {
    loadNeuroweaveData();
  }, []);

  return (
    <div className="bg-dark-200 p-6 rounded-2xl shadow-inner border border-hyphae-500/20 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-hyphae-300">🧠 Neuroweave Panel</h2>
        <Button onClick={loadNeuroweaveData} className="bg-hyphae-500 hover:bg-hyphae-600">
          Refresh Threads
        </Button>
      </div>
      {error && <p className="text-fungal-300 mb-4">{error}</p>}
      <pre className="text-sm whitespace-pre-wrap bg-dark-300 p-4 rounded-xl overflow-auto max-h-96">
        {data}
      </pre>
    </div>
  );
};

export default NeuroweavePanel;
