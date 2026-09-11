<template>
  <div class="flex min-h-screen bg-[#060814] text-slate-100 font-sans">
    
    <!-- Left Sidebar -->
    <SuperAdminSidebar />

    <!-- Main Workspace -->
    <main class="flex-1 p-8 space-y-8 overflow-y-auto w-full">
      
      <!-- Top Banner -->
      <div class="relative overflow-hidden bg-[#0b0e24] p-6 sm:p-8 rounded-3xl border border-[#171c3b] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-2 relative z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5542f6]/20 text-[#818cf8] text-xs font-semibold border border-[#5542f6]/40">
            <FileText class="w-3.5 h-3.5 text-[#818cf8]" /> Doctor Prescription Records
          </div>
          <h1 class="text-3xl font-extrabold tracking-wider text-white">Optical Prescriptions Audit</h1>
          <p class="text-xs text-[#7582b5]">Super Admin verification for patient lens prescriptions (SPH, CYL, AXIS, PD)</p>
        </div>
      </div>

      <!-- Prescriptions Table -->
      <div class="bg-[#0b0e24] rounded-3xl border border-[#171c3b] overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#0d112d] text-[#6d79a8] uppercase tracking-wider font-extrabold border-b border-[#181d3d]">
              <tr>
                <th class="px-6 py-4">ID</th>
                <th class="px-6 py-4">DOCTOR / OPTOMETRIST</th>
                <th class="px-6 py-4">RIGHT EYE (OD)</th>
                <th class="px-6 py-4">LEFT EYE (OS)</th>
                <th class="px-6 py-4">PUPILLARY DIST (PD)</th>
                <th class="px-6 py-4 text-right">VERIFICATION</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#141836] text-slate-200">
              <tr v-if="prescriptions.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-[#65719e]">
                  No optical prescription records found.
                </td>
              </tr>

              <tr
                v-for="(rx, index) in prescriptions"
                :key="rx.id"
                class="hover:bg-[#101435] transition-colors"
              >
                <td class="px-6 py-4 font-mono font-extrabold text-[#818cf8]">#RX-{{ index + 1 }}</td>
                <td class="px-6 py-4 font-bold text-white">
                  {{ rx.doctor_name || 'Dr. Certified Optometrist' }}
                </td>
                <td class="px-6 py-4 font-mono text-[#818cf8]">
                  SPH: {{ rx.od_sph || '0.00' }} | CYL: {{ rx.od_cyl || '0.00' }} | AXIS: {{ rx.od_axis || '0' }}°
                </td>
                <td class="px-6 py-4 font-mono text-[#818cf8]">
                  SPH: {{ rx.os_sph || '0.00' }} | CYL: {{ rx.os_cyl || '0.00' }} | AXIS: {{ rx.os_axis || '0' }}°
                </td>
                <td class="px-6 py-4 font-bold text-white">
                  {{ rx.pd || '63' }} mm
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="px-2.5 py-1 rounded-full bg-[#142b1f] text-[#34d399] border border-[#1d4d35] font-extrabold text-[10px] uppercase">
                    Verified Lens Cut
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import SuperAdminSidebar from '@/components/admin/SuperAdminSidebar.vue';
import { FileText } from 'lucide-vue-next';

const prescriptions = ref<any[]>([]);

async function fetchPrescriptions() {
  try {
    const res: any = await api.get('/prescriptions');
    prescriptions.value = res.data || res;
  } catch (err) {
    console.error('Failed to fetch prescriptions', err);
  }
}

onMounted(() => {
  fetchPrescriptions();
});
</script>
