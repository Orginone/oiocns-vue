<script setup lang="ts">
import { ref, onMounted } from "vue";
import { IForm } from "@/ts/core";
import Viewer from "./Viewer/index.vue";
import useAsyncLoad from '@/hooks/useAsyncLoad'

const props = defineProps<{
  form: IForm;
}>();
const loaded = ref<any>(false);
onMounted(async () => {
  console.log(props.form.metadata)
  loaded.value = useAsyncLoad(() => props.form.loadContent());
});
</script>
<template>
  <Viewer
    :rules="[]"
    :data="{}"
    :changedFields="[]"
    :form="form.metadata"
    :fields="form.fields"
    :belong="form.directory.target.space"
  />
</template>
