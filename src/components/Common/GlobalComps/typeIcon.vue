
<script setup lang="ts">
import { TargetType } from '@/ts/core'
import * as im from '@/icons/im'
import * as fa from '@/icons/fa'

const props = defineProps<{
  avatar?: boolean;
  size?: number;
  color?: string;
  iconType: string;
}>()

const {iconType,size,color} = props
const config: any = { size: size || 12, color: color || '#3838b9' }

const loadIcon = () => {
  switch (props.iconType) {
    case '动态':
      return im.Safari
    case '目录':
      return im.Folder
    case '成员目录':
      return im.Books
    case '标准':
      return im.File
    case '字典':
      return im.Book
    case '分类':
      return im.Tree
    case '分类项':
      return im.PriceTags
    case '属性':
      return im.Joomla
    case '应用':
      return im.Dropbox
    case '模块':
      return im.Delicious
    case '办事':
      return im.Shuffle
    case '表单':
    case '报表':
    case '事项配置':
    case '实体配置':
      return im.Paste
    case '角色':
      return im.Key
    case '权限': 
      return im.Shield
    case '激活':
      return im.PowerCord
    case TargetType.Company:
    case TargetType.University:
    case TargetType.Hospital:
      return im.Office
    case TargetType.Storage:
      return im.Drive
    case TargetType.Station:
      return im.AddressBook
    case TargetType.Group:
      return im.Tree
    case TargetType.Cohort:
      return im.Bubbles2
    case TargetType.Section:
    case TargetType.Department:
      return im.Library
    case TargetType.Person:
      return im.UserTie
    case TargetType.College:
      return im.Trophy
    case TargetType.Laboratory:
      return im.Joomla
    case TargetType.Office:
      return im.Briefcase
    case TargetType.Research:
      return im.Flickr4
    case TargetType.Working:
      return im.Users
    case 'newDir':
      return im.FolderPlus
    case 'refresh':
      return im.Spinner9
    case 'remark':
      return im.Wrench
    case 'open':
      return im.Delicious
    case 'design':
      return im.Equalizer
    case 'copy':
      return im.Copy
    case 'move':
      return im.Shuffle
    case 'parse':
      return im.CoinPound
    case 'rename':
      return im.Pencil
    case 'delete':
      return im.Bin
    case 'restore':
      return im.Undo2
    case 'remove':
      return im.UserMinus
    case 'update':
      return im.PriceTags
    case 'pull':
      return im.UserPlus
    case 'qrcode':
      return im.Qrcode
    case 'joinFriend':
      return im.UserPlus
    case 'joinCohort':
      return im.Users
    case 'joinCompany':
      return im.Plus
    case 'joinGroup':
      return im.Enter
    case 'newFile':
      return im.Upload
    case 'taskList':
      return im.List
    case 'setToping':
      return im.ImUpload3
    case 'removeToping':
      return im.ImDownload3
    case 'setReaded':
      return im.ImCheckmark
    case 'setNoReaded':
      return im.ImBell
    default:
      return loadFileIcon();
  }
}
const loadFileIcon = () => {
  switch (props.iconType) {
    case 'application/pdf':
      return fa.FilePdf
    case 'application/x-zip-compressed':
      return fa.FileArchive
  }
  if (iconType?.startsWith('application')) {
    return fa.AppStoreIos
  } else if (iconType?.startsWith('video')) {
    return fa.FileVideo
  } else if (iconType?.startsWith('image')) {
    return fa.FileImage
  } else if (iconType?.startsWith('text')) {
    return fa.FileCode
  } else if (iconType?.startsWith('audio')) {
    return fa.FileAudio
  }
  return fa.FilesEmpty
}

</script>

<template>
  <ElIcon v-if="avatar" v-bind="config">
    <component :is="loadIcon()" />
  </ElIcon>
  <div v-else class="type-icon-not-avatar">
    <ElIcon v-bind="config" :size="size" color="rgb(56, 56, 185)">
      <component :is="loadIcon()" />
    </ElIcon>
  </div>  
</template>

<style lang="scss" scoped>
.type-icon-not-avatar {
  padding-right: 10px;display: flex;justify-content: center;align-items: center;
}
</style>
