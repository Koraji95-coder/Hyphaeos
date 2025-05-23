// src/hooks/useAgentStream.ts
import { useEffect, useState } from "react";

type AgentEvent = {
  agent: string;
  status: string;
  timestamp: string;
};

export function useAgentStream(url: string) {
  const [events, setEvents] = useState<AgentEvent[]>([]);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setEvents((prev) => [...prev.slice(-49), data]); // keep last 50
      } catch (e) {
        console.error("Invalid agent event", e);
      }
    };

    ws.onerror = (e) => console.error("WebSocket error:", e);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [url]);

  return events;
}