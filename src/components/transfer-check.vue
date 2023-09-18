
<template>
  <el-checkbox
    v-if="!hasNoMatch"
    v-model="allChecked"
    :indeterminate="isIndeterminate"
    @change="handleAllCheckedChange"
  >
    <span class="checkedSummary">{{ checkedSummary }}</span>
  </el-checkbox>
</template>
<script lang="ts" setup name="transferCheck">
import { watch, computed, ref } from 'vue'
import { CheckboxValueType, TransferFormat } from './types'

const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
  checkedList: {
    type: Array,
    default: () => []
  },
  keyProp: {
    type: String,
    default: 'code'
  },
  disabledProp: {
    type: String,
    default: 'disabled'
  },
  footerFormat: {
    type: Object as () => TransferFormat,
    default: () => ({})
  }
})

const emit = defineEmits(['checkedChange'])
const allChecked = ref(false)
const checked: any = ref([])

const handleAllCheckedChange = (val: CheckboxValueType) => {
  checked.value = val ? checkableData.value : []
  emit('checkedChange', checked.value)
}
const checkedSummary = computed(() => {
  const checkedLength = checked.value.length
  const dataLength = props.dataList.length
  const footerFormat = props.footerFormat
  if (footerFormat.noChecked && footerFormat.hasChecked) {
    return checkedLength > 0
      ? footerFormat.hasChecked
          .replace(/\${checked}/g, checkedLength.toString())
          .replace(/\${total}/g, dataLength.toString())
      : footerFormat.noChecked.replace(/\${total}/g, dataLength.toString())
  } else {
    return `已选${checkedLength}/${dataLength}项`
  }
})
const hasNoMatch = computed(() => {
  return filteredData.value.length === 0
})

const isIndeterminate = computed(() => {
  const checkedLength = checked.value.length
  return checkedLength > 0 && checkedLength < checkableData.value.length
})

const filteredData = computed(() => {
  return props.dataList
})

const checkableData: any = ref([])
const changeCheckableData = () => {
  checkableData.value = filteredData.value.filter(
    (item:any) => !item[props.disabledProp]
  )
}
watch(
  () => props.dataList,
  (newDataList) => {
    checkableData.value = newDataList.filter(
      (item:any) => !item[props.disabledProp]
    )
  }
)

const updateAllChecked = () => {
  allChecked.value =
    checkableData.value.length > 0 &&
    checkableData.value.every((item: any) => props.checkedList.includes(item))
}

watch(
  () => props.checkedList,
  (newVal, oldVal) => {
    checked.value = newVal
    changeCheckableData()
    updateAllChecked()
  },
  {
    deep: true,
    immediate: true
  }
)
watch(
  () => props.dataList,
  (newVal, oldVal) => {
    changeCheckableData()
    updateAllChecked()
  },
  {
    deep: true,
    immediate: true
  }
)
watch(
  checkableData,
  (newVal, oldVal) => {
    updateAllChecked()
  },
  {
    deep: true,
    immediate: true
  }
)
defineExpose({
  handleAllCheckedChange
})
</script>
<style lang="scss" scoped>
.checkedSummary {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #99a9bf;
  letter-spacing: 0;
  line-height: 14px;
  font-weight: 400;
}
</style>
