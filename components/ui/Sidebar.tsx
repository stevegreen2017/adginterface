import React, { useState } from 'react';
import { Shield, Upload, Search, FolderOpen, Inbox, ChevronDown, ChevronRight, Folder, Archive, Plus, X } from 'lucide-react';
import { colors } from '../../constants/theme';
import { Screen } from '../../types';

type Project = {
  id: number;
  name: string;
  code: string;
  assets: number;
  status: 'Active' | 'On Hold';
  lastActivity: string;
  members: any[];
  isAdmin: boolean;
};

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  projects?: Project[];
  selectedProject?: Project | null;
  onSelectProject?: (project: Project) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentScreen, 
  onNavigate,
  projects = [],
  selectedProject,
  onSelectProject,
  isOpen,
  onClose
}) => {
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [activeExpanded, setActiveExpanded] = useState(true);
  const [archivedExpanded, setArchivedExpanded] = useState(false);

  // Separate projects by status
  const activeProjects = projects.filter(p => p.status === 'Active');
  const archivedProjects = projects.filter(p => p.status === 'On Hold');

  const handleNavigate = (screen: Screen) => {
    onNavigate(screen);
    onClose(); // Close sidebar on mobile after navigation
  };

  return (
  <>
    {/* Mobile Overlay */}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
    )}
    
    {/* Sidebar */}
    <div 
      className={`w-64 fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
      style={{ backgroundColor: colors.charcoal }}
    >
      {/* Mobile Close Button */}
      <div className="lg:hidden p-4 flex justify-end">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-sm text-white"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    <nav className="p-6 space-y-2 text-white">
      <button
        onClick={() => handleNavigate('mywork')}
        className={`w-full text-left px-4 py-2 rounded-sm flex items-center space-x-3 transition ${
          currentScreen === 'mywork' || currentScreen === 'detail' ? 'bg-gray-800' : 'hover:bg-gray-800'
        }`}
      >
        <Shield className="w-4 h-4" />
        <span className="text-sm">My Work</span>
      </button>
      <button
        onClick={() => handleNavigate('register')}
        className={`w-full text-left px-4 py-2 rounded-sm flex items-center space-x-3 transition ${
          currentScreen === 'register' || currentScreen === 'processing' || currentScreen === 'success' ? 'bg-gray-800' : 'hover:bg-gray-800'
        }`}
      >
        <Upload className="w-4 h-4" />
        <span className="text-sm">Register Work</span>
      </button>
      <button
        onClick={() => handleNavigate('search')}
        className={`w-full text-left px-4 py-2 rounded-sm flex items-center space-x-3 transition ${
          currentScreen === 'search' ? 'bg-gray-800' : 'hover:bg-gray-800'
        }`}
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search Registry</span>
      </button>

      {/* Expandable Projects Directory */}
      <div>
        <button
          onClick={() => setProjectsExpanded(!projectsExpanded)}
          className="w-full text-left px-4 py-2 rounded-sm flex items-center justify-between hover:bg-gray-800 transition"
        >
          <div className="flex items-center space-x-3">
            <FolderOpen className="w-4 h-4" />
            <span className="text-sm">Projects</span>
          </div>
          {projectsExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {projectsExpanded && (
          <div className="ml-6 space-y-1 mt-2">
            {/* Active Projects Folder */}
            <div>
              <button
                onClick={() => setActiveExpanded(!activeExpanded)}
                className="w-full text-left px-3 py-1 rounded-sm flex items-center justify-between hover:bg-gray-800 transition text-gray-300"
              >
                <div className="flex items-center space-x-2">
                  <Folder className="w-4 h-4" />
                  <span className="text-xs">Active ({activeProjects.length})</span>
                </div>
                {activeExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>

              {activeExpanded && (
                <div className="ml-6 space-y-1 mt-1">
                  {activeProjects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => onSelectProject?.(project)}
                      className={`w-full text-left px-3 py-1 rounded-sm flex items-center space-x-2 hover:bg-gray-800 transition ${
                        selectedProject?.id === project.id ? 'bg-gray-700 text-white' : 'text-gray-400'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate">{project.name}</div>
                        <div className="text-xs text-gray-500">{project.assets} assets</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Archived Projects Folder */}
            <div>
              <button
                onClick={() => setArchivedExpanded(!archivedExpanded)}
                className="w-full text-left px-3 py-1 rounded-sm flex items-center justify-between hover:bg-gray-800 transition text-gray-300"
              >
                <div className="flex items-center space-x-2">
                  <Archive className="w-4 h-4" />
                  <span className="text-xs">Archived ({archivedProjects.length})</span>
                </div>
                {archivedExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>

              {archivedExpanded && (
                <div className="ml-6 space-y-1 mt-1">
                  {archivedProjects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => onSelectProject?.(project)}
                      className={`w-full text-left px-3 py-1 rounded-sm flex items-center space-x-2 hover:bg-gray-800 transition ${
                        selectedProject?.id === project.id ? 'bg-gray-700 text-white' : 'text-gray-400'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate">{project.name}</div>
                        <div className="text-xs text-gray-500">{project.assets} assets</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="w-full text-left px-3 py-1 rounded-sm flex items-center space-x-2 hover:bg-gray-800 transition text-gray-400">
              <Plus className="w-3 h-3" />
              <span className="text-xs">Create new folder</span>
            </button>
          </div>
        )}
      </div>
      <button
        onClick={() => handleNavigate('inbox')}
        className={`w-full text-left px-4 py-2 rounded-sm flex items-center transition ${
          currentScreen === 'inbox' ? 'bg-gray-800' : 'hover:bg-gray-800'
        }`}
      >
        <div className="flex items-center space-x-3 flex-1">
          <Inbox className="w-4 h-4" />
          <span className="text-sm">Inbox</span>
        </div>
        <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-sm">3</span>
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
  </>
  );
};
