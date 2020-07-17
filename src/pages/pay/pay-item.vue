<!--缴费账单-->
<template>
    <view class="content">
        <view class="header">
            <view></view>
            <view>中建大关：101号房</view>
        </view>
        <view class="select-all-box">
            <view class="tip">请选择要缴费的项目</view>
            <view class="select-box">
                <text @click="checkAllClick">全选</text>
            </view>
        </view>


        <checkbox-group @change="checkboxChange">
            <!-- 手风琴效果accordion="true" -->
            <uni-collapse class="collapse-box">
                <uni-collapse-item class="collapse-box-item" :title="item.name" v-for="item in items" :key="item.value">
                    <view slot="title-left" @click.stop>
                        <checkbox :value="item.value" :checked="item.checked" />
                    </view>
                    <view slot="right" class="money">100</view>
                    <view class="item-content">
                        <view class="item-content">
                            <view>面积</view>
                            <view>收费标准</view>
                        </view>
                        <view class="item-content">
                            <view>面积</view>
                            <view>收费标准</view>
                        </view>
                    </view>
                </uni-collapse-item>
            </uni-collapse>
        </checkbox-group>
        <view class="flex-bottom">
            <view class="left">
                <text class="label">合计：</text>
                <text class="value">￥2222</text>
            </view>
            <view class="right" @click="toDetail">
                付款
            </view>
        </view>
    </view>
</template>

<script>
  import * as api from '../../api/api'
  import * as common from '../../common/common'
  import * as util from '../../common/util'
  import UniSegmentedControl from '../../components/uni-segmented-control/uni-segmented-control'
  import UniList from '../../components/uni-list/uni-list'
  import UniListItem from '../../components/uni-list-item/uni-list-item'
  import NoData from '../../components/my-components/no-data'
  import ChangeRoomBtn from '../../common/change-room-btn'
  import uniCollapse from '../../components/uni-collapse/uni-collapse.vue'
  import uniCollapseItem from '../../components/uni-collapse-item/uni-collapse-item.vue'

  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    components: {
      UniSegmentedControl,
      UniList,
      UniListItem,
      ChangeRoomBtn,
      NoData,
      uniCollapse,
      uniCollapseItem
    },
    computed: {
      ...mapState(['primaryColor', 'serviceTypeList', 'hasLogin', 'userName', 'roomList', 'currentRoom']),
    },
    data() {
      return {
        query: {
          roomId: 361111
        },
        detail: {},
        items: [{
          value: 'USA',
          name: '费用1'
        },
          {
            value: 'CHN',
            name: '费用1',
            checked: 'true'
          },
          {
            value: 'BRA',
            name: '费用2'
          },
          {
            value: 'JPN',
            name: '费用3'
          },
          {
            value: 'ENG',
            name: '费用4'
          },
          {
            value: 'FRA',
            name: '费用5'
          }
        ],
        checkAll: false
      }
    },
    methods: {
      ...mapMutations(['setStateData']),
      async getNoticeDetail() {
        let res = await api.getNoticeDetail({
          noticeId: this.query.noticeId
        })
        if (res.success) {
          this.detail = res.data || {}
        }
      },
      toDetail () {
        //在起始页面跳转到test.vue页面并传递参数
        uni.navigateTo({
          url: '/pages/pay/pay-detail'
        });
      },
      async getRoomChargeItemDatas () {
        let res = await api.getRoomChargeItemDatas({
          roomId: this.query.roomId
        })
        console.log(res)
        if(res.success) {

        }
      },
      checkAllClick () {
        var items = this.items
        let isCheckAll = items.every(e=> e.checked)
        for (var i = 0, lenI = items.length; i < lenI; ++i) {
          const item = items[i]
          this.$set(item,'checked',!isCheckAll)
        }
      },
      checkboxChange: function (e) {
        var items = this.items,
          values = e.detail.value;
        for (var i = 0, lenI = items.length; i < lenI; ++i) {
          const item = items[i]
          if(values.includes(item.value)){
            this.$set(item,'checked',true)
          }else{
            this.$set(item,'checked',false)
          }
        }
        console.log(this.items.filter(e => !!e.checked))
      }
    },
    onLoad(e) {
      console.log(e)
      this.query = e
      this.getRoomChargeItemDatas()
    }
  }
</script>

<style scoped lang="scss">
    .header {
        height: 48px;
        background-color: #fff;
        padding: 0 10px;
        line-height: 48px;
        .img{

        }
    }
    .select-all-box {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        .tip {
            color: $uni-text-color-grey-2;
        }
    }
    .card-box{
        background-color: #fff;
        margin: 20px 10px;
    }
    .list-item{

    }
    .collapse-box {
        .collapse-box-item {
            .money {
                margin-right: 5px;
            }
            .item-content {
                padding: 10px;
                .item-content {
                    display: flex;
                    justify-content: space-between;
                    color: $uni-text-color-grey-2;
                    font-size: 12px;
                }
            }
        }
    }
    .flex-bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 48px;
        display: flex;
        box-shadow: rgba(0, 0, 0, 0.4) 0px 1px 3px 0px;
        padding-left: 10px;
        .left {
            flex: 1;
            line-height: 48px;
            .label {
                color: rgb(0, 145, 253);
            }
            .value {
                color: red;
            }
        }
        .right {
            width: 80px;
            text-align: center;
            height: 100%;
            line-height: 48px;
            color: #fff;
            background-color: $uni-color-primary;
        }

    }
</style>
