<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <div class="text-center max-w-2xl mx-auto space-y-3">
      <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Our Partner Optical Stores</h1>
      <p class="text-slate-500 text-sm">
        Discover accredited independent optical boutiques operating within our multi-tenant platform network.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        v-for="store in storesContext.stores"
        :key="store.id"
        class="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
      >
        <div class="space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl shadow-inner">
            <Store class="w-8 h-8" />
          </div>

          <div>
            <h2 class="text-xl font-bold text-slate-900">{{ store.name }}</h2>
            <p class="text-xs text-indigo-600 font-semibold mt-0.5">/stores/{{ store.slug }}</p>
          </div>

          <p class="text-xs text-slate-500 leading-relaxed">
            {{ store.description }}
          </p>

          <div class="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <div class="flex items-center gap-2">
              <MapPin class="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{{ store.address }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Phone class="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{{ store.phone }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Mail class="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{{ store.email }}</span>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-4 border-t border-slate-100">
          <router-link
            :to="`/stores/${store.slug}`"
            class="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
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
import { Store, MapPin, Phone, Mail, ArrowRight } from 'lucide-vue-next';

const storesContext = useStoreContext();

onMounted(() => {
  storesContext.fetchStores();
});
</script>
