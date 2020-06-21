import * as api from '../api/api'
export const wxLogin = async function () {
  // session_key 已经失效，需要重新执行登录流程
  return new Promise((resolve) => {
    uni.login({
      provider: 'weixin',
      success: function (loginRes) {
        console.log(loginRes);
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
          console.log(infoRes)
          console.log('用户昵称为：' + infoRes.userInfo.nickName);
          resolve(true)
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
  let res = await api.login({
    Code: getApp().globalData.code,
    ...obj
  })
  return res
}
