// 🌱 RootbloomPanel – formerly "Daphne"
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchRootBloomData } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/StatusCard';


interface LogEntry {
  title: string;
  description: string | null;
}

const RootbloomPanel = () => {
  const { token } = useAuth();
  const [data, setData] = useState<{ logs: LogEntry[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setError("Authentication token missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetchRootBloomData('RootBloomData', token);
        setData(res);
      } catch (err) {
        setError('Failed to fetch Rootbloom data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (loading) return <div className="p-4">Loading mycorrhizal logs...</div>;
  if (error) return <div className="p-4 text-red-400">{error}</div>;

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold text-hyphae-300">🌱 Rootbloom Node Activity</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.logs?.map((log, i) => (
          <Card
            key={i}
            title={log.title}
            value={log.description ?? "N/A"} // reinterpreted as `value`
            icon={<ArrowUpRight />}          // or any icon relevant to your data
            trend="stable"                   // placeholder or logic-driven
            trendValue="0%"                  // placeholder or derived from log
            color="accent"                   // any valid color scheme
            />

        ))}
      </div>
    </motion.div>
  );
};

export default RootbloomPanel;
