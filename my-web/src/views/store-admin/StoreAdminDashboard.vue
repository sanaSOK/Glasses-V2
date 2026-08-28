<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    
    <!-- Top Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-indigo-950 text-white p-8 rounded-3xl shadow-xl">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-2">
          <Store class="w-3.5 h-3.5" /> Store Manager Console
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight">Store Admin Dashboard</h1>
        <p class="text-xs text-indigo-200 mt-1">Manage store products, orders, inventory stock, and customer fulfillment</p>
      </div>

      <router-link to="/" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors">
        Back to Storefront
      </router-link>
    </div>

    <!-- Store KPIs Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-6 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-semibold block">Today's Sales</span>
        <span class="text-2xl font-black text-emerald-600">${{ reportData?.todaySales?.toFixed(2) || '0.00' }}</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-semibold block">Monthly Sales</span>
        <span class="text-2xl font-black text-indigo-600">${{ reportData?.monthlySales?.toFixed(2) || '0.00' }}</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-semibold block">Total Orders</span>
        <span class="text-2xl font-black text-slate-900">{{ reportData?.totalOrders || 0 }}</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-semibold block">Pending Orders</span>
        <span class="text-2xl font-black text-amber-600">{{ reportData?.pendingOrders || 0 }}</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-semibold block">Total Customers</span>
        <span class="text-2xl font-black text-slate-900">{{ reportData?.totalCustomers || 0 }}</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-semibold block">Low-Stock Alert</span>
        <span class="text-2xl font-black text-rose-600">{{ lowStockItems.length }}</span>
      </div>
    </div>

    <!-- Management Sections: Low Stock Inventory & Orders Management -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Low Stock Warnings & Inventory Adjustments -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <AlertTriangle class="w-5 h-5 text-amber-500" /> Low-Stock Warning List
          </h3>
          <span class="text-xs text-slate-400 font-semibold">Threshold: ≤ 5</span>
        </div>

        <div v-if="lowStockItems.length === 0" class="text-xs text-slate-400 italic py-6 text-center">
          All store product stocks are at healthy levels.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="prod in lowStockItems"
            :key="prod.id"
            class="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs"
          >
            <div>
              <span class="font-bold text-slate-900 block">{{ prod.name }}</span>
              <span class="text-slate-500">Current Stock: <strong class="text-rose-600">{{ prod.stock }} units</strong></span>
            </div>

            <button
              @click="openAdjustModal(prod)"
              class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
            >
              Adjust Stock
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Store Orders Fulfillment -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
          <Package class="w-5 h-5 text-indigo-600" /> Recent Orders & Fulfillment
        </h3>

        <div v-if="orders.length === 0" class="text-xs text-slate-400 italic py-6 text-center">
          No orders received for your store yet.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="ord in orders.slice(0, 5)"
            :key="ord.id"
            class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2"
          >
            <div class="flex justify-between items-center">
              <div>
                <span class="font-bold text-slate-900">{{ ord.order_number }}</span>
                <span class="text-slate-400 block text-[10px]">${{ Number(ord.total_amount).toFixed(2) }}</span>
              </div>

              <!-- Status Selector -->
              <select
                :value="ord.status"
                @change="updateOrderStatus(ord.id, ($event.target as HTMLSelectElement).value)"
                class="p-1 border rounded font-bold text-[10px]"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Stock Adjustment Modal -->
    <div v-if="selectedProd" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
        <h3 class="font-extrabold text-lg text-slate-900">Adjust Stock: {{ selectedProd.name }}</h3>
        <p class="text-xs text-slate-500">Current Stock: <strong>{{ selectedProd.stock }}</strong></p>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Add or Subtract Quantity (+10 or -2)</label>
          <input v-model.number="adjustQty" type="number" class="w-full p-3 border rounded-xl text-xs font-bold" />
        </div>

        <div class="flex gap-3 pt-2">
          <button @click="selectedProd = null" class="flex-1 py-3 rounded-xl border font-bold text-xs">Cancel</button>
          <button @click="submitStockAdjustment" class="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs">Save Stock</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { Store, AlertTriangle, Package } from 'lucide-vue-next';

const reportData = ref<any>(null);
const lowStockItems = ref<any[]>([]);
const orders = ref<any[]>([]);
const selectedProd = ref<any>(null);
const adjustQty = ref(10);

async function loadData() {
  try {
    const [repRes, lowRes, ordRes]: any[] = await Promise.all([
      api.get('/reports/store-admin'),
      api.get('/inventory/low-stock?threshold=5'),
      api.get('/orders'),
    ]);
    reportData.value = repRes.data;
    lowStockItems.value = lowRes.data || [];
    orders.value = ordRes.data || [];
  } catch (err) {
    console.error(err);
  }
}

function openAdjustModal(prod: any) {
  selectedProd.value = prod;
  adjustQty.value = 10;
}

async function submitStockAdjustment() {
  if (!selectedProd.value) return;
  try {
    await api.patch(`/inventory/products/${selectedProd.value.id}/adjust`, {
      quantity: adjustQty.value,
    });
    selectedProd.value = null;
    await loadData();
  } catch (err: any) {
    alert(err.message || 'Failed to adjust stock');
  }
}

async function updateOrderStatus(orderId: number, status: string) {
  try {
    await api.patch(`/orders/${orderId}/status`, { status });
    await loadData();
  } catch (err: any) {
    alert(err.message || 'Failed to update order status');
  }
}

onMounted(() => {
  loadData();
});
</script>
