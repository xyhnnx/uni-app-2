<template>
    <view class="content padding0" v-if="roomList && roomList.length">
        <view class="height0">
            <view class="background-primary"></view>
        </view>
        <view class="content-box">
            <view>
                <change-room-btn></change-room-btn>
            </view>
            <view class="height10"></view>
            <view class="card-box">
                <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
                        :duration="duration">
                    <swiper-item v-for="(item,index) in adData" :key="index" @click="bannerClick(index)">
                        <view class="swiper-item">
                            <image mode="scaleToFill" class="img" :src="item.link_url" alt=""/>
                        </view>
                    </swiper-item>
                </swiper>
            </view>
            <view class="height10"></view>

            <view class="height10"></view>
            <view class="card-box panel-section">
                <view class="item" @click="toDetail('/pages/pay/pay')">
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
                <view class="item" @click="toDetail('/pages/building/building')">
                    <view>
                        <image mode="aspectFit" class="img" src="../../static/img/oval-3-image.png" alt=""/>
                    </view>
                    <view>居家服务</view>
                </view>
                <view class="split"></view>
                <view class="item" @click="toDetail('/pages/building/building')">
                    <view>
                        <image mode="aspectFit" class="img" src="../../static/img/oval-4-image.png" alt=""/>
                    </view>
                    <view>配送商品</view>
                </view>
            </view>
        </view>
    </view>
    <view v-else class="common-no-data-box">
        <NoData text="请扫码房产二维码"></NoData>
    </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import * as api from '../../api/api'
  import * as common from '../../common/common'
  import ChangeRoomBtn from '../../common/change-room-btn'
  import NoData from '../../components/my-components/no-data'


  export default {
    components: {
      ChangeRoomBtn,
      NoData
    },
    data() {
      return {
        background: ['color1', 'color2', 'color3'],
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 500,
        adData: [
          {
            link_url: '../../static/img/banner1.png'
          },
          {
            link_url: '../../static/img/banner1.png'
          },
        ]
      }
    },
    computed: mapState(['forcedLogin', 'hasLogin', 'userName', 'roomList','currentRoom']),
    watch: {
        currentRoom () {
            this.getAdvert()
        }
    },
    methods: {
      ...mapMutations(['setStateData']),
      scanningCode() {
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
      },
      toDetail (url) {
        console.log(url)
        //在起始页面跳转到test.vue页面并传递参数
        uni.navigateTo({
          url
        });
      },
      bannerClick (index) {
        console.log(index)
      },
      async getAdvert () {
        let res = await api.getAdvert({
          advertPage: 2,
          courtId: this.currentRoom.courtId
        })
        if(res.success && res.data && res.data.length) {
          this.adData = res.data
        }
      }
    },
    onLoad() {
      this.getAdvert()
      // if (!this.hasLogin) {
      // 	uni.showModal({
      // 		title: '未登录',
      // 		content: '您未登录，需要登录后才能继续',
      // 		/**
      // 		 * 如果需要强制登录，不显示取消按钮
      // 		 */
      // 		showCancel: !this.forcedLogin,
      // 		success: (res) => {
      // 			if (res.confirm) {
      // 				/**
      // 				 * 如果需要强制登录，使用reLaunch方式
      // 				 */
      // 				if (this.forcedLogin) {
      // 					uni.reLaunch({
      // 						url: '../login/login'
      // 					});
      // 				} else {
      // 					uni.navigateTo({
      // 						url: '../login/login'
      // 					});
      // 				}
      // 			}
      // 		}
      // 	});
      // }

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
