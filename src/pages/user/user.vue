<template>
	<view class="content padding0">
		<view class="logo" @click="toUserDetail('/pages/user/user-detail')" :hover-class="!userInfo.isLogin ? 'logo-hover' : ''">
			<image class="logo-img" :src="userInfo.avatarUrl ? getImgSrc(userInfo.avatarUrl) :avatarUrl"></image>
			<view class="logo-title">
				<view>
					<view class="uer-name">Hi，{{userInfo.nickName ? userInfo.nickName : '您未登录'}}</view>
					<view class="phone-number">手机号：{{userInfo.phoneNumber || '无'}}</view>
				</view>
				<text class="go-login navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="height0">
			<view class="background-primary"></view>
		</view>
		<view class="content-box">

			<view class="height10"></view>
			<view class="card-box">
				<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
						:duration="duration">
					<swiper-item>
						<view class="swiper-item">
							<image mode="scaleToFill" class="img" src="../../static/img/banner1.png" alt=""/>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<image mode="scaleToFill" class="img" src="../../static/img/banner1.png" alt=""/>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view class="height10"></view>

			<view class="height10"></view>
			<view class="card-box panel-section">
				<view class="item" @click="toDetail('/pages/pay/pay-list')">
					<view>
						<image mode="aspectFit" class="img" src="../../static/img/image.png" alt=""/>
					</view>
					<view>我的缴费</view>
				</view>
				<view class="split"></view>
				<view class="item" @click="toDetail('/pages/repair/repair-list')">
					<view>
						<image mode="aspectFit" class="img" src="../../static/img/oval-image.png" alt=""/>
					</view>
					<view>我的报修投诉</view>
				</view>
			</view>
			<view class="height10"></view>

			<view class="card-box panel-section">
                <view class="item" @click="toDetail('/pages/user/user-detail-room')">
                    <view>
                        <image mode="aspectFit" class="img" src="../../static/img/image.png" alt=""/>
                    </view>
                    <view>我的房产</view>
                </view>
                <view class="split"></view>
                <!--<view class="item" @click="toDetail('/pages/repair/repair-list')">-->
                    <!--<view>-->
                        <!--<image mode="aspectFit" class="img" src="../../static/img/oval-image.png" alt=""/>-->
                    <!--</view>-->
                    <!--<view></view>-->
                <!--</view>-->
            </view>
			<view class="height10"></view>
		</view>
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

	export default {
		components: {
			ChangeRoomBtn
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
			getImgSrc (src = '') {
				if(src.startsWith('http')) {
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
		onLoad() {
			// if (!this.hasLogin) {
			// 	uni.showModal({
			// 		title: '未登录',
			// 		content: '您未登录，需要登录后才能继续',
			// 		/**
			// 		 * 如果需要强制登录，不显示取消按钮
			// 		 */
			// 		showCancel: !this.forcedLogin,
			// 		success: (res) => {
			// 			if (res.confirm) {
			// 				/**
			// 				 * 如果需要强制登录，使用reLaunch方式
			// 				 */
			// 				if (this.forcedLogin) {
			// 					uni.reLaunch({
			// 						url: '../login/login'
			// 					});
			// 				} else {
			// 					uni.navigateTo({
			// 						url: '../login/login'
			// 					});
			// 				}
			// 			}
			// 		}
			// 	});
			// }
		}
	}
</script>

<style lang="scss" scoped>
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
		display: flex;
		width: 750upx;
		height: 240upx;
		padding: 20upx;
		box-sizing: border-box;
		background-color: $uni-color-primary;
		flex-direction: row;
		align-items: center;
	}

	.logo-hover {
		opacity: 0.8;
	}

	.logo-img {
		width: 150upx;
		height: 150upx;
		border-radius: 150upx;
	}

	.logo-title {
		height: 150upx;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		margin-left: 20upx;
		display: flex;
	}

	.uer-name {
		height: 60upx;
		line-height: 60upx;
		font-size: 38upx;
		color: #FFFFFF;
	}

	.go-login.navigat-arrow {
		font-size: 38upx;
		color: #FFFFFF;
	}

	.login-title {
		height: 150upx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20upx;
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
