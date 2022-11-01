<template>
  <div>
    <div v-for="(condition, index) in selectedNode.conditions" :key="index + '_g'" class="group">
      <div class="group-header">
        <div @click="delGroup(index)" style="color:dodgerblue;margin-left:0px;margin-top: 0px;">          <el-icon >
            <Delete />
        </el-icon></div>
        <span class="group-name">参数{{index}}</span>
        <div class="group-cp">
          <el-select v-model="condition.paramKey" class="m-2" placeholder="请选择参数" size="small" style="width:150px;margin-right: 5px;" @change="val => {paramChange(val, condition);}">
            <el-option
              v-for="item in formFields"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
          <el-select v-model="condition.key" class="m-2" placeholder="判断条件" size="small" style="width:80px;margin-right: 5px;" @change="(val,item) => {keyChange(val, item, condition);}">
            <el-option
              v-for="item in conditionKeys(condition.type)"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
          <el-input-number v-if="condition.type=='NUMERIC'" v-model="condition.val" size="small" style="width:150px;margin-right: 10px;"/>
          <el-select v-else-if="dictory(condition.paramKey) && condition.type=='DICT'"  v-model="condition.val" class="m-2" placeholder="请选择" size="small" style="width:150px;margin-right: 5px;" @change="val => {valChange(val, condition);}">
            <el-option
              v-for="item in dictory(condition.paramKey)"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
          <el-input v-else v-model="condition.val" placeholder="请输入值" clearable size="small" style="width:150px;margin-right: 5px;"/>
        </div>
        <div class="group-operation">
        </div>

 
      </div>
      <div class="group-content">
       
        <div >
          <el-form ref="condition-form" label-width="100px">
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    ref,
    toRefs,
    reactive,
    computed,
    onMounted,
    defineComponent,
    getCurrentInstance,
    ComponentInternalInstance
  } from 'vue';
  import {ValueType} from '../../form/ComponentsConfigExport'
  import DefaultProps from ".././DefaultNodeProps"
  export default defineComponent({
    name: 'ConditionGroupItemConfig',
    setup(props, { emit }) {
      const { appContext  } = getCurrentInstance() as ComponentInternalInstance;
      const proxy = appContext.config.globalProperties;
      const conditionKeys = computed(() => {
        return (type:any) => DefaultProps.getConditionKeys(type)
      });
      const dictory = computed(() => {
        return (paramKey:any) => {
          
          var filter =  DefaultProps.getFormFields().filter((item:any)=>item.code==paramKey) 
          
          if(filter && filter.length>0 && filter[0].dict.length>0){
            return filter[0].dict.filter((item:any)=>item.name && item.code)
          }
          return []
        }
      });
      const state = reactive({
        ValueType,
        users: [],
        orgType: 'user',
        showOrgSelect: false,
        //groupConditions: [],
        groupNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        supportTypes:[ValueType.number, ValueType.string, ValueType.date, ValueType.dept, ValueType.user],
        explains:[
          {label: '等于', value:'='},
          {label: '大于', value:'>'},
          {label: '大于等于', value:'>='},
          {label: '小于', value:'<'},
          {label: '小于等于', value:'<='},
          {label: '包含在', value:'IN'},
          {label: 'x < 值 < x', value:'B'},
          {label: 'x ≤ 值 < x', value:'AB'},
          {label: 'x < 值 ≤ x', value:'BA'},
          {label: 'x ≤ 值 ≤ x', value:'ABA'},
        ]
      });
      //
      const formFields = computed(() => {
        return DefaultProps.getFormFields();
      });
      const design = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.design;
      });
      const selectedNode = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.selectedNode
      });
      const select = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser || []
      });
      const formItems = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.design.formItems
      });
      const formMap = computed(() => {
        const map = new Map();
        // formItems.forEach((item: any) => itemToMap(map, item))
        return map
      });
      const conditionList = computed(() => {
        //构造可用条件选项
        const conditionItems: any[] = []
        return conditionItems
      });
      const keyChange = (val:any,item:any, condition:any) =>{
        for(let key of DefaultProps.getConditionKeys(condition.type)){
          if(key.code==val){
            condition.label = key.name
          }
        }
      };
      const valChange = (val:any, condition:any) =>{
        var filter =  DefaultProps.getFormFields().filter((item:any)=>item.code==condition.paramKey) 
        var dict = []
        if(filter && filter.length>0){
          dict =  filter[0].dict
        }else{
          dict = []
        }
        for(let item of dict){
          if(item.code==val){
            condition.valLabel = item.name
          }
        }
      };
      const paramChange = (val:any, condition:any) =>{
        
        for(let field of DefaultProps.getFormFields()){
          if(field.code==val){
            condition.paramLabel = field.name
            condition.type = field.type
            condition.val = null
            condition.valLabel = ""
          }
        }
      };
      const itemToMap = (map: any, item: any) => {
        map.set(item.id, item)
        if (item.name === 'SpanLayout') {
          item.props.items.forEach((sub: any) => itemToMap(map, sub))
        }
      };
      const isSelect = (formId: any) => {
        let form = formMap.value.get(formId)
        if (form && (form.name === 'SelectInput' || form.name === 'MultipleSelect')){
          return true
        }
        return false
      };
      const getOptions = (formId: any) => {
        return formMap.value.get(formId).props.options || []
      };
      const conditionValType = (type: any) => {
        switch (type){
          case '=':
          case '>':
          case '>=':
          case '<':
          case '<=': return 0;
          case 'IN': return 1;
          default: return 2;
        }
      };
      const selectUser = (value: any, orgType: any) => {
        state.orgType = orgType
        state.users = value
        // orgPicker.value.show()
      };
      const filterCondition = (item: any,list: any) => {
        if (item.name === 'SpanLayout'){
          item.props.items.forEach((sub: any) => filterCondition(sub, list))
        }else if (state.supportTypes.indexOf(item.valueType) > -1 && item.props.required){
          list.push({title: item.title, id: item.id, valueType: item.valueType})
        }
      };
      const selected = (select: any) => {
        state.users.length = 0
        select.forEach((u: any) => state.users.push(u))
      };
      const delGroup = (index: number) => {
        proxy.$pinia.state.value.appwfConfig.selectedNode.conditions.splice(index, 1)
      };
      const rmSubCondition = (group: any, index: number) => {
        group.cids.splice(index, 1)
        group.conditions.splice(index, 1)
      };
      const conditionChange = (index: number, group: any) => {
        //判断新增的
        group.cids.forEach((cid: any) => {
          if (0 > group.conditions.findIndex((cd: any) => cd.id === cid)){
            //新增条件
            let condition = {...conditionList.value[index]}
            condition.compare = '';
            condition.value = []
            group.conditions.push(condition)
          }
        })
        for (let i = 0; i < group.conditions.length; i++) {
          //去除没有选中的
          if (group.cids.indexOf(group.conditions[i].id) < 0){
            group.conditions.splice(i, 1)
          }
        }
      };
      // 页面加载时
      onMounted(() => {
      });
      return {
        proxy,
        ...toRefs(state),
        selectedNode,
        select,
        formItems,
        formMap,
        conditionList,
        design,
        conditionKeys,
        formFields,
        dictory,
        paramChange,
        keyChange,
        valChange,
        itemToMap,
        isSelect,
        getOptions,
        conditionValType,
        selectUser,
        filterCondition,
        selected,
        delGroup,
        rmSubCondition,
        conditionChange,
      };
    },
  });
</script>


<style lang="scss" scoped>
.group {
  margin-bottom: 20px;
  color: #5e5e5e;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid #e3e3e3;

  .group-header {
    padding: 5px 10px;
    background: #e3e3e3;
    position: relative;

    div {
      display: inline-block;
    }

    .group-name {
      font-size: small;
      margin-left: 10px;
    }

    .group-cp {
      font-size: small;
      position: absolute;
      left: 100px;
      display: flex;
      top: 0px;
      justify-content: center;
      align-items: center;
    }

    .group-operation {
      position: absolute;
      right: 10px;

      i {
        padding: 0 10px;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .group-content{
    padding: 10px 5px;
    p{
      text-align: center;
      font-size: small;
    }
    // .el-icon-delete{
    //   position: absolute;
    //   cursor: pointer;
    //   top: 12px;
    //   right: 0;
    // }
  }

  .condition-title{
    display: block;
    width: 100px;
  }
}
</style>
