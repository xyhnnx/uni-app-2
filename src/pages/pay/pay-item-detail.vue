<!--缴费账单-->
<template>
    <view class="content">
        <view class="header">
            <view></view>
            <view>{{(detail && detail.courtName) || ''}}</view>
        </view>
        <view class="content-box">
            <view class="item">
                <view class="label">户号</view>
                <view class="value">{{detail.roomName}}</view>
            </view>
            <view class="item">
                <view class="label">缴费项目</view>
                <view class="value">{{detail.itemName}}</view>
            </view>
            <view class="item" v-if="detail.realLastPayDate">
                <view class="label">缴费周期</view>
                <view class="value">{{getTime2(detail.realLastPayDate)}}~{{getTime2(detail.realStopPayDate)}}</view>
            </view>
            <view class="item" v-if="detail.realMoney">
                <view class="label">应缴金额</view>
                <view class="value red">{{detail.realMoney}}</view>
            </view>
            <view class="item" v-if="detail.yueMoney">
                <view class="label">余额支付</view>
                <view class="value red">{{detail.yueMoney}}</view>
            </view>
            <view class="item">
                <view class="label">实缴金额</view>
                <view class="value red">{{detail.realAllMoney}}</view>
            </view>
            <view class="item" v-if="detail.tradeNo">
                <view class="label">订单号</view>
                <view class="value">{{detail.tradeNo}}</view>
            </view>
            <view class="item" v-if="detail.payNo">
                <view class="label">流水号</view>
                <view class="value">{{detail.payNo}}</view>
            </view>
            <view class="item">
                <view class="label">结算方式</view>
                <view class="value">{{detail.settleType}}</view>
            </view>
            <view class="item">
                <view class="label">来源</view>
                <view class="value">{{detail.paySource}}</view>
            </view>
            <view class="item">
                <view class="label">凭证号</view>
                <view class="value">{{detail.voucherNo}}</view>
            </view>
            <view class="item">
                <view class="label">缴费时间</view>
                <view class="value">{{detail.chargeTime}}</view>
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
          total += Number(e.realChargeBalance)
        })
        return total.toFixed(2)
      }
    },
    data() {
      return {
        query: {
          payNo: '202002121045186384748'
        },
        detail: {},
        items: [],
        checkAll: false
      }
    },
    methods: {
      ...mapMutations(['setStateData']),
      getTime2 (e) {
        return util.dateFormat(new Date(e).getTime(),'yyyy-MM-dd') || ''
      },
      async getPaymentGetDetail() {
        let res = await api.getPaymentGetDetail({
          payNo: this.query.payNo
        })
        if (res.success) {
          this.detail = res.data || {}
        }
      },
    },
    onLoad(e) {
      this.query = e
      this.getPaymentGetDetail()
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
    .content-box {
        background-color: #fff;
        margin-top: 5px;
        padding: 0 10px;
        .item{
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid $uni-border-color;
            line-height: 48px;
            .label{
                color: #333;
            }
            .value{
                color: #666;
            }
            .red{
                color: red;
            }
        }
    }
</style>
