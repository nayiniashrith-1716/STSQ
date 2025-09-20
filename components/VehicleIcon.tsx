import React from 'react';
import { VehicleType } from '../types';

interface VehicleIconProps {
  type: VehicleType;
  className?: string;
}

const VehicleIcon: React.FC<VehicleIconProps> = ({ type, className = "w-8 h-8" }) => {
  const icons: Record<VehicleType, JSX.Element> = {
    [VehicleType.Ambulance]: (
      <svg xmlns="http://www.w.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="5" width="22" height="14" rx="2" fill="#f1f5f9" stroke="#475569" />
        <path d="M7 19V5" stroke="#475569" /> <path d="M17 19V5" stroke="#475569" />
        <circle cx="6" cy="19" r="2" fill="#1e293b" /> <circle cx="18" cy="19" r="2" fill="#1e293b" />
        {/* Medical Cross */}
        <path d="M10.5 10.5h3" stroke="#ef4444" strokeWidth="2"/> <path d="M12 9v3" stroke="#ef4444" strokeWidth="2"/>
        {/* Siren */}
        <path d="M9 3h6v2H9z" className="animate-flash-red" />
      </svg>
    ),
    [VehicleType.FireTruck]: (
       <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="10" width="22" height="9" rx="2" fill="#b91c1c" stroke="#1e293b" />
        <path d="M1 10V6a2 2 0 0 1 2-2h11l4 6" fill="#dc2626" stroke="#1e293b" />
        <circle cx="7" cy="19" r="2" fill="#1e293b" /> <circle cx="17" cy="19" r="2" fill="#1e293b" />
        {/* Ladder */}
        <path d="M4 10h16M7 10V7M12 10V7M17 10V7" stroke="#e2e8f0" />
        {/* Siren */}
        <path d="M6 4h2v2H6z" className="animate-flash-amber" />
      </svg>
    ),
    [VehicleType.Police]: (
       <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1,15.5 C1,14.4 1.9,13.5 3,13.5 H21 C22.1,13.5 23,14.4 23,15.5 V18.5 C23,19.6 22.1,20.5 21,20.5 H3 C1.9,20.5 1,19.6 1,18.5 Z" fill="#f8fafc" stroke="#1e293b" />
        <path d="M4.5,13.5 C4.5,9.9 7.4,7 11,7 H13 C16.6,7 19.5,9.9 19.5,13.5 Z" fill="#0f172a" stroke="#1e293b" />
        <circle cx="6" cy="20" r="2" fill="#1e293b" /> <circle cx="18" cy="20" r="2" fill="#1e293b" />
        {/* Badge */}
        <path d="M12 8.5l-1.5 1.5 1.5 1.5 1.5-1.5z" fill="#fcd34d" />
        {/* Siren */}
        <path d="M9 4h6v2H9z" className="animate-flash-blue" />
      </svg>
    ),
    [VehicleType.Bus]: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="6" width="22" height="12" rx="2" fill="#f59e0b" stroke="#1e293b"/>
        <path d="M1 18V9" stroke="#1e293b"/> <path d="M23 18V9" stroke="#1e293b"/>
        <path d="M5 10h1M9 10h1M13 10h1M17 10h1" stroke="#1e293b" strokeWidth="1" />
        <circle cx="6" cy="20" r="2" fill="#1e293b" /> <circle cx="18" cy="20" r="2" fill="#1e293b" />
         {/* Transit sign */}
        <path d="M6 5h12v-2h-12z" fill="#4b5563" />
      </svg>
    ),
    [VehicleType.Car]: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1,15.5 C1,14.4 1.9,13.5 3,13.5 H21 C22.1,13.5 23,14.4 23,15.5 V18.5 C23,19.6 22.1,20.5 21,20.5 H3 C1.9,20.5 1,19.6 1,18.5 Z" fill="#3b82f6" stroke="#1e293b"/>
        <path d="M4.5,13.5 C4.5,9.9 7.4,7 11,7 H13 C16.6,7 19.5,9.9 19.5,13.5 Z" fill="#60a5fa" stroke="#1e293b"/>
        <circle cx="6" cy="20" r="2" fill="#1e293b" /> <circle cx="18" cy="20" r="2" fill="#1e293b" />
      </svg>
    ),
  };

  return icons[type] || <div />;
};

export default VehicleIcon;