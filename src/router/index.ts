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
    { path: '/admin/pages', name: 'admin-pages', component: () => import('../views/admin/AdminItemsView.vue'), props: { type: 'page', title: '页面' } },
    { path: '/admin/links', name: 'admin-links', component: () => import('../views/admin/AdminItemsView.vue'), props: { type: 'link', title: '导航链接' } },
    { path: '/admin/guides', name: 'admin-guides', component: () => import('../views/admin/AdminItemsView.vue'), props: { type: 'guide', title: '指南' } },
    { path: '/admin/projects', name: 'admin-projects', component: () => import('../views/admin/AdminItemsView.vue'), props: { type: 'project', title: '项目' } },
    { path: '/admin/categories', name: 'admin-categories', component: () => import('../views/admin/AdminItemsView.vue'), props: { type: 'category', title: '分类' } },
    { path: '/admin/banners', name: 'admin-banners', component: () => import('../views/admin/AdminItemsView.vue'), props: { type: 'banner', title: '轮播' } },
    { path: '/admin/media', name: 'admin-media', component: () => import('../views/admin/AdminMediaView.vue') },
    { path: '/admin/review', name: 'admin-review', component: () => import('../views/admin/AdminReviewView.vue') },
    { path: '/admin/publish-events', name: 'admin-publish-events', component: () => import('../views/admin/AdminReviewView.vue') },
    { path: '/admin/users', name: 'admin-users', component: () => import('../views/admin/AdminUsersView.vue') },
    { path: '/admin/items/new', name: 'admin-item-new', component: () => import('../views/admin/AdminNewItemView.vue') },
    { path: '/admin/items/:id', name: 'admin-item-editor', component: () => import('../views/admin/AdminEditorView.vue') },
    { path: '/guides/:slug', name: 'guide', component: () => import('../views/GuideView.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})
