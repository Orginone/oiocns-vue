<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { IBelong } from "@/ts/core";
import { common, schema, model } from "@/ts/base";
import { Emitter, logger } from "@/ts/base/common";
import useStorage from "@/hooks/useStorage";
import useObjectUpdate from "@/hooks/useObjectUpdate";
import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
import { getItemNums } from "./config";
import FormItem from './formItem.vue';


const props = defineProps<{
  data: any;
  belong: IBelong;
  form: schema.XForm;
  readonly?: boolean;
  showTitle?: boolean;
  fields: model.FieldModel[];
  changedFields: model.MappingData[];
  rules: model.RenderRule[];
  formData?: model.FormEditData;
  onValuesChange?: (fieldId: string, value: any, data: any) => void;
}>();

const key = ref(useObjectUpdate(props.rules))
const forceUpdate = (()=>{
  key.value = useObjectUpdate(props.rules);
});

const notifyEmitter = ref(new Emitter());

const colNum = ref(useStorage("workFormColNum", "一列"))
const setColNum = ((val:any)=>{
  colNum.value = val;
});
const onItemClick = (e:any) => {
  colNum.value = e.itemData;
};
const onValueChange = (fieldId: string, value: any, refresh: boolean = true) => {
    if (value === undefined || value === null) {
      delete props.data[fieldId];
    } else {
      props.data[fieldId] = value;
    }
    const runRule = (key: string) => {
      const vaildRule = (rules: any[]): boolean => {
        var pass: boolean = false;
        if (rules.includes('and') || rules.includes('or')) {
          var operate = 'and';
          var result: boolean[] = [];
          for (const rule of rules) {
            if (Array.isArray(rule)) {
              result.push(vaildRule(rule));
            } else if (['and', 'or'].includes(rule)) {
              operate = rule;
            }
          }
          return operate == 'and' ? !result.includes(false) : result.includes(true);
        } else if (rules.length == 3) {
          const dataValue = props.data[rules[0]];
          if (dataValue) {
            switch (rules[1]) {
              case '=':
                return dataValue == rules[2];
              case '<>':
                return dataValue != rules[2];
              case '>':
                return dataValue > rules[2];
              case '>=':
                return dataValue >= rules[2];
              case '<':
                return dataValue < rules[2];
              case '<=':
                return dataValue <= rules[2];
              case 'contains':
                return `${dataValue}`.includes(rules[2]);
              case 'notcontains':
                return !`${dataValue}`.includes(rules[2]);
              case 'startswith':
                return `${dataValue}`.startsWith(rules[2]);
              case 'endswith':
                return `${dataValue}`.endsWith(rules[2]);
              case 'isblank':
                return `${dataValue}`.trim().length == 0;
              case 'isnotblank':
                return `${dataValue}`.trim().length > 0;
              case 'between':
                if (Array.isArray(rules[2]) && rules[2].length == 2) {
                  return dataValue > rules[2][0] && dataValue <= rules[2][1];
                }
                break;
              default:
                break;
            }
          }
        } else if (rules.length == 2) {
          switch (rules[1]) {
            case 'isblank':
              return props.data[rules[0]] == undefined;
            case 'isnotblank':
              return props.data[rules[0]] != undefined;
            default:
              break;
          }
        }
        return pass;
      };
      const rules = props.form.rule?.filter((a) => a.trigger.includes(key)) ?? [];
      for (const rule of rules) {
        if ('target' in rule) {
          const target = props.fields.find((a) => a.id == rule.target);
          if (target) {
            switch (rule.type) {
              case 'show':
                {
                  var showRule = rule as model.FormShowRule;
                  var pass = vaildRule(JSON.parse(showRule.condition));
                  const oldRule = props.formData?.rules.find(
                    (a) => a.destId == showRule.target && a.typeName == showRule.showType,
                  );
                  if (oldRule) {
                    oldRule.value = pass ? showRule.value : !showRule.value;
                  } else {
                    props.formData?.rules.push({
                      formId: props.form.id,
                      destId: showRule.target,
                      typeName: showRule.showType,
                      value: pass ? showRule.value : !showRule.value,
                    });
                  }
                  forceUpdate();
                }
                break;
              case 'calc':
                var calcRule = rule as model.FormCalcRule;
                var formula = calcRule.formula;
                for (var i = 0; i < calcRule.trigger.length; i++) {
                  const triggerData = props.data[calcRule.trigger[i]];
                  if (!triggerData) {
                    const defaultValue = props.fields.find((a) => a.id == calcRule.target)
                      ?.options?.defaultValue;
                    if (defaultValue) {
                      props.data[calcRule.target] = defaultValue;
                    } else {
                      delete props.data[calcRule.target];
                    }
                    return true;
                  } else {
                    formula = formula.replaceAll(`@${i}@`, JSON.stringify(triggerData));
                  }
                }
                try {
                  const runtime = {
                    value: {},
                    decrypt: common.decrypt,
                    encrypt: common.encrypt,
                  };
                  common.Sandbox('value=' + formula)(runtime);
                  props.data[calcRule.target] = runtime.value;
                } catch {
                  logger.error(`计算规则[${formula}]执行失败，请确认是否维护正确!`);
                }
                break;
            }
          }
        }
      }
      return rules.length > 0;
    };
    props.onValuesChange?.apply(this, [fieldId, value, props.data]);
    if (runRule(fieldId) && refresh) {
      forceUpdate();
    }
};
watch(
  () => props.changedFields,
  () => {
    if (props.changedFields) {
      props.changedFields.forEach((s) => {
        onValueChange(s.id, props.data[s.id], false);
      });
      forceUpdate();
    }
  }
);

onMounted(() => {
  if (props.changedFields) {
    props.changedFields.forEach((s) => {
      onValueChange(s.id, props.data[s.id], false);
    });
    forceUpdate();
  }
});
console.log('form',props.form);
</script>


<template>
  <div :style="{ padding: '16px' }">
    <DxToolbar :height="60">
      <DxItem
        :location="'center'"
        :locateInMenu="'never'"
      >
        <div class="toolbar-label">
          <b :style="{ fontSize: '28px' }">{{ form.name }}</b>
        </div>
      </DxItem>
      <DxItem
        :location="'after'"
        :locateInMenu="'never'"
      >
        <DxSelectBox
          text="项排列"
          :value="colNum"
          :items="getItemNums()"
          @onItemClick="onItemClick"
        />
      </DxItem>
    </DxToolbar>
    <div style="display: flex; width: 100%; flex-wrap: wrap; gap: 10px">
      <FormItem
        :key="'name'"
        :data="data"
        :numStr="colNum"
        :rules="[]"
        :readOnly="readonly"
        :field="{
          id: 'name',
          name: '名称',
          code: 'name',
          valueType: '描述型',
          remark: '数据的名称。',
          options: { hideField: true },
        }"
        :belong="belong"
        :notifyEmitter="notifyEmitter"
        @onValuesChange="onValueChange"
      />
      <FormItem
        :key="field.id"
        :data="data"
        :numStr="colNum"
        :rules="
          [...(formData?.rules ?? []), ...rules].filter(
            (a) => a.destId === field.id
          )
        "
        :readOnly="readonly"
        :field="field"
        :belong="belong"
        :notifyEmitter="notifyEmitter"
        @onValuesChange="onValueChange"
        v-for="field in fields"
      />
    </div>
  </div>
</template>
