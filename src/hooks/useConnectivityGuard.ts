import { useState, useEffect } from 'react';
import { globalConnectivityGuard } from '../lib/network/ConnectivityGuard';
import { CircuitBreakerState } from '../lib/network/CircuitBreaker';

export function useConnectivityGuard() {
  const [firebaseState, setFirebaseState] = useState<CircuitBreakerState>('CLOSED');
  const [liveblocksState, setLiveblocksState] = useState<CircuitBreakerState>('CLOSED');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;

    const performChecks = async () => {
      if (!mounted) return;
      
      const online = navigator.onLine;
      setIsOnline(online);

      if (online) {
        await Promise.all([
          globalConnectivityGuard.checkFirebase(),
          globalConnectivityGuard.checkLiveblocks()
        ]);
      }

      if (mounted) {
        setFirebaseState(globalConnectivityGuard.firebaseBreaker.getState());
        setLiveblocksState(globalConnectivityGuard.liveblocksBreaker.getState());
      }
    };

    performChecks();
    const intervalId = setInterval(performChecks, 10000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { firebaseState, liveblocksState, isOnline };
}
