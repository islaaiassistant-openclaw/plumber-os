'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, Plus, X, GripVertical, Pencil, Trash2, Check, Loader2 } from 'lucide-react';

interface Card {
  id: string;
  type: 'lead' | 'job';
  customerName: string;
  customerPhone: string;
  location: string;
  service: string;
  price?: number;
  date: string;
  plumber?: string;
  plumberName?: string;
  source?: string;
  bucketId: string;
  leadId?: string;
  status?: string;
}

// Map bucket position to lead status
const bucketPositionToStatus: Record<number, string> = {
  1: 'new',
  2: 'qualified',
  3: 'quoted',
  4: 'booked',
  5: 'in_progress',
  6: 'completed',
};

// Map lead status to bucket position
const statusToBucketPosition: Record<string, number> = {
  'new': 1,
  'qualified': 2,
  'quoted': 3,
  'booked': 4,
  'in_progress': 5,
  'completed': 6,
  'lost': 6,
};

interface Bucket {
  id: string;
  title: string;
  color: string;
  position: number;
}

const navItems = [
  { icon: '📊', label: 'Dashboard', href: '/' },
  { icon: '🎯', label: 'Pipeline', href: '/pipeline' },
  { icon: '👥', label: 'Customers', href: '/customers' },
  { icon: '📄', label: 'Invoices', href: '/invoices' },
  { icon: '⚙️', label: 'Settings', href: '/settings' },
];

const defaultBuckets: Bucket[] = [
  { id: '1', title: 'New Leads', color: '#3b82f6', position: 1 },
  { id: '2', title: 'Qualified', color: '#8b5cf6', position: 2 },
  { id: '3', title: 'Quoted', color: '#eab308', position: 3 },
  { id: '4', title: 'Booked', color: '#f97316', position: 4 },
  { id: '5', title: 'In Progress', color: '#eab308', position: 5 },
  { id: '6', title: 'Completed', color: '#22c55e', position: 6 },
];

const colorOptions = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Gray', value: '#6b7280' },
];

// Map bucket ID to status using position
const getStatusFromBucketId = (bucketId: string, bucketsData: Bucket[]): string => {
  const bucket = bucketsData.find(b => b.id === bucketId);
  if (!bucket) return 'new';
  const position = bucket.position || 1;
  const positionToStatus: Record<number, string> = {
    1: 'new',
    2: 'qualified',
    3: 'quoted',
    4: 'booked',
    5: 'in_progress',
    6: 'completed',
  };
  return positionToStatus[position] || 'new';
};

// Map status to bucket ID using position
const getBucketIdFromStatus = (status: string, bucketsData: Bucket[]): string => {
  const positionMap: Record<string, number> = {
    'new': 1,
    'qualified': 2,
    'quoted': 3,
    'booked': 4,
    'in_progress': 5,
    'completed': 6,
  };
  const targetPosition = positionMap[status] || 1;
  const bucket = bucketsData.find(b => b.position === targetPosition);
  if (bucket) {
    return bucket.id;
  }
  // Fallback to first bucket
  return bucketsData[0]?.id || '';
};

export default function PipelinePage() {
  const pathname = usePathname();
  const [buckets, setBuckets] = useState<Bucket[]>(defaultBuckets);
  const [cards, setCards] = useState<Card[]>([]);
  const [search, setSearch] = useState('');
  const [draggedCard, setDraggedCard] = useState<{ card: Card; bucketId: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBucketModal, setShowBucketModal] = useState(false);
  const [editBucket, setEditBucket] = useState<Bucket | null>(null);
  const [newBucket, setNewBucket] = useState({ title: '', color: '#3b82f6' });
  const [newCard, setNewCard] = useState({ customerName: '', customerPhone: '', location: '', service: '', price: 0, source: 'website', bucketId: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch buckets and leads from API
  useEffect(() => {
    fetchBuckets();
  }, []);

  useEffect(() => {
    if (buckets.length > 0 && !loading) {
      fetchLeads();
    }
  }, [buckets, loading]);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads) {
        const mappedCards: Card[] = data.leads.map((lead: any) => ({
          id: lead.id,
          leadId: lead.id,
          type: ['booked', 'in_progress', 'completed'].includes(lead.status) ? 'job' : 'lead',
          customerName: lead.customer_name || 'Unknown',
          customerPhone: lead.customer_phone || '',
          location: lead.location || '',
          service: lead.issue,
          price: lead.estimated_price || 0,
          date: lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          source: lead.source,
          plumber: lead.plumber_name,
          bucketId: getBucketIdFromStatus(lead.status, buckets),
        }));
        setCards(mappedCards);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    }
  };

  const fetchBuckets = async () => {
    try {
      const res = await fetch('/api/buckets');
      const data = await res.json();
      if (data.buckets && data.buckets.length > 0) {
        setBuckets(data.buckets);
      }
    } catch (err) {
      console.error('Failed to fetch buckets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (card: Card, bucketId: string) => setDraggedCard({ card, bucketId });
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const handleDrop = async (targetBucketId: string) => {
    if (!draggedCard) return;
    const { card, bucketId: sourceBucketId } = draggedCard;
    if (sourceBucketId === targetBucketId) { setDraggedCard(null); return; }
    
    // Determine if it's a job based on target bucket position
    const targetBucket = buckets.find(b => b.id === targetBucketId);
    const isJob = targetBucket && targetBucket.position && targetBucket.position >= 4;
    
    // Update local state immediately
    setCards(cards.map(c => c.id === card.id ? { ...c, bucketId: targetBucketId, type: isJob ? 'job' : 'lead' } : c));
    setDraggedCard(null);
    
    // Update in database
    if (card.leadId) {
      setSaving(true);
      try {
        const status = getStatusFromBucketId(targetBucketId, buckets);
        await fetch('/api/leads', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: card.leadId, status })
        });
      } catch (err) {
        console.error('Failed to update lead status:', err);
      } finally {
        setSaving(false);
      }
    }
  };

  const filteredCards = cards.filter(card => 
    card.customerName.toLowerCase().includes(search.toLowerCase()) ||
    card.service.toLowerCase().includes(search.toLowerCase()) ||
    card.location.toLowerCase().includes(search.toLowerCase())
  );

  const getCardsForBucket = (bucketId: string) => filteredCards.filter(c => c.bucketId === bucketId);
  
  // Count leads and jobs based on bucket position
  const getBucketPosition = (bucketId: string) => {
    const bucket = buckets.find(b => b.id === bucketId);
    return bucket?.position || 1;
  };
  const totalLeads = cards.filter(c => {
    const pos = getBucketPosition(c.bucketId);
    return pos >= 1 && pos <= 3;
  }).length;
  const totalJobs = cards.filter(c => {
    const pos = getBucketPosition(c.bucketId);
    return pos >= 4 && pos <= 6;
  }).length;

  // Bucket CRUD
  const handleSaveBucket = async () => {
    if (!newBucket.title.trim()) return;
    try {
      if (editBucket) {
        await fetch('/api/buckets', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editBucket.id, title: newBucket.title, color: newBucket.color })
        });
      } else {
        await fetch('/api/buckets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBucket)
        });
      }
      fetchBuckets();
      setNewBucket({ title: '', color: '#3b82f6' });
      setEditBucket(null);
    } catch (err) {
      console.error('Failed to save bucket:', err);
    }
  };

  const handleDeleteBucket = async (id: string) => {
    if (!confirm('Delete this bucket?')) return;
    try {
      await fetch(`/api/buckets?id=${id}`, { method: 'DELETE' });
      fetchBuckets();
    } catch (err) {
      console.error('Failed to delete bucket:', err);
    }
  };

  const openEditBucket = (bucket: Bucket) => {
    setEditBucket(bucket);
    setNewBucket({ title: bucket.title, color: bucket.color });
  };

  const handleAddCard = async () => {
    if (!newCard.customerName || !newCard.bucketId) return;
    setSaving(true);
    
    try {
      const status = getStatusFromBucketId(newCard.bucketId, buckets);
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue: newCard.service,
          source: newCard.source,
          status: status,
          location: newCard.location,
          customer_name: newCard.customerName,
          customer_phone: newCard.customerPhone
        })
      });
      const data = await res.json();
      
      if (data.lead) {
        const card: Card = {
          id: data.lead.id,
          leadId: data.lead.id,
          type: 'lead',
          customerName: newCard.customerName,
          customerPhone: newCard.customerPhone,
          location: newCard.location,
          service: newCard.service,
          price: newCard.price,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          source: newCard.source,
          bucketId: newCard.bucketId,
        };
        setCards([...cards, card]);
      }
      
      setShowAddModal(false);
      setNewCard({ customerName: '', customerPhone: '', location: '', service: '', price: 0, source: 'website', bucketId: '' });
    } catch (err) {
      console.error('Failed to add lead:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    
    const card = cards.find(c => c.id === id);
    if (card?.leadId) {
      try {
        await fetch(`/api/leads?id=${card.leadId}`, { method: 'DELETE' });
        setCards(cards.filter(c => c.id !== id));
      } catch (err) {
        console.error('Failed to delete lead:', err);
      }
    } else {
      setCards(cards.filter(c => c.id !== id));
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-100"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-56 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-4"><Link href="/" className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><span className="text-sm font-bold">P</span></div><span className="text-lg font-semibold">PlumberOS</span></Link></div>
        <nav className="flex-1 px-3">{navItems.map(item => <Link key={item.label} href={item.href} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm ${pathname === item.href ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><span>{item.icon}</span><span className="font-medium">{item.label}</span></Link>)}</nav>
        <div className="p-3 border-t border-gray-800"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs">AK</div><div><p className="text-sm font-medium">Akshay K.</p><p className="text-xs text-gray-400">Admin</p></div></div></div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div><h1 className="text-xl font-semibold text-gray-900">Pipeline</h1><p className="text-gray-500 text-sm">Track your leads and jobs</p></div>
          <div className="flex items-center gap-3">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm w-48 text-gray-900" /></div>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg relative"><Bell className="w-4 h-4 text-gray-600" /><span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span></button>
          </div>
        </header>

        <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center gap-6 flex-shrink-0">
          <div className="flex items-center gap-2"><span className="text-xl font-bold text-gray-900">{totalLeads}</span><span className="text-gray-500 text-sm">Leads</span></div>
          <div className="flex items-center gap-2"><span className="text-xl font-bold text-gray-900">{totalJobs}</span><span className="text-gray-500 text-sm">Jobs</span></div>
          {saving && <div className="flex items-center gap-1 text-blue-500 text-sm"><Loader2 className="w-3 h-3 animate-spin" />Saving...</div>}
          <div className="flex-1"></div>
          <button onClick={() => setShowBucketModal(true)} className="flex items-center gap-1.5 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100"><Pencil className="w-4 h-4" />Edit Buckets</button>
          <button onClick={() => { setNewCard({ ...newCard, bucketId: buckets[0]?.id || '1' }); setShowAddModal(true); }} className="flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600"><Plus className="w-4 h-4" />Add Lead</button>
        </div>

        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-3 h-full">
            {buckets.sort((a, b) => a.position - b.position).map(bucket => (
              <div key={bucket.id} className="w-64 flex-shrink-0 flex flex-col bg-gray-200 rounded-lg" onDragOver={handleDragOver} onDrop={() => handleDrop(bucket.id)}>
                <div className="p-3 flex items-center gap-2 border-b border-gray-300">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bucket.color }}></div>
                  <h3 className="font-semibold text-gray-700 text-sm">{bucket.title}</h3>
                  <span className="ml-auto bg-white px-1.5 py-0.5 rounded-full text-xs font-medium text-gray-600">{getCardsForBucket(bucket.id).length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {getCardsForBucket(bucket.id).map(card => (
                    <div key={card.id} draggable onDragStart={() => handleDragStart(card, bucket.id)} className={`bg-white rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md ${draggedCard?.card.id === card.id ? 'opacity-50' : ''}`}>
                      <div className="flex items-center justify-between mb-1"><span className={`text-xs font-medium px-1.5 py-0.5 rounded ${card.type === 'lead' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{card.type === 'lead' ? 'Lead' : 'Job'}</span><button onClick={() => handleDeleteCard(card.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button></div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{card.customerName}</h4>
                      <p className="text-xs text-gray-600 mb-2">{card.service}</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1"><span>{card.customerPhone}</span></div>
                        <div className="flex items-center gap-1"><span>{card.location}</span></div>
                        <div className="flex items-center gap-1"><span>{card.date}</span></div>
                        {card.plumber && <div className="flex items-center gap-1"><span>{card.plumber}</span></div>}
                      </div>
                      {card.price && <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between"><span className="text-xs text-gray-500">Est.</span><span className="text-sm font-semibold text-green-600">${card.price}</span></div>}
                    </div>
                  ))}
                  {getCardsForBucket(bucket.id).length === 0 && <div className="text-center py-4 text-gray-400 text-xs">Drop here</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">Add New Lead</h2><button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5 text-gray-500" /></button></div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Customer Name *</label><input type="text" value={newCard.customerName} onChange={e => setNewCard({...newCard, customerName: e.target.value})} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label><input type="tel" value={newCard.customerPhone} onChange={e => setNewCard({...newCard, customerPhone: e.target.value})} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900" /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Service Type *</label><input type="text" value={newCard.service} onChange={e => setNewCard({...newCard, service: e.target.value})} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900" /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Location *</label><input type="text" value={newCard.location} onChange={e => setNewCard({...newCard, location: e.target.value})} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Price ($)</label><input type="number" value={newCard.price} onChange={e => setNewCard({...newCard, price: parseInt(e.target.value) || 0})} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Bucket</label><select value={newCard.bucketId} onChange={e => setNewCard({...newCard, bucketId: e.target.value})} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900">{buckets.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Source</label><select value={newCard.source} onChange={e => setNewCard({...newCard, source: e.target.value})} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900"><option value="website">Website</option><option value="phone">Phone</option><option value="thumbtack">Thumbtack</option><option value="angi">Angi</option><option value="google">Google</option><option value="referral">Referral</option></select></div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button onClick={() => setShowAddModal(false)} className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleAddCard} disabled={saving} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1">{saving && <Loader2 className="w-3 h-3 animate-spin" />}Add Lead</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Buckets Modal */}
      {showBucketModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">Edit Buckets</h2><button onClick={() => setShowBucketModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5 text-gray-500" /></button></div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {buckets.sort((a, b) => a.position - b.position).map(bucket => (
                <div key={bucket.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: bucket.color }}></div>
                  <span className="flex-1 text-sm font-medium text-gray-700">{bucket.title}</span>
                  <button onClick={() => openEditBucket(bucket)} className="p-1 text-gray-400 hover:text-gray-600"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteBucket(bucket.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">{editBucket ? 'Edit Bucket' : 'Add New Bucket'}</p>
              <div className="flex items-center gap-2">
                <input type="text" value={newBucket.title} onChange={e => setNewBucket({...newBucket, title: e.target.value})} placeholder="Bucket name" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900" />
                <select value={newBucket.color} onChange={e => setNewBucket({...newBucket, color: e.target.value})} className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm">
                  {colorOptions.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
                </select>
                <button onClick={handleSaveBucket} className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Check className="w-4 h-4" /></button>
              </div>
              {editBucket && <button onClick={() => { setEditBucket(null); setNewBucket({ title: '', color: '#3b82f6' }); }} className="mt-2 text-xs text-gray-500 hover:text-gray-700">Cancel edit</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
