import React from 'react';
import { Shield, Upload, Search, FolderOpen, Award } from 'lucide-react';
import { colors } from '../../constants/theme';
import { Screen } from '../../types';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate }) => (
  <div className="w-64" style={{ backgroundColor: colors.charcoal }}>
    <nav className="p-6 space-y-2 text-white">
      <button
        onClick={() => onNavigate('mywork')}
        className={`w-full text-left px-4 py-2 rounded-sm flex items-center space-x-3 transition ${
          currentScreen === 'mywork' || currentScreen === 'detail' ? 'bg-gray-800' : 'hover:bg-gray-800'
        }`}
      >
        <Shield className="w-4 h-4" />
        <span className="text-sm">My Work</span>
      </button>
      <button
        onClick={() => onNavigate('register')}
        className={`w-full text-left px-4 py-2 rounded-sm flex items-center space-x-3 transition ${
          currentScreen === 'register' || currentScreen === 'processing' || currentScreen === 'success' ? 'bg-gray-800' : 'hover:bg-gray-800'
        }`}
      >
        <Upload className="w-4 h-4" />
        <span className="text-sm">Register Work</span>
      </button>
      <button className="w-full text-left px-4 py-2 rounded-sm flex items-center space-x-3 hover:bg-gray-800 transition">
        <Search className="w-4 h-4" />
        <span className="text-sm">Search Registry</span>
      </button>
      <button
        onClick={() => onNavigate('projects')}
        className={`w-full text-left px-4 py-2 rounded-sm flex items-center space-x-3 transition ${
          currentScreen === 'projects' ? 'bg-gray-800' : 'hover:bg-gray-800'
        }`}
      >
        <FolderOpen className="w-4 h-4" />
        <span className="text-sm">Projects</span>
      </button>
      <button className="w-full text-left px-4 py-2 rounded-sm flex items-center space-x-3 hover:bg-gray-800 transition">
        <Award className="w-4 h-4" />
        <span className="text-sm">Credentials</span>
      </button>
    </nav>
    <div className="px-6 pb-6 text-xs text-gray-300">
      <div className="pt-6 border-t border-gray-800 uppercase tracking-wide mb-3">This Month</div>
      <div className="space-y-2">
        <div className="flex justify-between"><span>Registered</span><span className="text-white">23</span></div>
        <div className="flex justify-between"><span>Views</span><span className="text-white">342</span></div>
        <div className="flex justify-between"><span>References</span><span className="text-white">18</span></div>
      </div>
    </div>
  </div>
);
