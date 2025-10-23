import React from 'react';
import { Check, Copy, Eye } from 'lucide-react';
import { colors, surface } from '../../constants/theme';
import { PrimaryButton, SecondaryButton, QRMock } from '../ui';

interface SuccessScreenProps {
  onNavigateToMyWork: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onNavigateToMyWork }) => {
  const [copied, setCopied] = React.useState(false);
  const registryUrl = 'stableshield.com/verify/SS-2025-10821';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`https://${registryUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#e7f5ee' }}>
          <Check className="w-10 h-10" style={{ color: '#0f766e' }} />
        </div>
        <h2 className="text-3xl font-medium mb-4 text-gray-900">Work Successfully Registered</h2>
        <p className="text-gray-600 mb-8">Your creation is now timestamped and stored in the StableShield network</p>

        <div className={`${surface.base} p-8 rounded-sm mb-8 text-left`}>
          <div className="grid grid-cols-2 gap-6">
            <div><span className="text-xs text-gray-600 block mb-1">File</span><span className="font-medium text-gray-900">cosmic_vista_final.psd</span></div>
            <div><span className="text-xs text-gray-600 block mb-1">Creator</span><span className="font-medium text-gray-900">Alex Chen</span></div>
            <div><span className="text-xs text-gray-600 block mb-1">Registered</span><span className="font-medium text-gray-900">Oct 21, 2025 2:47 PM</span></div>
            <div><span className="text-xs text-gray-600 block mb-1">Registry ID</span><span className="font-medium" style={{ color: colors.burgundy }}>SS-2025-10821</span></div>
          </div>

          <div className="mt-6 p-4 rounded-sm border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="text-xs text-gray-800 font-medium mb-1">Share Your Protected Work</div>
                  <div className="text-xs text-gray-600">stableshield.com/verify/SS-2025-10821</div>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-200 rounded-sm transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className={`w-4 h-4 ${copied ? 'text-green-600' : 'text-gray-500'}`} />
                </button>
                {copied && (
                  <span className="text-xs text-green-600 font-medium">Copied!</span>
                )}
              </div>
              <QRMock size={96} />
            </div>
          </div>
        </div>

        <div className="flex space-x-4 justify-center">
          <PrimaryButton onClick={onNavigateToMyWork}>Back to My Work</PrimaryButton>
          <SecondaryButton>
            <Eye className="inline w-4 h-4 mr-2" /> View Full Details
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};
