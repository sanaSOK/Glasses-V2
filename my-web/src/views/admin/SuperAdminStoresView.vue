<template>
  <div class="flex min-h-screen bg-[#060814] text-slate-100 font-sans">
    
    <!-- Left Sidebar -->
    <SuperAdminSidebar />

    <!-- Main Workspace -->
    <main class="flex-1 p-8 space-y-8 overflow-y-auto w-full">
      
      <!-- Top Bar Banner -->
      <div class="relative overflow-hidden bg-[#0b0e24] p-6 sm:p-8 rounded-3xl border border-[#171c3b] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-2 relative z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5542f6]/20 text-[#818cf8] text-xs font-semibold border border-[#5542f6]/40">
            <Store class="w-3.5 h-3.5 text-[#818cf8]" /> Multi-Tenant Store Network
          </div>
          <h1 class="text-3xl font-extrabold tracking-wider text-white">Partner Optical Stores</h1>
          <p class="text-xs text-[#7582b5]">Super Admin directory to create, configure, and monitor isolated optical boutiques</p>
        </div>

        <button
          @click="showCreateModal = true"
          class="px-5 py-3 bg-[#5542f6] hover:bg-[#4736e6] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#5542f6]/30 flex items-center gap-2 shrink-0 relative z-10"
        >
          <Plus class="w-4 h-4" /> Add Partner Store
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="flex items-center justify-between bg-[#0b0e24] p-4 rounded-2xl border border-[#171c3b]">
        <div class="relative w-80">
          <Search class="w-4 h-4 text-[#65719e] absolute left-3.5 top-3" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search stores by name or location..."
            class="w-full bg-[#060814] border border-[#171c3b] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#65719e] focus:outline-none focus:border-[#5542f6]"
          />
        </div>

        <div class="text-xs text-[#7582b5] font-semibold">
          Total Stores: <span class="font-bold text-white">{{ filteredStores.length }}</span>
        </div>
      </div>

      <!-- Stores Table -->
      <div class="bg-[#0b0e24] rounded-3xl border border-[#171c3b] overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#0d112d] text-[#6d79a8] uppercase tracking-wider font-extrabold border-b border-[#181d3d]">
              <tr>
                <th class="px-6 py-4">ID</th>
                <th class="px-6 py-4">STORE NAME</th>
                <th class="px-6 py-4">SLUG / ROUTE</th>
                <th class="px-6 py-4">CONTACT PHONE</th>
                <th class="px-6 py-4">LOCATION</th>
                <th class="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#141836] text-slate-200">
              <tr v-if="filteredStores.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-[#65719e]">
                  No stores found in directory.
                </td>
              </tr>

              <tr
                v-for="(st, index) in filteredStores"
                :key="st.id"
                class="hover:bg-[#101435] transition-colors"
              >
                <td class="px-6 py-4 font-mono font-extrabold text-[#818cf8]">#{{ index + 1 }}</td>
                <td class="px-6 py-4">
                  <span class="font-bold text-white block text-sm">{{ st.name }}</span>
                  <span class="text-[#65719e] text-[11px] line-clamp-1">{{ st.description || 'Optical Boutique' }}</span>
                </td>
                <td class="px-6 py-4 font-mono text-[#818cf8]">/stores/{{ st.slug }}</td>
                <td class="px-6 py-4 font-medium text-slate-300">{{ st.phone || 'N/A' }}</td>
                <td class="px-6 py-4 text-[#7582b5] max-w-xs truncate">{{ st.address || 'N/A' }}</td>
                <td class="px-6 py-4 text-right space-x-2">
                  <router-link
                    :to="`/stores/${st.slug}`"
                    class="px-3 py-1.5 rounded-lg bg-[#1a214d] text-[#818cf8] border border-[#2b357a] hover:bg-[#222b64] text-xs font-semibold inline-block transition-colors"
                  >
                    View Storefront
                  </router-link>
                  <button
                    @click="deleteStore(st.id)"
                    class="px-3 py-1.5 rounded-lg bg-[#2a1320] text-[#f87171] border border-[#4a1c2d] hover:bg-[#3d182b] text-xs font-semibold transition-colors"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <!-- Create Store Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0b0e24] border border-[#171c3b] rounded-3xl p-6 sm:p-8 w-full max-w-md space-y-6 text-slate-100 shadow-2xl">
        <div class="flex items-center justify-between border-b border-[#181d3d] pb-4">
          <h3 class="font-extrabold text-lg text-white flex items-center gap-2">
            <Store class="w-5 h-5 text-[#818cf8]" /> Create Partner Store
          </h3>
          <button @click="showCreateModal = false" class="text-[#65719e] hover:text-white">&times;</button>
        </div>

        <form @submit.prevent="createStore" class="space-y-4 text-xs">
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Store Name</label>
            <input
              v-model="newStore.name"
              type="text"
              required
              placeholder="e.g. Phnom Penh Optics"
              class="w-full bg-[#060814] border border-[#171c3b] rounded-xl px-4 py-2.5 text-white placeholder-[#65719e] focus:outline-none focus:border-[#5542f6]"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Store Slug (URL Handle)</label>
            <input
              v-model="newStore.slug"
              type="text"
              required
              placeholder="e.g. phnom-penh-optics"
              class="w-full bg-[#060814] border border-[#171c3b] rounded-xl px-4 py-2.5 text-white placeholder-[#65719e] focus:outline-none focus:border-[#5542f6]"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Phone Contact</label>
            <input
              v-model="newStore.phone"
              type="text"
              placeholder="e.g. 012345678"
              class="w-full bg-[#060814] border border-[#171c3b] rounded-xl px-4 py-2.5 text-white placeholder-[#65719e] focus:outline-none focus:border-[#5542f6]"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Location Address</label>
            <input
              v-model="newStore.address"
              type="text"
              placeholder="e.g. Monivong Blvd, Phnom Penh"
              class="w-full bg-[#060814] border border-[#171c3b] rounded-xl px-4 py-2.5 text-white placeholder-[#65719e] focus:outline-none focus:border-[#5542f6]"
            />
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-[#181d3d]">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 bg-[#121633] hover:bg-[#1a2046] text-[#a0abd8] font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-[#5542f6] hover:bg-[#4736e6] text-white font-bold rounded-xl shadow-lg shadow-[#5542f6]/30"
            >
              Create Store
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';
import SuperAdminSidebar from '@/components/admin/SuperAdminSidebar.vue';
import { Store, Plus, Search } from 'lucide-vue-next';

const stores = ref<any[]>([]);
const searchQuery = ref('');
const showCreateModal = ref(false);

const newStore = ref({
  name: '',
  slug: '',
  phone: '',
  address: '',
  description: 'Specialist prescription optical storefront.',
});

async function fetchStores() {
  try {
    const res: any = await api.get('/stores');
    stores.value = res.data || res;
  } catch (err) {
    console.error('Failed to fetch stores', err);
  }
}

const filteredStores = computed(() => {
  return stores.value.filter((st) => {
    return (
      !searchQuery.value ||
      st.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (st.address && st.address.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  });
});

async function createStore() {
  try {
    await api.post('/stores', newStore.value);
    showCreateModal.value = false;
    newStore.value = { name: '', slug: '', phone: '', address: '', description: 'Specialist optical storefront' };
    await fetchStores();
  } catch (err: any) {
    alert(err.message || 'Failed to create store');
  }
}

async function deleteStore(id: number) {
  if (!confirm('Are you sure you want to remove this partner store?')) return;
  try {
    await api.delete(`/stores/${id}`);
    await fetchStores();
  } catch (err: any) {
    alert(err.message || 'Failed to delete store');
  }
}

onMounted(() => {
  fetchStores();
});
</script>
