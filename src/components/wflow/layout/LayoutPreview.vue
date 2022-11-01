<template>
	<div class="system-add-d	ic-container">
		<el-dialog title="预览" v-model="isShowDialog" width="800px" :close-on-click-modal="false">
		  <pre style="font-family: Monaco,Menlo,Consolas,Bitstream Vera Sans Mono,monospace;font-size: 14px;">{{ designJson }}</pre>
			<!-- <ProcessTree ref="process-tree" :flag="isflag" /> -->
		</el-dialog>
	</div>
</template>

<script lang="ts">
	import {
		ref,
		defineComponent,
		getCurrentInstance,
		ComponentInternalInstance,
		reactive,
		toRefs,
	} from 'vue';
	
  import ProcessTree from '../process/ProcessTree.vue'

	export default defineComponent({
		name: 'systemAddDic',
		components: {
      ProcessTree,
    },
		setup(props, {
			emit
		}) {
			const {
				appContext
			} = getCurrentInstance() as ComponentInternalInstance;

			const proxy = appContext.config.globalProperties;

			const state = reactive({
				isShowDialog: false,
				isflag: true,
				design: {},
				designJson: {}
			});
			// 打开弹窗
			const openDialog = (design : any) => {
				state.isShowDialog = true;
				state.design = Object.assign({}, design);
				state.designJson = JSON.stringify(design, null, 4)
			};
			// 关闭弹窗
			const closeDialog = () => {
				state.isShowDialog = false;
			};
			return {
				openDialog,
				closeDialog,
				...toRefs(state),
			};
		},
	});
</script>