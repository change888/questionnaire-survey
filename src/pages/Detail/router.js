import component from './Detail.vue';

let router = [
  {
    path: '/Detail/:id&:fromPage',
    name: 'Detail',
    component: component,
    meta: { 
      keepAlive: true // 需要被缓存
    }
  }
]

export default router;