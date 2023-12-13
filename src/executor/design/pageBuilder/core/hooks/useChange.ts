import { command } from '@/ts/base'
import { IBoxProvider } from '@/ts/core/work/box'

export const useStagings = (box: IBoxProvider, relations: string) => {
  const stagings= ref(box.relations(relations, ['实体']))
  let id = ''
  onMounted(() => {
    id = command.subscribe((type, cmd) => {
      switch (type) {
        case 'stagings':
          switch (cmd) {
            case 'refresh':
              stagings.value = box.relations(relations, ['实体'])
              break;
          }
          break;
      }
    })
  })
  onBeforeUnmount(()=>{
    command.unsubscribe(id)
  })
  return stagings
}
