<template>
    <view>
        <button @click="showActionSheet">{{(currentRoom && currentRoom.courtName) || '未关联房间'}}</button>
    </view>
</template>

<script>
  import * as api from '../api/api'
  import * as common from './common'
  import * as util from './util'
  import UniSegmentedControl from '../components/uni-segmented-control/uni-segmented-control'
  import UniList from '../components/uni-list/uni-list'
  import UniListItem from '../components/uni-list-item/uni-list-item'
  import NoData from '../components/my-components/no-data'
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
      showActionSheet () {
        let arr = []
        this.roomList.forEach(e=>{
          if(!arr.some(e2=>e2.courtId === e.courtId)) {
            if(arr.length<=6) {
              arr.push(e)
            }
          }
        })
        uni.showActionSheet({
          itemList: arr.map(e => e.courtName),
          success: (res) => {
            this.setStateData({
              currentRoom: arr[res.tapIndex]
            })
          },
          fail: function (res) {
            console.log(res.errMsg);
          }
        });
      },
    },
  }
</script>

<style scoped lang="scss">
</style>
