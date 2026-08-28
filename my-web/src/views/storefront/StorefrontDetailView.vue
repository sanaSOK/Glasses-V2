<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
    
    <!-- Store Header Banner -->
    <div v-if="store" class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
      <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-indigo-400 font-bold text-3xl shrink-0 shadow-lg">
            <StoreIcon class="w-10 h-10" />
          </div>
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
              <CheckCircle2 class="w-3.5 h-3.5" /> Verified Partner Store
            </div>
            <h1 class="text-3xl font-extrabold tracking-tight">{{ store.name }}</h1>
            <p class="text-xs text-indigo-200 mt-1 max-w-xl leading-relaxed">{{ store.description }}</p>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-xs space-y-2 shrink-0">
          <div class="flex items-center gap-2 text-indigo-200">
            <MapPin class="w-4 h-4 text-indigo-400" /> {{ store.address }}
          </div>
          <div class="flex items-center gap-2 text-indigo-200">
            <Phone class="w-4 h-4 text-indigo-400" /> {{ store.phone }}
          </div>
          <div class="flex items-center gap-2 text-indigo-200">
            <Mail class="w-4 h-4 text-indigo-400" /> {{ store.email }}
          </div>
        </div>

      </div>
    </div>

    <!-- Active Promotions Banner for Store -->
    <div v-if="store?.promotions && store.promotions.length > 0" class="bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-2xl p-4 px-6 flex items-center justify-between shadow-md">
      <div class="flex items-center gap-3">
        <Tag class="w-6 h-6 shrink-0" />
        <div>
          <h4 class="font-bold text-sm">{{ store.promotions[0].name }}</h4>
          <p class="text-xs text-amber-100">{{ store.promotions[0].description }}</p>
        </div>
      </div>
      <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg font-extrabold text-xs">
        {{ store.promotions[0].discount_value }}% OFF
      </span>
    </div>

    <!-- Store Eyewear Collection -->
    <div class="space-y-6">
      <div class="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 class="text-2xl font-extrabold text-slate-900">Store Collection</h2>
        <span class="text-xs font-semibold text-slate-500">{{ productStore.total }} Eyewear Models Available</span>
      </div>

      <!-- Loading State -->
      <div v-if="productStore.loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="n" class="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Product Grid -->
      <div v-else-if="productStore.products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in productStore.products"
          :key="product.id"
          :product="product"
        />
      </div>

      <div v-else class="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
        No products available in this store currently.
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStoreContext, Store } from '@/stores/storesContext';
import { useProductStore } from '@/stores/products';
import ProductCard from '@/components/ProductCard.vue';
import { Store as StoreIcon, CheckCircle2, MapPin, Phone, Mail, Tag } from 'lucide-vue-next';

const route = useRoute();
const storesContext = useStoreContext();
const productStore = useProductStore();

const store = ref<Store | null>(null);

onMounted(async () => {
  const slug = route.params.slug as string;
  store.value = await storesContext.fetchStoreBySlug(slug);
  if (store.value) {
    await productStore.fetchProducts({ store_id: store.value.id });
  }
});
</script>
