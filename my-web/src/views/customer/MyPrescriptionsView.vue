<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">My Optical Prescriptions</h1>
        <p class="text-xs text-slate-500 mt-1">Manage doctor prescription metrics for custom precision lenses</p>
      </div>

      <button
        @click="showAddModal = true"
        class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2"
      >
        <Plus class="w-4 h-4" /> Add New Prescription
      </button>
    </div>

    <!-- Prescriptions List Grid -->
    <div v-if="prescriptions.length === 0" class="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
      <Eye class="w-16 h-16 text-slate-300 mx-auto" />
      <h3 class="font-bold text-slate-800 text-lg">No Prescriptions Saved</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">Add your eye doctor's prescription parameters (SPH, CYL, AXIS, PD) to easily apply them at checkout.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="p in prescriptions"
        :key="p.id"
        class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 relative"
      >
        <div class="flex justify-between items-start border-b border-slate-100 pb-3">
          <div>
            <span class="font-extrabold text-slate-900 text-base">Prescription Card #{{ p.id }}</span>
            <span class="text-xs text-slate-400 block">Created {{ new Date(p.created_at).toLocaleDateString() }}</span>
          </div>

          <button @click="deletePrescription(p.id)" class="text-slate-400 hover:text-rose-600 transition-colors">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <!-- Eye Parameter Matrix -->
        <div class="grid grid-cols-2 gap-4 text-xs">
          <!-- Right Eye -->
          <div class="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 space-y-1.5">
            <h5 class="font-bold text-indigo-900 flex items-center justify-between">
              <span>Right Eye (OD)</span>
              <span class="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-mono">OD</span>
            </h5>
            <div class="grid grid-cols-3 gap-1 text-[11px] text-slate-700">
              <div><span class="text-slate-400 block text-[9px]">SPH</span><span class="font-bold">{{ p.right_sphere ?? '0.00' }}</span></div>
              <div><span class="text-slate-400 block text-[9px]">CYL</span><span class="font-bold">{{ p.right_cylinder ?? '0.00' }}</span></div>
              <div><span class="text-slate-400 block text-[9px]">AXIS</span><span class="font-bold">{{ p.right_axis ?? '0' }}°</span></div>
            </div>
          </div>

          <!-- Left Eye -->
          <div class="bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100 space-y-1.5">
            <h5 class="font-bold text-sky-900 flex items-center justify-between">
              <span>Left Eye (OS)</span>
              <span class="text-[10px] bg-sky-200 text-sky-800 px-1.5 py-0.5 rounded font-mono">OS</span>
            </h5>
            <div class="grid grid-cols-3 gap-1 text-[11px] text-slate-700">
              <div><span class="text-slate-400 block text-[9px]">SPH</span><span class="font-bold">{{ p.left_sphere ?? '0.00' }}</span></div>
              <div><span class="text-slate-400 block text-[9px]">CYL</span><span class="font-bold">{{ p.left_cylinder ?? '0.00' }}</span></div>
              <div><span class="text-slate-400 block text-[9px]">AXIS</span><span class="font-bold">{{ p.left_axis ?? '0' }}°</span></div>
            </div>
          </div>
        </div>

        <div class="pt-2 flex justify-between items-center text-xs text-slate-600">
          <span>Pupillary Distance (PD): <strong class="text-slate-900">{{ p.pd || '63' }} mm</strong></span>
          <span v-if="p.prescription_image" class="text-indigo-600 font-semibold underline cursor-pointer">View Doctor Scan</span>
        </div>
      </div>
    </div>

    <!-- Add Prescription Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
        <div class="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 class="font-extrabold text-lg text-slate-900">Add Optical Prescription</h3>
          <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600"><X class="w-5 h-5" /></button>
        </div>

        <form @submit.prevent="savePrescription" class="space-y-4 text-xs">
          <!-- Right Eye Form -->
          <div class="p-3 bg-slate-50 rounded-xl space-y-2">
            <h5 class="font-bold text-slate-800">Right Eye (OD)</h5>
            <div class="grid grid-cols-3 gap-2">
              <input v-model.number="form.right_sphere" type="number" step="0.25" placeholder="SPH (-2.50)" class="p-2 border rounded-lg" />
              <input v-model.number="form.right_cylinder" type="number" step="0.25" placeholder="CYL (-0.75)" class="p-2 border rounded-lg" />
              <input v-model.number="form.right_axis" type="number" placeholder="AXIS (90)" class="p-2 border rounded-lg" />
            </div>
          </div>

          <!-- Left Eye Form -->
          <div class="p-3 bg-slate-50 rounded-xl space-y-2">
            <h5 class="font-bold text-slate-800">Left Eye (OS)</h5>
            <div class="grid grid-cols-3 gap-2">
              <input v-model.number="form.left_sphere" type="number" step="0.25" placeholder="SPH (-2.25)" class="p-2 border rounded-lg" />
              <input v-model.number="form.left_cylinder" type="number" step="0.25" placeholder="CYL (-0.50)" class="p-2 border rounded-lg" />
              <input v-model.number="form.left_axis" type="number" placeholder="AXIS (85)" class="p-2 border rounded-lg" />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Pupillary Distance (PD mm)</label>
            <input v-model.number="form.pd" type="number" placeholder="63" class="w-full p-2.5 border rounded-xl" />
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="showAddModal = false" class="flex-1 py-3 rounded-xl border font-bold">Cancel</button>
            <button type="submit" class="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold">Save Prescription</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { Plus, Eye, Trash2, X } from 'lucide-vue-next';

const prescriptions = ref<any[]>([]);
const showAddModal = ref(false);

const form = ref({
  right_sphere: -2.5,
  right_cylinder: -0.75,
  right_axis: 90,
  left_sphere: -2.25,
  left_cylinder: -0.5,
  left_axis: 85,
  pd: 63,
});

async function loadPrescriptions() {
  try {
    const res: any = await api.get('/prescriptions');
    prescriptions.value = res.data || [];
  } catch (err) {
    console.error(err);
  }
}

async function savePrescription() {
  try {
    await api.post('/prescriptions', form.value);
    showAddModal.value = false;
    await loadPrescriptions();
  } catch (err: any) {
    alert(err.message || 'Failed to save prescription');
  }
}

async function deletePrescription(id: number) {
  if (confirm('Delete this prescription card?')) {
    await api.delete(`/prescriptions/${id}`);
    await loadPrescriptions();
  }
}

onMounted(() => {
  loadPrescriptions();
});
</script>
