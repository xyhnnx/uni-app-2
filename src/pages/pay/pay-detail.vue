<template>
    <view class="content">
        <view class="card-box">
            <view class="label">
                待缴金额
            </view>
            <view class="value">
                ￥{{query.total || 0}}
            </view>
            <view class="text">
                小区室号：{{payRoom.courtName ||''}}-{{payRoom.roomName||''}}
            </view>
            <view class="text">
                收款单位：{{payRoom.companyName}}
            </view>
        </view>
        <view class="btn-box">
            <button type="primary" class="radius" @click="pay">立即缴费</button>
        </view>
        <view class="fixed-bottom">
            数据来源于江苏百事帮电子商务有限公司
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
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    components: {
      UniSegmentedControl,
      UniList,
      UniListItem,
      NoData
    },
    computed: {
      ...mapState(['primaryColor', 'serviceTypeList', 'hasLogin', 'userName', 'roomList', 'currentRoom']),
      payRoom () {
        return this.roomList.find(e => `${e.roomId}` === `${this.query.roomId}`)
      },
    },
    data() {
      return {
        query: {},
        detail: {},
        orderData: {},
        qryAcqSsn: '',
        isPaySuccessed: false
      }
    },
    methods: {
      ...mapMutations(['setStateData']),
      async getQryAcqSsn() {
        let res = await api.getQryAcqSsn({
          roomId: this.query.roomId,
          chargeIdStr: this.query.chargeIdStr,
        })
        console.log(res)
        if(res.success) {
          this.qryAcqSsn = res.data.qryAcqSsn
          this.isPaySuccessed = res.data.isPaySuccessed
        }
      },
      async paymentBill() {
        let res = await api.paymentBill({
          roomId: this.query.roomId,
          chargeIdStr: this.query.chargeIdStr,
          qryAcqSsn: this.qryAcqSsn,
        })
        if(res.success) {
          this.orderData = res.data
          return true
        }
        return false
      },
      tolist () {
        const url = util.webUrlSplicing(
          '/pages/pay/pay-list',
          {
          }
        )
        //在起始页面跳转到test.vue页面并传递参数
        uni.reLaunch({
          url
        });
      },
      async paidLog () {
        let res = await api.paidLog({
          roomId: this.query.roomId,
          chargeIdStr: this.query.chargeIdStr,
          qryAcqSsn: this.qryAcqSsn,
        })
      },
      async pay () {
        uni.showLoading({
          title: '请稍后...'
        });
        await this.getQryAcqSsn()
        if(this.isPaySuccessed) {
          // this.paidLog()
          await uni.showModal({
            title: '提示',
            content: '支付成功！',
            showCancel: false
          });
          console.log('支付成功---isPaySuccessed=true')
          uni.hideLoading()
          this.tolist()
        } else { // 用的余额支付；实际支付金额为0
          let success = false
          for(let i = 0;i< 5;i++) {
            success = await this.paymentBill()
            if(success) {
              break
            } else {
              await util.timeout(2000)
            }
          }
          uni.hideLoading()
          let jsApiModel = this.orderData.jsApiModel || {}
          wx.requestPayment({
            ...jsApiModel,
            package: jsApiModel.packAge,
            success: async (res) => {
              this.paidLog()
              await uni.showModal({
                title: '提示',
                content: '支付成功！',
                showCancel: false
              });
              console.log('支付成功',res)
              this.tolist()
            },
            async fail (res) {
              await uni.showModal({
                title: '提示',
                content: '支付失败，请重试！',
                showCancel: false
              })
              console.log('支付失败',res)
            }
          })
        }

      }

    },
    onLoad(e) {
      this.query = e
    }
  }
</script>

<style scoped lang="scss">
    .card-box {
        padding: 40px;
        margin: 40px 20px;
        text-align: center;
        background-color: #fff;
        .label {
            font-size: 18px;
            margin-bottom: 5px;

        }
        .value {
            font-size: 20px;
            color: $uni-color-primary;
            margin-bottom: 20px;
        }
        .text {
            line-height: 25px;
            font-size: 14px;
        }
    }
    .btn-box {
        padding: 0 20px;
    }
    .fixed-bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        line-height: 40px;
        color: $uni-text-color-grey-2;
        font-size: 12px;
    }
</style>
