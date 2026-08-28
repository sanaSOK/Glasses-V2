<template>
  <div class="min-h-screen flex flex-col bg-white font-sans rounded-none m-0 p-0">
    <Navbar />
    <main class="flex-1 w-full">
      <router-view />
    </main>
    <Footer />
    <CartDrawer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import CartDrawer from '@/components/CartDrawer.vue';
</script>
