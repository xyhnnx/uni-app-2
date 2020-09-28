<template>
	<view class="content">
		<view class="content-box">
			<radio-group @change="radioChange">
				<label class="item" v-for="(item, index) in items" :key="item.value">
					<view class="label">
						<radio :value="item.value" :checked="item.value === userInfo.gender" />
					</view>
					<view class="value">{{item.name}}</view>
				</label>
			</radio-group>
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
				currentSex: '',
				items: [
					{
						value: 1,
						name: '男',
						checked: false
					},
					{
						value: 2,
						name: '女',
						checked: false
					},
					]

			}
		},
		computed: mapState(['userInfo']),
		methods: {
			...mapMutations(['login']),
			radioChange (val) {
				console.log(val)
				this.currentSex = Number(val.detail.value)
			},
			async bindLogin () {
				let data = {
					...this.userInfo
				}
				if (this.currentSex) {
					data.gender = this.currentSex
				}
				let res = await common.updateUserInfo(data)
				if(res && res.success) {
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
