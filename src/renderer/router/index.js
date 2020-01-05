import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 路由数据
import routes from './router'

// 导出路由 在 main.js 里使用
const router = new VueRouter({
    routes
})

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
    // const noNeedLogin = ['login','register'];
    // if (noNeedLogin.find( item => {return item == to.name}) && store.state.user) {
    //     next({name: 'admin'})
    // }
    next()
})

export default router
