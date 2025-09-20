import React, { useState } from 'react';
import { VehicleType, JunctionId, LaneId } from '../types';
import { JUNCTION_IDS, LANE_IDS } from '../constants';
import Button from './Button';

interface VehicleFormProps {
  onAddVehicle: (vehicleType: VehicleType, junctionId: JunctionId, laneId: LaneId) => void;
  blockSize: number;
  onBlockSizeChange: (size: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
    onAddVehicle, 
    blockSize, onBlockSizeChange,
    isPaused, onTogglePause, onReset,
    simulationSpeed, onSpeedChange
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(VehicleType.Car);
  const [selectedJunction, setSelectedJunction] = useState<JunctionId>('A');
  const [selectedLane, setSelectedLane] = useState<LaneId>('North');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVehicle(selectedVehicle, selectedJunction, selectedLane);
  };

  return (
    <div className="flex flex-col space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className='space-y-4'>
          <div>
            <label htmlFor="vehicle-type" className="block text-sm font-medium text-slate-300 mb-2">
              Vehicle Type
            </label>
            <select
              id="vehicle-type"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value as VehicleType)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            >
              {Object.values(VehicleType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="lane-id" className="block text-sm font-medium text-slate-300 mb-2">
              Target Lane
            </label>
            <select
              id="lane-id"
              value={selectedLane}
              onChange={(e) => setSelectedLane(e.target.value as LaneId)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            >
              {LANE_IDS.map((id) => (
                <option key={id} value={id}>
                  {id} Lane
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <Button type="submit" className="w-full">
          Add Vehicle to Lane
        </Button>
      </form>
      
      <div className="pt-6 border-t border-slate-700 space-y-6">
        <div>
            <label htmlFor="block-size" className="block text-sm font-medium text-slate-300 mb-2">
            Block Size: <span className="font-bold text-cyan-400 text-base">{blockSize}</span> Vehicles
            </label>
            <input
                id="block-size" type="range" min="1" max="8" value={blockSize}
                onChange={(e) => onBlockSizeChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-xs text-slate-400 mt-1">Min vehicles for a lane to be 'Ready'.</p>
        </div>
        <div>
            <label htmlFor="sim-speed" className="block text-sm font-medium text-slate-300 mb-2">
            Simulation Speed: <span className="font-bold text-cyan-400 text-base">{simulationSpeed}x</span>
            </label>
            <input
                id="sim-speed" type="range" min="0.5" max="3" step="0.25" value={simulationSpeed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-xs text-slate-400 mt-1">Adjust simulation cycle speed.</p>
        </div>
      </div>
       <div className="pt-6 border-t border-slate-700 flex gap-4">
            <Button onClick={onTogglePause} className="w-full !bg-amber-600 hover:!bg-amber-500">
                {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button onClick={onReset} className="w-full !bg-red-700 hover:!bg-red-600">
                Reset
            </Button>
        </div>
    </div>
  );
};

export default VehicleForm;