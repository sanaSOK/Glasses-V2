<template>
  <div v-if="show" class="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 rounded-none">
    <div class="bg-white max-w-3xl w-full border border-slate-900 flex flex-col md:flex-row max-h-[90vh] rounded-none">
      
      <!-- Left: Interactive Canvas & Model Selector -->
      <div class="bg-slate-950 md:w-1/2 p-6 flex flex-col items-center justify-between relative overflow-hidden rounded-none">
        
        <!-- Live Frame Overlay -->
        <div class="relative w-64 h-80 border border-slate-800 flex items-center justify-center bg-slate-950 rounded-none">
          <img
            :src="selectedModel"
            alt="Try On Model"
            class="absolute inset-0 w-full h-full object-cover object-center rounded-none"
          />

          <!-- Glasses Overlay -->
          <div
            class="absolute z-20 transition-all duration-200 pointer-events-none rounded-none"
            :style="{
              top: `${overlayPos.top}%`,
              left: `${overlayPos.left}%`,
              transform: `translate(-50%, -50%) scale(${overlayPos.scale}) rotate(${overlayPos.rotate}deg)`,
              width: '180px'
            }"
          >
            <img
              :src="productImage"
              :alt="productName"
              class="w-full h-auto drop-shadow-xl rounded-none"
            />
          </div>
        </div>

        <!-- Face Model Selector -->
        <div class="w-full mt-4 space-y-2 text-center">
          <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Choose Face Silhouette</span>
          <div class="flex justify-center gap-3">
            <button
              v-for="(model, idx) in models"
              :key="idx"
              @click="selectedModel = model.url"
              class="w-10 h-10 border overflow-hidden transition-all rounded-none"
              :class="selectedModel === model.url ? 'border-indigo-400 ring-2 ring-indigo-400/40' : 'border-slate-800 opacity-60 hover:opacity-100'"
            >
              <img :src="model.url" class="w-full h-full object-cover rounded-none" />
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Fine-Tuning Controls & Frame Information -->
      <div class="p-6 md:w-1/2 flex flex-col justify-between space-y-6 bg-white overflow-y-auto">
        
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="text-indigo-600 font-bold text-xs uppercase tracking-widest">Firmoo Virtual Try-On</span>
              <h3 class="font-extrabold text-slate-900 text-lg line-clamp-1">{{ productName }}</h3>
            </div>
            <button @click="$emit('close')" class="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Adjustments Controls -->
          <div class="space-y-4 text-xs">
            <div>
              <div class="flex justify-between font-bold text-slate-700 mb-1">
                <span>Vertical Position</span>
                <span>{{ overlayPos.top }}%</span>
              </div>
              <input v-model.number="overlayPos.top" type="range" min="20" max="60" class="w-full accent-indigo-600" />
            </div>

            <div>
              <div class="flex justify-between font-bold text-slate-700 mb-1">
                <span>Frame Size Scale</span>
                <span>{{ overlayPos.scale }}x</span>
              </div>
              <input v-model.number="overlayPos.scale" type="range" min="0.6" max="1.5" step="0.05" class="w-full accent-indigo-600" />
            </div>

            <div>
              <div class="flex justify-between font-bold text-slate-700 mb-1">
                <span>Frame Tilt Rotation</span>
                <span>{{ overlayPos.rotate }}°</span>
              </div>
              <input v-model.number="overlayPos.rotate" type="range" min="-15" max="15" class="w-full accent-indigo-600" />
            </div>
          </div>

          <!-- Fit Recommendation -->
          <div class="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-950">
            <Sparkles class="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span class="font-bold block">AI Fit Analysis</span>
              <span class="text-indigo-800 text-[11px]">This {{ frameShape || 'Round' }} frame perfectly complements Oval & Square face shapes.</span>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex gap-3">
          <button
            @click="$emit('select-lenses')"
            class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            Select Lenses & Prescription <ArrowRight class="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X, Sparkles, ArrowRight } from 'lucide-vue-next';

defineProps<{
  show: boolean;
  productName: string;
  productImage: string;
  frameShape?: string;
}>();

defineEmits(['close', 'select-lenses']);

const models = [
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500' },
  { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500' },
];

const selectedModel = ref(models[0].url);

const overlayPos = ref({
  top: 38,
  left: 50,
  scale: 1.0,
  rotate: 0,
});
</script>
