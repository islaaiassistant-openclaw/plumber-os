'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, ChevronLeft, ChevronRight, Clock, MapPin, User, X } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  customer: string;
  address: string;
  plumber?: string;
  time: string;
  date: string;
  status: string;
}

const navItems = [
  { icon: '📊', label: 'Dashboard', href: '/' },
  { icon: '🎯', label: 'Pipeline', href: '/pipeline' },
  { icon: '👷', label: 'Team', href: '/team' },
  { icon: '📞', label: 'Calls', href: '/calls' },
  { icon: '📍', label: 'Map', href: '/map' },
  { icon: '👥', label: 'Customers', href: '/customers' },
  { icon: '📄', label: 'Invoices', href: '/invoices' },
  { icon: '⚙️', label: 'Settings', href: '/settings' },
];

function getNextDay(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const sampleJobs: Job[] = [
  { id: '1', title: 'Water Heater Installation', customer: 'Sarah M.', address: '123 Oak St', plumber: 'Mike T.', time: '9:00 AM', date: new Date().toISOString().split('T')[0], status: 'scheduled' },
  { id: '2', title: 'Drain Cleaning', customer: 'Robert S.', address: '456 Pine Ave', plumber: 'John D.', time: '11:00 AM', date: new Date().toISOString().split('T')[0], status: 'scheduled' },
  { id: '3', title: 'Leak Repair', customer: 'Mike T.', address: '789 Elm St', plumber: 'Lisa C.', time: '2:00 PM', date: new Date().toISOString().split('T')[0], status: 'in_progress' },
  { id: '4', title: 'Pipe Installation', customer: 'Jennifer L.', address: '321 Maple Dr', plumber: 'Mike T.', time: '9:00 AM', date: getNextDay(1), status: 'scheduled' },
  { id: '5', title: 'Toilet Repair', customer: 'David B.', address: '654 Cedar Ln', plumber: 'John D.', time: '1:00 PM', date: getNextDay(1), status: 'scheduled' },
  { id: '6', title: 'Water Heater Repair', customer: 'Emily R.', address: '987 Birch Way', plumber: 'Lisa C.', time: '10:00 AM', date: getNextDay(2), status: 'scheduled' },
  { id: '7', title: 'Sump Pump Install', customer: 'Chris W.', address: '147 Spruce Ct', plumber: 'Tom H.', time: '3:00 PM', date: getNextDay(3), status: 'scheduled' },
];

export default function CalendarPage() {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs] = useState<Job[]>(sampleJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);

  const getDaysOfWeek = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const daysOfWeek = getDaysOfWeek();
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = formatDate(new Date());

  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const getJobsForDay = (date: Date) => jobs.filter(job => job.date === formatDate(date));

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">P</span>
            </div>
            <span className="text-lg font-semibold">PlumberOS</span>
          </Link>
        </div>
        <nav className="flex-1 px-3">
          {navItems.map(item => (
            <Link key={item.label} href={item.href} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm ${pathname === item.href ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs">AK</div>
            <div><p className="text-sm font-medium">Akshay K.</p><p className="text-xs text-gray-400">Admin</p></div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div><h1 className="text-xl font-semibold text-gray-900">Calendar</h1><p className="text-gray-500 text-sm">Schedule and manage appointments</p></div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search..." className="pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm w-48 text-gray-900" />
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={navigatePrev} className="p-1.5 hover:bg-gray-100 rounded"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
            <h2 className="text-lg font-semibold text-gray-900 min-w-[180px] text-center">{monthYear}</h2>
            <button onClick={navigateNext} className="p-1.5 hover:bg-gray-100 rounded"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
          </div>
          <button onClick={() => setCurrentDate(new Date())} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Today</button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {/* Week View Grid */}
          <div className="grid grid-cols-7 gap-2 min-h-[500px]">
            {/* Day Headers */}
            {daysOfWeek.map((day, i) => {
              const isToday = formatDate(day) === today;
              return (
                <div key={i} className={`text-center py-2 font-medium text-sm ${isToday ? 'bg-blue-500 text-white rounded-t-lg' : 'text-gray-600'}`}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  <div className={`text-lg font-bold ${isToday ? 'text-white' : ''}`}>{day.getDate()}</div>
                </div>
              );
            })}
            
            {/* Day Cells */}
            {daysOfWeek.map((day, i) => {
              const dayJobs = getJobsForDay(day);
              const isToday = formatDate(day) === today;
              return (
                <div key={i} className={`min-h-[200px] p-2 rounded-lg border ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                  {dayJobs.map(job => (
                    <div key={job.id} onClick={() => { setSelectedJob(job); setShowJobModal(true); }} className={`p-2 mb-2 rounded text-xs cursor-pointer hover:shadow-md transition-shadow ${job.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : job.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                      <div className="font-semibold truncate">{job.time}</div>
                      <div className="font-medium truncate">{job.title}</div>
                      <div className="truncate opacity-75">{job.customer}</div>
                    </div>
                  ))}
                  {dayJobs.length === 0 && <div className="text-center text-gray-400 text-xs py-4">No jobs</div>}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Job Details Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowJobModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Job Details</h3>
              <button onClick={() => setShowJobModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{selectedJob.title}</h4>
                <p className="text-blue-600 font-medium">{selectedJob.customer}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /><span className="text-gray-700">{selectedJob.time}</span></div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /><span className="text-gray-700">{selectedJob.address}</span></div>
                {selectedJob.plumber && <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><span className="text-gray-700">{selectedJob.plumber}</span></div>}
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${selectedJob.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : selectedJob.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1).replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}