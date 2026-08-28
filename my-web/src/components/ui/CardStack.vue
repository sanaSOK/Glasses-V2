<template>
  <div
    class="w-full relative select-none"
    :class="className"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <!-- Stage -->
    <div
      class="relative w-full overflow-hidden sm:overflow-visible focus:outline-none flex items-center justify-center"
      :style="{ height: `${Math.max(420, cardHeight + 90)}px` }"
      tabindex="0"
      @keydown.left="prev"
      @keydown.right="next"
    >
      <!-- Background wash / spotlight -->
      <div
        class="pointer-events-none absolute inset-x-0 top-6 mx-auto h-48 w-[70%] rounded-full bg-indigo-500/10 blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-[76%] rounded-full bg-black/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <!-- 3D Card Stack Container -->
      <div
        class="absolute inset-0 flex items-center justify-center"
        :style="{ perspective: `${perspectivePx}px` }"
      >
        <div
          v-for="(item, i) in items"
          :key="item.id || i"
          v-show="getCardState(i).visible"
          class="absolute rounded-2xl border border-slate-200/80 bg-white shadow-2xl overflow-hidden will-change-transform transition-transform duration-500 ease-out"
          :class="[
            getCardState(i).isActive
              ? 'cursor-grab active:cursor-grabbing ring-2 ring-indigo-500/40 shadow-indigo-500/10'
              : 'cursor-pointer hover:border-indigo-400/60'
          ]"
          :style="getCardStyle(i)"
          @click="handleCardClick(i)"
          @mousedown="getCardState(i).isActive ? startDrag($event) : null"
          @touchstart="getCardState(i).isActive ? startTouch($event) : null"
        >
          <div
            class="h-full w-full relative"
            :style="{
              transform: `translateZ(${getCardState(i).z}px)`,
              transformStyle: 'preserve-3d'
            }"
          >
            <slot :item="item" :active="getCardState(i).isActive">
              <!-- Default Card Content if no slot provided -->
              <div class="relative h-full w-full flex flex-col justify-end p-6 text-white bg-slate-900">
                <img
                  v-if="item.imageSrc || item.image"
                  :src="item.imageSrc || item.image"
                  :alt="item.title || item.name"
                  class="absolute inset-0 h-full w-full object-cover opacity-80"
                  draggable="false"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div class="relative z-10 space-y-1">
                  <span v-if="item.tag || item.brand" class="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    {{ item.tag || item.brand }}
                  </span>
                  <h3 class="text-lg font-bold truncate text-white">
                    {{ item.title || item.name }}
                  </h3>
                  <p v-if="item.description" class="text-xs text-slate-300 line-clamp-2">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Controls (Prev / Next Buttons & Dots) -->
    <div v-if="showDots || showControls" class="mt-4 flex flex-wrap items-center justify-center gap-4">
      <button
        v-if="showControls"
        @click="prev"
        class="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all rounded-full shadow-xs"
        aria-label="Previous card"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>

      <div v-if="showDots" class="flex items-center gap-2">
        <button
          v-for="(_, idx) in items"
          :key="idx"
          @click="setActive(idx)"
          class="h-2.5 rounded-full transition-all duration-300"
          :class="[
            idx === active
              ? 'w-8 bg-indigo-600'
              : 'w-2.5 bg-slate-300 hover:bg-slate-400'
          ]"
          :aria-label="`Go to slide ${idx + 1}`"
        ></button>
      </div>

      <button
        v-if="showControls"
        @click="next"
        class="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all rounded-full shadow-xs"
        aria-label="Next card"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

export interface CardStackItem {
  id: string | number;
  title?: string;
  name?: string;
  description?: string;
  imageSrc?: string;
  image?: string;
  href?: string;
  tag?: string;
  brand?: string;
  [key: string]: any;
}

const props = withDefaults(
  defineProps<{
    items: CardStackItem[];
    initialIndex?: number;
    maxVisible?: number;
    cardWidth?: number;
    cardHeight?: number;
    overlap?: number;
    spreadDeg?: number;
    perspectivePx?: number;
    depthPx?: number;
    tiltXDeg?: number;
    activeLiftPx?: number;
    activeScale?: number;
    inactiveScale?: number;
    loop?: boolean;
    autoAdvance?: boolean;
    intervalMs?: number;
    pauseOnHover?: boolean;
    showDots?: boolean;
    showControls?: boolean;
    className?: string;
  }>(),
  {
    initialIndex: 0,
    maxVisible: 5,
    cardWidth: 420,
    cardHeight: 380,
    overlap: 0.45,
    spreadDeg: 36,
    perspectivePx: 1100,
    depthPx: 120,
    tiltXDeg: 8,
    activeLiftPx: 20,
    activeScale: 1.03,
    inactiveScale: 0.92,
    loop: true,
    autoAdvance: false,
    intervalMs: 3000,
    pauseOnHover: true,
    showDots: true,
    showControls: true,
    className: '',
  }
);

const emit = defineEmits<{
  (e: 'changeIndex', index: number, item: CardStackItem): void;
}>();

const active = ref(wrapIndex(props.initialIndex, props.items.length));
const hovering = ref(false);
const dragOffsetX = ref(0);
const isDragging = ref(false);
let startX = 0;
let timerId: number | null = null;

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i: number, activeIdx: number, len: number, loop: boolean) {
  const raw = i - activeIdx;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

const len = computed(() => props.items.length);
const maxOffset = computed(() => Math.max(0, Math.floor(props.maxVisible / 2)));
const cardSpacing = computed(() => Math.max(10, Math.round(props.cardWidth * (1 - props.overlap))));
const stepDeg = computed(() => (maxOffset.value > 0 ? props.spreadDeg / maxOffset.value : 0));

watch(
  () => props.items.length,
  (newLen) => {
    active.value = wrapIndex(active.value, newLen);
  }
);

watch(active, (newActive) => {
  if (props.items[newActive]) {
    emit('changeIndex', newActive, props.items[newActive]);
  }
});

function setActive(idx: number) {
  if (!len.value) return;
  active.value = wrapIndex(idx, len.value);
}

function prev() {
  if (!len.value) return;
  if (!props.loop && active.value <= 0) return;
  setActive(active.value - 1);
}

function next() {
  if (!len.value) return;
  if (!props.loop && active.value >= len.value - 1) return;
  setActive(active.value + 1);
}

function handleCardClick(i: number) {
  if (isDragging.value) return;
  setActive(i);
}

// Geometry & state calculation for card i
function getCardState(i: number) {
  const off = signedOffset(i, active.value, len.value, props.loop);
  const abs = Math.abs(off);
  const visible = abs <= maxOffset.value;
  const isActive = off === 0;
  const z = -abs * props.depthPx;

  return { off, abs, visible, isActive, z };
}

function getCardStyle(i: number) {
  const { off, abs, isActive, z } = getCardState(i);

  const rotateZ = off * stepDeg.value;
  let x = off * cardSpacing.value;

  // Apply live drag offset to active card
  if (isActive && isDragging.value) {
    x += dragOffsetX.value;
  }

  const y = abs * 12; // subtle arc
  const scale = isActive ? props.activeScale : props.inactiveScale;
  const lift = isActive ? -props.activeLiftPx : 0;
  const rotateX = isActive ? 0 : props.tiltXDeg;
  const zIndex = 100 - abs;

  return {
    width: `${props.cardWidth}px`,
    height: `${props.cardHeight}px`,
    zIndex,
    transformStyle: 'preserve-3d' as const,
    transform: `translateX(${x}px) translateY(${y + lift}px) translateZ(${z}px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
  };
}

// Drag & Swipe Logic
function startDrag(e: MouseEvent) {
  isDragging.value = true;
  startX = e.clientX;
  dragOffsetX.value = 0;

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return;
  dragOffsetX.value = e.clientX - startX;
}

function onMouseUp() {
  if (!isDragging.value) return;
  const threshold = Math.min(120, props.cardWidth * 0.22);
  if (dragOffsetX.value > threshold) {
    prev();
  } else if (dragOffsetX.value < -threshold) {
    next();
  }
  dragOffsetX.value = 0;
  isDragging.value = false;
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
}

function startTouch(e: TouchEvent) {
  if (!e.touches[0]) return;
  isDragging.value = true;
  startX = e.touches[0].clientX;
  dragOffsetX.value = 0;

  window.addEventListener('touchmove', onTouchMove);
  window.addEventListener('touchend', onTouchEnd);
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value || !e.touches[0]) return;
  dragOffsetX.value = e.touches[0].clientX - startX;
}

function onTouchEnd() {
  if (!isDragging.value) return;
  const threshold = Math.min(120, props.cardWidth * 0.22);
  if (dragOffsetX.value > threshold) {
    prev();
  } else if (dragOffsetX.value < -threshold) {
    next();
  }
  dragOffsetX.value = 0;
  isDragging.value = false;
  window.removeEventListener('touchmove', onTouchMove);
  window.removeEventListener('touchend', onTouchEnd);
}

// Autoplay logic
onMounted(() => {
  if (props.autoAdvance) {
    timerId = window.setInterval(() => {
      if (props.pauseOnHover && hovering.value) return;
      if (isDragging.value) return;
      next();
    }, Math.max(800, props.intervalMs));
  }
});

onUnmounted(() => {
  if (timerId !== null) clearInterval(timerId);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('touchmove', onTouchMove);
  window.removeEventListener('touchend', onTouchEnd);
});
</script>
