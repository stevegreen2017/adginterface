import React from 'react';
import { Shield } from 'lucide-react';
import { colors } from '../../constants/theme';

interface HeaderProps {
  onNavigateToRegister: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateToRegister }) => (
  <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
    <div className="flex items-center">
      <div
        className="w-9 h-9 rounded-sm flex items-center justify-center text-white"
        style={{ backgroundColor: colors.burgundy }}
      >
        <Shield className="w-5 h-5" />
      </div>
      <div className="ml-3">
        <div className="text-lg font-medium text-gray-900 tracking-tight">StableShield</div>
        <div className="text-[11px] text-gray-500">Powered by STABILITY</div>
      </div>
    </div>
    <div className="flex items-center space-x-6">
      <button onClick={onNavigateToRegister} className="text-sm text-gray-700 hover:text-gray-900">Register</button>
      <button className="text-sm text-gray-700 hover:text-gray-900">Help</button>
      <div className="flex items-center space-x-2">
        <div className="text-right mr-2">
          <div className="text-sm font-medium text-gray-900">Alex Chen</div>
          <div className="text-xs text-gray-500">alex@adg.org</div>
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-sm">AC</div>
      </div>
    </div>
  </div>
);
