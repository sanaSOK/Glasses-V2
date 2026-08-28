<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">My Order History</h1>
        <p class="text-xs text-slate-500 mt-1">Track fulfillment and shipping status across optical stores</p>
      </div>
    </div>

    <div v-if="orders.length === 0" class="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
      <Package class="w-16 h-16 text-slate-300 mx-auto" />
      <h3 class="font-bold text-slate-800 text-lg">No Orders Found</h3>
      <p class="text-xs text-slate-500">You haven't placed any prescription orders yet.</p>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 text-xs">
          <div>
            <span class="font-extrabold text-slate-900 text-sm block">{{ order.order_number }}</span>
            <span class="text-slate-400">Placed on {{ new Date(order.created_at).toLocaleDateString() }} • {{ order.store?.name }}</span>
          </div>

          <div class="flex items-center gap-2">
            <span
              class="px-3 py-1 font-bold rounded-full text-[11px]"
              :class="getStatusBadgeClass(order.status)"
            >
              {{ order.status }}
            </span>
            <span
              class="px-3 py-1 font-bold rounded-full text-[11px]"
              :class="order.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
            >
              {{ order.payment_status }}
            </span>
          </div>
        </div>

        <!-- Items list -->
        <div class="space-y-3">
          <div v-for="item in order.items" :key="item.id" class="flex items-center gap-4 text-xs">
            <img
              :src="item.product?.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'"
              class="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0"
            />
            <div class="flex-1">
              <h5 class="font-bold text-slate-800">{{ item.product?.name }}</h5>
              <span class="text-slate-500">Qty: {{ item.quantity }} × ${{ Number(item.price).toFixed(2) }}</span>
            </div>
            <div class="font-bold text-slate-900">${{ Number(item.subtotal).toFixed(2) }}</div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
          <span class="text-slate-500">Shipping to: <span class="font-semibold text-slate-700">{{ order.shipping_address }}</span></span>
          <div class="text-right font-black text-slate-900 text-base">
            Total: ${{ Number(order.total_amount).toFixed(2) }}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { Package } from 'lucide-vue-next';

const orders = ref<any[]>([]);

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'DELIVERED': return 'bg-emerald-100 text-emerald-800';
    case 'SHIPPED': return 'bg-sky-100 text-sky-800';
    case 'PROCESSING': return 'bg-indigo-100 text-indigo-800';
    case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
    case 'CANCELLED': return 'bg-rose-100 text-rose-800';
    default: return 'bg-slate-100 text-slate-800';
  }
}

onMounted(async () => {
  try {
    const res: any = await api.get('/orders');
    orders.value = res.data || [];
  } catch (err) {
    console.error(err);
  }
});
</script>
