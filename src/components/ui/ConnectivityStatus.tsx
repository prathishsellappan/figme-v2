import React from 'react';
import { useConnectivityGuard } from '../../hooks/useConnectivityGuard';
import { CircuitBreakerState } from '../../lib/network/CircuitBreaker';

const StateDot: React.FC<{ state: CircuitBreakerState, label: string }> = ({ state, label }) => {
  let color = 'bg-green-500';
  if (state === 'OPEN') color = 'bg-red-500';
  if (state === 'HALF_OPEN') color = 'bg-yellow-500';

  return (
    <div className="flex items-center space-x-1" title={`${label} Circuit: ${state}`}>
      <span className="text-xs text-gray-500">{label}</span>
      <div className={`w-2 h-2 rounded-full ${color}`} />
    </div>
  );
};

export const ConnectivityStatus: React.FC = () => {
  const { firebaseState, liveblocksState, isOnline } = useConnectivityGuard();

  if (!isOnline) {
    return (
      <div className="absolute top-4 right-[280px] flex items-center space-x-2 px-3 py-1 bg-[#141415] rounded-md border border-gray-800 z-50">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-xs text-gray-500">Offline</span>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-[280px] flex items-center space-x-3 px-3 py-1 bg-[#141415] rounded-md border border-gray-800 z-50">
      <StateDot state={firebaseState} label="FB" />
      <StateDot state={liveblocksState} label="LB" />
    </div>
  );
};
