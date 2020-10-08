<template>
    <view class="content">
        <view class="oauth-row">
            <view class="oauth-image">
                <button class="login-btn" type="primary" open-type="getPhoneNumber" @getphonenumber="getUserInfo">
                    <image class="img" :src="provider.image" @tap="oauth(provider.value)"></image>
                    微信授权登录
                </button>
            </view>
        </view>
    </view>
</template>

<script>
  import * as common from '../../common/common'
  import * as api from '../../api/api'
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
        launchQueryData: {}
      }
    },
    computed: mapState(['forcedLogin','userInfo']),
    methods: {
      ...mapMutations(['login','setStateData']),
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
        if (res.detail) {
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
        uni.showLoading({
          title: '登录中'
        });
        // // 获取微信code
        await common.wxLogin()
        // 获取用户信息
        // code小程序Code，必传，roomid  扫码就传码上的参数  不扫码就只要传个code  扫码的时候再传这2个 EncryptedDataStr  加密数据 IV  向量 为了获取用户手机号
        let res2 = await common.login({
          Code: getApp().globalData.code,
          roomId: this.launchQueryData.roomId,
          EncryptedDataStr: getApp().globalData.encryptedData,
          IV: getApp().globalData.iv
        })
        uni.hideLoading()
        if (!(res2 && res2.success)) {
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
        } else {
          uni.setStorageSync('jwtToken', res2.data.jwtToken)
          this.setStateData({
            'roomList': res2.data.roomInfos || [],
            'currentRoom': res2.data.roomInfos && res2.data.roomInfos[0]
          })
          common.getUserInfo()
          this.toMain()
        }
      },
      toMain(userName) {
        uni.reLaunch({
          url: '../main/main',
        });
      }
    },
    async onLoad (option) {
      this.launchQueryData = wx.getLaunchOptionsSync().query
      if (this.launchQueryData && this.launchQueryData.roomId) { // 如果是扫码有参数进来的
      }

      uni.showLoading({
        title: '请稍后'
      });
      // // 获取微信code
      await common.wxLogin()
      // 获取用户信息
      // code小程序Code，必传，roomid  扫码就传码上的参数  不扫码就只要传个code  扫码的时候再传这2个 EncryptedDataStr  加密数据 IV  向量 为了获取用户手机号
      let res2 = await common.login({
        Code: getApp().globalData.code,
        roomId: this.launchQueryData.roomId
      })
      uni.hideLoading()
      if (!(res2 && res2.success)) {
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
      } else {
        uni.setStorageSync('jwtToken', res2.data.jwtToken)
        this.setStateData({
          'roomList': res2.data.roomInfos || [],
          'currentRoom': res2.data.roomInfos && res2.data.roomInfos[0]
        })
        common.getUserInfo()
        this.toMain()
      }
    }
  }
</script>

<style scoped lang="scss">
    .login-btn {
        margin:  0 10px;
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
