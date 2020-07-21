<template>
    <view class="content">
        <change-room-btn></change-room-btn>
        <view class="card-box">
            <view class="line-h"></view>
            <view class="list-item">
                <view class="title">
                    <view class="icon-tick-box">
                        <view class="un-select"></view>
                    </view>
                    <view>收款单位</view>
                </view>
                <view class="select-box">
                    <view class="text">
                        {{currentRoom.companyName}}
                    </view>
                </view>
            </view>
            <view class="list-item">
                <view class="title">
                    <view class="icon-tick-box">
                        <view class="un-select"></view>
                    </view>
                    <view>户号</view>
                </view>
                <view class="select-box">
                    <view>
                        <uni-combox :labelWidth="0" disabled
                                    :candidates="selectArr2"
                                    placeholder="请选择户号"
                                    v-model="selectIndex2">
                        </uni-combox>
                    </view>
                </view>
            </view>
            <view>
                <button class="radius next-btn" type="primary"  @click="toPayItem">下一步</button>
            </view>
            <!--<button class="btn-" type="primary" @click="toDetail">立即缴费</button>-->

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
  import uniCombox  from '../../components/uni-combox/uni-combox'
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
      uniCombox,
      NoData
    },
    computed: {
      ...mapState(['primaryColor', 'serviceTypeList', 'hasLogin', 'userName', 'roomList', 'currentRoom']),
      selectArr2Data() {
        return this.roomList.filter(e=>e.companyId === this.currentRoom.companyId)
      },
      selectArr2 () {
        return this.selectArr2Data.map(e=>e.roomName)
      },
    },
    data() {
      return {
        query: {},
        detail: {},
        selectIndex2: 0
      }
    },
    methods: {
      ...mapMutations(['setStateData']),
      async getNoticeDetail() {
        let res = await api.getNoticeDetail({
          noticeId: this.query.noticeId
        })
        if (res.success) {
          this.detail = res.data || {}
        }
      },
      toDetail () {
        //在起始页面跳转到test.vue页面并传递参数
        uni.navigateTo({
          url: '/pages/pay/pay-detail'
        });
      },
      toPayItem () {
        let roomId = this.selectArr2Data[this.selectIndex2].roomId
        console.log(roomId,'roomId')
        //在起始页面跳转到test.vue页面并传递参数
        uni.navigateTo({
          url: `/pages/pay/pay-item?roomId=${roomId}`
        });
      }
    },
    onLoad(e) {
      this.query = e
      // d获取公告
      this.getNoticeDetail()
    }
  }
</script>

<style scoped lang="scss">
    .next-btn {
        margin: 30px 20px 20px;
    }
    .card-box{
        background-color: #fff;
        margin: 20px 10px;
        padding: 10px 20px;
        position: relative;
        .line-h {
            position: absolute;
            left: 27px;
            top: 32px;
            width: 1px;
            background-color: #fb7349;
            height: 38px;
        }
    }
    .list-item{
        .title {
            display: flex;
            align-items: center;
        }
        .select-box {
            margin-left: 20px;
            border-bottom: 1px solid $uni-border-color;
            .text {
                line-height: 41px;
            }
        }
    }
    .icon-tick-box {
        margin-right: 5px;
        width: 14px;
        height: 14px;
        border: 1px solid $uni-color-primary;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .un-select {
            width: 7px;
            height: 7px;
            border: 1px solid $uni-color-primary;
            border-radius: 50%;
        }
        .select {

        }
    }
</style>
