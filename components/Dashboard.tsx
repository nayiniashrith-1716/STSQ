import React from 'react';
import { Junction as JunctionType, LaneId, Vehicle } from '../types';
import { LANE_IDS } from '../constants';
import VehicleIcon from './VehicleIcon';

const EMERGENCY_PRIORITY_THRESHOLD = 3;

const LaneStatus: React.FC<{ laneId: LaneId; count: number }> = ({ laneId, count }) => {
    return (
        <div className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
            <span className="font-semibold text-slate-300">{laneId}</span>
            <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-cyan-400">{count}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C3.057 15.71 4.245 16 5.5 16c1.255 0 2.443-.29 3.5-.804V4.804z" />
                    <path d="M15.5 4c-1.255 0-2.443.29-3.5.804v10.392c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C17.943 4.29 16.755 4 15.5 4z" />
                </svg>
            </div>
        </div>
    );
};

// FIX: Define DashboardProps interface for component props.
interface DashboardProps {
    junction: JunctionType;
}

const Dashboard: React.FC<DashboardProps> = ({ junction }) => {
    const { statusMessage, totalVehiclesCleared, emergencyVehiclesCleared, lanes } = junction;
    // FIX: Refactored to iterate over LANE_IDS to avoid potential typing issues with Object.values(lanes), ensuring type safety.
    const waitingEmergencyVehicles = LANE_IDS
        .flatMap(laneId => lanes[laneId].queue)
        .filter(v => v.priority <= EMERGENCY_PRIORITY_THRESHOLD).length;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Current Status</h3>
                <div className="bg-slate-900/50 p-4 rounded-lg text-center h-16 flex items-center justify-center">
                    <p className="text-slate-200">{statusMessage}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">Total Cleared</h3>
                    <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                        <p className="text-4xl font-bold text-green-400 font-mono">{totalVehiclesCleared}</p>
                    </div>
                </div>
                 <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">Emergency</h3>
                    <div className="bg-red-900/30 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-red-400 font-mono" title="Waiting / Cleared">
                            {waitingEmergencyVehicles} / {emergencyVehiclesCleared}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Lane Queues</h3>
                <div className="space-y-2">
                    {LANE_IDS.map(id => (
                        <LaneStatus key={id} laneId={id} count={lanes[id].queue.length} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;