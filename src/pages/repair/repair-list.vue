<template>
	<view class="content">
		<view class="head-box">
			<view>
				<!--<button @click="showActionSheet">{{(currentRoom && currentRoom.courtName) || '未关联房间'}}</button>-->
				<change-room-btn></change-room-btn>
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
		<view class="content" v-if="listModal && listModal.length">
			<view class="common-repair-card-item" v-for="(item, index) in listModal" :key="index">
				<view class="title">
					<image mode="aspectFit" class="img" src="../../static/img/homeHL.png" alt=""/>
					<text>{{item.roomName}}</text>
				</view>
				<view class="content-box">
					<view class="head" @click="toDetail(item)">
						<view>【{{servicesTypeEnum[item.servicesType]}}】 {{getTime(item.createDate)}}</view>
						<view class="btn-text">{{getStatus(item.state)}}></view>
					</view>
					<view class="body">
						<view class="content-info">{{item.contentInfo}}</view>
						<view v-if="item.servicePhotos && item.servicePhotos.length">
							<image v-for="(img, index) in item.servicePhotos"
								   :key="item" mode="aspectFit" class="img"
								   @click="lookImg(index,JSON.parse(JSON.stringify(item.servicePhotos)))"
								   :src="getSrc(img)" alt=""/>
						</view>
					</view>
					<view class="foot">
						<view></view>
						<view class="right">
							<!--// 待处理-->
							<template v-if="item.state === 0">
								<button class="btn" type="primary" @click="cancelClick(item)">取消</button>
								<button class="btn" type="primary" @click="toEdit(item)">编辑</button>
							</template>
							<!--// 处理中-->
							<template v-else-if="item.state === 1">
							</template>
							<!--// 待确认-->
							<template v-else-if="item.state === 2">
								<button class="btn" @click="changeStatus(item, 1)" type="primary">未完成服务</button>
								<button class="btn" @click="changeStatus(item, 3)" type="primary">完成服务</button>
							</template>
							<!--// 已完成-->
							<template v-else-if="item.state === 10">
								<button class="btn" type="primary" @click="toComment(item)">评价</button>

							</template>
							<!--// 已退回-->
							<template v-else-if="item.state === 5">
								<button class="btn" type="primary" @click="deleteClick(item)">删除</button>
								<button class="btn" type="primary" @click="toEdit(item)">编辑</button>
							</template>
							<!--// 已取消-->
							<template v-else-if="item.state === 6">
								<button class="btn" type="primary" @click="deleteClick(item)">删除</button>
							</template>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else>
			<NoData></NoData>
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
			NoData
		},
		computed: {
			...mapState(['primaryColor', 'serviceTypeList', 'hasLogin', 'userName', 'roomList', 'currentRoom']),
			listModal() {
				if(this.dataList && this.dataList.length) {
					let currentStatus = this.items[this.currentTabIndex].state
					if(currentStatus === '') {
						return this.dataList
					} else {
						return this.dataList.filter(e=>{
							return e.state === currentStatus
						})
					}
				}
				return []
			},
			itemList () {
				// （0＝待受理，1＝处理中，2＝待确认，3 4 7＝已完成(3是用户完成 4是已经评价 7是物业完成)，5＝已退回，6＝已取消）
				// -1-全部,10-已完成,0-待处理,1-处理中,2-待确认,5-已退回,6-已取消
				return [
					{
						label: '全部',
						value: '',
						state: '',
						isShow: true
					},
					{
						label: '待处理',
						state: 0,
						isShow: true
					},
					{
						label: '处理中',
						state: 1,
						isShow: true
					},
					{
						label: '待确认',
						state: 2,
						isShow: true
					},
					{
						label: '已完成',
						state: 10,
						isShow: true
					},
					{
						label: '已退回',
						state: 5,
						isShow: false
					},
					{
						label: '已取消',
						state: 6,
						isShow: false
					},
					{
						label: '待评价',
						state: 3,
						isShow: false
					},
					{
						label: '已评价',
						state: 4,
						isShow: false
					},
					{
						label: '物业完成',
						state: 7,
						isShow: false
					}
				]
			},
			items () {
				let arr = []
				this.itemList.forEach(e => {
					if(e.isShow) {
						let item = {
							label: e.label,
							state: e.state
						}
						if(e.state !== '') {
							item.value = this.dataList.filter(e2 => e2.state === e.state).length
							if (e.state === 10) {
								item.value = this.dataList.filter(e2 => {
									return [3,4,7,10].includes(e2.state)
								}).length
							}
						}
						arr.push(item)
					}
				})
				return arr
			},
		},
		watch: {
			currentRoom () {
				this.getServiceList()
			}
		},
		data() {
			return {
				servicesTypeEnum:{
					1: '报修',
					2: '投诉'
				},
				currentTabIndex: 0,
				dataList: []
			}
		},
		methods: {
			...mapMutations(['setStateData']),
			getSrc(src) {
				return `${this.$filePrefix}/${src.slice(1)}`
			},
			getTime (e) {
				return util.dateFormat(new Date(e).getTime())
			},
			getStatus(state) {
				let item = this.itemList.find(e => {
					return e.state === state
				})
				return item && item.label
			},
			lookImg (index,list) {
				uni.previewImage({
					current: this.getSrc(list[index]),
					urls: list.map(e => this.getSrc(e))
				})
			},
			deleteClick (item) {
				uni.showModal({
					title: '提示',
					content: `确定要删除当前${this.servicesTypeEnum[item.servicesType]}信息吗？`,
					showCancel: true,
					success: async (res3) => {
						if (res3.confirm) {
							console.log('用户点击确定');
							let res =  await api.deleteService({
								serviceId: item.serviceId
							})
							if(res.success) {
								uni.showToast({
									icon: 'none',
									title: '操作成功！'
								});
								this.getServiceList()
							}
						} else if (res3.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 编辑
			toEdit (item) {
				//在起始页面跳转到test.vue页面并传递参数-
				uni.navigateTo({
					url: `/pages/repair/repair?serviceId=${item.serviceId}`
				});
			},
			// 编辑
			toComment (item) {
				//在起始页面跳转到test.vue页面并传递参数-
				uni.navigateTo({
					url: `/pages/repair/repair-comment?serviceId=${item.serviceId}`
				});
			},
			toDetail (item) {
				//在起始页面跳转到test.vue页面并传递参数-
				uni.navigateTo({
					url: `/pages/repair/repair-detail?serviceId=${item.serviceId}`
				});
			},
			changeStatus (item, state) {
				// 1未完成服务（处理中） 3 完成服务（已完成）
				let obj = {
					1: '未完成',
					3: '已完成'
				}
				uni.showModal({
					title: '提示',
					content: `确定要当前${this.servicesTypeEnum[item.servicesType]}${obj[state]}吗？`,
					showCancel: true,
					success: async (res3) => {
						if (res3.confirm) {
							console.log('用户点击确定');
							let res =  await api.setServiceStatus({
								courtId: this.currentRoom.courtId,
								stateId: item.state,
								serviceId: item.serviceId,
								changeStateId: state,
							})
							if(res.success) {
								uni.showToast({
									icon: 'none',
									title: '操作成功！'
								});
								this.getServiceList()
							}
						} else if (res3.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			cancelClick (item) {
				uni.showModal({
					title: '提示',
					content: `确定要取消当前${this.servicesTypeEnum[item.servicesType]}信息吗？`,
					showCancel: true,
					success: async (res3) => {
						if (res3.confirm) {
							console.log('用户点击确定');
							let res =  await api.setServiceStatus({
								courtId: this.currentRoom.courtId,
								stateId: item.state,
								serviceId: item.serviceId,
								changeStateId: 6,
							})
							if(res.success) {
								uni.showToast({
									icon: 'none',
									title: '操作成功！'
								});
								this.getServiceList()
							}
						} else if (res3.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			changeState(state) {

			},
			onClickItem(e) {
				if (this.currentTabIndex !== e.currentIndex) {
					this.currentTabIndex = e.currentIndex;
				}
			},
			async getServiceList() {
				let res = await api.getServiceList({
					courtId: this.currentRoom.courtId,
					stateId: -1
				})
				if (res.success) {
					res.data.sort((a,b)=>{
						return a.createDate > b.createDate ? -1: 1
					})
					this.dataList = res.data || []
				}
			},
		},
		onShow() {
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
				.content-info {
					display: flex;
					word-break: break-all;
				}
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
					color: #fff;
				}
			}

		}
	}
</style>
