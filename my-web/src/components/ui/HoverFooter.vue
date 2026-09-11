<template>
  <footer class="bg-[#0F0F11] relative h-fit w-full overflow-hidden border-t border-neutral-800 text-neutral-300 mt-16">
    <!-- Main Footer Container (Full Screen Responsive Width) -->
    <div class="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-12 pb-4 z-40 relative">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16">
        <!-- Brand section -->
        <div class="flex flex-col space-y-4">
          <router-link to="/" class="flex items-center">
            <BrightEyesLogo :is-dark="true" />
          </router-link>
          <p class="text-sm leading-relaxed text-neutral-400">
            BrightEyes is a modern multi-store optical platform with high-precision lens technology and doctor prescription fitting.
          </p>
        </div>

        <!-- Navigation Section -->
        <div>
          <h4 class="text-white text-lg font-semibold mb-6">Navigation</h4>
          <ul class="space-y-3 text-sm">
            <li><router-link to="/shop" class="hover:text-[#3ca2fa] transition-colors">Prescription Glasses</router-link></li>
            <li><router-link to="/shop?gender=SUNGLASSES" class="hover:text-[#3ca2fa] transition-colors">Designer Sunglasses</router-link></li>
            <li><router-link to="/stores" class="hover:text-[#3ca2fa] transition-colors">Partner Boutiques</router-link></li>
            <li><router-link to="/prescriptions" class="hover:text-[#3ca2fa] transition-colors">Optical Prescriptions</router-link></li>
          </ul>
        </div>

        <!-- Helpful Links -->
        <div>
          <h4 class="text-white text-lg font-semibold mb-6">Helpful Links</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#" class="hover:text-[#3ca2fa] transition-colors">FAQs</a></li>
            <li><a href="#" class="hover:text-[#3ca2fa] transition-colors">Support & Warranty</a></li>
            <li class="relative inline-block">
              <a href="#" class="hover:text-[#3ca2fa] transition-colors">Live Optical Chat</a>
              <span class="absolute top-0 -right-3 w-2 h-2 rounded-full bg-[#3ca2fa] animate-pulse"></span>
            </li>
          </ul>
        </div>

        <!-- Contact Section -->
        <div>
          <h4 class="text-white text-lg font-semibold mb-6">Contact Us</h4>
          <ul class="space-y-4 text-sm">
            <li class="flex items-center space-x-3">
              <Mail class="w-4 h-4 text-[#3ca2fa]" />
              <a href="mailto:support@brighteyes.com" class="hover:text-[#3ca2fa] transition-colors">support@brighteyes.com</a>
            </li>
            <li class="flex items-center space-x-3">
              <Phone class="w-4 h-4 text-[#3ca2fa]" />
              <a href="tel:18002744483" class="hover:text-[#3ca2fa] transition-colors">1-800-BRIGHT-EYES</a>
            </li>
            <li class="flex items-center space-x-3">
              <MapPin class="w-4 h-4 text-[#3ca2fa]" />
              <span>BrightEyes NYC Flagship Store</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Full Screen Text Hover Effect (Smaller Sleek Size) -->
    <div class="lg:flex hidden h-[10rem] my-2 w-full justify-center items-center relative z-20 overflow-hidden">
      <svg
        ref="svgRef"
        width="100%"
        height="100%"
        viewBox="0 0 600 70"
        xmlns="http://www.w3.org/2000/svg"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
        @mousemove="onMouseMove"
        class="select-none uppercase cursor-pointer z-30 w-full"
      >
        <defs>
          <linearGradient id="textGradientVue" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="25%">
            <stop v-if="hovered" offset="0%" stop-color="#eab308" />
            <stop v-if="hovered" offset="25%" stop-color="#ef4444" />
            <stop v-if="hovered" offset="50%" stop-color="#80eeb4" />
            <stop v-if="hovered" offset="75%" stop-color="#06b6d4" />
            <stop v-if="hovered" offset="100%" stop-color="#8b5cf6" />
          </linearGradient>

          <radialGradient
            id="revealMaskVue"
            gradientUnits="userSpaceOnUse"
            r="22%"
            :cx="maskPosition.cx"
            :cy="maskPosition.cy"
            class="transition-all duration-150 ease-out"
          >
            <stop offset="0%" stop-color="white" />
            <stop offset="100%" stop-color="black" />
          </radialGradient>

          <mask id="textMaskVue">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMaskVue)" />
          </mask>
        </defs>

        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dominant-baseline="middle"
          stroke-width="0.3"
          class="fill-transparent stroke-neutral-700 font-[helvetica] text-4xl font-extrabold tracking-widest transition-opacity duration-300"
          :style="{ opacity: hovered ? 0.7 : 0.25 }"
        >
          BRIGHTEYES
        </text>

        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dominant-baseline="middle"
          stroke-width="0.3"
          class="fill-transparent stroke-[#3ca2fa] font-[helvetica] text-4xl font-extrabold tracking-widest opacity-80"
        >
          BRIGHTEYES
        </text>

        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dominant-baseline="middle"
          stroke="url(#textGradientVue)"
          stroke-width="0.4"
          mask="url(#textMaskVue)"
          class="fill-transparent font-[helvetica] text-4xl font-extrabold tracking-widest"
        >
          BRIGHTEYES
        </text>
      </svg>
    </div>

    <!-- Full Width Centered Bottom Bar -->
    <div class="relative z-40 w-full px-6 sm:px-12 pt-6 pb-10 flex flex-col items-center justify-center space-y-4 border-t border-neutral-800/60">
      <!-- Social icons -->
      <div class="flex space-x-6 text-neutral-400">
        <a href="#" aria-label="Facebook" class="hover:text-[#3ca2fa] transition-colors"><Facebook class="w-5 h-5" /></a>
        <a href="#" aria-label="Instagram" class="hover:text-[#3ca2fa] transition-colors"><Instagram class="w-5 h-5" /></a>
        <a href="#" aria-label="Twitter" class="hover:text-[#3ca2fa] transition-colors"><Twitter class="w-5 h-5" /></a>
        <a href="#" aria-label="Globe" class="hover:text-[#3ca2fa] transition-colors"><Globe class="w-5 h-5" /></a>
      </div>

      <!-- Copyright Centered at Bottom -->
      <p class="text-center text-xs text-neutral-400 tracking-wide font-normal">
        &copy; {{ new Date().getFullYear() }} BRIGHTEYES. All rights reserved.
      </p>
    </div>

    <!-- Background Gradient -->
    <div
      class="absolute inset-0 z-0 pointer-events-none"
      style="background: radial-gradient(125% 125% at 50% 10%, #0F0F1166 50%, #3ca2fa33 100%);"
    />
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BrightEyesLogo from '@/components/BrightEyesLogo.vue';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Globe } from 'lucide-vue-next';

const svgRef = ref<SVGSVGElement | null>(null);
const hovered = ref(false);
const maskPosition = ref({ cx: '50%', cy: '50%' });

function onMouseMove(e: MouseEvent) {
  if (svgRef.value) {
    const rect = svgRef.value.getBoundingClientRect();
    const cxPercentage = ((e.clientX - rect.left) / rect.width) * 100;
    const cyPercentage = ((e.clientY - rect.top) / rect.height) * 100;
    maskPosition.value = {
      cx: `${cxPercentage}%`,
      cy: `${cyPercentage}%`,
    };
  }
}
</script>
