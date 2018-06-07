import component from './Contact.vue';

let router = [
  {
    path: '/Contact',
    name: 'Contact',
    component: component,
    meta: { 
      keepAlive: true // 需要被缓存
    }
  }
]

export default router;