<script setup lang='ts'>
import { kernel } from '@/ts/base'
import orgCtrl from '@/ts/controller'
import { useStagings } from '../../../core/hooks/useChange'
import { SEntity } from '../../../design/config/FileProp'
  const props = defineProps<{
    ctx: any
    size: number
    forms: SEntity[]
  }>()
  const current = props.ctx.view.pageInfo;
  const loading = ref(false)
  const page = ref<number>(1)
  const size = ref<number>(props.size)
  const total = ref<number>(0)
  const data = ref<any[]>([])
  const userData = ref<string[]>([])
  const dictFilter =ref<{ [id: string]: any }>({})
  const rangeFilter = ref<{ [id: string]: any[] }>({})

  const stagings = useStagings(orgCtrl.box, current.relations)
  onMounted(() => {
    loadData(size.value, page.value)
  })
  props.ctx.view.subscribe((type: string, cmd: string, args: any) => {
    if (type == 'species' && cmd == 'checked') {
      userData.value = args;
    } else if (type == 'dicts') {
      if (cmd == 'changed') {
        dictFilter.value[args.id] = args.data;
      } else if (cmd == 'delete') {
        delete dictFilter.value[args];
      }
    } else if (type == 'ranges') {
      if (cmd == 'changed') {
        rangeFilter.value[args.id] = args.data;
      } else if (cmd == 'delete') {
        delete rangeFilter.value[args];
      }
    }
    loadData(size.value, 1);
  })
  const loadData = async (take: number, p: number) => {
    loading.value = true
    const options: any = {
      take: take,
      skip: (p - 1) * take,
      requireTotalCount: true,
      filter: [],
    };
    options.userData = props.forms.map((form) => 'F' + form.id);
    if (userData.value.length > 0) {
      options.userData.push(...userData.value);
    }
    for (const item of Object.entries(dictFilter.value)) {
      options.filter.push(item[1], 'and');
    }
    for (const items of Object.entries(rangeFilter.value)) {
      for (const item of items[1]) {
        options.filter.push(item, 'and');
      }
    }
    const res = await kernel.loadThing(
      current.belongId,
      [current.directory.target.spaceId, current.directory.target.id],
      options,
    )
    data.value = res.data ?? []
    size.value = take
    page.value = p
    total.value = res.totalCount
    loading.value = false
  }


</script>
<template>
<div v-loading="loading">
  <ElSpace style="width: 100%;" direction="vertical">
    TODO:
    <!-- <ElRow :gutter="16">
      {data.map((item) => {
        if (props.content) {
          const has = stagings.filter((staging) => staging.data.id == item.id);
          return (
            <Col key={item.id} span={props.span} className={cls.contentCard}>
              <Space.Compact style={{ width: '100%' }} direction="vertical">
                {props.content({ data: item })}
                {has.length == 0 && (
                  <Button
                    icon={<CirclePlusFilled style={{ color: 'green' }} />}
                    size="small"
                    onClick={() => {
                      orgCtrl.box.createStaging({
                        typeName: '实体',
                        data: item,
                        relations: current.relations,
                      } as schema.XStaging);
                    }}>
                    {'加入购物车'}
                  </Button>
                )}
                {has.length > 0 && (
                  <Button
                    icon={<CirclePlusFilled style={{ color: 'red' }} />}
                    size="small"
                    onClick={() => {
                      orgCtrl.box.removeStaging(has);
                    }}>
                    {'取消加入'}
                  </Button>
                )}
              </Space.Compact>
            </Col>
          );
        }
        return <Empty key={item.id} description={'未放置组件'} />;
      })}
    </ElRow>
    <div className={cls.page}>
      <Pagination
        current={page}
        pageSize={size}
        total={total}
        onChange={(page, size) => {
          loadData(size, page);
        }}
      />
    </div> -->
  </ElSpace>
</div>
</template>

<style lang='scss' scoped>

</style>