import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/nav', name: 'nav', component: () => import('../views/NavView.vue') },
    { path: '/freshman', name: 'freshman', component: () => import('../views/FreshmanView.vue') },
    { path: '/projects', name: 'projects', component: () => import('../views/ProjectsView.vue') },
    { path: '/contribute', name: 'contribute', component: () => import('../views/ContributeView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/admin', name: 'admin', component: () => import('../views/AdminView.vue') },
    { path: '/guides/:slug', name: 'guide', component: () => import('../views/GuideView.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})
