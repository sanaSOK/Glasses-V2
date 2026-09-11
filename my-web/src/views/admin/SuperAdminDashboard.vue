<template>
  <div class="flex min-h-screen bg-[#060814] text-slate-100 font-sans">
    
    <!-- Super Admin Left Sidebar -->
    <SuperAdminSidebar />

    <!-- Main Admin Workspace -->
    <main class="flex-1 p-8 space-y-8 overflow-y-auto w-full">
      
      <!-- Top Banner -->
      <div class="relative overflow-hidden bg-[#0b0e24] p-8 rounded-3xl border border-[#171c3b] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-2 relative z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5542f6]/20 text-[#818cf8] text-xs font-semibold border border-[#5542f6]/40">
            <ShieldCheck class="w-3.5 h-3.5 text-[#818cf8]" /> Super Admin Global Console
          </div>
          <h1 class="text-3xl font-extrabold tracking-wider text-white">System Global Dashboard</h1>
          <p class="text-xs text-[#7582b5] max-w-xl">Cross-store system metrics, revenue analytics, and tenant management</p>
        </div>

        <div class="flex items-center gap-3 relative z-10">
          <router-link to="/admin/users" class="px-5 py-3 bg-[#5542f6] hover:bg-[#4736e6] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#5542f6]/30 flex items-center gap-2">
            <Users class="w-4 h-4" /> Manage Admins
          </router-link>
          <router-link to="/" class="px-5 py-3 bg-[#121633] hover:bg-[#1a2046] text-[#a0abd8] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#202754]">
            Back to Storefront
          </router-link>
        </div>
      </div>

      <!-- Stat Cards Matrix -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-[#0b0e24] p-5 rounded-2xl border border-[#171c3b] shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs text-[#7582b5] font-semibold">Total Revenue</span>
            <DollarSign class="w-4 h-4 text-[#818cf8]" />
          </div>
          <span class="text-2xl font-black text-white block">
            ${{ reportData?.totalRevenue?.toFixed(2) || '0.00' }}
          </span>
        </div>

        <div class="bg-[#0b0e24] p-5 rounded-2xl border border-[#171c3b] shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs text-[#7582b5] font-semibold">Total Stores</span>
            <Store class="w-4 h-4 text-[#818cf8]" />
          </div>
          <span class="text-2xl font-black text-white block">{{ reportData?.totalStores || 0 }}</span>
        </div>

        <div class="bg-[#0b0e24] p-5 rounded-2xl border border-[#171c3b] shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs text-[#7582b5] font-semibold">Total Products</span>
            <Glasses class="w-4 h-4 text-[#818cf8]" />
          </div>
          <span class="text-2xl font-black text-white block">{{ reportData?.totalProducts || 0 }}</span>
        </div>

        <div class="bg-[#0b0e24] p-5 rounded-2xl border border-[#171c3b] shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs text-[#7582b5] font-semibold">Total Orders</span>
            <ShoppingBag class="w-4 h-4 text-[#818cf8]" />
          </div>
          <span class="text-2xl font-black text-white block">{{ reportData?.totalOrders || 0 }}</span>
        </div>

        <div class="bg-[#0b0e24] p-5 rounded-2xl border border-[#171c3b] shadow-sm space-y-2 col-span-2 lg:col-span-1">
          <div class="flex items-center justify-between">
            <span class="text-xs text-[#7582b5] font-semibold">Total Users & Admins</span>
            <Users class="w-4 h-4 text-[#818cf8]" />
          </div>
          <span class="text-2xl font-black text-white block">{{ reportData?.totalUsers || 0 }}</span>
        </div>
      </div>

      <!-- Analytics Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Best Performing Stores -->
        <div class="bg-[#0b0e24] p-6 rounded-3xl border border-[#171c3b] shadow-sm space-y-4">
          <h3 class="font-bold text-white text-base flex items-center gap-2">
            <Store class="w-5 h-5 text-[#818cf8]" /> Store Revenue Performance
          </h3>

          <div class="space-y-3">
            <div
              v-for="st in reportData?.storePerformance || []"
              :key="st.storeId"
              class="flex items-center justify-between p-4 rounded-2xl bg-[#0d112d] border border-[#181d3d] text-xs"
            >
              <div>
                <span class="font-bold text-white text-sm block">{{ st.storeName }}</span>
                <span class="text-[#7582b5]">{{ st.totalOrders }} Total Orders Received</span>
              </div>
              <span class="font-black text-[#818cf8] text-sm">${{ Number(st.totalRevenue || 0).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Best Selling Eyewear Global -->
        <div class="bg-[#0b0e24] p-6 rounded-3xl border border-[#171c3b] shadow-sm space-y-4">
          <h3 class="font-bold text-white text-base flex items-center gap-2">
            <Glasses class="w-5 h-5 text-[#818cf8]" /> Global Top Selling Glasses
          </h3>

          <div class="space-y-3">
            <div
              v-for="prod in reportData?.bestSellingProducts || []"
              :key="prod.productId"
              class="flex items-center justify-between p-4 rounded-2xl bg-[#0d112d] border border-[#181d3d] text-xs"
            >
              <div>
                <span class="font-bold text-white block text-sm">{{ prod.productName }}</span>
                <span class="text-[#7582b5]">Total Quantity Sold: {{ prod.totalQuantity }}</span>
              </div>
              <span class="font-extrabold text-white">${{ Number(prod.totalRevenue || 0).toFixed(2) }}</span>
            </div>
          </div>
        </div>

      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import SuperAdminSidebar from '@/components/admin/SuperAdminSidebar.vue';
import { ShieldCheck, Store, Glasses, Users, DollarSign, ShoppingBag } from 'lucide-vue-next';

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
