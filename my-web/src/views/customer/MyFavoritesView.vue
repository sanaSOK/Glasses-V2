<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div>
      <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">My Wishlist & Favorites</h1>
      <p class="text-xs text-slate-500 mt-1">Saved eyewear frames & sunglasses</p>
    </div>

    <div v-if="favorites.length === 0" class="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
      <Heart class="w-16 h-16 text-slate-300 mx-auto" />
      <h3 class="font-bold text-slate-800 text-lg">No Favorites Saved</h3>
      <p class="text-xs text-slate-500">Tap the heart icon on any glasses to save them here for later.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="fav in favorites"
        :key="fav.id"
        :product="fav.product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import ProductCard from '@/components/ProductCard.vue';
import { Heart } from 'lucide-vue-next';

const favorites = ref<any[]>([]);

onMounted(async () => {
  try {
    const res: any = await api.get('/favorites');
    favorites.value = res.data || [];
  } catch (err) {
    console.error(err);
  }
});
</script>
