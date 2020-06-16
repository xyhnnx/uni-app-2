<template>
    <view class="content">
        <view class="page-title">{{(currentRoom && currentRoom.roomName) || '未关联房间'}}</view>
        <view class="height5"></view>

        <view class="text-area-box">
            <textarea placeholder="请输入内容..." @blur="bindTextAreaBlur" auto-height />
        </view>
        <view class="img-box">
            <view class="img-list">
                <view class="img-item" v-for="(item, index) in imageList" key="item">
                    <image mode="aspectFit" class="img" :src="item" alt=""/>
                    <view @click="delImg(index)" class="close">x</view>
                </view>
            </view>
            <view class="plus-box" @click="chooseImg" v-if="imageList.length === 0">
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
            <view class="input-row">
                <text class="title">类型</text>
                <m-input class="input" type="text" focus disabled v-model="email" placeholder="请选择"></m-input>
                <text class="iconfont icon-jiantouyou "></text>
            </view>
            <view class="input-row">
                <text class="title">户号</text>
                <m-input class="input" type="text" disabled v-model="email" placeholder="请选择"></m-input>
                <text class="iconfont icon-jiantouyou "></text>
            </view>
            <view class="input-row">
                <text class="title">联系人</text>
                <m-input class="input" type="text" v-model="email" placeholder="请输入"></m-input>
            </view>
            <view class="input-row">
                <text class="title">手机号</text>
                <m-input class="input" type="text" v-model="email" placeholder="请输入"></m-input>
            </view>
        </view>


        <view class="height10"></view>
        <view class="height10"></view>
        <view>
            <button type="primary" class="primary" @tap="findPassword">提交</button>
        </view>
    </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import service from '../../service.js';
  import * as api from '../../api/api'
  import mInput from '../../components/m-input.vue';
  import uniList from "@/components/uni-list/uni-list.vue"
  import uniListItem from "@/components/uni-list-item/uni-list-item.vue"

  export default {
    components: {
      mInput,
      uniList,
      uniListItem
    },
    data() {
      return {
        email: '',
        imageList: [],
        imgFileList: []
      }
    },
    computed: mapState(['forcedLogin', 'hasLogin', 'userName', 'roomList','currentRoom']),
    methods: {
      chooseImg () {
        uni.chooseImage({
          count: 4, //默认9
          success: (res) => {
            console.log(JSON.stringify(res.tempFilePaths));
            this.imageList = res.tempFilePaths
            this.imgFileList = res.tempFiles
          }
        });
      },
      delImg (i) {
        this.imageList.splice(i, 1)
        this.imgFileList.splice(i, 1)
      },
      findPassword() {
        uni.showToast({
          icon: 'none',
          title: 'xxx',
          duration: 3000
        });
        this.uploadImgItem()
      },
      bindTextAreaBlur: function (e) {
        console.log(e.detail.value)
      },
      // 上传文件
      async uploadImgItem() {
        api.uploadFile({
          files: this.imgFileList
        })
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
        padding: 20px;
        height: 80px;
        background-color: #fff;
    }
    .img-box{
        padding: 10px;
        background-color: #fff;
        .img-list{
            display: flex;
            overflow: auto;
            padding-top: 20px;
            .img-item{
                width: 100px;
                height: 100px;
                margin-right: 20px;
                border: 1px solid $uni-border-color;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                .close {
                    position: absolute;
                    right: -10px;
                    top: -10px;
                    color: #000;
                    border-radius: 5px;
                    width: 20px;
                    height: 20px;
                    flex: 14px;
                    line-height: 20px;
                    text-align: center;
                    background-color: red;
                }
            }
        }
        .plus-box {
            display: flex;
            align-items: center;
            .plus-btn {
                width: 100px;
                height: 100px;
                border: 1px solid $uni-border-color;
                font-size: 50px;
                color: $uni-border-color;
                text-align: center;
                line-height: 100px;
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
