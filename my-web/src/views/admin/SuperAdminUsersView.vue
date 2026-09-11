<template>
  <div class="flex min-h-screen bg-[#060814] text-slate-100 font-sans">
    
    <!-- Left Sidebar -->
    <SuperAdminSidebar />

    <!-- Main Workspace -->
    <main class="flex-1 p-8 space-y-8 overflow-y-auto w-full">
      
      <!-- Top Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b0e24] p-6 sm:p-8 rounded-3xl border border-[#171c3b] shadow-2xl">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5542f6]/20 text-[#818cf8] text-xs font-semibold border border-[#5542f6]/40 mb-2">
            <Users class="w-3.5 h-3.5" /> User & Admin Access Management
          </div>
          <h1 class="text-3xl font-extrabold tracking-wider text-white">All System Admins & Users</h1>
          <p class="text-xs text-[#7582b5] mt-1">Super Admin authority to create, assign stores, update roles, and manage Store Admins</p>
        </div>

        <button
          @click="showCreateModal = true"
          class="px-5 py-3 bg-[#5542f6] hover:bg-[#4736e6] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#5542f6]/30 flex items-center gap-2 shrink-0"
        >
          <UserPlus class="w-4 h-4" /> Create Store Admin
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0b0e24] p-4 rounded-2xl border border-[#171c3b]">
        <div class="relative w-full sm:w-80">
          <Search class="w-4 h-4 text-[#65719e] absolute left-3.5 top-3" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by store or phone..."
            class="w-full bg-[#060814] border border-[#171c3b] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#65719e] focus:outline-none focus:border-[#5542f6]"
          />
        </div>

        <!-- Role Filter Tabs -->
        <div class="flex items-center gap-1 bg-[#060814] p-1 rounded-xl border border-[#171c3b] text-xs">
          <button
            v-for="role in ['ALL', 'SUPER_ADMIN', 'STORE_ADMIN', 'STAFF', 'CUSTOMER']"
            :key="role"
            @click="selectedRoleFilter = role"
            class="px-3 py-1.5 rounded-lg font-semibold transition-all capitalize"
            :class="selectedRoleFilter === role ? 'bg-[#5542f6] text-white shadow-xs' : 'text-[#7582b5] hover:text-white'"
          >
            {{ role.replace('_', ' ').toLowerCase() }}
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-[#0b0e24] rounded-3xl border border-[#171c3b] overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#0d112d] text-[#6d79a8] uppercase tracking-wider font-extrabold border-b border-[#181d3d]">
              <tr>
                <th class="px-6 py-4">ID</th>
                <th class="px-6 py-4">STORE NAME</th>
                <th class="px-6 py-4">PHONE / CONTACT</th>
                <th class="px-6 py-4">SECURITY ROLE</th>
                <th class="px-6 py-4">STATUS</th>
                <th class="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#141836] text-slate-200">
              <tr v-if="filteredUsers.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-[#65719e]">
                  No users found matching filter criteria.
                </td>
              </tr>

              <tr
                v-for="(user, index) in filteredUsers"
                :key="user.id"
                class="hover:bg-[#101435] transition-colors"
              >
                <td class="px-6 py-4 font-mono font-extrabold text-[#818cf8]">#{{ index + 1 }}</td>
                <td class="px-6 py-4 font-bold text-white">
                  {{ user.store_name || 'Global / Customer' }}
                </td>
                <td class="px-6 py-4 font-medium text-slate-300">
                  {{ user.phone || 'N/A' }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-[11px] font-bold border inline-block"
                    :class="getRoleBadgeClass(user.role)"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider inline-block"
                    :class="user.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'"
                  >
                    {{ user.status || 'ACTIVE' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <button
                    @click="toggleUserStatus(user)"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                    :class="user.status === 'ACTIVE' ? 'bg-[#2b2414] text-[#fbbf24] border-[#4d3d19] hover:bg-[#3d321c]' : 'bg-[#142b1f] text-[#34d399] border-[#1d4d35] hover:bg-[#1b3d2b]'"
                  >
                    {{ user.status === 'ACTIVE' ? 'Suspend' : 'Activate' }}
                  </button>
                  <button
                    @click="deleteUser(user.id)"
                    class="px-3 py-1.5 rounded-lg bg-[#2a1320] text-[#f87171] border border-[#4a1c2d] hover:bg-[#3d182b] text-xs font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <!-- Create Store Admin Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0b0e24] border border-[#171c3b] rounded-3xl p-6 sm:p-8 w-full max-w-md space-y-6 text-slate-100 shadow-2xl">
        <div class="flex items-center justify-between border-b border-[#181d3d] pb-4">
          <h3 class="font-extrabold text-lg text-white flex items-center gap-2">
            <UserPlus class="w-5 h-5 text-[#818cf8]" /> Create New Store Admin
          </h3>
          <button @click="showCreateModal = false" class="text-[#65719e] hover:text-white">&times;</button>
        </div>

        <form @submit.prevent="createStoreAdmin" class="space-y-4 text-xs">
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Store Name</label>
            <input
              v-model="newUser.store_name"
              type="text"
              required
              placeholder="e.g. Phnom Penh Optics"
              class="w-full bg-[#060814] border border-[#171c3b] rounded-xl px-4 py-2.5 text-white placeholder-[#65719e] focus:outline-none focus:border-[#5542f6]"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Phone Number (Username)</label>
            <input
              v-model="newUser.phone"
              type="text"
              required
              placeholder="e.g. 012345678"
              class="w-full bg-[#060814] border border-[#171c3b] rounded-xl px-4 py-2.5 text-white placeholder-[#65719e] focus:outline-none focus:border-[#5542f6]"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Security Role</label>
            <select
              v-model="newUser.role"
              class="w-full bg-[#060814] border border-[#171c3b] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#5542f6]"
            >
              <option value="STORE_ADMIN">STORE_ADMIN (Manage Store)</option>
              <option value="STAFF">STAFF (Store Helper)</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN (Global Authority)</option>
            </select>
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
              Create Account
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
import { Users, UserPlus, Search } from 'lucide-vue-next';

const users = ref<any[]>([]);
const searchQuery = ref('');
const selectedRoleFilter = ref('ALL');
const showCreateModal = ref(false);

const newUser = ref({
  store_name: '',
  phone: '',
  role: 'STORE_ADMIN',
});

async function fetchUsers() {
  try {
    const res: any = await api.get('/users');
    users.value = res.data || res;
  } catch (err) {
    console.error('Failed to fetch users', err);
  }
}

const filteredUsers = computed(() => {
  const list = users.value.filter((u) => {
    const matchesSearch =
      !searchQuery.value ||
      (u.store_name && u.store_name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (u.phone && u.phone.includes(searchQuery.value));

    const matchesRole =
      selectedRoleFilter.value === 'ALL' || u.role === selectedRoleFilter.value;

    return matchesSearch && matchesRole;
  });

  return list.sort((a, b) => a.id - b.id);
});

function getRoleBadgeClass(role: string) {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'bg-[#261d4a] text-[#c084fc] border-[#422d7a]';
    case 'STORE_ADMIN':
      return 'bg-[#1a214d] text-[#818cf8] border-[#2b357a]';
    case 'STAFF':
      return 'bg-[#142845] text-[#38bdf8] border-[#1f406b]';
    default:
      return 'bg-[#121633] text-[#a0abd8] border-[#202754]';
  }
}

async function createStoreAdmin() {
  try {
    await api.post('/users', newUser.value);
    showCreateModal.value = false;
    newUser.value = { store_name: '', phone: '', role: 'STORE_ADMIN' };
    await fetchUsers();
  } catch (err: any) {
    alert(err.message || 'Failed to create user');
  }
}

async function toggleUserStatus(user: any) {
  const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
  try {
    await api.patch(`/users/${user.id}`, { status: nextStatus });
    user.status = nextStatus;
  } catch (err: any) {
    alert(err.message || 'Failed to update status');
  }
}

async function deleteUser(id: number) {
  if (!confirm('Are you sure you want to delete this admin account?')) return;
  try {
    await api.delete(`/users/${id}`);
    await fetchUsers();
  } catch (err: any) {
    alert(err.message || 'Failed to delete user');
  }
}

onMounted(() => {
  fetchUsers();
});
</script>
