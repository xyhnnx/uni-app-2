<template>
	<view class="content">
		<view class="head-box">
			<view>
				<!--<button @click="showActionSheet">{{(currentRoom && currentRoom.courtName) || '未关联房间'}}</button>-->
				<change-room-btn :readOnly="true"></change-room-btn>
			</view>
			<view class="height5"></view>
		</view>
		<view class="height10"></view>
		<view class="content">
			<view class="common-repair-card-item" v-for="(item, index) in listModal" :key="index">
				<view class="title">
					<image mode="aspectFit" class="img" src="../../static/img/homeHL.png" alt=""/>
					<text>{{item.roomName}}</text>
				</view>
				<view class="content-box">
					<view class="head">
						<view>【{{servicesTypeEnum[item.servicesType]}}】 {{getTime(item.createDate)}}</view>
						<view class="btn-text">{{getStatus(item.state)}}></view>
					</view>
					<view class="body">
						<view class="content-info">{{item.contentInfo}}</view>
						<view v-if="item.servicePhotos && item.servicePhotos.length">
							<image @click="lookImg(index,item.servicePhotos)" v-for="(img, index) in item.servicePhotos" :key="item" mode="aspectFit" class="img" :src="getSrc(img)" alt=""/>
						</view>
					</view>
					<view class="foot">
						<view></view>
						<view class="right">
						</view>
					</view>
				</view>
			</view>
			<view class="process">
				<view class="title">过程记录</view>
				<view class="box">
					<view class="line"></view>
					<view class="item" v-for="(item, index) in serviceProcess" :key="index">
						<text class="dot"></text>
						<view class="right">
							<view class="info-box">
								<text class="time">
									{{getTime(item.createDate)}}
								</text>
								<text class="text">
									{{item.nodeName}} {{item.contentInfo}}
								</text>
							</view>
							<view class="img-box" v-if="item.processPhotos && item.processPhotos.length">
								<image class="img" v-for="(img, i) in item.processPhotos"
									   :key="i"
									   mode="aspectFit"
									   :src="getSrc(img)"></image>
							</view>
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
					return this.dataList
				}
				return []
			},
			items () {
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
						value: this.dataList.filter(e => e.state ===0).length,
						state: 0,
						isShow: true
					},
					{
						label: '处理中',
						value: this.dataList.filter(e => e.state ===1).length,
						state: 1,
						isShow: true
					},
					{
						label: '待确认',
						value: this.dataList.filter(e => e.state ===2).length,
						state: 2,
						isShow: true
					},
					{
						label: '已完成',
						value: this.dataList.filter(e => e.state === 10).length,
						state: 10,
						isShow: true
					},
					{
						label: '已退回',
						value: this.dataList.filter(e => e.state === 5).length,
						state: 5,
						isShow: false
					},
					{
						label: '已取消',
						value: this.dataList.filter(e => e.state === 6).length,
						state: 6,
						isShow: false
					},
					{
						label: '已评价',
						value: this.dataList.filter(e => e.state === 4).length,
						state: 4,
						isShow: false
					}
				]
			}
		},
		watch: {
			currentRoom () {
			}
		},
		data() {
			return {
				servicesTypeEnum:{
					1: '报修',
					2: '投诉'
				},
				serviceId: '',
				dataList: [],
				serviceProcess: []
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
			getTime2 (e) {
				return util.dateFormat(new Date(e).getTime(),'yyyy-MM-dd hh:mm')
			},
			getStatus(state) {
				let item = this.items.find(e => {
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
			async getServiceGetDetail () {
				let res = await api.getServiceGetDetail({
					serviceId: this.serviceId
				})
				if(res.success) {
					this.dataList = res.data?[res.data]:[]
					this.serviceProcess = (res.data && res.data.serviceProcess) || []
				}
			}
		},
		onLoad(e) {
			this.serviceId = e.serviceId
			this.getServiceGetDetail()
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
	.process {
		.title{
			color: red;
			line-height: 40px;
			padding: 0 20px;
		}
		.box {
			background-color: #fff;
			padding-left: 31px;
			position: relative;
			.line{
				position: absolute;
				top: 0;
				bottom: 0;
				left: 36px;
				width: 1px;
				background-color: $uni-text-color-grey-9;
				z-index: 1;
			}
		}
		.item {
			display: flex;
			align-items: center;
			.dot {
				margin-right: 10px;
				width: 10px;
				height: 10px;
				background-color: $uni-color-primary;
				border-radius: 50%;
				position: relative;
				z-index: 2;
				flex-shrink: 0;
			}
			.right{
				display: block;
				.info-box {
					display: flex;
					flex-wrap: wrap;
					.time {
						line-height: 40px;
						margin-right: 20px;
					}
					.text {
						line-height: 40px;
						flex: 1;
					}
				}

				.img-box {
					display: flex;
					overflow: auto;
					.img{
						width: 80px;
						height: 80px;
						border: 1px solid $uni-border-color;
						margin-right: 5px;
					}
				}
			}

		}
	}
</style>
