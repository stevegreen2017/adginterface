import React, { useState } from 'react';
import { Upload, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, ChevronDown, Image, AlertTriangle, X, Send } from 'lucide-react';
import { colors, surface } from '../../constants/theme';
import { PrimaryButton, SecondaryButton } from '../ui';

interface Project {
  id: number;
  name: string;
  code: string;
  tools: string[];
  description: string;
  notes: string;
  aiUsed: boolean;
  publiclyAvailable: boolean;
  allowAITraining: boolean;
  license: string;
}

interface MetadataForm {
  selectedProject: number | null;
  tools: string[];
  description: string;
  notes: string;
  aiUsed: boolean;
  publiclyAvailable: boolean;
  allowAITraining: boolean;
  license: string;
  signature: string;
}

interface RegisterScreenProps {
  onNavigateToMyWork: () => void;
  onNavigateToProcessing: () => void;
}

// Mock project data with default settings
const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Nebula Rising',
    code: 'NEB-2025',
    tools: ['Blender', 'Photoshop', 'Substance Painter'],
    description: 'Epic space opera featuring interstellar civilizations and cosmic phenomena',
    notes: 'Client requested realistic physics and detailed star systems. Used reference materials from NASA archives.',
    aiUsed: false,
    publiclyAvailable: true,
    allowAITraining: false,
    license: 'Creative Commons Attribution'
  },
  {
    id: 2,
    name: 'Cyber City 2084',
    code: 'CC-2084',
    tools: ['Maya', 'After Effects', 'ZBrush'],
    description: 'Futuristic metropolis with neon-lit skyscrapers and flying vehicles',
    notes: 'High-detail modeling required for close-up shots. Color palette based on cyberpunk aesthetics.',
    aiUsed: true,
    publiclyAvailable: true,
    allowAITraining: true,
    license: 'All Rights Reserved'
  },
  {
    id: 3,
    name: 'Dragon\'s Lair',
    code: 'DL-2025',
    tools: ['Houdini', 'Nuke', 'Mari'],
    description: 'Fantasy adventure with mythical creatures and magical landscapes',
    notes: 'Procedural generation used for cave systems. Lighting setup optimized for dramatic reveals.',
    aiUsed: false,
    publiclyAvailable: false,
    allowAITraining: false,
    license: 'Public Domain'
  }
];

const availableTools = [
  'Photoshop', 'Illustrator', 'Blender', 'Maya', '3ds Max', 'Cinema 4D',
  'After Effects', 'Premiere Pro', 'DaVinci Resolve', 'ZBrush', 'Substance Painter',
  'Houdini', 'Nuke', 'Mari', 'Unity', 'Unreal Engine', 'Sketch', 'Figma'
];

const licenseOptions = [
  'Creative Commons Attribution',
  'Creative Commons Attribution-ShareAlike',
  'Creative Commons Attribution-NoDerivs',
  'Creative Commons Attribution-NonCommercial',
  'All Rights Reserved',
  'Public Domain'
];

const hashingAlgorithms = [
  { id: 'sha256', name: 'SHA-256', description: 'Secure Hash Algorithm 256-bit' },
  { id: 'sha3', name: 'SHA-3', description: 'Secure Hash Algorithm 3' },
  { id: 'blake2b', name: 'BLAKE2b', description: 'BLAKE2b cryptographic hash' },
  { id: 'sha1', name: 'SHA-1', description: 'Secure Hash Algorithm 1 (legacy)' }
];

const mockImages = [
  {
    id: 1,
    name: 'Image1',
    filename: 'nebula_concept.jpg',
    hash: null,
    status: 'new'
  },
  {
    id: 2,
    name: 'Image2',
    filename: 'cyber_city.png',
    hash: 'a1b2c3d4e5f6...',
    status: 'registered',
    registryInfo: {
      title: 'Cyber City 2084 - Main Render',
      owner: 'Jane Smith',
      registeredDate: '2024-03-15',
      project: 'Cyber City 2084'
    }
  }
];

const signatureOptions = [
  'Gmail',
  'ADG Member ID',
  'Biometric'
];

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="mb-8">
    <div className="flex items-center justify-center space-x-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
        <React.Fragment key={step}>
          <div className={`flex items-center space-x-2 ${step <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep
                ? 'bg-gray-900 text-white'
                : step < currentStep
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            <span className={`text-sm font-medium ${step <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
              {step === 1 ? 'Upload File' : 'Metadata'}
            </span>
          </div>
          {step < totalSteps && (
            <ChevronRight className={`w-4 h-4 ${step < currentStep ? 'text-green-600' : 'text-gray-300'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const ConfirmationPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDontShowAgain: (checked: boolean) => void;
}> = ({ isOpen, onClose, onConfirm, onDontShowAgain }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onDontShowAgain(dontShowAgain);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-sm p-6 max-w-md mx-4">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-5 h-5 text-amber-500 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">Confirm Default Settings</h3>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          You are submitting this image with the following default settings:
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <span>Content Credentials (embedded in file)</span>
          </div>
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <span>Registry Entry (permanent record)</span>
          </div>
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <span>Make Publicly Discoverable</span>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <span className="w-4 h-4 mr-2">○</span>
            <span>Do Not Train Tag (disabled)</span>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <span className="w-4 h-4 mr-2">○</span>
            <span>Pixel Protection (disabled)</span>
          </div>
        </div>

        <label className="flex items-center text-sm text-gray-600 mb-6">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="mr-2 w-4 h-4 accent-[var(--burgundy)]"
            style={{ ['--burgundy' as any]: colors.burgundy }}
          />
          Don't show me this again
        </label>

        <div className="flex space-x-3">
          <SecondaryButton onClick={onClose} className="flex-1">
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={handleConfirm} className="flex-1">
            Submit with Defaults
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToMyWork,
  onNavigateToProcessing
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedHashAlgorithm, setSelectedHashAlgorithm] = useState('sha256');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showHashOptions, setShowHashOptions] = useState(false);
  const [showImageSelection, setShowImageSelection] = useState(false);
  const [metadata, setMetadata] = useState<MetadataForm>({
    selectedProject: null,
    tools: [],
    description: '',
    notes: '',
    aiUsed: false,
    publiclyAvailable: true,
    allowAITraining: false,
    license: 'Creative Commons Attribution',
    signature: 'Gmail'
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 2));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmitWithoutMetadata = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmation(false);
    onNavigateToProcessing();
  };

  const handleProjectChange = (projectId: number) => {
    const selectedProject = mockProjects.find(p => p.id === projectId);
    if (selectedProject) {
      setMetadata(prev => ({
        ...prev,
        selectedProject: projectId,
        tools: selectedProject.tools,
        // Don't autofill description and notes as requested
        // description: selectedProject.description,
        // notes: selectedProject.notes,
        aiUsed: selectedProject.aiUsed,
        publiclyAvailable: selectedProject.publiclyAvailable,
        allowAITraining: selectedProject.allowAITraining,
        license: selectedProject.license,
        signature: prev.signature // Keep existing signature selection
      }));
    }
  };

  const updateMetadata = (field: keyof MetadataForm, value: any) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const toggleTool = (tool: string) => {
    setMetadata(prev => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter(t => t !== tool)
        : [...prev.tools, tool]
    }));
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8 bg-white border-b border-gray-200">
        <button onClick={onNavigateToMyWork} className="text-sm text-gray-700 mb-4 hover:text-gray-900">← Back to My Work</button>
        <h1 className="text-3xl font-medium text-gray-900 tracking-tight">Register New Work</h1>
        <p className="text-gray-600 mt-2">Protect your creation and establish your authorship</p>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        <StepIndicator currentStep={currentStep} totalSteps={2} />

        {currentStep === 1 && (
          <div className="space-y-8">
            {/* Hashing Algorithm - Minimal */}
            <div className="text-sm text-gray-600">
              <span>Hashing algorithm: </span>
              <span className="font-medium text-gray-900">
                {hashingAlgorithms.find(alg => alg.id === selectedHashAlgorithm)?.name}
              </span>
              <button
                onClick={() => setShowHashOptions(!showHashOptions)}
                className="ml-2 text-gray-500 hover:text-gray-900 underline"
              >
                Change
              </button>

              {/* Expandable Hash Options */}
              {showHashOptions && (
                <div className="mt-4 space-y-3">
                  {hashingAlgorithms.map(algorithm => (
                    <label key={algorithm.id} className="flex items-center p-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="hashAlgorithm"
                        value={algorithm.id}
                        checked={selectedHashAlgorithm === algorithm.id}
                        onChange={(e) => setSelectedHashAlgorithm(e.target.value)}
                        className="mr-3 w-4 h-4 accent-[var(--burgundy)]"
                        style={{ ['--burgundy' as any]: colors.burgundy }}
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{algorithm.name}</div>
                        <div className="text-xs text-gray-600">{algorithm.description}</div>
                      </div>
                    </label>
                  ))}
                  <button
                    onClick={() => setShowHashOptions(false)}
                    className="text-sm text-gray-500 hover:text-gray-900 underline"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Upload Section - Main Focus */}
            <div
              className="bg-white border-2 border-dashed border-gray-300 rounded-sm p-16 text-center hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setShowImageSelection(true)}
            >
              <div className="w-16 h-16 mx-auto mb-4 border border-gray-300 rounded-sm flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Drop your file here or click to browse</h3>
              <p className="text-sm text-gray-600">Supports PSD, AI, TIF, PNG, JPG, BLEND, FBX, and more</p>
              <p className="text-xs text-gray-500 mt-2">Maximum file size: 500MB</p>
              {selectedImage && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-sm">
                  <div className="text-sm font-medium text-gray-900">
                    Selected: {mockImages.find(img => img.id === selectedImage)?.filename}
                  </div>
                </div>
              )}
            </div>

            {/* Image Selection Modal */}
            {showImageSelection && (
              <div className="bg-white border border-gray-300 rounded-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Image className="w-5 h-5 text-gray-700 mr-3" />
                    <h3 className="text-lg font-medium text-gray-900">Select Image to Upload</h3>
                  </div>
                  <button
                    onClick={() => setShowImageSelection(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {mockImages.map(image => (
                    <label key={image.id} className="flex items-center p-3 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="selectedImage"
                        value={image.id}
                        checked={selectedImage === image.id}
                        onChange={(e) => {
                          setSelectedImage(Number(e.target.value));
                          setShowImageSelection(false);
                        }}
                        className="mr-3 w-4 h-4 accent-[var(--burgundy)]"
                        style={{ ['--burgundy' as any]: colors.burgundy }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{image.name}</div>
                        <div className="text-sm text-gray-600">{image.filename}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Registry Information for Image2 */}
                {selectedImage === 2 && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-sm">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-amber-800 mb-2">This image is already registered in the StableShield Registry</h4>
                        <div className="space-y-1 text-sm text-amber-700">
                          <div><strong>Title:</strong> Cyber City 2084 - Main Render</div>
                          <div><strong>Owner:</strong> Jane Smith</div>
                          <div><strong>Registered:</strong> March 15, 2024</div>
                          <div><strong>Project:</strong> Cyber City 2084</div>
                          <div><strong>Hash:</strong> a1b2c3d4e5f6...</div>
                        </div>
                        <div className="mt-3 flex space-x-3">
                          <button className="text-sm text-amber-800 hover:text-amber-900 underline">
                            View full registry details
                          </button>
                          <button className="text-sm text-amber-800 hover:text-amber-900 underline">
                            Contact owner
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <SecondaryButton
                onClick={handleSubmitWithoutMetadata}
                disabled={selectedImage === 2}
                className={selectedImage === 2 ? 'opacity-50 cursor-not-allowed' : ''}
                style={selectedImage === 2 ? undefined : { backgroundColor: colors.burgundy, color: 'white', borderColor: colors.burgundy }}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit without metadata
              </SecondaryButton>
              <PrimaryButton
                onClick={nextStep}
                disabled={selectedImage === 2}
                className={selectedImage === 2 ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Continue to Metadata
                <ChevronRight className="w-4 h-4 ml-2" />
              </PrimaryButton>
            </div>
            {selectedImage === 2 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-sm text-center">
                <div className="text-sm text-red-800">
                  This image is already registered in the StableShield Registry. Please upload a different image to continue.
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            {/* Image Thumbnail Section */}
            <div className="bg-white border border-gray-300 rounded-sm p-6">
              <div className="flex items-center mb-4">
                <Image className="w-5 h-5 text-gray-700 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">Uploaded Image</h3>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-32 bg-gray-100 border-2 border-gray-300 rounded-sm flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-xs text-gray-500">
                      {selectedImage ? mockImages.find(img => img.id === selectedImage)?.filename : 'No image selected'}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">Selected file:</div>
                  <div className="font-medium text-gray-900 mb-2">
                    {selectedImage ? mockImages.find(img => img.id === selectedImage)?.filename : 'None selected'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Hash: {selectedHashAlgorithm.toUpperCase()} • {selectedImage ? 'Ready for registration' : 'Select an image first'}
                  </div>
                </div>
              </div>
            </div>

            <div className={`${surface.base} rounded-sm p-6`}>
              <h3 className="text-lg font-medium mb-6 text-gray-900">Project Metadata</h3>
              <div className="space-y-6">
                {/* Project Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Project <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={metadata.selectedProject || ''}
                      onChange={(e) => handleProjectChange(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-sm bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none"
                    >
                      <option value="">Choose a project...</option>
                      {mockProjects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name} ({project.code})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tools and Software */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tools and Software Used
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTools.map(tool => (
                      <label key={tool} className="flex items-center p-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={metadata.tools.includes(tool)}
                          onChange={() => toggleTool(tool)}
                          className="mr-2 w-4 h-4 accent-[var(--burgundy)]"
                          style={{ ['--burgundy' as any]: colors.burgundy }}
                        />
                        <span className="text-sm text-gray-700">{tool}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={metadata.description}
                    onChange={(e) => updateMetadata('description', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Describe your work..."
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={metadata.notes}
                    onChange={(e) => updateMetadata('notes', e.target.value)}
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Additional notes..."
                  />
                </div>

                {/* AI Used Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-sm">
                  <div>
                    <h4 className="font-medium text-gray-900">Was AI Used in Creating This Content?</h4>
                    <p className="text-sm text-gray-600">Indicate if artificial intelligence was used in the creation process</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={metadata.aiUsed}
                      onChange={(e) => updateMetadata('aiUsed', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                  </label>
                </div>

                {/* Publicly Available Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-sm">
                  <div>
                    <h4 className="font-medium text-gray-900">Publicly Available</h4>
                    <p className="text-sm text-gray-600">Allow others to discover and reference this work</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={metadata.publiclyAvailable}
                      onChange={(e) => updateMetadata('publiclyAvailable', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                  </label>
                </div>

                {/* Allow AI Training Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-sm">
                  <div>
                    <h4 className="font-medium text-gray-900">Allow AI Training</h4>
                    <p className="text-sm text-gray-600">Permit this work to be used in AI training datasets</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={metadata.allowAITraining}
                      onChange={(e) => updateMetadata('allowAITraining', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                  </label>
                </div>

                {/* License Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License & Copyright
                  </label>
                  <div className="relative">
                    <select
                      value={metadata.license}
                      onChange={(e) => updateMetadata('license', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-sm bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none"
                    >
                      {licenseOptions.map(license => (
                        <option key={license} value={license}>
                          {license}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Signature Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Digital Signature Method <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={metadata.signature}
                      onChange={(e) => updateMetadata('signature', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-sm bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none"
                    >
                      {signatureOptions.map(signature => (
                        <option key={signature} value={signature}>
                          {signature}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose how you want to digitally sign this registration
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <SecondaryButton onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </SecondaryButton>
              <PrimaryButton onClick={onNavigateToProcessing} className="flex-1">
                Submit
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>

      <ConfirmationPopup
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSubmit}
        onDontShowAgain={(checked) => console.log('Don\'t show again:', checked)}
      />
    </div>
  );
};
