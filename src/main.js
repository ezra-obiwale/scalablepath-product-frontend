import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const axios = require('axios')

Vue.prototype.$axios = axios.create({
  baseURL: process.env.VUE_APP_API_URL
})

Vue.config.productionTip = false
Vue.use(BootstrapVue)

new Vue({
  render: h => h(App),
}).$mount('#app')
