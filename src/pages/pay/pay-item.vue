<!--缴费账单-->
<template>
    <view class="content">
        <view class="header">
            <view></view>
            <view>{{(payRoom && payRoom.courtName) || '未关联房间'}}：{{(payRoom && payRoom.roomName) || '未关联房间'}}</view>
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
                <uni-collapse-item class="collapse-box-item" :title="item.itemName" v-for="item in items" :key="item.value">
                    <view slot="title-left" @click.stop>
                        <checkbox @tap="itemClick" :data-item="item" color="#fb7349" :value="item.keyID" :checked="item.checked" />
                    </view>
                    <view slot="right" class="money">{{item.balance}}</view>
                    <view class="item-content">
                        <template v-if="item.isDaiShou">
                            <view class="item-content" v-for="detailItem in item.details">
                                <view>{{detailItem.paymentCycle}}</view>
                                <view>{{detailItem.chargeAmount}}</view>
                            </view>
                            <view class="item-content">
                                <view>应缴金额</view>
                                <view>{{item.balance}}</view>
                            </view>
                            <view class="item-content">
                                <view>可用余额</view>
                                <view>{{showCanMoney(item)}}</view>
                            </view>
                        </template>
                        <template v-else>
                            <view class="item-content" v-if="showSpace(item)">
                                <view>面积</view>
                                <view>{{item.floorSpace}}</view>
                            </view>
                            <view class="item-content">
                                <view>收费标准</view>
                                <view>{{item.chargingStandard}}</view>
                            </view>
                            <view class="item-content">
                                <view>上次缴止日期</view>
                                <view>{{item.lastBillDate}}</view>
                            </view>
                            <view class="item-content">
                                <view>缴费周期</view>
                                <view>{{item.paymentCycle}}</view>
                            </view>
                            <view class="item-content">
                                <view>应缴金额</view>
                                <view>{{item.balance}}</view>
                            </view>
                            <view class="item-content">
                                <view>可用余额</view>
                                <view>{{showCanMoney(item)}}</view>
                            </view>
                        </template>
                    </view>
                </uni-collapse-item>
            </uni-collapse>
        </checkbox-group>
        <view style="height: 70px;"></view>
        <view class="flex-bottom">
            <view class="left">
                <text class="label">合计：</text>
                <text class="value">￥{{total}}</text>
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
      payRoom () {
        return this.roomList.find(e => `${e.roomId}` === `${this.query.roomId}`)
      },
      total () {
        let total = 0
        this.items.filter(e => e.checked).forEach(e=>{
          let realChargeBalance = e.currentCanBalance>=e.balance ? 0 : ((e.balance || 0) - (e.currentCanBalance || 0))
          total += Number(realChargeBalance)
        })
        return total.toFixed(2)
      }
    },
    data() {
      return {
        query: {
          roomId: 361111
        },
        detail: {},
        items: [],
        checkAll: false,
        chargeIdStr: [],
        daiShouIdStr: [],
        timer: 0
      }
    },
    methods: {
      ...mapMutations(['setStateData']),
      // 获取
      showCanMoney (item) {
        if(item.checked) {
          return item.currentCanBalance>=item.balance?item.balance:item.currentCanBalance
        }else {
         return 0
        }
      },
      // 显示面积
      showSpace (item) {
        if(`${item.itemName}`.includes('车位')) {
          return false
        }
        return true
      },
      async getNoticeDetail() {
        let res = await api.getNoticeDetail({
          noticeId: this.query.noticeId
        })
        if (res && res.success) {
          this.detail = res.data || {}
        }
      },
      toDetail () {
        let payList = this.items.filter(e => e.checked)
        if(payList.length) {
          const url = util.webUrlSplicing(
            '/pages/pay/pay-detail',
            {
              total: this.total,
              chargeIdStr: this.chargeIdStr,
              roomId: this.query.roomId

            }
          )
          //在起始页面跳转到test.vue页面并传递参数
          uni.navigateTo({
            url
          });
        } else {
          uni.showToast({
            icon: 'none',
            title: '请选择要缴费的项目!'
          });
        }

      },
      async getRoomChargeItemDatas () {
        let res = await api.getRoomChargeItemDatas({
          roomId: this.query.roomId
        })
        if(res && res.success) {
          this.items = res.data

        }
      },
      checkAllClick () {
        var items = this.items
        let isCheckAll = items.every(e=> e.checked)
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
          const item = items[i]
          this.$set(item,'checked',!isCheckAll)
          this.itemClick({currentTarget:{dataset:{item:item}}})
        }
      },
      itemClick (e) {
        let item = e.currentTarget.dataset.item
        let keyID = item.keyID
        item = this.items.find(e => e.keyID === keyID)
        let checked = item.checked
        if(checked) {
          this.chargeIdStr.push(keyID)
        } else {
          let index = this.chargeIdStr.findIndex(e=> e === keyID)
          if(index>-1) {
            this.chargeIdStr.splice(index, 1)
          }
        }
        this.getRoomChargeBalance()
      },
      async getRoomChargeBalance () {
        clearTimeout(this.timer)
        this.timer = setTimeout(async ()=>{
          let chargeIdStr = [ // 选中的放前面
            ...this.chargeIdStr,
            ...this.items.filter(e => !e.checked).map(e => e.keyID)
          ]
          let res = await api.getRoomChargeBalance({
            roomId: this.query.roomId,
            chargeIdStr: chargeIdStr.join(',')
          })
          if (res && res.success) {
            let data = res.data
            data.forEach(e => {
              let item = this.items.find(e2 => e2.keyID === e.keyID)
              this.$set(item,'currentCanBalance', e.currentCanBalance)
            })
          }
        },100)
      },
      checkboxChange (e) {
        var items = this.items,
          values = e.detail.value;
        for (var i = 0, lenI = items.length; i < lenI; ++i) {
          const item = items[i]
          if(values.includes(`${item.keyID}`)){
            this.$set(item,'checked',true)
          }else{
            this.$set(item,'checked',false)
          }
        }
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
            margin-bottom: 5px;
            background-color: #fff;
            .money {
                margin-right: 5px;
                color: $uni-color-primary;
            }
            .item-content {
                background-color: #fff;
                padding: 5px 10px 5px 20px;
                .item-content {
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    color: $uni-text-color-grey;
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
        background-color: #fff;
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
