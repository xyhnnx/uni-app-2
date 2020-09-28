<!--缴费账单-->
<template>
	<view class="content">
		<view class="content-box">
			<view class="item" @click="chooseImg">
				<view class="label">头像</view>
				<view class="value">
					<image class="logo-img" :src="!!userInfo.avatarUrl ? getImgSrc(userInfo.avatarUrl) :avatarUrl"></image>
					<text class="go-login navigat-arrow">&#xe65e;</text>
				</view>

			</view>
			<view class="item" @click="toDetail('/pages/user/user-detail-name')">
				<view class="label">昵称</view>
				<view class="value">
					<text>{{userInfo.nickName || ''}}</text>
					<text class="go-login navigat-arrow">&#xe65e;</text>
				</view>
			</view>
			<view class="item" @click="toDetail('/pages/user/user-detail-sex')">
				<view class="label">性别</view>
				<view class="value">
					<text>{{showGender(userInfo.gender)}}</text>
					<text class="go-login navigat-arrow">&#xe65e;</text>

				</view>
			</view>
			<view class="item">
				<view class="label">手机号</view>
				<view class="value">
					<text>{{userInfo.phoneNumber || '无'}}</text>
					<text class="go-login navigat-arrow"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as api from '../../api/api'
	import * as common from '../../common/common'
	import * as util from '../../common/util'
	import UniSegmentedControl from '../../components/uni-segmented-control/uni-segmented-control'
	import UniList from '../../components/uni-list/uni-list'
	import UniListItem from '../../components/uni-list-item/uni-list-item'
	import NoData from '../../components/my-components/no-data'
	import ChangeRoomBtn from '../../common/change-room-btn'
	import uniCollapse from '../../components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '../../components/uni-collapse-item/uni-collapse-item.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			UniSegmentedControl,
			UniList,
			UniListItem,
			ChangeRoomBtn,
			NoData,
			uniCollapse,
			uniCollapseItem
		},
		computed: {
			...mapState(['primaryColor', 'serviceTypeList', 'userInfo', 'userName', 'roomList', 'currentRoom']),
		},
		data() {
			return {
				detail: {},
			}
		},
		methods: {
			...mapMutations(['setStateData']),
			showGender (val) {
				return val === 1? '男': '女'
			},
			getImgSrc (src = '') {
				if(src.startsWith('http')) {
					return src
				} else {
					return `${this.$filePrefix}/${src.slice(1)}`
				}
			},
			toDetail (url) {
				//在起始页面跳转到test.vue页面并传递参数
				uni.navigateTo({
					url
				});
			},
			chooseImg () {
				uni.chooseImage({
					count: 1,
					success: async (res) => {
						let res2 = await common.uploadFileItem(res.tempFilePaths[0])
						let data = {
							...this.userInfo,
							avatarUrl: res2
						}

						let res3 = await common.updateUserInfo(data)
						if(res3 && res3.success) {
							uni.showToast({
								icon: 'none',
								title: '修改成功！'
							});
						}
					}
				});
			},
		},
		async onShow(e) {
			await common.getUserInfo()
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
	.logo-img {
		width: 80upx;
		height: 80upx;
		border-radius: 80upx;
	}
	.go-login {
		color: #333;
	}
</style>
