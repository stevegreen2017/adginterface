import { useState } from 'react';
import { Header, Sidebar } from '../components/ui';
import { MyWorkScreen, RegisterScreen, ProcessingScreen, SuccessScreen, DetailScreen, InboxScreen } from '../components/screens';
import MyProjects from '../components/screens/ProjectScreen';
import SearchScreen from '../components/screens/SearchScreen';
import { Asset, Credential, Activity, Screen } from '../types';

// Mock projects data
const mockProjects = [
  {
    id: 1,
    name: 'Nebula Rising',
    code: 'NEB-R',
    assets: 127,
    status: 'Active' as const,
    lastActivity: 'Today 09:14',
    isAdmin: true,
    members: [
      { id: 1, name: 'Alex Chen', role: 'Art Director', dept: 'Art Direction', email: 'alex@adg.org' },
      { id: 2, name: 'Marcus Rivera', role: 'Matte Painter', dept: 'Illustration', email: 'marcus@studio.com' },
      { id: 3, name: 'Sarah Chen', role: 'Concept Artist', dept: 'Illustration', email: 'sarah@agency.com' },
      { id: 4, name: 'Jordan Li', role: 'Pre-viz Lead', dept: 'Pre-viz', email: 'jordan@previs.io' },
    ],
  },
  {
    id: 2,
    name: 'Starship Interior',
    code: 'SSI',
    assets: 64,
    status: 'Active' as const,
    lastActivity: 'Yesterday 18:22',
    isAdmin: false,
    members: [
      { id: 5, name: 'You', role: 'Illustrator', dept: 'Illustration', email: 'you@adg.org' },
      { id: 6, name: 'Priya Kumar', role: 'Storyboard', dept: 'Story', email: 'priya@studio.com' },
    ],
  },
  {
    id: 3,
    name: 'Cyber City 2084',
    code: 'CC-84',
    assets: 89,
    status: 'On Hold' as const,
    lastActivity: '2 weeks ago',
    isAdmin: false,
    members: [
      { id: 7, name: 'Jane Smith', role: 'Concept Artist', dept: 'Illustration', email: 'jane@agency.com' },
      { id: 8, name: 'Mike Johnson', role: 'Environment Artist', dept: 'Illustration', email: 'mike@studio.com' },
    ],
  },
];

const StableShield = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('mywork');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedProject, setSelectedProject] = useState(mockProjects[0]);

  const myAssets: Asset[] = [
    { id: 1, name: 'nebula_concept_v5.psd', type: 'Concept Art', registered: '2025-10-18', views: 342, references: 12, contributions: 1, verified: true },
    { id: 2, name: 'starship_interior.tif', type: 'Environment Design', registered: '2025-10-15', views: 189, references: 8, contributions: 1, verified: true },
    { id: 3, name: 'character_sketch_aria.jpg', type: 'Character Design', registered: '2025-10-12', views: 521, references: 24, contributions: 1, verified: true },
  ];

  const myCredentials: Credential[] = [
    { name: 'Account Verified', earned: true },
    { name: 'Protected 10 Assets', earned: true },
    { name: 'Collaborative Creator', earned: true },
    { name: 'Referenced 50 Times', earned: false },
    { name: 'Community Leader', earned: false },
  ];

  const recentActivity: Activity[] = [
    { user: 'Marcus R.', action: 'referenced your work', asset: 'nebula_concept_v5', time: '2 hours ago' },
    { user: 'Sarah C.', action: 'contributed to', asset: 'starship_interior', time: '5 hours ago' },
    { user: 'Jordan L.', action: 'viewed your portfolio', asset: null, time: '1 day ago' },
    { user: 'Alex K.', action: 'referenced your work', asset: 'character_sketch_aria', time: '2 days ago' },
  ];

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    if (screen !== 'detail') {
      setSelectedAsset(null);
    }
  };

  const handleNavigateToDetail = (asset: Asset) => {
    setSelectedAsset(asset);
    setCurrentScreen('detail');
  };

  const handleNavigateToRegister = () => {
    setCurrentScreen('register');
  };

  const handleNavigateToMyWork = () => {
    setCurrentScreen('mywork');
  };

  const handleNavigateToProcessing = () => {
    setCurrentScreen('processing');
    setTimeout(() => setCurrentScreen('success'), 2000);
  };

  const handleSelectProject = (project: typeof mockProjects[0]) => {
    setSelectedProject(project);
    setCurrentScreen('projects');
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#f6f6f6' }}>
      <Header onNavigateToRegister={handleNavigateToRegister} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentScreen={currentScreen} 
          onNavigate={handleNavigate}
          projects={mockProjects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
        />
        {currentScreen === 'mywork' && (
          <MyWorkScreen
            assets={myAssets}
            credentials={myCredentials}
            recentActivity={recentActivity}
            onNavigateToRegister={handleNavigateToRegister}
            onNavigateToDetail={handleNavigateToDetail}
          />
        )}
        {currentScreen === 'register' && (
          <RegisterScreen
            onNavigateToMyWork={handleNavigateToMyWork}
            onNavigateToProcessing={handleNavigateToProcessing}
          />
        )}
        {currentScreen === 'processing' && <ProcessingScreen />}
        {currentScreen === 'success' && (
          <SuccessScreen onNavigateToMyWork={handleNavigateToMyWork} />
        )}
        {currentScreen === 'detail' && selectedAsset && (
          <DetailScreen
            asset={selectedAsset}
            onNavigateToMyWork={handleNavigateToMyWork}
          />
        )}
        {currentScreen === 'projects' && (
          <MyProjects 
            projects={mockProjects}
            selectedProject={selectedProject}
            onSelectProject={handleSelectProject}
            onRegisterWork={() => setCurrentScreen('register')} 
          />
        )}
        {currentScreen === 'search' && <SearchScreen />}
        {currentScreen === 'inbox' && <InboxScreen />}
      </div>
    </div>
  );
};

export default StableShield;
