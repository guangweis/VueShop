import { createRouter, createWebHashHistory,createWebHistory } from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'
// const login =  ()=>import ('../views/login.vue')
const routes = [
  {
    path:'/',
    redirect: '/login'
  },
{
  path:'/login',
  component:login
},
{
  path:'/home',
  component:home
}
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

router.beforeEach((to, from, next) => {
  if (to.path==='/login'){
    next();
  }
  const token = window.sessionStorage.getItem('token')
  if (!token){
    next('/login')
  }
  next()
  
})
export default router
