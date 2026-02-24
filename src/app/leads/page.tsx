'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Bell, ChevronDown, MoreHorizontal, MapPin, Phone, Calendar, Filter, ArrowUpDown } from 'lucide-react';

// Types
interface Lead {
  id: string;
  customer: { name: string; address: string; phone: string };
  service_type: string;
  phone: string;
  location: string;
  status: 'new' | 'working' | 'converted';
  plumber?: { name: string };
  value: number;
  created_at: string;
  source: string;
}

interface Stats {
  total: number;
  new: number;
  working: number;
  converted: number;
}

// Mock data for demo (before DB is connected)
const mockLeads: Lead[] = [
  { id: '1', customer: { name: 'Robert S.', address: 'Brooklyn, NY' }, service_type: 'Drain Cleaning', phone: '(555) 123-4567', location: 'Brooklyn, NY', status: 'new', value: 350, created_at: '2026-02-23', source: 'website' },
  { id: '2', customer: { name: 'Sarah M.', address: 'Queens, NY' }, service_type: 'Water Heater', phone: '(555) 234-5678', location: 'Queens, NY', status: 'working', plumber: { name: 'Mike T.' }, value: 800, created_at: '2026-02-22', source: 'phone' },
  { id: '3', customer: { name: 'Mike T.', address: 'Manhattan, NY' }, service_type: 'Leak Repair', phone: '(555) 345-6789', location: 'Manhattan, NY', status: 'converted', plumber: { name: 'John D.' }, value: 450, created_at: '2026-02-21', source: 'thumbtack' },
  { id: '4', customer: { name: 'Jennifer L.', address: 'Bronx, NY' }, service_type: 'Pipe Installation', phone: '(555) 456-7890', location: 'Bronx, NY', status: 'new', value: 600, created_at: '2026-02-20', source: 'angi' },
];

const mockStats: Stats = { total: 124, new: 24, working: 18, converted: 82 };

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  working: 'bg-yellow-100 text-yellow-700', 
  converted: 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  working: 'Working',
  converted: 'Converted',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [stats, setStats] = useState<Stats>(mockStats);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [plumberFilter, setPlumberFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                         lead.phone.includes(search) ||
                         lead.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesPlumber = plumberFilter === 'all' || lead.plumber?.name.toLowerCase().includes(plumberFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesSource && matchesPlumber;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold">P</span>
            </div>
            <span className="text-lg font-semibold">PlumberOS</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4">
          {[
            { icon: '📊', label: 'Dashboard', href: '/' },
            { icon: '🎯', label: 'Leads', href: '/leads', active: true },
            { icon: '💼', label: 'Jobs', href: '/jobs' },
            { icon: '👥', label: 'Customers', href: '/customers' },
            { icon: '👤', label: 'Team', href: '/team' },
            { icon: '⚙️', label: 'Settings', href: '/settings' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                item.active 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm">AK</span>
            </div>
            <div>
              <p className="font-medium text-sm">Akshay K.</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
            <p className="text-gray-500 text-sm">Manage your potential customers</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm">New</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm">Working</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.working}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm">Converted</p>
              <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Filters:</span>
              </div>
              
              <select 
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sources</option>
                <option value="website">Website</option>
                <option value="phone">Phone</option>
                <option value="thumbtack">Thumbtack</option>
                <option value="angi">Angi</option>
              </select>

              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="working">Working</option>
                <option value="converted">Converted</option>
              </select>

              <select 
                value={plumberFilter}
                onChange={(e) => setPlumberFilter(e.target.value)}
                className="px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Plumbers</option>
                <option value="mike">Mike T.</option>
                <option value="john">John D.</option>
              </select>

              <div className="flex-1"></div>

              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition"
              >
                <Plus className="w-4 h-4" /> Add Lead
              </button>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">Customer <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {lead.customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{lead.customer.name}</div>
                          <div className="text-sm text-gray-500">{lead.customer.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.service_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                        {statusLabels[lead.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.plumber?.name || 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${lead.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.created_at}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">Showing 1-{filteredLeads.length} of {stats.total} leads</p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
                  ← Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Lead</h2>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="(555) 123-4567" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Drain Cleaning</option>
                  <option>Water Heater</option>
                  <option>Leak Repair</option>
                  <option>Pipe Installation</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Brooklyn, NY" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value ($)</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="350" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="website">Website</option>
                  <option value="phone">Phone</option>
                  <option value="thumbtack">Thumbtack</option>
                  <option value="angi">Angi</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
