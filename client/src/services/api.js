const API_BASE = '/api';

export const api = {
  // Products
  getProducts: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  getProductById: async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product details');
    return res.json();
  },

  getCategories: async () => {
    const res = await fetch(`${API_BASE}/products/meta/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  getBrands: async () => {
    const res = await fetch(`${API_BASE}/products/meta/brands`);
    if (!res.ok) throw new Error('Failed to fetch brands');
    return res.json();
  },

  // Auth
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  forgotPassword: async (email) => {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send reset link');
    return data;
  },

  resetPassword: async ({ token, code, newPassword }) => {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, code, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Password reset failed');
    return data;
  },

  changePassword: async ({ currentPassword, newPassword }, token) => {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
    return data;
  },

  getProfile: async (token) => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load profile');
    return data;
  },

  updateProfile: async (profileData, token) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    return data;
  },

  getMailInbox: async () => {
    const res = await fetch(`${API_BASE}/auth/mail-inbox`);
    if (!res.ok) throw new Error('Failed to fetch inbox');
    return res.json();
  },

  // Payment
  processPayment: async (paymentPayload) => {
    const res = await fetch(`${API_BASE}/payment/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentPayload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Payment failed');
    return data;
  },

  // Orders
  createOrder: async (orderPayload) => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order creation failed');
    return data;
  },

  getUserOrders: async (userId) => {
    const res = await fetch(`${API_BASE}/orders/user/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user orders');
    return res.json();
  },

  getOrderById: async (orderId) => {
    const res = await fetch(`${API_BASE}/orders/${orderId}`);
    if (!res.ok) throw new Error('Failed to fetch order details');
    return res.json();
  },

  // Newsletter
  subscribeNewsletter: async (email) => {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
    return data;
  }
};
