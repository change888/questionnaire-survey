import component from './List.vue';

let router = [
  {
    path: '/List',
    name: 'List',
    component: component,
    meta: { 
      keepAlive: true // 需要被缓存
    }
  }
]

export default router;