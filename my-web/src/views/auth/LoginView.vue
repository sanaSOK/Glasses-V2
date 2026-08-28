<template>
  <div class="min-h-[75vh] flex items-center justify-center px-4 py-12 rounded-none">
    <div class="w-full max-w-md bg-white p-8 sm:p-10 border border-slate-900 shadow-xl space-y-6 rounded-none">
      
      <div class="text-center space-y-3">
        <div class="flex justify-center">
          <BrightEyesLogo />
        </div>
        <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tight">Sign In to BrightEyes</h2>
        <p class="text-xs text-slate-500 uppercase tracking-wider font-medium">Access your store dashboard or customer profile</p>
      </div>

      <!-- Quick Demo Account Fillers -->
      <div class="bg-slate-50 p-4 border border-slate-300 space-y-2 text-xs rounded-none">
        <div class="font-extrabold text-slate-900 text-[10px] uppercase tracking-wider">Demo Accounts (Password: password123):</div>
        <div class="flex flex-wrap gap-1.5">
          <button @click="fillCreds('superadmin@system.com')" type="button" class="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-400 text-[10px] font-extrabold uppercase rounded-none">Super Admin</button>
          <button @click="fillCreds('admin@sana-optical.com')" type="button" class="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-400 text-[10px] font-extrabold uppercase rounded-none">SANA Admin</button>
          <button @click="fillCreds('customer1@example.com')" type="button" class="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-400 text-[10px] font-extrabold uppercase rounded-none">Customer</button>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-[10px] font-extrabold text-slate-900 uppercase tracking-widest mb-1">Email Address</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="admin@sanaoptical.com"
            class="w-full text-xs p-3 bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:border-slate-900 rounded-none"
          />
        </div>

        <div>
          <label class="block text-[10px] font-extrabold text-slate-900 uppercase tracking-widest mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full text-xs p-3 bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:border-slate-900 rounded-none"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 bg-slate-900 hover:bg-sky-600 text-white font-black text-xs uppercase tracking-widest transition-all rounded-none"
        >
          {{ loading ? 'Signing in...' : 'Sign In to BrightEyes' }}
        </button>
      </form>

      <div class="text-center text-xs text-slate-500 uppercase tracking-wider font-bold">
        Don't have an account?
        <router-link to="/register" class="font-black text-sky-600 hover:underline">Register Now</router-link>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import BrightEyesLogo from '@/components/BrightEyesLogo.vue';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);

function fillCreds(demoEmail: string) {
  email.value = demoEmail;
  password.value = 'password123';
}

async function handleLogin() {
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value });
    if (auth.isSuperAdmin) {
      router.push('/admin');
    } else if (auth.isStoreAdmin) {
      router.push('/store-admin');
    } else {
      router.push('/');
    }
  } catch (err: any) {
    alert(err.message || 'Invalid credentials');
  } finally {
    loading.value = false;
  }
}
</script>
