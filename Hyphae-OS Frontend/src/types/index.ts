export interface User {
  id: string;
  username: string;
  email: string;
  role: 'owner' | 'admin' | 'system';
  avatar?: string;
  deviceId?: string;
  pinVerified?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeAgents: number;
  uptime: string;
}

export interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  type: string;
  metrics: {
    memory: number;
    cpu: number;
    uptime: string;
  };
}

export type AgentType = 'mycocore' | 'neuroweave' | 'rootbloom' | 'sporelink';

export interface AgentEvent {
  id: string;
  type: AgentType;
  status: string;
  message: string;
  timestamp: string;
}