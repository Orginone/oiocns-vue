<template>
  <div>
    <el-menu v-bind="$attrs" @select="select">
      <button @click="buttonEmit">TabsPaneContext</button>

      <template v-for="(item, index) in data">
        <!-- 有子集的情况：-->
        <el-sub-menu
          :key="item.uid"
          :index="String(index + 1)"
          v-if="!item.structure"
        >
          <template #title>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="val in item.children"
            :key="val.uid"
            :index="String(val.uid)"
          >
            {{ val.name }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
const emit = defineEmits(['handleClose','comClick'])
const props = defineProps({
  data: {
    type: Array,
  },
})
console.log(props.data)

const handleClose = () => {
  emit('handleClose', 'menu')
}
const select = () => {
  emit('handleClose', 'tree')

}
</script>
