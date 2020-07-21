



// Await
export async function request (obj = {}) {
  let jwtToken  = 'Bearer ' + uni.getStorageSync('jwtToken') || '';
  let [error, res] = await uni.request({
    url: obj.url,
    data: obj.data || {},
    method: obj.method ? `${obj.method}`.toUpperCase() : 'GET',
    header: {
      Authorization: jwtToken
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
  console.log(res)
  if (res.success) {
    return res
  } else if(res.errorCode) {
    uni.showToast({
      title: `${res.errorCode}:${res.errorMessage}`,
      duration: 2000,
      icon: 'none'
    });
    return false
  } else {
    uni.showToast({
      title: `服务器繁忙，请稍后重试（${res.errorCode || ''}:${res.errorMessage || ''}）`,
      duration: 2000,
      icon: 'none'
    });
    return false
  }


  // else if ([406, 407, 500].includes(res.state)) {
  //   await getToken()
  //   return await request(obj)
  // }
}

