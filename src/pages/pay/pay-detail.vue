<template>
    <view class="content">
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
    },
    data() {
      return {
        query: {},
        detail: {}
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
    },
    onLoad(e) {
      this.query = e
      // d获取公告
      this.getNoticeDetail()
    }
  }
</script>

<style scoped lang="scss">
</style>
