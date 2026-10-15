// Data Store for managing services, pricing, and work samples

export interface Service {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  iconBg: string;
}

export interface PricingRate {
  serviceKey: string;
  ratePerSqm: number;
}

export interface WorkSample {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  serviceType: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  SERVICES: 'shine_services',
  PRICING: 'shine_pricing',
  WORK_SAMPLES: 'shine_work_samples',
};

// Default services
const DEFAULT_SERVICES: Service[] = [
  {
    id: '1',
    key: 'office',
    title: 'Office Cleaning',
    description: 'Keep your workspace pristine and professional.',
    icon: '🏢',
    color: 'from-sky-50 to-blue-50',
    iconBg: 'from-sky-400 to-blue-500',
  },
  {
    id: '2',
    key: 'home',
    title: 'Home Cleaning',
    description: 'Come home to a spotless space.',
    icon: '🏠',
    color: 'from-emerald-50 to-teal-50',
    iconBg: 'from-emerald-400 to-teal-500',
  },
  {
    id: '3',
    key: 'commercial',
    title: 'Commercial Premises',
    description: 'Large-scale cleaning for retail and warehouses.',
    icon: '🏪',
    color: 'from-violet-50 to-purple-50',
    iconBg: 'from-violet-400 to-purple-500',
  },
  {
    id: '4',
    key: 'deep',
    title: 'Deep Cleaning',
    description: 'Intensive cleaning with professional equipment.',
    icon: '🧹',
    color: 'from-amber-50 to-orange-50',
    iconBg: 'from-amber-400 to-orange-500',
  },
];

// Default pricing
const DEFAULT_PRICING: PricingRate[] = [
  { serviceKey: 'office', ratePerSqm: 500 },
  { serviceKey: 'home', ratePerSqm: 400 },
  { serviceKey: 'commercial', ratePerSqm: 350 },
  { serviceKey: 'deep', ratePerSqm: 800 },
];

// Services
export const getServices = (): Service[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return data ? JSON.parse(data) : DEFAULT_SERVICES;
  } catch {
    return DEFAULT_SERVICES;
  }
};

export const saveServices = (services: Service[]) => {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
};

export const addService = (service: Omit<Service, 'id'>): Service => {
  const services = getServices();
  const newService: Service = {
    ...service,
    id: Date.now().toString(),
  };
  services.push(newService);
  saveServices(services);
  return newService;
};

export const updateService = (id: string, updates: Partial<Service>) => {
  const services = getServices();
  const index = services.findIndex(s => s.id === id);
  if (index !== -1) {
    services[index] = { ...services[index], ...updates };
    saveServices(services);
  }
};

export const deleteService = (id: string) => {
  const services = getServices().filter(s => s.id !== id);
  saveServices(services);
};

// Pricing
export const getPricing = (): PricingRate[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRICING);
    return data ? JSON.parse(data) : DEFAULT_PRICING;
  } catch {
    return DEFAULT_PRICING;
  }
};

export const savePricing = (pricing: PricingRate[]) => {
  localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricing));
};

export const updatePricingRate = (serviceKey: string, rate: number) => {
  const pricing = getPricing();
  const index = pricing.findIndex(p => p.serviceKey === serviceKey);
  if (index !== -1) {
    pricing[index].ratePerSqm = rate;
  } else {
    pricing.push({ serviceKey, ratePerSqm: rate });
  }
  savePricing(pricing);
};

// Work Samples
export const getWorkSamples = (): WorkSample[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORK_SAMPLES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveWorkSamples = (samples: WorkSample[]) => {
  localStorage.setItem(STORAGE_KEYS.WORK_SAMPLES, JSON.stringify(samples));
};

export const addWorkSample = (sample: Omit<WorkSample, 'id' | 'createdAt'>): WorkSample => {
  const samples = getWorkSamples();
  const newSample: WorkSample = {
    ...sample,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  samples.push(newSample);
  saveWorkSamples(samples);
  return newSample;
};

export const updateWorkSample = (id: string, updates: Partial<WorkSample>) => {
  const samples = getWorkSamples();
  const index = samples.findIndex(s => s.id === id);
  if (index !== -1) {
    samples[index] = { ...samples[index], ...updates };
    saveWorkSamples(samples);
  }
};

export const deleteWorkSample = (id: string) => {
  const samples = getWorkSamples().filter(s => s.id !== id);
  saveWorkSamples(samples);
};
