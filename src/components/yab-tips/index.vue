<template>
  <div class="yab-div-tips">
    <el-tooltip
      ref="rolePopover"
      placement="top"
      trigger="hover"
      :popper-class="props.popperClass"
      :disabled="!popover"
    >
      <div
        @mouseenter="popoverShow($event)"
        :class="props.styleClass"
        class="column"
        @click="internalClick()"
      >
        {{ props.name }}
      </div>

      <template #content>
        <div class="yab-div-tips__content">
          {{ props.name }}
        </div>
      </template>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup name="yab-div-tips">
import { ref } from 'vue'

const popover = ref(false)
const props = defineProps({
  name: {
    default: ''
  },
  params: {
    type: Object,
    default: function () {
      return {}
    }
  },
  styleClass: {
    type: String,
    default: ''
  },
  popperClass: {
    type: String,
    default: 'tool-tip-popper-class'
  },
  click: {
    type: Function,
    default: null
  }
})

const popoverShow = (e) => {
  let ev = window.event || e
  let target = ev.srcElement || ev.target
  let width = target.scrollWidth
  let txtWidth = target.offsetWidth
  if (width > txtWidth) {
    popover.value = true
  } else {
    popover.value = false
  }
}
const internalClick = () => {
  if (props.click) {
    props.click(props.params)
  }
}
</script>

<style lang="scss" scoped>
.yab-div-tips {
  .column {
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .yab-div-tips__content {
    max-width: 320px;
    color: white;
    white-space: normal;
    word-break: break-all;
  }
}
</style>
<style>
.tool-tip-popper-class {
  max-width: 480px;
  word-break: break-all;
}
</style>
