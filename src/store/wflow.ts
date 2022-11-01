import { defineStore } from 'pinia'

type appwfState =  {
	nodeMap: Record < string, any >;
	isEdit: null;
	selectedNode: Record < string, any >;
	selectFormItem: null;
	design: Record < string, any >;
	designList: Array<Record < string, any >>;
	form: any
}

export const useAppwfConfig = defineStore({
  id: 'appwfConfig', // id必填，且需要唯一
	state: (): appwfState => ({
		nodeMap: new Map(),
		isEdit: null,
		selectedNode: {},
		selectFormItem: null,
		design: {},
		designList:[],
		form: {}
	}),
	actions: {
		async addNodeMap(data: any) {
			this.nodeMap.set(data.nodeId, data.node);
		},
		async setSelectedNode(data: any) {
			this.selectedNode = data;
		},
		async setDesign(data: any) {
			this.design = data;
		},
		async setDesignList(data: any) {
			this.designList = data;
		},
		async setForm(data: any) {
			this.form = data;
		},
		async setIsEdit(data: any) {
			this.isEdit = data;
		},
	}
});
