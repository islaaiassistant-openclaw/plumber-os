'use client';

import { useState } from 'react';
import { Search, Plus, Bell, MoreHorizontal, Calendar, Clock, MapPin, User } from 'lucide-react';

// Types
interface Job {
  id: string;
  customer: { name: string; address: string };
  service_type: string;
  plumber: { name: string };
  scheduled_date: string;
  scheduled_time: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  value: number;
}

const mockJobs: Job[] = [
  { id: '1', customer: { name: 'Robert S.', address: '2841 W 11th St, Brooklyn, NY' }, service_type: 'Drain Cleaning', plumber: { name: 'Mike T.' }, scheduled_date: 'Feb 23', scheduled_time: '10:00 AM', status: 'in_progress', value: 350 },
  { id: '2', customer: { name: 'Sarah M.', address: '4523 Queens Blvd, Queens, NY' }, service_type: 'Water Heater', plumber: { name: 'John D.' }, scheduled_date: 'Feb 23', scheduled_time: '2:00 PM', status: 'scheduled', value: 800 },
  { id: '3', customer: { name: 'Mike T.', address: '891 5th Ave, Manhattan, NY' }, service_type: 'Leak Repair', plumber: { name: 'Mike T.' }, scheduled_date: 'Feb 23', scheduled_time: '4:30 PM', status: 'scheduled', value: 450 },
  { id: '4', customer: { name: 'Jennifer L.', address: '1294 Boston Rd, Bronx, NY' }, service_type: 'Pipe Installation', plumber: { name: 'John D.' }, scheduled_date: 'Feb 24', scheduled_time: '9:00 AM', status: 'scheduled', value: 600 },
  { id: '5', customer: { name: 'David B.', address: '772 Jefferson St, Brooklyn, NY' }, service_type: 'Water Heater', plumber: { name: 'Mike T.' }, scheduled_date: 'Feb 22', scheduled_time: '11:00 AM', status: 'completed', value: 750 },
];

const mockStats = { active: 8, scheduled: 12, in_progress: 6, completed: 156 };

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  const filteredJobs = mockJobs.filter(job => {
    const matchesTab = activeTab === 'all' || job.status === activeTab;
    const matchesSearch = job.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                         job.service_type.toLowerCase().includes(search.toLowerCase()) ||
                         job.plumber.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
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
            { icon: '🎯', label: 'Leads', href: '/leads' },
            { icon: '💼', label: 'Jobs', href: '/jobs', active: true },
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
            <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
            <p className="text-gray-500 text-sm">Monday, February 24, 2026</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search jobs..."
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
              <p className="text-gray-500 text-sm">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.active}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{mockStats.scheduled}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{mockStats.in_progress}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600">{mockStats.completed}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl p-1 border border-gray-200 mb-6 inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  {/* Customer Info */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                      {job.customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.customer.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {job.customer.address}
                      </div>
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="text-center px-4">
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium text-gray-900">{job.service_type}</p>
                  </div>

                  {/* Plumber */}
                  <div className="text-center px-4">
                    <p className="text-sm text-gray-500">Plumber</p>
                    <div className="flex items-center gap-1 justify-center">
                      <User className="w-3 h-3 text-gray-400" />
                      <p className="font-medium text-gray-900">{job.plumber.name}</p>
                    </div>
                  </div>

                  {/* Date/Time */}
                  <div className="text-center px-4">
                    <p className="text-sm text-gray-500">Scheduled</p>
                    <div className="flex items-center gap-1 justify-center">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <p className="font-medium text-gray-900">{job.scheduled_date}</p>
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-sm text-gray-500">{job.scheduled_time}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
                      {statusLabels[job.status]}
                    </span>
                  </div>

                  {/* Value */}
                  <div className="text-center px-4">
                    <p className="text-sm text-gray-500">Value</p>
                    <p className="font-semibold text-gray-900">${job.value}</p>
                  </div>

                  {/* Actions */}
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
