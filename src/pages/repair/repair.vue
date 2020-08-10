<template>
    <view class="content">
        <ChangeRoomBtn v-if="!serviceId"></ChangeRoomBtn>
        <view class="height5"></view>

        <view class="text-area-box">
            <textarea placeholder="请输入内容..." v-model="formData.contentInfo" />
        </view>
        <view class="img-box">
            <view class="img-list">
                <view class="img-item" v-for="(item, index) in imageList" :key="item">
                    <image @click="lookImg(index,imageList)" mode="aspectFit" class="img" :src="getImgSrc(item)" alt=""/>
                    <view @click="delImg(index)" class="close">×</view>
                </view>
            </view>
            <view class="plus-box" @click="chooseImg" v-if="imageList.length < 4">
                <view class="plus-btn">
                    +
                </view>
                <view class="tip">
                    <view>添加照片</view>
                    <view>最多添加4张照片</view>
                </view>
            </view>
        </view>

        <view class="input-group">
            <!--1＝业主报修，2＝投诉-->
            <view class="input-row" v-if="!serviceId">
                <text class="title">类型</text>
                <m-input @click.native="serviceTypeClick" class="input" type="text" focus disabled v-model="formData.servicesTypeName" placeholder="请选择"></m-input>
                <text class="iconfont icon-jiantouyou "></text>
            </view>
            <view class="input-row" v-if="formData.servicesType === 1">
                <text class="title">报修类型</text>
                <m-input @click.native="repairTypeClick" class="input" type="text" focus disabled v-model="formData.repairName" placeholder="请选择"></m-input>
                <text class="iconfont icon-jiantouyou "></text>
            </view>
            <view class="input-row">
                <text class="title">户号</text>
                <m-input @click.native="roomClick" class="input" type="text" disabled v-model="formData.roomName" placeholder="请选择"></m-input>
                <text class="iconfont icon-jiantouyou "></text>
            </view>
            <view class="input-row">
                <text class="title">联系人</text>
                <m-input class="input" type="text" v-model="formData.contacts" placeholder="请输入"></m-input>
            </view>
            <view class="input-row">
                <text class="title">手机号</text>
                <m-input class="input" type="text" v-model="formData.contactsPhone" placeholder="请输入"></m-input>
            </view>
        </view>


        <view class="height10"></view>
        <view class="height10"></view>
        <view>
            <button type="primary" class="primary" @tap="submit">提交</button>
        </view>

        <!--报修or投诉-->
        <my-popup-select :list="serviceTypeList"
                         ref="refServiceType"
                         @pickerConfirm="pickerServiceTypeConfirm"
                         label-key="label">
        </my-popup-select>

        <!--报修类型-->
        <my-popup-select :list="repairTypeList"
                         ref="refRepair"
                         @pickerConfirm="pickerRepairTypeConfirm"
                         label-key="repairType">
        </my-popup-select>
        <!--户号-->
        <my-popup-select :list="roomListModal"
                         ref="refRoomList"
                         @pickerConfirm="pickerRoomConfirm"
                         label-key="roomName">
        </my-popup-select>
    </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import service from '../../service.js';
  import * as api from '../../api/api'
  import * as common from '../../common/common'
  import mInput from '../../components/m-input.vue';
  import uniList from "@/components/uni-list/uni-list.vue"
  import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
  import myPopupSelect from '@/components/my-components/my-popup-select'
  import ChangeRoomBtn from '../../common/change-room-btn'


  export default {
    components: {
      mInput,
      uniList,
      uniListItem,
      myPopupSelect,
      ChangeRoomBtn
    },
    data() {
      return {
        serviceId: '',
        email: '',
        imageList: [],
        formData: {
          "servicesType": 0,
          "servicesTypeName": '',
          "serviceTypeID": 0,
          repairName: '',
          "contentInfo": "",
          "contacts": "",
          "contactsPhone": "",
          "roomID": 0,
          "roomName": '',
          "photos": [
          ]
        },
        repairTypeList: [],
      }
    },
    computed: {
        ...mapState(['serviceTypeList', 'hasLogin', 'userName', 'roomList','currentRoom', 'userInfo']),
        roomListModal () {
            return this.roomList.filter(e => {
                return this.currentRoom.courtId === e.courtId
            })
        }
    },
    watch: {
        currentRoom () {
            this.formData.roomName = this.roomListModal[0] && this.roomListModal[0].roomName
            this.formData.roomID = this.roomListModal[0] && this.roomListModal[0].roomId
        }
    },
    methods: {
      getImgSrc (src = '') {
        if(src.startsWith('~')) {
          return `${this.$filePrefix}/${src.slice(1)}`
        } else {
          return src
        }
      },
      lookImg (index,list) {
        uni.previewImage({
          current: this.getImgSrc(list[index]),
          urls: list.map(e => this.getImgSrc(e))
        })
      },
      chooseImg () {
        uni.chooseImage({
          count: 4 - this.imageList.length, //默认9
          success: (res) => {
            this.imageList.push(...res.tempFilePaths)
            console.log(JSON.stringify(this.imageList))
          }
        });
      },
      async uploadFile () {

        let arr = []
        for(let i = 0;i < this.imageList.length; i++) {
          let src = this.imageList[i]
          if(src.startsWith('~')) {
            arr.push(
              new Promise(resolve => {
                resolve(src)
              })
            )
          } else {
            arr.push(common.uploadFileItem(src))
          }
        }

        return await Promise.all(arr)
      },
      delImg (i) {
        this.imageList.splice(i, 1)
      },
      async submit() {
        if (!this.formData.contentInfo) {
          uni.showToast({
            icon: 'none',
            title: '请输入内容！',
            duration: 3000
          });
          return
        }
        if (!this.formData.servicesType) {
          uni.showToast({
            icon: 'none',
            title: '请选择服务类型！',
            duration: 3000
          });
          return
        }
        if (this.formData.servicesType ===1 && !this.formData.serviceTypeID) {
          uni.showToast({
            icon: 'none',
            title: '请选择报修类型！',
            duration: 3000
          });
          return
        }
        if (!this.formData.roomID && !this.serviceId) {
          uni.showToast({
            icon: 'none',
            title: '请选择户号！',
            duration: 3000
          });
          return
        }

        if (!this.formData.contacts) {
          uni.showToast({
            icon: 'none',
            title: '请输入联系人！',
            duration: 3000
          });
          return
        }
        if (!this.formData.contactsPhone) {
          uni.showToast({
            icon: 'none',
            title: '请输入联系方式！',
            duration: 3000
          });
          return
        }
        let photos = await this.uploadFile();
        if(this.serviceId) {
          let res = await api.getServiceChangeService({
            serviceId: this.serviceId,
            ...this.formData,
            photos
          })
          if(res.success) {
            uni.showModal({
              title: '提示',
              content: '修改成功！',
              showCancel: false,
              success: (res3) => {
                if (res3.confirm) {
                  uni.reLaunch({
                    url: '/pages/main/main',
                  });
                }
              }
            });
          }
        } else {
          let res = await api.serviceInsert({
            ...this.formData,
            photos
          })
          if(res.success) {
            uni.showModal({
              title: '提示',
              content: '提交成功，请联系物业处理！',
              showCancel: false,
              success: (res3) => {
                if (res3.confirm) {
                  uni.reLaunch({
                    url: '/pages/main/main',
                  });
                }
              }
            });
          }
        }
      },
      bindTextAreaBlur: function (e) {
        this.formData.contentInfo = e.detail.value
      },
      async getRepairType () {
        let res = await api.getRepairType({
          courtId: this.currentRoom.courtId
        })
        this.repairTypeList = res.data
      },
      // 类型
      serviceTypeClick () {
        this.$refs.refServiceType.open()
      },
      // 报修类型
      async repairTypeClick () {
        await this.getRepairType()
        this.$refs.refRepair.open()
      },
      // 户号
      roomClick () {
        if(this.serviceId) {
          return
        }
        this.$refs.refRoomList.open()
      },


      // 类型-确认
      pickerServiceTypeConfirm (item) {
        this.$refs.refServiceType.close()
        this.formData.servicesTypeName = item.label
        this.formData.servicesType = item.value
      },
      // 报修类型-确认
      pickerRepairTypeConfirm (item) {
        this.$refs.refRepair.close()
        this.formData.repairName = item.repairType
        this.formData.serviceTypeID = item.serviceId
      },
      // 户号-确认
      pickerRoomConfirm (item) {
        this.$refs.refRoomList.close()
        this.formData.roomName = item.roomName
        this.formData.roomID = item.roomId
      },
      async getServiceGetDetail () {
        let res = await api.getServiceGetDetail({
          serviceId: this.serviceId
        })

        this.formData.contentInfo = res.data.contentInfo
        this.formData.servicesType = res.data.servicesType
        this.formData.roomName = res.data.roomName
        this.formData.contacts = res.data.contacts
        this.formData.contactsPhone = res.data.contactsPhone
        this.imageList = res.data.servicePhotos
        if(res.data.servicesType === 1) { // todo 不确定报修返回的字段是啥
          this.formData.repairName = res.data.repairName
          this.formData.serviceTypeID = res.data.serviceTypeID || res.data.serviceTypeID
        }
        // this.formData.roomID = res.data.roomId || (this.roomList && this.roomList.find(e => e.roomName == res.data.roomName) && this.roomList.find(e => e.roomName == res.data.roomName).roomId) || 1

        console.log(this.formData.servicesType)
      }
    },
    onLoad (e) {
      if (e && e.serviceId) {
        this.serviceId = e.serviceId
        this.getServiceGetDetail()
      } else {
        this.formData.contacts = this.userInfo.nickName
        this.formData.contactsPhone = this.userInfo.phoneNumber
          this.formData.roomName = this.roomListModal[0] && this.roomListModal[0].roomName
          this.formData.roomID = this.roomListModal[0] && this.roomListModal[0].roomId
      }
    }
  }
</script>

<style scoped lang="scss">
    .content {
        padding: 0;
    }
    .page-title {
        text-align: center;
        background-color: #fff;
        line-height: 45px;
    }

    .text-area-box {
        padding: 20px 10px 0;
        background-color: #fff;
        textarea {
            display: block;
            height: 80px;
            width: 100%;
        }
    }
    .img-box{
        padding: 10px;
        background-color: #fff;
        .img-list{
            width: calc(100vw - 20px);
            height: 100px;
            display: flex;
            overflow: auto;
            padding-top: 20px;
            .img-item{
                width: 80px;
                height: 80px;
                margin-right: 20px;
                border: 1px solid $uni-border-color;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                .img {
                    width: 100%;
                    height: 100%;
                }
                .close {
                    position: absolute;
                    right: -10px;
                    top: -10px;
                    border-radius: 10px;
                    width: 20px;
                    height: 20px;
                    flex: 14px;
                    line-height: 20px;
                    text-align: center;
                    background-color: red;
                    color: #fff;
                }
            }
        }
        .plus-box {
            margin-top: 5px;
            display: flex;
            align-items: center;
            .plus-btn {
                width: 60px;
                height: 60px;
                border: 1px solid $uni-border-color;
                font-size: 40px;
                color: $uni-border-color;
                text-align: center;
                line-height: 60px;
            }
            .tip {
                margin-left: 10px;
                color: $uni-text-color-grey;
            }
        }
    }
    .input-row {
        padding-top: 5px;
        padding-bottom: 5px;
        padding-right: 10px;
        border-bottom: 1px solid $uni-border-color;
        .input {
            text-align: right;
        }
        .iconfont {
            color: #bbb;
        }
    }
</style>
