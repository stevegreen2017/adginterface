import React, { useMemo, useState } from 'react'
import {
  Folder,
  Search,
  Plus,
  BarChart3,
  FilePlus,
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

/** Optional props for integration with a parent app */
type ProjectScreenProps = {
  onNavigateToMyWork: () => void
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
  initialProjects = seedProjects,
  initialContrib = seedContrib,
  onRegisterWork = () => {}
}: {
  initialProjects?: Project[]
  initialContrib?: Contribution[]
  onRegisterWork?: (projectId: number) => void
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects ?? seedProjects)
  const [selected, setSelected] = useState<Project | null>(projects[0] ?? null)
  const [contrib, setContrib] = useState<Contribution[]>(initialContrib ?? seedContrib)

  const [view, setView] = useState<'list' | 'dashboard'>('list')
  const [q, setQ] = useState('')
  const [newMember, setNewMember] = useState<Partial<Member>>({ name: '', role: '', dept: '', email: '' })

  const filteredProjects = projects.filter(
    p => p.name.toLowerCase().includes(q.toLowerCase()) || p.code.toLowerCase().includes(q.toLowerCase())
  )

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
    setProjects(prev => [...prev, proj])
    setSelected(proj)
  }

  const removeMember = (mId: number) => {
    if (!selected || !selected.isAdmin) return
    const upd = { ...selected, members: selected.members.filter(m => m.id !== mId) }
    setSelected(upd)
    setProjects(prev => prev.map(p => (p.id === upd.id ? upd : p)))
  }

  const addMember = () => {
    if (!selected || !selected.isAdmin) return
    if (!newMember.name || !newMember.email) return
    const member: Member = {
      id: Date.now(),
      name: newMember.name,
      role: newMember.role || 'Member',
      dept: newMember.dept || 'General',
      email: newMember.email,
    } as Member
    const upd = { ...selected, members: [...selected.members, member] }
    setSelected(upd)
    setProjects(prev => prev.map(p => (p.id === upd.id ? upd : p)))
    setNewMember({ name: '', role: '', dept: '', email: '' })
  }

  const openRegister = () => {
    if (!selected) return
    if (onRegisterWork) onRegisterWork(selected.id)
    // otherwise no-op; integrate with your app navigation
  }

  /** Dashboard data for selected project */
  const dash = useMemo(() => {
    if (!selected) return null
    const rows = contrib.filter(c => c.projectId === selected.id)
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
  }, [selected, contrib])

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

  if (view === 'dashboard') {
    return (
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-4 h-4 text-gray-700" />
            <h1 className="text-xl font-medium text-gray-900">Project Dashboard</h1>
            <div className="text-xs text-gray-600">{selected?.name} • {selected?.code}</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              <input
                value={searchAsset}
                onChange={e => setSearchAsset(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-sm bg-white outline-none focus:ring-0 focus:border-gray-400"
                placeholder="Search assets"
              />
            </div>
            <select
              value={mFilter}
              onChange={e => setMFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-sm px-2 py-2"
            >
              <option>All</option>
              {dash?.members.map(m => <option key={m}>{m}</option>)}
            </select>
            <select
              value={dFilter}
              onChange={e => setDFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-sm px-2 py-2"
            >
              <option>All</option>
              {dash?.depts.map(d => <option key={d}>{d}</option>)}
            </select>
            <button
              onClick={() => setView('list')}
              className="px-3 py-2 border border-gray-300 text-gray-800 rounded-sm text-sm hover:bg-gray-50"
            >
              Back to Projects
            </button>
          </div>
        </div>

        {/* Snapshot */}
        <div className="p-6 grid grid-cols-4 gap-4">
          <div className={`${surface.base} p-4 rounded-sm`}>
            <div className="text-xs text-gray-600">Assets</div>
            <div className="text-2xl font-medium text-gray-900">{dash?.totals.assets ?? 0}</div>
          </div>
          <div className={`${surface.base} p-4 rounded-sm`}>
            <div className="text-xs text-gray-600">References</div>
            <div className="text-2xl font-medium text-gray-900">{dash?.totals.references ?? 0}</div>
          </div>
          <div className={`${surface.base} p-4 rounded-sm`}>
            <div className="text-xs text-gray-600">Views</div>
            <div className="text-2xl font-medium text-gray-900">{dash?.totals.views ?? 0}</div>
          </div>
          <div className={`${surface.base} p-4 rounded-sm`}>
            <div className="text-xs text-gray-600">Contributors</div>
            <div className="text-2xl font-medium text-gray-900">{dash?.totals.uniqueContributors ?? 0}</div>
          </div>
        </div>

        {/* Sparkline + quick actions */}
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
                onClick={() => setView('list')}
                className="w-full px-4 py-2 text-white rounded-sm text-sm"
                style={{ backgroundColor: colors.burgundy }}
              >
                Back to Projects
              </button>
              <button
                onClick={openRegister}
                className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-sm text-sm hover:bg-gray-50"
              >
                Register new work
              </button>
            </div>
          </div>
        </div>

        {/* Table + member bars */}
        <div className="px-6 grid grid-cols-3 gap-6 py-6">
          <div className="col-span-2">
            <div className={`${surface.base} rounded-sm overflow-hidden`}>
              <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-900">Contributions</div>
              <div className="divide-y divide-gray-200">
                {filteredRows.map(row => (
                  <div key={row.id} className="px-4 py-3 grid grid-cols-12 text-sm">
                    <div className="col-span-5 truncate text-gray-900">{row.asset}</div>
                    <div className="col-span-3 text-gray-700">{row.member}</div>
                    <div className="col-span-2 text-gray-700">{row.dept}</div>
                    <div className="col-span-2 text-gray-500 flex items-center justify-between">
                      <span>{row.date}</span>
                      <span className="text-xs text-gray-600">{row.references} refs</span>
                    </div>
                  </div>
                ))}
                {!filteredRows.length && (
                  <div className="px-4 py-8 text-sm text-gray-500">No results</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ContributionByMemberPanel rows={filteredRows} />
            <DepartmentBreakdownPanel rows={filteredRows} />
          </div>
        </div>
      </div>
    )
  }

  /** List view (Perforce inspired split pane) */
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

      <div className="grid grid-cols-12 gap-0 h-[calc(100vh-140px)]">
        {/* Left: list */}
        <div className="col-span-4 border-r border-gray-200 bg-white">
          <div className="divide-y divide-gray-200">
            {filteredProjects.map(p => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${selected?.id === p.id ? 'bg-gray-100' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-600">{p.code} • {p.status} • {p.assets} assets</div>
                  </div>
                  <div className="text-xs text-gray-500">{p.lastActivity}</div>
                </div>
              </button>
            ))}
            {!filteredProjects.length && (
              <div className="px-4 py-8 text-sm text-gray-500">No projects</div>
            )}
          </div>
        </div>

        {/* Right: detail */}
        <div className="col-span-8 p-6 overflow-auto">
          {selected ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-lg font-medium text-gray-900">{selected.name}</div>
                  <div className="text-xs text-gray-600">{selected.code} • {selected.status}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setView('dashboard')}
                    className="px-3 py-2 border border-gray-300 text-gray-800 rounded-sm text-sm hover:bg-gray-50 flex items-center"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" /> Project dashboard
                  </button>
                  <button
                    onClick={openRegister}
                    className="px-3 py-2 border border-gray-300 text-gray-800 rounded-sm text-sm hover:bg-gray-50 flex items-center"
                  >
                    <FilePlus className="w-4 h-4 mr-2" /> Register work
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className={`${surface.base} p-4 rounded-sm`}>
                  <div className="text-xs text-gray-600">Assets</div>
                  <div className="text-2xl font-medium text-gray-900">{selected.assets}</div>
                </div>
                <div className={`${surface.base} p-4 rounded-sm`}>
                  <div className="text-xs text-gray-600">Members</div>
                  <div className="text-2xl font-medium text-gray-900">{selected.members.length}</div>
                </div>
                <div className={`${surface.base} p-4 rounded-sm`}>
                  <div className="text-xs text-gray-600">Last activity</div>
                  <div className="text-2xl font-medium text-gray-900">{selected.lastActivity}</div>
                </div>
              </div>

              <div className={`${surface.base} rounded-sm`}>
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Members</div>
                  {selected.isAdmin && (
                    <div className="flex items-center space-x-2">
                      <input
                        placeholder="Name"
                        value={newMember.name || ''}
                        onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-sm"
                      />
                      <input
                        placeholder="Role"
                        value={newMember.role || ''}
                        onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-sm"
                      />
                      <input
                        placeholder="Dept"
                        value={newMember.dept || ''}
                        onChange={e => setNewMember({ ...newMember, dept: e.target.value })}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-sm"
                      />
                      <input
                        placeholder="Email"
                        value={newMember.email || ''}
                        onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-sm"
                      />
                      <button
                        onClick={addMember}
                        className="px-3 py-2 text-white rounded-sm text-sm flex items-center"
                        style={{ backgroundColor: colors.burgundy }}
                      >
                        <UserPlus className="w-4 h-4 mr-2" /> Add
                      </button>
                    </div>
                  )}
                </div>
                <div className="divide-y divide-gray-200">
                  {selected.members.map(m => (
                    <div key={m.id} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{m.name}</div>
                        <div className="text-xs text-gray-600">{m.role} • {m.dept} • {m.email}</div>
                      </div>
                      {selected.isAdmin ? (
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
                  {!selected.members.length && (
                    <div className="px-4 py-8 text-sm text-gray-500">No members</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-600">Select a project to view details</div>
          )}
        </div>
      </div>
    </div>
  )
}

/** Panels */
function ContributionByMemberPanel({ rows }: { rows: Contribution[] }) {
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
              <span className="text-gray-800">{m}</span>
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

function DepartmentBreakdownPanel({ rows }: { rows: Contribution[] }) {
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
              <span className="text-gray-800">{d}</span>
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
