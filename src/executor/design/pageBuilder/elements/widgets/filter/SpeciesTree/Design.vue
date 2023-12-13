<script setup lang='ts'>
import CustomTree from '@/components/CustomTree/index.vue'
import { Context } from '../../../../render/PageContext'
import { File } from '../../../../design/config/FileProp'
import { IProperty } from '@/ts/core'
import {
  SpeciesEntity,
  SpeciesNode,
  SpeciesProp,
  loadItems,
} from '../../../../core/hooks/useSpecies'
const props = defineProps<{
  ctx: Context
  species: SpeciesProp[]
}>()

const loading = ref(false)
  const species = ref<SpeciesEntity[]>([])
  const loadSpecies = async () => {
    loading.value = true
    species.value = await loadItems(props.species, props.ctx)
    loading.value = false
  }
  onMounted(() => {
    loadSpecies()
  })

</script>
<template>
  <div v-loading="loading">
    <div style="width: 300px; padding: 0 10px; display: flex; flex-direction: column;">
      <CustomTree
        searchable
        :treeData="species"
      >
        <template #title>
            TODO: titleRender
              <!-- (node: any) => {
              return (
                <Space align="start">
                  <DeleteOutlined
                    onClick={() => {
                      const index = props.species.findIndex((id) => id == node.id);
                      props.species.splice(index, 1);
                      loadSpecies();
                    }}
                  />
                  {node.name}
                </Space>
              );
            }} -->
        </template>
      </CustomTree>
      <File
        :accepts="['分类型']"
        :multiple="true"
        :excludeIds="props.species.map((item) => item.code)"
        :onOk="(files) => {
          files.forEach((file) => {
            const property = file as IProperty
            props.species.push({
              code: property.id,
              name: property.code + ' ' + property.name,
              speciesId: property.metadata.speciesId,
            })
          })
          loadSpecies()
        }"
      >
        <button>
          添加分类型
        </button>
      </File>
    </div>
  </div>
</template>
