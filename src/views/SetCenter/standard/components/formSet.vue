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
      :total="pages.total"
      @hanldeUpdate="handlePageUpdate"
      ><template #buttons>
        <el-button
          class="btn-check"
          type="primary"
          text
          link
          @click="createAddDialog()"
        >
          新增表单
        </el-button>
      </template>
      <template #operate="scope">
        <el-dropdown>
          <span class="el-dropdown-link"> ··· </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="editAddDialog(scope.row)"
                >编辑</el-dropdown-item
              >
              <el-dropdown-item @click="delFormInfo(scope.row)"
                >删除</el-dropdown-item
              >
              <el-dropdown-item @click="goFormDesign()"
                >设计表单</el-dropdown-item
              >
              <el-dropdown-item>预览表单</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </DiyTable>
    <AddForm
      v-if="dialog"
      v-model:dialog="dialog"
      :info="info"
      v-model:editFormInfo="editFormInfo"
      @updateTable="getTableData(props.info)"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: "FormSet",
};
</script>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { thingCtrl as thing, userCtrl as user } from "@/ts/coreIndex";
import { useRouter } from "vue-router";
import AddForm from "./addForm.vue";
const router = useRouter();

const props = defineProps({
  info: Object,
  recursionOrg: Boolean,
  recursionSpecies: Boolean,
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
    prop: "beginAuthId",
    label: "角色",
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
const dialog = ref<boolean>(false);
const tableData = ref<any>([]);
const pages = reactive<any>({
  currentPage: 0, // 当前页
  pageSize: 20, // 每页条数
  total: 0,
});
const getTableData = async (currentSpace: any) => {
  const res = await currentSpace.loadOperations(
    user.space.id,
    false,
    props.recursionOrg,
    props.recursionSpecies,
    {
      offset: pages.currentPage,
      limit: pages.pageSize,
      filter: "",
    }
  );
  if (res.result) {
    res.result.forEach((item: any) => {
      const team = user.findTeamInfoById(item.belongId);
      if (team) {
        item.belongName = team.name;
      }
      item.speciesName = findSpeciesName([thing.teamSpecies], item.speciesId);
    });
    tableData.value = res.result;
    pages.total = res.total;
  } else {
    tableData.value = [];
    pages.total = 0;
  }
};

const handlePageUpdate = (pageSize: string, current: string) => {
  pages.currentPage = current;
  pages.pageSize = pageSize;

  getTableData(props.info);
};

watch(
  () => props.info,
  (val) => {
    getTableData(val);
  },
  {
    deep: true,
  }
);

watch(
  () => props.recursionOrg,
  () => {
    getTableData(props.info);
  },
  { deep: true }
);

watch(
  () => props.recursionSpecies,
  () => {
    getTableData(props.info);
  },
  { deep: true }
);

onMounted(() => {
  getTableData(props.info);
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

const goFormDesign = () => {
  router.push("/formDesign");
};

const createAddDialog = () => {
  dialog.value = true;
};

const editFormInfo = ref<any>(null);
const editAddDialog = (val: any) => {
  editFormInfo.value = val;
  dialog.value = true;
};

const delFormInfo = (val: any) => {
  ElMessageBox.confirm("是否确定删除当前数据", "删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await props.info.deleteOperation(val.id);
      getTableData(props.info);
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped></style>
