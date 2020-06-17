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
// 3.上传文件
export async function uploadFile(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/Upload/uploadfile`,
  });
}
//
// 获取报修类型
export async function getRepairType(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/Service/GetRepairType`,
  });
}
//
// 插入报修/投诉单
export async function serviceInsert(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/Service/Insert`,
  });
}


