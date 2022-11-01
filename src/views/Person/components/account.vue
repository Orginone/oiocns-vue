<template>
  <div class="account">
    <div class="left">
      <div >
        <img class="img" src="@/assets/img/dingding.png" alt="">
      </div>
      <div class="title">
        <p class="bind">绑定钉钉</p>
        <p class="noBind">当前未绑定钉钉账号</p>
      </div>
    </div>
    <div class="right">
      <span class="bindOption">绑定</span>
    </div>

  </div>
</template>
<style scoped lang="scss">
.account{
  width: 100%;
  height: 50px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px;
  .left{
    width: 60%;

    display: flex;
    .img{
      height: 40px;
      width: 40px;

    }
    .title{
      margin-left: 30px;
      .bind{
        color: #aaa;
      }
      .noBind{
        color: #ccc;
      }
    }

  }
  .right{
      .bindOption{
        color: darkblue;
        margin-right: 30px;
      }
    }
}
</style>
