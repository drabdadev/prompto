import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5080';
const HEALTH_CHECK_INTERVAL = 5000; // Check every 5 seconds when offline
const INITIAL_CHECK_TIMEOUT = 3000; // 3 second timeout for initial check

interface ServerHealthState {
  isOnline: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
}

export function useServerHealth() {
  const [state, setState] = useState<ServerHealthState>({
    isOnline: true, // Assume online initially to avoid flash
    isChecking: true,
    lastChecked: null,
  });

  const checkHealth = useCallback(async () => {
    setState(prev => ({ ...prev, isChecking: true }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), INITIAL_CHECK_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      setState({
        isOnline: response.ok,
        isChecking: false,
        lastChecked: new Date(),
      });

      return response.ok;
    } catch {
      setState({
        isOnline: false,
        isChecking: false,
        lastChecked: new Date(),
      });
      return false;
    }
  }, []);

  // Initial check
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Periodic check when offline
  useEffect(() => {
    if (state.isOnline || state.isChecking) return;

    const intervalId = setInterval(() => {
      checkHealth();
    }, HEALTH_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [state.isOnline, state.isChecking, checkHealth]);

  return {
    isOnline: state.isOnline,
    isChecking: state.isChecking,
    lastChecked: state.lastChecked,
    checkHealth,
  };
}
