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

// LocalStorage keys
const STORAGE_KEYS = {
  REQUESTS: 'shine_requests',
  PASSWORD: 'shine_admin_password',
  SESSION: 'shine_admin_session',
};

// Default credentials
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'shine2026';

// Helper functions
const getRequests = (): ContactRequest[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveRequests = (requests: ContactRequest[]) => {
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
};

const getCurrentPassword = (): string => {
  return localStorage.getItem(STORAGE_KEYS.PASSWORD) || DEFAULT_PASSWORD;
};

const savePassword = (password: string) => {
  localStorage.setItem(STORAGE_KEYS.PASSWORD, password);
};

const isLoggedIn = (): boolean => {
  return sessionStorage.getItem(STORAGE_KEYS.SESSION) === 'true';
};

const setLoggedIn = (value: boolean) => {
  if (value) {
    sessionStorage.setItem(STORAGE_KEYS.SESSION, 'true');
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  }
};

type TabType = 'dashboard' | 'requests' | 'password';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Requests state
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Check if already logged in on mount
  useEffect(() => {
    if (isLoggedIn()) {
      setIsAuthenticated(true);
    }
  }, []);

  // Load requests when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setRequests(getRequests());
    }
  }, [isAuthenticated]);

  // Auto-refresh requests every 3 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      setRequests(getRequests());
    }, 3000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const storedPassword = getCurrentPassword();

    if (username !== DEFAULT_USERNAME) {
      setLoginError('Invalid username');
      return;
    }

    if (password !== storedPassword) {
      setLoginError('Invalid password');
      return;
    }

    setIsAuthenticated(true);
    setLoggedIn(true);
    setUsername('');
    setPassword('');
    setActiveTab('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedIn(false);
    setActiveTab('dashboard');
    setPasswordMessage({ type: '', text: '' });
  };

  // Handle password change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    const storedPassword = getCurrentPassword();

    if (currentPassword !== storedPassword) {
      setPasswordMessage({ type: 'error', text: 'Current password is incorrect' });
      return;
    }

    if (newPassword.length < 4) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 4 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    savePassword(newPassword);
    setPasswordMessage({ type: 'success', text: 'Password saved successfully! Use your new password on next login.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Reset to default password
  const handleResetPassword = () => {
    if (confirm(`Reset password to default "${DEFAULT_PASSWORD}"?`)) {
      savePassword(DEFAULT_PASSWORD);
      setPasswordMessage({ type: 'success', text: `Password reset to default: ${DEFAULT_PASSWORD}` });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // Update request status
  const updateStatus = (id: string, status: 'new' | 'contacted' | 'completed') => {
    const updated = requests.map(req =>
      req.id === id ? { ...req, status } : req
    );
    setRequests(updated);
    saveRequests(updated);
  };

  // Delete request
  const deleteRequest = (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    const updated = requests.filter(req => req.id !== id);
    setRequests(updated);
    saveRequests(updated);
  };

  // Get service label
  const getServiceLabel = (service: string): string => {
    const labels: Record<string, string> = {
      office: '🏢 Office Cleaning',
      home: '🏠 Home Cleaning',
      commercial: '🏪 Commercial',
      deep: '🧹 Deep Cleaning',
    };
    return labels[service] || service;
  };

  // Filter and sort requests
  const filteredRequests = requests
    .filter(req => filter === 'all' || req.status === filter)
    .filter(req =>
      searchQuery === '' ||
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.phone.includes(searchQuery) ||
      req.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Statistics
  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    contacted: requests.filter(r => r.status === 'contacted').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  // ============ LOGIN SCREEN ============
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-sky-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-200">
              <span className="text-white text-3xl">✨</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
            <p className="text-gray-500 mt-1">Shine Cleaning Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setLoginError(''); }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter username"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter password"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <span>⚠️</span> {loginError}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-200 hover:from-sky-600 hover:to-blue-700 transition-all"
            >
              Sign In to Admin Panel
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <a href="#home" className="text-sm text-gray-500 hover:text-sky-600 flex items-center gap-1 justify-center">
              ← Back to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ============ ADMIN DASHBOARD ============
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
              <a href="#home" className="text-sm text-gray-500 hover:text-sky-600 hidden sm:inline">
                View Website
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Requests {stats.new > 0 && `(${stats.new})`}
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'password'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              🔒 Password & Security
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ============ DASHBOARD TAB ============ */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

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

            {/* Recent Requests */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Requests</h3>
              </div>
              {requests.slice(0, 5).length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📭</div>
                  <p className="text-gray-500">No requests yet</p>
                  <p className="text-sm text-gray-400 mt-2">Submit the contact form to see requests here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {requests.slice(0, 5).map((request) => (
                    <div key={request.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900">{request.name}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              request.status === 'new' ? 'bg-blue-100 text-blue-700' :
                              request.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {request.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                            <span>📞 {request.phone}</span>
                            <span>📅 {format(new Date(request.created_at), 'MMM dd, HH:mm')}</span>
                            <span>{getServiceLabel(request.service)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {requests.length > 5 && (
                <div className="p-4 border-t border-gray-100 text-center">
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                  >
                    View all requests →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ REQUESTS TAB ============ */}
        {activeTab === 'requests' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Requests</h2>

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
                    </button>
                  ))}
                </div>
                <div className="flex-1 sm:ml-auto">
                  <input
                    type="text"
                    placeholder="🔍 Search by name, phone, or message..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-300 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {filteredRequests.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📭</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No requests found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-base font-semibold text-gray-900">{request.name}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              request.status === 'new' ? 'bg-blue-100 text-blue-700' :
                              request.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {request.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 flex-wrap">
                            <a href={`tel:${request.phone}`} className="flex items-center gap-1 hover:text-sky-600">
                              📞 {request.phone}
                            </a>
                            <span className="flex items-center gap-1">
                              📅 {format(new Date(request.created_at), 'MMM dd, yyyy • HH:mm')}
                            </span>
                            <span>{getServiceLabel(request.service)}</span>
                          </div>

                          {request.message && (
                            <div className="bg-gray-50 rounded-xl p-4 mb-3">
                              <p className="text-sm text-gray-700">{request.message}</p>
                            </div>
                          )}

                          <div className="flex gap-2 flex-wrap">
                            <a
                              href={`tel:${request.phone}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100"
                            >
                              📞 Call
                            </a>
                            <a
                              href={`https://wa.me/${request.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100"
                            >
                              💬 WhatsApp
                            </a>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end flex-shrink-0">
                          <select
                            value={request.status}
                            onChange={(e) => updateStatus(request.id, e.target.value as any)}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-300 outline-none bg-white"
                          >
                            <option value="new">🔔 New</option>
                            <option value="contacted">📞 Contacted</option>
                            <option value="completed">✅ Completed</option>
                          </select>
                          <button
                            onClick={() => deleteRequest(request.id)}
                            className="px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ PASSWORD & SECURITY TAB ============ */}
        {activeTab === 'password' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Password & Security</h2>

            {/* Account Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Username</label>
                  <p className="text-gray-900 font-medium">{DEFAULT_USERNAME}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Role</label>
                  <p className="text-gray-900 font-medium">Administrator</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Data Storage</label>
                  <p className="text-gray-900 font-medium">Local Browser Storage</p>
                  <p className="text-xs text-gray-500 mt-1">Requests and password are stored locally in your browser.</p>
                </div>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="Enter new password (minimum 4 characters)"
                    required
                    minLength={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="Confirm new password"
                    required
                    minLength={4}
                  />
                </div>

                {passwordMessage.text && (
                  <div className={`p-3 rounded-xl ${
                    passwordMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={`text-sm ${
                      passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {passwordMessage.text}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-200 hover:from-sky-600 hover:to-blue-700 transition-all"
                >
                  Save New Password
                </button>
              </form>
            </div>

            {/* Reset Password */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset to Default Password</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you forget your password or want to restore the default, click the button below.
                The password will be reset to <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">{DEFAULT_PASSWORD}</code>.
              </p>
              <button
                onClick={handleResetPassword}
                className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-200"
              >
                Reset to Default Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
