<template>
  <div class="search-input">
    <el-input :placeholder="placeholder" v-model="filterText"
      ><template #prefix>
        <el-icon class="el-input__icon"><search /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  const emit = defineEmits(['filterText'])
  const filterText = ref<string>('')
  const props = defineProps({
    placeholder: {
      type: String
    }
  })
  // 监听所选聊天对象
  watch(
    () => filterText.value,
    (val) => {
      emit('filterText', val)
    }
  )
</script>

<style lang="scss" scoped>
  .search-input {
    margin-top: 6px;
  }

  .search-input .el-input {
    &__inner {
      height: 30px;
      font-size: 13px;
    }

    &__icon {
      line-height: 30px;
    }
  }
</style>
