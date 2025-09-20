
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center border-b-2 border-cyan-400/30 pb-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        Smart Automated Traffic System
      </h1>
      <p className="mt-2 text-lg text-slate-400">
        An Autonomous Priority-Based Simulation
      </p>
    </header>
  );
};

export default Header;
