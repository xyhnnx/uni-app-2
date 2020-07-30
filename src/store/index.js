import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		primaryColor: '#fb7349',
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: true,
		hasLogin: false,
		userName: "",
		userInfo: {},
		serviceTypeList: [{label: '报修',value:1},{label: '投诉',value:2}],
		// 用戶管理所有room
		roomList: [{"roomId":361111,"roomName":"1栋1单元301","courtId":619,"courtName":"沃得雅苑","companyId":162,"companyName":"江苏百事帮物业服务有限公司"}],
		// 当前room
		currentRoom: {"roomId":361111,"roomName":"1栋1单元301","courtId":619,"courtName":"沃得雅苑","companyId":162,"companyName":"江苏百事帮物业服务有限公司"}
	},
	mutations: {
		async setUserInfo(state, data) {
			console.log(data,'data')
			state.userInfo = data || {}
		},
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
