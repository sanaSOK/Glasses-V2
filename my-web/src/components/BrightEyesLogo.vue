<template>
  <div class="inline-flex items-center gap-2.5">
    <!-- SVG Logo matching BrightEyes circular emblem -->
    <svg class="w-9 h-9 shrink-0" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Circle -->
      <circle cx="250" cy="250" r="235" stroke="#1d4ed8" stroke-width="15" fill="#ffffff" />
      
      <!-- Upper Dark Blue Arch -->
      <path d="M 30 300 C 120 280, 250 180, 330 30 C 270 120, 160 250, 30 300 Z" fill="#1e3a8a" />
      
      <!-- Lower Dark Blue Arch -->
      <path d="M 30 300 C 120 300, 260 360, 380 440 C 270 340, 150 310, 30 300 Z" fill="#1e3a8a" />
      
      <!-- Light Blue Iris Cone -->
      <path d="M 130 290 C 220 230, 330 140, 410 260 C 370 340, 260 380, 130 290 Z" fill="#0284c7" />
      
      <!-- White Pupil Oval -->
      <ellipse cx="350" cy="270" rx="25" ry="40" fill="#ffffff" transform="rotate(-15 350 270)" />
      
      <!-- Light Ray 1: Red -->
      <rect x="360" y="130" width="80" height="25" fill="#dc2626" transform="rotate(-15 360 130)" />
      
      <!-- Light Ray 2: Green -->
      <rect x="390" y="210" width="80" height="25" fill="#16a34a" transform="rotate(-5 390 210)" />
      
      <!-- Light Ray 3: Dark Blue -->
      <rect x="390" y="300" width="80" height="25" fill="#000080" transform="rotate(10 390 300)" />
    </svg>

    <!-- Brand Name Text -->
    <div class="flex flex-col leading-none">
      <span class="font-black text-2xl tracking-tighter uppercase" :class="isDark ? 'text-white' : 'text-slate-900'">
        BRIGHT<span class="text-sky-500">EYES</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isDark?: boolean;
}>();
</script>
