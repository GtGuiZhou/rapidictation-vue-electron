import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './common/axios'
// import mock from './common/mock'
import './assets/iconfront/iconfont.css'
// import Viewer from 'v-viewer'
// Vue.use(Viewer);
Vue.config.productionTip = false
Vue.prototype.$http = axios
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
