<template>
    <el-form
      ref="form"
      :inline="false"
      class="demo-form-inline"
      :model="formModel"
      label-suffix="："
      label-width="130px"
      size="mini"
    >
      <el-row>
        <!--不循环row，直接循环col，放不下会自动往下换行。-->
        <el-col
          v-for="(ctrId, index) in formColSort"
          :key="'form_'+index"
          :span="formColSpan[ctrId]"
        >
          <el-form-item :label="getCtrMeta(ctrId).label">
            <!--表单item组件，采用动态组件的方式-->
            <component
              :is="ctlList[getCtrMeta(ctrId).controlType]"
              v-model="formModel[getCtrMeta(ctrId).colName]"
              :meta="getCtrMeta(ctrId)"
              @myChange="mySubmit">
            </component>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
</template>
  
  <script setup lang="ts">
    import { ref, reactive } from 'vue'
    import $services from '@/services'
    import { ElMessage } from 'element-plus'
    const formItemMeta =ref<Object>({})
    const formModel = ref<Object>({})
    const formColSort = ref<any>({}) //顺序数组
    const formColSpan = ref<any>({}) //占位数组
    const getCtrMeta = ref<any>({}) //获取组件id
    const props = defineProps({
      dialogShow: {
        type: Object
      },
      title: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      }
    })
    const state = reactive({
      options: []
    })
    const value = ref('')
    const loading = ref(false)
    // 根据表单元素meta，创建 v-model
    const createModel = () => {
        // 依据meta，创建module
        for (const key in formItemMeta) {
        const m = formItemMeta[key]
        // 根据控件类型设置属性值
        switch (m.controlType) {
            case 100: // 文本类
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 130:
            case 131:
            formModel[m.colName] = ''
            break
            case 110: // 日期
            case 111: // 日期时间
            case 112: // 年月
            case 114: // 年
            case 113: // 年周
            formModel[m.colName] = null
            break
            case 115: // 任意时间
            formModel[m.colName] = '00:00:00'
            break
            case 116: // 选择时间
            formModel[m.colName] = '00:00'
            break
            case 120: // 数字
            case 121:
            formModel[m.colName] = 0
            break
            case 150: // 勾选
            case 151: // 开关
            formModel[m.colName] = false
            break
            case 153: // 单选组
            case 160: // 下拉单选
            case 162: // 下拉联动
            formModel[m.colName] = null
            break
            case 152: // 多选组
            case 161: // 下拉多选
            formModel[m.colName] = []
            break
        }
        // 看看有没有设置默认值
        if (typeof m.defaultValue !== 'undefined') {
            switch (m.defaultValue) {
            case '':
                break
            case '{}':
                formModel[m.colName] = {}
                break
            case '[]':
                formModel[m.colName] = []
                break
            case 'date':
                formModel[m.colName] = new Date()
                break
            default:
                formModel[m.colName] = m.defaultValue
                break
            }
        }
        }
        // 同步父组件的v-model
        context.emit('update:modelValue', formModel)
        return formModel
    }
    // 依据用户选项，创建对应的 model
    // const
  </script>
  
  <style scoped></style>
  