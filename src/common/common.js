import * as api from '../api/api'
import store from '../store/index'
export const wxLogin = async function () {
  // session_key 已经失效，需要重新执行登录流程
  return new Promise((resolve) => {
    uni.login({
      provider: 'weixin',
      success: function (loginRes) {
        getApp().globalData.code = loginRes.code
        resolve()
      }
    });
  })
}
// 获取用户信息
export const wxGetUser = async function () {
  let flag = await wxAuthorize('scope.userInfo')
  if (flag) {
    return new Promise((resolve) => {
      // 获取用户信息
      uni.getUserInfo({
        provider: 'weixin',
        success: function (infoRes) {
          resolve(infoRes)
        },
        fail() {
          console.log('getUserInfo fail')
          resolve(false)
        }
      });
    })
  } else {
    console.log('获取用户授权失败')
    return false
  }

}
// 获取用户信息
export const getUserInfo = async function () {
  let res = await wxGetUser()
  console.log(res)
  if (res.iv) {
    let res2 = await api.getUserInfo({
      code: getApp().globalData.code,
      iv: res.iv,
      encryptedDataStr: res.encryptedData
    })
    console.log(store, res2)
    store.commit('setUserInfo', res2.data)
  }

}
// 提前向用户发起授权请求
export const wxAuthorize = function (scope = 'scope.userInfo') {
  return new Promise((resolve, reject) => {
    uni.authorize({
      scope,
      success() {
        // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
        console.log(`wxAuthorize--${scope}--success`)
        resolve(true)
      },
      fail() {
        console.log(`wxAuthorize--${scope}--fail`)
        resolve(false)
      }
    })
  })
}

export const login = async function (obj = {}) {
  let data = {
    Code: getApp().globalData.code,
    ...obj
  }
  let res = await api.login(data)
  return res
}
