import React from 'react';
import { colors } from '../../constants/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<ButtonProps> = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`px-5 py-2 text-white rounded-sm text-sm ${className}`}
    style={{ backgroundColor: colors.burgundy }}
  >
    {children}
  </button>
);

export const SecondaryButton: React.FC<ButtonProps> = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`px-5 py-2 border border-gray-300 text-gray-800 rounded-sm text-sm hover:bg-gray-50 ${className}`}
  >
    {children}
  </button>
);
