<script setup lang='ts'>
import DirectoryViewer from '@/components/Directory/views/index.vue'
import { IDEntity, IDirectory,IFile } from '@/ts/core'
import { command } from '@/ts/base'
import { cleanMenus } from '@/utils/tools'
import { loadFileMenus } from '@/executor/fileOperate'
import MemberDetail from './components/memberDetail.vue'

const props = defineProps<{
  memberDirectory: IDirectory
}>()

const currentMember = ref<IDEntity>()
const x = ref(0)
const y = ref(0)

</script>
<template>
  <div class="member-body">
    <DirectoryViewer
      title="群成员"
      :initTags="['成员']"
      :show-tags="true"
      :extra-tags="false"
      :content="memberDirectory.content()"
      :select-files="[]"
      :fileOpen="(member,_,e)=>{currentMember=member;x=e.clientX;y=e.clientY}"
      show-footer
      :contextMenu="(entity: IDEntity | undefined) => {
        const file = (entity as IFile) || memberDirectory;
        return {
          items: cleanMenus(loadFileMenus(file)) || [],
          onClick: ({ key }) => {
            command.emitter('executor', key, file);
          },
        }
      }"
    />
    <MemberDetail :member="currentMember"  :x="x" :y="y"/>
  </div>
</template>

<style lang='scss' scoped>
.member-body {
  height: 100%;
  width: 100%;
}
</style>