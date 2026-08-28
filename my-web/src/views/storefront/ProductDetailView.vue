<template>
  <div v-if="product" class="w-full px-6 sm:px-12 py-10 space-y-12 rounded-none">
    
    <!-- Main Detail Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      
      <!-- Gallery Left -->
      <div class="space-y-4">
        <div class="bg-white border border-slate-300 p-4 pt-[75%] relative overflow-hidden rounded-none shadow-xs">
          <img
            :src="activeImage"
            :alt="product.name"
            class="absolute inset-0 w-full h-full object-cover object-center rounded-none"
          />

          <!-- Firmoo Try-On Badge Button on Image -->
          <button
            @click="showTryOn = true"
            class="absolute top-4 right-4 z-10 px-4 py-2 bg-slate-900/90 hover:bg-slate-900 text-white rounded-none text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-2 transition-all"
          >
            <Camera class="w-4 h-4 text-sky-400" /> Virtual Try-On
          </button>
        </div>

        <!-- Thumbnails -->
        <div v-if="product.images && product.images.length > 1" class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="img in product.images"
            :key="img.id"
            @click="activeImage = img.image_url"
            class="w-20 h-20 border-2 overflow-hidden shrink-0 transition-all rounded-none"
            :class="activeImage === img.image_url ? 'border-slate-900 ring-2 ring-slate-900/20' : 'border-slate-300 hover:border-slate-500'"
          >
            <img :src="img.image_url" class="w-full h-full object-cover rounded-none" />
          </button>
        </div>
      </div>

      <!-- Specs & Purchase Info Right -->
      <div class="space-y-6 bg-white p-8 border border-slate-300 rounded-none shadow-xs">
        
        <div>
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="font-extrabold text-indigo-600 uppercase tracking-widest">{{ product.brand || 'Firmoo Optical Collection' }}</span>
            <span v-if="product.store?.name" class="px-3 py-1 bg-slate-100 font-bold text-slate-900 uppercase tracking-wider text-[10px] border border-slate-300 rounded-none">
              Boutique: {{ product.store.name }}
            </span>
          </div>

          <h1 class="text-3xl font-black text-slate-900 tracking-tighter uppercase">{{ product.name }}</h1>
          <p class="text-xs text-slate-500 mt-2 leading-relaxed uppercase tracking-wide font-medium">{{ product.description }}</p>
        </div>

        <!-- Price & Promotion Banner -->
        <div class="p-5 bg-slate-50 border border-slate-300 flex items-center justify-between rounded-none">
          <div>
            <div class="text-3xl font-black text-slate-900">
              ${{ product.discount_price ? Number(product.discount_price).toFixed(2) : Number(product.price).toFixed(2) }}
            </div>
            <span v-if="product.discount_price" class="text-xs text-slate-400 line-through">
              Original MSRP: ${{ Number(product.price).toFixed(2) }}
            </span>
          </div>
          <div class="text-right space-y-1">
            <span class="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-900 rounded-none block">
              {{ product.stock > 0 ? `${product.stock} IN STOCK` : 'OUT OF STOCK' }}
            </span>
            <span class="block text-[10px] text-rose-600 font-black uppercase tracking-widest">BOGO 50% OFF ELIGIBLE</span>
          </div>
        </div>

        <!-- Firmoo Frame Dimensions & Size Guide -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-slate-900 uppercase tracking-widest block">Frame Measurements & Dimensions (Medium)</label>
          <div class="grid grid-cols-4 gap-2 text-center text-xs">
            <div class="p-3 bg-slate-50 border border-slate-300 rounded-none">
              <span class="text-slate-500 block text-[9px] font-bold uppercase">Lens Width</span>
              <span class="font-extrabold text-slate-900">52 mm</span>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-300 rounded-none">
              <span class="text-slate-500 block text-[9px] font-bold uppercase">Bridge</span>
              <span class="font-extrabold text-slate-900">18 mm</span>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-300 rounded-none">
              <span class="text-slate-500 block text-[9px] font-bold uppercase">Temple</span>
              <span class="font-extrabold text-slate-900">145 mm</span>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-300 rounded-none">
              <span class="text-slate-500 block text-[9px] font-bold uppercase">Total Width</span>
              <span class="font-extrabold text-slate-900">138 mm</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons: Select Lenses & Try On -->
        <div class="space-y-3 pt-4 border-t border-slate-200">
          <button
            @click="showLensWizard = true"
            class="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 rounded-none"
          >
            <Sliders class="w-5 h-5" /> Select Custom Lenses & Prescription
          </button>

          <div class="flex gap-3">
            <button
              @click="showTryOn = true"
              class="flex-1 py-3.5 border border-slate-900 hover:bg-slate-100 text-slate-900 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-none"
            >
              <Camera class="w-4 h-4" /> Virtual Try-On Studio
            </button>
            <button @click="addToCart" class="py-3.5 px-6 border border-slate-300 hover:border-slate-900 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2 rounded-none">
              <ShoppingCart class="w-4 h-4" /> Frame Only
            </button>
          </div>
        </div>

      </div>

    </div>

    <!-- Modals -->
    <VirtualTryOnModal
      :show="showTryOn"
      :productName="product.name"
      :productImage="activeImage"
      :frameShape="product.frame_shape"
      @close="showTryOn = false"
      @select-lenses="showTryOn = false; showLensWizard = true"
    />

    <FirmooLensWizardModal
      :show="showLensWizard"
      :framePrice="product.discount_price || product.price"
      @close="showLensWizard = false"
      @add-to-cart-customized="handleCustomLensAdded"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore, Product } from '@/stores/products';
import { useCartStore } from '@/stores/cart';
import VirtualTryOnModal from '@/components/VirtualTryOnModal.vue';
import FirmooLensWizardModal from '@/components/FirmooLensWizardModal.vue';
import { ShoppingCart, Camera, Sliders } from 'lucide-vue-next';

const route = useRoute();
const productStore = useProductStore();
const cart = useCartStore();

const product = ref<Product | null>(null);
const activeImage = ref('');
const showTryOn = ref(false);
const showLensWizard = ref(false);

function addToCart() {
  if (product.value) {
    cart.addItem(product.value.id, 1, product.value.store_id);
  }
}

function handleCustomLensAdded(customData: any) {
  if (product.value) {
    cart.addItem(product.value.id, 1, product.value.store_id);
  }
}

onMounted(async () => {
  const slug = route.params.slug as string;
  product.value = await productStore.fetchProductBySlug(slug);
  if (product.value && product.value.images && product.value.images.length > 0) {
    activeImage.value = product.value.images[0].image_url;
  } else {
    activeImage.value = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800';
  }
});
</script>
