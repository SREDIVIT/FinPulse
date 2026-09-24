const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
};

export const api = {
  // Health
  checkHealth: async () => {
    const res = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(res);
  },

  // Auth
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  googleLogin: async (data = {}) => {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  sendOtp: async (email) => {
    const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse(res);
  },

  resetPassword: async ({ email, otp, newPassword }) => {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });
    return handleResponse(res);
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  },

  // Transactions
  getTransactions: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/transactions${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createTransaction: async (txData) => {
    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(txData)
    });
    return handleResponse(res);
  },

  updateTransaction: async (id, txData) => {
    const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(txData)
    });
    return handleResponse(res);
  },

  deleteTransaction: async (id) => {
    const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Budgets
  getBudgets: async () => {
    const res = await fetch(`${API_BASE_URL}/budgets`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createBudget: async (budgetData) => {
    const res = await fetch(`${API_BASE_URL}/budgets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(budgetData)
    });
    return handleResponse(res);
  },

  updateBudget: async (id, budgetData) => {
    const res = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(budgetData)
    });
    return handleResponse(res);
  },

  deleteBudget: async (id) => {
    const res = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Goals
  getGoals: async () => {
    const res = await fetch(`${API_BASE_URL}/goals`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createGoal: async (goalData) => {
    const res = await fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(goalData)
    });
    return handleResponse(res);
  },

  updateGoal: async (id, goalData) => {
    const res = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(goalData)
    });
    return handleResponse(res);
  },

  depositToGoal: async (id, amount) => {
    const res = await fetch(`${API_BASE_URL}/goals/${id}/deposit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount })
    });
    return handleResponse(res);
  },

  deleteGoal: async (id) => {
    const res = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Subscriptions
  getSubscriptions: async () => {
    const res = await fetch(`${API_BASE_URL}/subscriptions`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createSubscription: async (subData) => {
    const res = await fetch(`${API_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(subData)
    });
    return handleResponse(res);
  },

  updateSubscription: async (id, subData) => {
    const res = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(subData)
    });
    return handleResponse(res);
  },

  deleteSubscription: async (id) => {
    const res = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Notifications
  getNotifications: async () => {
    const res = await fetch(`${API_BASE_URL}/notifications`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  markNotificationRead: async (id, read = true) => {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ read })
    });
    return handleResponse(res);
  },

  markAllNotificationsRead: async () => {
    const res = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  deleteNotification: async (id) => {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Analytics
  getSummary: async () => {
    const res = await fetch(`${API_BASE_URL}/analytics/summary`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getCategoryBreakdown: async () => {
    const res = await fetch(`${API_BASE_URL}/analytics/categories`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getMonthlyTrends: async () => {
    const res = await fetch(`${API_BASE_URL}/analytics/monthly-trends`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getAnomalies: async () => {
    const res = await fetch(`${API_BASE_URL}/analytics/anomalies`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};

export default api;
