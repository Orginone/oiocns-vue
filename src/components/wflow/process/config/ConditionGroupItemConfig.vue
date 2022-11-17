<template>
  <div>
    <div v-for="(group, index) in selectedNode.props.groups" :key="index + '_g'" class="group">
      <div class="group-header">
        <span class="group-name">条件组 {{ groupNames[index] }}</span>
        <div class="group-cp">
          <span>组内条件关系：</span>
          <el-switch v-model="group.groupType" active-color="#154AD8"
                     inactive-color="#c1c1c1" active-value="AND" inactive-value="OR"
                     active-text="且" inactive-text="或"/>
        </div>
        <div class="group-operation">
          <el-popover placement="bottom" title="选择审批条件" width="300" trigger="click">
            <!-- <div>以下条件将决定具体的审批流程</div>-->
            <el-checkbox-group v-model="group.cids" value-key="id">
              <el-checkbox :label="condition.id" v-for="(condition, cindex) in conditionList" :key="condition.id" @change="conditionChange(cindex, group)">
                {{ condition.title }}
              </el-checkbox>
            </el-checkbox-group>
            <i class="el-icon-plus" slot="reference"></i>
          </el-popover>
          <i class="el-icon-delete" @click="delGroup(index)"></i>
        </div>
      </div>
      <div class="group-content">
        <p v-if="group.conditions.length === 0">点击右上角 + 为本条件组添加条件 ☝</p>
        <div v-else>
          <el-form ref="condition-form" label-width="100px">
            <!--构建表达式-->
            <el-form-item  v-for="(condition, cindex) in group.conditions" :key="condition.id + '_' + cindex" >
              <ellipsis slot="label" hover-tip :content="condition.title"/>
               <span v-if="condition.valueType === ValueType.string">
                <el-select size="small" placeholder="判断符" style="width: 120px;" v-model="condition.compare" @change="condition.value = []">
                  <el-option label="等于" value="="></el-option>
                  <el-option label="包含在" value="IN"></el-option>
                </el-select>
                 <span v-if="isSelect(condition.id)" style="margin-left: 10px">
                   <el-select v-if="condition.compare === 'IN'" style="width: 280px;" clearable multiple size="small" v-model="condition.value" placeholder="选择值">
                     <el-option v-for="(option, oi) in getOptions(condition.id)" :key="oi" :label="option" :value="option"></el-option>
                   </el-select>
                   <el-select v-else style="width: 280px;" clearable size="small" v-model="condition.value[0]" placeholder="选择值">
                     <el-option v-for="(option, oi) in getOptions(condition.id)" :key="oi" :label="option" :value="option"></el-option>
                   </el-select>
                 </span>
                 <span v-else style="margin-left: 10px">
                   <el-input v-if="condition.compare === '='" style="width: 280px;" placeholder="输入比较值" size="small" v-model="condition.value[0]"/>
                   <el-select v-else style="width: 280px;" multiple clearable filterable allow-create size="small" v-model="condition.value" placeholder="输入可能包含的值"></el-select>
                 </span>
              </span>
              <span v-else-if="condition.valueType === ValueType.number">
                <el-select size="small" placeholder="判断符" style="width: 120px;" v-model="condition.compare">
                  <el-option :label="exp.label" :value="exp.value" :key="exp.value" v-for="exp in explains"></el-option>
                </el-select>
                <span style="margin-left: 10px">
                  <el-input style="width: 280px;" v-if="conditionValType(condition.compare) === 0" size="small" placeholder="输入比较值" type="number" v-model="condition.value[0]"/>
                  <el-select style="width: 280px;" multiple filterable allow-create v-else-if="conditionValType(condition.compare) === 1" size="small" v-model="condition.value" placeholder="输入可能包含的值"></el-select>
                  <span v-else>
                    <el-input style="width: 130px;" size="small" type="number" placeholder="输入比较值" v-model="condition.value[0]"/>
                    <span> ~
                      <el-input size="small" style="width: 130px;" type="number" placeholder="输入比较值" v-model="condition.value[1]"/>
                    </span>
                  </span>
                </span>
              </span>
              <span v-else-if="condition.valueType === ValueType.user">
                <span class="item-desc" style="margin-right: 20px">属于某部门 / 为某些人其中之一</span>
                <el-button size="default" icon="el-icon-plus" type="primary" @click="selectUser(condition.value, 'user')" round>选择人员/部门</el-button>
                <org-items v-model="condition.value"/>
              </span>
              <span v-else-if="condition.valueType === ValueType.dept">
                <span class="item-desc" style="margin-right: 20px">为某部门 / 某部门下的部门</span>
                <el-button size="default" icon="el-icon-plus" type="primary" @click="selectUser(condition.value, 'dept')" round>选择部门</el-button>
                <org-items v-model="condition.value"/>
              </span>
              <span v-else-if="condition.valueType === ValueType.date"></span>
              <i class="el-icon-delete" @click="rmSubCondition(group, cindex)"></i>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- <org-picker :type="orgType" multiple ref="orgPicker" :selected="users" @ok="selected"></org-picker> -->
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
  // import OrgPicker from "@/components/common/OrgPicker";
  import {ValueType} from '../../form/ComponentsConfigExport'
  
  export default defineComponent({
    name: 'ConditionGroupItemConfig',
    // components: {OrgPicker, OrgItems},
    setup(props, { emit }) {
      const { appContext  } = getCurrentInstance() as ComponentInternalInstance;
      const proxy = appContext.config.globalProperties;
      //
      // const orgPicker = ref();
      //
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
        // formItems.forEach((item: any) => filterCondition(item, conditionItems))
        // if (conditionItems.length === 0 || conditionItems[0].id !== 'root'){
        //   conditionItems.unshift({id: 'root', title: '发起人', valueType: 'User'})
        // }
        return conditionItems
      });
      //
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
        proxy.$pinia.state.value.appwfConfig.selectedNode.props.groups.splice(index, 1)
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
        //
        // orgPicker,
        //
        selectedNode,
        select,
        formItems,
        formMap,
        conditionList,
        //
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
    }

    .group-cp {
      font-size: small;
      position: absolute;
      left: 100px;
      display: flex;
      top: 5px;
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
    .el-icon-delete{
      position: absolute;
      cursor: pointer;
      top: 12px;
      right: 0;
    }
  }

  .condition-title{
    display: block;
    width: 100px;
  }
}
</style>
