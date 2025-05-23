// 🧠 MycoCorePanel – formerly "Atlas"
import React, { useEffect, useState } from 'react';
import { getMycoCoreSnapshot } from '@/services/api';
import Button from '@/components/ui/Button';

const MycoCorePanel: React.FC = () => {
  const [snapshot, setSnapshot] = useState<string>('Loading secure terminal...');
  const [error, setError] = useState<string>('');

  const loadSnapshot = async () => {
    setError('');
    setSnapshot('Fetching system intelligence...');
    try {
      const data = await getMycoCoreSnapshot();
      setSnapshot(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('[MycoCorePanel] Snapshot error:', err);
      setError('Failed to fetch system snapshot. Please try again.');
    }
  };

  useEffect(() => {
    loadSnapshot();
  }, []);

  return (
    <div className="bg-dark-200 p-6 rounded-2xl shadow-inner border border-hyphae-500/20 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-hyphae-300">🧠 MycoCore Control</h2>
        <Button onClick={loadSnapshot} className="bg-hyphae-500 hover:bg-hyphae-600 text-white">
          Refresh Snapshot
        </Button>
      </div>
      {error && (
        <div className="mb-4 p-4 rounded bg-fungal-500/10 border border-fungal-500 text-fungal-300">
          {error}
        </div>
      )}
      <pre className="whitespace-pre-wrap max-h-[50vh] overflow-auto text-sm bg-dark-300 p-4 rounded-lg border border-hyphae-500/10">
        {snapshot}
      </pre>
    </div>
  );
};

export default MycoCorePanel;
