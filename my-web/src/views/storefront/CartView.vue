<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>

    <div v-if="cart.items.length === 0" class="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
      <ShoppingCart class="w-16 h-16 text-slate-300 mx-auto" />
      <h3 class="font-bold text-slate-800 text-xl">Your Shopping Cart is Empty</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">Explore our wide selection of prescription glasses, sunglasses, and frames.</p>
      <router-link to="/shop" class="inline-block px-6 py-3 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">
        Browse Eyewear Shop
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Cart Items List -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
        >
          <img
            :src="item.product?.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'"
            class="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
          />

          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-sm text-slate-900 truncate">{{ item.product?.name }}</h4>
            <p class="text-xs text-indigo-600 font-semibold mt-0.5">${{ Number(item.price).toFixed(2) }} each</p>

            <div class="flex items-center gap-3 mt-3">
              <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs font-bold">
                <button @click="cart.updateItem(item.id, Math.max(1, item.quantity - 1))" class="px-2.5 py-1 hover:bg-slate-200">-</button>
                <span class="px-3">{{ item.quantity }}</span>
                <button @click="cart.updateItem(item.id, item.quantity + 1)" class="px-2.5 py-1 hover:bg-slate-200">+</button>
              </div>

              <button @click="cart.removeItem(item.id)" class="text-xs text-rose-500 hover:text-rose-700 font-medium">
                Remove
              </button>
            </div>
          </div>

          <div class="text-right font-extrabold text-slate-900 text-base">
            ${{ (Number(item.price) * item.quantity).toFixed(2) }}
          </div>
        </div>
      </div>

      <!-- Order Summary Card -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 h-fit">
        <h3 class="font-bold text-slate-900 text-lg">Order Summary</h3>

        <div class="space-y-3 text-xs text-slate-600">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span class="font-bold text-slate-900">${{ cart.total.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Optical Fitting & Shipping</span>
            <span class="font-semibold text-emerald-600">FREE</span>
          </div>
          <div class="pt-3 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
            <span>Estimated Total</span>
            <span class="text-indigo-600">${{ cart.total.toFixed(2) }}</span>
          </div>
        </div>

        <router-link
          to="/checkout"
          class="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
        >
          Proceed to Checkout <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import { ShoppingCart, ArrowRight } from 'lucide-vue-next';

const cart = useCartStore();

onMounted(() => {
  cart.fetchCart();
});
</script>
