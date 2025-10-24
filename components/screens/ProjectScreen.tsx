import { useMemo, useState } from 'react'
import {
  Folder,
  Search,
  Plus,
  BarChart3,
  UserPlus,
  UserMinus,
  Filter as FilterIcon,
} from 'lucide-react'

/** Brand tokens (solid colors only) */
const colors = {
  burgundy: '#7f2f2f',
  charcoal: '#1A1A1A',
  gold: '#C5A572', // use sparingly
}

const surface = {
  base: 'bg-white border border-gray-200',
}

/** Types */
type Member = { id: number; name: string; role: string; dept: string; email: string }
type Project = {
  id: number
  name: string
  code: string
  assets: number
  status: 'Active' | 'On Hold'
  lastActivity: string
  members: Member[]
  isAdmin: boolean
}
type Contribution = {
  id: number
  projectId: number
  asset: string
  member: string
  dept: string
  date: string // ISO yyyy-mm-dd
  references: number
  views: number
}

const seedProjects: Project[] = [
  {
    id: 1,
    name: 'Nebula Rising',
    code: 'NEB-R',
    assets: 127,
    status: 'Active',
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
    status: 'Active',
    lastActivity: 'Yesterday 18:22',
    isAdmin: false,
    members: [
      { id: 5, name: 'You', role: 'Illustrator', dept: 'Illustration', email: 'you@adg.org' },
      { id: 6, name: 'Priya Kumar', role: 'Storyboard', dept: 'Story', email: 'priya@studio.com' },
    ],
  },
]

const seedContrib: Contribution[] = [
  { id: 1, projectId: 1, asset: 'nebula_concept_v5.psd', member: 'Alex Chen', dept: 'Illustration', date: '2025-10-18', references: 12, views: 342 },
  { id: 2, projectId: 1, asset: 'matte_mk2.tif', member: 'Marcus Rivera', dept: 'Illustration', date: '2025-10-19', references: 5, views: 118 },
  { id: 3, projectId: 1, asset: 'previs_seq_02.fbx', member: 'Jordan Li', dept: 'Pre-viz', date: '2025-10-20', references: 2, views: 89 },
  { id: 4, projectId: 1, asset: 'pitch_board_01.psd', member: 'Sarah Chen', dept: 'Illustration', date: '2025-10-20', references: 4, views: 152 },
  { id: 5, projectId: 1, asset: 'ship_layout.ai', member: 'Alex Chen', dept: 'Art Direction', date: '2025-10-21', references: 9, views: 211 },

  { id: 6, projectId: 2, asset: 'ssi_blockout_v1.blend', member: 'You', dept: 'Illustration', date: '2025-10-12', references: 1, views: 45 },
  { id: 7, projectId: 2, asset: 'story_seq_A03.pdf', member: 'Priya Kumar', dept: 'Story', date: '2025-10-15', references: 3, views: 77 },
]

/** Utility: tiny sparkline path from dated counts */
function sparklinePath(points: { x: number; y: number }[], w = 160, h = 40) {
  if (!points.length) return ''
  const maxY = Math.max(...points.map(p => p.y), 1)
  const minX = Math.min(...points.map(p => p.x))
  const maxX = Math.max(...points.map(p => p.x), minX + 1)

  const scaleX = (x: number) => ((x - minX) / (maxX - minX)) * (w - 6) + 3
  const scaleY = (y: number) => h - 3 - (y / maxY) * (h - 6)

  return points
    .sort((a, b) => a.x - b.x)
    .map((p, i) => `${i ? 'L' : 'M'} ${scaleX(p.x).toFixed(1)} ${scaleY(p.y).toFixed(1)}`)
    .join(' ')
}

/** Main component */
export default function MyProjects({
  projects = seedProjects,
  selectedProject = null,
  onSelectProject = () => {},
  onRegisterWork = () => {}
}: {
  projects?: Project[]
  selectedProject?: Project | null
  onSelectProject?: (project: Project) => void
  onRegisterWork?: (projectId: number) => void
}) {
  const [contrib] = useState<Contribution[]>(seedContrib)

  const [q, setQ] = useState('')
  const [newMember, setNewMember] = useState<Partial<Member>>({ name: '', role: '', dept: '', email: '' })
  const [showAllMembers, setShowAllMembers] = useState(false)
  const [memberRoleFilter, setMemberRoleFilter] = useState('All')
  const [memberDeptFilter, setMemberDeptFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [timeRange, setTimeRange] = useState<'all' | 'week' | 'today'>('all')

  // Predefined options for role and department
  const roleOptions = ['Art Director', 'Matte Painter', 'Concept Artist', 'Illustrator', 'Storyboard', 'Pre-viz Lead', 'Environment Artist', 'Character Designer', 'Technical Artist']
  const deptOptions = ['Art Direction', 'Illustration', 'Pre-viz', 'Story', 'Character Design', 'Environment', 'Technical']


  /** Actions */
  const createProject = () => {
    const id = (projects.reduce((m, p) => Math.max(m, p.id), 0) || 0) + 1
    const proj: Project = {
      id,
      name: `New Project ${id}`,
      code: `PRJ-${id}`,
      assets: 0,
      status: 'Active',
      lastActivity: 'Just now',
      isAdmin: true,
      members: [
        { id: Date.now(), name: 'Owner', role: 'Owner', dept: 'Art Direction', email: 'owner@studio.com' },
      ],
    }
    // Note: In a real app, this would update the projects array in the parent
    // For now, we just select it
    onSelectProject(proj)
  }

  const removeMember = (mId: number) => {
    if (!selectedProject || !selectedProject.isAdmin) return
    // Note: In a real app, this would update the project in the parent
    console.log('Remove member:', mId, 'from project:', selectedProject.id)
  }

  const addMember = () => {
    if (!selectedProject || !selectedProject.isAdmin) return
    if (!newMember.name || !newMember.role || !newMember.dept) return
    // Note: In a real app, this would update the project in the parent
    console.log('Add member to project:', selectedProject.id, newMember)
    setNewMember({ name: '', role: '', dept: '', email: '' })
  }

  const openRegister = () => {
    if (!selectedProject) return
    if (onRegisterWork) onRegisterWork(selectedProject.id)
    // otherwise no-op; integrate with your app navigation
  }

  /** Dashboard data for selected project */
  const dash = useMemo(() => {
    if (!selectedProject) return null
    
    // Calculate date boundaries
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]
    
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekAgoStr = weekAgo.toISOString().split('T')[0]
    
    // Filter by project and time range
    let rows = contrib.filter(c => c.projectId === selectedProject.id)
    
    if (timeRange === 'today') {
      rows = rows.filter(c => c.date === todayStr)
    } else if (timeRange === 'week') {
      rows = rows.filter(c => c.date >= weekAgoStr)
    }
    const members = Array.from(new Set(rows.map(r => r.member)))
    const depts = Array.from(new Set(rows.map(r => r.dept)))
    const totals = {
      assets: rows.length,
      references: rows.reduce((a, r) => a + r.references, 0),
      views: rows.reduce((a, r) => a + r.views, 0),
      uniqueContributors: members.length,
    }
    // build a day->count map for sparkline
    const dayMap: Record<string, number> = {}
    rows.forEach(r => {
      dayMap[r.date] = (dayMap[r.date] || 0) + 1
    })
    const pts = Object.entries(dayMap).map(([d, count]) => ({
      x: new Date(d).getTime() / 86400000,
      y: count,
    }))
    return { rows, members, depts, totals, sparkPath: sparklinePath(pts) }
  }, [selectedProject, contrib, timeRange])

  /** Local filters in dashboard */
  const [mFilter, setMFilter] = useState('All')
  const [dFilter, setDFilter] = useState('All')
  const [searchAsset, setSearchAsset] = useState('')

  const filteredRows = useMemo(() => {
    if (!dash) return []
    return dash.rows.filter(r => {
      const okM = mFilter === 'All' || r.member === mFilter
      const okD = dFilter === 'All' || r.dept === dFilter
      const okQ = !searchAsset || r.asset.toLowerCase().includes(searchAsset.toLowerCase())
      return okM && okD && okQ
    })
  }, [dash, mFilter, dFilter, searchAsset])

  // Filter team members
  const filteredMembers = useMemo(() => {
    if (!selectedProject) return []
    console.log('=== FILTERING MEMBERS ===')
    console.log('Role filter:', memberRoleFilter)
    console.log('Dept filter:', memberDeptFilter)
    console.log('Total members:', selectedProject.members.length)
    
    const filtered = selectedProject.members.filter(m => {
      const okRole = memberRoleFilter === 'All' || m.role === memberRoleFilter
      const okDept = memberDeptFilter === 'All' || m.dept === memberDeptFilter
      const passes = okRole && okDept
      console.log(`Member: ${m.name} | Role: ${m.role} | Dept: ${m.dept} | okRole: ${okRole} | okDept: ${okDept} | passes: ${passes}`)
      return passes
    })
    
    console.log('Filtered result:', filtered.length, 'members')
    console.log('===========================')
    return filtered
  }, [selectedProject, memberRoleFilter, memberDeptFilter])

  // Show dashboard when project is selected
  if (selectedProject) {
    return (
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-4 h-4 text-gray-700" />
            <h1 className="text-xl font-medium text-gray-900">Project Dashboard</h1>
            <div className="text-xs text-gray-600">{selectedProject?.name} • {selectedProject?.code}</div>
          </div>
        </div>

        {/* Snapshot */}
        <div className="p-6 grid grid-cols-3 gap-4">
          <div className={`${surface.base} p-4 rounded-sm`}>
            <div className="text-xs text-gray-600 mb-3">Total Assets</div>
            <div className="text-2xl font-medium text-gray-900 mb-3">{dash?.totals.assets ?? 0}</div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTimeRange('all')}
                className={`px-2 py-1 text-xs rounded-sm ${
                  timeRange === 'all'
                    ? 'text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={timeRange === 'all' ? { backgroundColor: colors.burgundy } : {}}
              >
                All Time
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-2 py-1 text-xs rounded-sm ${
                  timeRange === 'week'
                    ? 'text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={timeRange === 'week' ? { backgroundColor: colors.burgundy } : {}}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('today')}
                className={`px-2 py-1 text-xs rounded-sm ${
                  timeRange === 'today'
                    ? 'text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={timeRange === 'today' ? { backgroundColor: colors.burgundy } : {}}
              >
                Today
              </button>
            </div>
          </div>
          <div className={`${surface.base} p-4 rounded-sm`} style={showAllMembers ? { border: `2px solid ${colors.burgundy}` } : {}}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600">Team Members</div>
              <button
                onClick={() => setShowAllMembers(!showAllMembers)}
                className="text-xs text-gray-600 hover:text-gray-900 underline"
              >
                {showAllMembers ? 'Hide' : 'View All'}
              </button>
            </div>
            <div className="text-2xl font-medium text-gray-900">{selectedProject?.members.length ?? 0}</div>
          </div>
          <div className={`${surface.base} p-4 rounded-sm`}>
            <div className="text-xs text-gray-600">Last Activity</div>
            <div className="text-2xl font-medium text-gray-900">{selectedProject?.lastActivity ?? 'N/A'}</div>
          </div>
        </div>

        {/* Team Members List (when expanded) */}
        {showAllMembers && (
          <div className="px-6 pb-6">
            <div className={`${surface.base} rounded-sm`}>
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-900">Team Members</div>
                  <select
                    value={memberRoleFilter}
                    onChange={e => {
                      console.log('>>> ROLE CHANGED:', e.target.value)
                      setMemberRoleFilter(e.target.value)
                    }}
                    className="text-xs border border-gray-300 rounded-sm px-2 py-1"
                  >
                    <option value="All">All Roles</option>
                    {roleOptions.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <select
                    value={memberDeptFilter}
                    onChange={e => {
                      console.log('>>> DEPT CHANGED:', e.target.value)
                      setMemberDeptFilter(e.target.value)
                    }}
                    className="text-xs border border-gray-300 rounded-sm px-2 py-1"
                  >
                    <option value="All">All Depts</option>
                    {deptOptions.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      console.log('>>> CLEAR FILTERS')
                      setMemberRoleFilter('All')
                      setMemberDeptFilter('All')
                    }}
                    className="text-xs text-gray-600 hover:text-gray-900 underline"
                  >
                    Clear
                  </button>
                </div>
                {selectedProject?.isAdmin && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-3 py-2 text-white rounded-sm text-sm flex items-center"
                    style={{ backgroundColor: colors.burgundy }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" /> Add Member
                  </button>
                )}
              </div>
              <div className="divide-y divide-gray-200">
                {filteredMembers.map(m => (
                  <div key={m.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{m.name}</div>
                      <div className="text-xs text-gray-600">{m.role} • {m.dept}</div>
                    </div>
                    {selectedProject?.isAdmin ? (
                      <button
                        onClick={() => removeMember(m.id)}
                        className="text-xs text-gray-700 border border-gray-300 rounded-sm px-2 py-1 hover:bg-gray-50 flex items-center"
                      >
                        <UserMinus className="w-3.5 h-3.5 mr-1" /> Remove
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500">Viewer</span>
                    )}
                  </div>
                ))}
                {!filteredMembers.length && (
                  <div className="px-4 py-8 text-sm text-gray-500">No members match the filters</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sparkline + quick actions */}
        {!showAllMembers && (
        <div className="px-6 grid grid-cols-3 gap-6">
          <div className={`${surface.base} rounded-sm p-4 col-span-2`}>
            <div className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <FilterIcon className="w-4 h-4 mr-2" />
              Contribution timeline
            </div>
            <svg width="100%" height="48" viewBox="0 0 160 40" preserveAspectRatio="none">
              <path d={dash?.sparkPath || ''} fill="none" stroke={colors.burgundy} strokeWidth="2" />
            </svg>
            <div className="text-xs text-gray-600 mt-1">Daily asset additions across the selected project</div>
          </div>

          <div className={`${surface.base} rounded-sm p-4`}>
            <div className="text-sm font-medium text-gray-900 mb-3">Quick actions</div>
            <div className="space-y-2">
              <button
                onClick={openRegister}
                className="w-full px-4 py-2 text-white rounded-sm text-sm"
                style={{ backgroundColor: colors.burgundy }}
              >
                Register new work
              </button>
            </div>
          </div>
        </div>

        )}

        {/* Table + member bars */}
        {!showAllMembers && (
        <div className="px-6 grid grid-cols-3 gap-6 py-6">
          <div className="col-span-2">
            <div className={`${surface.base} rounded-sm overflow-hidden`}>
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="text-sm font-medium text-gray-900 mb-3">Files</div>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    value={searchAsset}
                    onChange={e => setSearchAsset(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-sm bg-white outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    placeholder="Search files..."
                  />
                </div>
              </div>
              <div className="px-4 py-2 border-b border-gray-200 grid grid-cols-12 text-xs font-medium text-gray-600 uppercase">
                <div className="col-span-6">File Name</div>
                <div className="col-span-3">Contributor</div>
                <div className="col-span-2">Department</div>
                <div className="col-span-1">Date</div>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredRows.map(row => (
                  <div key={row.id} className="px-4 py-3 grid grid-cols-12 text-sm">
                    <div className="col-span-6 truncate text-gray-900">{row.asset}</div>
                    <div className="col-span-3 text-gray-700">{row.member}</div>
                    <div className="col-span-2 text-gray-700">{row.dept}</div>
                    <div className="col-span-1 text-gray-500">{row.date}</div>
                  </div>
                ))}
                {!filteredRows.length && (
                  <div className="px-4 py-8 text-sm text-gray-500">No results</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ContributionByMemberPanel rows={dash?.rows || []} selectedMember={mFilter} onMemberClick={(m) => setMFilter(mFilter === m ? 'All' : m)} />
            <DepartmentBreakdownPanel rows={dash?.rows || []} selectedDept={dFilter} onDeptClick={(d) => setDFilter(dFilter === d ? 'All' : d)} />
          </div>
        </div>
        )}

        {/* Add Member Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
            <div className="bg-white rounded-sm p-6 w-96" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Invite Team Member</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newMember.email || ''}
                    onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Role</label>
                  <select
                    value={newMember.role || ''}
                    onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm"
                  >
                    <option value="">Select Role</option>
                    {roleOptions.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Department</label>
                  <select
                    value={newMember.dept || ''}
                    onChange={e => setNewMember({ ...newMember, dept: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm"
                  >
                    <option value="">Select Dept</option>
                    {deptOptions.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-800 rounded-sm text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addMember()
                    setShowAddModal(false)
                  }}
                  className="px-4 py-2 text-white rounded-sm text-sm flex items-center"
                  style={{ backgroundColor: colors.burgundy }}
                >
                  <UserPlus className="w-4 h-4 mr-2" /> Send Invite
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    )
  }

  // Show empty state if no project selected
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Folder className="w-4 h-4 text-gray-700" />
          <h1 className="text-xl font-medium text-gray-900">My Projects</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-sm bg-white outline-none focus:ring-0 focus:border-gray-400"
              placeholder="Search projects"
            />
          </div>
          <button
            onClick={createProject}
            className="px-4 py-2 text-white rounded-sm text-sm flex items-center"
            style={{ backgroundColor: colors.burgundy }}
          >
            <Plus className="w-4 h-4 mr-2" /> Create project
          </button>
        </div>
      </div>

      <div className="p-6 overflow-auto h-[calc(100vh-140px)]">
          {selectedProject ? null : (
            <div className="text-center py-12">
              <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">No project selected</div>
              <div className="text-sm text-gray-600">Select a project from the sidebar to view details</div>
            </div>
          )}
      </div>
    </div>
  )
}

/** Panels */
function ContributionByMemberPanel({ rows, selectedMember, onMemberClick }: { rows: Contribution[], selectedMember: string, onMemberClick: (member: string) => void }) {
  const byMember = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.member] = (acc[r.member] || 0) + 1
    return acc
  }, {})
  const max = Math.max(1, ...Object.values(byMember))

  return (
    <div className={`${surface.base} rounded-sm p-4`}>
      <div className="text-sm font-medium text-gray-900 mb-3">Contribution by member</div>
      <div className="space-y-2">
        {Object.entries(byMember).map(([m, count]) => (
          <div key={m} className="text-sm">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => onMemberClick(m)}
                className={`text-left ${
                  selectedMember === m 
                    ? 'font-semibold text-gray-900' 
                    : 'text-gray-800 hover:text-gray-900'
                }`}
              >
                {m}
              </button>
              <span className="text-gray-600 text-xs">{count}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-sm overflow-hidden">
              <div className="h-2" style={{ width: `${(count / max) * 100}%`, backgroundColor: colors.burgundy }} />
            </div>
          </div>
        ))}
        {!Object.keys(byMember).length && <div className="text-xs text-gray-500">No data</div>}
      </div>
    </div>
  )
}

function DepartmentBreakdownPanel({ rows, selectedDept, onDeptClick }: { rows: Contribution[], selectedDept: string, onDeptClick: (dept: string) => void }) {
  const byDept = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.dept] = (acc[r.dept] || 0) + 1
    return acc
  }, {})
  const total = Object.values(byDept).reduce((a, n) => a + n, 0) || 1

  return (
    <div className={`${surface.base} rounded-sm p-4`}>
      <div className="text-sm font-medium text-gray-900 mb-3">Departments</div>
      <div className="space-y-2">
        {Object.entries(byDept).map(([d, count]) => (
          <div key={d} className="text-sm">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => onDeptClick(d)}
                className={`text-left ${
                  selectedDept === d 
                    ? 'font-semibold text-gray-900' 
                    : 'text-gray-800 hover:text-gray-900'
                }`}
              >
                {d}
              </button>
              <span className="text-gray-600 text-xs">{Math.round((count / total) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-sm overflow-hidden">
              <div className="h-2" style={{ width: `${(count / total) * 100}%`, backgroundColor: colors.gold }} />
            </div>
          </div>
        ))}
        {!Object.keys(byDept).length && <div className="text-xs text-gray-500">No data</div>}
      </div>
    </div>
  )
}
