import {request} from './fetch.js'

const apiHost = 'http://bsb_test.962460.com'

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
// 6.我的报修列表Url+/ api/ Service/GetList
export async function getServiceList(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/Service/GetList`,
  });
}

// /api/Notice/GetList
// 根据openid和小区id获取公告
export async function getNoticeList(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/Notice/GetList`,
  });
}
///api/Notice/GetDetail
// 获取公告详情
export async function getNoticeDetail(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/Notice/GetDetail`,
  });
}

///api/PayCall/GetList
// 获取催缴列表
export async function getPayCallList(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/PayCall/GetList`,
  });
}

///api/PayCall/GetDetail
// 获取催缴详情
export async function getPayCallDetail(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/PayCall/GetDetail`,
  });
}
