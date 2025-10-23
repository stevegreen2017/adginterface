import React from 'react';
import { Upload, TrendingUp, Hash, Clock, Eye, Star, Shield, ChevronRight, BadgeCheck, Zap } from 'lucide-react';
import { colors, surface } from '../../constants/theme';
import { PrimaryButton } from '../ui';
import { Asset, Credential, Activity } from '../../types';

interface MyWorkScreenProps {
  assets: Asset[];
  credentials: Credential[];
  recentActivity: Activity[];
  onNavigateToRegister: () => void;
  onNavigateToDetail: (asset: Asset) => void;
}

export const MyWorkScreen: React.FC<MyWorkScreenProps> = ({
  assets,
  credentials,
  recentActivity,
  onNavigateToRegister,
  onNavigateToDetail
}) => (
  <div className="flex-1 overflow-auto bg-gray-50">
    <div className="p-8 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-medium text-gray-900 tracking-tight mb-2">Welcome back, Alex</h1>
          <p className="text-gray-600">You have protected 23 assets this month</p>
        </div>
        <PrimaryButton onClick={onNavigateToRegister}>
          <Upload className="inline w-4 h-4 mr-2" /> Register New Work
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-5 rounded-sm">
          <div className="text-2xl font-medium text-gray-900">23</div>
          <div className="text-xs text-gray-600 mt-1">Assets Protected</div>
        </div>
        <div className="bg-white border border-gray-200 p-5 rounded-sm">
          <div className="text-2xl font-medium text-gray-900">1.2K</div>
          <div className="text-xs text-gray-600 mt-1">Total Views</div>
        </div>
        <div className="bg-white border border-gray-200 p-5 rounded-sm">
          <div className="text-2xl font-medium text-gray-900">44</div>
          <div className="text-xs text-gray-600 mt-1">References</div>
        </div>
        <div className="bg-white border border-gray-200 p-5 rounded-sm">
          <div className="text-2xl font-medium text-gray-900">12</div>
          <div className="text-xs text-gray-600 mt-1">Collaborations</div>
        </div>
      </div>
    </div>

    <div className="p-8 grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-medium text-gray-900">My Protected Work</h2>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Sorted by Recent</span>
          </div>
        </div>

        {assets.map(asset => (
          <div
            key={asset.id}
            onClick={() => onNavigateToDetail(asset)}
            className={`${surface.base} p-5 rounded-sm hover:border-gray-300 cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm">
                  <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
                </div>
                <div>
                  <div className="text-base font-medium text-gray-900">{asset.name}</div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                    <span className="flex items-center"><Hash className="w-3 h-3 mr-1" />{asset.type}</span>
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{asset.registered}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-lg font-medium text-gray-900">{asset.views}</div>
                  <div className="text-[11px] text-gray-600 flex items-center justify-center"><Eye className="w-3 h-3 mr-1" />views</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-gray-900">{asset.references}</div>
                  <div className="text-[11px] text-gray-600 flex items-center justify-center"><Star className="w-3 h-3 mr-1" />refs</div>
                </div>
                <div className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-900 rounded-sm border border-gray-300 text-xs">
                  <Shield className="w-3.5 h-3.5 mr-2" /> Protected
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className={`${surface.base} p-6 rounded-sm`}>
          <h3 className="font-medium mb-4 flex items-center text-gray-900">
            <BadgeCheck className="w-4 h-4 mr-2" style={{ color: colors.gold }} />
            Credentials
          </h3>
          <div className="space-y-2">
            {credentials.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-800">{c.name}</span>
                {c.earned ? (
                  <BadgeCheck className="w-4 h-4" style={{ color: colors.gold }} />
                ) : (
                  <span className="text-gray-400">Pending</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={`${surface.base} p-6 rounded-sm`}>
          <h3 className="font-medium mb-4 flex items-center text-gray-900">
            <Zap className="w-4 h-4 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="text-sm text-gray-800">
                <span className="font-medium">{activity.user}</span>
                <span className="text-gray-600"> {activity.action}</span>
                {activity.asset && <span className="text-gray-800"> {activity.asset}</span>}
                <span className="text-gray-500 text-xs ml-2">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
