<template>
    <view class="content padding0">
        <view class="height0">
            <view class="background-primary"></view>
        </view>
        <view class="content-box">
            <view>
            <button @click="showActionSheet">{{(currentRoom && currentRoom.courtName) || '未关联房间'}}</button>
        </view>
            <view class="height10"></view>
            <view class="card-box">
                <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
                        :duration="duration">
                    <swiper-item>
                        <view class="swiper-item">
                            <image mode="scaleToFill" class="img" src="../../static/img/banner1.png" alt=""/>
                        </view>
                    </swiper-item>
                    <swiper-item>
                        <view class="swiper-item">
                            <image mode="scaleToFill" class="img" src="../../static/img/banner1.png" alt=""/>
                        </view>
                    </swiper-item>
                </swiper>
            </view>
            <view class="height10"></view>

            <view class="height10"></view>
            <view class="card-box panel-section">
                <view class="item">
                    <view>
                        <image mode="aspectFit" class="img" src="../../static/img/image.png" alt=""/>
                    </view>
                    <view>物业缴费</view>
                </view>
                <view class="split"></view>
                <view class="item" @click="toDetail('/pages/repair/repair')">
                    <view>
                        <image mode="aspectFit" class="img" src="../../static/img/oval-image.png" alt=""/>
                    </view>
                    <view>报修投诉</view>
                </view>
            </view>
            <view class="height10"></view>
            <view class="panel-title">
                居家服务
            </view>
            <view class="height5"></view>
            <view class="card-box panel-section">
                <view class="item">
                    <view>
                        <image mode="aspectFit" class="img" src="../../static/img/oval-3-image.png" alt=""/>
                    </view>
                    <view>居家服务</view>
                </view>
                <view class="split"></view>
                <view class="item">
                    <view>
                        <image mode="aspectFit" class="img" src="../../static/img/oval-4-image.png" alt=""/>
                    </view>
                    <view>配送商品</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import * as api from './api/api'
  import * as common from '../../common/common'

  export default {
    data() {
      return {
      }
    },
    computed: mapState(['serviceTypeList', 'hasLogin', 'userName', 'roomList','currentRoom']),
    methods: {
      ...mapMutations(['setStateData']),
      test() {
        console.log('scanningCodescanningCode')
        // 允许从相机和相册扫码
        uni.scanCode({
          success: async function (res) {
            console.log('uni.scanCode', res)
            let res2 = await common.login({
              RoomId: res.result,
              EncryptedDataStr: getApp().globalData.encryptedData,
              IV: getApp().globalData.iv
            })
            console.log('common.login', res2)
            if (!res2.success) {
              if (res2.errorCode === '1005') { // 请扫描房产二维码
                uni.showModal({
                  title: '提示',
                  content: res2.errorMessage,
                  showCancel: false,
                  success: function (res3) {
                    if (res3.confirm) {
                      console.log('用户点击确定');
                    } else if (res3.cancel) {
                      console.log('用户点击取消');
                    }
                  }
                });
              }
            }
          },
          fail() {
            uni.showModal({
              title: '提示',
              content: '扫码失败；请重试',
              showCancel: false
            });
          }
        });

        uni.showToast({
          icon: 'none',
          title: '已发送重置邮件至注册邮箱，请注意查收。',
          duration: 3000
        });

        uni.showActionSheet({
          itemList: this.roomList.map(e => e.roomName),
          success: (res) => {
            this.setStateData({
              currentRoom: this.roomList[res.tapIndex]
            })
          },
          fail: function (res) {
            console.log(res.errMsg);
          }
        });
        //在起始页面跳转到test.vue页面并传递参数
        uni.navigateTo({
          url: '/pages/repair/repair'
        });
        uni.reLaunch({
          url: '/pages/main/main',
        });


        uni.showModal({
          title: '提示',
          content: '扫码失败；请重试',
          showCancel: false
        });


      },
    },
    onLoad() {
    }
  }
</script>

<style lang="scss" scoped>
    .padding0 {
        padding: 0;
    }

    .height0 {
        height: 0;

        .background-primary {
            height: 130px;
            background-color: $uni-color-primary;
        }
    }

    .swiper {
        border-radius: 10px;
        overflow: hidden;
        background-color: #fff;
        .swiper-item {
            .img {
                width: 100%;
                display: block;
            }
        }
    }

    .content-box {
        padding: 10px;
    }

    .panel-section {
        padding: 10px;
        display: flex;
        align-items: center;
        background-color: #fff;
        .split{
            width: 1px;
            height: 70px;
            background-color: $uni-border-color;
        }
        .item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            .img {
                width: 50px;
                height: 50px;
                margin-right: 5px;
            }
        }
    }
    .panel-title {
        font-weight: bold;
    }
</style>
