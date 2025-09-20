
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`
        px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300
        bg-cyan-600 hover:bg-cyan-500
        focus:outline-none focus:ring-4 focus:ring-cyan-500/50
        disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
