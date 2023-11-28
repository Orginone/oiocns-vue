<template>
  <div class="schemaForm">
    <el-form
      ref="schemaForm"
      v-bind="$attrs"
      :model="source"
      :class="className"
      :rules="rules"
      label-width="auto"
    >
      <el-row>
        <el-col 
          v-for="item in config"
          :key="item.key"
          :span="item.hidden?0:item.span||15"
        >
          <el-form-item
            v-if="!item.hidden"
            :label="item.label"
            :prop="item.key"
            :labelWidth="item.labelWidth || 'auto'"
            v-bind="item.itemProps"
          >
            <div v-if="item.components === '-'" :class="item.innerClass" :style="item.style">
              {{item.innerText || source[item.key]}}
            </div>
            <template v-else>
              <div>
                <component
                  :is="item.component"
                  v-model="source[itme.key]"
                  v-bind="item.props"
                >
                  <template v-if="item.component === 'el-select'">
                    <el-option
                      v-for="(option,optionIndex) in item.data"
                      :key="optionIndex"
                      :label="option[item.option[0]]"
                      :value="option[item.option[0]]"
                    ></el-option> 
                  </template>
                  <template v-if="item.component === 'el-radio-group'">
                    <el-radio
                      v-for="(option,optionIndex) in item.data"
                      :key="optionIndex"
                      :label="optionIndex.toString()"
                    >{{option}}</el-radio> 
                  </template>
                </component>
              </div>
          </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
  
<script lang="ts" setup>

</script>

<script lang="ts">
export default {
  name: "SchemaForm",
}
</script>

<style>

</style>
  