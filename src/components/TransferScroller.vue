<template>
  <div v-if="showNoDataTip" class="empty-module">
    <div class="main-horizontal-center">
      <div class="empty-hint">暂无数据</div>
    </div>
  </div>
  <RecycleScroller
    v-else
    v-slot="{ item }"
    class="transfer-scroller"
    :items="items"
    :item-size="40"
    :key-field="keyProp"
    :buffer="300"
    @scroll="handleScroll"
  >
    <div class="transfer-scroller-row__item" @click="handleChecked(item)">
      <el-checkbox
        :model-value="getIndexByChecked(checkedList, item) > -1"
        class="transfer-scroller-row__item-checkbox"
        :disabled="item[disabledProp]"
      />
      <slot v-bind="{ item }"></slot>
    </div>
  </RecycleScroller>
</template>

<script lang="ts" setup name="TransferScroller">
import { computed, ref, watch } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const props = defineProps({
  modelValue: {
    type: Array,
    default() {
      return []
    }
  },
  keyProp: {
    type: String,
    default: 'id'
  },
  labelProp: {
    type: String,
    default: 'name'
  },

  disabledProp: {
    type: String,
    default: 'disabled'
  },
  isSort: {
    type: Boolean,
    default: false
  },
  filterList: {
    type: Array,
    default() {
      return []
    }
  },
  dataList: {
    type: Array,
    default() {
      return []
    }
  },
  defaultCheckedList: {
    type: Array,
    default() {
      return []
    }
  }
})
const emit = defineEmits(['update:modelValue', 'scrollToBottom'])
const checkedList: any = ref([])

const getIndexByChecked = (checkedQueue: any[], item: any) => {
  const index = checkedQueue.findIndex((checkedItem) => {
    return checkedItem[props.keyProp] === item[props.keyProp]
  })
  return index
}
const showNoDataTip = computed(() => {
  return props.dataList.length === 0
})

// 过滤所有不可选中
const checkableData = computed(() => {
  return props.dataList.filter((item: any) => !item[props.disabledProp])
})

const handleChecked = (item: any) => {
  if (item[props.disabledProp]) {
    return
  }
  const checkedIndex = getIndexByChecked(checkedList.value, item)
  if (checkedIndex > -1) {
    checkedList.value.splice(checkedIndex, 1)
  } else {
    checkedList.value.push(item)
  }
  emit('update:modelValue', checkedList.value)
}

const handleScroll = (val: any) => {
  const element = val.target
  const scrollTop = element.scrollTop
  const scrollHeight = element.scrollHeight
  const clientHeight = element.clientHeight
  const result = scrollTop + clientHeight >= scrollHeight
  // 判断是否滚动到底部

  if (result) {
    emit('scrollToBottom', result)
  }
}

// 根据id获取默认应该选中的列表
const getDefaultCheck = (defaultCheck: any[]) => {
  const result = checkableData.value.filter((item1: any) =>
    defaultCheck.some((item2) => item1[props.keyProp] === item2)
  )
  return result
}
const items = computed(() => {
  return props.isSort
    ? [...props.dataList].sort((prev: any, next: any) =>
        prev[props.keyProp] > next[props.keyProp] ? 1 : -1
      )
    : [...props.dataList]
})

watch(
  () => props.modelValue,
  () => {
    checkedList.value = props.modelValue
  },
  {
    deep: true
  }
)
watch(
  () => props.defaultCheckedList,
  (val, oldVal) => {
    if (
      oldVal &&
      val.length === oldVal.length &&
      val.every((item) => oldVal.includes(item))
    )
      return

    const result = getDefaultCheck(val)
    emit('update:modelValue', result)
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.empty-module {
  flex: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-module .empty-hint {
  font-size: 12px !important;
  margin-top: 4px;
  text-align: center;
  color: #99a9bf;
}
.main-horizontal-center {
  position: relative;
  left: 0;
  -ms-transform: translateX(0);
  -moz-transform: translateX(0);
  -o-transform: translateX(0);
  -webkit-transform: translateX(0);
}
.main-horizontal-center-icon {
  font-size: 60px;
  color: #eff2f7;
}
.transfer-scroller {
  user-select: none;
  width: 100%;
  height: 100%;
  font-family: PingFangSC-Regular, PingFang SC;
  .transfer-scroller-row__item {
    display: flex;
    align-items: center;
    max-height: 60px;
    padding: 0 10px;
    font-size: 14px;
    font-weight: 400;
    color: #303133;
    line-height: 20px;
    cursor: pointer;
    transition: backgroundColor 0.3s;
    &:hover {
      background-color: rgba(#eee, 0.3);
    }
    .transfer-scroller-row__item-checkbox {
      margin-right: 12px;
      pointer-events: none;
    }
  }
}
</style>
