<template>
    <view class="content" v-if="roomList && roomList.length">
        <view class="head-box">
            <uni-segmented-control :current="currentTabIndex"
                                   :values="items"
                                   @clickItem="onClickItem"
                                   style-type="text"
                                   :active-color="primaryColor">
            </uni-segmented-control>
            <view>
                <change-room-btn></change-room-btn>
            </view>
        </view>
        <view class="height10"></view>
        <view class="content">
            <view v-if="currentTabIndex === 0">
                <!-- 包含图片 -->
                <uni-list v-if="listModal && listModal.length">
                    <uni-list-item :title="item.title"
                                   @click="noticeItemClick(item)"
                                   v-for="(item, index) in listModal"
                                   :key="index"
                                   :note="item.time"
                                   :show-arrow="false"
                                   thumb="/static/img/tip.png">
                        <template v-slot:right="">
                            <view class="list-right-box">
                                <text v-if="item.isTop" class="txt">置顶</text>
                                <text v-if="!item.isRead" class="dot">·</text>
                            </view>
                        </template>
                    </uni-list-item>
                </uni-list>
                <no-data v-else></no-data>
            </view>
            <view v-if="currentTabIndex === 1">
                <!-- 包含图片 -->
                <uni-list v-if="list2Modal && list2Modal.length">
                    <uni-list-item :title="item.roomName"
                                   @click="payCallItemClick(item)"
                                   v-for="(item, index) in list2Modal"
                                   :key="index"
                                   :note="item.time"
                                   :show-arrow="false"
                                   thumb="/static/img/cuijiao.png">
                        <template v-slot:right="">
                            <view class="list-right-box">
                                <text v-if="!item.isRead" class="dot">·</text>
                            </view>
                        </template>
                    </uni-list-item>
                </uni-list>
                <no-data v-else></no-data>
            </view>
        </view>
        <view class="fix-bottom-btn-box">
            <button @tap="requestSubscribeMessage"><text class="xyh-icon list-icon">&#xe611;</text>更新提醒</button>
        </view>
    </view>
    <view v-else class="common-no-data-box">
        <no-data text="请扫码房产二维码"></no-data>
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
        if (this.noticeList && this.noticeList.length) {
          return this.noticeList.map(e => {
            return {
              ...e,
              time: util.dateFormat(new Date(e.publishDate).getTime())
            }
          })
        }
        return []
      },
      list2Modal() {
        if (this.payCallList && this.payCallList.length) {
          return this.payCallList.map(e => {
            return {
              ...e,
              time: util.dateFormat(new Date(e.payCallTm).getTime())
            }
          })
        }
        return []
      }
    },
    watch: {
      currentRoom () {
        // d获取公告
        this.getNoticeList()
        // 催缴通知
        this.getPayCallList()
      }
    },
    data() {
      return {
        items: ['公告', '催缴通知'],
        currentTabIndex: 0,
        noticeList: [],
        payCallList: []
      }
    },
    methods: {
      ...mapMutations(['setStateData']),
      requestSubscribeMessage () {
        wx.requestSubscribeMessage({
          tmplIds: ['Eg-nOfVHoK4ybpQkqMAFpGvAkyKGFMmm59BUk8PiI5E', '4lVMTp3fhrZaR26KUd2C1SPeZjOjlIOXWa2syeQ2hZs'],
          success (res) {
              uni.showToast({
                  title: '订阅消息成功!',
                  icon: 'none',
                  duration: 2000
              });
          }
        })
      },
      onClickItem(e) {
        if (this.currentTabIndex !== e.currentIndex) {
          this.currentTabIndex = e.currentIndex;
          if(this.currentTabIndex === 0) {
            // d获取公告
            this.getNoticeList()
          } else {
            // 催缴通知
            this.getPayCallList()
          }
        }
      },
      async getNoticeList() {
        let res = await api.getNoticeList({
          courtId: this.currentRoom.courtId
        })
        if (res.success) {
          res.data.sort((a,b)=> {
            return b.isTop - a.isTop
          })
          this.noticeList = res.data
        }
      },
      async getPayCallList() {
        let res = await api.getPayCallList({
          courtId: this.currentRoom.courtId
        })
        if (res.success) {
          this.payCallList = res.data
        }
      },
      noticeItemClick (item) {
        uni.navigateTo({
          url: `/pages/notice/detail?noticeId=${item.id}`
        });
      },
      payCallItemClick (item) {
        uni.navigateTo({
          url: `/pages/notice/payCallDetail?payCallId=${item.id}`
        });
      }
    },
    onShow() {
      // d获取公告
      this.getNoticeList()
      // 催缴通知
      this.getPayCallList()
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
   .fix-bottom-btn-box {
       position: fixed;
       bottom: 10px;
       margin: auto;
       width: 140px;
       text-align: center;
       left: 0;
       right: 0;
       button {
           color: $uni-color-primary;
           &:after{
               border-color: $uni-color-primary;
           }
           text {
               margin-right: 3px;
           }
       }
   }
</style>
