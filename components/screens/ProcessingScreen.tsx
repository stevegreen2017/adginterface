import React from 'react';
import { colors } from '../../constants/theme';

export const ProcessingScreen: React.FC = () => (
  <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border border-gray-300 rounded-full mx-auto mb-6 animate-spin" style={{ borderTop: `3px solid ${colors.burgundy}` }}></div>
      <h2 className="text-2xl font-medium mb-2 text-gray-900">Registering Your Work</h2>
      <p className="text-gray-600">Embedding credentials and creating registry entry...</p>
    </div>
  </div>
);
