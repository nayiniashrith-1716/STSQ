import React from 'react';
import { UserRole } from '../types';

interface HeaderProps {
    onLogout: () => void;
    userRole: UserRole;
}

const Header: React.FC<HeaderProps> = ({ onLogout, userRole }) => {
  return (
    <header className="relative text-center border-b-2 border-cyan-400/30 pb-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        Smart Traffic Management System Using Priority Queue
      </h1>
      <p className="mt-2 text-lg text-slate-400">
        An Autonomous Priority-Based Simulation
      </p>
      <div className="absolute top-0 right-0 flex items-center gap-4">
        <span className="text-sm text-slate-400 hidden sm:inline">Role: <span className="font-bold text-cyan-400">{userRole}</span></span>
        <button 
            onClick={onLogout}
            className="px-4 py-2 text-sm rounded-lg font-semibold text-white transition-all duration-300 bg-red-700 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/50"
        >
            Logout
        </button>
      </div>
    </header>
  );
};

export default Header;