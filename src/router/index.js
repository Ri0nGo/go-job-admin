import { createRouter, createWebHashHistory } from 'vue-router'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      children: [
        {
          path: '/jobs',
          name: 'jobs',
          component: () => import('@/components/jobs/JobList.vue')
        },
        {
            path: '/nodes',
            name: 'nodes',
            component: () => import('@/components/nodes/NodeList.vue')
          },
          {
            path: '/users',
            name: 'users',
            component: () => import('@/components/users/UserList.vue')
          }
      ]
    },
    {
      path: '/login',
      name: 'Login', 
      component: () => import('@/views/Login.vue')
    }
  ]
})

export default router