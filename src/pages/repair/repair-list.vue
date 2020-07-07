<template>
	<view class="content">
		<view class="head-box">
			<view>
				<button @click="showActionSheet">{{(currentRoom && currentRoom.courtName) || '未关联房间'}}</button>
			</view>
			<view class="height5"></view>
			<uni-segmented-control :current="currentTabIndex"
								   :values="items"
								   @clickItem="onClickItem"
								   style-type="text"
								   :active-color="primaryColor">
			</uni-segmented-control>
		</view>
		<view class="height10"></view>
		<view class="content">
			<view class="card-item">
				<view class="title">
					<image mode="aspectFit" class="img" src="../../static/img/homeHL.png" alt=""/>
					<text>1期一栋1001</text>
				</view>
				<view class="content-box">
					<view class="head">
						<view>【报修】 2020-12-12 11:12:12</view>
						<view class="btn-text">待处理></view>
					</view>
					<view class="body">
						<view>这里是文字这里是文字这里是文字这88里是文字这里是文字</view>
						<view>
							<image mode="aspectFit" class="img" src="../../static/img/homeHL.png" alt=""/>
							<image mode="aspectFit" class="img" src="../../static/img/homeHL.png" alt=""/>
						</view>
					</view>
					<view class="foot">
						<view></view>
						<view class="right">
							<button class="btn" type="primary" plain="true">按钮</button>
							<button class="btn" type="primary" plain="true">按钮</button>
						</view>
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
			},
			list2Modal() {
			}
		},
		data() {
			return {
				items: [
					{
						label: '全部',
						value: ''
					},
					{
						label: '待处理',
						value: 1
					},
					{
						label: '处理中',
						value: 1
					},
					{
						label: '待确认',
						value: 1
					},
					{
						label: '已完成',
						value: 1
					},
				],
				currentTabIndex: 0,
				noticeList: [],
				payCallList: []
			}
		},
		methods: {
			...mapMutations(['setStateData']),
			onClickItem(e) {
				if (this.currentTabIndex !== e.currentIndex) {
					this.currentTabIndex = e.currentIndex;
				}
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
			async getServiceList() {
				let res = await api.getServiceList({
					courtId: this.currentRoom.courtId,
					stateId: -1
				})
				console.log(res)
				if (res.success) {
					this.dataList = res.data
				}
			},
		},
		onLoad() {
			this.getServiceList()
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
		.title{
			display: flex;
			line-height: 32px;
			.img{
				width: 30px;
				height: 30px;
			}
			align-items: center;
		}
		.content-box{
			background-color: #fff;
			padding: 5px;
			.head{
				line-height: 50px;
				border-bottom: 1px solid $uni-border-color;
				display: flex;
				justify-content: space-between;
				.btn-text{
					color: $uni-color-primary;
				}
			}
			.body{
				padding: 5px;
				.img{
					width: 80px;
					height: 80px;
				}
			}
			.foot{
				padding: 5px 0;
				border-top: 1px solid $uni-border-color;
				display: flex;
				justify-content: space-between;
				.right{
					display: flex;
				}
				.btn{
					width: 100px;
					margin: 0;
					margin-left: 10px;
					font-size: 14px;
				}
			}

		}
	}
</style>
