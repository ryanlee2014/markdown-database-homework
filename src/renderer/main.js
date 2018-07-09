import Vue from 'vue'
import axios from 'axios'

import App from './App'
import mavonEditor from "mavon-editor"
import 'mavon-editor/dist/css/index.css'
import "semantic-ui-offline/semantic.min.css";

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(mavonEditor)
/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
