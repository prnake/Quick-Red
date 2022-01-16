import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: '首页',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'dashboard' } // TODO: icon need replacement
    },
    {
      path: 'authedto/:who',
      name: '重复授权',
      hidden: true,
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/videos',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '作品管理',
        component: () => import('@/views/videolist/index'),
        meta: { title: '作品管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/analyse',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '作品分析',
        component: () => import('@/views/video/index'),
        meta: { title: '作品分析', icon: 'form' }
      }
    ]
  },

  {
    path: '/video',
    component: Layout,
    hidden: true,
    children: [
      {
        path: ':id',
        name: '单作品分析',
        component: () => import('@/views/video/index'),
        meta: { title: '作品分析', icon: 'form' } // TODO: icon need replacement
      }
    ]
  },

  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/index',
    children: [
      {
        path: 'index',
        name: '通知中心',
        component: () => import('@/views/notice/index'),
        meta: { title: '通知中心', icon: 'user' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
