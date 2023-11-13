<template>
  <component :is="contentComponent" v-bind="dynamicProps"/>
</template>

<script lang="ts" setup>
import { schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { IDirectory, IEntity, ITarget } from '@/ts/core';
// import WorkForm from './workForm';
// import DirectoryForm from './directoryForm';
// import ApplicationForm from './applicationForm';
// import SpeciesForm from './speciesForm';
// import PropertyForm from './propertyForm';
import TargetForm from './targetForm.vue'
// import LabelsForm from './labelsForm';
// import RenameForm from './renameForm';
// import TransferForm from './transferForm';

// 接收参数
const props = defineProps<{
  cmd: string;
  entity: IEntity<schema.XEntity>;
  finished: () => void;
}>()

// 动态组件
const contentComponent = ref(null);

// 动态props
const dynamicProps = ref({})
// 设置组件与参数
const setContent = (component: any,props: object) => {
  contentComponent.value = component;
  dynamicProps.value = props
}

const reloadFinish = () => {
  props.finished();
  if (!props.cmd.startsWith('remark')) {
    orgCtrl.changCallback();
  }
};

onMounted(()=>{
  switch (props.cmd) {
    case 'rename':
      return console.log('来这改');
      // return <RenameForm file={entity as any} finished={reloadFinish} />;
    case 'newDir':
    case 'updateDir':
    case 'remarkDir': {
      const directory = props.entity as IDirectory;
      if (!directory.parent && props.cmd !== 'newDir') {
        return (
          console.log('来这改')
          // <TargetForm
          //   formType={props.cmd.replace('Dir', '')}
          //   target={directory.target}
          //   finished={reloadFinish}
          // />
        );
      }
      return console.log('来这改');
      // return <DirectoryForm formType={props.cmd} current={directory} finished={reloadFinish} />;
    }
    case 'newApp':
    case 'newModule':
    case 'updateApp':
    case 'updateModule':
    case 'remarkApp':
      return console.log('来这改');
      // return (
      //   <ApplicationForm formType={cmd} current={entity as any} finished={reloadFinish} />
      // );
    case 'newWork':
    case 'updateWork':
    case 'remarkWork':
      return console.log('来这改');
      // return <WorkForm formType={props.cmd} current={entity as any} finished={reloadFinish} />;
    case 'newSpecies':
    case 'updateSpecies':
    case 'remarkSpecies':
    case 'newDict':
    case 'updateDict':
    case 'remarkDict':
      return console.log('来这改');
      // return (
      //   <SpeciesForm
      //     formType={cmd.replace('Dict', '').replace('Species', '')}
      //     typeName={cmd.includes('Dict') ? '字典' : '分类'}
      //     current={entity as any}
      //     finished={reloadFinish}
      //   />
      // );
    case 'newForm':
    case 'updateForm':
    case 'remarkForm':
      return console.log('来这改');
      // return (
      //   <LabelsForm
      //     formType={cmd.replace('Form', '')}
      //     typeName={'表单'}
      //     current={entity as any}
      //     finished={reloadFinish}
      //   />
      // );
    case 'newProperty':
    case 'updateProperty':
    case 'remarkProperty':
      return console.log('来这改');
      // return (
      //   <PropertyForm formType={props.cmd} current={entity as any} finished={reloadFinish} />
      // );
    case 'newTransferConfig':
    case 'updateTransferConfig':
      return console.log('来这改');
      // return (
      //   <TransferForm formType={props.cmd} current={entity as any} finished={reloadFinish} />
      // );
    default:
      var target = props.entity as ITarget;
      if (props.entity.typeName === '目录') {
        target = (props.entity as IDirectory).target;
      }
      // return <TargetForm formType={props.cmd} target={target} finished={reloadFinish} />;
      return setContent(TargetForm, {formType: props.cmd, target: target, finished: reloadFinish})
  }
})
</script>

<style>

</style>
  