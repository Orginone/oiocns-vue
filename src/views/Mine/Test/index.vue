<template>
  <div>
    <button @click="sendMessage">发送</button>
    <button @click="destroyMessage">销毁</button>
    <button @click="createMessage">重新创建</button>
    <iframe ref="myframe" src="http://127.0.0.1:8806/" frameborder="0"></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import initSdk from "./src";

const myframe = ref(null);
const a = initSdk();

function destroyMessage() {
  a.destroy();
}

function createMessage() {
  a.create(myframe.value).then((res) => {
    console.log("重新初始化完成");
  });
}

function sendMessage() {
  console.log("dataChange发送");

  a.send("dataChange", 12345)
    .then((res) => {
      console.log("dataChange返回", res);
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(() => {
  a.create(myframe.value).then((res) => {
    console.log("sdk初始化完成");

    a.listen("5s", (data) => {
      console.log("接收到5s", data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ status: "success", data: 1111 });
        }, 3000);
      });
    });
  });
});
</script>

<style scoped></style>
