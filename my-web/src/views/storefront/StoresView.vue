<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
    
    <!-- Page Header -->
    <div class="text-center max-w-2xl mx-auto space-y-3">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
        <Store class="w-3.5 h-3.5" /> Accredited Boutique Directory
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">Our Partner Optical Stores</h1>
      <p class="text-neutral-500 text-sm leading-relaxed">
        Discover accredited independent optical boutiques operating within our multi-tenant platform network.
      </p>
    </div>

    <!-- Store Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        v-for="store in storesContext.stores"
        :key="store.id"
        class="bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-sm hover:shadow-xl hover:border-indigo-400/80 transition-all duration-300 flex flex-col justify-between group"
      >
        <div class="space-y-5">
          <div class="flex items-center justify-between">
            <div class="w-16 h-16 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold text-2xl shadow-md group-hover:bg-indigo-600 transition-colors">
              <Store class="w-8 h-8" />
            </div>
            <span class="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
              Active Boutique
            </span>
          </div>

          <div>
            <h2 class="text-xl font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">{{ store.name }}</h2>
            <p class="text-xs text-indigo-600 font-mono mt-0.5">/stores/{{ store.slug }}</p>
          </div>

          <p class="text-xs text-neutral-500 leading-relaxed line-clamp-3">
            {{ store.description || 'Specialist prescription optical storefront with high precision lens assembly.' }}
          </p>

          <div class="space-y-2.5 pt-4 border-t border-neutral-100 text-xs text-neutral-600 font-medium">
            <div class="flex items-center gap-2 text-neutral-600">
              <MapPin class="w-4 h-4 text-indigo-600 shrink-0" />
              <span class="truncate">{{ formatAddress(store.address) }}</span>
            </div>
            <div v-if="store.phone" class="flex items-center gap-2 text-neutral-600">
              <Phone class="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{{ store.phone }}</span>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-4 border-t border-neutral-100">
          <router-link
            :to="`/stores/${store.slug}`"
            class="w-full py-3.5 rounded-2xl bg-neutral-950 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-indigo-600/25"
          >
            Enter Storefront <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStoreContext } from '@/stores/storesContext';
import { Store, MapPin, Phone, ArrowRight } from 'lucide-vue-next';

const storesContext = useStoreContext();

function formatAddress(addr?: string): string {
  if (!addr || !addr.trim()) return 'Boutique Store';
  const clean = addr.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.includes('maps.google') || clean.includes('google.com/maps')) {
    try {
      if (clean.includes('q=')) {
        const queryParam = clean.split('q=')[1]?.split('&')[0];
        if (queryParam) return decodeURIComponent(queryParam).replace(/\+/g, ' ');
      }
      if (clean.includes('/place/')) {
        const placeName = clean.split('/place/')[1]?.split('/')[0];
        if (placeName) return decodeURIComponent(placeName).replace(/\+/g, ' ');
      }
    } catch {
      // fallback
    }
    return 'Optical Boutique';
  }
  return clean.split(',')[0] || clean;
}

onMounted(() => {
  storesContext.fetchStores();
});
</script>
