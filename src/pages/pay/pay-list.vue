<template>
	<view class="content">
		<view class="head-box">
			<view>
				<button @click="showActionSheet">{{(currentRoom && currentRoom.courtName) || '未关联房间'}}</button>
			</view>
		</view>
		<view class="content">
			<view class="card-item" v-for="(item, index) in listModal" :key="index" @click="toDetail(item)">
				<view class="title-top"> {{getTime(item.chargeTime)}}</view>
				<view class="title">
					<image mode="aspectFit" class="img" src="../../static/img/homeHL.png" alt=""/>
					<text>{{item.roomName}}</text>
				</view>
				<view class="content-box">
					<view class="head">
						<view> {{item.itemName}}</view>
						<view class="btn-text">{{item.realAllMoney}}</view>
					</view>
					<view class="body">
						<view>缴费周期：{{getTime2(item.realLastPayDate)}}~{{getTime2(item.realStopPayDate)}}</view>
					</view>
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
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			UniSegmentedControl,
			UniList,
			UniListItem,
			NoData
		},
		computed: {
			...mapState(['primaryColor', 'serviceTypeList', 'hasLogin', 'userName', 'roomList', 'currentRoom']),
			listModal() {
				if(this.dataList && this.dataList.length) {
					return this.dataList
				}
				return []
			},
		},
		data() {
			return {
				dataList: []
			}
		},
		methods: {
			...mapMutations(['setStateData']),
			getSrc(src) {
				return `${this.$filePrefix}/${src.replace('~', '')}`
			},
			getTime (e) {
				return util.dateFormat(new Date(e).getTime())
			},
			getTime2 (e) {
				return util.dateFormat(new Date(e).getTime(),'yyyy-MM-dd')
			},
			changeState(state) {

			},

			showActionSheet() {
				uni.showActionSheet({
					itemList: this.roomList.map(e => e.courtName),
					success: (res) => {
						this.setStateData({
							currentRoom: this.roomList[res.tapIndex]
						})
					},
					fail: function (res) {
						console.log(res.errMsg);
					}
				});
			},
			async getPaymentBillList() {
				let res = await api.getPaymentBillList({
					courtId: this.currentRoom.courtId,
				})
				if (res.success) {
					this.dataList = res.data
				}
			},
			toDetail (item) {
				const url = util.webUrlSplicing(
						'/pages/pay/pay-item-detail',
						{
							payNo: item.payNo
						}
				)
				//在起始页面跳转到test.vue页面并传递参数
				uni.navigateTo({
					url
				});
			}
		},
		onLoad() {
			this.getPaymentBillList()
		}
	}
</script>

<style scoped lang="scss">
	.head-box {
		background-color: #fff;
	}
	.list-right-box{
		display: flex;
		align-items: center;
		color: $uni-color-subtitle;
		.dot{
			color: $uni-color-primary;
			font-size: 70px;
			height: 8px;
			margin-left: 5px;
			line-height: 0;
		}
	}
	.card-item{
		.title-top{
			padding: 0 10px;
			color: $uni-color-primary;
			line-height: 30px;
		}
		.title{
			padding: 0 10px;
			background-color: #fff;
			display: flex;
			line-height: 32px;
			border-bottom: 1px solid $uni-border-color;
			.img{
				width: 30px;
				height: 30px;
			}
			align-items: center;
		}
		.content-box{
			padding: 5px 10px;
			background-color: #fff;
			.head{
				line-height: 50px;
				display: flex;
				justify-content: space-between;
				.btn-text{
					color: $uni-color-primary;
				}
			}
			.body{
				.img{
					width: 80px;
					height: 80px;
				}
			}

		}
	}
</style>
