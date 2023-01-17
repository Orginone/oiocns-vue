<template>
  <el-dialog v-model="dialogVisible" title="修改密码" class="change-password-dialog">
    <div class="form-wrapper">
      <el-form label-position="top" :model="form"
        ref="$form" :rules="rules">
        <el-form-item label="请输入密码" prop="password">
          <el-input type="password" v-model="form.password" />
        </el-form-item>
        <el-form-item label="请再次输入密码" prop="password2">
          <el-input type="password" v-model="form.password2" />
        </el-form-item>
        <el-form-item label="请输入助记词" prop="privateKey">
          <el-input type="password" v-model="form.privateKey" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import $services from '@/services';
import { useUserStore } from '@/store/user'
const store = useUserStore();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
});
const $emit = defineEmits(["update:modelValue"]);
let dialogVisible = computed({
  get() {
    return props.modelValue ;
  },
  set(v) {
    $emit("update:modelValue", v);
  }
});

const form = reactive({
  password: "",
  password2: "",
  privateKey: "",
});
const $form = ref<FormInstance>(null);
const rules = reactive<FormRules>({
  password: [
    {
      required: true,
      message: "请输入密码"
    },
    { 
      min: 6,
      max: 15,
      trigger: 'blur',
      message: "密码长度不正确"
    }
  ],
  password2: [
    {
      required: true,
      message: "请再次输入密码"
    },
    { 
      validator(rule, value, callback) {
        if (form.password2 == form.password) {
          callback()
        } else {
          callback(new Error('与原密码不一致'))
        }
      },
    }
  ],
  privateKey: [
    {
      required: true,
      message: "请输入助记词"
    },
  ],
})

async function submit() {
  await $form.value.validate();

  const res = await $services.person.reset({
    data: {
      account: store.userInfo.account,
      password: form.password,
      privateKey: form.privateKey
    }
  });
  if (res.success) {
    ElMessage.success("更新成功");
    dialogVisible.value = false;    
  }    
}

</script>
<style lang="scss">
.change-password-dialog {
  .form-wrapper {
    border: 1px solid #E9ECF3;
    padding: 40px;
  }
}
</style>