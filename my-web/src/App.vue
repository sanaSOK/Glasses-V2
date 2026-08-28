<template>
  <div class="min-h-screen flex flex-col bg-neutral-50 font-sans">
    <Navbar v-if="!isAdminRoute" />
    <main class="flex-1 w-full">
      <router-view />
    </main>
    <Footer v-if="!isAdminRoute" />
    <CartDrawer v-if="!isAdminRoute" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import CartDrawer from '@/components/CartDrawer.vue';

const route = useRoute();

const isAdminRoute = computed(() => {
  return (
    route.path.startsWith('/admin') ||
    route.path.startsWith('/store-admin') ||
    !!route.meta?.requiresSuperAdmin ||
    !!route.meta?.requiresStoreAdmin
  );
});
</script>
