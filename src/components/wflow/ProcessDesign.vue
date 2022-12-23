<template>
	<div class="container">
		<!-- <el-dialog fullscreen v-model="isShowDialog" append-to-body :close-on-click-modal="false" width="1080px"
			:show-close="false"> -->
			<!-- <template #title> -->
				<LayoutHeader v-model="activeSelect" @changeVersion="changeVersion" @activeChange="activeChange" @exit="exit" @preview="preview"
					@publish="validateDesign" @changeScale="changeScale"></LayoutHeader>
			<!-- </template> -->
			<div class="layout-body">
				<!-- <FormBaseSetting ref="baseSetting" v-show="activeSelect === 'baseSetting'" /> -->
      			<!-- <FormDesign ref="formSetting" v-show="activeSelect === 'formSetting'"/> -->
				<FormProcessDesign ref="ProcessDesignRef" v-show="activeSelect === 'processDesign'" :scale="scale"/>
      			<!-- <FormProSetting ref="proSetting" v-show="activeSelect === 'proSetting'"/> -->
			</div>
			 <!-- <el-dialog :showFooter="false" v-model="validVisible" title="设置项检查">
				<el-steps align-center :active="validStep" finish-status="success">
					<el-step v-for="(step, i) in validOptions" :title="step.title" :key="i"
							:icon="step.icon"  :description="step.description"/>
				</el-steps>
				<el-result :icon="validIcon" :title="errTitle" :subTitle="validResult.desc">
					<template #sub-title>
						<div v-for="err in validResult.errs" :key="err">
							{{err}}
						</div>
					</template>
					<template #extra>
						
					<el-button type="primary" v-if="validResult.finished" size="default" @click="doAfter">
						{{ validResult.action }}
					</el-button>
					</template>
				</el-result>
			</el-dialog>  -->
		<!-- </el-dialog> -->
		<LayoutPreview ref="LayoutPreviewRef" />
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
		computed,
		onMounted,
    provide
	} from 'vue';
	import $services from '@/services'
	import userCtrl from '@/ts/controller/setting/userCtrl';
	// import processCtrl from '@/ts/controller/setting/processCtrl';
	import LayoutHeader from './layout/LayoutHeader.vue';
	// import FormDesign from './layout/FormDesign.vue'
	import FormProcessDesign from './layout/FormProcessDesign.vue'
	// import FormProSetting from './layout/FormProcessDesign.vue'
	import LayoutPreview from './layout/LayoutPreview.vue';
	import { formatDate } from '@/utils/index'
	import { useAppwfConfig } from '@/store/wflow';
	import DefaultProps from "./process/DefaultNodeProps"
	import { ElMessage } from 'element-plus'
	export default defineComponent({
		name: 'ProcessDesign',
		components: {
			LayoutHeader,
			// FormBaseSetting,
			// FormDesign,
			FormProcessDesign,
			// FormProSetting,
			LayoutPreview,
		},
		setup(props, {
			emit
		}) {
			const {
				appContext
			} = getCurrentInstance() as ComponentInternalInstance;

			const proxy = appContext.config.globalProperties;

			const stores = useAppwfConfig(proxy.$pinia);
			const ProcessDesignRef = ref();
			const LayoutPreviewRef = ref();
			

			//整个流程设计
			const design = computed(() => {
				return proxy.$pinia.state.value.appwfConfig.design;
			});

			const errTitle = computed(() => {
				if (state.validResult.finished && !state.validResult.success){
					return state.validResult.title + ` (${state.validResult.errs.length}项错误) 😥`
				}
				return state.validResult.title
			});
			const validIcon = computed(() => {
				if (!state.validResult.finished) {
					return 'info'
				} else if (state.validResult.success) {
					return 'success'
				} else {
					return 'warning'
				}
			});

			const changeScale=(val:number)=>{
				state.scale = val
			}

			const state = reactive({
				scale:100,
				isShowDialog: false,
				isNew: true,
      	timer: null,
				activeSelect: 'processDesign',
      	validStep: 0,
				validVisible: false,
				validResult: null,
				validOptions: [
					// {title: '基础信息', description: '', icon: '', status: ''},
					// {title: '审批表单', description: '', icon: '', status: ''},
					{title: '审批流程', description: '', icon: '', status: 'process'},
					// {title: '扩展设置', description: '', icon: '', status: ''}
				],
				validComponents: [ 'processDesign'],
				designList: [],
				params: {},
				tempDesign: null,
				defaultDesign: {
						name: "新建流程",
						code: formatDate(new Date(),'yyyyMMddhhmmss'),
						formId: null,
						formName: "",
						// formFileds: [],
						appId: "",
						appName: "",
						remainHours: 240,
						// version: '新增',
						// logo: {
						// 	icon: "el-icon-eleme",
						// 	background: "#1e90ff"
						// },
						// settings: {
						// 	commiter: [],
						// 	admin: [],
						// 	sign: false,
						// 	notify: {
						// 		types: ["APP"],
						// 		title: "消息通知标题"
						// 	}
						// },
						// groupId: undefined,
						// formItems: [],
						resource: {
							nodeId: "ROOT",
							parentId: null,
							type: "ROOT",
							name: "发起人",
							// desc: "任何人",
							// props: {
							// 	assignedUser: [],
							// 	formPerms: []
							// },
							children: {}
						},
						remark: "备注说明"
					}
			});
			// 传递ProcessTree组件默认值
			// provide('editFlag', editFlag.value);

			onMounted(() => {
	
				
			});  		
			const getBindedFlow = async (obj:any)=>{
				let res = await	$services.wflow.queryDefine({
					data:{
						id: 0,
						productId: obj.appId,
						functionCode: obj.formId,
						status: 1
					}
				})
				if(!res){
					ElMessage({
						message: '接口请求异常',
						type: 'warning'
					})
				}else if ( res.code == 200) {
					let openId = ""
					if(res && res.data && res.data.result){
						res.data.result = res.data.result.map((item:any)=>{item.resource = JSON.parse( item.content )['resource']; item.resource = DefaultProps.getResource(item.resource,true) ;delete item.content ; delete item.flowNodes ;return item})
						obj.flow = res.data.result[0]
						obj.flow.appId = obj.appId
						obj.flow.appName = obj.appName
						obj.flow.formId = obj.formId
						obj.flow.formName = obj.business
					}
				} else {
					ElMessage({
						message: res.msg,
						type: 'warning'
					})
				}
					
			}	

			const getFlowList = async (obj:any)=>{
				let res = await $services.wflow.queryDefine({
					data:{
						id: 0,
						status: 1
					}
				})
				if(!res){
					ElMessage({
						message: '接口请求异常',
						type: 'warning'
					})
				}else if ( res.code == 200) {	
					let openId = ""
					if(res && res.data && res.data.result){
						res.data.result = res.data.result.map((item:any)=>{item.resource = JSON.parse( item.content )['resource']; item.resource = DefaultProps.getResource(item.resource,true) ;delete item.content ; delete item.flowNodes ;return item})
						var newDesign = JSON.parse(JSON.stringify(state.defaultDesign));
						newDesign.appId = obj.appId;
						newDesign.appName = obj.appName;
						newDesign.formId = obj.formId;
						newDesign.formName = obj.business;
						newDesign.name = '新增流程';
						res.data.result.unshift(newDesign)
						stores.setDesignList(res.data.result);
					}	
				} else {
					ElMessage({
						message: res.msg,
						type: 'warning'
					})
				}			
			}

			// 应用id      资源id         
			const startDesign= async (obj:any)=>{
				await getBindedFlow(obj)
				await getFlowList(obj)
				stores.setForm(obj);
				let formFileds:any[] = obj.field;
				DefaultProps.setFormFields(formFileds)
				if(obj.flow){
					state.tempDesign = JSON.parse(JSON.stringify(obj.flow));			
				}else{
					state.defaultDesign.appId = obj.appId;
					state.defaultDesign.appName = obj.appName;
					state.defaultDesign.formId = obj.formId;
					state.defaultDesign.formName = obj.business;
					state.defaultDesign.name = '新增流程';
					state.tempDesign = JSON.parse(JSON.stringify(state.defaultDesign));
				}
				openDialog(state.tempDesign.id)
				// $services.wflow.queryDefine({
				// 	data:{
				// 		id: 0,
				// 		productId: appId,
				// 		functionCode: formId,
				// 		status: 1
				// 	}
				// })
				// .then((res: ResultType) => {
				// 	if(!res){
				// 		ElMessage({
				// 			message: '接口请求异常',
				// 			type: 'warning'
				// 		})
				// 	}else if ( res.code == 200) {
						
				// 		let openId = ""
				// 		if(res && res.data && res.data.result){
				// 			res.data.result = res.data.result.map((item:any)=>{item.resource = JSON.parse( item.content )['resource']; item.resource = DefaultProps.getResource(item.resource) ;delete item.content ; delete item.flowNodes ;return item})
							
				// 			state.designList.push(...res.data.result);
							
				// 			stores.setDesignList(state.designList);
				// 			if(state.designList.length>0){
				// 				openId = state.designList[state.designList.length-1].id
				// 			}
				// 		}
						
				// 		if(!openId){
				// 			state.defaultDesign.appId = obj.appId;
				// 			state.defaultDesign.appName = obj.appName;
				// 			state.defaultDesign.formId = obj.formId;
				// 			state.defaultDesign.formName = obj.business;
				// 			state.defaultDesign.name = obj.business;
				// 		}
				// 		openDialog(openId);
				// 	} else {
				// 		ElMessage({
				// 			message: res.msg,
				// 			type: 'warning'
				// 		})
				// 	}
				// })
			}
			// 打开弹窗
			const openDialog = (id: String) => {
				state.isShowDialog = true;
				stores.setDesign(state.tempDesign);
			};
			// 关闭弹窗
			const closeDialog = () => {
				state.isShowDialog = false;
			};
			// 取消
			const onCancel = () => {
				closeDialog();
			};
			const activeChange = (path: any) => {
				state.activeSelect = path;
			};
			// 退出
			const exit = () => {
				closeDialog();
			};
			// 预览
			const preview = () => {
				LayoutPreviewRef.value.openDialog(design.value);
				// editFlag.value = !editFlag.value;
			};
				// provide('', editFlag);
			const changeVersion = (versionId:string)=>{
				if(versionId =='新增'){
					
				}else{

				}
			}
			// 发布
			const publish = () => {
				let design = JSON.parse(JSON.stringify(stores.design))
				design = DefaultProps.getResource(design,false)
				proxy.$confirm('确认发布后流程立即生效，是否继续?', '提示', {
					confirmButtonText: '发布',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					
						$services.wflow.createDefine({
							data: design
						}).then((res: ResultType) => {
							if ( res && res.code == 200) {
								let flow = JSON.parse(res.data.content)
								if(design.id){
									ElMessage({
											message: "发布成功",
											type: 'success'
										})
										
									closeDialog();
									state.validVisible = false
								}else{
									//如果没有id 是新增,则绑定关系
									$services.wflow.createRelation({data:{defineId: flow.id, productId: stores.design.appId, functionCode: stores.design.formId}}).then((result: ResultType) => {
										ElMessage({
											message: "发布成功",
											type: 'success'
										})
										closeDialog();
										state.validVisible = false
									})
								}
					
								
							}else{
								ElMessage({
									message: res?res.msg:"接口请求异常",
									type: 'warning'
								})
							}
						})
			
				})
				
				// this.$confirm('如果您只想预览请选择预览，确认发布后流程立即生效，是否继续?', '提示', {
				// 	confirmButtonText: '发布',
				// 	cancelButtonText: '取消',
				// 	type: 'warning'
				// }).then(() => {
				// 	let template = {
				// 	formId: this.setup.formId,
				// 	formName: this.setup.formName,
				// 	logo: JSON.stringify(this.setup.logo),
				// 	settings: JSON.stringify(this.setup.settings),
				// 	groupId: this.setup.groupId,
				// 	formItems: JSON.stringify(this.setup.formItems),
				// 	process: JSON.stringify(this.setup.process),
				// 	remark: this.setup.remark
				// 	}
				// 	if (this.isNew || !this.$isNotEmpty(this.setup.formId)) {
				// 	createForm(template).then(rsp => {
				// 		this.$message.success("创建表单成功")
				// 		this.$router.push("/formsPanel")
				// 	}).catch(err => {
				// 		this.$message.error(err)
				// 	})
				// 	} else {
				// 	updateFormDetail(template).then(rsp => {
				// 		this.$message.success("更新表单成功")
				// 		this.$router.push("/formsPanel")
				// 	}).catch(err => {
				// 		this.$message.error(err)
				// 	})
				// 	}
				// })
			};

			
			const validateDesign = () => {
				
				state.validVisible = true;
				state.validStep = 0;
				showValiding();
				stopTimer();
				state.timer = setInterval(() => {
					
					state.validResult.errs = ProcessDesignRef.value.validate()
					
					if (Array.isArray(state.validResult.errs) && state.validResult.errs.length === 0) {
						state.validStep++;
						if (state.validStep >= state.validOptions.length) {
							stopTimer()
							showValidFinish(true, null)
						}
					} else {
					stopTimer()
						state.validOptions[state.validStep].status = 'error'
						showValidFinish(false, getDefaultValidErr())
					}
				}, 300)
			};
			const getDefaultValidErr = () => {
				switch (state.validStep) {
					case 0:
					return '请检查审批流程，查看对应标注节点错误信息'	
					default:
					return '未知错误'
				}
				// switch (state.validStep) {
				// 	case 0:
				// 	return '请检查基础设置项';
				// 	case 1:
				// 	return '请检查审批表单相关设置'
				// 	case 2:
				// 	return '请检查审批流程，查看对应标注节点错误信息'
				// 	case 3:
				// 	return '请检查扩展设置'
				// 	default:
				// 	return '未知错误'
				// }
			};
			const showValidFinish  = (success:any, err:any) => {
				state.validResult.success = success
				state.validResult.finished = true
				state.validResult.title = success ? '校验完成 😀' : '校验失败 '
				state.validResult.desc = success ? '设置项校验成功，是否提交？' : err
				state.validResult.action = success ? '提 交' : '去修改'
				if(success){
					publish()
				}
			};
			const showValiding = () => {
				state.validResult = {
					errs: [],
					finished: false,
					success: false,
					title: '检查中...',
					action: '处理',
					desc: '正在检查设置项'
				}
				state.validStep = 0
				state.validOptions.forEach(op => {
					op.status = ''
					op.icon = ''
					op.description = ''
				})
			};
			const doAfter= () => {
				if (state.validResult.success) {
					publish()
				} else {
					state.activeSelect = state.validComponents[state.validStep]
					state.validVisible = false
				}
			};
			const stopTimer= () => {
				if (state.timer) {
					clearInterval(state.timer)
				}
			};
			
			return {
				LayoutPreviewRef,
				ProcessDesignRef,
				design,
				errTitle,
				validIcon,
				startDesign,
				// editFlag,
				openDialog,
				closeDialog,
				onCancel,
				activeChange,
				exit,
				preview,
				publish,
				changeVersion,
				validateDesign,
				getDefaultValidErr,
				showValidFinish,
				showValiding,
				doAfter,
				stopTimer,
				changeScale,
				...toRefs(state),

			};
		},
	});
</script>

<style lang="scss" scoped>

	
	.layout-body {
		background: #f5f6f6;
		padding: 0px;
		height: 800px;
	}

	.el-dialog__header {
		margin-right: 0px;
		padding:0px;
	}
</style>