import { useState } from 'react'
import { Mail, Link as LinkIcon, Edit, Eye, MousePointerClick, CheckCircle, Lock, ExternalLink, Calendar, Briefcase } from 'lucide-react'
import { colors, surface } from '../../constants/theme'

interface SocialLink {
  platform: string
  url: string
  clicks: number
}

interface Organization {
  name: string
  verified: boolean
  public: boolean
}

interface ProjectCredit {
  projectName: string
  projectCode: string
  role: string
  department: string
  contributions: number
  startDate: string
  endDate?: string
  status: 'Active' | 'Completed'
}

const mockProfile = {
  displayName: 'Alex Chen',
  username: 'alex_chen',
  bio: 'Art Director & Concept Artist specializing in sci-fi environments and character design. 10+ years in the industry working on feature films and games.',
  email: 'alex@adg.org',
  profilePicture: 'AC',
  customUrl: 'alexchen.art',
  theme: {
    primaryColor: colors.burgundy,
    backgroundColor: '#ffffff'
  }
}

const mockSocialLinks: SocialLink[] = [
  { platform: 'Portfolio', url: 'https://alexchen.art', clicks: 1247 },
  { platform: 'ArtStation', url: 'https://artstation.com/alexchen', clicks: 892 },
  { platform: 'Instagram', url: 'https://instagram.com/alexchen_art', clicks: 634 },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/alexchen', clicks: 421 },
  { platform: 'Twitter', url: 'https://twitter.com/alexchen_art', clicks: 318 }
]

const mockOrganizations: Organization[] = [
  { name: 'ADG', verified: true, public: true },
  { name: 'MPEG', verified: true, public: true },
  { name: 'Stability Network', verified: true, public: false }
]

const mockProjectCredits: ProjectCredit[] = [
  {
    projectName: 'Nebula Rising',
    projectCode: 'NEB-R',
    role: 'Art Director',
    department: 'Art Direction',
    contributions: 127,
    startDate: '2024-01',
    status: 'Active'
  },
  {
    projectName: 'Starship Interior',
    projectCode: 'SSI',
    role: 'Lead Concept Artist',
    department: 'Illustration',
    contributions: 64,
    startDate: '2024-06',
    status: 'Active'
  },
  {
    projectName: 'Cyber City 2084',
    projectCode: 'CC-84',
    role: 'Environment Artist',
    department: 'Illustration',
    contributions: 89,
    startDate: '2023-03',
    endDate: '2024-05',
    status: 'Completed'
  },
  {
    projectName: 'Deep Space Nine Remaster',
    projectCode: 'DS9-R',
    role: 'VFX Supervisor',
    department: 'Visual Effects',
    contributions: 156,
    startDate: '2022-08',
    endDate: '2023-11',
    status: 'Completed'
  }
]

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(mockProfile)
  const [socialLinks, setSocialLinks] = useState(mockSocialLinks)

  const totalProfileViews = 3847
  const totalLinkClicks = socialLinks.reduce((sum, link) => sum + link.clicks, 0)

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header with Edit Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h1 className="text-2xl font-medium text-gray-900">My Profile</h1>
          <button
            onClick={isEditing ? handleSaveProfile : handleEditToggle}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-sm text-sm hover:opacity-90"
            style={{ backgroundColor: colors.burgundy }}
          >
            {isEditing ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`${surface.base} rounded-sm p-3 md:p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Profile Views</p>
                <p className="text-2xl font-medium text-gray-900">{totalProfileViews.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className={`${surface.base} rounded-sm p-3 md:p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Link Clicks</p>
                <p className="text-2xl font-medium text-gray-900">{totalLinkClicks.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <MousePointerClick className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className={`${surface.base} rounded-sm p-4 md:p-6 mb-6`}>
          <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6 mb-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-2xl font-medium">
                {profile.profilePicture}
              </div>
              {isEditing && (
                <button className="mt-2 text-xs text-gray-600 hover:text-gray-900 underline">
                  Change photo
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Display Name</label>
                    <input
                      type="text"
                      value={profile.displayName}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Username</label>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Contact Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Custom URL</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">stableshield.io/</span>
                      <input
                        type="text"
                        value={profile.customUrl}
                        onChange={(e) => setProfile({ ...profile, customUrl: e.target.value })}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-sm outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-1">{profile.displayName}</h2>
                  <p className="text-sm text-gray-600 mb-3">@{profile.username}</p>
                  <p className="text-sm text-gray-700 mb-4">{profile.bio}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <LinkIcon className="w-4 h-4" />
                      stableshield.io/{profile.customUrl}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Organizations */}
        <div className={`${surface.base} rounded-sm p-4 md:p-6 mb-6`}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Organizations</h3>
          <div className="space-y-2">
            {mockOrganizations.map((org, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-sm text-sm ${
                    org.verified
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}>
                    {org.verified && <CheckCircle className="w-3 h-3" />}
                    {org.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  {org.public ? (
                    <>
                      <Eye className="w-3 h-3" />
                      Public
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      Private
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className={`${surface.base} rounded-sm p-4 md:p-6 mb-6`}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
          <div className="space-y-3">
            {socialLinks.map((link, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-sm hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{link.platform}</p>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </div>
                  {isEditing ? (
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...socialLinks]
                        newLinks[idx].url = e.target.value
                        setSocialLinks(newLinks)
                      }}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  ) : (
                    <p className="text-xs text-gray-600">{link.url}</p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-medium text-gray-900">{link.clicks}</p>
                  <p className="text-xs text-gray-500">clicks</p>
                </div>
              </div>
            ))}
          </div>
          {isEditing && (
            <button className="mt-3 text-sm text-gray-600 hover:text-gray-900 underline">
              + Add social link
            </button>
          )}
        </div>

        {/* Project Credits - IMDB Style */}
        <div className={`${surface.base} rounded-sm p-6`}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Credits</h3>
          <div className="space-y-4">
            {mockProjectCredits.map((credit, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-base font-medium text-gray-900">{credit.projectName}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-sm ${
                        credit.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {credit.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">{credit.role}</span> • {credit.department}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {credit.startDate} {credit.endDate ? `- ${credit.endDate}` : '- Present'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {credit.contributions} contributions
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`View ${credit.projectName} details`)}
                    className="text-xs text-gray-600 hover:text-gray-900 underline ml-4"
                  >
                    View Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
