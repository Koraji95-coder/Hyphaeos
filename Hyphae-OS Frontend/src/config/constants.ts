export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    verify: '/api/auth/verify',
  },
  agents: {
    mycocore: '/api/system/mycocore',
    neuroweave: '/api/neuroweave',
    rootbloom: '/api/rootbloom',
    sporelink: '/api/sporelink',
  },
} as const;

export const AGENT_TYPES = {
  MYCOCORE: 'mycocore',
  NEUROWEAVE: 'neuroweave',
  ROOTBLOOM: 'rootbloom',
  SPORELINK: 'sporelink',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to server',
  AUTH_ERROR: 'Authentication failed',
  VALIDATION_ERROR: 'Invalid input provided',
} as const;