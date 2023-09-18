<template>
  <div class="db-transfer">
    <div
      class="db-transfer__left"
      :class="{
        'expand-transfer': isExpandStatus,
        'base-width': !isExpandStatus
      }"
    >
      <div class="transfer-box-header transparent">
        {{ leftTitle }}
      </div>
      <div class="transfer-box-filter">
        <slot name="filterLeft"></slot>
      </div>
      <el-input
        class="search-input"
        v-model.trim="searchLeftValue"
        placeholder="请输入查询关键字"
        clearable
        :prefix-icon="IconSearch"
      />
      <div class="transfer-box-body">
        <TransferScroller
          :defaultCheckedList="defaultCheckedLeftList"
          v-slot="{ item }"
          v-model="checkedLeftList"
          :data-list="showLeftData"
          :keyProp="keyProp"
          :labelProp="labelProp"
        >
          <div
            class="cellContentChildren"
            :class="{
              checked: getIndexByChecked(checkedLeftList, item) > -1
            }"
          >
            <yab-tips
              :name="item[labelProp]"
              class="name"
              styleClass="tool-tip-popper-class"
            >
            </yab-tips>
            <yab-tips
              :name="item[subInfoProp]"
              class="subInfo"
              styleClass="subInfo-class"
            >
            </yab-tips>
          </div>
        </TransferScroller>
      </div>
      <div class="transfer-box-footer">
        <div>
          <TransferCheck
            ref="leftCheckRef"
            :dataList="showLeftData"
            :checkedList="checkedLeftList"
            @checkedChange="handleCheckedLeft"
            :footerFormat="footerFormat"
          ></TransferCheck>
        </div>
      </div>
    </div>
    <div class="db-transfer__center">
      <div class="center-action">
        <el-button
          type="primary"
          size="small"
          :disabled="!checkedLeftList.length"
          @click="handlePushRight()"
        >
        右➡️
        </el-button>
      </div>
      <div class="center-action">
        <el-button
          type="primary"
          size="small"
          :disabled="!checkedRightList.length"
          @click="handlePushLeft()"
        >
        左⬅️
        </el-button>
      </div>
    </div>
    <div
      class="db-transfer__right"
      :class="{
        'expand-transfer': isExpandStatus,
        'base-width': !isExpandStatus
      }"
    >
      <div class="transfer-box-header transparent">
        {{ props.rightTitle }}
      </div>
      <div class="transfer-box-filter">
        <slot name="filterRight"></slot>
      </div>
      <el-input
        class="search-input"
        v-model.trim="searchRightValue"
        placeholder="请输入查询关键字"
        clearable
        :prefix-icon="IconSearch"
      />

      <div class="transfer-box-body">
        <TransferScroller
          :defaultCheckedList="defaultCheckedRightList"
          v-slot="{ item }"
          v-model="checkedRightList"
          :data-list="showRightListData"
          :keyProp="keyProp"
          :labelProp="labelProp"
        >
          <div class="cellContentChildren">
            <yab-tips
              :name="item[labelProp]"
              class="name"
              styleClass="tool-tip-popper-class"
            >
            </yab-tips>
            <yab-tips
              :name="item[subInfoProp]"
              class="subInfo"
              styleClass="subInfo-class"
            >
            </yab-tips>
          </div>
        </TransferScroller>
      </div>
      <div class="transfer-box-footer">
        <TransferCheck
          ref="rightCheckRef"
          :dataList="showRightListData"
          :checkedList="checkedRightList"
          @checkedChange="handleCheckedRight"
          :footerFormat="footerFormat"
        ></TransferCheck>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Transfer">
import {computed, ref, watch} from 'vue'
import { Search as IconSearch } from '@element-plus/icons-vue'
import TransferScroller from './TransferScroller.vue'
import TransferCheck from './transfer-check.vue'
import YabTips from './yab-tips/index.vue'
import { isFunction } from 'element-plus/es/utils/types'
import { TransferTypeEnum, TransFerEmits, Props, transferProps } from './types'
const emit = defineEmits(TransFerEmits)

const props = withDefaults(defineProps<Props>(), transferProps)

const leftList: any = ref([])
const rightList: any = ref([])
//ref
const leftCheckRef = ref()
const rightCheckRef = ref()

watch(
  () => props.left,
  (val) => {
    leftList.value = val
  },
  {
    deep: true,
    immediate: true
  }
)
watch(
  () => props.right,
  (val) => {
    rightList.value = val
  },
  {
    deep: true,
    immediate: true
  }
)

const getIndexByChecked = (checkedList: any, target: any) => {
  const index = checkedList.findIndex((checkedItem:any) => {
    return checkedItem[props.keyProp] === target[props.keyProp]
  })
  return index
}

const checkedLeftList = ref([])
const checkedRightList = ref([])

//全选逻辑
const handleCheckedLeft = (val: any) => {
  checkedLeftList.value = val
}
const handleCheckedRight = (val: any) => {
  checkedRightList.value = val
}

/**
 * 1、将左侧选中数据添加到右侧
 * 2、清空左选中
 * 3、去除已选中数组
 *
 */
const handlePushRight = () => {
  rightList.value.push(...checkedLeftList.value)
  checkedLeftList.value.forEach((checkedItem) => {
    const index = getIndexByChecked(leftList.value, checkedItem)
    leftList.value.splice(index, 1)
  })

  checkedLeftList.value = []
}

/**
 * 1、将右侧选中数据移除
 * 2、清空右选中
 */
const handlePushLeft = () => {
  leftList.value.push(...checkedRightList.value)
  checkedRightList.value.forEach((checkedItem) => {
    const index = getIndexByChecked(rightList.value, checkedItem)
    rightList.value.splice(index, 1)
  })
  checkedRightList.value = []
}

// search
const searchRightValue = ref('')
const searchLeftValue = ref('')

watch([() => searchLeftValue.value], () => {
  searchValueChange(searchLeftValue, TransferTypeEnum.LEFT)
})
watch([() => searchRightValue.value], () => {
  searchValueChange(searchRightValue, TransferTypeEnum.RIGHT)
})

// 最终显示在页面的值
const showLeftData = computed(() => {
  if (searchLeftValue.value) {
    return leftList.value.filter((item: { [x: string]: any }) => {
      if (isFunction(props.filterMethod)) {
        return props.filterMethod(
          searchLeftValue.value,
          item,
          TransferTypeEnum.LEFT
        )
      } else {
        const label = String(item[props.labelProp])
        return label.toLowerCase().includes(searchLeftValue.value.toLowerCase())
      }
    })
  } else {
    return leftList.value
  }
})
const showRightListData = computed(() => {
  if (searchRightValue.value) {
    return rightList.value.filter((item: { [x: string]: any }) => {
      if (isFunction(props.filterMethod)) {
        return props.filterMethod(
          searchRightValue.value,
          item,
          TransferTypeEnum.RIGHT
        )
      } else {
        const label = String(item[props.labelProp])
        return label
          .toLowerCase()
          .includes(searchRightValue.value.toLowerCase())
      }
    })
  } else {
    return rightList.value
  }
})

const searchValueChange = (val: Ref<string>, type: TransferTypeEnum) => {
  emit('search', val.value, type)
}

const isExpandStatus = ref(false)

const changeSize = (value: boolean) => {
  isExpandStatus.value = value
}
defineExpose({
  changeSize
})
</script>

<style lang="scss" scoped>
* {
  border: 0;
  padding: 0;
  box-sizing: border-box;
}

.db-transfer {
  display: flex;
  width: 100%;
  background: #fff;
  font-family: PingFangSC-Regular, PingFang SC;
  .db-transfer__center {
    width: 100px;
    .center-action {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    // &:deep() {
    .el-button {
      width: 40px;
      height: 36px;
      font-size: 18px;
      padding-top: 4px;
      padding-bottom: 4px;
    }
    .el-button.is-disabled {
      background-color: #f0f2f6;
      border-color: #dcdfe6;
      color: #909399;
    }
  }
  .db-transfer__left,
  .db-transfer__center,
  .db-transfer__right {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .base-width {
    min-width: 328px;
    height: 382px;
  }
  .expand-transfer {
    min-width: 542px;
    height: 490px;
  }
  .db-transfer__left,
  .db-transfer__right {
    flex: 1;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }
  .transfer-box-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 13px;
    font-size: 14px;
    font-weight: 400;
    background: #f6f7f9;
    border-radius: 4px 4px 0px 0px;
    border-bottom: 1px solid #dcdfe6;
    font-family: PingFangSC-Regular;
    color: #090c0f;
    letter-spacing: 0;
    font-weight: 400;
    &.transparent {
      background: transparent;
      border-bottom: transparent;
    }
    .sub-desc {
      font-size: 14px;
      font-weight: 400;
      color: #909399;
      line-height: 20px;
    }
  }
  .transfer-box-filter {
    width: 100%;
    border-bottom: 1px solid #dcdfe6;
  }
  .search-input {
    padding: 10px;
  }
  .transfer-box-body {
    width: 100%;
    flex: 1;
    min-height: 0;
    padding: 10px 0;

    .item-name {
      flex: 1;
      min-width: 0;
      margin-left: 20px;
    }
  }
  .transfer-box-footer {
    display: flex;
    padding: 0 10px;
    z-index: 2;
    background: #ffffff;
    border-radius: 0px 0px 1px 1px;
    border-top: 1px solid rgba(227, 231, 235, 1);
    width: 100%;
    height: 40px;
  }
}
.text_nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.checked {
  .yab-div-tips.name,
  .yab-div-tips.subInfo {
    color: #517ecf;
  }
}
.cellContentChildren {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  padding: 2px 0;
  box-sizing: border-box;
  .name {
    line-height: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 12px;
    color: #090c0f;
    letter-spacing: 0;
    line-height: 18px;
    font-weight: 400;
  }
  .subInfo {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #777c82;
    letter-spacing: 0;
    line-height: 18px;
    font-weight: 400;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    /* height: 50px; */
    white-space: normal;
    line-height: 18px;
    .subInfo-popper-class {
      white-space: normal;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
</style>
