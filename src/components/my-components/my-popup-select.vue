<template>
    <!--区域选择-->
    <uni-popup ref="popup" type="bottom">
        <div class="picker-view-wrap">
            <div class="btn-box">
                <div class="btn" @click="pickerClick(0)">取消</div>
                <div class="btn primary" @click="pickerClick(1)">确认</div>
            </div>
            <picker-view class="my-picker-view"
                         indicator-class="indicator-row"
                         indicator-style="height:50px;"
                         :value="value"
                         @pickstart="pickerStart"
                         @pickend="pickerEnd"
                         @change="bindChange">
                <picker-view-column>
                    <view class="item" v-for="(item,index) in listModel" :key="index">{{item.label}}</view>
                </picker-view-column>
            </picker-view>
        </div>
    </uni-popup>
</template>

<script>
  export default {
    name: "my-popup-select",
    props: {
      list: {
        type: Array,
        default: []
      },
      value: {
        type: [Number, String],
        default: ''
      },
      labelKey: {
        type: String,
        default: 'label'
      },
      valueKey: {
        type: String,
        default: 'value'
      }
    },
    data() {
      return {
        selectIndex: 0,
        pickerIng: false
      }
    },
    computed: {
      listModel () {
        if (this.list && this.list.length) {
          return this.list.map(e => {
            return {
              label: e[this.labelKey],
              value: e[e.valueKey]
            }
          })
        }
        return []
      }
    },
    methods: {
      open() {
        this.pickerIng = false
        this.$refs.popup.open()
      },
      close() {
        this.$refs.popup.close()
        this.pickerIng = false
      },
      pickerStart () {
          this.pickerIng = true
      },
      pickerEnd () {
          this.pickerIng = false
      },
      bindChange(val) {
        this.selectIndex = val.detail.value
      },
      pickerClick (val) {
        if (val) {
          if(this.pickerIng) {
              return
          }
          this.$emit('pickerConfirm', this.list[this.selectIndex])
        } else {
          this.close()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
    .primary{
        color: $uni-color-primary;
    }
    .picker-view-wrap {
        background-color: #fff;
        height: 300px;
        .btn-box {
            height: 50px;
            display: flex;
            justify-content: space-between;
            .btn {
                line-height: 50px;
                padding: 0 20px;
            }
        }
    }

    .indicator-row {
        height: 50px;
        font-weight: bold;
        border-top: 1px solid red;
        border-bottom: 1px solid $uni-border-color;
    }
    .my-picker-view {
        height: 250px;
    }

    .item {
        line-height: 50px;
        text-align: center;
    }
</style>
