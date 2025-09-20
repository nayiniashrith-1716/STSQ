import React from 'react';
import { Lane, SignalState, Vehicle } from '../types';
import TrafficSignal from './TrafficSignal';
import VehicleIcon from './VehicleIcon';

const LONG_WAIT_THRESHOLD = 15000; // 15 seconds

const priorityGlowClasses: Record<number, string> = {
    1: 'priority-glow-1', // Red for Ambulance
    2: 'priority-glow-2', // Amber for Fire Truck
    3: 'priority-glow-3', // Blue for Police
};

const VehicleDisplay: React.FC<{ vehicle: Vehicle; isNewlyAdded: boolean }> = ({ vehicle, isNewlyAdded }) => {
    const hasWaitedLong = Date.now() - vehicle.arrivalTime > LONG_WAIT_THRESHOLD;
    const arrivalTime = new Date(vehicle.arrivalTime).toLocaleTimeString();
    const waitTime = ((Date.now() - vehicle.arrivalTime) / 1000).toFixed(0);

    const glowClass = priorityGlowClasses[vehicle.priority] || '';

    return (
        <div
            title={`Type: ${vehicle.type}\nPriority: ${vehicle.priority}\nArrived: ${arrivalTime} (${waitTime}s ago)`}
            className={`
                relative group p-1 bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-md transition-transform duration-300 z-10
                flex-shrink-0
                hover:z-20 hover:scale-110
                ${isNewlyAdded ? 'animate-add-vehicle' : 'animate-idle-vehicle'}
                ${glowClass}
            `}
        >
            <div className={`${hasWaitedLong && !glowClass ? 'animate-pulse-wait' : ''} rounded-lg`}>
              <VehicleIcon type={vehicle.type} className="w-10 h-10" />
              <p className={`text-center text-[10px] font-bold text-slate-200 mt-1`}>
                  P:{vehicle.priority}
              </p>
            </div>
        </div>
    );
};

interface TrafficLaneProps {
  lane: Lane;
  signalState: SignalState;
  layout: 'horizontal' | 'vertical';
  reverse?: boolean;
  newlyAddedVehicleId: number | null;
  blockSize: number;
  isCleared: boolean;
}

const TrafficLane: React.FC<TrafficLaneProps> = ({ lane, signalState, layout, reverse = false, newlyAddedVehicleId, blockSize, isCleared }) => {
  const isVertical = layout === 'vertical';
  
  const hasEmergencyVehicle = lane.queue.length > 0 && Math.min(...lane.queue.map(v => v.priority)) <= 3;
  const isReady = hasEmergencyVehicle || lane.queue.length >= blockSize;
  const progress = Math.min((lane.queue.length / blockSize) * 100, 100);

  const wrapperFlexDirection = isVertical ? (reverse ? 'flex-col-reverse' : 'flex-col') : (reverse ? 'flex-row-reverse' : 'flex-row');
  
  const queueContainerClasses = [
    'vehicle-queue-container',
    'flex',
    'p-1',
    isVertical ? 'flex-col w-full h-full overflow-y-auto' : 'flex-row h-full w-full overflow-x-auto',
    isVertical ? (reverse ? 'justify-end' : 'justify-start') : (reverse ? 'justify-end' : 'justify-start'),
    isVertical ? 'space-y-2' : 'space-x-2',
  ].join(' ');


  return (
    <div className={`flex items-center justify-center gap-2 ${wrapperFlexDirection}`}>
        <TrafficSignal state={signalState} small />
        <div className={`
            relative p-2 rounded-lg border-2 bg-slate-950/50
            transition-colors duration-500 overflow-hidden
            flex items-center
            ${isVertical ? 'h-full w-24' : 'w-full h-24'}
            ${isCleared ? 'border-green-500 animate-glow-green' : isReady ? 'border-cyan-500' : 'border-slate-700'}
        `}>
            
            <div className={`absolute top-0 left-0 h-full transition-all duration-500 ${isReady ? 'bg-cyan-500/10' : 'bg-slate-800/10'}`} style={{ width: `${progress}%`}} />
            
            <span className={`absolute z-10 text-[10px] font-bold uppercase bg-slate-900/50 px-2 py-0.5 rounded
              ${isVertical ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2'}
              ${isVertical && !reverse ? 'top-1' : ''} ${isVertical && reverse ? 'bottom-1' : ''}
              ${!isVertical && !reverse ? 'left-1' : ''} ${!isVertical && reverse ? 'right-1' : ''}
            `}>{lane.id}</span>

            {isCleared && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-900/80 animate-fade-in-out z-20">
                <span className="font-bold text-green-300 text-xs tracking-widest">CLEARED</span>
              </div>
            )}
            
            <div className={queueContainerClasses}>
                {lane.queue.map((vehicle) => (
                    <VehicleDisplay 
                        key={vehicle.id}
                        vehicle={vehicle}
                        isNewlyAdded={vehicle.id === newlyAddedVehicleId}
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

export default TrafficLane;