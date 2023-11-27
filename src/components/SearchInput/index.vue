<template>
  <div>
    <el-row :gutter="16" align="middle">
      <el-row :span="extra ? 16 : 24">
        <div class="search-input">
          <!-- :prefix-icon="<AiOutlineSearch className={styles.icon} />" -->
          <el-input
            v-model="input" 
            :placeholder="placeholder || '请输入'" 
            @change="change"
          />
        </div>
      </el-row>
      <el-row v-if="extra" :span="8" style="text-align: right">
        {{extra}}
      </el-row>
    </el-row>
  </div>
</template>
  
<script lang="ts" setup>
// import { AiOutlineSearch } from '@/icons/ai';
import { ref } from 'vue'

// 接收参数
const props = defineProps<{
  extra?: string; // 组件右侧自定义
  value?: string; // 搜索框的值
  placeholder?: string; // 搜索框的值
  onChange: () => void | undefined; // 值发生改变的监听事件
}>()

// console.log(props.onChange,'onChange')

const input = ref('')

const change = (event:any) =>{
  console.log(event,'1234')
}

onMounted(()=>{
  input.value = props.value
})
</script>

<script lang="ts">
export default {
  name: "SearchInput",
}
</script>

<style scoped>

</style>
