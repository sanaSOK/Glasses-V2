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
            <ShoppingBag class="w-3.5 h-3.5 text-[#818cf8]" /> Global Sales & Order Audit
          </div>
          <h1 class="text-3xl font-extrabold tracking-wider text-white">Orders & Transactions</h1>
          <p class="text-xs text-[#7582b5]">Super Admin monitoring for multi-store customer purchases, fulfillment, and payment statuses</p>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="flex items-center justify-between bg-[#0b0e24] p-4 rounded-2xl border border-[#171c3b]">
        <div class="relative w-80">
          <Search class="w-4 h-4 text-[#65719e] absolute left-3.5 top-3" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search order ID or status..."
            class="w-full bg-[#060814] border border-[#171c3b] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#65719e] focus:outline-none focus:border-[#5542f6]"
          />
        </div>

        <div class="text-xs text-[#7582b5] font-semibold">
          Total Orders: <span class="font-bold text-white">{{ filteredOrders.length }}</span>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-[#0b0e24] rounded-3xl border border-[#171c3b] overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#0d112d] text-[#6d79a8] uppercase tracking-wider font-extrabold border-b border-[#181d3d]">
              <tr>
                <th class="px-6 py-4">ORDER ID</th>
                <th class="px-6 py-4">TOTAL AMOUNT</th>
                <th class="px-6 py-4">PAYMENT METHOD</th>
                <th class="px-6 py-4">FULFILLMENT STATUS</th>
                <th class="px-6 py-4">ORDER DATE</th>
                <th class="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#141836] text-slate-200">
              <tr v-if="filteredOrders.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-[#65719e]">
                  No order transactions recorded in system.
                </td>
              </tr>

              <tr
                v-for="(o, index) in filteredOrders"
                :key="o.id"
                class="hover:bg-[#101435] transition-colors"
              >
                <td class="px-6 py-4 font-mono font-extrabold text-[#818cf8]">#ORD-{{ index + 1 }}</td>
                <td class="px-6 py-4 font-black text-white text-sm">
                  ${{ Number(o.total_amount || 0).toFixed(2) }}
                </td>
                <td class="px-6 py-4 font-semibold text-slate-300 uppercase">
                  {{ o.payment_method || 'CARD' }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-[11px] font-bold border inline-block uppercase tracking-wider"
                    :class="getStatusBadgeClass(o.status)"
                  >
                    {{ o.status || 'PENDING' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-[#7582b5]">
                  {{ new Date(o.created_at || Date.now()).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <button
                    @click="updateOrderStatus(o.id, 'COMPLETED')"
                    class="px-3 py-1.5 rounded-lg bg-[#142b1f] text-[#34d399] border border-[#1d4d35] hover:bg-[#1b3d2b] text-xs font-semibold transition-colors"
                  >
                    Complete
                  </button>
                  <button
                    @click="updateOrderStatus(o.id, 'CANCELLED')"
                    class="px-3 py-1.5 rounded-lg bg-[#2a1320] text-[#f87171] border border-[#4a1c2d] hover:bg-[#3d182b] text-xs font-semibold transition-colors"
                  >
                    Cancel
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
import { ShoppingBag, Search } from 'lucide-vue-next';

const orders = ref<any[]>([]);
const searchQuery = ref('');

async function fetchOrders() {
  try {
    const res: any = await api.get('/orders');
    orders.value = res.data || res;
  } catch (err) {
    console.error('Failed to fetch orders', err);
  }
}

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    return (
      !searchQuery.value ||
      o.id.toString().includes(searchQuery.value) ||
      (o.status && o.status.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  });
});

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-[#142b1f] text-[#34d399] border-[#1d4d35]';
    case 'SHIPPED':
      return 'bg-[#142845] text-[#38bdf8] border-[#1f406b]';
    case 'CANCELLED':
      return 'bg-[#2a1320] text-[#f87171] border-[#4a1c2d]';
    default:
      return 'bg-[#2b2414] text-[#fbbf24] border-[#4d3d19]';
  }
}

async function updateOrderStatus(id: number, newStatus: string) {
  try {
    await api.patch(`/orders/${id}/status`, { status: newStatus });
    await fetchOrders();
  } catch (err: any) {
    alert(err.message || 'Failed to update order status');
  }
}

onMounted(() => {
  fetchOrders();
});
</script>
