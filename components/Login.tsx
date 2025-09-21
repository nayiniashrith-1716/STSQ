
import React from 'react';
import { UserRole } from '../types';
import Button from './Button';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-700 text-center animate-add-vehicle">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
          Smart Automated Traffic System
        </h1>
        <p className="mt-2 text-lg text-slate-400 mb-8">
          Please select your role to proceed.
        </p>
        <div className="flex flex-col space-y-4">
          <Button onClick={() => onLogin('Authority')} className="!bg-cyan-600 hover:!bg-cyan-500">
            Login as Authority
          </Button>
          <Button onClick={() => onLogin('Operator')} className="!bg-amber-600 hover:!bg-amber-500">
            Login as Operator
          </Button>
        </div>
        <div className="mt-8 text-sm text-slate-500 text-left space-y-2">
            <div>
                <p className="font-bold text-slate-300">Authority:</p>
                <p>Full control to add vehicles, change settings, and manage the simulation.</p>
            </div>
            <div>
                <p className="font-bold text-slate-300">Operator:</p>
                <p>View-only access to the dashboard and simulation visuals.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
