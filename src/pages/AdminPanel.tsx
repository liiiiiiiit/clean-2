import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface ContactRequest {
  id: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  created_at: string;
}

const ADMIN_PASSWORD = 'shine2024';

// Helper functions for localStorage
const getRequests = (): ContactRequest[] => {
  try {
    const data = localStorage.getItem('shine_cleaning_requests');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveRequests = (requests: ContactRequest[]) => {
  localStorage.setItem('shine_cleaning_requests', JSON.stringify(requests));
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    // Check if already logged in
    const isLoggedIn = sessionStorage.getItem('shine_admin_auth');
    if (isLoggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setRequests(getRequests());
    }
  }, [isAuthenticated]);

  // Listen for new requests from the main site
  useEffect(() => {
    const handleStorageChange = () => {
      if (isAuthenticated) {
        setRequests(getRequests());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also check every 3 seconds for new requests
    const interval = setInterval(() => {
      if (isAuthenticated) {
        const currentRequests = getRequests();
        if (currentRequests.length !== requests.length) {
          setRequests(currentRequests);
        }
      }
    }, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isAuthenticated, requests.length]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('shine_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('shine_admin_auth');
  };

  const updateStatus = (id: string, status: 'new' | 'contacted' | 'completed') => {
    const updated = requests.map(req =>
      req.id === id ? { ...req, status } : req
    );
    setRequests(updated);
    saveRequests(updated);
  };

  const deleteRequest = (id: string) => {
    const updated = requests.filter(req => req.id !== id);
    setRequests(updated);
    saveRequests(updated);
    setShowDeleteConfirm(null);
  };

  const getServiceLabel = (service: string): string => {
    const labels: Record<string, string> = {
      office: '🏢 Office Cleaning',
      home: '🏠 Home Cleaning',
      commercial: '🏪 Commercial',
      deep: '🧹 Deep Cleaning',
    };
    return labels[service] || service;
  };

  const filteredRequests = requests
    .filter(req => filter === 'all' || req.status === filter)
    .filter(req =>
      searchQuery === '' ||
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.phone.includes(searchQuery) ||
      req.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    contacted: requests.filter(r => r.status === 'contacted').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-sky-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-200">
              <span className="text-white text-3xl">✨</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 mt-1">Shine Cleaning Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter admin password"
                autoFocus
              />
              {loginError && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {loginError}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-200 hover:from-sky-600 hover:to-blue-700 transition-all"
            >
              Login
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <a href="/" className="text-sm text-gray-500 hover:text-sky-600 flex items-center gap-1 justify-center">
              ← Back to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm">✨</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500 -mt-0.5">Shine Cleaning</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="/" className="text-sm text-gray-500 hover:text-sky-600 hidden sm:inline">
                View Website
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-xl">📊</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New</p>
                <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">🔔</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Contacted</p>
                <p className="text-3xl font-bold text-amber-600">{stats.contacted}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-xl">📞</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-xl">✅</div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 flex-wrap">
              {(['all', 'new', 'contacted', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === 'new' && stats.new > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                      {stats.new}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex-1 sm:ml-auto">
              <input
                type="text"
                placeholder="🔍 Search by name, phone, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-300 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {filteredRequests.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                📭
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {requests.length === 0 ? 'No requests yet' : 'No matching requests'}
              </h3>
              <p className="text-gray-500 text-sm">
                {requests.length === 0
                  ? 'When customers submit the contact form, they will appear here.'
                  : 'Try adjusting your filters or search query.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className={`p-5 hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedRequest?.id === request.id ? 'bg-sky-50' : ''
                  }`}
                  onClick={() => setSelectedRequest(selectedRequest?.id === request.id ? null : request)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-base font-semibold text-gray-900">
                          {request.name}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'new'
                            ? 'bg-blue-100 text-blue-700'
                            : request.status === 'contacted'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {request.status === 'new' && '🔔 '}
                          {request.status === 'contacted' && '📞 '}
                          {request.status === 'completed' && '✅ '}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2 flex-wrap">
                        <a
                          href={`tel:${request.phone}`}
                          className="flex items-center gap-1 hover:text-sky-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📞 {request.phone}
                        </a>
                        <span className="flex items-center gap-1">
                          📅 {format(new Date(request.created_at), 'MMM dd, yyyy • HH:mm')}
                        </span>
                        <span className="flex items-center gap-1">
                          {getServiceLabel(request.service)}
                        </span>
                      </div>

                      {selectedRequest?.id === request.id && (
                        <div className="mt-3 space-y-3">
                          {request.message && (
                            <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-sm text-gray-700 leading-relaxed">{request.message}</p>
                            </div>
                          )}
                          
                          <div className="flex gap-2 flex-wrap">
                            <a
                              href={`tel:${request.phone}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              📞 Call
                            </a>
                            <a
                              href={`https://wa.me/${request.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              💬 WhatsApp
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(request.phone);
                                alert('Phone number copied!');
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                              📋 Copy Phone
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 items-end" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={request.status}
                        onChange={(e) => updateStatus(request.id, e.target.value as 'new' | 'contacted' | 'completed')}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-300 outline-none bg-white"
                      >
                        <option value="new">🔔 New</option>
                        <option value="contacted">📞 Contacted</option>
                        <option value="completed">✅ Completed</option>
                      </select>
                      {showDeleteConfirm === request.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => deleteRequest(request.id)}
                            className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(request.id)}
                          className="px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Requests are stored locally in your browser. Data syncs automatically.</p>
          <p className="mt-1">Password: <code className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">shine2024</code></p>
        </div>
      </div>
    </div>
  );
}
