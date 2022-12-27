<template>
    <div class="app-register-wrap">
      <div class="app-base-info register-content">
        <div class="custom-title">
          <p><span class="custom-span"></span> 基础信息</p>
        </div>
        <el-form
          :model="state.form"
          ref="registerFormRef"
          :rules="rules"
          label-position="top"
          class="demo-form-inline"
        >
          <el-row :gutter="40" justify="space-between">
            <el-col :span="12">
              <el-form-item label="应用名称" prop="name">
                <el-input v-model="state.form.name" placeholder="请设置" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应用编码" prop="code">
                <el-input v-model="state.form.code" placeholder="请设置" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="40" justify="space-between">
            <el-col :span="12"
              ><el-form-item label="负责人">
                <el-input v-model="form.user" placeholder="请设置" /> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item label="联系方式">
                <el-input v-model="form.user" placeholder="请设置" /> </el-form-item
            ></el-col>
          </el-row> -->
          <!-- <el-form-item label="Activity zone">
            <el-select v-model="form.region" placeholder="Activity zone">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="privateKey">
            <el-input v-model="form.privateKey" placeholder="请设置" />
          </el-form-item> -->
          <el-form-item label="应用介绍">
            <el-input
              :rows="4"
              v-model="state.form.remark"
              type="textarea"
              maxlength="120"
              show-word-limit
              placeholder="请输入应用介绍"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="app-base-info register-content resource-box">
        <div class="custom-title">
          <p> <span class="custom-span"></span> 资源信息 </p>
          <el-icon class="add-btn" :size="20" @click.stop="handleMemuEvent('Add')">
            <CirclePlus />
          </el-icon>
        </div>
        <SetAppMenu
          :menus="state.resources"
          :key="`${state.resources.length}-${state.resources.map((v:any)=>v?.id||v.customId).join('&')}`"
          @handleMemuEvent="handleMemuEvent"
          @handleAddMenu="handleAddFlows"
          @handleAddComponents="handleAddComponents"
          @handlFieldMenu="handlFieldMenu"
        />
      </div>
      <div class="app-base-info register-content btns">
        <el-button type="info" @click="router.back()"> 取消 </el-button>
        <el-button type="primary" @click="onSubmit">注册</el-button>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
    import SetAppMenu from './setAppMenu.vue'
    import { reactive, ref } from 'vue'
    import { ElMessage, FormRules } from 'element-plus'
    import { useRouter } from 'vue-router'
    import { useCommonStore } from '@/store/common'
    import {userCtrl} from '@/ts/coreIndex'

    const commonStore = useCommonStore()
    const router = useRouter()
  
    type Resources = {
      name: string
      code: string
      link: string
      privateKey: string
      customId: number
      flows: Flows[]
      components: Components[]
    }
    type Field = {
      name: string
      code: string
      type: string
      customId: number
      dict: any[]
    }
    type Flows = {
      formId: string 
      business: string
      customId: number
      field: Field[]
    }
    type Components = {
      name: string
      url: string
      width: string
      height: string
      customId: number
    }
  
    let state = reactive<{ [key: string]: any; resources: Resources[] }>({
      form: {
        id: '',
        code: '',
        name: '',
        remark: '',
        privateKey: ''
      },
      resources: [
        {
          name: '',
          link: '',
          code: '',
          privateKey: '',
          customId: 1,
          flows: [
            {
              formId: Math.round(Math.random() * 10000000000)+'',
              business: '',
              field: [
                {
                  name: '',
                  code: '',
                  type: '',
                  customId: 1,
                  dict: []
                }
              ],
              customId: 1
            }
          ],
          components: [
            {
              name: '',
              url: '',
              width: '',
              height: '',
              customId: 1
            }
          ]
        }
      ]
    })
  
    const handlFieldMenu = (
      type: ProductMenuEventType,
      index: number,
      fIndex: number,
      selectId?: number,
      dicIndex?: number
    ) => {
      // let field = state.resources[index].flows[fIndex].field
      // switch (type) {
      //   case 'Add':
      //     field.push({
      //       name: '',
      //       code: '',
      //       type: '',
      //       customId: field[field.length - 1].customId + 1
      //     })
      //     break
      //   case 'Delete':
      //     // handleDeleteMenu(selectId)
      //     if (field.length > 1) {
      //       state.resources[index].flows[fIndex].field = field.filter(
      //         (item) => item.customId !== selectId
      //       )
      //     } else {
      //       ElMessage({
      //         type: 'error',
      //         message: '请填写至少一个字段信息'
      //       })
      //     }
  
      //     break
      //   default:
      //     break
      // }
      let field = state.resources[index].flows[fIndex].field
      switch (type) {
        case 'Add':
          if(selectId){
            let fItem = state.resources[index].flows[fIndex].field[selectId-1]
            if(!fItem.dict){
              fItem.dict = []
            }
            fItem.dict.push({
              name: '',
              code: '',
            })
          }else{
            field.push({
              name: '',
              code: '',
              type: '',
              customId: field[field.length - 1].customId + 1,
              dict:[]
            })
          }
          break
        case 'Delete':
          if(dicIndex || dicIndex==0){
            state.resources[index].flows[fIndex].field[selectId-1].dict.splice(dicIndex,1)
          }else{
            if (field.length > 1) {
              state.resources[index].flows[fIndex].field = field.filter(
              (item:any) => item.customId !== selectId
            )
            } else {
              ElMessage({
                type: 'error',
                message: '请填写至少一个字段信息'
              })
            }
          }
  
          break
        default:
          break
      }
    }
  
    const handleAddComponents = (
      type: ProductMenuEventType,
      index: number,
      fIndex: number,
      selectId?: number
    ) => {
      let components = state.resources[index].components
      switch (type) {
        case 'Add':
          components.push({
            name: '',
            url: '',
            width: '',
            height: '',
            customId: components[components.length - 1].customId + 1
          })
          break
        case 'Delete':
          // handleDeleteMenu(selectId)
          if (components.length > 1) {
            state.resources[index].components = components.filter(
              (item) => item.customId !== selectId
            )
          } else {
            ElMessage({
              type: 'error',
              message: '请填写至少一个组件信息'
            })
          }
  
          break
        default:
          break
      }
    }
    const handleAddFlows = (type: ProductMenuEventType, index: number, selectId?: number) => {
      let flows = state.resources[index].flows
      switch (type) {
        case 'Add':
          flows.push({
            formId: Math.round(Math.random() * 10000000000)+'',
            business: '',
            field: [
              {
                name: '',
                code: '',
                type: '',
                customId: 1,
                dict:[]
              }
            ],
            customId: flows[flows.length - 1].customId + 1
          })
          break
        case 'Delete':
          // handleDeleteMenu(selectId)
          if (flows.length > 1) {
            state.resources[index].flows = flows.filter((item) => item.customId !== selectId)
          } else {
            ElMessage({
              type: 'error',
              message: '请填写至少一个流程信息'
            })
          }
  
          break
        default:
          break
      }
    }
  
    // 处理资源信息操作
    const handleMemuEvent = (type: ProductMenuEventType, selectId?: number) => {
      switch (type) {
        case 'Add':
          state.resources.push({
            name: '',
            link: '',
            code: '',
            privateKey: '',
            customId: state.resources.length + 1,
            flows: [
              {
                formId: Math.round(Math.random() * 10000000000)+'',
                business: '',
                field: [
                  {
                    name: '',
                    code: '',
                    type: '',
                    customId: 1,
                    dict:[]
                  }
                ],
                customId: 1
              }
            ],
            components: []
          })
          break
        case 'Delete':
          // handleDeleteMenu(selectId)
          if (state.resources.length > 1) {
            state.resources = state.resources.filter((item) => item.customId !== selectId)
          } else {
            ElMessage({
              type: 'error',
              message: '请填写至少一个资源信息'
            })
          }
  
          break
        case 'Up':
          handleSortMenu('Up', selectId)
          break
        case 'Down':
          handleSortMenu('Down', selectId)
          break
        default:
          break
      }
    }
    // 排序资源信息
    const handleSortMenu = (type: ProductMenuEventType, aimId: number) => {
      const data = state.resources
      // 根据当前所选标志 获取目标数据信息
      const obj = data.find((item) => item.customId === aimId)
  
      const idArr = data.map((item: AppResourcesType) => item.customId)
      const index = idArr.indexOf(aimId)
      const endIndex = data.length - 1
      const willChageIndex = type === 'Up' ? index - 1 : index + 1
      // 若最后一个选择向下排序/第一个向上,则终止
      if ((type === 'Down' && willChageIndex > endIndex) || (type === 'Up' && index === 0)) {
        return
      }
      // 换位置
      if (index > -1) {
        const willChangeObj = data[willChageIndex]
        data[index] = willChangeObj
        data[willChageIndex] = obj
      }
    }
    // 触发表单 提交信息
    const onSubmit = () => {
      console.log('submit!', state.form)
      onRegisterSubmit()
    }
    // 注册表单Dom
    const registerFormRef = ref<any>(null)
    // 注册验证规则
    const rules = reactive<FormRules>({
      name: [
        { required: true, message: '请输入应用名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度限制2-20', trigger: 'blur' }
      ],
      code: [
        {
          required: true,
          message: '请输入应用编码',
          trigger: 'blur'
        }
      ]
    })
    // 提交注册
    const onRegisterSubmit = async () => {
      if (!registerFormRef) return
  
      registerFormRef.value.validate(async (valid: any, fields: any) => {
        if (valid) {
          // 无资源提示
          if (!state.resources[0].link) {
            return ElMessage({
              type: 'error',
              message: '请填写至少一个资源地址'
            })
          }
          // 过滤无效填写
          const obj = state.resources.filter((item) => {
            return item.link
          })
          const resourcesData = JSON.parse(JSON.stringify(obj))
          resourcesData.forEach((el: any) => {
            el.flows = el.flows.map((item:any)=>{item.formId=item.business; return item});
            el.flows = JSON.stringify(el.flows)
            el.components = JSON.stringify(el.components)
          })
          const res = await userCtrl.space.createProduct({ ...state.form, resources: resourcesData });
          if (res) {
            ElMessage({
              type: 'success',
              message: '应用注册成功'
            })
            commonStore.isChangeStartApp = true
            router.back()
          }
        } else {
          console.log('error submit!', fields)
        }
      })
    }
  </script>
  
  <style lang="scss" scoped>
    .app-register-wrap {
      // height: 100%;
      background: var(--el-bg-color-overlay);
      padding: 6px;
      border: 0;
      overflow-y: auto;
      height: calc(100vh - 110px);
      padding: 20px;
      margin-top: 3px;
  
      .register-content {
        width: 700px;
        margin: 0 auto;
        :deep(.el-input__wrapper),
        :deep(.el-textarea__inner) {
          background-color: var(--el-color-primary-light-9); //#f3f5fa;
          box-shadow: none;
          border: 0px solid var(--el-input-focus-border-color);
        }
        :deep(.el-textarea .el-input__count) {
          background-color: var(--el-color-primary-light-9); //#f3f5fa;
          box-shadow: none;
        }
      }
      .resource-box {
        min-height: 200px;
      }
      .page-title {
        font-size: 16px;
        text-align: center;
      }
      .btns {
        display: flex;
        justify-content: space-around;
        padding: 10px 0 24px;
        margin-bottom: 30px;
      }
  
      // 自定义标题
      .custom-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 26px;
        font-size: 14px;
        margin-bottom: 10px;
  
        .custom-span {
          display: inline-block;
          width: 3px;
          height: 14px;
          margin-right: 6px;
          background-color: #3e5ed8;
          position: relative;
          top: 2px;
        }
      }
      .add-btn {
        cursor: pointer;
        color: var(--el-color-primary);
        margin: 0 10px;
      }
      .demo-tabs {
        height: 100%;
        :deep(.el-tabs__content) {
          height: calc(100% - 55px);
          overflow-y: auto;
        }
        :deep(.el-tab-pane) {
          height: 100%;
        }
      }
    }
  </style>
  