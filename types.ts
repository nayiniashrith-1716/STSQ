
export enum VehicleType {
  Ambulance = 'Ambulance',
  FireTruck = 'Fire Truck',
  Police = 'Police',
  Bus = 'Bus',
  Car = 'Car',
}

export interface Vehicle {
  id: number;
  type: VehicleType;
  priority: number;
  arrivalTime: number;
  laneId: LaneId;
}

export enum SignalState {
    Red = 'red',
    Yellow = 'yellow',
    Green = 'green',
}

export type JunctionId = 'A'; // Simplified to one junction for this detailed view
export type LaneId = 'North' | 'South' | 'East' | 'West';

export interface Lane {
    id: LaneId;
    queue: Vehicle[];
}

export interface Junction {
    id: JunctionId;
    lanes: Record<LaneId, Lane>;
    activeLane: LaneId | null;
    signalState: SignalState;
    isProcessing: boolean;
    passingVehicle: Vehicle | null;
    lastProcessedLaneIndex: number; // For round-robin
    clearedLaneId: LaneId | null; // For "Lane Cleared" animation
    totalVehiclesCleared: number;
    emergencyVehiclesCleared: number; // New
    statusMessage: string;
}

export type UserRole = 'Authority' | 'Operator';
