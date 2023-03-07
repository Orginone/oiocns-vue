// @ts-nocheck
export const getFiedlByReact = (field: any) => {
  const temp: any = getInputFieldConfig(field.name);
  temp.basic = field;
  return temp;
};

export const initWidgetList = () => {
  return {
    widgetList: [],
    formConfig: {
      modelName: "formData",
      refName: "vForm",
      rulesName: "rules",
      labelWidth: 80,
      labelPosition: "left",
      size: "",
      labelAlign: "label-left-align",
      cssCode: "",
      customClass: "",
      functions: "",
      layoutType: "PC",
      jsonVersion: 3,
      onFormCreated: "",
      onFormMounted: "",
      onFormDataChange: "",
    },
  };
};

const getInputFieldConfig = (name: any) => {
  return {
    id: `input${generateId()}`,
    type: "input",
    adaptType: "text",
    icon: "text-field",
    formItemFlag: true,
    options: {
      fromAttr: true, // 判断特性标签
      name: `input${generateId()}`,
      label: name,
      labelAlign: "",
      type: "text",
      defaultValue: "",
      placeholder: "",
      columnWidth: "200px",
      size: "",
      labelWidth: null,
      labelHidden: false,
      readonly: false,
      disabled: false,
      hidden: false,
      clearable: true,
      showPassword: false,
      required: false,
      requiredHint: "",
      validation: "",
      validationHint: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      minLength: null,
      maxLength: null,
      showWordLimit: false,
      prefixIcon: "",
      suffixIcon: "",
      appendButton: false,
      appendButtonDisabled: false,
      buttonIcon: "custom-search",
      //-------------------
      onCreated: "",
      onMounted: "",
      onInput: "",
      onChange: "",
      onFocus: "",
      onBlur: "",
      onValidate: "",
      onAppendButtonClick: "",
    },
  };
};

const generateId = function() {
  return Math.floor(Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000);
};