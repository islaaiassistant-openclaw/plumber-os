'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Search, Bell, Plus, MoreVertical, Phone, Mail, MapPin, Wrench, Calendar, CheckCircle, Clock, Star, Edit, Trash2, X } from 'lucide-react';

interface Plumber {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  active: boolean;
  jobsToday: number;
  rating: number;
  avatar?: string;
}

interface TeamStats {
  totalPlumbers: number;
  activeNow: number;
  jobsInProgress: number;
  completedThisWeek: number;
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

// Sample plumber data
const samplePlumbers: Plumber[] = [
  { id: '1', name: 'Mike Thompson', email: 'mike@plumberos.com', phone: '(555) 111-2222', role: 'Senior Plumber', active: true, jobsToday: 3, rating: 4.9, avatar: 'MT' },
  { id: '2', name: 'John Davis', email: 'john@plumberos.com', phone: '(555) 222-3333', role: 'Journeyman', active: true, jobsToday: 2, rating: 4.7, avatar: 'JD' },
  { id: '3', name: 'Sarah Wilson', email: 'sarah@plumberos.com', phone: '(555) 333-4444', role: 'Apprentice', active: true, jobsToday: 1, rating: 4.5, avatar: 'SW' },
  { id: '4', name: 'Tom Harris', email: 'tom@plumberos.com', phone: '(555) 444-5555', role: 'Senior Plumber', active: false, jobsToday: 0, rating: 4.8, avatar: 'TH' },
  { id: '5', name: 'Lisa Chen', email: 'lisa@plumberos.com', phone: '(555) 555-6666', role: 'Master Plumber', active: true, jobsToday: 4, rating: 5.0, avatar: 'LC' },
];

export default function TeamPage() {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlumber, setSelectedPlumber] = useState<Plumber | null>(null);
  const [plumbers, setPlumbers] = useState<Plumber[]>(samplePlumbers);
  const [newPlumber, setNewPlumber] = useState({ name: '', email: '', phone: '', role: 'Plumber' });

  const stats: TeamStats = {
    totalPlumbers: plumbers.length,
    activeNow: plumbers.filter(p => p.active).length,
    jobsInProgress: plumbers.reduce((sum, p) => sum + p.jobsToday, 0),
    completedThisWeek: 24,
  };

  const filteredPlumbers = plumbers.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  const handleAddPlumber = () => {
    if (!newPlumber.name || !newPlumber.email) return;
    
    const plumber: Plumber = {
      id: Date.now().toString(),
      ...newPlumber,
      role: newPlumber.role || 'Plumber',
      active: true,
      jobsToday: 0,
      rating: 0,
      avatar: newPlumber.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    };
    
    setPlumbers([...plumbers, plumber]);
    setNewPlumber({ name: '', email: '', phone: '', role: 'Plumber' });
    setShowAddModal(false);
  };

  const toggleActive = (id: string) => {
    setPlumbers(plumbers.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
  };

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
            <h1 className="text-2xl font-bold text-gray-900">👷 Team</h1>
            <p className="text-gray-500 text-sm">Manage your plumbers and field workers</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search team..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
              />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-4 h-4" />
              Add Plumber
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-700">{stats.totalPlumbers}</p>
              <p className="text-sm text-blue-600">Total Team</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-700">{stats.activeNow}</p>
              <p className="text-sm text-green-600">Active Now</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-orange-700">{stats.jobsInProgress}</p>
              <p className="text-sm text-orange-600">Jobs Today</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-purple-700">{stats.completedThisWeek}</p>
              <p className="text-sm text-purple-600">Completed This Week</p>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlumbers.map(plumber => (
              <div 
                key={plumber.id}
                className={`bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-xl hover:-translate-y-1 ${
                  plumber.active 
                    ? 'border-green-200 shadow-lg shadow-green-100' 
                    : 'border-gray-100 shadow-sm opacity-75'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shadow-md ${
                      plumber.active 
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' 
                        : 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                    }`}>
                      {plumber.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{plumber.name}</h3>
                      <p className="text-sm text-gray-500">{plumber.role}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-xl">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{plumber.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{plumber.email}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900">{plumber.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Wrench className="w-4 h-4" />
                    <span>{plumber.jobsToday} jobs today</span>
                  </div>
                  <button 
                    onClick={() => toggleActive(plumber.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      plumber.active 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {plumber.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Card */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all min-h-[240px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8" />
              </div>
              <p className="font-medium">Add New Plumber</p>
            </button>
          </div>
        </div>
      </main>

      {/* Add Plumber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Plumber</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  value={newPlumber.name}
                  onChange={e => setNewPlumber({...newPlumber, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  value={newPlumber.email}
                  onChange={e => setNewPlumber({...newPlumber, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@plumberos.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input 
                  type="tel" 
                  value={newPlumber.phone}
                  onChange={e => setNewPlumber({...newPlumber, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select 
                  value={newPlumber.role}
                  onChange={e => setNewPlumber({...newPlumber, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Apprentice">Apprentice</option>
                  <option value="Journeyman">Journeyman</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Senior Plumber">Senior Plumber</option>
                  <option value="Master Plumber">Master Plumber</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddPlumber}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
              >
                Add Plumber
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
