import { useState } from 'react'
import { Inbox, User, Trash2, Reply, Filter } from 'lucide-react'
import { colors, surface } from '../../constants/theme'

interface Message {
  id: number
  from: string
  fromUsername: string
  subject: string
  message: string
  date: string
  time: string
  read: boolean
  project?: string
  relatedAsset?: string
}

const mockMessages: Message[] = [
  {
    id: 1,
    from: 'Marcus Rivera',
    fromUsername: 'marcus_rivera',
    subject: 'Question about your Nebula concept',
    message: 'Hey! I really love the nebula concept art you uploaded. Would it be possible to get more details about your workflow? Specifically interested in how you achieved the gas cloud effects.',
    date: '2025-10-23',
    time: '2:30 PM',
    read: false,
    project: 'Nebula Rising',
    relatedAsset: 'nebula_concept_v5.psd'
  },
  {
    id: 2,
    from: 'Sarah Chen',
    fromUsername: 'sarah_chen',
    subject: 'Collaboration opportunity',
    message: 'Hi! I came across your work on the Starship Interior project. I\'m working on a similar sci-fi project and would love to discuss potential collaboration. Let me know if you\'re interested!',
    date: '2025-10-22',
    time: '11:15 AM',
    read: false,
    project: 'Starship Interior',
    relatedAsset: 'starship_interior.tif'
  },
  {
    id: 3,
    from: 'Jordan Li',
    fromUsername: 'jordan_li',
    subject: 'Reference request',
    message: 'Hello! I\'m doing research on character design techniques and would love to reference some of your work in an upcoming presentation. Of course, full credit will be given. Would that be okay?',
    date: '2025-10-21',
    time: '4:45 PM',
    read: true,
    project: 'Nebula Rising',
    relatedAsset: 'character_sketch_aria.jpg'
  },
  {
    id: 4,
    from: 'Priya Kumar',
    fromUsername: 'priya_kumar',
    subject: 'Love your art style!',
    message: 'Just wanted to reach out and say I absolutely love your art style! The attention to detail in your environment designs is incredible. Do you have any tutorials or resources you could share?',
    date: '2025-10-20',
    time: '9:00 AM',
    read: true
  },
  {
    id: 5,
    from: 'Jane Smith',
    fromUsername: 'jane_smith',
    subject: 'Technical question',
    message: 'Hi there! I noticed you work with multiple layers in your PSD files. What\'s your typical layer organization strategy? I\'m trying to improve my own workflow.',
    date: '2025-10-19',
    time: '1:20 PM',
    read: true
  }
]

const projects = ['All Projects', 'Nebula Rising', 'Starship Interior', 'Cyber City 2084']

export default function InboxScreen() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [selectedProject, setSelectedProject] = useState('All Projects')
  const [showProjectFilter, setShowProjectFilter] = useState(false)

  const unreadCount = messages.filter(m => !m.read).length

  const filteredMessages = selectedProject === 'All Projects'
    ? messages
    : messages.filter(m => m.project === selectedProject || (!m.project && selectedProject === 'All Projects'))

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message)
    if (!message.read) {
      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, read: true } : m
      ))
    }
  }

  const handleDeleteMessage = (id: number) => {
    setMessages(messages.filter(m => m.id !== id))
    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }
  }

  const handleReply = (username: string) => {
    alert(`Reply to @${username} (feature coming soon)`)
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50">
      {/* Message List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Inbox className="w-5 h-5 text-gray-700" />
              <h1 className="text-xl font-medium text-gray-900">Inbox</h1>
            </div>
            {unreadCount > 0 && (
              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-sm">
                {unreadCount} new
              </span>
            )}
          </div>

          {/* Project Filter */}
          <div className="relative">
            <button
              onClick={() => setShowProjectFilter(!showProjectFilter)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-sm hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{selectedProject}</span>
              </div>
            </button>

            {showProjectFilter && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-sm shadow-lg z-10">
                {projects.map(project => (
                  <button
                    key={project}
                    onClick={() => {
                      setSelectedProject(project)
                      setShowProjectFilter(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                      selectedProject === project ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    {project}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No messages in this project</p>
            </div>
          ) : (
            <div>
              {filteredMessages.map(message => (
                <button
                  key={message.id}
                  onClick={() => handleSelectMessage(message)}
                  className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition ${
                    selectedMessage?.id === message.id ? 'bg-gray-50' : ''
                  } ${!message.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className={`text-sm ${!message.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {message.from}
                    </p>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className={`text-xs mb-1 ${!message.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                    {message.subject}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">{message.message}</p>
                  {message.project && (
                    <div className="mt-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-sm">
                        {message.project}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="flex-1 flex flex-col">
        {selectedMessage ? (
          <>
            {/* Message Header */}
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => alert(`Navigate to profile: ${selectedMessage.fromUsername}`)}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedMessage.from}</p>
                        <p className="text-xs text-gray-500">@{selectedMessage.fromUsername}</p>
                      </div>
                    </button>
                    <span className="text-xs text-gray-500">
                      {selectedMessage.date} at {selectedMessage.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReply(selectedMessage.fromUsername)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white rounded-sm hover:opacity-90"
                    style={{ backgroundColor: colors.burgundy }}
                  >
                    <Reply className="w-4 h-4" />
                    Reply
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>

              {selectedMessage.project && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Project:</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-sm font-medium">
                    {selectedMessage.project}
                  </span>
                </div>
              )}

              {selectedMessage.relatedAsset && (
                <div className="mt-2">
                  <span className="text-xs text-gray-600">Related asset: </span>
                  <span className="text-xs text-gray-700 font-medium">{selectedMessage.relatedAsset}</span>
                </div>
              )}
            </div>

            {/* Message Body */}
            <div className="flex-1 overflow-auto p-6">
              <div className={`${surface.base} rounded-sm p-6`}>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">Select a message to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
