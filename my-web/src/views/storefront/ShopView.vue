<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6 bg-neutral-50 min-h-screen">
    
    <!-- STICKY PAGE HEADER -->
    <div class="sticky top-20 z-40 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-5 border border-neutral-200/80 rounded-2xl shadow-sm">
      <div>
        <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">Catalog Overview</span>
        <h1 class="text-2xl font-bold text-neutral-900 tracking-tight">Eyewear Collection</h1>
      </div>

      <!-- Search Input -->
      <div class="relative min-w-[320px]">
        <Search class="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
        <input
          v-model="searchQuery"
          @input="applyFilters"
          type="text"
          placeholder="Search Ray-Ban, Aviator, Oakley..."
          class="w-full pl-11 pr-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-full font-medium focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
        />
      </div>
    </div>

    <!-- MAIN CONTENT: STICKY FILTERS SIDEBAR & SCROLLING PRODUCT GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      
      <!-- STICKY FILTERS SIDEBAR -->
      <aside class="sticky top-[10.5rem] z-30 space-y-5 bg-white p-6 border border-neutral-200/80 rounded-2xl h-fit max-h-[calc(100vh-12rem)] overflow-y-auto shadow-xs">
        <div class="flex items-center justify-between pb-4 border-b border-neutral-100">
          <h3 class="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-2">
            <Filter class="w-4 h-4 text-indigo-600" /> Filters
          </h3>
          <button @click="resetFilters" class="text-xs text-indigo-600 font-semibold hover:underline">Reset</button>
        </div>

        <!-- Gender Filter -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-neutral-700">Gender</label>
          <select v-model="selectedGender" @change="applyFilters" class="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 font-medium rounded-xl">
            <option value="">All Genders</option>
            <option value="UNISEX">Unisex</option>
            <option value="MEN">Men</option>
            <option value="WOMEN">Women</option>
            <option value="KIDS">Kids</option>
          </select>
        </div>

        <!-- Frame Shape Filter -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-neutral-700">Frame Shape</label>
          <select v-model="selectedShape" @change="applyFilters" class="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 font-medium rounded-xl">
            <option value="">All Shapes</option>
            <option value="Square">Square</option>
            <option value="Round">Round</option>
            <option value="Aviator">Aviator</option>
            <option value="Rectangle">Rectangle</option>
            <option value="Oversized">Oversized</option>
          </select>
        </div>

        <!-- Brand Filter -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-neutral-700">Brand</label>
          <input
            v-model="selectedBrand"
            @input="applyFilters"
            type="text"
            placeholder="Ray-Ban, Gucci..."
            class="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 font-medium rounded-xl"
          />
        </div>

        <!-- Price Range -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-neutral-700">Price Range ($)</label>
          <div class="flex items-center gap-2">
            <input v-model.number="minPrice" @change="applyFilters" type="number" placeholder="Min" class="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 font-medium rounded-xl" />
            <span class="text-neutral-400 text-xs font-bold">-</span>
            <input v-model.number="maxPrice" @change="applyFilters" type="number" placeholder="Max" class="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 font-medium rounded-xl" />
          </div>
        </div>

        <!-- Store Filter -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-neutral-700">Filter By Store</label>
          <select v-model="selectedStoreId" @change="applyFilters" class="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 font-medium rounded-xl">
            <option value="">All Partner Stores</option>
            <option v-for="store in storesContext.stores" :key="store.id" :value="store.id">
              {{ store.name }}
            </option>
          </select>
        </div>
      </aside>

      <!-- SCROLLABLE PRODUCT GRID -->
      <main class="lg:col-span-3 space-y-6">
        
        <!-- Sorting Bar -->
        <div class="flex items-center justify-between bg-white px-6 py-4 border border-neutral-200/80 rounded-2xl shadow-xs">
          <span class="text-xs font-medium text-neutral-500">
            Showing <span class="text-neutral-900 font-bold">{{ productStore.products.length }}</span> of {{ productStore.total }} Items
          </span>

          <div class="flex items-center gap-2">
            <span class="text-xs text-neutral-400 font-medium">Sort:</span>
            <select v-model="sortBy" @change="applyFilters" class="text-xs p-2 bg-neutral-50 border border-neutral-200 font-semibold rounded-xl">
              <option value="created_at-DESC">Newest Arrivals</option>
              <option value="price-ASC">Price: Low to High</option>
              <option value="price-DESC">Price: High to Low</option>
              <option value="name-ASC">Name: A to Z</option>
            </select>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="productStore.products.length === 0" class="text-center py-20 bg-white border border-neutral-200/80 p-8 space-y-4 rounded-2xl">
          <Glasses class="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 class="font-bold text-neutral-900 text-lg">No Eyewear Found</h3>
          <p class="text-xs text-neutral-500 max-w-sm mx-auto font-normal">Try adjusting your filters or search query.</p>
          <button @click="resetFilters" class="px-6 py-2.5 text-xs font-semibold text-white bg-neutral-900 rounded-full hover:bg-indigo-600 transition-colors">
            Clear Filters
          </button>
        </div>

        <!-- Product Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <ProductCard
            v-for="product in productStore.products"
            :key="product.id"
            :product="product"
          />
        </div>

      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/products';
import { useStoreContext } from '@/stores/storesContext';
import ProductCard from '@/components/ProductCard.vue';
import { Search, Filter, Glasses } from 'lucide-vue-next';

const productStore = useProductStore();
const storesContext = useStoreContext();

const searchQuery = ref('');
const selectedGender = ref('');
const selectedShape = ref('');
const selectedBrand = ref('');
const minPrice = ref<number | undefined>(undefined);
const maxPrice = ref<number | undefined>(undefined);
const selectedStoreId = ref('');
const sortBy = ref('created_at-DESC');

function applyFilters() {
  const [sortField, sortOrder] = sortBy.value.split('-');

  productStore.fetchProducts({
    search: searchQuery.value,
    gender: selectedGender.value,
    frame_shape: selectedShape.value,
    brand: selectedBrand.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    store_id: selectedStoreId.value,
    sortBy: sortField,
    order: sortOrder,
    page: 1,
  });
}

function resetFilters() {
  searchQuery.value = '';
  selectedGender.value = '';
  selectedShape.value = '';
  selectedBrand.value = '';
  minPrice.value = undefined;
  maxPrice.value = undefined;
  selectedStoreId.value = '';
  sortBy.value = 'created_at-DESC';
  applyFilters();
}

onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    storesContext.fetchStores(),
  ]);
});
</script>
