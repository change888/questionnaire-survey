import component from './Home.vue';

let router = [
  {
    path: '/Home',
    name: 'Home',
    component: component
  },
  {
    path: '/',
    redirect: {
      name: 'Home'
    }
  }
]

export default router;