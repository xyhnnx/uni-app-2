let token  = ''



// Await
export async function request (obj = {}) {
  let [error, res] = await uni.request({
    url: obj.url,
    data: obj.data || {},
    method: obj.method ? `${obj.method}`.toUpperCase() : 'GET',
    header: {
      token
    }
  });
  if (error) {
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none',
      duration: 2000
    });
    return
  }
  res = res.data || {}
  return res
  // if (res.success) {
  //   return res
  // } else {
  //   uni.showToast({
  //     title: `服务器繁忙，请稍后重试（${res.errorCode}:${res.errorMessage}）`,
  //     duration: 2000,
  //     icon: 'none'
  //   });
  //   return false
  // }


  // else if ([406, 407, 500].includes(res.state)) {
  //   await getToken()
  //   return await request(obj)
  // }
}

