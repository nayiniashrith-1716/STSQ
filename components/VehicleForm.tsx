
import React, { useState } from 'react';
import { VehicleType, JunctionId, LaneId, UserRole } from '../types';
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
  userRole: UserRole;
  onScenarioUpload: (csvContent: string) => void;
  onExportLog: () => void;
  onExportState: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
    onAddVehicle, 
    blockSize, onBlockSizeChange,
    isPaused, onTogglePause, onReset,
    simulationSpeed, onSpeedChange,
    userRole,
    onScenarioUpload, onExportLog, onExportState
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(VehicleType.Car);
  const [selectedJunction, setSelectedJunction] = useState<JunctionId>('A');
  const [selectedLane, setSelectedLane] = useState<LaneId>('North');

  const isOperator = userRole === 'Operator';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVehicle(selectedVehicle, selectedJunction, selectedLane);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result;
            if (typeof text === 'string') {
                onScenarioUpload(text);
            }
        };
        reader.readAsText(file);
    }
    e.target.value = ''; // Reset file input
  };

  const handleDownloadSample = () => {
    const sampleContent = `vehicle_type,lane_id\nCar,North\nAmbulance,East\nBus,North\nCar,West\nFire Truck,South\nPolice,North`;
    const blob = new Blob([sampleContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_scenario.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <fieldset disabled={isOperator} className="relative">
      {isOperator && (
          <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl -m-6">
              <div className="text-center p-4">
                  <p className="text-lg font-bold text-amber-400">View-Only Mode</p>
                  <p className="text-sm text-slate-300">Operators cannot modify the simulation.</p>
              </div>
          </div>
      )}
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
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:bg-slate-800 disabled:text-slate-400"
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
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:bg-slate-800 disabled:text-slate-400"
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

        <div className="pt-6 border-t border-slate-700 space-y-4">
            <h3 className="text-lg font-semibold text-slate-300">Data Import / Export</h3>
            <div className="space-y-3">
              <div>
                  <input
                    type="file"
                    id="csv-upload"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button onClick={() => document.getElementById('csv-upload')?.click()} className="w-full">
                    Upload Scenario (CSV)
                  </Button>
              </div>
              <Button onClick={handleDownloadSample} className="w-full !bg-slate-600 hover:!bg-slate-500 text-sm">
                  Download Sample Scenario
              </Button>
              <div className="flex gap-4">
                  <Button onClick={onExportLog} className="w-full !bg-indigo-700 hover:!bg-indigo-600 text-sm">
                      Export Log
                  </Button>
                  <Button onClick={onExportState} className="w-full !bg-indigo-700 hover:!bg-indigo-600 text-sm">
                      Export State
                  </Button>
              </div>
            </div>
        </div>
        
        <div className="pt-6 border-t border-slate-700 space-y-6">
          <div>
              <label htmlFor="block-size" className="block text-sm font-medium text-slate-300 mb-2">
              Block Size: <span className="font-bold text-cyan-400 text-base">{blockSize}</span> Vehicles
              </label>
              <input
                  id="block-size" type="range" min="1" max="8" value={blockSize}
                  onChange={(e) => onBlockSizeChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:accent-slate-500 disabled:cursor-not-allowed"
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
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:accent-slate-500 disabled:cursor-not-allowed"
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
    </fieldset>
  );
};

export default VehicleForm;