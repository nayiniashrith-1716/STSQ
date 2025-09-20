import React from 'react';
import { Junction as JunctionType, LaneId, SignalState } from '../types';
import TrafficLane from './TrafficLane';
import VehicleIcon from './VehicleIcon';

interface IntersectionProps {
  junction: JunctionType;
}

const Intersection: React.FC<IntersectionProps> = ({ junction }) => {
    const { passingVehicle, activeLane } = junction;
    if (!passingVehicle || !activeLane) return <div className="bg-slate-700/50 rounded-md" />;

    const animationClasses: Record<LaneId, string> = {
        North: 'animate-drive-north',
        South: 'animate-drive-south',
        West: 'animate-drive-west',
        East: 'animate-drive-east',
    };

    return (
        <div className="relative bg-slate-700/50 rounded-md overflow-hidden flex items-center justify-center">
            <div key={passingVehicle.id} className={`absolute ${animationClasses[activeLane]}`}>
                <div className="p-1.5 bg-slate-800 rounded-lg border-2 border-green-500 shadow-lg animate-glow-trail">
                    <VehicleIcon type={passingVehicle.type} className="w-10 h-10" />
                </div>
            </div>
        </div>
    );
};

interface JunctionProps {
  junction: JunctionType;
  newlyAddedVehicleId: number | null;
  blockSize: number;
}

const JunctionComponent: React.FC<JunctionProps> = ({ junction, newlyAddedVehicleId, blockSize }) => {
  const { lanes, activeLane, signalState, clearedLaneId } = junction;

  return (
    <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700">
      <div className="grid grid-cols-3 grid-rows-3 gap-2 aspect-square">
        <div /> {/* Top-left corner */}
        
        <TrafficLane
          lane={lanes.North}
          signalState={activeLane === 'North' ? signalState : SignalState.Red}
          layout="vertical"
          newlyAddedVehicleId={newlyAddedVehicleId}
          blockSize={blockSize}
          isCleared={clearedLaneId === 'North'}
        />
        
        <div /> {/* Top-right corner */}
        
        <TrafficLane
          lane={lanes.West}
          signalState={activeLane === 'West' ? signalState : SignalState.Red}
          layout="horizontal"
          newlyAddedVehicleId={newlyAddedVehicleId}
          blockSize={blockSize}
          isCleared={clearedLaneId === 'West'}
        />
        
        <Intersection junction={junction} />
        
        <TrafficLane
          lane={lanes.East}
          signalState={activeLane === 'East' ? signalState : SignalState.Red}
          layout="horizontal"
          reverse
          newlyAddedVehicleId={newlyAddedVehicleId}
          blockSize={blockSize}
          isCleared={clearedLaneId === 'East'}
        />
        
        <div /> {/* Bottom-left corner */}
        
        <TrafficLane
          lane={lanes.South}
          signalState={activeLane === 'South' ? signalState : SignalState.Red}
          layout="vertical"
          reverse
          newlyAddedVehicleId={newlyAddedVehicleId}
          blockSize={blockSize}
          isCleared={clearedLaneId === 'South'}
        />

        <div /> {/* Bottom-right corner */}
      </div>
    </div>
  );
};

export default JunctionComponent;