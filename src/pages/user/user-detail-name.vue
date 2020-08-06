<template>
	<view class="content">
		<view class="content-box">
			<view class="item">
				<text class="title">昵称：</text>
				<m-input class="m-input" type="text" clearable focus v-model="nickName" placeholder="请输入昵称"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="bindLogin">提交</button>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import * as common from '../../common/common'
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
				nickName: '',
			}
		},
		computed: mapState(['userInfo']),
		methods: {
			...mapMutations(['login']),
			async bindLogin () {
				let data = {
					...this.userInfo
				}
				let nickName = this.nickName
				if (nickName) {
					data.nickName = nickName
				} else {
					this.nickName = ''
					uni.showToast({
						icon: 'none',
						title: '请输入昵称！'
					});
					return
				}

				let res = await common.updateUserInfo(data)
				if(res.success) {
					uni.showToast({
						icon: 'none',
						title: '修改成功！'
					});
				}
				uni.navigateBack({
					delta: 1
				})
			}

		},
		onLoad() {
			this.nickName = this.userInfo.nickName || ''
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
