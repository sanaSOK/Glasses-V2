<template>
  <aside class="w-72 bg-[#060814] text-slate-300 min-h-screen flex flex-col justify-between border-r border-[#141830] shrink-0 select-none sticky top-0 h-screen z-50 font-sans">
    
    <!-- Top Section -->
    <div class="p-6 space-y-7">
      
      <!-- Brand Logo Header -->
      <div class="space-y-4 pb-6 border-b border-[#141830]">
        <div class="flex items-center gap-3.5">
          <!-- Electric Purple Shield Icon Box -->
          <div class="w-12 h-12 rounded-xl bg-[#5542f6] flex items-center justify-center text-white shadow-lg shadow-[#5542f6]/40 shrink-0">
            <ShieldCheck class="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 class="font-extrabold text-white text-xl tracking-wider leading-tight">
              BRIGHTEYES
            </h1>
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-[#6052ff] block mt-0.5">
              SUPER ADMIN CONSOLE
            </span>
          </div>
        </div>
      </div>

      <!-- Management Console Title -->
      <div class="text-[11px] font-extrabold uppercase tracking-widest text-[#65719e] px-1">
        MANAGEMENT CONSOLE
      </div>

      <!-- Navigation Menu -->
      <nav class="space-y-1.5 text-xs font-semibold">
        
        <!-- 1. Dashboard Overview -->
        <router-link
          to="/admin"
          end
          class="flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-150"
          :class="$route.path === '/admin' 
            ? 'bg-[#5542f6] text-white font-bold shadow-lg shadow-[#5542f6]/30' 
            : 'text-[#8b97c6] hover:bg-[#12162d] hover:text-white'"
        >
          <LayoutGrid class="w-5 h-5 shrink-0" />
          <span class="text-sm font-semibold">Dashboard Overview</span>
        </router-link>

        <!-- 2. Manage Admins & Users -->
        <router-link
          to="/admin/users"
          class="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-150"
          :class="$route.path.startsWith('/admin/users') 
            ? 'bg-[#5542f6] text-white font-bold shadow-lg shadow-[#5542f6]/30' 
            : 'text-[#8b97c6] hover:bg-[#12162d] hover:text-white'"
        >
          <div class="flex items-center gap-3.5">
            <Users class="w-5 h-5 shrink-0" />
            <span class="text-sm font-semibold">Manage Admins & Users</span>
          </div>
          <span 
            class="px-2.5 py-0.5 text-[11px] font-bold rounded-md"
            :class="$route.path.startsWith('/admin/users') ? 'bg-[#6b5bfa] text-white' : 'bg-[#181c3b] text-[#818cf8]'"
          >
            All
          </span>
        </router-link>

        <!-- 3. Partner Stores -->
        <router-link
          to="/admin/stores"
          class="flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-150"
          :class="$route.path.startsWith('/admin/stores') 
            ? 'bg-[#5542f6] text-white font-bold shadow-lg shadow-[#5542f6]/30' 
            : 'text-[#8b97c6] hover:bg-[#12162d] hover:text-white'"
        >
          <Store class="w-5 h-5 shrink-0" />
          <span class="text-sm font-semibold">Partner Stores</span>
        </router-link>

        <!-- 4. Global Eyewear Catalog -->
        <router-link
          to="/admin/products"
          class="flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-150"
          :class="$route.path.startsWith('/admin/products') 
            ? 'bg-[#5542f6] text-white font-bold shadow-lg shadow-[#5542f6]/30' 
            : 'text-[#8b97c6] hover:bg-[#12162d] hover:text-white'"
        >
          <Glasses class="w-5 h-5 shrink-0" />
          <span class="text-sm font-semibold">Global Eyewear Catalog</span>
        </router-link>

        <!-- 5. Orders & Transactions -->
        <router-link
          to="/admin/orders"
          class="flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-150"
          :class="$route.path.startsWith('/admin/orders') 
            ? 'bg-[#5542f6] text-white font-bold shadow-lg shadow-[#5542f6]/30' 
            : 'text-[#8b97c6] hover:bg-[#12162d] hover:text-white'"
        >
          <ShoppingBag class="w-5 h-5 shrink-0" />
          <span class="text-sm font-semibold">Orders & Transactions</span>
        </router-link>

        <!-- 6. Optical Prescriptions -->
        <router-link
          to="/admin/prescriptions"
          class="flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-150"
          :class="$route.path.startsWith('/admin/prescriptions') 
            ? 'bg-[#5542f6] text-white font-bold shadow-lg shadow-[#5542f6]/30' 
            : 'text-[#8b97c6] hover:bg-[#12162d] hover:text-white'"
        >
          <FileText class="w-5 h-5 shrink-0" />
          <span class="text-sm font-semibold">Optical Prescriptions</span>
        </router-link>

      </nav>

    </div>

    <!-- Bottom Footer Profile Section -->
    <div class="p-6 border-t border-[#141830] space-y-4">
      
      <!-- Storefront Shortcut -->
      <router-link
        to="/"
        class="flex items-center gap-3 px-2 text-sm font-semibold text-[#8b97c6] hover:text-white transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Return to Storefront</span>
      </router-link>

      <!-- Account Box -->
      <div class="flex items-center justify-between p-3.5 rounded-xl bg-[#0c0f24] border border-[#1a1f42]">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-10 h-10 rounded-lg bg-[#202758] text-[#818cf8] font-bold text-sm flex items-center justify-center shrink-0 border border-[#30397a]">
            SA
          </div>
          <div class="truncate">
            <span class="font-bold text-sm text-white block truncate">
              {{ authStore.user?.store_name || 'sana_store' }}
            </span>
            <span class="text-xs text-[#6e7aa8] block truncate">
              Global Owner
            </span>
          </div>
        </div>

        <button
          @click="logout"
          title="Logout"
          class="p-2 text-[#717da8] hover:text-white rounded-lg transition-colors"
        >
          <LogOut class="w-5 h-5" />
        </button>
      </div>

    </div>

  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import {
  ShieldCheck,
  LayoutGrid,
  Users,
  Store,
  Glasses,
  ShoppingBag,
  FileText,
  ArrowLeft,
  LogOut,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();

function logout() {
  authStore.logout();
  router.push('/login');
}
</script>
