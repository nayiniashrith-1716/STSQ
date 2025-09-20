import React, { useState, useCallback, useEffect, useRef } from 'react';
import { VehicleType, Vehicle, Junction, JunctionId, LaneId, SignalState } from './types';
import { VEHICLE_PRIORITIES, JUNCTION_IDS, LANE_IDS } from './constants';
import Header from './components/Header';
import VehicleForm from './components/VehicleForm';
import JunctionComponent from './components/Junction';
import Dashboard from './components/Dashboard';

const FULL_CLEARANCE_PRIORITY_THRESHOLD = 2; // Ambulance, Fire Truck
const EMERGENCY_PRIORITY_THRESHOLD = 3; // Ambulance, Fire Truck, Police

const createInitialJunctionState = (id: JunctionId): Junction => ({
  id,
  lanes: {
    North: { id: 'North', queue: [] },
    South: { id: 'South', queue: [] },
    East: { id: 'East', queue: [] },
    West: { id: 'West', queue: [] },
  },
  activeLane: null,
  signalState: SignalState.Red,
  isProcessing: false,
  passingVehicle: null,
  lastProcessedLaneIndex: -1,
  clearedLaneId: null,
  totalVehiclesCleared: 0,
  emergencyVehiclesCleared: 0,
  statusMessage: "System Idle. Add vehicles to begin.",
});

const App: React.FC = () => {
  const [junctions, setJunctions] = useState<Record<JunctionId, Junction>>(() => {
    const state: Partial<Record<JunctionId, Junction>> = {};
    for (const id of JUNCTION_IDS) {
      state[id] = createInitialJunctionState(id);
    }
    return state as Record<JunctionId, Junction>;
  });
  
  const [newlyAddedVehicleId, setNewlyAddedVehicleId] = useState<number | null>(null);
  const [blockSize, setBlockSize] = useState<number>(3);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  const junctionsRef = useRef(junctions);
  junctionsRef.current = junctions;

  const baseDurations = {
    cycleInterval: 4000,
    vehicleProcess: 1500,
    yellowLight: 1000,
  };

  const getDuration = (name: keyof typeof baseDurations) => baseDurations[name] / simulationSpeed;

  const addVehicle = useCallback((vehicleType: VehicleType, junctionId: JunctionId, laneId: LaneId) => {
    const newVehicle: Vehicle = {
      id: Date.now() + Math.random(),
      type: vehicleType,
      priority: VEHICLE_PRIORITIES[vehicleType],
      arrivalTime: Date.now(),
      laneId: laneId,
    };

    setJunctions(prev => {
      const junction = prev[junctionId];
      const newQueue = [...junction.lanes[laneId].queue, newVehicle];
      return {
        ...prev,
        [junctionId]: {
          ...junction,
          lanes: {
            ...junction.lanes,
            [laneId]: { ...junction.lanes[laneId], queue: newQueue },
          },
        },
      };
    });

    setNewlyAddedVehicleId(newVehicle.id);
    setTimeout(() => setNewlyAddedVehicleId(null), 500);
  }, []);
  
  const resetSimulation = useCallback(() => {
     setJunctions(prev => {
        const newState = {...prev};
        for (const id of JUNCTION_IDS) {
            newState[id] = createInitialJunctionState(id);
        }
        return newState;
     });
  }, []);

  const runSimulationCycle = useCallback((junctionId: JunctionId) => {
    const currentJunctions = junctionsRef.current;
    const junction = currentJunctions[junctionId];

    if (junction.isProcessing || Object.values(junction.lanes).every(l => l.queue.length === 0)) {
        if (!junction.isProcessing && junction.statusMessage !== "System Idle. Add vehicles to begin.") {
             setJunctions(p => ({ ...p, [junctionId]: { ...p[junctionId], statusMessage: "System Idle. Waiting for vehicles." }}));
        }
        return;
    }

    const sortedLanes = [...LANE_IDS].map(id => ({ id, queue: junction.lanes[id].queue }))
        .map(lane => ({ ...lane, highestPrio: lane.queue.length > 0 ? Math.min(...lane.queue.map(v => v.priority)) : Infinity }))
        .sort((a,b) => a.highestPrio - b.highestPrio);
    
    const highestPriorityInJunction = sortedLanes[0].highestPrio;

    if (highestPriorityInJunction <= FULL_CLEARANCE_PRIORITY_THRESHOLD) {
      const winningLaneId = sortedLanes[0].id;
      const vehiclesToClear = [...junction.lanes[winningLaneId].queue];
      const statusMessage = `Emergency vehicle detected! Clearing ${winningLaneId} lane.`;

      const processVehicle = (index: number) => {
        if (index >= vehiclesToClear.length) {
            setJunctions(p => ({ ...p, [junctionId]: { ...p[junctionId], clearedLaneId: winningLaneId, passingVehicle: null, signalState: SignalState.Yellow }}));
            setTimeout(() => {
                setJunctions(p => ({ ...p, [junctionId]: { ...p[junctionId], signalState: SignalState.Red, activeLane: null, isProcessing: false, statusMessage: `${winningLaneId} lane cleared.` } }));
                setTimeout(() => setJunctions(p => ({ ...p, [junctionId]: { ...p[junctionId], clearedLaneId: null }})), 2000);
            }, getDuration('yellowLight'));
            return;
        }
        const vehicle = vehiclesToClear[index];
        setJunctions(p => {
          const currentJunction = p[junctionId];
          const isEmergency = vehicle.priority <= EMERGENCY_PRIORITY_THRESHOLD;
          return {
            ...p,
            [junctionId]: {
              ...currentJunction,
              passingVehicle: vehicle,
              totalVehiclesCleared: currentJunction.totalVehiclesCleared + 1,
              emergencyVehiclesCleared: currentJunction.emergencyVehiclesCleared + (isEmergency ? 1 : 0),
              lanes: {
                ...currentJunction.lanes,
                [winningLaneId]: { ...currentJunction.lanes[winningLaneId], queue: currentJunction.lanes[winningLaneId].queue.slice(1) }
              }
            }
          };
        });
        setTimeout(() => processVehicle(index + 1), getDuration('vehicleProcess'));
      };
      
      processVehicle(0);
      
      setJunctions(p => ({ ...p, [junctionId]: { ...p[junctionId], isProcessing: true, activeLane: winningLaneId, signalState: SignalState.Green, statusMessage, lastProcessedLaneIndex: LANE_IDS.indexOf(winningLaneId) } }));
      return;
    }

    const eligibleLanes = LANE_IDS.filter(laneId => {
      const queue = junction.lanes[laneId].queue;
      if (queue.length === 0) return false;
      const highestPrio = Math.min(...queue.map(v => v.priority));
      return highestPrio <= EMERGENCY_PRIORITY_THRESHOLD || queue.length >= blockSize;
    });

    if (eligibleLanes.length === 0) return;

    const candidateLanes = eligibleLanes.map(id => ({ id, priority: Math.min(...junction.lanes[id].queue.map(v => v.priority))}))
        .sort((a,b) => a.priority - b.priority);

    const topPriority = candidateLanes[0].priority;
    const finalCandidates = candidateLanes.filter(l => l.priority === topPriority).map(l => l.id);
    
    let winningLaneId: LaneId | null = null;
    if (finalCandidates.length === 1) {
      winningLaneId = finalCandidates[0];
    } else {
      const startIndex = (junction.lastProcessedLaneIndex + 1) % LANE_IDS.length;
      for (let i = 0; i < LANE_IDS.length; i++) {
        const laneToCheck = LANE_IDS[(startIndex + i) % LANE_IDS.length];
        if (finalCandidates.includes(laneToCheck)) {
          winningLaneId = laneToCheck;
          break;
        }
      }
    }

    if (!winningLaneId) return;
    
    const vehicleToProcess = junction.lanes[winningLaneId].queue[0];
    const newLastProcessedIndex = LANE_IDS.indexOf(winningLaneId);
    const statusMessage = `Processing ${winningLaneId} lane. Next up: a ${vehicleToProcess.type}.`;

    setTimeout(() => {
      setJunctions(p => ({
        ...p,
        [junctionId]: { ...p[junctionId], passingVehicle: null, signalState: SignalState.Yellow, statusMessage: `Clearing intersection...` },
      }));
      setTimeout(() => {
        setJunctions(p => {
            const currentJunction = p[junctionId];
            const isEmergency = vehicleToProcess.priority <= EMERGENCY_PRIORITY_THRESHOLD;
            return {
                ...p,
                [junctionId]: { 
                    ...currentJunction,
                    lanes: { ...currentJunction.lanes, [winningLaneId!]: { ...currentJunction.lanes[winningLaneId!], queue: currentJunction.lanes[winningLaneId!].queue.slice(1) },},
                    totalVehiclesCleared: currentJunction.totalVehiclesCleared + 1,
                    emergencyVehiclesCleared: currentJunction.emergencyVehiclesCleared + (isEmergency ? 1 : 0),
                    signalState: SignalState.Red, 
                    activeLane: null, 
                    isProcessing: false,
                    statusMessage: `Vehicle from ${winningLaneId} passed.`
                },
            }
        });
      }, getDuration('yellowLight'));
    }, getDuration('vehicleProcess') + 500);

    setJunctions(p => ({
        ...p,
        [junctionId]: {
          ...p[junctionId],
          isProcessing: true, passingVehicle: vehicleToProcess, activeLane: winningLaneId,
          signalState: SignalState.Green, lastProcessedLaneIndex: newLastProcessedIndex, statusMessage
        }
    }));
  }, [blockSize, simulationSpeed]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        for (const junctionId of JUNCTION_IDS) {
          runSimulationCycle(junctionId);
        }
      }
    }, getDuration('cycleInterval'));
    return () => clearInterval(interval);
  }, [runSimulationCycle, isPaused, simulationSpeed]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 h-fit">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">Control Panel</h2>
            <VehicleForm 
              onAddVehicle={addVehicle} 
              blockSize={blockSize}
              onBlockSizeChange={setBlockSize}
              isPaused={isPaused}
              onTogglePause={() => setIsPaused(p => !p)}
              onReset={resetSimulation}
              simulationSpeed={simulationSpeed}
              onSpeedChange={setSimulationSpeed}
            />
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-cyan-400">Junction A</h2>
            {JUNCTION_IDS.map(id => (
              <JunctionComponent 
                key={id} 
                junction={junctions[id]} 
                newlyAddedVehicleId={newlyAddedVehicleId}
                blockSize={blockSize}
              />
            ))}
          </div>
           <div className="lg:col-span-1 bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 h-fit">
             <h2 className="text-2xl font-bold text-cyan-400 mb-6">System Status</h2>
             {JUNCTION_IDS.map(id => (
                <Dashboard key={id} junction={junctions[id]} />
             ))}
           </div>
        </main>
      </div>
    </div>
  );
};

export default App;