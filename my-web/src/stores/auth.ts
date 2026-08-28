import { defineStore } from 'pinia';
import api from '@/services/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'STAFF' | 'CUSTOMER';
  storeId?: number | null;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    token: localStorage.getItem('token') || '',
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isSuperAdmin: (state) => state.user?.role === 'SUPER_ADMIN',
    isStoreAdmin: (state) => state.user?.role === 'STORE_ADMIN' || state.user?.role === 'SUPER_ADMIN',
    isStaff: (state) => state.user?.role === 'STAFF' || state.user?.role === 'STORE_ADMIN' || state.user?.role === 'SUPER_ADMIN',
    isCustomer: (state) => state.user?.role === 'CUSTOMER',
    userStoreId: (state) => state.user?.storeId || null,
  },

  actions: {
    async login(credentials: any) {
      const res: any = await api.post('/auth/login', credentials);
      this.token = res.data.accessToken;
      this.user = res.data.user;

      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      if (this.user?.storeId) {
        localStorage.setItem('currentStoreId', this.user.storeId.toString());
      }
      return res;
    },

    async register(data: any) {
      const res: any = await api.post('/auth/register', data);
      this.token = res.data.accessToken;
      this.user = res.data.user;

      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      if (this.user?.storeId) {
        localStorage.setItem('currentStoreId', this.user.storeId.toString());
      }
      return res;
    },

    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('currentStoreId');
    },

    async fetchProfile() {
      if (!this.token) return;
      try {
        const res: any = await api.get('/auth/profile');
        this.user = res.data;
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch {
        this.logout();
      }
    },
  },
});
