<template>
    <div>
      <el-table :header-cell-style="{background:'#f5f6f6'}" :data="formPerms" border style="width: 100%">
        <el-table-column prop="title" show-overflow-tooltip label="表单字段">
          <!-- <template slot-scope="scope">
             <span v-if="scope.row.required" style="color: #c75450"> * </span>
            <span>{{ scope.row.title }}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="readOnly" label="只读" width="80">
          <!-- <template slot="header" slot-scope="scope">
            <el-radio label="R" v-model="permSelect" @change="allSelect('R')">只读</el-radio>
          </template>
          <template slot-scope="scope">
            <el-radio v-model="scope.row.perm" label="R" :name="scope.row.id"></el-radio>
          </template> -->
        </el-table-column>
        <el-table-column prop="editable" label="可编辑" width="90" v-if="nowNode.type !== 'CC'">
          <!-- <template slot="header" slot-scope="scope">
            <el-radio label="E" v-model="permSelect" @change="allSelect('E')">可编辑</el-radio>
          </template>
          <template slot-scope="scope">
            <el-radio v-model="scope.row.perm" label="E" :name="scope.row.id"></el-radio>
          </template> -->
        </el-table-column>
        <el-table-column prop="hide" label="隐藏" width="80">
          <!-- <template slot="header" slot-scope="scope">
            <el-radio label="H" v-model="permSelect" @change="allSelect('H')">隐藏</el-radio>
          </template>
          <template slot-scope="scope">
            <el-radio v-model="scope.row.perm" label="H" :name="scope.row.id"></el-radio>
          </template> -->
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script lang="ts">
    import {
      ref,
      watch,
      toRefs,
      reactive,
      computed,
      onMounted,
      defineComponent,
      getCurrentInstance,
      ComponentInternalInstance
    } from 'vue';
    
    export default defineComponent({
      name: 'FormAuthorityConfig',
      components: {},
      setup(props, { emit }) {
        const { appContext  } = getCurrentInstance() as ComponentInternalInstance;
        const proxy = appContext.config.globalProperties;
        //
        const state = reactive({
          tableData: [],
          isIndeterminate: false,
          permSelect: '',
          checkStatus: {
            readOnly: true,
            editable: false,
            hide: false
          }
        });
        //
        const nowNode = computed(() => {
          return proxy.$pinia.state.value.appwfConfig.selectedNode
        });
        const formData = computed(() => {
          return proxy.$pinia.state.value.appwfConfig.design.formItems
        });
        const formPerms:any = computed(() => {
          return proxy.$pinia.state.value.appwfConfig.selectedNode.props.formPerms
        });
        //
        watch(() => formPerms, (value) => {
          const set = new Set(formPerms.map((f:any) => f.perm))
          var values:any = set.values();
          state.permSelect = set.size === 1 ? values[0] : ''
              }, {deep: true});
        //
        const allSelect = (type: string) => {
          state.permSelect = type
          formPerms.forEach((f:any) => f.perm = type)
        };
        const formPermsLoad = (oldPermMap: any, forms: any) => {
          forms.forEach((form: any) => {
            if (form.name === 'SpanLayout') {
              formPermsLoad(oldPermMap, form.props.items)
            } else {
              //刷新名称
              let old = oldPermMap.get(form.id)
              if (old){
                old.title = form.title
                old.required = form.props.required
                formPerms.push(old)
              }else {
                formPerms.push({
                  id: form.id,
                  title: form.title,
                  required: form.props.required,
                  perm: proxy.$pinia.state.value.appwfConfig.selectedNode.type === 'ROOT' ? 'E' : 'R'
                })
              }
            }
          })
        };
        const handleCheckAllChange = () => {
  
        };
        // 页面加载时
        onMounted(() => {
          //备份
          let oldPermMap = formPerms.toMap('id')
          //重新清空，按顺序加载权限
          formPerms.length = 0;
          formPermsLoad(oldPermMap, formData)
        });
        return {
          proxy,
          ...toRefs(state),
          //
          nowNode,
          formData,
          formPerms,
          //
          allSelect,
          formPermsLoad,
          handleCheckAllChange,
        };
      },
    });
  </script>
  
  <!-- <script>
  export default {
    name: "FormAuthorityConfig",
    components: {},
    data() {
      return {
        tableData: [],
        isIndeterminate: false,
        permSelect: '',
        checkStatus: {
          readOnly: true,
          editable: false,
          hide: false
        }
      }
    },
    created() {
      //备份
      let oldPermMap = this.formPerms.toMap('id')
      //重新清空，按顺序加载权限
      this.formPerms.length = 0;
      this.formPermsLoad(oldPermMap, this.formData)
    },
    computed: {
      nowNode(){
        return this.$store.state.selectedNode
      },
      formData() {
        return this.$store.state.design.formItems
      },
      formPerms() {
        return this.$store.state.selectedNode.props.formPerms
      }
    },
    methods: {
      allSelect(type) {
        this.permSelect = type
        this.formPerms.forEach(f => f.perm = type)
      },
      formPermsLoad(oldPermMap, forms) {
        forms.forEach(form => {
          if (form.name === 'SpanLayout') {
            this.formPermsLoad(oldPermMap, form.props.items)
          } else {
            //刷新名称
            let old = oldPermMap.get(form.id)
            if (old){
              old.title = form.title
              old.required = form.props.required
              this.formPerms.push(old)
            }else {
              this.formPerms.push({
                id: form.id,
                title: form.title,
                required: form.props.required,
                perm: this.$store.state.selectedNode.type === 'ROOT' ? 'E' : 'R'
              })
            }
          }
        })
      },
      handleCheckAllChange() {
  
      }
    },
    watch: {
      formPerms: {
        deep: true,
        handler() {
          const set = new Set(this.formPerms.map(f => f.perm))
          this.permSelect = set.size === 1 ? set.values()[0] : ''
        }
      },
  
    }
  }
  </script> -->
  
  <style lang="scss" scoped>
  
  .el-table__row {
    & > td:first-child {
      .cell {
        text-align: left;
      }
    }
  
    .cell {
      text-align: center;
    }
  
    .el-radio__label {
      display: none;
    }
  }
  </style>
  