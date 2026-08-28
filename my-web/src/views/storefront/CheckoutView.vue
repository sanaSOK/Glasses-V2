<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Optical Order Checkout</h1>

    <div v-if="orderCreated" class="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
      <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
        <CheckCircle2 class="w-10 h-10" />
      </div>
      <div>
        <h2 class="text-2xl font-extrabold text-slate-900">Order Placed Successfully!</h2>
        <p class="text-xs text-slate-500 mt-1">Order Reference Number: <span class="font-mono font-bold text-slate-800">{{ orderCreated.order_number }}</span></p>
      </div>
      <div class="pt-4 flex justify-center gap-4">
        <router-link to="/my-orders" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md">
          View Order Status
        </router-link>
        <router-link to="/shop" class="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
          Continue Shopping
        </router-link>
      </div>
    </div>

    <form v-else @submit.prevent="handleCheckout" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Checkout Form Left -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- 1. Shipping Address -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <MapPin class="w-5 h-5 text-indigo-600" /> Shipping & Delivery Address
          </h3>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Full Shipping Address</label>
            <textarea
              v-model="shippingAddress"
              required
              rows="3"
              placeholder="123 Main Street, Apt 4B, New York, NY 10001"
              class="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            ></textarea>
          </div>
        </div>

        <!-- 2. Prescription Option -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileText class="w-5 h-5 text-indigo-600" /> Optical Prescription (Optional)
          </h3>

          <div v-if="prescriptions.length > 0" class="space-y-2">
            <label class="block text-xs font-bold text-slate-700">Select Saved Prescription</label>
            <select v-model="selectedPrescriptionId" class="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium">
              <option :value="undefined">No Prescription / Non-Prescription Lenses</option>
              <option v-for="p in prescriptions" :key="p.id" :value="p.id">
                Prescription #{{ p.id }} (OD SPH: {{ p.right_sphere }}, OS SPH: {{ p.left_sphere }})
              </option>
            </select>
          </div>
          <div v-else class="text-xs text-slate-500">
            No saved prescriptions found. You can add prescriptions under <router-link to="/prescriptions" class="text-indigo-600 font-bold underline">My Prescriptions</router-link>.
          </div>
        </div>

        <!-- 3. Payment Method -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <CreditCard class="w-5 h-5 text-indigo-600" /> Payment Method
          </h3>

          <div class="grid grid-cols-2 gap-3">
            <label class="p-3 border rounded-xl flex items-center gap-3 cursor-pointer text-xs font-bold" :class="paymentMethod === 'CREDIT_CARD' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900' : 'border-slate-200'">
              <input type="radio" v-model="paymentMethod" value="CREDIT_CARD" class="text-indigo-600" />
              <span>Credit Card</span>
            </label>
            <label class="p-3 border rounded-xl flex items-center gap-3 cursor-pointer text-xs font-bold" :class="paymentMethod === 'BANK_TRANSFER' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900' : 'border-slate-200'">
              <input type="radio" v-model="paymentMethod" value="BANK_TRANSFER" class="text-indigo-600" />
              <span>Bank Transfer</span>
            </label>
          </div>
        </div>

      </div>

      <!-- Right Summary -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 h-fit">
        <h3 class="font-bold text-slate-900 text-lg">Order Total</h3>

        <div class="space-y-2 text-xs">
          <div v-for="item in cart.items" :key="item.id" class="flex justify-between text-slate-600">
            <span class="truncate max-w-[180px]">{{ item.product?.name }} x{{ item.quantity }}</span>
            <span class="font-bold text-slate-900">${{ (Number(item.price) * item.quantity).toFixed(2) }}</span>
          </div>

          <div class="pt-3 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
            <span>Total Payment</span>
            <span class="text-indigo-600">${{ cart.total.toFixed(2) }}</span>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading || cart.items.length === 0"
          class="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
        >
          <span>{{ loading ? 'Processing Order...' : 'Confirm & Place Order' }}</span>
        </button>
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import api from '@/services/api';
import { CheckCircle2, MapPin, FileText, CreditCard } from 'lucide-vue-next';

const cart = useCartStore();

const shippingAddress = ref('100 Fifth Avenue, Apt 4B, New York, NY 10001');
const selectedPrescriptionId = ref<number | undefined>(undefined);
const paymentMethod = ref('CREDIT_CARD');
const prescriptions = ref<any[]>([]);
const loading = ref(false);
const orderCreated = ref<any>(null);

async function handleCheckout() {
  if (cart.items.length === 0) return;
  loading.value = true;
  try {
    const storeId = cart.storeId || cart.items[0]?.product?.store_id || 1;

    // 1. Create Order
    const orderRes: any = await api.post('/orders', {
      store_id: storeId,
      shipping_address: shippingAddress.value,
      prescription_id: selectedPrescriptionId.value,
    });

    const createdOrder = orderRes.data;

    // 2. Process Mock Payment
    await api.post(`/payments/orders/${createdOrder.id}`, {
      payment_method: paymentMethod.value,
    });

    orderCreated.value = createdOrder;
    await cart.clearCart();
  } catch (err: any) {
    alert(err.message || 'Failed to place order');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await cart.fetchCart();
  try {
    const pRes: any = await api.get('/prescriptions');
    prescriptions.value = pRes.data || [];
  } catch {
    prescriptions.value = [];
  }
});
</script>
