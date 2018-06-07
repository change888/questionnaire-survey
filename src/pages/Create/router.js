import component from './Create.vue';

let router = [
  {
    path: '/Create',
    name: 'Create',
    component: component,
    meta: { 
      keepAlive: true // 需要被缓存
    }
  }
]

export default router;