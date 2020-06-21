<template>
    <view class="content">
        <view class="title">{{detailModal.title}}</view>
        <view class="time">发布时间：{{detailModal.time}}</view>
        <view class="info">{{detailModal.contentInfo}}</view>
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
      detailModal () {
        return {
          title: this.detail.title,
          time: util.dateFormat(new Date(this.detail.payCallTm).getTime()),
          contentInfo: this.detail.content
        }
      }
    },
    data() {
      return {
        query: {},
        detail: {}
      }
    },
    methods: {
      ...mapMutations(['setStateData']),
      async getPayCallDetail() {
        let res = await api.getPayCallDetail({
          payCallId: this.query.payCallId
        })
        if (res.success) {
          this.detail = res.data || {}
        }
      }
    },
    onLoad(e) {
      this.query = e
      // d获取公告/催缴通知 详情
      this.getPayCallDetail()

      // 催缴通知
    }
  }
</script>

<style scoped lang="scss">
    .content {
        padding: 10px;
    }
    .title {
        font-size: 20px;
    }
    .time {
        font-size: 12px;
        color: $uni-text-color-placeholder;
    }
    .info {
        padding-top: 10px;
        color: $uni-color-subtitle;
    }
</style>
