<template>
  <div class="main">
    <DiyTable
      :style="{ width: '100%' }"
      ref="diyTable"
      :hasTabs="true"
      :hasTitle="false"
      :hasTableHead="true"
      :tableData="tableData"
      :tableHead="tableHead"
      ><template #buttons>
        <el-button class="btn-check" type="primary" text link
          >新增表单
        </el-button>
      </template>
      <template #operate="scope">
        <el-dropdown>
          <span class="el-dropdown-link"> ··· </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>编辑</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
              <el-dropdown-item>设计表单</el-dropdown-item>
              <el-dropdown-item>预览表单</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </DiyTable>
  </div>
</template>

<script lang="ts">
export default {
  name: "FormSet",
};
</script>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { ref, onMounted, watch } from 'vue';
import { thingCtrl as thing, userCtrl as user } from "@/ts/coreIndex";

const store = useUserStore();

const props = defineProps({
  info: Object,
});
const tableHead = [
  {
    prop: "code",
    label: "业务编号",
  },
  {
    prop: "name",
    label: "业务名称",
  },
  {
    prop: "speciesName",
    label: "特性分类",
  },
  {
    prop: "belongName",
    label: "共享组织",
  },
  {
    type: "slot",
    label: "操作",
    fixed: "right",
    align: "center",
    width: "150",
    name: "operate",
  },
];
const tableData = ref<any>([]);

const getTableData = async () => {
  const { data: res } = await thing.loadFormSetTable({
    id: props.info.id,
    spaceId: store.workspaceData.id,
    page: {
      offset: 0,
      limit: 20,
      filter: "",
    },
  });
  res.result.forEach((item: any) => {
    const team = user.findTeamInfoById(item.belongId);
    if (team) {
      item.belongName = team.name;
    }
    item.speciesName = findSpeciesName([thing.teamSpecies], item.speciesId);
  });
  tableData.value = res.result;
};

watch(() => props.info, () => {
 getTableData() 
}, {
  deep: true
})

onMounted(() => {
  getTableData();
});

const findSpeciesName = (species: any[], id: string): string | undefined => {
  let specesName = undefined;
  for (const item of species) {
    if (item?.id == id) {
      specesName = item.name;
    } else if (item?.children) {
      specesName = findSpeciesName(item?.children, id);
    }
    if (specesName) {
      break;
    }
  }
  return specesName;
};
</script>

<style lang="scss" scoped></style>
