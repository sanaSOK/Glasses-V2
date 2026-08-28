<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    
    <!-- Top Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/30 mb-2">
          <ShieldCheck class="w-3.5 h-3.5" /> Super Admin Global Console
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight">System Global Dashboard</h1>
        <p class="text-xs text-slate-400 mt-1">Cross-store system metrics, revenue analytics, and tenant management</p>
      </div>

      <router-link to="/" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors">
        Back to Storefront
      </router-link>
    </div>

    <!-- Stat Cards Matrix -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-semibold block">Total Revenue</span>
        <span class="text-2xl font-black text-indigo-600">${{ reportData?.totalRevenue?.toFixed(2) || '0.00' }}</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-semibold block">Total Stores</span>
        <span class="text-2xl font-black text-slate-900">{{ reportData?.totalStores || 0 }}</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-semibold block">Total Products</span>
        <span class="text-2xl font-black text-slate-900">{{ reportData?.totalProducts || 0 }}</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-semibold block">Total Orders</span>
        <span class="text-2xl font-black text-slate-900">{{ reportData?.totalOrders || 0 }}</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 col-span-2 lg:col-span-1">
        <span class="text-xs text-slate-400 font-semibold block">Total Users</span>
        <span class="text-2xl font-black text-slate-900">{{ reportData?.totalUsers || 0 }}</span>
      </div>
    </div>

    <!-- Analytics Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Best Performing Stores -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
          <Store class="w-5 h-5 text-indigo-600" /> Store Revenue Performance
        </h3>

        <div class="space-y-3">
          <div
            v-for="st in reportData?.storePerformance || []"
            :key="st.storeId"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
          >
            <div>
              <span class="font-bold text-slate-900 text-sm block">{{ st.storeName }}</span>
              <span class="text-slate-400">{{ st.totalOrders }} Total Orders Received</span>
            </div>
            <span class="font-extrabold text-indigo-600 text-sm">${{ Number(st.totalRevenue || 0).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Best Selling Eyewear Global -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
          <Glasses class="w-5 h-5 text-indigo-600" /> Global Top Selling Glasses
        </h3>

        <div class="space-y-3">
          <div
            v-for="prod in reportData?.bestSellingProducts || []"
            :key="prod.productId"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
          >
            <div>
              <span class="font-bold text-slate-900 block">{{ prod.productName }}</span>
              <span class="text-slate-400">Total Quantity Sold: {{ prod.totalQuantity }}</span>
            </div>
            <span class="font-bold text-slate-900">${{ Number(prod.totalRevenue || 0).toFixed(2) }}</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { ShieldCheck, Store, Glasses } from 'lucide-vue-next';

const reportData = ref<any>(null);

onMounted(async () => {
  try {
    const res: any = await api.get('/reports/super-admin');
    reportData.value = res.data;
  } catch (err) {
    console.error(err);
  }
});
</script>
