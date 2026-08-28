<template>
  <div v-if="show" class="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 rounded-none">
    <div class="bg-white max-w-2xl w-full p-8 space-y-6 border border-slate-900 max-h-[90vh] overflow-y-auto rounded-none shadow-none">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-slate-900 pb-4 rounded-none">
        <div>
          <span class="text-indigo-600 font-extrabold text-xs uppercase tracking-widest block">Firmoo Lens Studio</span>
          <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tight">Custom Optical Lens Selector</h2>
        </div>
        <button @click="$emit('close')" class="p-1 text-slate-400 hover:text-slate-900 rounded-none">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Step Indicator -->
      <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-3 rounded-none">
        <button
          v-for="s in [1, 2, 3, 4]"
          :key="s"
          @click="step = s"
          class="flex items-center gap-1.5 pb-1 border-b-2 transition-all rounded-none"
          :class="step === s ? 'border-slate-900 text-slate-900 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'"
        >
          <span>Step {{ s }}</span>
          <span class="hidden sm:inline" v-if="s === 1">: Usage</span>
          <span class="hidden sm:inline" v-if="s === 2">: Coating</span>
          <span class="hidden sm:inline" v-if="s === 3">: Index</span>
          <span class="hidden sm:inline" v-if="s === 4">: Prescription</span>
        </button>
      </div>

      <!-- Step 1: Usage Type -->
      <div v-if="step === 1" class="space-y-4 rounded-none">
        <h4 class="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Select Primary Vision Need</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs rounded-none">
          <button
            v-for="u in usageOptions"
            :key="u.id"
            @click="selectedUsage = u.id; step = 2"
            class="p-5 border text-left space-y-1 transition-all rounded-none"
            :class="selectedUsage === u.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:border-slate-900'"
          >
            <div class="font-extrabold text-sm flex items-center justify-between uppercase tracking-wider">
              <span>{{ u.title }}</span>
              <span :class="selectedUsage === u.id ? 'text-indigo-400' : 'text-indigo-600'">+${{ u.price }}</span>
            </div>
            <p class="text-[11px] leading-relaxed font-medium" :class="selectedUsage === u.id ? 'text-slate-300' : 'text-slate-500'">{{ u.desc }}</p>
          </button>
        </div>
      </div>

      <!-- Step 2: Coating & Filter -->
      <div v-else-if="step === 2" class="space-y-4 rounded-none">
        <h4 class="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Select Optical Coating</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs rounded-none">
          <button
            v-for="f in filterOptions"
            :key="f.id"
            @click="selectedFilter = f.id; step = 3"
            class="p-5 border text-left space-y-1 transition-all rounded-none"
            :class="selectedFilter === f.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:border-slate-900'"
          >
            <div class="font-extrabold text-sm flex items-center justify-between uppercase tracking-wider">
              <span>{{ f.title }}</span>
              <span :class="selectedFilter === f.id ? 'text-indigo-400' : 'text-indigo-600'">+${{ f.price }}</span>
            </div>
            <p class="text-[11px] leading-relaxed font-medium" :class="selectedFilter === f.id ? 'text-slate-300' : 'text-slate-500'">{{ f.desc }}</p>
          </button>
        </div>
      </div>

      <!-- Step 3: Index & Thickness -->
      <div v-else-if="step === 3" class="space-y-4 rounded-none">
        <h4 class="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Select Refractive Index</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs rounded-none">
          <button
            v-for="idx in indexOptions"
            :key="idx.id"
            @click="selectedIndex = idx.id; step = 4"
            class="p-5 border text-left space-y-1 transition-all rounded-none"
            :class="selectedIndex === idx.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:border-slate-900'"
          >
            <div class="font-extrabold text-sm flex items-center justify-between uppercase tracking-wider">
              <span>{{ idx.title }}</span>
              <span :class="selectedIndex === idx.id ? 'text-indigo-400' : 'text-indigo-600'">+${{ idx.price }}</span>
            </div>
            <p class="text-[11px] leading-relaxed font-medium" :class="selectedIndex === idx.id ? 'text-slate-300' : 'text-slate-500'">{{ idx.desc }}</p>
          </button>
        </div>
      </div>

      <!-- Step 4: Prescription Entry -->
      <div v-else-if="step === 4" class="space-y-4 text-xs rounded-none">
        <h4 class="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Doctor Prescription Metrics</h4>
        
        <div class="grid grid-cols-2 gap-3 rounded-none">
          <div class="p-4 bg-slate-50 border border-slate-300 space-y-2 rounded-none">
            <span class="font-extrabold text-slate-900 block uppercase tracking-wider">Right Eye (OD)</span>
            <div class="grid grid-cols-3 gap-1">
              <input v-model.number="rx.right_sphere" type="number" step="0.25" placeholder="SPH" class="p-2 border border-slate-300 font-bold rounded-none" />
              <input v-model.number="rx.right_cylinder" type="number" step="0.25" placeholder="CYL" class="p-2 border border-slate-300 font-bold rounded-none" />
              <input v-model.number="rx.right_axis" type="number" placeholder="AXIS" class="p-2 border border-slate-300 font-bold rounded-none" />
            </div>
          </div>

          <div class="p-4 bg-slate-50 border border-slate-300 space-y-2 rounded-none">
            <span class="font-extrabold text-slate-900 block uppercase tracking-wider">Left Eye (OS)</span>
            <div class="grid grid-cols-3 gap-1">
              <input v-model.number="rx.left_sphere" type="number" step="0.25" placeholder="SPH" class="p-2 border border-slate-300 font-bold rounded-none" />
              <input v-model.number="rx.left_cylinder" type="number" step="0.25" placeholder="CYL" class="p-2 border border-slate-300 font-bold rounded-none" />
              <input v-model.number="rx.left_axis" type="number" placeholder="AXIS" class="p-2 border border-slate-300 font-bold rounded-none" />
            </div>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-widest mb-1">Pupillary Distance (PD mm)</label>
          <input v-model.number="rx.pd" type="number" placeholder="63" class="w-full p-3 border border-slate-300 font-bold rounded-none" />
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="pt-4 border-t border-slate-900 flex justify-between items-center rounded-none">
        <button
          v-if="step > 1"
          @click="step--"
          class="px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-900 border border-slate-900 hover:bg-slate-100 rounded-none"
        >
          Previous
        </button>
        <span class="text-xs font-black uppercase tracking-wider text-slate-900">
          Surcharge: <span class="text-indigo-600 text-sm">${{ extraPrice }}</span>
        </span>
        <button
          @click="confirmLenses"
          class="px-6 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-none"
        >
          {{ step === 4 ? 'Confirm & Add Custom Lenses' : 'Next Step' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { X } from 'lucide-vue-next';

defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['close', 'add-customized-cart']);

const step = ref(1);

const usageOptions = [
  { id: 'distance', title: 'Single Vision (Distance)', price: 0, desc: 'For driving, sports, and everyday distance vision.' },
  { id: 'reading', title: 'Single Vision (Reading)', price: 0, desc: 'Optimized for close-up reading and phone screens.' },
  { id: 'progressive', title: 'Multifocal Progressive', price: 49, desc: 'Seamless no-line transition between distance and reading.' },
  { id: 'non_rx', title: 'Non-Prescription Fashion', price: 0, desc: 'Zero magnification lenses for fashion frames.' },
];

const filterOptions = [
  { id: 'clear', title: 'Clear Anti-Scratch Coating', price: 0, desc: 'Standard crisp optical clarity with protective Hydrophobic coating.' },
  { id: 'blue_block', title: 'Advanced Blue-Light Shield', price: 19, desc: 'Blocks digital screen glare and high-energy blue rays.' },
  { id: 'photochromic', title: 'Transition Photochromic', price: 39, desc: 'Lenses automatically darken outdoors under sunlight.' },
  { id: 'polarized', title: 'Polarized Sunglass Tint', price: 29, desc: 'Eliminates blinding glare for driving and water sports.' },
];

const indexOptions = [
  { id: '1.50', title: '1.50 Standard Index', price: 0, desc: 'Ideal for light prescriptions (SPH 0.00 to -2.00).' },
  { id: '1.56', title: '1.56 Mid Index (Thin)', price: 15, desc: '15% thinner and lighter for medium prescriptions.' },
  { id: '1.60', title: '1.60 High Index (Ultra-Thin)', price: 29, desc: '30% thinner, recommended for SPH -3.00 to -6.00.' },
  { id: '1.67', title: '1.67 Super-High Index', price: 49, desc: '45% ultra-sleek edge reduction for strong prescriptions.' },
];

const selectedUsage = ref('distance');
const selectedFilter = ref('clear');
const selectedIndex = ref('1.50');

const rx = ref({
  right_sphere: -2.50,
  right_cylinder: -0.75,
  right_axis: 90,
  left_sphere: -2.25,
  left_cylinder: -0.50,
  left_axis: 85,
  pd: 63,
});

const extraPrice = computed(() => {
  const u = usageOptions.find(o => o.id === selectedUsage.value)?.price || 0;
  const f = filterOptions.find(o => o.id === selectedFilter.value)?.price || 0;
  const i = indexOptions.find(o => o.id === selectedIndex.value)?.price || 0;
  return u + f + i;
});

function confirmLenses() {
  if (step.value < 4) {
    step.value++;
    return;
  }
  emit('add-customized-cart', {
    usage: selectedUsage.value,
    filter: selectedFilter.value,
    index: selectedIndex.value,
    extraPrice: extraPrice.value,
    prescription: rx.value,
  });
  emit('close');
}
</script>
