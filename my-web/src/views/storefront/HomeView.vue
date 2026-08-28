<template>
  <div class="space-y-16 pb-20 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6">
    
    <!-- Elegant Minimal Hero Section -->
    <section class="relative overflow-hidden bg-neutral-900 text-white w-full rounded-3xl border border-neutral-800 shadow-2xl">
      <div class="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent z-10"></div>
      <img
        src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=1600"
        alt="Glasses Hero"
        class="absolute inset-0 w-full h-full object-cover object-center opacity-45"
      />
      
      <div class="relative z-20 w-full px-8 sm:px-14 py-20 md:py-28 max-w-2xl space-y-7">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold rounded-full backdrop-blur-xs">
          <Sparkles class="w-3.5 h-3.5 text-indigo-400" /> Multi-Tenant Optical Network
        </div>

        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Crafted Eyewear <br />
          <span class="text-indigo-400 font-light">for Clearer Vision.</span>
        </h1>

        <p class="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
          Explore handcrafted prescription frames, designer sunglasses, and custom precision lenses across our partner optical boutique network.
        </p>

        <div class="flex flex-wrap items-center gap-4 pt-2">
          <router-link to="/shop" class="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-full transition-all shadow-lg shadow-indigo-600/25">
            Explore Catalog
          </router-link>
          <router-link to="/stores" class="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all rounded-full backdrop-blur-xs">
            Partner Stores
          </router-link>
        </div>
      </div>
    </section>

    <!-- Partner Stores Showcase -->
    <section class="w-full space-y-6">
      <div class="flex items-end justify-between border-b border-neutral-200/80 pb-4">
        <div>
          <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">Boutique Directory</span>
          <h2 class="text-2xl font-bold text-neutral-900 tracking-tight">Partner Optical Stores</h2>
        </div>
        <router-link to="/stores" class="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          All Stores <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="store in storesContext.stores"
          :key="store.id"
          class="bg-white border border-neutral-200/80 p-6 hover:border-neutral-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between rounded-2xl"
        >
          <div class="space-y-4">
            <div class="w-11 h-11 bg-neutral-900 text-white flex items-center justify-center rounded-xl shadow-xs">
              <StoreIcon class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-lg text-neutral-900 tracking-tight">
                {{ store.name }}
              </h3>
              <span class="text-xs font-medium text-indigo-600 block mt-0.5">/stores/{{ store.slug }}</span>
            </div>
            <p class="text-xs text-neutral-500 line-clamp-2 leading-relaxed font-normal">
              {{ store.description || 'Specialist prescription optical storefront with high precision lens assembly.' }}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold">
            <span class="text-neutral-400">{{ store.address?.split(',')[0] || 'Boutique' }}</span>
            <router-link :to="`/stores/${store.slug}`" class="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Visit Store <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Glasses Products (3D Stack & Grid View) -->
    <section class="w-full space-y-6">
      <div class="flex items-end justify-between border-b border-neutral-200/80 pb-4">
        <div>
          <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">Curated Eyewear</span>
          <h2 class="text-2xl font-bold text-neutral-900 tracking-tight">Featured Frames & Sun Specs</h2>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- View Toggle Buttons -->
          <div class="inline-flex border border-neutral-200 p-1 bg-neutral-100/80 rounded-full">
            <button
              @click="featuredViewMode = 'stack'"
              class="px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all rounded-full"
              :class="featuredViewMode === 'stack' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'"
            >
              <Layers class="w-3.5 h-3.5" /> 3D Stack
            </button>
            <button
              @click="featuredViewMode = 'grid'"
              class="px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all rounded-full"
              :class="featuredViewMode === 'grid' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'"
            >
              <LayoutGrid class="w-3.5 h-3.5" /> Grid
            </button>
          </div>

          <router-link to="/shop" class="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            Browse All <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>

      <!-- 3D Card Stack View -->
      <div v-if="featuredViewMode === 'stack'" class="py-4">
        <CardStack
          :items="productStore.products.slice(0, 8)"
          :card-width="360"
          :card-height="450"
          :auto-advance="true"
          :interval-ms="3500"
          :spread-deg="36"
          :max-visible="5"
          :overlap="0.45"
        >
          <template #default="{ item }">
            <ProductCard :product="item" class="h-full" />
          </template>
        </CardStack>
      </div>

      <!-- Standard Grid View -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in productStore.products.slice(0, 8)"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

    <!-- Features Dark Banner -->
    <section class="w-full bg-neutral-900 text-white py-12 px-8 sm:px-12 rounded-3xl border border-neutral-800 shadow-xl">
      <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="flex items-start gap-4">
          <div class="p-3 bg-white/10 text-indigo-400 rounded-2xl shrink-0">
            <Eye class="w-6 h-6" />
          </div>
          <div class="space-y-1">
            <h4 class="font-bold text-sm text-white">Digital Prescription Fitting</h4>
            <p class="text-xs text-neutral-400 leading-relaxed font-normal">
              Upload your doctor's optical prescription (SPH, CYL, AXIS, PD) directly for custom lens cutting.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="p-3 bg-white/10 text-indigo-400 rounded-2xl shrink-0">
            <Truck class="w-6 h-6" />
          </div>
          <div class="space-y-1">
            <h4 class="font-bold text-sm text-white">Fast Multi-Store Dispatch</h4>
            <p class="text-xs text-neutral-400 leading-relaxed font-normal">
              Direct dispatch from partner optical laboratories with secure protective hard-case packaging.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="p-3 bg-white/10 text-indigo-400 rounded-2xl shrink-0">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <div class="space-y-1">
            <h4 class="font-bold text-sm text-white">Isolated Store Architecture</h4>
            <p class="text-xs text-neutral-400 leading-relaxed font-normal">
              Multi-tenant store isolation ensuring private pricing, inventory tracking, and custom store policies.
            </p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/products';
import { useStoreContext } from '@/stores/storesContext';
import ProductCard from '@/components/ProductCard.vue';
import CardStack from '@/components/ui/CardStack.vue';
import { Sparkles, ArrowRight, Store as StoreIcon, Eye, Truck, ShieldCheck, Layers, LayoutGrid } from 'lucide-vue-next';

const productStore = useProductStore();
const storesContext = useStoreContext();
const featuredViewMode = ref<'stack' | 'grid'>('stack');

onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    storesContext.fetchStores(),
  ]);
});
</script>
