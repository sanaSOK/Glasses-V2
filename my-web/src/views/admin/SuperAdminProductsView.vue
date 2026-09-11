<template>
  <div class="flex min-h-screen bg-[#060814] text-slate-100 font-sans">
    
    <!-- Left Sidebar -->
    <SuperAdminSidebar />

    <!-- Main Workspace -->
    <main class="flex-1 p-8 space-y-8 overflow-y-auto w-full">
      
      <!-- Top Banner -->
      <div class="relative overflow-hidden bg-[#0b0e24] p-6 sm:p-8 rounded-3xl border border-[#171c3b] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-2 relative z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5542f6]/20 text-[#818cf8] text-xs font-semibold border border-[#5542f6]/40">
            <Glasses class="w-3.5 h-3.5 text-[#818cf8]" /> Global Eyewear Catalog
          </div>
          <h1 class="text-3xl font-extrabold tracking-wider text-white">Global Product Inventory</h1>
          <p class="text-xs text-[#7582b5]">Super Admin cross-store inventory, pricing, and product catalog controls</p>
        </div>

        <router-link
          to="/shop"
          class="px-5 py-3 bg-[#5542f6] hover:bg-[#4736e6] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#5542f6]/30 flex items-center gap-2 shrink-0 relative z-10"
        >
          Browse Catalog
        </router-link>
      </div>

      <!-- Filters & Search -->
      <div class="flex items-center justify-between bg-[#0b0e24] p-4 rounded-2xl border border-[#171c3b]">
        <div class="relative w-80">
          <Search class="w-4 h-4 text-[#65719e] absolute left-3.5 top-3" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products by name or slug..."
            class="w-full bg-[#060814] border border-[#171c3b] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#65719e] focus:outline-none focus:border-[#5542f6]"
          />
        </div>

        <div class="text-xs text-[#7582b5] font-semibold">
          Total Products: <span class="font-bold text-white">{{ filteredProducts.length }}</span>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-[#0b0e24] rounded-3xl border border-[#171c3b] overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#0d112d] text-[#6d79a8] uppercase tracking-wider font-extrabold border-b border-[#181d3d]">
              <tr>
                <th class="px-6 py-4">ID</th>
                <th class="px-6 py-4">EYEWEAR PRODUCT</th>
                <th class="px-6 py-4">PRICE</th>
                <th class="px-6 py-4">STOCK</th>
                <th class="px-6 py-4">GENDER</th>
                <th class="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#141836] text-slate-200">
              <tr v-if="filteredProducts.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-[#65719e]">
                  No eyewear products found in global catalog.
                </td>
              </tr>

              <tr
                v-for="(p, index) in filteredProducts"
                :key="p.id"
                class="hover:bg-[#101435] transition-colors"
              >
                <td class="px-6 py-4 font-mono font-extrabold text-[#818cf8]">#{{ index + 1 }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-[#060814] border border-[#171c3b] flex items-center justify-center text-[#818cf8] font-bold text-xs shrink-0 overflow-hidden">
                      <img v-if="p.images && p.images[0]" :src="p.images[0].url" class="w-full h-full object-cover" />
                      <Glasses v-else class="w-5 h-5" />
                    </div>
                    <div>
                      <span class="font-bold text-white block text-sm">{{ p.name }}</span>
                      <span class="text-[#65719e] text-[11px] font-mono">/products/{{ p.slug }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 font-black text-white text-sm">
                  ${{ Number(p.price || 0).toFixed(2) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-[11px] font-bold border inline-block"
                    :class="p.stock > 10 ? 'bg-[#142b1f] text-[#34d399] border-[#1d4d35]' : 'bg-[#2b2414] text-[#fbbf24] border-[#4d3d19]'"
                  >
                    {{ p.stock }} units
                  </span>
                </td>
                <td class="px-6 py-4 uppercase font-semibold text-[#7582b5] text-[11px]">
                  {{ p.gender || 'UNISEX' }}
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <router-link
                    :to="`/products/${p.slug}`"
                    class="px-3 py-1.5 rounded-lg bg-[#1a214d] text-[#818cf8] border border-[#2b357a] hover:bg-[#222b64] text-xs font-semibold inline-block transition-colors"
                  >
                    Inspect
                  </router-link>
                  <button
                    @click="deleteProduct(p.id)"
                    class="px-3 py-1.5 rounded-lg bg-[#2a1320] text-[#f87171] border border-[#4a1c2d] hover:bg-[#3d182b] text-xs font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';
import SuperAdminSidebar from '@/components/admin/SuperAdminSidebar.vue';
import { Glasses, Search } from 'lucide-vue-next';

const products = ref<any[]>([]);
const searchQuery = ref('');

async function fetchProducts() {
  try {
    const res: any = await api.get('/products');
    products.value = res.data || res;
  } catch (err) {
    console.error('Failed to fetch products', err);
  }
}

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    return (
      !searchQuery.value ||
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

async function deleteProduct(id: number) {
  if (!confirm('Are you sure you want to delete this eyewear product?')) return;
  try {
    await api.delete(`/products/${id}`);
    await fetchProducts();
  } catch (err: any) {
    alert(err.message || 'Failed to delete product');
  }
}

onMounted(() => {
  fetchProducts();
});
</script>
