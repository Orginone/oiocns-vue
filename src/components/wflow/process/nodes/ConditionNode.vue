<template>
  <div :class="{'node': true, 'node-error-state': showError}">
    <div :class="{'node-body': true, 'error': showError}">
      <div class="node-body-main" @click="$emit('selected')">
        <div class="node-body-main-header">
          <!-- <ellipsis class="title" hover-tip :content="config.name ? config.name : ('条件' + level)" /> -->
          <span class="title">{{config.name ? config.name : ('条件' + level)}}</span>
          <!-- <span class="level">优先级{{ level }}</span> -->
          <span class="option">
            <!-- <el-tooltip effect="dark" content="复制条件" placement="top">
              <i class="el-icon-copy-document" @click.stop="$emit('copy')"></i>
            </el-tooltip>
            <i class="el-icon-close" @click.stop="$emit('delNode')"></i> -->
            <el-icon :size="20" @click.stop="$emit('copy')">
              <CopyDocument />
            </el-icon>
            <el-icon :size="20" @click.stop="$emit('delNode')">
              <Close />
            </el-icon>
          </span>
        </div>
        <div class="node-body-main-content">
          <span class="placeholder" v-if="(content || '').trim() === ''">{{ placeholder }}</span>
          <!-- <ellipsis hoverTip :row="4" :content="content" v-else /> -->
          <span v-else>{{content}}</span>
        </div>
      </div>
      <div class="node-error" v-if="showError">
        <el-tooltip effect="dark" :content="errorInfo" placement="top-start">
          <!-- <i class="el-icon-warning-outline"></i> -->
          <el-icon :size="20">
            <Warning />
          </el-icon>
        </el-tooltip>
      </div>
    </div>
    <div class="node-footer">
      <div class="btn">
        <insert-button v-if="!_disabled" @insertNode="type => $emit('insertNode', type)"></insert-button>
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
  import InsertButton from '../InsertButton.vue'
  import {
    ValueType
  } from '../../form/ComponentsConfigExport'
  const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  export default defineComponent({
    name: 'ConditionNode',
    components: {
      InsertButton
    },
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      },
      _disabled: {
        type: Boolean,
      },
      //索引位置
      level: {
        type: Number,
        default: 1
      },
      //条件数
      size: {
        type: Number,
        default: 0
      }
    },
    setup(props, {
      emit
    }) {
      const {
        appContext
      } = getCurrentInstance() as ComponentInternalInstance;
      const proxy = appContext.config.globalProperties;
      //
      const state = reactive({
        ValueType,
        groupNames,
        placeholder: '请设置条件',
        errorInfo: '',
        showError: false
      });
      const content = computed(() => {
        
        const conditions = props.config.conditions
        var text = "请设置条件"
        if(conditions && conditions.length >0){
          text = ""
          for(let condition of conditions){
            text += condition.paramLabel + condition.label + (condition.valLabel || condition.val) +" 且 "
          }
          text = text.substring(0,text.lastIndexOf(' 且 '))
        }
        return text
      });
      // const content = computed(() => {
      //   const groups = props.config.props.groups
      //   let confitions: any[] = []
      //   groups.forEach((group: any) => {
      //     let subConditions = []
      //     group.conditions.forEach(subCondition => {
      //       let subConditionStr = ''
      //       switch (subCondition.valueType) {
      //         case ValueType.dept:
      //         case ValueType.user:
      //           subConditionStr =
      //             `${subCondition.title}属于[${String(subCondition.value.map(u => u.name)).replaceAll(',', '. ')}]之一`
      //           break;
      //         case ValueType.number:
      //         case ValueType.string:
      //           subConditionStr = getOrdinaryConditionContent(subCondition)
      //           break;
      //       }
      //       subConditions.push(subConditionStr)
      //     })
      //     //根据子条件关系构建描述
      //     let subConditionsStr = String(subConditions)
      //       .replaceAll(',', subConditions.length > 1 ?
      //         (group.groupType === 'AND' ? ') 且 (' : ') 或 (') :
      //         (group.groupType === 'AND' ? ' 且 ' : ' 或 '))
      //     confitions.push(subConditions.length > 1 ? `(${subConditionsStr})` : subConditionsStr)
      //   })
      //   //构建最终描述
      //   return String(confitions).replaceAll(',', (props.config.props.groupsType === 'AND' ? ' 且 ' : ' 或 '))
      // });
      //
      const getDefault = (val: any, df: any) => {
        return val && val !== '' ? val : df;
      };
      const getOrdinaryConditionContent = (subCondition: any) => {
        switch (subCondition.compare) {
          case 'IN':
            return `${subCondition.title}为[${String(subCondition.value).replaceAll(',', '、')}]中之一`
          case 'B':
            return `${subCondition.value[0]} < ${subCondition.title} < ${subCondition.value[1]}`
          case 'AB':
            return `${subCondition.value[0]} ≤ ${subCondition.title} < ${subCondition.value[1]}`
          case 'BA':
            return `${subCondition.value[0]} < ${subCondition.title} ≤ ${subCondition.value[1]}`
          case 'ABA':
            return `${subCondition.value[0]} ≤ ${subCondition.title} ≤ ${subCondition.value[1]}`
          case '<=':
            return `${subCondition.title} ≤ ${getDefault(subCondition.value[0], ' ?')}`
          case '>=':
            return `${subCondition.title} ≥ ${getDefault(subCondition.value[0], ' ?')}`
          default:
            return `${subCondition.title}${subCondition.compare}${getDefault(subCondition.value[0], ' ?')}`
        }
      };
      // 校验数据配置的合法性
      const validate = (err: any) => {
        // const propsA = props.config.props
        // if (propsA.groups.length <= 0) {
        //   state.showError = true
        //   state.errorInfo = '请设置分支条件'
        //   err.push(`${props.config.name} 未设置条件`)
        // } else {
        //   for (let i = 0; i < propsA.groups.length; i++) {
        //     if (propsA.groups[i].cids.length === 0) {
        //       state.showError = true
        //       state.errorInfo = `请设置条件组${state.groupNames[i]}内的条件`
        //       err.push(`条件 ${props.config.name} 条件组${state.groupNames[i]}内未设置条件`)
        //       break
        //     } else {
        //       let conditions = propsA.groups[i].conditions
        //       for (let ci = 0; ci < conditions.length; ci++) {
        //         let subc = conditions[ci]
        //         if (subc.value.length === 0) {
        //           state.showError = true
        //         } else {
        //           state.showError = false
        //         }
        //         if (state.showError) {
        //           state.errorInfo = `请完善条件组${state.groupNames[i]}内的${subc.title}条件`
        //           err.push(`条件 ${props.config.name} 条件组${state.groupNames[i]}内${subc.title}条件未完善`)
        //           return false
        //         }
        //       }
        //     }
        //   }
        // }
        const conditions = props.config.conditions
        if(conditions.length <= 0){
          state.showError = true
          state.errorInfo = '请设置分支条件'
          err.push(`${props.config.name} 未设置条件`)
        }else{
          state.showError = false
        }
        return !state.showError
      }
      // 页面加载时
      onMounted(() => {});
      return {
        proxy,
        ...toRefs(state),
        //
        content,
        //
        getDefault,
        getOrdinaryConditionContent,
        validate,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .node-error-state {
    .node-body {
      box-shadow: 0px 0px 5px 0px #F56C6C !important;
    }
  }

  // .node-unCompleted-state {
  //   .node-body-header {
  //     background-color: #ccc !important;
  //   }
  //   .node-body {
  //     // box-shadow: 0px 0px 5px 0px #67eb0f !important;
  //     background-color: #ccc !important;
  //   }
  // }

  // .node-completed-state {
  //   .node-body {
  //     box-shadow: 0px 0px 5px 0px #67eb0f !important;
  //   }
  // }

  .node {
    padding: 30px 55px 0;
    width: 320px;

    .node-body {
      cursor: pointer;
      min-height: 80px;
      max-height: 120px;
      position: relative;
      border-radius: 5px;
      background-color: white;
      box-shadow: 0px 0px 5px 0px #d8d8d8;

      &:hover {

        .node-body-left,
        .node-body-right {
          i {
            display: block !important;
          }
        }

        .node-body-main {
          .level {
            display: none !important;
          }

          .option {
            display: inline-block !important;
          }
        }

        box-shadow: 0px 0px 3px 0px;
      }

      .node-body-left,
      .node-body-right {
        display: flex;
        align-items: center;
        position: absolute;
        height: 100%;

        i {
          display: none;
        }

        &:hover {
          background-color: #ececec;
        }
      }

      .node-body-left {
        left: 0;
      }

      .node-body-right {
        right: 0;
        top: 0;
      }

      .node-body-main {
        //position: absolute;
        width: 188px;
        margin-left: 17px;
        display: inline-block;

        .node-body-main-header {
          padding: 10px 0px 5px;
          font-size: xx-small;
          position: relative;

          .title {
            color: #15bca3;
            display: inline-block;
            height: 14px;
            width: 125px;
          }

          .level {
            position: absolute;
            right: 15px;
            color: #888888;
          }

          .option {
            position: absolute;
            right: 0;
            display: none;
            font-size: default;

            i {
              color: #888888;
              padding: 0 3px;
            }
          }
        }

        .node-body-main-content {
          padding: 6px;
          color: #656363;
          font-size: 14px;

          i {
            position: absolute;
            top: 55%;
            right: 10px;
            font-size: default;
          }

          .placeholder {
            color: #8c8c8c;
          }
        }
      }

      .node-error {
        position: absolute;
        right: -40px;
        top: 20px;
        font-size: 25px;
        color: #F56C6C;
      }
    }

    .node-footer {
      position: relative;

      .btn {
        width: 100%;
        display: flex;
        height: 70px;
        padding: 20px 0 32px;
        justify-content: center;
      }

      .el-button {
        height: 32px;
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        margin: auto;
        width: 2px;
        height: 100%;
        background-color: #CACACA;
      }
    }
  }
</style>