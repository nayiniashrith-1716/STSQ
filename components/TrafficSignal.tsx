
import React from 'react';
import { SignalState } from '../types';

interface TrafficSignalProps {
  state: SignalState;
  small?: boolean;
}

const Light: React.FC<{ color: string; active: boolean; blinking?: boolean; small?: boolean }> = ({ color, active, blinking = false, small = false }) => {
    const size = small ? 'w-6 h-6' : 'w-12 h-12 sm:w-16 sm:h-16';
    const baseClasses = `${size} rounded-full transition-all duration-300 border-2 border-slate-600`;
    const activeClasses: Record<string, string> = {
        'red': 'bg-red-500 shadow-[0_0_10px_2px] shadow-red-500/50',
        'yellow': 'bg-yellow-400 shadow-[0_0_10px_2px] shadow-yellow-400/50',
        'green': 'bg-green-500 shadow-[0_0_10px_2px] shadow-green-500/50',
    };
    const inactiveClass = "bg-slate-800";

    return (
        <div className={`${baseClasses} ${active ? activeClasses[color] : inactiveClass} ${blinking && active ? 'animate-blink' : ''}`}></div>
    );
};

const TrafficSignal: React.FC<TrafficSignalProps> = ({ state, small = false }) => {
  return (
    <div className={`bg-slate-950 p-2 rounded-lg border-2 border-slate-700 flex ${small ? 'flex-col space-y-1' : 'space-y-3'}`}>
      <Light color="red" active={state === SignalState.Red} small={small} />
      <Light color="yellow" active={state === SignalState.Yellow} blinking={true} small={small} />
      <Light color="green" active={state === SignalState.Green} small={small} />
    </div>
  );
};

export default TrafficSignal;
