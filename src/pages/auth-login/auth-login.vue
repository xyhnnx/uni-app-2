<template>
    <view class="content">
        <view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
            <view class="oauth-image" v-for="provider in providerList" :key="provider.value">

                <!-- #ifdef MP-WEIXIN -->
                <button class="login-btn" open-type="getUserInfo" @getuserinfo="getUserInfo">
                    <image class="img" :src="provider.image" @tap="oauth(provider.value)"></image>
                    微信授权登录
                </button>
                <!-- #endif -->
            </view>
        </view>
    </view>
</template>

<script>
  import * as common from '../../common/common'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import mInput from '../../components/m-input.vue'

  export default {
    components: {
      mInput
    },
    data() {
      return {
        providerList: [],
        hasProvider: false,
        account: '',
        password: '',
        positionTop: 0,
        isDevtools: false,
        // 扫码进入的页面的参数
        onLoadInfo: {
          roomId: 283672
        }
      }
    },
    computed: mapState(['forcedLogin']),
    methods: {
      ...mapMutations(['login']),
      initProvider() {
        const filters = ['weixin', 'qq', 'sinaweibo'];
        uni.getProvider({
          service: 'oauth',
          success: (res) => {
            if (res.provider && res.provider.length) {
              for (let i = 0; i < res.provider.length; i++) {
                if (~filters.indexOf(res.provider[i])) {
                  this.providerList.push({
                    value: res.provider[i],
                    image: '../../static/img/' + res.provider[i] + '.png'
                  });
                }
              }
              this.hasProvider = true;
            }
          },
          fail: (err) => {
            console.error('获取服务供应商失败：' + JSON.stringify(err));
          }
        });
      },
      initPosition() {
        /**
         * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
         * 反向使用 top 进行定位，可以避免此问题。
         */
        this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
      },
      oauth(value) {
        uni.login({
          provider: value,
          success: (res) => {
            uni.getUserInfo({
              provider: value,
              success: (infoRes) => {
                /**
                 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
                 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
                 */
                this.toMain(infoRes.userInfo.nickName);
              },
              fail() {
                uni.showToast({
                  icon: 'none',
                  title: '登陆失败'
                });
              }
            });
          },
          fail: (err) => {
            console.error('授权登录失败：' + JSON.stringify(err));
          }
        });
      },
      async getUserInfo(res) {
        if (res.detail.userInfo) {
          console.log('getUserInfo', res)
          getApp().globalData.encryptedData = res.detail.encryptedData
          getApp().globalData.iv = res.detail.iv
          // this.toMain(res.detail.userInfo.nickName);
          await this.login()
        } else {
          uni.showToast({
            icon: 'none',
            title: '登陆失败,请重新授权登录'
          });
        }
      },
      async login () {
        console.log(encodeURIComponent('roomId=283672'))
        // 获取用户信息
        let res2 = await common.login({
          roomId: this.onLoadInfo.roomId,
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
        this.toMain()
      },
      toMain(userName) {
        uni.reLaunch({
          url: '../main/main',
        });

      }
    },
    async onLoad (option) {
      console.log('onLoad', option)
      // 扫码参数在这里
      // this.onLoadInfo = option
    },
    async onReady(option) {
      console.log(option)
      this.initPosition();
      this.initProvider();
      // #ifdef MP-WEIXIN
      this.isDevtools = uni.getSystemInfoSync().platform === 'devtools';
      // #endif

      // 获取用户信息
      // let res = await common.login()
      // if (!res.success) {
      //   if (res.errorCode === '1005') { // 请扫描房产二维码
      //     uni.showModal({
      //       title: '提示',
      //       content: res.errorMessage,
      //       showCancel: false,
      //       success: function (res) {
      //         if (res.confirm) {
      //           console.log('用户点击确定');
      //         } else if (res.cancel) {
      //           console.log('用户点击取消');
      //         }
      //       }
      //     });
      //   }
      // }
    }
  }
</script>

<style scoped lang="scss">
    .login-btn {
        display: flex;
        align-items: center;
        justify-content: center;

        .img {
            width: 30px;
            height: 30px;
        }
    }

    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .action-row navigator {
        color: #007aff;
        padding: 0 10px;
    }

    .oauth-row {
        width: 100%;
        display: flex;
        margin: auto;

        .oauth-image {
            width: 100%;
        }
    }
</style>
