<template>
  <div v-if="cart.isOpen" class="fixed inset-0 z-50 bg-slate-950/80 flex justify-end transition-all rounded-none">
    <div class="bg-white w-full max-w-md h-full flex flex-col justify-between border-l border-slate-900 shadow-2xl rounded-none">
      
      <!-- Drawer Header -->
      <div class="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 rounded-none">
        <div class="flex items-center gap-2">
          <ShoppingCart class="w-5 h-5 text-indigo-400" />
          <h3 class="font-black uppercase tracking-tight text-sm text-white">Your Shopping Cart ({{ cart.itemCount }})</h3>
        </div>
        <button @click="cart.isOpen = false" class="p-1 text-slate-400 hover:text-white rounded-none">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Firmoo Promo Ticker -->
      <div class="bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-widest px-4 py-2 flex items-center justify-between">
        <span>⚡ BOGO Flash Deal Active! Buy 1 Get 1 50% Off</span>
        <Tag class="w-3.5 h-3.5" />
      </div>

      <!-- Drawer Body Items List -->
      <div class="p-6 flex-1 overflow-y-auto space-y-4">
        <div v-if="cart.items.length === 0" class="text-center py-16 space-y-3">
          <Glasses class="w-12 h-12 text-slate-300 mx-auto" />
          <p class="font-extrabold text-xs uppercase tracking-wider text-slate-500">Your shopping bag is empty</p>
        </div>

        <div
          v-for="item in cart.items"
          :key="item.id"
          class="p-4 border border-slate-300 flex items-start gap-4 rounded-none bg-slate-50"
        >
          <img
            :src="item.product?.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'"
            class="w-16 h-16 object-cover border border-slate-300 shrink-0 rounded-none"
          />

          <div class="flex-1 min-w-0 space-y-1">
            <h4 class="font-extrabold text-xs text-slate-900 uppercase truncate">{{ item.product?.name }}</h4>
            <span class="text-[10px] font-bold text-indigo-600 uppercase block">${{ Number(item.price).toFixed(2) }} each</span>

            <div class="flex items-center gap-3 pt-2 text-xs">
              <div class="flex items-center border border-slate-300 bg-white font-extrabold text-xs rounded-none">
                <button @click="cart.updateItem(item.id, Math.max(1, item.quantity - 1))" class="px-2 py-0.5 hover:bg-slate-200">-</button>
                <span class="px-2">{{ item.quantity }}</span>
                <button @click="cart.updateItem(item.id, item.quantity + 1)" class="px-2 py-0.5 hover:bg-slate-200">+</button>
              </div>

              <button @click="cart.removeItem(item.id)" class="text-[10px] font-bold text-rose-600 uppercase hover:underline">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Drawer Footer Summary -->
      <div class="p-6 bg-slate-50 border-t border-slate-900 space-y-4 rounded-none">
        
        <!-- Promo Code Input -->
        <div class="flex gap-2">
          <input
            v-model="promoCode"
            type="text"
            placeholder="PROMO CODE (E.G. BOGO)"
            class="w-full text-xs p-2.5 bg-white border border-slate-300 font-bold uppercase rounded-none"
          />
          <button @click="applyPromo" class="px-4 py-2.5 bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-none">
            Apply
          </button>
        </div>

        <div class="space-y-1.5 text-xs uppercase font-extrabold text-slate-700">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span class="text-slate-900">${{ cart.total.toFixed(2) }}</span>
          </div>
          <div v-if="discount > 0" class="flex justify-between text-rose-600">
            <span>BOGO Discount (50%)</span>
            <span>-${{ discount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between border-t border-slate-300 pt-2 text-sm font-black text-slate-900">
            <span>Estimated Total</span>
            <span class="text-indigo-600">${{ (cart.total - discount).toFixed(2) }}</span>
          </div>
        </div>

        <button
          @click="proceedCheckout"
          :disabled="cart.items.length === 0"
          class="w-full py-4 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-300 text-white font-black text-xs uppercase tracking-widest rounded-none shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight class="w-4 h-4" />
        </button>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import { ShoppingCart, X, Glasses, Tag, ArrowRight } from 'lucide-vue-next';

const cart = useCartStore();
const router = useRouter();
const promoCode = ref('');
const discount = ref(0);

function applyPromo() {
  if (promoCode.value.trim().toUpperCase() === 'BOGO') {
    discount.value = cart.total * 0.5;
    alert('Promo code BOGO applied! 50% discount active.');
  } else {
    alert('Invalid promo code. Try "BOGO"!');
  }
}

function proceedCheckout() {
  cart.isOpen = false;
  router.push('/checkout');
}
</script>
