<template>
  <div class="min-h-[75vh] flex items-center justify-center px-4 py-12 rounded-none">
    <div class="w-full max-w-md bg-white p-8 sm:p-10 border border-slate-900 shadow-xl space-y-6 rounded-none">
      
      <div class="text-center space-y-3">
        <div class="flex justify-center">
          <BrightEyesLogo />
        </div>
        <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tight">Create Customer Account</h2>
        <p class="text-xs text-slate-500 uppercase tracking-wider font-medium">Join BrightEyes to save prescriptions and track orders</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-[10px] font-extrabold text-slate-900 uppercase tracking-widest mb-1">Full Name</label>
          <input
            v-model="name"
            type="text"
            required
            placeholder="Jane Doe"
            class="w-full text-xs p-3 bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:border-slate-900 rounded-none"
          />
        </div>

        <div>
          <label class="block text-[10px] font-extrabold text-slate-900 uppercase tracking-widest mb-1">Email Address</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="jane@example.com"
            class="w-full text-xs p-3 bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:border-slate-900 rounded-none"
          />
        </div>

        <div>
          <label class="block text-[10px] font-extrabold text-slate-900 uppercase tracking-widest mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            placeholder="••••••••"
            class="w-full text-xs p-3 bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:border-slate-900 rounded-none"
          />
        </div>

        <div>
          <label class="block text-[10px] font-extrabold text-slate-900 uppercase tracking-widest mb-1">Phone Number (Optional)</label>
          <input
            v-model="phone"
            type="text"
            placeholder="+1 555 019 2831"
            class="w-full text-xs p-3 bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:border-slate-900 rounded-none"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 bg-slate-900 hover:bg-sky-600 text-white font-black text-xs uppercase tracking-widest transition-all rounded-none"
        >
          {{ loading ? 'Creating Account...' : 'Register Account' }}
        </button>
      </form>

      <div class="text-center text-xs text-slate-500 uppercase tracking-wider font-bold">
        Already have an account?
        <router-link to="/login" class="font-black text-sky-600 hover:underline">Sign In</router-link>
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

const name = ref('');
const email = ref('');
const password = ref('');
const phone = ref('');
const loading = ref(false);

async function handleRegister() {
  loading.value = true;
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      phone: phone.value,
    });
    router.push('/');
  } catch (err: any) {
    alert(err.message || 'Registration failed');
  } finally {
    loading.value = false;
  }
}
</script>
