import Vue from 'vue'
import App from './App'

import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$filePrefix = 'http://wy.962460.com'

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
