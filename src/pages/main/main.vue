<template>
    <view class="content padding0">
        <view class="height0">
            <view class="background-primary"></view>
        </view>
        <view class="content-box">
            <view>
                <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
                        :duration="duration">
                    <swiper-item>
                        <view class="swiper-item">
                            <image mode="aspectFit" class="img" src="../../static/img/banner1.png" alt=""/>
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
            <view>
                <!--<button type="primary" @click="scanningCode">扫码</button>-->
                <button open-type="getUserInfo" @getuserinfo="getUserInfo">扫码</button>
            </view>
        </view>
    </view>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  import * as api from '../../api/api'
  import * as common from '../../common/common'

  export default {
    data() {
      return {
        background: ['color1', 'color2', 'color3'],
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 500
      }
    },
    computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
    methods: {
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
              content: '扫描失败；请重试',
              showCancel: false
            });
          }
        });
      },
      getUserInfo(res) {
        console.log('getUserInfo', res)
        getApp().globalData.encryptedData = res.detail.encryptedData
        getApp().globalData.iv = res.detail.iv
        this.scanningCode()
      }
    },
    onLoad() {
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
            height: 60px;
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
</style>
