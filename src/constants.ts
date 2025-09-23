// Base URL for documentation and API endpoints
export const BASE_URL = '/Active-Directory-CheatSheet/';

// Documentation paths
export const DOCS_PATH = `${BASE_URL}docs`;

// File paths
export const INDEX_JSON_PATH = `${DOCS_PATH}/index.json`;

// API endpoints configuration
export const API_CONFIG = {
  headers: {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache'
  },
  cache: 'no-cache' as RequestCache
};

// Cache configuration
export const CACHE_CONFIG = {
  refreshInterval: 300000, // 5 minutes
  maxRetries: 3,
  cacheKeyPrefix: 'csv_dashboard_'
};

// Tag categories
export const TAG_CATEGORIES = {
  attackTypes: ['Authenticated', 'Unauthenticated'] as string[],
  tools: ['Enum4Linux', 'Netexec', 'BloodHound', 'SMBMap', 'Crackmapexec'] as string[],
  general: ['Enumeration', 'Brute-Forcing', 'Password Spraying', 'SMB'] as string[]
};