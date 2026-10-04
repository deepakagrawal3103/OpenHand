const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000') + '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('openhand_token') || localStorage.getItem('helpgrid_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('openhand_token', token);
  } else {
    localStorage.removeItem('openhand_token');
    localStorage.removeItem('helpgrid_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok || data.success === false) {
    const errorMsg = data.error?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data.data;
}

export const api = {
  // Auth
  signup: (payload: any) => request<any>('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request<any>('/auth/me'),
  updateProfile: (payload: any) => request<any>('/auth/me', { method: 'PATCH', body: JSON.stringify(payload) }),
  getSuitableMatches: () => request<any>('/auth/me/suitable-matches'),
  sendWhatsAppAlert: (payload: any) => request<any>('/auth/alerts/whatsapp', { method: 'POST', body: JSON.stringify(payload) }),

  // Requests
  getRequests: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') searchParams.append(k, String(v));
    });
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request<any[]>(`/requests${qs}`);
  },
  getRequestById: (id: string) => request<any>(`/requests/${id}`),
  createRequest: (payload: any) => request<any>('/requests', { method: 'POST', body: JSON.stringify(payload) }),
  editRequest: (id: string, payload: any) => request<any>(`/requests/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  publishRequest: (id: string) => request<any>(`/requests/${id}/publish`, { method: 'POST' }),
  getRequestMatches: (id: string) => request<any[]>(`/requests/${id}/matches`),
  verifyRequest: (id: string, payload: any) => request<any>(`/requests/${id}/verify`, { method: 'POST', body: JSON.stringify(payload) }),

  // Matches & Tasks
  acceptMatch: (matchId: string) => request<any>(`/matches/${matchId}/accept`, { method: 'POST' }),
  getTaskById: (id: string) => request<any>(`/tasks/${id}`),
  updateTaskStatus: (id: string, payload: any) => request<any>(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify(payload) }),
  submitProof: (id: string, payload: any) => request<any>(`/tasks/${id}/proof`, { method: 'POST', body: JSON.stringify(payload) }),
  getTaskMessages: (id: string) => request<any[]>(`/tasks/${id}/messages`),
  sendTaskMessage: (id: string, payload: any) => request<any>(`/tasks/${id}/messages`, { method: 'POST', body: JSON.stringify(payload) }),

  // Helpers
  updateAvailability: (payload: any) => request<any>('/helpers/me/availability', { method: 'PATCH', body: JSON.stringify(payload) }),
  getHelperOpportunities: () => request<any[]>('/helpers/me/opportunities'),
  getHelperTasks: () => request<any[]>('/helpers/me/tasks'),

  // AI
  understandRequest: (text: string) => request<any>('/ai/understand-request', { method: 'POST', body: JSON.stringify({ text }) }),
  checkDuplicate: (payload: any) => request<any>('/ai/check-duplicate', { method: 'POST', body: JSON.stringify(payload) }),

  // Live
  getLiveData: () => request<any>('/live'),
};
