import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import './util/fontSize'
import './styles/base.scss'
import './styles/site.scss'
import 'iview/dist/styles/iview.css'

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
