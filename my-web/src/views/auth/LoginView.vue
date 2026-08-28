<template>
  <div class="min-h-[75vh] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md bg-white p-8 sm:p-10 border border-neutral-200/80 shadow-xl space-y-6 rounded-3xl">
      
      <div class="text-center space-y-3">
        <div class="flex justify-center">
          <BrightEyesLogo />
        </div>
        <h2 class="text-2xl font-bold text-neutral-900 tracking-tight">Sign In to BrightEyes</h2>
        <p class="text-xs text-neutral-500 font-normal">Access your store dashboard or customer profile</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-neutral-700 mb-1">Username or Phone</label>
          <input
            v-model="usernameOrPhone"
            type="text"
            required
            placeholder="Username, email, or phone number"
            class="w-full text-xs p-3.5 bg-neutral-50 border border-neutral-200 font-medium focus:bg-white focus:border-indigo-600 focus:outline-none rounded-xl transition-colors"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-neutral-700 mb-1">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="••••••••"
              class="w-full text-xs p-3.5 pr-10 bg-neutral-50 border border-neutral-200 font-medium focus:bg-white focus:border-indigo-600 focus:outline-none rounded-xl transition-colors"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
              :title="showPassword ? 'Hide password' : 'Show password'"
            >
              <EyeOff v-if="showPassword" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3.5 bg-neutral-900 hover:bg-indigo-600 text-white font-semibold text-xs rounded-full transition-colors shadow-xs"
        >
          {{ loading ? 'Signing in...' : 'Sign In to BrightEyes' }}
        </button>
      </form>

      <div class="text-center text-xs text-neutral-500 font-normal">
        Don't have an account?
        <router-link to="/register" class="font-semibold text-indigo-600 hover:underline">Register Now</router-link>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import BrightEyesLogo from '@/components/BrightEyesLogo.vue';
import { Eye, EyeOff } from 'lucide-vue-next';

const auth = useAuthStore();
const router = useRouter();

const usernameOrPhone = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);

async function handleLogin() {
  loading.value = true;
  try {
    await auth.login({ email: usernameOrPhone.value, password: password.value });
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
