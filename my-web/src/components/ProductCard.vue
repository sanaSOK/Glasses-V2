<template>
  <div class="group relative bg-white border border-neutral-200/80 hover:border-neutral-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden rounded-2xl">
    
    <!-- Discount / Store Badges -->
    <div class="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 pointer-events-none">
      <span v-if="product.discount_price" class="px-2.5 py-1 text-[10px] font-bold text-white bg-rose-500 rounded-full shadow-xs tracking-wide">
        Save ${{ (product.price - product.discount_price).toFixed(0) }}
      </span>
      <span v-if="product.store?.name" class="px-2.5 py-1 text-[10px] font-medium text-neutral-700 bg-white/90 backdrop-blur-xs border border-neutral-200 rounded-full shadow-xs">
        {{ product.store.name }}
      </span>
    </div>

    <!-- Quick Virtual Try-On Button Overlay -->
    <button
      @click.prevent="openTryOnModal"
      class="absolute top-3.5 right-3.5 z-10 px-3 py-1.5 bg-neutral-900/85 hover:bg-indigo-600 text-white font-semibold text-xs tracking-wide backdrop-blur-xs border border-white/10 transition-all duration-200 rounded-full opacity-0 group-hover:opacity-100 flex items-center gap-1.5 shadow-sm"
    >
      <Camera class="w-3.5 h-3.5 text-indigo-300" /> Try On
    </button>

    <!-- Product Image Container -->
    <router-link :to="`/products/${product.slug}`" class="relative block bg-neutral-50 pt-[75%] overflow-hidden">
      <img
        :src="activeImage"
        :alt="product.name"
        class="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />
    </router-link>

    <!-- Swatch Controls -->
    <div class="px-5 pt-3.5 flex items-center gap-2">
      <span class="text-[10px] font-medium uppercase tracking-wider text-neutral-400">Colors:</span>
      <div class="flex gap-1.5">
        <button
          v-for="swatch in swatches"
          :key="swatch.color"
          @click="selectedColor = swatch.color"
          class="w-3.5 h-3.5 rounded-full border transition-all"
          :class="selectedColor === swatch.color ? 'ring-2 ring-indigo-600 scale-110' : 'border-neutral-300 opacity-70 hover:opacity-100'"
          :style="{ backgroundColor: swatch.hex }"
          :title="swatch.color"
        ></button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div>
        <div class="flex items-center justify-between text-xs text-neutral-500 font-medium mb-1">
          <span class="text-indigo-600 font-semibold text-[11px]">{{ product.brand || 'BrightEyes Optical' }}</span>
          <span v-if="product.frame_shape" class="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-medium rounded-md">
            {{ product.frame_shape }}
          </span>
        </div>

        <router-link :to="`/products/${product.slug}`" class="block">
          <h3 class="font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-sm tracking-tight">
            {{ product.name }}
          </h3>
        </router-link>

        <p class="text-xs text-neutral-400 line-clamp-1 mt-0.5 font-normal">
          {{ selectedColor }} Frame • {{ product.lens_type || 'Prescription Ready' }}
        </p>
      </div>

      <!-- Price & Actions -->
      <div class="pt-3 border-t border-neutral-100 flex items-center justify-between">
        <div>
          <div class="flex items-baseline gap-2">
            <span class="text-lg font-extrabold text-neutral-900">
              ${{ product.discount_price ? Number(product.discount_price).toFixed(2) : Number(product.price).toFixed(2) }}
            </span>
            <span v-if="product.discount_price" class="text-xs text-neutral-400 line-through font-normal">
              ${{ Number(product.price).toFixed(2) }}
            </span>
          </div>
        </div>

        <button
          @click.prevent="addToCart"
          :disabled="product.stock <= 0"
          class="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wide text-white transition-all rounded-full shadow-xs"
          :class="product.stock > 0 ? 'bg-neutral-900 hover:bg-indigo-600 shadow-neutral-900/10' : 'bg-neutral-300 cursor-not-allowed'"
        >
          <ShoppingCart class="w-3.5 h-3.5" />
          <span>{{ product.stock > 0 ? 'Add' : 'Out' }}</span>
        </button>
      </div>

    </div>

    <!-- Quick Virtual Try-On Modal -->
    <VirtualTryOnModal
      :show="showTryOnModal"
      :productName="product.name"
      :productImage="activeImage"
      :frameShape="product.frame_shape"
      @close="showTryOnModal = false"
      @select-lenses="showTryOnModal = false"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import VirtualTryOnModal from '@/components/VirtualTryOnModal.vue';
import { ShoppingCart, Camera } from 'lucide-vue-next';

const props = defineProps<{
  product: any;
}>();

const cart = useCartStore();
const showTryOnModal = ref(false);

const swatches = [
  { color: 'Black', hex: '#0f172a' },
  { color: 'Gold', hex: '#d97706' },
  { color: 'Clear Crystal', hex: '#e2e8f0' },
  { color: 'Tortoise', hex: '#78350f' },
];

const selectedColor = ref('Black');

const activeImage = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    const primary = props.product.images.find((img: any) => img.is_primary);
    return primary ? primary.image_url : props.product.images[0].image_url;
  }
  return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800';
});

function openTryOnModal() {
  showTryOnModal.value = true;
}

function addToCart() {
  cart.addItem(props.product.id, 1, props.product.store_id);
}
</script>
