import { ref } from "vue";
import EntityIcon from "@/components/Common/GlobalComps/entityIcon.vue";
import { schema } from "@/ts/base";
import { formatZhDate } from "@/utils/tools";
export const EntityColumns = (entity: schema.XEntity) => {
  const columns = ref([]);

  if (entity.belongId !== entity.id) {
    columns.value.push({
      title: "归属",
      dataIndex: "belongId",
      readonly: true,
      types:'icon',
      value:entity.belongId,
    });
  }
  if (entity.createUser !== entity.id) {
    columns.value.push({
      title: "创建人",
      dataIndex: "createUser",
      readonly: true,
      types:'icon',
      value:entity.createUser,
    });
  }
  columns.value.push({
    title: "创建时间",
    dataIndex: "createTime",
    readonly: true,
    value: formatZhDate(entity.createTime),
  });
  if (entity.updateUser !== entity.createUser) {
    columns.value.push({
      title: "更新人",
      dataIndex: "updateUser",
      readonly: true,
      types:'icon',
      value: entity.updateUser,
    });
  }
  if (entity.createTime !== entity.updateTime) {
    columns.value.push({
      title: "更新时间",
      dataIndex: "updateTime",
      readonly: true,
      value: formatZhDate(entity.updateTime),
    });
  }
  return columns;
};
