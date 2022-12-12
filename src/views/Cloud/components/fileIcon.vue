<template>
  <div class="file-icon" :style="{width: props.size + 'px', height: props.size + 'px'}">
    <img :src="iconSvg">
  </div>
</template>

<script lang="ts" setup>
  import {ref, onMounted} from 'vue'
  import default_file from '@/icons/svg/default_file.svg'
  import default_folder from '@/icons/svg/default_folder.svg'
  import file_type_txt from '@/icons/svg/file_type_txt.svg'
  import file_type_image from '@/icons/svg/file_type_image.svg'
  import file_type_excel from '@/icons/svg/file_type_excel.svg'
  import file_type_word from '@/icons/svg/file_type_word.svg'
  import file_type_html from '@/icons/svg/file_type_html.svg'
  const props = defineProps({
    fileItem: {
      type: Object
    },
    size: {
      type: Number
    }
  })
  const iconSvg = ref('')
  const fileIconMap: any = {
    'folder': default_folder,
    'file': default_file,
    'txt': file_type_txt,
    'png': file_type_image,
    'gif': file_type_image,
    'jpg': file_type_image,
    'jpeg': file_type_image,
    'xlsx': file_type_excel,
    'xls': file_type_excel,
    'csv': file_type_excel,
    'doc': file_type_word,
    'docx': file_type_word,
    'html': file_type_html
  }

  onMounted(() => {
    let fileType = 'file'
    if(props.fileItem.target.isDirectory) {
      fileType = 'folder'
    } else {
      fileType = props.fileItem.target.extension.replace('.', '')
    }
    iconSvg.value = fileIconMap[fileType] || fileIconMap['file']
  })
</script>
<style lang="scss" scoped>
.file-icon {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
