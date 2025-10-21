import React from 'react';
import { Eye, Download, Hash, Clock, Star, Users, Check } from 'lucide-react';
import { colors, surface } from '../../constants/theme';
import { SecondaryButton, QRMock } from '../ui';
import { Asset, ContributionEntry } from '../../types';

interface DetailScreenProps {
  asset: Asset;
  onNavigateToMyWork: () => void;
}

export const DetailScreen: React.FC<DetailScreenProps> = ({ asset, onNavigateToMyWork }) => {
  const contributionTimeline: ContributionEntry[] = [
    { date: '2025-10-18 09:23 AM', user: 'Alex Chen (You)', action: 'Created and registered original concept', type: 'create' },
    { date: '2025-10-19 02:15 PM', user: 'Marcus Rivera', action: 'Referenced in matte painting project', type: 'reference' },
    { date: '2025-10-20 11:30 AM', user: 'Sarah Chen', action: 'Used as concept reference for client pitch', type: 'reference' },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8 bg-white border-b border-gray-200">
        <button onClick={onNavigateToMyWork} className="text-sm text-gray-700 mb-4 hover:text-gray-900">← Back to My Work</button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium mb-2 text-gray-900">{asset.name}</h1>
            <div className="flex items-center space-x-4 text-gray-700 text-sm">
              <span className="flex items-center"><Hash className="w-4 h-4 mr-1" />{asset.type}</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />Registered {asset.registered}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <SecondaryButton><Eye className="inline w-4 h-4 mr-2" /> Preview</SecondaryButton>
            <SecondaryButton><Download className="inline w-4 h-4 mr-2" /> Download</SecondaryButton>
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className={`${surface.base} rounded-sm p-8 aspect-video flex items-center justify-center`}>
            <div className="w-16 h-16 flex items-center justify-center border border-gray-300 rounded-sm">
              <div className="w-8 h-8 bg-gray-400 rounded-sm"></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={`${surface.base} p-6 rounded-sm text-center`}>
              <div className="text-3xl font-medium text-gray-900 mb-2">{asset.views}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center"><Eye className="w-4 h-4 mr-1" />Total Views</div>
            </div>
            <div className={`${surface.base} p-6 rounded-sm text-center`}>
              <div className="text-3xl font-medium text-gray-900 mb-2">{asset.references}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center"><Star className="w-4 h-4 mr-1" />References</div>
            </div>
            <div className={`${surface.base} p-6 rounded-sm text-center`}>
              <div className="text-3xl font-medium text-gray-900 mb-2">{asset.contributions}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center"><Users className="w-4 h-4 mr-1" />Contributors</div>
            </div>
          </div>

          <div className={`${surface.base} rounded-sm p-6`}>
            <h3 className="text-lg font-medium mb-6 flex items-center text-gray-900"><Clock className="w-5 h-5 mr-2" />Activity Timeline</h3>
            <div className="space-y-4">
              {contributionTimeline.map((entry, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-sm border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">{entry.date}</div>
                  <div className="font-medium text-gray-900 mb-1">{entry.user}</div>
                  <div className="text-sm text-gray-700">{entry.action}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-sm text-white" style={{ backgroundColor: colors.burgundy }}>
            <h3 className="font-medium mb-3">Share Verification</h3>
            <p className="text-xs text-gray-100 mb-4">Anyone can verify this work's authenticity</p>
            <div className="p-3 rounded-sm mb-3 bg-white flex items-center justify-between">
              <div className="text-xs font-mono break-all text-gray-900">stableshield.com/verify/SS-2025-10392</div>
              <QRMock size={96} />
            </div>
            <button className="w-full bg-white text-gray-900 py-2 rounded-sm text-sm hover:bg-gray-100">Copy Verification Link</button>
          </div>

          <div className={`${surface.base} rounded-sm p-6`}>
            <h3 className="text-base font-medium mb-4 text-gray-900">Registration Details</h3>
            <div className="space-y-3 text-sm">
              <div className="pb-3 border-b border-gray-100"><div className="text-gray-600 mb-1">Tools Used</div><div className="font-medium text-gray-900">Adobe Photoshop 2025</div></div>
              <div className="pb-3 border-b border-gray-100"><div className="text-gray-600 mb-1">AI Assistance</div><div className="font-medium text-gray-900">None Detected</div></div>
              <div><div className="text-gray-600 mb-1">File Hash</div><div className="font-mono text-xs text-gray-500">a3f5d8e9...</div></div>
            </div>
          </div>

          <div className={`${surface.base} rounded-sm p-6`}>
            <h3 className="text-base font-medium mb-4 text-gray-900">Active Protections</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center"><Check className="w-5 h-5 mr-2" style={{ color: colors.burgundy }} /><span>Content Credentials Embedded</span></div>
              <div className="flex items-center"><Check className="w-5 h-5 mr-2" style={{ color: colors.burgundy }} /><span>Do Not Train Tag Applied</span></div>
              <div className="flex items-center"><Check className="w-5 h-5 mr-2" style={{ color: colors.burgundy }} /><span>Registry Entry Created</span></div>
              <div className="flex items-center"><Check className="w-5 h-5 mr-2" style={{ color: colors.burgundy }} /><span>Publicly Discoverable</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
