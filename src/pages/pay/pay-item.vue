<!--缴费账单-->
<template>
    <view class="content">
        <!-- 一般用法 -->
        <uni-collapse @change="change">
            <uni-collapse-item title="标题文字">
                <uni-list>
                    <uni-list-item title="标题文字" thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/hx.png"></uni-list-item>
                    <uni-list-item title="标题文字" note="描述信息" thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png"></uni-list-item>
                    <uni-list-item title="标题文字" note="描述信息" show-extra-icon="true" :extra-icon="{color: '#4cd964',size: '22',type: 'spinner'}"></uni-list-item>
                </uni-list>
            </uni-collapse-item>
            <uni-collapse-item title="默认开启" open="true">
                <view style="padding: 30rpx;"> 折叠内容主体，可自定义内容及样式 </view>
            </uni-collapse-item>
            <uni-collapse-item title="禁用状态" disabled="true">
                <view style="padding: 30rpx;"> 禁用状态 </view>
            </uni-collapse-item>
        </uni-collapse>

        <!-- 手风琴效果 -->
        <uni-collapse accordion="true">
            <uni-collapse-item title="标题文字">
                <view style="padding: 30rpx;">
                    手风琴效果
                </view>
            </uni-collapse-item>
            <uni-collapse-item title="标题文字">
                <view style="padding: 30rpx;">
                    手风琴效果
                </view>
            </uni-collapse-item>
            <uni-collapse-item title="标题文字">
                <view style="padding: 30rpx;">
                    手风琴效果
                </view>
            </uni-collapse-item>
        </uni-collapse>

        <!-- 带图标 -->
        <uni-collapse>
            <uni-collapse-item title="标题文字" thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png">
                <view style="padding: 30rpx;">
                    折叠内容主体，可自定义内容及样式
                </view>
            </uni-collapse-item>
            <uni-collapse-item title="标题文字" thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/hx.png">
                <view style="padding: 30rpx;">
                    折叠内容主体，可自定义内容及样式
                </view>
            </uni-collapse-item>
        </uni-collapse>
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
      ...mapState(['primaryColor', 'serviceTypeList', 'hasLogin', 'userName', 'roomList', 'currentRoom']),
    },
    data() {
      return {
        query: {
          roomId: 361111
        },
        detail: {}
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
      async getRoomChargeItemDatas () {
        let res = await api.getRoomChargeItemDatas({
          roomId: this.query.roomId
        })
        console.log(res)
        if(res.success) {

        }
      }
    },
    onLoad(e) {
      console.log(e)
      this.query = e
      this.getRoomChargeItemDatas()
    }
  }
</script>

<style scoped lang="scss">
    .card-box{
        background-color: #fff;
        margin: 20px 10px;
    }
    .list-item{

    }
</style>
