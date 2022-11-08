<template>
    <diyForm :meta="meta" :modelValue="{}"></diyForm>
</template>
  
  <script setup lang="ts">
    import diyForm from '@/components/diyDiong/index.vue'
    import datajson from '@/components/diyDiong/json/from.json'
    const json = datajson
    const meta = json.formMeta // 表单的meta
  </script>
  <style lang="scss">
    .el-dropdown-link{
      padding: 2px 10px;
      cursor: pointer;
      border-radius: 10px;
    }
    .el-dropdown-link:hover{
      background:#1642cb;
      color: #fff;
    }
  </style>
  <style lang="scss" scoped>
    .main{
      width: 100%;
      height: 100%;
      display: flex;
      flex: 1;
      .nav-list{
        width: 150px;
        height: 100%;
        background: #fff;
        border-right: 1px solid #EBEEF5;
      }
      .content{
        width:calc(100vw - 150px);
        display: flex;
        flex-direction: column;
        background: #f0f4f8;
        .menu{
          height: 40px;
          width: 100%;
          background: #aab;
          margin-bottom: 6px;
        }
        .table{
          background: #fff;
          display: flex;
          flex: 1;
          .btn-check{
            padding: 8px 16px;
            color: #154ad8;
          }
          .btn-check:hover{
              background: #154ad8;
              color: #fff;
              padding: 8px  16px;
          }
          .table-tabs{
            width: 500px;
            .el-menu--horizontal{
              border: 0;
            }
            .el-menu-item{
              padding: 0;
              margin-right: 16px;
              margin-bottom: 3px;
              border: 0 !important;
            }
            .is-active{
              background: #fff;
            }
            .is-active::after{
              content:'';
              position: absolute;
              left: 0;
              margin-left: calc(50% - 9px);
              bottom: 25%;
              width:18px;
              border-radius: 5px;
              height: 2px;
              background: #154ad8;
            }
            .el-menu--horizontal:hover, .el-menu-item:hover{
              background: #fff;
            }
          }
        }
      }
    }
  </style>
  