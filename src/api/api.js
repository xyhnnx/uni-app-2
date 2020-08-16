import {request} from './fetch.js'

const apiHost = 'http://bsb_test.962460.com'

// 登录
export async function login(data) {
  return await request({
    method: "post",
    hideErrorMsg: true,
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
// 6.我的报修详情
export async function getServiceGetDetail(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/Service/GetDetail`,
  });
}
// 6.我的报修详情-修改
export async function getServiceChangeService(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/Service/ChangeService`,
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
// 9.报修设置状态
export async function setServiceStatus(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/Service/UpdateStatus`,
  });
}
// 12.删除报修
export async function deleteService(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/Service/Delete`,
  });
}
// 17.获取缴费列表
export async function getRoomChargeItemDatas(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/PaymentBill/GetRoomChargeItemDatas`,
  });
}
// 19 根据小区id获取小区下房产信息
export async function getUserRoom(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/User/GetRoom`,
  });
}

// 15.我的历史缴费列表
export async function getPaymentBillList(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/PaymentBill/GetList`,
  });
}

// 16.我的缴费详情
export async function getPaymentGetDetail(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/PaymentBill/GetDetail`,
  });
}

// /api/User/GetUserInfo
export async function getUserInfo(data) {
  return await request({
    method: "post",
    data,
    hideErrorMsg: true,
    url: `${apiHost}/api/User/GetUserInfo`,
  });
}
// /api/User/UpdateUserInfo
export async function updateUserInfo(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/User/UpdateUserInfo`,
  });
}
// /api/User/UpdateUserInfo
export async function getRoomChargeBalance(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/PaymentBill/GetRoomChargeBalance`,
  });
}
//
export async function deleteUserRoomInfo(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/User/DeleteUserRoomInfo`,
  });
}
//
// 创建光大银行订单
export async function getQryAcqSsn(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/PaymentBill/GetQryAcqSsn`,
  });
}
// /api/PaymentBill/Pay
// 创建光大银行付款接口
export async function paymentBill(data) {
  return await request({
    method: "post",
    data,
    url: `${apiHost}/api/PaymentBill/Pay`,
  });
}
