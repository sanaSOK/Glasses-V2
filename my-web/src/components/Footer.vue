<template>
  <footer class="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800/80 w-full mt-16">
    <div class="w-full max-w-7xl mx-auto px-6 sm:px-12 py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <BrightEyesLogo />
          </div>
          <p class="text-neutral-400 text-xs leading-relaxed font-normal">
            BrightEyes multi-store optical platform. High precision lens technology, doctor prescription fitting, and independent boutique network.
          </p>
        </div>

        <div>
          <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-5">Navigation</h4>
          <ul class="space-y-2.5 font-medium text-xs text-neutral-400">
            <li><router-link to="/shop" class="hover:text-white transition-colors">Prescription Glasses</router-link></li>
            <li><router-link to="/shop?gender=SUNGLASSES" class="hover:text-white transition-colors">Designer Sunglasses</router-link></li>
            <li><router-link to="/stores" class="hover:text-white transition-colors">Partner Boutiques</router-link></li>
            <li><router-link to="/prescriptions" class="hover:text-white transition-colors">Optical Prescriptions</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-5">Contact & Support</h4>
          <ul class="space-y-2.5 font-medium text-xs text-neutral-400">
            <li class="flex items-center gap-2.5"><Phone class="w-4 h-4 text-indigo-400" /> 1-800-BRIGHT-EYES</li>
            <li class="flex items-center gap-2.5"><Mail class="w-4 h-4 text-indigo-400" /> support@brighteyes.com</li>
            <li class="flex items-center gap-2.5"><MapPin class="w-4 h-4 text-indigo-400" /> BrightEyes Multi-Store NYC</li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-5">BrightEyes Guarantee</h4>
          <p class="text-xs text-neutral-400 leading-relaxed font-normal mb-4">
            Certified multi-tenant store data isolation and 100% UV protection anti-scratch optical coating.
          </p>
          <div class="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
            <ShieldCheck class="w-4 h-4" /> Multi-Tenant Secured
          </div>
        </div>

      </div>

      <div class="border-t border-neutral-900 mt-12 pt-8 text-center text-xs text-neutral-500 font-normal">
        © 2026 BrightEyes Optical Platform. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import BrightEyesLogo from '@/components/BrightEyesLogo.vue';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-vue-next';
</script>
