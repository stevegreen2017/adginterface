import { useState } from 'react'
import { Search, User, CheckCircle, XCircle, ExternalLink, Send, Upload, Image, X } from 'lucide-react'
import { colors, surface } from '../../constants/theme'

interface SearchResult {
  id: number
  filename: string
  uploadedBy: string
  uploadDate: string
  projectName: string
  projectCode: string
  tools: string[]
  description: string
  notes: string
  aiUsed: boolean
  publiclyAvailable: boolean
  allowAITraining: boolean
  license: string
  signature: string
  verified: boolean
  networkLocation: string
}

interface UserSearchResult {
  username: string
  fullName: string
  assetsRegistered: number
  joinDate: string
  verified: boolean
  tags: Array<{ name: string; verified: boolean; type: 'org' | 'project' }>
}

// Mock search results
const mockAssetResults: SearchResult[] = [
  {
    id: 1,
    filename: 'nebula_concept_v5.psd',
    uploadedBy: 'alex_chen',
    uploadDate: '2025-10-18',
    projectName: 'Nebula Rising',
    projectCode: 'NEB-2025',
    tools: ['Photoshop', 'Blender', 'Substance Painter'],
    description: 'Concept art for nebula scene showing interstellar gas clouds and star formation',
    notes: 'Used NASA reference images for scientific accuracy. Multiple layers for post-processing flexibility.',
    aiUsed: false,
    publiclyAvailable: true,
    allowAITraining: false,
    license: 'Creative Commons Attribution',
    signature: '0x4a7b...9f2c',
    verified: true,
    networkLocation: 'Node US-West-2 • Shard A7B3'
  },
  {
    id: 2,
    filename: 'character_aria_final.png',
    uploadedBy: 'sarah_lopez',
    uploadDate: '2025-10-15',
    projectName: 'Cyber City 2084',
    projectCode: 'CC-2084',
    tools: ['Photoshop', 'ZBrush', 'Maya'],
    description: 'Main character design for cyberpunk protagonist Aria Chen',
    notes: 'Final approved version with armor details and color variants included in layers.',
    aiUsed: true,
    publiclyAvailable: true,
    allowAITraining: true,
    license: 'All Rights Reserved',
    signature: '0x8c3d...1a4e',
    verified: true,
    networkLocation: 'Node EU-Central-1 • Shard C2F9'
  }
]

const mockUserResults: UserSearchResult[] = [
  { 
    username: 'alex_chen', 
    fullName: 'Alex Chen', 
    assetsRegistered: 47, 
    joinDate: '2024-03-15', 
    verified: true,
    tags: [
      { name: 'ADG', verified: true, type: 'org' },
      { name: 'Nebula Rising', verified: true, type: 'project' }
    ]
  },
  { 
    username: 'marcus_rivera', 
    fullName: 'Marcus Rivera', 
    assetsRegistered: 34, 
    joinDate: '2024-06-10', 
    verified: true,
    tags: [
      { name: 'Nebula Rising', verified: true, type: 'project' },
      { name: 'Adobe', verified: false, type: 'org' }
    ]
  },
  { 
    username: 'sarah_chen', 
    fullName: 'Sarah Chen', 
    assetsRegistered: 56, 
    joinDate: '2023-11-08', 
    verified: true,
    tags: [
      { name: 'MPEG', verified: true, type: 'org' },
      { name: 'Nebula Rising', verified: true, type: 'project' }
    ]
  },
  { 
    username: 'jordan_li', 
    fullName: 'Jordan Li', 
    assetsRegistered: 28, 
    joinDate: '2024-08-22', 
    verified: true,
    tags: [
      { name: 'ADG', verified: true, type: 'org' },
      { name: 'Nebula Rising', verified: true, type: 'project' },
      { name: 'Titanic', verified: false, type: 'project' }
    ]
  },
  { 
    username: 'priya_kumar', 
    fullName: 'Priya Kumar', 
    assetsRegistered: 19, 
    joinDate: '2025-01-05', 
    verified: false,
    tags: [
      { name: 'Starship Interior', verified: true, type: 'project' }
    ]
  },
  { 
    username: 'jane_smith', 
    fullName: 'Jane Smith', 
    assetsRegistered: 42, 
    joinDate: '2024-02-14', 
    verified: true,
    tags: [
      { name: 'Adobe', verified: false, type: 'org' }
    ]
  },
  { 
    username: 'mike_johnson', 
    fullName: 'Mike Johnson', 
    assetsRegistered: 31, 
    joinDate: '2024-04-30', 
    verified: true,
    tags: [
      { name: 'MPEG', verified: true, type: 'org' },
      { name: 'Starship Interior', verified: true, type: 'project' }
    ]
  },
]

const mockImages = [
  { id: 1, name: 'Image1', filename: 'mountain_landscape.jpg', inDatabase: false },
  { id: 2, name: 'Image2', filename: 'nebula_concept_v5.psd', inDatabase: true }
]

export default function SearchScreen() {
  const [searchType, setSearchType] = useState<'image' | 'user'>('image')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [showImageSelection, setShowImageSelection] = useState(false)
  const [matchType, setMatchType] = useState<'similar' | 'exact'>('similar')
  const [usernameQuery, setUsernameQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [userResults, setUserResults] = useState<UserSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [contactMessage, setContactMessage] = useState('')
  const [showContactForm, setShowContactForm] = useState<number | null>(null)

  const handleImageSearch = () => {
    if (!selectedImage) return
    
    setIsSearching(true)
    setTimeout(() => {
      const imageData = mockImages.find(img => img.id === selectedImage)
      if (imageData?.inDatabase) {
        // Image2 is in the database
        if (matchType === 'exact') {
          setSearchResults([mockAssetResults[0]]) // Only exact match
        } else {
          setSearchResults(mockAssetResults) // All similar matches
        }
      } else {
        // Image1 is not in the database
        setSearchResults([])
      }
      setIsSearching(false)
    }, 1500)
  }

  const handleUsernameSearch = () => {
    if (usernameQuery.trim()) {
      setIsSearching(true)
      setTimeout(() => {
        const filtered = mockUserResults.filter(u => 
          u.username.toLowerCase().includes(usernameQuery.toLowerCase()) ||
          u.fullName.toLowerCase().includes(usernameQuery.toLowerCase())
        )
        setUserResults(filtered)
        setIsSearching(false)
      }, 800)
    }
  }

  const clearImageSearch = () => {
    setSelectedImage(null)
    setSearchResults([])
    setSelectedResult(null)
    setContactMessage('')
    setShowContactForm(null)
    setShowImageSelection(false)
  }

  const handleSendMessage = () => {
    // Simulate sending message
    alert(`Message sent to creator!\n\n"${contactMessage}"`)
    setContactMessage('')
    setShowContactForm(null)
  }

  const clearUserSearch = () => {
    setUsernameQuery('')
    setUserResults([])
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Search className="w-4 h-4 text-gray-700" />
          <h1 className="text-xl font-medium text-gray-900">Search Registry</h1>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        {/* Search Type Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <button
            onClick={() => {
              setSearchType('image')
              clearUserSearch()
            }}
            className={`px-4 py-2 text-sm rounded-sm font-medium ${
              searchType === 'image'
                ? 'text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            style={searchType === 'image' ? { backgroundColor: colors.burgundy } : {}}
          >
            Search by Image
          </button>
          <button
            onClick={() => {
              setSearchType('user')
              clearImageSearch()
            }}
            className={`px-4 py-2 text-sm rounded-sm font-medium ${
              searchType === 'user'
                ? 'text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            style={searchType === 'user' ? { backgroundColor: colors.burgundy } : {}}
          >
            Search by Username
          </button>
        </div>

        {/* Image Search */}
        {searchType === 'image' && (
          <div>
            <div className="space-y-6">
              {/* Match Type Toggle */}
              <div className={`${surface.base} rounded-sm p-4`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Search Mode</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMatchType('similar')}
                      className={`px-3 py-1.5 text-xs rounded-sm ${
                        matchType === 'similar'
                          ? 'text-white font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={matchType === 'similar' ? { backgroundColor: colors.burgundy } : {}}
                    >
                      Show Similar Images
                    </button>
                    <button
                      onClick={() => setMatchType('exact')}
                      className={`px-3 py-1.5 text-xs rounded-sm ${
                        matchType === 'exact'
                          ? 'text-white font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={matchType === 'exact' ? { backgroundColor: colors.burgundy } : {}}
                    >
                      Exact Match
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Section */}
              <div
                className="bg-white border-2 border-dashed border-gray-300 rounded-sm p-8 md:p-16 text-center hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setShowImageSelection(true)}
              >
                <div className="w-16 h-16 mx-auto mb-4 border border-gray-300 rounded-sm flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-900">Drop your file here or click to browse</h3>
                <p className="text-sm text-gray-600">Supports PNG, JPG, PSD, TIFF and more</p>
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
                      <h3 className="text-lg font-medium text-gray-900">Select Image to Search</h3>
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
                            setSelectedImage(Number(e.target.value))
                            setShowImageSelection(false)
                            setTimeout(() => handleImageSearch(), 100)
                          }}
                          className="mr-3 w-4 h-4"
                          style={{ accentColor: colors.burgundy }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{image.name}</div>
                          <div className="text-xs text-gray-600">{image.filename}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {image.inDatabase ? 'In database' : 'Not in database'}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isSearching && (
              <div className={`${surface.base} rounded-sm p-8 mt-6`}>
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.burgundy }} />
                  <p className="text-sm text-gray-600">Searching registry...</p>
                </div>
              </div>
            )}

            {/* No Results */}
            {!isSearching && selectedImage && searchResults.length === 0 && (
              <div className={`${surface.base} rounded-sm p-8 mt-6 text-center`}>
                <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Found</h3>
                <p className="text-sm text-gray-600">This image is not registered in our database.</p>
              </div>
            )}

            {/* Search Results */}
            {!isSearching && searchResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {matchType === 'exact' ? 'Exact Match Found' : `${searchResults.length} Similar Image${searchResults.length !== 1 ? 's' : ''} Found`}
                </h3>
                <div className="grid gap-4">
                  {searchResults.map((result, index) => (
                    <div key={result.id} className={`${surface.base} rounded-sm overflow-hidden`}>
                      <div className="p-4">
                        <div className="flex items-start gap-4 mb-3">
                          {/* Thumbnail */}
                          {matchType === 'similar' && (
                            <div className={`w-24 h-24 rounded-sm flex-shrink-0 flex items-center justify-center ${
                              index === 0 ? 'bg-gradient-to-br from-green-400 to-teal-500' : 'bg-gradient-to-br from-blue-400 to-purple-500'
                            }`}>
                              <Image className="w-8 h-8 text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-base font-medium text-gray-900">{result.filename}</h4>
                              {result.verified && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                              {matchType === 'similar' && index > 0 && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-sm">
                                  {95 - index * 3}% match
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Uploaded by{' '}
                              <button
                                onClick={() => alert(`Navigate to profile: ${result.uploadedBy}`)}
                                className="text-gray-900 hover:underline font-medium"
                              >
                                @{result.uploadedBy}
                              </button>
                              {' '}• {result.uploadDate}
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedResult(selectedResult?.id === result.id ? null : result)}
                            className="text-sm text-gray-600 hover:text-gray-900 underline"
                          >
                            {selectedResult?.id === result.id ? 'Hide Details' : 'View Details'}
                          </button>
                        </div>

                        {selectedResult?.id === result.id && (
                          <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Project</p>
                                <p className="text-sm text-gray-900">{result.projectName} ({result.projectCode})</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1">License</p>
                                <p className="text-sm text-gray-900">{result.license}</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-gray-600 mb-1">Description</p>
                              <p className="text-sm text-gray-900">{result.description}</p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-600 mb-1">Notes</p>
                              <p className="text-sm text-gray-900">{result.notes}</p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-600 mb-1">Tools Used</p>
                              <div className="flex flex-wrap gap-1">
                                {result.tools.map((tool) => (
                                  <span key={tool} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-sm">
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-gray-600 mb-1">AI Used</p>
                                <p className="text-sm text-gray-900 flex items-center gap-1">
                                  {result.aiUsed ? (
                                    <>
                                      <CheckCircle className="w-3 h-3 text-green-600" /> Yes
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3 h-3 text-gray-400" /> No
                                    </>
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Publicly Available</p>
                                <p className="text-sm text-gray-900 flex items-center gap-1">
                                  {result.publiclyAvailable ? (
                                    <>
                                      <CheckCircle className="w-3 h-3 text-green-600" /> Yes
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3 h-3 text-gray-400" /> No
                                    </>
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Allow AI Training</p>
                                <p className="text-sm text-gray-900 flex items-center gap-1">
                                  {result.allowAITraining ? (
                                    <>
                                      <CheckCircle className="w-3 h-3 text-green-600" /> Yes
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3 h-3 text-gray-400" /> No
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-gray-600 mb-1">Digital Signature</p>
                              <p className="text-sm text-gray-900 font-mono">{result.signature}</p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-600 mb-1">Stability Network Location</p>
                              <p className="text-sm text-gray-900">{result.networkLocation}</p>
                            </div>

                            <div className="pt-2 flex gap-2">
                              <button
                                onClick={() => alert(`Navigate to profile: ${result.uploadedBy}`)}
                                className="flex items-center gap-2 px-4 py-2 text-white rounded-sm text-sm hover:opacity-90"
                                style={{ backgroundColor: colors.burgundy }}
                              >
                                <User className="w-4 h-4" />
                                View Creator Profile
                                <ExternalLink className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setShowContactForm(showContactForm === result.id ? null : result.id)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-sm text-sm hover:bg-gray-50"
                              >
                                <Send className="w-4 h-4" />
                                {showContactForm === result.id ? 'Hide Contact' : 'Contact Creator'}
                              </button>
                            </div>

                            {/* Contact Form */}
                            {showContactForm === result.id && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Contact the Creator</h4>
                                <textarea
                                  value={contactMessage}
                                  onChange={(e) => setContactMessage(e.target.value)}
                                  placeholder="Write your message here..."
                                  rows={4}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                  <button
                                    onClick={() => {
                                      setShowContactForm(null)
                                      setContactMessage('')
                                    }}
                                    className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleSendMessage()}
                                    disabled={!contactMessage.trim()}
                                    className="px-3 py-1.5 text-sm text-white rounded-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: colors.burgundy }}
                                  >
                                    Send Message
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Username Search */}
        {searchType === 'user' && (
          <div>
            <div className={`${surface.base} rounded-sm p-8`}>
              <div className="max-w-md mx-auto">
                <h2 className="text-lg font-medium text-gray-900 mb-2 text-center">Search for Creators</h2>
                <p className="text-sm text-gray-600 mb-6 text-center">
                  Find registered creators and view their profiles
                </p>

                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={usernameQuery}
                      onChange={(e) => setUsernameQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUsernameSearch()}
                      placeholder="Enter username or full name"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-sm outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                  <button
                    onClick={handleUsernameSearch}
                    className="px-4 py-2 text-white rounded-sm text-sm hover:opacity-90"
                    style={{ backgroundColor: colors.burgundy }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isSearching && (
              <div className={`${surface.base} rounded-sm p-8 mt-6`}>
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.burgundy }} />
                  <p className="text-sm text-gray-600">Searching users...</p>
                </div>
              </div>
            )}

            {/* User Results */}
            {!isSearching && userResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {userResults.length} Artist{userResults.length !== 1 ? 's' : ''} Found
                </h3>
                <div className="grid gap-3">
                  {userResults.map((user) => (
                    <button
                      key={user.username}
                      onClick={() => alert(`Navigate to profile: ${user.username}`)}
                      className={`${surface.base} rounded-sm p-4 text-left hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900">@{user.username}</p>
                              {user.verified && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{user.fullName}</p>
                            {user.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {user.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs ${
                                      tag.verified
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                                    }`}
                                  >
                                    {tag.verified && (
                                      <CheckCircle className="w-3 h-3" />
                                    )}
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="text-sm font-medium text-gray-900">{user.assetsRegistered}</p>
                          <p className="text-xs text-gray-600">assets registered</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isSearching && usernameQuery && userResults.length === 0 && (
              <div className={`${surface.base} rounded-sm p-8 mt-6 text-center`}>
                <p className="text-sm text-gray-600">No artists found matching "{usernameQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
