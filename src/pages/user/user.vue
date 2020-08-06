<template>
	<view class="content padding0" v-if="roomList && roomList.length">
		<view class="logo" @click="toUserDetail('/pages/user/user-detail')" :hover-class="!userInfo.isLogin ? 'logo-hover' : ''">
			<image class="logo-img" :src="userInfo.avatarUrl ? getImgSrc(userInfo.avatarUrl) :avatarUrl"></image>
			<view class="logo-title">
				<view class="uer-name">{{userInfo.nickName ? userInfo.nickName : '暂无用户信息'}}
					<!--<button class="get-user-button" @getuserinfo="getUserInfo" open-type="getUserInfo">点击获取用户信息</button>-->
				</view>
				<view class="phone-number">手机号：{{userInfo.phoneNumber || '无'}}</view>
			</view>
		</view>
		<view class="height10"></view>
		<view class="height10"></view>
		<!-- 包含图片 -->
		<uni-list>
			<uni-list-item title="我的缴费"
						   @click="toDetail('/pages/pay/pay-list')"
						   :show-arrow="true"
						   thumb="/static/img/jiaofei.png">
				<template v-slot:right="">
				</template>
			</uni-list-item>
			<uni-list-item title="我的报修投诉"
						   @click="toDetail('/pages/repair/repair-list')"
						   :show-arrow="true"
						   thumb="/static/img/weixiu.png">
				<template v-slot:right="">
				</template>
			</uni-list-item>
			<uni-list-item title="我的房产"
						   @click="toDetail('/pages/user/user-detail-room')"
						   :show-arrow="true"
						   thumb="/static/img/fangchan.png">
				<template v-slot:right="">
				</template>
			</uni-list-item>
			<uni-list-item title="我的订单"
						   class="my-list-item"
						   @click="toDetail('/pages/building/building')"
						   :show-arrow="true"
						   thumb="/static/img/dingdan.png">
				<template v-slot:right="">
				</template>
			</uni-list-item>
		</uni-list>
	</view>
	<view v-else class="common-no-data-box">
		<no-data text="请扫码房产二维码"></no-data>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import * as api from '../../api/api'
	import * as common from '../../common/common'
	import ChangeRoomBtn from '../../common/change-room-btn'
	import NoData from '../../components/my-components/no-data'

	export default {
		components: {
			ChangeRoomBtn,
			NoData
		},
		data() {
			return {
				avatarUrl: '/static/logo.png',
				background: ['color1', 'color2', 'color3'],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500
			}
		},
		computed: mapState(['forcedLogin', 'hasLogin', 'userName', 'roomList','currentRoom','userInfo']),
		watch: {
		},
		methods: {
			...mapMutations(['setStateData']),
			getUserInfo (e) {
				console.log(e)
			},
			getImgSrc (src = '') {
				if(src && src.startsWith('http')) {
					return src
				} else {
					return `${this.$filePrefix}/${src.slice(1)}`
				}
			},
			scanningCode() {
				console.log('scanningCodescanningCode')
				// 允许从相机和相册扫码
				uni.scanCode({
					success: async function (res) {
						console.log('uni.scanCode', res)
						let res2 = await common.login({
							RoomId: res.result,
							EncryptedDataStr: getApp().globalData.encryptedData,
							IV: getApp().globalData.iv
						})
						console.log('common.login', res2)
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
						}
					},
					fail() {
						uni.showModal({
							title: '提示',
							content: '扫码失败；请重试',
							showCancel: false
						});
					}
				});
			},
			toDetail (url) {
				console.log(url)
				//在起始页面跳转到test.vue页面并传递参数
				uni.navigateTo({
					url
				});
			},
			async toUserDetail (url) {
				if(!this.userInfo.nickName) {
					let res = await common.getUserInfo()
				} else {
					//在起始页面跳转到test.vue页面并传递参数
					uni.navigateTo({
						url
					});
				}
			}
		},
		onShow() {
			common.getUserInfo()
		}
	}
</script>

<style lang="scss" scoped>
	.get-user-button {
		background-color: transparent;
		border: none;
		padding: 0;
		display: inline;
	}
	.padding0 {
		padding: 0;
	}
	.phone-number {
		color: #fff
	}
	.height0 {
		height: 0;

		.background-primary {
			height: 130px;
			background-color: $uni-color-primary;
		}
	}

	.swiper {
		border-radius: 10px;
		overflow: hidden;
		background-color: #fff;
		.swiper-item {
			.img {
				width: 100%;
				display: block;
			}
		}
	}

	.content-box {
		padding: 10px;
	}

	.panel-section {
		padding: 10px;
		display: flex;
		align-items: center;
		background-color: #fff;
		.split{
			width: 1px;
			height: 70px;
			background-color: $uni-border-color;
		}
		.item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			.img {
				width: 50px;
				height: 50px;
				margin-right: 5px;
			}
		}
	}
	.panel-title {
		font-weight: bold;
	}



	/* 个人中心 */

	.logo {
		padding-top: 20px;
		display: flex;
		height: 210px;
		width: 100%;
		flex-direction: column;
		box-sizing: border-box;
		background-color: $uni-color-primary;
		align-items: center;
		.logo-img {
			width: 100px;
			height: 100px;
			border-radius: 50%;
			border: 2px solid #fff;
		}
		.logo-title {
			display: block;
			text-align: center;
			color: #fff;
			.uer-name {
				font-size: 16px;
				line-height: 40px;
			}
			.phone-number {
				font-size: 14px;
			}
		}
	}

	.logo-hover {
		opacity: 0.8;
	}


	.go-login.navigat-arrow {
		font-size: 38upx;
		color: #FFFFFF;
	}


	.center-list {
		background-color: #FFFFFF;
		margin-top: 20upx;
		width: 750upx;
		flex-direction: column;
	}

	.center-list-item {
		height: 90upx;
		width: 750upx;
		box-sizing: border-box;
		flex-direction: row;
		padding: 0upx 20upx;
	}

	.border-bottom {
		border-bottom-width: 1upx;
		border-color: #c8c7cc;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 40upx;
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #FF80AB;
		text-align: center;
		font-family: texticons;
		margin-right: 20upx;
	}

	.list-text {
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		height: 90upx;
		width: 40upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}


</style>
