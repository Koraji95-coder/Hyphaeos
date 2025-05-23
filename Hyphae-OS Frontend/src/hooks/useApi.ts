import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { ERROR_MESSAGES } from '@/config/constants';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(endpoint: string, options: UseApiOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get<ApiResponse<T>>(endpoint);
      setData(response.data.data);
      options.onSuccess?.(response.data.data);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      const message = error.response?.data?.error || error.message || ERROR_MESSAGES.NETWORK_ERROR;
      setError(message);
      options.onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, fetchData };
}