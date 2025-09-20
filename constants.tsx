
import React from 'react';
import { VehicleType, JunctionId, LaneId } from './types';

export const VEHICLE_PRIORITIES: Record<VehicleType, number> = {
  [VehicleType.Ambulance]: 1,
  [VehicleType.FireTruck]: 2,
  [VehicleType.Police]: 3,
  [VehicleType.Bus]: 4,
  [VehicleType.Car]: 5,
};

export const JUNCTION_IDS: JunctionId[] = ['A'];
export const LANE_IDS: LaneId[] = ['North', 'East', 'South', 'West'];
