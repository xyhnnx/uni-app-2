<template>
    <view>
        <button @click="showActionSheet">{{(currentRoom && currentRoom.courtName) || '未关联房间'}}</button>
        <!--房产-->
        <my-popup-select :list="list"
                         ref="refRooms"
                         @pickerConfirm="confirmClick"
                         label-key="label">
        </my-popup-select>
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
  import myPopupSelect from '@/components/my-components/my-popup-select'

  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    components: {
      UniSegmentedControl,
      UniList,
      UniListItem,
      NoData,
      myPopupSelect
    },
    computed: {
      ...mapState(['primaryColor', 'serviceTypeList', 'hasLogin', 'userName', 'roomList', 'currentRoom']),
    },
    data() {
      return {
        query: {},
        detail: {},
        list: [],
        courtList: []
      }
    },
    props: {
      readOnly: Boolean
    },
    methods: {
      ...mapMutations(['setStateData']),
      confirmClick (item) {
          this.$refs.refRooms.close()
          this.setStateData({
              currentRoom: this.courtList[item.value]
          })
      },
      showActionSheet () {
        if (this.readOnly) {
          return
        }
        let arr = []
        this.roomList.forEach(e=>{
          if(!arr.some(e2=>e2.courtId === e.courtId)) {
              arr.push(e)
          }
        })
        this.courtList = arr
        this.list = arr.map((e, index) => {
            return {
                label: e.courtName,
                value: index
            }
        })
        this.$refs.refRooms.open()
        // uni.showActionSheet({
        //   itemList: arr.map(e => e.courtName),
        //   success: (res) => {
        //     this.setStateData({
        //       currentRoom: arr[res.tapIndex]
        //     })
        //   },
        //   fail: function (res) {
        //     console.log(res.errMsg);
        //   }
        // });
      },
    },
  }
</script>

<style scoped lang="scss">
</style>
