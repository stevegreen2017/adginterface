import React from 'react';
import { Upload, Check } from 'lucide-react';
import { colors, surface } from '../../constants/theme';
import { PrimaryButton, SecondaryButton } from '../ui';

interface RegisterScreenProps {
  onNavigateToMyWork: () => void;
  onNavigateToProcessing: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToMyWork,
  onNavigateToProcessing
}) => (
  <div className="flex-1 overflow-auto bg-gray-50">
    <div className="p-8 bg-white border-b border-gray-200">
      <button onClick={onNavigateToMyWork} className="text-sm text-gray-700 mb-4 hover:text-gray-900">← Back to My Work</button>
      <h1 className="text-3xl font-medium text-gray-900 tracking-tight">Register New Work</h1>
      <p className="text-gray-600 mt-2">Protect your creation and establish your authorship</p>
    </div>

    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white border border-gray-300 rounded-sm p-16 text-center mb-8 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="w-16 h-16 mx-auto mb-4 border border-gray-300 rounded-sm flex items-center justify-center">
          <Upload className="w-8 h-8 text-gray-700" />
        </div>
        <h3 className="text-lg font-medium mb-2 text-gray-900">Drop your file here or click to browse</h3>
        <p className="text-sm text-gray-600">Supports PSD, AI, TIF, PNG, JPG, BLEND, FBX, and more</p>
        <p className="text-xs text-gray-500 mt-2">Maximum file size: 500MB</p>
      </div>

      <div className={`${surface.base} rounded-sm p-6 mb-8`}>
        <h3 className="text-lg font-medium mb-6 text-gray-900">What Gets Registered</h3>
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-gray-50 rounded-sm border border-gray-200">
            <div className="flex-shrink-0 w-9 h-9 rounded-sm flex items-center justify-center text-white mr-4" style={{ backgroundColor: colors.burgundy }}>
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1 text-gray-900">Content Credentials</h4>
              <p className="text-sm text-gray-600">Your name, creation timestamp, tools used, and cryptographic signature embedded in the file</p>
            </div>
          </div>

          <div className="flex items-start p-4 bg-gray-50 rounded-sm border border-gray-200">
            <div className="flex-shrink-0 w-9 h-9 rounded-sm flex items-center justify-center text-white mr-4" style={{ backgroundColor: colors.burgundy }}>
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1 text-gray-900">Registry Entry</h4>
              <p className="text-sm text-gray-600">Permanent record in the ADG database with file hash, creation date, and your attribution</p>
            </div>
          </div>

          <div className="flex items-start p-4 bg-gray-50 rounded-sm border border-gray-200">
            <div className="flex-shrink-0 w-9 h-9 rounded-sm flex items-center justify-center text-white mr-4" style={{ backgroundColor: colors.burgundy }}>
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1 text-gray-900">Searchable Portfolio</h4>
              <p className="text-sm text-gray-600">Your work becomes discoverable and verifiable by producers, directors, and other creators</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${surface.base} rounded-sm p-6 mb-8`}>
        <h3 className="text-lg font-medium mb-6 text-gray-900">Additional Protection (Optional)</h3>
        <div className="space-y-3">
          <label className="flex items-start p-4 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 accent-[var(--burgundy)]" style={{ ['--burgundy' as any]: colors.burgundy }} />
            <div className="ml-4">
              <h4 className="font-medium mb-1 text-gray-900">Do Not Train Tag</h4>
              <p className="text-sm text-gray-600">Mark this work to opt out of AI training datasets</p>
            </div>
          </label>

          <label className="flex items-start p-4 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" className="mt-1 w-4 h-4 accent-[var(--burgundy)]" style={{ ['--burgundy' as any]: colors.burgundy }} />
            <div className="ml-4">
              <h4 className="font-medium mb-1 text-gray-900">Pixel Protection (Glaze)</h4>
              <p className="text-sm text-gray-600">Apply imperceptible changes to protect against unauthorized scraping</p>
            </div>
          </label>

          <label className="flex items-start p-4 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 accent-[var(--burgundy)]" style={{ ['--burgundy' as any]: colors.burgundy }} />
            <div className="ml-4">
              <h4 className="font-medium mb-1 text-gray-900">Make Publicly Discoverable</h4>
              <p className="text-sm text-gray-600">Allow others to find and reference your work in the StableShield directory</p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex space-x-4">
        <PrimaryButton
          onClick={onNavigateToProcessing}
          className="flex-1"
        >
          Register & Protect My Work
        </PrimaryButton>
        <SecondaryButton onClick={onNavigateToMyWork}>Cancel</SecondaryButton>
      </div>
    </div>
  </div>
);
