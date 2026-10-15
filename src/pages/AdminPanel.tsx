import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Shield, 
  LayoutDashboard, 
  ClipboardList, 
  KeyRound, 
  LogOut, 
  Phone, 
  MessageCircle,
  Bell,
  CheckCircle2,
  Trash2,
  Search,
  ChevronRight,
  Inbox,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  DollarSign,
  Briefcase,
  Image,
  Plus,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { 
  getServices, saveServices, addService, updateService, deleteService,
  getPricing, savePricing, updatePricingRate,
  getWorkSamples, addWorkSample, updateWorkSample, deleteWorkSample,
  fileToBase64, compressImage,
  type Service, type PricingRate, type WorkSample
} from '../lib/dataStore';

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

type TabType = 'dashboard' | 'requests' | 'services' | 'pricing' | 'samples' | 'password';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Requests state
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Services state
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({ key: '', title: '', description: '', icon: '🧹', color: 'from-sky-50 to-blue-50', iconBg: 'from-sky-400 to-blue-500' });

  // Pricing state
  const [pricing, setPricing] = useState<PricingRate[]>([]);

  // Work Samples state
  const [workSamples, setWorkSamples] = useState<WorkSample[]>([]);
  const [showSampleForm, setShowSampleForm] = useState(false);
  const [editingSample, setEditingSample] = useState<WorkSample | null>(null);
  const [sampleForm, setSampleForm] = useState({
    title: { en: '', hy: '', ru: '' },
    description: { en: '', hy: '', ru: '' },
    imageUrl: '',
    serviceType: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [activeLang, setActiveLang] = useState<'en' | 'hy' | 'ru'>('en');

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

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setRequests(getRequests());
      setServices(getServices());
      setPricing(getPricing());
      setWorkSamples(getWorkSamples());
    }
  }, [isAuthenticated]);

  // Auto-refresh requests every 3 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      setRequests(getRequests());
      setServices(getServices());
      setPricing(getPricing());
      setWorkSamples(getWorkSamples());
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

  // Service handlers
  const handleAddService = () => {
    if (!serviceForm.key || !serviceForm.title || !serviceForm.description) {
      alert('Please fill in all required fields');
      return;
    }
    addService(serviceForm);
    setServices(getServices());
    setServiceForm({ key: '', title: '', description: '', icon: '🧹', color: 'from-sky-50 to-blue-50', iconBg: 'from-sky-400 to-blue-500' });
    setShowServiceForm(false);
  };

  const handleUpdateService = () => {
    if (!editingService) return;
    updateService(editingService.id, serviceForm);
    setServices(getServices());
    setEditingService(null);
    setShowServiceForm(false);
    setServiceForm({ key: '', title: '', description: '', icon: '🧹', color: 'from-sky-50 to-blue-50', iconBg: 'from-sky-400 to-blue-500' });
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
      setServices(getServices());
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      key: service.key,
      title: service.title,
      description: service.description,
      icon: service.icon,
      color: service.color,
      iconBg: service.iconBg,
    });
    setShowServiceForm(true);
  };

  // Pricing handlers
  const handleUpdatePricing = (serviceKey: string, rate: number) => {
    updatePricingRate(serviceKey, rate);
    setPricing(getPricing());
  };

  // Work Sample handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('لطفاً فقط فایل تصویری آپلود کنید');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }

    setUploadingImage(true);

    try {
      // Convert to base64
      const base64 = await fileToBase64(file);
      
      // Compress image
      const compressed = await compressImage(base64, 1200, 0.8);
      
      // Update form and preview
      setSampleForm({ ...sampleForm, imageUrl: compressed });
      setImagePreview(compressed);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('خطا در آپلود تصویر. لطفاً دوباره تلاش کنید.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddSample = () => {
    if (!sampleForm.title.en || !sampleForm.description.en || !sampleForm.imageUrl || !sampleForm.serviceType) {
      alert('لطفاً حداقل فیلدهای انگلیسی را پر کنید');
      return;
    }
    addWorkSample(sampleForm);
    setWorkSamples(getWorkSamples());
    setSampleForm({ title: { en: '', hy: '', ru: '' }, description: { en: '', hy: '', ru: '' }, imageUrl: '', serviceType: '' });
    setImagePreview('');
    setShowSampleForm(false);
  };

  const handleUpdateSample = () => {
    if (!editingSample) return;
    updateWorkSample(editingSample.id, sampleForm);
    setWorkSamples(getWorkSamples());
    setEditingSample(null);
    setShowSampleForm(false);
    setSampleForm({ title: { en: '', hy: '', ru: '' }, description: { en: '', hy: '', ru: '' }, imageUrl: '', serviceType: '' });
  };

  const handleDeleteSample = (id: string) => {
    if (confirm('Are you sure you want to delete this work sample?')) {
      deleteWorkSample(id);
      setWorkSamples(getWorkSamples());
    }
  };

  const handleEditSample = (sample: WorkSample) => {
    setEditingSample(sample);
    setSampleForm({
      title: sample.title,
      description: sample.description,
      imageUrl: sample.imageUrl,
      serviceType: sample.serviceType,
    });
    setShowSampleForm(true);
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
            <div className="relative mx-auto mb-6 w-24 h-24">
              {/* Outer glow ring */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl blur-xl opacity-40 animate-pulse" />
              {/* Main icon container */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-sky-400 via-blue-500 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-sky-300/50">
                <Shield className="w-12 h-12 text-white" strokeWidth={1.8} />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                <Lock className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
            <p className="text-gray-500 mt-1">Shine Cleaning Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setLoginError(''); }}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter username"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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
            <a href="#home" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-sky-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Website
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
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-sky-200">
                <Shield className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500 -mt-0.5">Shine Cleaning</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="#home" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-sky-600 hidden sm:inline transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Website
              </a>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log Out</span>
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
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Requests
              {stats.new > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full">
                  {stats.new}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'services'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Services
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'pricing'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Pricing
            </button>
            <button
              onClick={() => setActiveTab('samples')}
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'samples'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Image className="w-4 h-4" />
              Work Samples
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'password'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              Password & Security
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
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-sky-200 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-sky-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">New</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Contacted</p>
                    <p className="text-3xl font-bold text-amber-600">{stats.contacted}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
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
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Inbox className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No requests yet</p>
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
                    className="inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
                  >
                    View all requests
                    <ChevronRight className="w-4 h-4" />
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
                <div className="flex-1 sm:ml-auto relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, or message..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-300 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {filteredRequests.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Inbox className="w-10 h-10 text-gray-400" />
                  </div>
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
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                              Call
                            </a>
                            <a
                              href={`https://wa.me/${request.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              WhatsApp
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
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
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

        {/* ============ SERVICES TAB ============ */}
        {activeTab === 'services' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Services</h2>
              <button
                onClick={() => { setShowServiceForm(true); setEditingService(null); setServiceForm({ key: '', title: '', description: '', icon: '🧹', color: 'from-sky-50 to-blue-50', iconBg: 'from-sky-400 to-blue-500' }); }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>

            {/* Service Form */}
            {showServiceForm && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Key (unique identifier)</label>
                    <input
                      type="text"
                      value={serviceForm.key}
                      onChange={(e) => setServiceForm({ ...serviceForm, key: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="e.g., office, home, deep"
                      disabled={!!editingService}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="e.g., Office Cleaning"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="Service description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon (emoji)</label>
                    <input
                      type="text"
                      value={serviceForm.icon}
                      onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="🏢"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                    <select
                      value={serviceForm.color}
                      onChange={(e) => setServiceForm({ ...serviceForm, color: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                    >
                      <option value="from-sky-50 to-blue-50">Sky Blue</option>
                      <option value="from-emerald-50 to-teal-50">Emerald</option>
                      <option value="from-violet-50 to-purple-50">Violet</option>
                      <option value="from-amber-50 to-orange-50">Amber</option>
                      <option value="from-rose-50 to-pink-50">Rose</option>
                      <option value="from-cyan-50 to-sky-50">Cyan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon Background</label>
                    <select
                      value={serviceForm.iconBg}
                      onChange={(e) => setServiceForm({ ...serviceForm, iconBg: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                    >
                      <option value="from-sky-400 to-blue-500">Sky Blue</option>
                      <option value="from-emerald-400 to-teal-500">Emerald</option>
                      <option value="from-violet-400 to-purple-500">Violet</option>
                      <option value="from-amber-400 to-orange-500">Amber</option>
                      <option value="from-rose-400 to-pink-500">Rose</option>
                      <option value="from-cyan-400 to-sky-500">Cyan</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={editingService ? handleUpdateService : handleAddService}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    {editingService ? 'Update Service' : 'Add Service'}
                  </button>
                  <button
                    onClick={() => { setShowServiceForm(false); setEditingService(null); }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Services List */}
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div key={service.id} className={`bg-gradient-to-br ${service.color} rounded-2xl p-6 border border-white/60`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${service.iconBg} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Key: {service.key}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="p-2 bg-white/80 hover:bg-white rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 bg-white/80 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============ PRICING TAB ============ */}
        {activeTab === 'pricing' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Pricing</h2>
            <p className="text-gray-600 mb-6">Set the price per square meter for each service type.</p>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {services.map((service) => {
                  const rate = pricing.find(p => p.serviceKey === service.key)?.ratePerSqm || 0;
                  return (
                    <div key={service.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${service.iconBg} rounded-xl flex items-center justify-center text-xl shadow-md`}>
                            {service.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{service.title}</h3>
                            <p className="text-sm text-gray-500">Price per square meter (AMD)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            value={rate}
                            onChange={(e) => handleUpdatePricing(service.key, Number(e.target.value))}
                            className="w-32 px-4 py-2 border border-gray-200 rounded-xl text-right font-semibold text-lg focus:ring-2 focus:ring-sky-500 outline-none"
                            min={0}
                          />
                          <span className="text-sm text-gray-500 font-medium">AMD/sq.m</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 bg-sky-50 rounded-2xl p-5 border border-sky-100">
              <p className="text-sm text-sky-700">
                💡 <strong>Tip:</strong> Changes are saved automatically. The pricing calculator on the website will update in real-time.
              </p>
            </div>
          </div>
        )}

        {/* ============ WORK SAMPLES TAB ============ */}
        {activeTab === 'samples' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">نمونه کارها</h2>
              <button
                onClick={() => { setShowSampleForm(true); setEditingSample(null); setSampleForm({ title: { en: '', hy: '', ru: '' }, description: { en: '', hy: '', ru: '' }, imageUrl: '', serviceType: services[0]?.key || '' }); }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                افزودن نمونه
              </button>
            </div>

            {/* Sample Form */}
            {showSampleForm && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingSample ? 'ویرایش نمونه کار' : 'افزودن نمونه کار جدید'}</h3>
                
                {/* Language Tabs */}
                <div className="flex gap-2 mb-4 border-b border-gray-200">
                  {(['en', 'hy', 'ru'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
                        activeLang === lang
                          ? 'border-sky-500 text-sky-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {lang === 'en' ? '🇬🇧 English' : lang === 'hy' ? '🇦🇲 Հայերեն' : '🇷🇺 Русский'}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">عنوان ({activeLang === 'en' ? 'انگلیسی' : activeLang === 'hy' ? 'ارمنی' : 'روسی'})</label>
                    <input
                      type="text"
                      value={sampleForm.title[activeLang]}
                      onChange={(e) => setSampleForm({ ...sampleForm, title: { ...sampleForm.title, [activeLang]: e.target.value } })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                      placeholder={activeLang === 'en' ? 'Example: Office Deep Clean' : activeLang === 'hy' ? 'Օdelays: Գdelays Մdelays' : 'Пример: Глубокая уборка офиса'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع خدمات</label>
                    <select
                      value={sampleForm.serviceType}
                      onChange={(e) => setSampleForm({ ...sampleForm, serviceType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.key}>{s.icon} {s.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات ({activeLang === 'en' ? 'انگلیسی' : activeLang === 'hy' ? 'ارمنی' : 'روسی'})</label>
                    <textarea
                      value={sampleForm.description[activeLang]}
                      onChange={(e) => setSampleForm({ ...sampleForm, description: { ...sampleForm.description, [activeLang]: e.target.value } })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                      placeholder={activeLang === 'en' ? 'Describe the work done' : activeLang === 'hy' ? 'Նdelays delays delays delays' : 'Опишите выполненную работу'}
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">آپلود تصویر</label>
                    
                    {/* File Upload Area */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                          uploadingImage 
                            ? 'border-sky-300 bg-sky-50' 
                            : imagePreview 
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-300 bg-gray-50 hover:border-sky-400 hover:bg-sky-50'
                        }`}
                      >
                        {uploadingImage ? (
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                            <p className="text-sm text-sky-600 font-medium">در حال آپلود...</p>
                          </div>
                        ) : imagePreview ? (
                          <div className="relative w-full h-full">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <p className="text-white font-medium">کلیک کنید برای تغییر تصویر</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Image className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 font-medium mb-1">کلیک کنید یا تصویر را بکشید</p>
                            <p className="text-xs text-gray-500">PNG, JPG, WEBP (حداکثر 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* OR divider */}
                    <div className="flex items-center gap-4 my-4">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-sm text-gray-500">یا</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* URL Input */}
                    <input
                      type="url"
                      value={sampleForm.imageUrl.startsWith('data:') ? '' : sampleForm.imageUrl}
                      onChange={(e) => {
                        setSampleForm({ ...sampleForm, imageUrl: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={editingSample ? handleUpdateSample : handleAddSample}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {editingSample ? 'بروزرسانی نمونه' : 'افزودن نمونه'}
                  </button>
                  <button
                    onClick={() => { setShowSampleForm(false); setEditingSample(null); setImagePreview(''); }}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    انصراف
                  </button>
                </div>
              </div>
            )}

            {/* Work Samples List */}
            {workSamples.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Image className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No work samples yet</h3>
                <p className="text-gray-500">Add your first work sample to showcase your cleaning projects.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workSamples.map((sample) => {
                  const service = services.find(s => s.key === sample.serviceType);
                  return (
                    <div key={sample.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        <img 
                          src={sample.imageUrl} 
                          alt={sample.title.en}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23f1f5f9"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="18" fill="%2394a3b8"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            {service && (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${service.color} mb-2`}>
                                <span>{service.icon}</span>
                                {service.title}
                              </span>
                            )}
                            <h3 className="font-semibold text-gray-900">{sample.title.en}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{sample.description.en}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleEditSample(sample)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteSample(sample.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
