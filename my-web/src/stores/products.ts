import { defineStore } from 'pinia';
import api from '@/services/api';

export interface Product {
  id: number;
  store_id: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  price: number;
  discount_price?: number;
  stock: number;
  sku?: string;
  frame_shape?: string;
  frame_material?: string;
  frame_color?: string;
  gender?: string;
  lens_type?: string;
  status: string;
  images?: { id: number; image_url: string; is_primary: boolean }[];
  category?: { name: string };
  store?: { name: string; slug: string };
  reviews?: { id: number; rating: number; comment: string; customer?: { user?: { name: string } } }[];
}

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    currentProduct: null as Product | null,
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
    loading: false,
  }),

  actions: {
    async fetchProducts(filters: Record<string, any> = {}) {
      this.loading = true;
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            params.append(key, String(val));
          }
        });

        const res: any = await api.get(`/products?${params.toString()}`);
        if (res.data) {
          this.products = res.data.items || [];
          this.total = res.data.total || 0;
          this.page = res.data.page || 1;
          this.limit = res.data.limit || 20;
          this.totalPages = res.data.totalPages || 1;
        }
      } finally {
        this.loading = false;
      }
    },

    async fetchProductBySlug(slug: string) {
      this.loading = true;
      try {
        const res: any = await api.get(`/products/slug/${slug}`);
        this.currentProduct = res.data || null;
        return this.currentProduct;
      } finally {
        this.loading = false;
      }
    },
  },
});
