<template>
  <el-dialog v-model="dialogVisible" title="修改密码" class="change-password-dialog">
    <div class="form-wrapper">
      <el-form label-position="top" :model="form">
        <el-form-item label="旧密码">
          <el-input type="password" v-model="form.password" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="form.password2" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="form.confirmPass" />
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
import { defineProps, ref, computed } from "vue";

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

const form = ref({
  password: "",
  password2: "",
  confirmPass: "",
});

function submit() {

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