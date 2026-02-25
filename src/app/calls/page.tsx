'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Search, Bell, Filter, Play, Pause, MoreVertical, User, Clock, CheckCircle, XCircle, Mic, MicOff, Volume2, Calendar, FileText } from 'lucide-react';

interface CallLog {
  id: string;
  customerName: string;
  phoneNumber: string;
  duration: string;
  timestamp: string;
  status: 'completed' | 'missed' | 'voicemail';
  recording?: boolean;
  transcript?: string;
  aiSummary?: string;
  outcome?: 'booked' | 'callback' | 'info' | 'not_interested';
}

const navItems = [
  { icon: '📊', label: 'Dashboard', href: '/' },
  { icon: '🎯', label: 'CRM', href: '/crm' },
  { icon: '👷', label: 'Team', href: '/team' },
  { icon: '📞', label: 'Calls', href: '/calls' },
  { icon: '📍', label: 'Map', href: '/map' },
  { icon: '👥', label: 'Customers', href: '/customers' },
  { icon: '📄', label: 'Invoices', href: '/invoices' },
  { icon: '⚙️', label: 'Settings', href: '/settings' },
];

// Sample call data
const sampleCalls: CallLog[] = [
  { id: '1', customerName: 'Robert S.', phoneNumber: '(555) 123-4567', duration: '4:32', timestamp: 'Today, 2:30 PM', status: 'completed', recording: true, transcript: 'Hi, I have a leak in my kitchen sink...', aiSummary: 'Customer reported leak. Scheduled for tomorrow 10AM.', outcome: 'booked' },
  { id: '2', customerName: 'Jennifer L.', phoneNumber: '(555) 456-7890', duration: '1:15', timestamp: 'Today, 11:45 AM', status: 'missed', recording: false },
  { id: '3', customerName: 'Mike T.', phoneNumber: '(555) 345-6789', duration: '0:45', timestamp: 'Today, 10:20 AM', status: 'voicemail', transcript: 'Please call me back about the water heater...', aiSummary: 'Voicemail about water heater issue.' },
  { id: '4', customerName: 'Sarah M.', phoneNumber: '(555) 234-5678', duration: '6:12', timestamp: 'Yesterday, 4:15 PM', status: 'completed', recording: true, transcript: 'Looking for annual maintenance...', aiSummary: 'Annual maintenance check. Scheduled for next week.', outcome: 'booked' },
  { id: '5', customerName: 'Tom H.', phoneNumber: '(555) 789-0123', duration: '2:08', timestamp: 'Yesterday, 2:00 PM', status: 'completed', recording: true, transcript: 'Just wanted some info on pricing...', aiSummary: 'Price inquiry. Sent quote via email.', outcome: 'callback' },
  { id: '6', customerName: 'Lisa K.', phoneNumber: '(555) 678-9012', duration: '0:30', timestamp: 'Yesterday, 9:30 AM', status: 'missed', recording: false },
];

const statusColors = {
  completed: 'bg-green-100 text-green-700 border-green-200',
  missed: 'bg-red-100 text-red-700 border-red-200',
  voicemail: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const outcomeColors = {
  booked: 'bg-emerald-100 text-emerald-700',
  callback: 'bg-blue-100 text-blue-700',
  info: 'bg-gray-100 text-gray-700',
  not_interested: 'bg-red-100 text-red-700',
};

export default function CallsPage() {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(true);

  const filteredCalls = sampleCalls.filter(call => {
    const matchesSearch = call.customerName.toLowerCase().includes(search.toLowerCase()) ||
      call.phoneNumber.includes(search);
    const matchesFilter = filter === 'all' || call.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalCalls = sampleCalls.length;
  const completedCalls = sampleCalls.filter(c => c.status === 'completed').length;
  const bookedCalls = sampleCalls.filter(c => c.outcome === 'booked').length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-lg font-bold">P</span>
            </div>
            <span className="text-lg font-bold">PlumberOS</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => (
            <Link 
              key={item.label} 
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === item.href 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* AI Assistant Status */}
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${aiAssistantEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-sm font-medium">AI Assistant</span>
            </div>
            <p className="text-xs text-gray-400">
              {aiAssistantEnabled ? 'Listening for incoming calls...' : 'Paused'}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">AK</span>
            </div>
            <div>
              <p className="text-sm font-medium">Akshay K.</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📞 Calls</h1>
            <p className="text-gray-500 text-sm">AI-powered call management</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search calls..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-xl relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">{totalCalls}</p>
                  <p className="text-sm text-blue-600">Total Calls</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{completedCalls}</p>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">{bookedCalls}</p>
                  <p className="text-sm text-emerald-600">Jobs Booked</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">100%</p>
                  <p className="text-sm text-purple-600">AI Transcribed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Calls</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="voicemail">Voicemails</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setAiAssistantEnabled(!aiAssistantEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                aiAssistantEnabled 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {aiAssistantEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              {aiAssistantEnabled ? 'AI Active' : 'AI Paused'}
            </button>
          </div>
        </div>

        {/* Calls List */}
        <div className="flex-1 overflow-auto p-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Phone</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Duration</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Time</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Outcome</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">AI Summary</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCalls.map(call => (
                  <tr 
                    key={call.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedCall(call)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                          {call.customerName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{call.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{call.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {call.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{call.timestamp}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[call.status]}`}>
                        {call.status === 'completed' ? '✅ Completed' : call.status === 'missed' ? '❌ Missed' : '📧 Voicemail'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {call.outcome ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${outcomeColors[call.outcome]}`}>
                          {call.outcome === 'booked' ? '📅 Booked' : call.outcome === 'callback' ? '📞 Callback' : call.outcome === 'info' ? 'ℹ️ Info' : '👋 Not Interested'}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 truncate">{call.aiSummary || 'No summary'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredCalls.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No calls found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Call Detail Sidebar */}
      {selectedCall && (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Call Details</h3>
              <button onClick={() => setSelectedCall(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {selectedCall.customerName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{selectedCall.customerName}</p>
                <p className="text-sm text-gray-500">{selectedCall.phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {/* Call Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">{selectedCall.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Timestamp</p>
                  <p className="font-semibold text-gray-900">{selectedCall.timestamp}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="font-semibold text-gray-900 capitalize">{selectedCall.status}</p>
                </div>
                {selectedCall.outcome && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Outcome</p>
                    <p className="font-semibold text-gray-900 capitalize">{selectedCall.outcome.replace('_', ' ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Summary */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">🤖</span>
                AI Summary
              </h4>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <p className="text-sm text-purple-900">{selectedCall.aiSummary || 'No AI summary available'}</p>
              </div>
            </div>

            {/* Transcript */}
            {selectedCall.transcript && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">📝</span>
                  Transcript
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-700">{selectedCall.transcript}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                <Calendar className="w-4 h-4" />
                Schedule Job
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                <FileText className="w-4 h-4" />
                Create Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
