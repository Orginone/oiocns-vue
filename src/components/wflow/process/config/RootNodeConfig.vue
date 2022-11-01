<template>
  <div>
    <p class="desc">选择能发起该审批的人员/部门，不选则默认开放给所有人</p>
    <!-- <el-button size="default" @click="selectOrg" icon="el-icon-plus" type="primary" round>请选择</el-button> -->
    <!-- <org-items v-model="select"/>
    <org-picker title="请选择可发起本审批的人员/部门" multiple ref="orgPicker" :selected="select" @ok="selected"/> -->
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
  
  export default defineComponent({
    name: 'RootConfig',
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    setup(props, { emit }) {
      const { appContext  } = getCurrentInstance() as ComponentInternalInstance;
      const proxy = appContext.config.globalProperties;
      //
      // const orgPicker = ref();
      //
      const state = reactive({
        showOrgSelect: false
      });
      //
      const select = computed(() => {
        return props.config.assignedUser
      });
      //
      const selectOrg = () => {
        // orgPicker.value.orgPicker.show()
      };
      const selected = (select: any) => {
        select.length = 0
        select.forEach((val: any) => select.push(val))
      };
      const removeOrgItem = (index: any) => {
        props.config.assignedUser.splice(index, 1)
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
        select,
        //
        selectOrg,
        selected,
        removeOrgItem,
      };
    },
  });
</script>

<style lang="scss" scoped>
.desc{
  font-size: small;
  color: #8c8c8c;
}
.org-item{
  margin: 5px;
}
</style>
