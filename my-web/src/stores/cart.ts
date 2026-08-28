import { defineStore } from 'pinia';
import api from '@/services/api';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    brand?: string;
    images?: { image_url: string }[];
  };
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    total: 0,
    storeId: null as number | null,
    isOpen: false,
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },

  actions: {
    async fetchCart(storeId?: number) {
      try {
        const query = storeId ? `?store_id=${storeId}` : '';
        const res: any = await api.get(`/cart${query}`);
        if (res.data) {
          this.items = res.data.items || [];
          this.total = res.data.total || 0;
          this.storeId = res.data.store_id || null;
        }
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }
    },

    async addItem(productId: number, quantity = 1, storeId?: number) {
      const res: any = await api.post('/cart/items', {
        product_id: productId,
        quantity,
        store_id: storeId,
      });
      if (res.data) {
        this.items = res.data.items || [];
        this.total = res.data.total || 0;
        this.isOpen = true;
      }
    },

    async updateItem(itemId: number, quantity: number) {
      const res: any = await api.patch(`/cart/items/${itemId}`, { quantity });
      if (res.data) {
        this.items = res.data.items || [];
        this.total = res.data.total || 0;
      }
    },

    async removeItem(itemId: number) {
      const res: any = await api.delete(`/cart/items/${itemId}`);
      if (res.data) {
        this.items = res.data.items || [];
        this.total = res.data.total || 0;
      }
    },

    async clearCart(storeId?: number) {
      const query = storeId ? `?store_id=${storeId}` : '';
      await api.delete(`/cart${query}`);
      this.items = [];
      this.total = 0;
    },
  },
});
