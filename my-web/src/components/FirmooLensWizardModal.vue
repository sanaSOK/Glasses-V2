<template>
  <div v-if="show" class="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 rounded-none">
    <div class="bg-white max-w-3xl w-full border border-slate-900 flex flex-col max-h-[92vh] rounded-none overflow-hidden shadow-2xl">
      
      <!-- Top Bar Header -->
      <div class="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 rounded-none">
        <div>
          <span class="text-indigo-400 font-extrabold text-[10px] uppercase tracking-widest block">Firmoo Precision Optical Studio</span>
          <h2 class="text-xl font-black uppercase tracking-tight text-white">Custom Prescription & Lens Selector</h2>
        </div>
        <button @click="$emit('close')" class="p-1 text-slate-400 hover:text-white rounded-none">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Step Progress Bar (5 Steps) -->
      <div class="bg-slate-100 border-b border-slate-300 grid grid-cols-5 text-center text-[10px] font-extrabold uppercase tracking-wider rounded-none">
        <div
          v-for="(label, index) in steps"
          :key="index"
          class="py-3 border-r last:border-r-0 border-slate-300 transition-colors"
          :class="step === index + 1 ? 'bg-slate-900 text-white border-b-2 border-indigo-500' : (step > index + 1 ? 'bg-indigo-50 text-indigo-900' : 'text-slate-500')"
        >
          <span class="hidden sm:inline">Step {{ index + 1 }}: </span>{{ label }}
        </div>
      </div>

      <!-- Main Step Body Container -->
      <div class="p-8 flex-1 overflow-y-auto space-y-6">
        
        <!-- STEP 1: Usage Type -->
        <div v-if="step === 1" class="space-y-5">
          <div class="border-b border-slate-200 pb-3">
            <h3 class="text-lg font-black uppercase tracking-tight text-slate-900">1. Select Your Prescription / Vision Type</h3>
            <p class="text-xs text-slate-500 uppercase tracking-wider">Choose what you will use these glasses for</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              v-for="u in usageOptions"
              :key="u.id"
              @click="selectedUsage = u.id; step = 2"
              class="p-5 border text-left transition-all rounded-none space-y-2"
              :class="selectedUsage === u.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:border-slate-900 bg-white text-slate-900'"
            >
              <div class="flex items-center justify-between font-black text-sm uppercase tracking-wider">
                <span>{{ u.title }}</span>
                <span :class="selectedUsage === u.id ? 'text-indigo-400' : 'text-indigo-600'">+${{ u.price }}</span>
              </div>
              <p class="text-xs leading-relaxed font-medium" :class="selectedUsage === u.id ? 'text-slate-300' : 'text-slate-500'">
                {{ u.desc }}
              </p>
            </button>
          </div>
        </div>

        <!-- STEP 2: Lens Coating & Filter -->
        <div v-else-if="step === 2" class="space-y-5">
          <div class="border-b border-slate-200 pb-3">
            <h3 class="text-lg font-black uppercase tracking-tight text-slate-900">2. Select Optical Coating & Tint</h3>
            <p class="text-xs text-slate-500 uppercase tracking-wider">Filter blue light, sun UV rays, or auto-darkening transitions</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              v-for="f in coatingOptions"
              :key="f.id"
              @click="selectedCoating = f.id; step = 3"
              class="p-5 border text-left transition-all rounded-none space-y-2"
              :class="selectedCoating === f.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:border-slate-900 bg-white text-slate-900'"
            >
              <div class="flex items-center justify-between font-black text-sm uppercase tracking-wider">
                <span>{{ f.title }}</span>
                <span :class="selectedCoating === f.id ? 'text-indigo-400' : 'text-indigo-600'">+${{ f.price }}</span>
              </div>
              <p class="text-xs leading-relaxed font-medium" :class="selectedCoating === f.id ? 'text-slate-300' : 'text-slate-500'">
                {{ f.desc }}
              </p>
            </button>
          </div>
        </div>

        <!-- STEP 3: Lens Refractive Index & Thickness -->
        <div v-else-if="step === 3" class="space-y-5">
          <div class="border-b border-slate-200 pb-3">
            <h3 class="text-lg font-black uppercase tracking-tight text-slate-900">3. Select Lens Index (Thickness)</h3>
            <p class="text-xs text-slate-500 uppercase tracking-wider">Higher index lenses are significantly thinner and lighter</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              v-for="idx in indexOptions"
              :key="idx.id"
              @click="selectedIndex = idx.id; step = 4"
              class="p-5 border text-left transition-all rounded-none space-y-2"
              :class="selectedIndex === idx.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:border-slate-900 bg-white text-slate-900'"
            >
              <div class="flex items-center justify-between font-black text-sm uppercase tracking-wider">
                <span>{{ idx.title }}</span>
                <span :class="selectedIndex === idx.id ? 'text-indigo-400' : 'text-indigo-600'">+${{ idx.price }}</span>
              </div>
              <p class="text-xs leading-relaxed font-medium" :class="selectedIndex === idx.id ? 'text-slate-300' : 'text-slate-500'">
                {{ idx.desc }}
              </p>
            </button>
          </div>
        </div>

        <!-- STEP 4: Prescription Method (Upload Photo vs Manual vs Saved vs Later) -->
        <div v-else-if="step === 4" class="space-y-5">
          <div class="border-b border-slate-200 pb-3">
            <h3 class="text-lg font-black uppercase tracking-tight text-slate-900">4. How Would You Like to Provide Your Prescription?</h3>
            <p class="text-xs text-slate-500 uppercase tracking-wider">Multiple convenient options for doctor prescription attachment</p>
          </div>

          <!-- Method Selector Tabs -->
          <div class="flex gap-2 border-b border-slate-300 pb-2">
            <button
              v-for="m in ['manual', 'upload', 'later']"
              :key="m"
              @click="rxMethod = m"
              class="px-4 py-2 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all rounded-none"
              :class="rxMethod === m ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'"
            >
              <span v-if="m === 'manual'">Enter Manually</span>
              <span v-else-if="m === 'upload'">Upload Prescription Image</span>
              <span v-else>Send Later via Email</span>
            </button>
          </div>

          <!-- Option A: Manual Entry -->
          <div v-if="rxMethod === 'manual'" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-slate-50 border border-slate-300 space-y-3">
                <span class="font-extrabold text-slate-900 uppercase tracking-wider block">Right Eye (OD)</span>
                <div class="grid grid-cols-3 gap-2">
                  <div>
                    <label class="block text-[9px] font-bold text-slate-500 uppercase">SPH</label>
                    <input v-model.number="rx.right_sphere" type="number" step="0.25" placeholder="-2.50" class="w-full p-2 border border-slate-300 font-bold rounded-none" />
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold text-slate-500 uppercase">CYL</label>
                    <input v-model.number="rx.right_cylinder" type="number" step="0.25" placeholder="-0.75" class="w-full p-2 border border-slate-300 font-bold rounded-none" />
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold text-slate-500 uppercase">AXIS</label>
                    <input v-model.number="rx.right_axis" type="number" placeholder="90" class="w-full p-2 border border-slate-300 font-bold rounded-none" />
                  </div>
                </div>
              </div>

              <div class="p-4 bg-slate-50 border border-slate-300 space-y-3">
                <span class="font-extrabold text-slate-900 uppercase tracking-wider block">Left Eye (OS)</span>
                <div class="grid grid-cols-3 gap-2">
                  <div>
                    <label class="block text-[9px] font-bold text-slate-500 uppercase">SPH</label>
                    <input v-model.number="rx.left_sphere" type="number" step="0.25" placeholder="-2.25" class="w-full p-2 border border-slate-300 font-bold rounded-none" />
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold text-slate-500 uppercase">CYL</label>
                    <input v-model.number="rx.left_cylinder" type="number" step="0.25" placeholder="-0.50" class="w-full p-2 border border-slate-300 font-bold rounded-none" />
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold text-slate-500 uppercase">AXIS</label>
                    <input v-model.number="rx.left_axis" type="number" placeholder="85" class="w-full p-2 border border-slate-300 font-bold rounded-none" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase tracking-widest mb-1">Pupillary Distance (PD mm)</label>
              <input v-model.number="rx.pd" type="number" placeholder="63" class="w-full p-3 border border-slate-300 font-bold rounded-none" />
            </div>
          </div>

          <!-- Option B: Upload Prescription -->
          <div v-else-if="rxMethod === 'upload'" class="p-8 border-2 border-dashed border-slate-300 text-center space-y-3 bg-slate-50">
            <Upload class="w-10 h-10 text-slate-400 mx-auto" />
            <h4 class="font-extrabold text-slate-900 uppercase tracking-wider text-xs">Drop Doctor Prescription File Here</h4>
            <p class="text-xs text-slate-500 uppercase tracking-wide">Supports JPG, PNG, PDF scans</p>
            <input type="file" @change="handleFileUpload" class="text-xs font-bold" />
          </div>

          <!-- Option C: Send Later -->
          <div v-else class="p-6 bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
            <div class="font-extrabold uppercase tracking-wider flex items-center gap-2">
              <Mail class="w-4 h-4 text-amber-600" /> Send Prescription After Checkout
            </div>
            <p class="text-amber-800 leading-relaxed font-medium">
              You can complete your frame order today! Our optician team will email you a secure link to submit your doctor's prescription slip before lens cutting.
            </p>
          </div>
        </div>

        <!-- STEP 5: Final Review & Confirmation -->
        <div v-else-if="step === 5" class="space-y-5">
          <div class="border-b border-slate-200 pb-3">
            <h3 class="text-lg font-black uppercase tracking-tight text-slate-900">5. Review Your Customized Optical Package</h3>
            <p class="text-xs text-slate-500 uppercase tracking-wider">Confirm frame and lens customizer options before adding to cart</p>
          </div>

          <div class="p-6 bg-slate-50 border border-slate-300 space-y-4 text-xs">
            <div class="flex justify-between border-b border-slate-200 pb-2">
              <span class="font-bold text-slate-500 uppercase">Vision Need</span>
              <span class="font-extrabold text-slate-900 uppercase">{{ getUsageTitle(selectedUsage) }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-200 pb-2">
              <span class="font-bold text-slate-500 uppercase">Lens Coating</span>
              <span class="font-extrabold text-slate-900 uppercase">{{ getCoatingTitle(selectedCoating) }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-200 pb-2">
              <span class="font-bold text-slate-500 uppercase">Refractive Index</span>
              <span class="font-extrabold text-slate-900 uppercase">{{ getIndexTitle(selectedIndex) }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-200 pb-2">
              <span class="font-bold text-slate-500 uppercase">Prescription Method</span>
              <span class="font-extrabold text-indigo-600 uppercase">{{ rxMethod }}</span>
            </div>
            <div class="flex justify-between text-sm font-black text-slate-900 pt-2">
              <span>Total Lens Surcharge</span>
              <span class="text-indigo-600">${{ totalSurcharge }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="bg-white border-t border-slate-900 p-5 flex justify-between items-center rounded-none">
        <button
          v-if="step > 1"
          @click="step--"
          class="px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-900 border border-slate-900 hover:bg-slate-100 rounded-none"
        >
          Back
        </button>

        <div class="text-xs font-black uppercase tracking-wider text-slate-900 ml-auto mr-4">
          Lens Extras: <span class="text-indigo-600 text-sm font-black">${{ totalSurcharge }}</span>
        </div>

        <button
          @click="confirmStep"
          class="px-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-none shadow-md transition-colors"
        >
          {{ step === 5 ? 'Add Customized Pair to Cart' : 'Continue' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Upload, Mail } from 'lucide-vue-next';

defineProps<{
  show: boolean;
  framePrice?: number;
}>();

const emit = defineEmits(['close', 'add-to-cart-customized']);

const step = ref(1);
const steps = ['Usage', 'Coating', 'Index', 'Prescription', 'Review'];

const selectedUsage = ref('distance');
const selectedCoating = ref('clear');
const selectedIndex = ref('1.50');
const rxMethod = ref('manual');

const rx = ref({
  right_sphere: -2.50,
  right_cylinder: -0.75,
  right_axis: 90,
  left_sphere: -2.25,
  left_cylinder: -0.50,
  left_axis: 85,
  pd: 63,
});

const usageOptions = [
  { id: 'distance', title: 'Single Vision (Distance)', price: 0, desc: 'For driving, television, outdoor activities, and everyday distance.' },
  { id: 'reading', title: 'Single Vision (Reading)', price: 0, desc: 'Optimized for close-up reading, tablets, and smartphone screens.' },
  { id: 'progressive', title: 'Multifocal Progressive', price: 49, desc: 'Seamless no-line transition between distance, intermediate, and reading.' },
  { id: 'non_rx', title: 'Non-Prescription Fashion', price: 0, desc: 'Zero magnification lenses for style & anti-glare.' },
];

const coatingOptions = [
  { id: 'clear', title: 'Clear Anti-Scratch & Anti-Reflective', price: 0, desc: 'Standard crystal clear lens with Hydrophobic & UV400 protective shield.' },
  { id: 'blue_block', title: 'Advanced Blue-Light Guard', price: 19, desc: 'Blocks high-energy blue light emitted by laptops, phones, & LED displays.' },
  { id: 'photochromic', title: 'Transition Photochromic', price: 39, desc: 'Lenses stay clear indoors and automatically turn dark under sunlight.' },
  { id: 'polarized', title: 'Polarized Sunglass Tint', price: 29, desc: 'Eliminates blinding water and road surface reflections.' },
];

const indexOptions = [
  { id: '1.50', title: '1.50 Standard Index', price: 0, desc: 'Best for low prescriptions (SPH 0.00 to -2.00).' },
  { id: '1.56', title: '1.56 Mid Index (Thin)', price: 15, desc: '15% thinner & lighter for medium prescriptions.' },
  { id: '1.60', title: '1.60 High Index (Ultra-Thin)', price: 29, desc: '30% thinner, recommended for SPH -3.00 to -6.00.' },
  { id: '1.67', title: '1.67 Super-High Index', price: 49, desc: '45% ultra-sleek edge reduction for strong prescriptions.' },
  { id: '1.74', title: '1.74 Extremely Thin Index', price: 79, desc: 'Maximum thinness available for high prescriptions.' },
];

const totalSurcharge = computed(() => {
  const u = usageOptions.find(o => o.id === selectedUsage.value)?.price || 0;
  const c = coatingOptions.find(o => o.id === selectedCoating.value)?.price || 0;
  const i = indexOptions.find(o => o.id === selectedIndex.value)?.price || 0;
  return u + c + i;
});

function getUsageTitle(id: string) { return usageOptions.find(o => o.id === id)?.title || id; }
function getCoatingTitle(id: string) { return coatingOptions.find(o => o.id === id)?.title || id; }
function getIndexTitle(id: string) { return indexOptions.find(o => o.id === id)?.title || id; }

function handleFileUpload(e: any) {
  if (e.target.files && e.target.files[0]) {
    alert(`Prescription file "${e.target.files[0].name}" attached successfully!`);
  }
}

function confirmStep() {
  if (step.value < 5) {
    step.value++;
    return;
  }
  emit('add-to-cart-customized', {
    usage: selectedUsage.value,
    coating: selectedCoating.value,
    index: selectedIndex.value,
    rxMethod: rxMethod.value,
    surcharge: totalSurcharge.value,
    prescription: rx.value,
  });
  emit('close');
}
</script>
