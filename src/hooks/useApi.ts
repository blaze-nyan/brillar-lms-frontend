import { useState, useCallback } from "react";
import { AxiosResponse, AxiosError } from "axios";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<AxiosResponse<T>>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await apiFunction(...args);
        setState((prev) => ({ ...prev, data: response.data, loading: false }));
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          "An error occurred";
        setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
