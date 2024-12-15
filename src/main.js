import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
import './assets/style/main.scss'
import Vuetify from 'vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css';


Vue.use(Vuetify)


new Vue({
  store,
  router,
  vuetify: new Vuetify({
    icons: {
      iconfont: 'mdi', // используйте 'mdi' для Material Design Icons
    },
  }),
  render: h => h(App)
}).$mount('#app')
