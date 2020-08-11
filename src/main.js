import Vue from 'vue'
import App from './App'

import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store
// 正式： http://wy.962460.com
// test: http://tt.962460.com
Vue.prototype.$filePrefix = 'http://tt.962460.com'

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
