<template>
	<view class="content">
		<view class="content-box">
			<view class="item" v-for="(item, index) in roomList" :key="item.value" :data-index="index" @click="itemClick">
				<view class="label" >
					{{item.courtName}} {{item.roomName}}
				</view>
				<view class="value"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import * as common from '../../common/common'
	import * as api from '../../api/api'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import mInput from '../../components/m-input.vue'

	export default {
		components: {
			mInput
		},
		data() {
			return {
			}
		},
		computed: mapState(['userInfo','roomList', 'currentRoom']),
		methods: {
			...mapMutations(['setStateData']),

			itemClick (e) {
				let index = e.currentTarget.dataset.index
				let item = this.roomList[index]
				uni.showModal({
					title: '提示',
					content: '确定删除该房产？',
					success: async (res) => {
						if (res.confirm) {
							let res = await api.deleteUserRoomInfo({
								roomId: item.roomId
							})
							if(res.success) {
								uni.showToast({
									icon: 'none',
									title: '删除成功！'
								});
								this.login(item)
							}
						} else if (res.cancel) {
						}
					}
				});
			},
			async login (item) {
				uni.showLoading({
					title: '请稍后'
				});
				// // 获取微信code
				await common.wxLogin()
				// 获取用户信息
				let res2 = await common.login({
					Code: getApp().globalData.code,
				})
				uni.hideLoading()
				if (!res2.success) {
					if (res2.errorCode === '1005') { // 请扫描房产二维码
						uni.showModal({
							title: '提示',
							content: res2.errorMessage,
							showCancel: false,
							success: function (res3) {
								if (res3.confirm) {
									console.log('用户点击确定');
								} else if (res3.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					}
				} else {
					uni.setStorageSync('jwtToken', res2.data.jwtToken)
					this.setStateData({
						'roomList': res2.data.roomInfos || [],
					})
					// 如果删除是当前room
					if(this.currentRoom.roomId === item.roomId) {
						this.setStateData({
							'currentRoom': res2.data.roomInfos && res2.data.roomInfos[0]
						})
					}
				}
			},
		},
		onReady() {

		}
	}
</script>

<style scoped lang="scss">
	.content-box {
		background-color: #fff;
		margin-top: 5px;
		padding: 0 10px;
		.item{
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid $uni-border-color;
			line-height: 48px;
			.label{
				color: #333;
			}
			.value{
				color: #666;
				display: flex;
				align-items: center;
				.go-login {
					margin-left: 5px;
				}
			}
			.red{
				color: red;
			}
		}
	}
</style>
