import { defineStore } from 'pinia';
import api from '@/services/api';

export interface Store {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: string;
  categories?: any[];
  promotions?: any[];
}

export const useStoreContext = defineStore('storesContext', {
  state: () => ({
    stores: [] as Store[],
    currentStore: null as Store | null,
    loading: false,
  }),

  actions: {
    async fetchStores() {
      this.loading = true;
      try {
        const res: any = await api.get('/stores');
        this.stores = res.data || [];
      } finally {
        this.loading = false;
      }
    },

    async fetchStoreBySlug(slug: string) {
      this.loading = true;
      try {
        const res: any = await api.get(`/stores/slug/${slug}`);
        this.currentStore = res.data || null;
        if (this.currentStore) {
          localStorage.setItem('currentStoreId', this.currentStore.id.toString());
        }
        return this.currentStore;
      } finally {
        this.loading = false;
      }
    },
  },
});
