<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 w-full transition-all duration-300 select-none">
    
    <!-- Top Nav Header Container -->
    <div class="w-full px-6 sm:px-12 flex items-center justify-between h-20 max-w-7xl mx-auto">
      
      <!-- Brand Logo & Main Navigation -->
      <div class="flex items-center gap-10">
        <!-- Logo -->
        <router-link to="/" class="flex items-center group transition-transform duration-200 hover:scale-[1.02]">
          <BrightEyesLogo />
        </router-link>

        <!-- Navigation Links (With Mega Menu Trigger) -->
        <nav class="hidden lg:flex items-center gap-1 text-sm font-semibold text-neutral-700 h-20">
          
          <!-- Glasses Mega Menu Trigger -->
          <div
            @mouseenter="activeTab = 'glasses'; showHelpMenu = false; showUserMenu = false"
            class="h-full flex items-center px-4 cursor-pointer relative transition-colors duration-200"
            :class="activeTab === 'glasses' ? 'text-indigo-600 font-bold' : 'hover:text-neutral-900'"
          >
            <router-link to="/shop?category=glasses">Glasses</router-link>
            <div v-if="activeTab === 'glasses'" class="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-600 rounded-full"></div>
          </div>

          <!-- Sunglasses Mega Menu Trigger -->
          <div
            @mouseenter="activeTab = 'sunglasses'; showHelpMenu = false; showUserMenu = false"
            class="h-full flex items-center px-4 cursor-pointer relative transition-colors duration-200"
            :class="activeTab === 'sunglasses' ? 'text-indigo-600 font-bold' : 'hover:text-neutral-900'"
          >
            <router-link to="/shop?gender=SUNGLASSES">Sunglasses</router-link>
            <div v-if="activeTab === 'sunglasses'" class="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-600 rounded-full"></div>
          </div>

          <!-- Lenses Mega Menu Trigger -->
          <div
            @mouseenter="activeTab = 'lenses'; showHelpMenu = false; showUserMenu = false"
            class="h-full flex items-center px-4 cursor-pointer relative transition-colors duration-200"
            :class="activeTab === 'lenses' ? 'text-indigo-600 font-bold' : 'hover:text-neutral-900'"
          >
            <span>Lenses</span>
            <div v-if="activeTab === 'lenses'" class="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-600 rounded-full"></div>
          </div>

          <router-link
            to="/stores"
            class="h-full flex items-center px-4 hover:text-neutral-900 transition-colors duration-200"
          >
            Stores
          </router-link>

        </nav>
      </div>

      <!-- Right Header Actions (Search, User, Wishlist, Cart, Help) -->
      <div class="flex items-center gap-3 text-neutral-800 relative">
        
        <!-- Search Button Toggle -->
        <button
          @click="showSearchInput = !showSearchInput; showHelpMenu = false; showUserMenu = false"
          class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-100 text-neutral-700 transition-colors"
          title="Search"
        >
          <Search class="w-5 h-5" />
        </button>

        <!-- USER PROFILE DROPDOWN MENU -->
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu; showHelpMenu = false; activeTab = null"
            class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-100 text-neutral-700 transition-colors"
            title="Profile & Account"
          >
            <User class="w-5 h-5" />
          </button>

          <!-- User Menu Dropdown Card -->
          <div
            v-if="showUserMenu"
            @mouseleave="showUserMenu = false"
            class="absolute right-0 top-full mt-3 w-80 bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-2xl p-6 z-50 rounded-2xl space-y-4 text-neutral-900"
          >
            <!-- GUEST USER -->
            <div v-if="!auth.isAuthenticated" class="space-y-3 text-center">
              <router-link
                to="/login"
                @click="showUserMenu = false"
                class="block w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide transition-colors rounded-xl shadow-xs"
              >
                Sign In
              </router-link>

              <router-link
                to="/register"
                @click="showUserMenu = false"
                class="block w-full py-2.5 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs tracking-wide transition-colors rounded-xl"
              >
                Create Account
              </router-link>
            </div>

            <!-- LOGGED IN USER -->
            <div v-else class="space-y-3 pb-2 border-b border-neutral-100">
              <div class="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100 text-left">
                <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">{{ auth.user?.role }}</span>
                <span class="font-bold text-sm text-neutral-900 block truncate">{{ auth.user?.name }}</span>
                <span class="text-xs text-neutral-500 block truncate">{{ auth.user?.email }}</span>
              </div>

              <router-link v-if="auth.isSuperAdmin" to="/admin" @click="showUserMenu = false" class="block w-full py-2 text-center bg-neutral-900 text-white text-xs font-bold rounded-lg">
                Super Admin Dashboard
              </router-link>
              <router-link v-if="auth.isStoreAdmin" to="/store-admin" @click="showUserMenu = false" class="block w-full py-2 text-center bg-indigo-600 text-white text-xs font-bold rounded-lg">
                Store Admin Dashboard
              </router-link>
            </div>

            <!-- ACCOUNT LINKS -->
            <div class="space-y-2 text-xs font-medium text-neutral-600 pt-1">
              <router-link to="/my-orders" @click="showUserMenu = false" class="block py-1.5 px-2 hover:bg-neutral-50 rounded-lg hover:text-neutral-900 transition-colors">
                My Orders
              </router-link>

              <router-link to="/prescriptions" @click="showUserMenu = false" class="block py-1.5 px-2 hover:bg-neutral-50 rounded-lg hover:text-neutral-900 transition-colors">
                Prescriptions
              </router-link>

              <button v-if="auth.isAuthenticated" @click="logout" class="block w-full text-left py-1.5 px-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors mt-2">
                Sign Out
              </button>
            </div>

          </div>
        </div>

        <!-- Wishlist -->
        <router-link to="/favorites" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-100 text-neutral-700 transition-colors" title="Wishlist">
          <Heart class="w-5 h-5" />
        </router-link>

        <!-- Shopping Cart Bag -->
        <button
          @click="cart.isOpen = true"
          class="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-100 text-neutral-700 transition-colors"
          title="Shopping Bag"
        >
          <ShoppingBag class="w-5 h-5" />
          <span v-if="cart.itemCount > 0" class="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {{ cart.itemCount }}
          </span>
        </button>

        <!-- Help Dropdown Button -->
        <div class="relative">
          <button
            @click="showHelpMenu = !showHelpMenu; showUserMenu = false; activeTab = null"
            class="px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all"
          >
            Help
          </button>

          <!-- Help Dropdown Menu Card -->
          <div
            v-if="showHelpMenu"
            @mouseleave="showHelpMenu = false"
            class="absolute right-0 top-full mt-3 w-80 bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-2xl p-6 z-50 rounded-2xl space-y-4 text-neutral-900"
          >
            <button
              @click="showMyFitModal = true; showHelpMenu = false"
              class="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs transition-colors rounded-xl border border-indigo-200/60"
            >
              Find MyFit Calculator
            </button>

            <div class="space-y-3 text-xs font-medium text-neutral-700 pt-1">
              <router-link to="/prescriptions" @click="showHelpMenu = false" class="flex items-center gap-3 hover:text-indigo-600 transition-colors">
                <BookOpen class="w-4 h-4 text-neutral-400" />
                <span>Help Center & FAQ</span>
              </router-link>

              <router-link to="/my-orders" @click="showHelpMenu = false" class="flex items-center justify-between hover:text-indigo-600 transition-colors">
                <div class="flex items-center gap-3">
                  <Truck class="w-4 h-4 text-neutral-400" />
                  <span>Track Order</span>
                </div>
                <Search class="w-3.5 h-3.5 text-indigo-500" />
              </router-link>

              <a href="mailto:support@brighteyes.com" class="flex items-center gap-3 hover:text-indigo-600 transition-colors">
                <Mail class="w-4 h-4 text-neutral-400" />
                <span>support@brighteyes.com</span>
              </a>

              <a href="tel:18002744483" class="flex items-center gap-3 hover:text-indigo-600 transition-colors">
                <Phone class="w-4 h-4 text-neutral-400" />
                <span>1-800-BRIGHT-EYES</span>
              </a>
            </div>
          </div>
        </div>

        <span class="hidden sm:inline text-xs font-semibold text-neutral-500 px-2">USD($)</span>

      </div>
    </div>

    <!-- Search Input Expansion Bar -->
    <div v-if="showSearchInput" class="w-full bg-neutral-50/90 backdrop-blur-md p-4 border-b border-neutral-200 flex justify-center">
      <div class="max-w-xl w-full relative">
        <input
          v-model="searchQuery"
          @keyup.enter="performSearch"
          type="text"
          placeholder="Search glasses, sunglasses, Ray-Ban..."
          class="w-full pl-4 pr-24 py-3 bg-white border border-neutral-300 rounded-full text-xs font-medium text-neutral-900 focus:outline-none focus:border-indigo-600 shadow-xs"
        />
        <button
          @click="performSearch"
          class="absolute right-2 top-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-full transition-colors"
        >
          Search
        </button>
      </div>
    </div>

    <!-- MEGA MENU DROPDOWN PANEL -->
    <div
      v-if="activeTab"
      @mouseleave="activeTab = null"
      class="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xl z-50 p-8 px-12 transition-all"
    >
      <div class="max-w-7xl mx-auto">
        <!-- GLASSES MEGA MENU -->
        <div v-if="activeTab === 'glasses'" class="w-full grid grid-cols-12 gap-8 items-start">
          <div class="col-span-3 space-y-3 text-xs font-medium text-neutral-600 border-r border-neutral-100 pr-6">
            <router-link @click="activeTab = null" to="/shop?category=all" class="block font-bold text-neutral-900 hover:text-indigo-600">All Glasses</router-link>
            <router-link @click="activeTab = null" to="/shop?gender=WOMEN" class="block hover:text-indigo-600">Women's Collection</router-link>
            <router-link @click="activeTab = null" to="/shop?gender=MEN" class="block hover:text-indigo-600">Men's Collection</router-link>
            <router-link @click="activeTab = null" to="/shop?gender=KIDS" class="block hover:text-indigo-600">Kids' Eyewear</router-link>
          </div>

          <div class="col-span-9 grid grid-cols-4 gap-6">
            <router-link @click="activeTab = null" to="/shop?sort=new" class="group space-y-2 block">
              <div class="bg-neutral-100 rounded-2xl overflow-hidden pt-[75%] relative">
                <img src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span class="font-semibold text-xs text-neutral-900 group-hover:text-indigo-600 block text-center">New Arrivals</span>
            </router-link>

            <router-link @click="activeTab = null" to="/shop?sort=popular" class="group space-y-2 block">
              <div class="bg-neutral-100 rounded-2xl overflow-hidden pt-[75%] relative">
                <img src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span class="font-semibold text-xs text-neutral-900 group-hover:text-indigo-600 block text-center">Best Sellers</span>
            </router-link>

            <router-link @click="activeTab = null" to="/shop?lens=progressive" class="group space-y-2 block">
              <div class="bg-neutral-100 rounded-2xl overflow-hidden pt-[75%] relative">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span class="font-semibold text-xs text-neutral-900 group-hover:text-indigo-600 block text-center">Progressive</span>
            </router-link>

            <router-link @click="activeTab = null" to="/shop?category=sports" class="group space-y-2 block">
              <div class="bg-neutral-100 rounded-2xl overflow-hidden pt-[75%] relative">
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span class="font-semibold text-xs text-neutral-900 group-hover:text-indigo-600 block text-center">Sports Frames</span>
            </router-link>
          </div>
        </div>

        <!-- SUNGLASSES MEGA MENU -->
        <div v-else-if="activeTab === 'sunglasses'" class="w-full grid grid-cols-12 gap-8 items-start">
          <div class="col-span-3 space-y-3 text-xs font-medium text-neutral-600 border-r border-neutral-100 pr-6">
            <router-link @click="activeTab = null" to="/shop?gender=SUNGLASSES" class="block font-bold text-neutral-900 hover:text-indigo-600">All Sunglasses</router-link>
            <router-link @click="activeTab = null" to="/shop?gender=WOMEN" class="block hover:text-indigo-600">Women's Sunglasses</router-link>
            <router-link @click="activeTab = null" to="/shop?gender=MEN" class="block hover:text-indigo-600">Men's Sunglasses</router-link>
          </div>

          <div class="col-span-9 grid grid-cols-3 gap-6">
            <router-link @click="activeTab = null" to="/shop?lens=polarized" class="group space-y-2 block">
              <div class="bg-neutral-100 rounded-2xl overflow-hidden pt-[75%] relative">
                <img src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span class="font-semibold text-xs text-neutral-900 group-hover:text-indigo-600 block text-center">Polarized</span>
            </router-link>

            <router-link @click="activeTab = null" to="/shop?category=clipon" class="group space-y-2 block">
              <div class="bg-neutral-100 rounded-2xl overflow-hidden pt-[75%] relative">
                <img src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span class="font-semibold text-xs text-neutral-900 group-hover:text-indigo-600 block text-center">Clip-On</span>
            </router-link>

            <router-link @click="activeTab = null" to="/shop?lens=photochromic" class="group space-y-2 block">
              <div class="bg-neutral-100 rounded-2xl overflow-hidden pt-[75%] relative">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span class="font-semibold text-xs text-neutral-900 group-hover:text-indigo-600 block text-center">Photochromic</span>
            </router-link>
          </div>
        </div>

        <!-- LENSES MEGA MENU -->
        <div v-else-if="activeTab === 'lenses'" class="w-full grid grid-cols-4 gap-6">
          <router-link @click="activeTab = null" to="/shop?lens=blue_light" class="group space-y-2 block">
            <div class="bg-neutral-100 rounded-2xl overflow-hidden pt-[75%] relative">
              <img src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <span class="font-semibold text-xs text-neutral-900 group-hover:text-indigo-600 block text-center">Blue Light Guard</span>
          </router-link>

          <router-link @click="activeTab = null" to="/shop?lens=progressive" class="group space-y-2 block">
            <div class="bg-neutral-100 rounded-2xl overflow-hidden pt-[75%] relative">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <span class="font-semibold text-xs text-neutral-900 group-hover:text-indigo-600 block text-center">Progressive</span>
          </router-link>

          <router-link @click="activeTab = null" to="/shop?lens=photochromic" class="group space-y-2 block">
            <div class="bg-neutral-100 rounded-2xl overflow-hidden pt-[75%] relative">
              <img src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <span class="font-semibold text-xs text-neutral-900 group-hover:text-indigo-600 block text-center">Photochromic</span>
          </router-link>

          <router-link @click="activeTab = null" to="/shop?lens=transitions" class="group space-y-2 block">
            <div class="bg-neutral-100 rounded-2xl overflow-hidden pt-[75%] relative">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <span class="font-semibold text-xs text-neutral-900 group-hover:text-indigo-600 block text-center">Transitions®</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- FIND MYFIT MODAL -->
    <div v-if="showMyFitModal" class="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white max-w-md w-full border border-neutral-200 p-6 space-y-6 rounded-3xl shadow-2xl">
        <div class="flex justify-between items-center border-b border-neutral-100 pb-3">
          <h3 class="font-bold text-lg text-neutral-900">Find MyFit Calculator</h3>
          <button @click="showMyFitModal = false" class="text-neutral-400 hover:text-neutral-900 rounded-full p-1"><X class="w-5 h-5" /></button>
        </div>

        <p class="text-xs text-neutral-500 font-normal leading-relaxed">
          Enter your current frame measurements (mm) from the inside temple arm to calculate your exact fit.
        </p>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-neutral-700 mb-1">Lens Width (mm)</label>
            <input v-model.number="fitForm.lensWidth" type="number" placeholder="52" class="w-full p-3 border border-neutral-200 rounded-xl font-medium" />
          </div>
          <div>
            <label class="block font-semibold text-neutral-700 mb-1">Bridge Width (mm)</label>
            <input v-model.number="fitForm.bridgeWidth" type="number" placeholder="18" class="w-full p-3 border border-neutral-200 rounded-xl font-medium" />
          </div>
          <div>
            <label class="block font-semibold text-neutral-700 mb-1">Temple Length (mm)</label>
            <input v-model.number="fitForm.templeLength" type="number" placeholder="145" class="w-full p-3 border border-neutral-200 rounded-xl font-medium" />
          </div>
        </div>

        <div v-if="fitResult" class="p-4 bg-indigo-50 border border-indigo-200/60 text-xs text-indigo-950 font-semibold rounded-2xl text-center">
          RECOMMENDED FIT: <span class="text-indigo-600 font-black text-sm">{{ fitResult }}</span>
        </div>

        <button @click="calculateFit" class="w-full py-3.5 bg-neutral-900 hover:bg-indigo-600 text-white font-semibold text-xs rounded-full transition-colors">
          Calculate Frame Fit
        </button>
      </div>
    </div>

  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import BrightEyesLogo from '@/components/BrightEyesLogo.vue';
import { Search, User, Heart, ShoppingBag, BookOpen, Truck, Mail, Phone, X } from 'lucide-vue-next';

const auth = useAuthStore();
const cart = useCartStore();
const router = useRouter();

const activeTab = ref<string | null>(null);
const showHelpMenu = ref(false);
const showUserMenu = ref(false);
const showSearchInput = ref(false);
const showMyFitModal = ref(false);
const searchQuery = ref('');

const fitForm = ref({ lensWidth: 52, bridgeWidth: 18, templeLength: 145 });
const fitResult = ref<string | null>(null);

function calculateFit() {
  const total = fitForm.value.lensWidth * 2 + fitForm.value.bridgeWidth;
  if (total < 125) fitResult.value = 'Small (S)';
  else if (total <= 140) fitResult.value = 'Medium (M)';
  else fitResult.value = 'Large (L)';
}

function performSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/shop', query: { search: searchQuery.value } });
    showSearchInput.value = false;
  }
}

function logout() {
  auth.logout();
  showUserMenu.value = false;
  router.push('/login');
}
</script>
