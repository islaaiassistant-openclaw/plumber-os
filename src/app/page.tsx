'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, Plus, TrendingUp, MoreHorizontal, Phone, MapPin, Clock } from 'lucide-react';

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  working: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  working: 'In Progress',
  completed: 'Completed',
};

const mockLeads = [
  { id: '1', name: 'Robert S.', service: 'Drain Cleaning', phone: '(555) 123-4567', location: 'Brooklyn, NY', status: 'new', date: 'Feb 23' },
  { id: '2', name: 'Sarah M.', service: 'Water Heater', phone: '(555) 234-5678', location: 'Queens, NY', status: 'working', date: 'Feb 22' },
  { id: '3', name: 'Mike T.', service: 'Leak Repair', phone: '(555) 345-6789', location: 'Manhattan, NY', status: 'completed', date: 'Feb 21' },
  { id: '4', name: 'Jennifer L.', service: 'Pipe Installation', phone: '(555) 456-7890', location: 'Bronx, NY', status: 'new', date: 'Feb 20' },
];

const navItems = [
  { icon: '📊', label: 'Dashboard', href: '/' },
  { icon: '🎯', label: 'CRM', href: '/crm' },
  { icon: '💼', label: 'Jobs', href: '/jobs' },
  { icon: '👥', label: 'Customers', href: '/customers' },
  { icon: '📄', label: 'Invoices', href: '/invoices' },
  { icon: '⚙️', label: 'Settings', href: '/settings' },
];

const stats = [
  { label: 'Total Leads', value: '124', change: '+12%', up: true },
  { label: 'Active Jobs', value: '8', change: '+3%', up: true },
  { label: 'Pending Invoices', value: '12', change: '$3,450', up: false },
  { label: 'Revenue', value: '$18,450', change: '+8%', up: true },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold">P</span>
            </div>
            <span className="text-lg font-semibold">PlumberOS</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                pathname === item.href
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
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
            <h1 className="text-2xl font-semibold text-gray-900">Good morning, Akshay 👋</h1>
            <p className="text-gray-500 text-sm">Here is what is happening with your business today.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm w-64 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl shadow-black/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 text-sm">{stat.label}</span>
                  {stat.up === true && (
                    <span className="flex items-center text-emerald-500 text-sm font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </span>
                  )}
                  {stat.up === false && (
                    <span className="text-gray-400 text-sm">{stat.change}</span>
                  )}
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Recent Leads Table */}
            <div className="col-span-2 bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl shadow-black/5 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
                <Link href="/crm" className="text-blue-500 text-sm font-medium hover:text-blue-600">View All</Link>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Service</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Phone</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Location</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-6 py-4 text-gray-600">{lead.service}</td>
                      <td className="px-6 py-4 text-gray-500">{lead.phone}</td>
                      <td className="px-6 py-4 text-gray-500">{lead.location}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          lead.status === 'new' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                          lead.status === 'working' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' :
                          'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                        }`}>
                          {statusLabels[lead.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{lead.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl shadow-black/5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/crm" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25">
                  <Plus className="w-5 h-5" /> New Lead
                </Link>
                <Link href="/jobs" className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition">
                  <Plus className="w-5 h-5" /> Quick Add Job
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
