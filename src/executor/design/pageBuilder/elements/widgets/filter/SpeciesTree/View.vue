<script setup lang='ts'>
import CustomMenu from '@/components/CustomMenu/index.vue'
import { Controller } from '@/ts/controller'
import { Context } from '../../../../render/PageContext'
import useMenuUpdate from '@/hooks/useMenuUpdate'
import { List, schema } from '@/ts/base'
import {h} from 'vue'
import {
  SpeciesEntity,
  SpeciesNode,
  SpeciesProp,
  loadItems,
} from '../../../../core/hooks/useSpecies'
import { MenuItemType } from '@/typings/globelType'

const props = defineProps<{
  ctx: Context
  species: SpeciesProp[]
}>()

const ctrl = ref(new Controller('ctrl'))
const loading = ref(false)
const species = ref<SpeciesEntity[]>([])
const loadSpecies = async () => {
  loading.value = true
  species.value = await loadItems(props.species, props.ctx)
  loading.value = false
  ctrl.value.changCallback()
}
  // eslint-disable-next-line no-unused-vars
  const {rootMenu, selectMenu, onSelectMenu} = useMenuUpdate(() => {
    return {
      key: 'speciesTree',
      label: '分类树',
      itemType: '分类树',
      children: buildSpecies(species.value as SpeciesEntity[]),
    }
  }, ctrl.value as Controller)

  onMounted(() => loadSpecies())

  const parentMenu = selectMenu.value?.parentMenu ?? rootMenu.value
  const sendSearch = (node: any) => {
    if (node.item) {
      if (node.item.id) {
        props.ctx.view.emitter('species', 'checked', ['S' + node.item.id]);
      } else if (node.item.code) {
        props.ctx.view.emitter('species', 'checked', ['T' + node.item.code]);
      }
    }
  }

  const buildItems = (
    code: string,
    parentId: string,
    groups: { [key: string]: schema.XSpeciesItem[] },
  ): any => {
    const children = groups[parentId] ?? [];
    return children.map((item) => {
      return {
        key: code + item.id,
        label: item.name,
        children: buildItems(code, item.id, groups),
        itemType: '分类项',
        item: item,
      }
    })
  }

  const buildSpecies = (species: SpeciesEntity[]): SpeciesNode[] => {
    return species.map((item) => {
      item.species.items.forEach((speciesItems) => {
        if (!speciesItems.parentId) {
          speciesItems.parentId = item.species.id
        }
      })
      const groups = new List(item.species.items).GroupBy((item) => item.parentId);
      return {
        key: item.code + '-' + item.species.id,
        label: item.name,
        children: buildItems(item.code, item.species.id, groups),
        itemType: '分类',
        item: item,
      }
    })
  }
</script>
<template>
  <div v-if="selectMenu && rootMenu" v-loading="loading">
    <div style="width: 300px;padding: 10px;display: flex;flex-direction: column;">
      <div
        style="text-align: center;"
        :title="parentMenu?.label"
        @click=" onSelectMenu(parentMenu); sendSearch(parentMenu)"
      >
        <span style="font-size: 20px;margin: 0px 6px;">TODO:{{parentMenu?.icon}}</span>
        <strong>{{parentMenu?.label}}</strong>
      </div>
      <CustomMenu
        :collapsed="false"
        :selectMenu="selectMenu"
        :item="selectMenu.parentMenu ?? rootMenu"
        :onSelect="(node: any) => {
          onSelectMenu(node)
          sendSearch(node)
        }"
      />
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>