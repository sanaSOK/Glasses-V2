import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/storefront/HomeView.vue'),
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('@/views/storefront/ShopView.vue'),
  },
  {
    path: '/stores',
    name: 'Stores',
    component: () => import('@/views/storefront/StoresView.vue'),
  },
  {
    path: '/stores/:slug',
    name: 'StorefrontDetail',
    component: () => import('@/views/storefront/StorefrontDetailView.vue'),
  },
  {
    path: '/products/:slug',
    name: 'ProductDetail',
    component: () => import('@/views/storefront/ProductDetailView.vue'),
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/storefront/CartView.vue'),
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/storefront/CheckoutView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
  },
  {
    path: '/my-orders',
    name: 'MyOrders',
    component: () => import('@/views/customer/MyOrdersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/prescriptions',
    name: 'MyPrescriptions',
    component: () => import('@/views/customer/MyPrescriptionsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/favorites',
    name: 'MyFavorites',
    component: () => import('@/views/customer/MyFavoritesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'SuperAdminDashboard',
    component: () => import('@/views/admin/SuperAdminDashboard.vue'),
    meta: { requiresAuth: true, requiresSuperAdmin: true },
  },
  {
    path: '/admin/users',
    name: 'SuperAdminUsers',
    component: () => import('@/views/admin/SuperAdminUsersView.vue'),
    meta: { requiresAuth: true, requiresSuperAdmin: true },
  },
  {
    path: '/admin/stores',
    name: 'SuperAdminStores',
    component: () => import('@/views/admin/SuperAdminStoresView.vue'),
    meta: { requiresAuth: true, requiresSuperAdmin: true },
  },
  {
    path: '/admin/products',
    name: 'SuperAdminProducts',
    component: () => import('@/views/admin/SuperAdminProductsView.vue'),
    meta: { requiresAuth: true, requiresSuperAdmin: true },
  },
  {
    path: '/admin/orders',
    name: 'SuperAdminOrders',
    component: () => import('@/views/admin/SuperAdminOrdersView.vue'),
    meta: { requiresAuth: true, requiresSuperAdmin: true },
  },
  {
    path: '/admin/prescriptions',
    name: 'SuperAdminPrescriptions',
    component: () => import('@/views/admin/SuperAdminPrescriptionsView.vue'),
    meta: { requiresAuth: true, requiresSuperAdmin: true },
  },
  {
    path: '/store-admin',
    name: 'StoreAdminDashboard',
    component: () => import('@/views/store-admin/StoreAdminDashboard.vue'),
    meta: { requiresAuth: true, requiresStoreAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'Login' });
  }
  if (to.meta.requiresSuperAdmin && !auth.isSuperAdmin) {
    return next({ name: 'Home' });
  }
  if (to.meta.requiresStoreAdmin && !auth.isStoreAdmin) {
    return next({ name: 'Home' });
  }
  next();
});

export default router;
