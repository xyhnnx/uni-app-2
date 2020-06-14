import {request} from './fetch.js'

const apiHost = 'http://47.98.255.154:4399'

// 登录
export async function login(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/Login/Login`,
  });
}
// 3.获取广告接口
export async function getAdvert(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/Login/GetAdvert`,
  });
}



