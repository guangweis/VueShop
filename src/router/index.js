import { createRouter, createWebHashHistory,createWebHistory } from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'
import welcome from '../views/welcome'
import userList from '../views/user/UserList'
import categories from '../views/shops/categories'
import goods from '../views/shops/goods'
import params from '../views/shops/params'
import roles from '../views/roles/roles'
import right from '../views/roles/right'
import orders from '../views/order/orders'
import reports from '../views/reports/reports'
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
  component:home,
  redirect: '/welcome',
  children:[
    
    {
      path:'/welcome',
      component:welcome,
      

    },
    {
      path:'/users',
      component:userList
    },
    {
      path:'/roles',
      component:roles
    },
    {
      path:'/categories',
      component:categories
    },
    {
      path:'/goods',
      component:goods
    },
    {
      path:'/params',
      component:params
    },
    {
      path:'/rights',
      component:right
    },
    {
      path:'/orders',
      component:orders
    },
    {
      path:'/reports',
      component:reports
    }
  ]
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
  window.sessionStorage.setItem('activate',to.path)
  next()
  
})
export default router
