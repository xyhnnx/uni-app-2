import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: true,
		hasLogin: false,
		userName: "",
		// 用戶管理所有room
		roomList: [],
		// 当前room
		currentRoom: {"roomId":361111,"roomName":"1栋1单元301","courtId":619,"courtName":"沃得雅苑","companyId":162,"companyName":"江苏百事帮物业服务有限公司"}
	},
	mutations: {
		login(state, userName) {
			state.userName = userName || '新用户';
			state.hasLogin = true;
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
		},
		setStateData (state, obj = {}) {
			Object.keys(obj).forEach(key => {
				state[key] = obj[key]
			})
		}
	}
})

export default store
