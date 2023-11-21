<template>
  <div class="content-wrap">
    <div class="content" ref="buttonRef" @contextmenu="onContextMenu">
        <div class="list" v-if="contentData.showIndex ==1">
            <div class="list-item" v-for="(item,index) in listData" :key="index">
                <img src="/svg/home.svg" alt="" />
                <div class="list-item-com">
                    <p class="list-item-name">{{item._metadata.name}} <el-tag class="ml-2" type="success">{{item._metadata.typeName}} </el-tag> </p>
                    <p class="list-item-text"> {{item._metadata.remark}}</p>
                </div>
                <div class="list-item-time">{{item._metadata.createTime.slice(5,16)}}</div>
            </div>
        </div>
        <!-- <div class="card" v-else>
          <div class="card-item" v-for="(item,index) in contentData.contentList" :key="index">
              <img src="/svg/home.svg" alt="" />
              <div class="card-item-com">
                  <p class="card-item-name">{{item._metadata.name}}</p>
                  <p class="card-item-type">{{item._metadata.typeName}}</p>
              </div>
          </div>
        </div>-->
        <div class="list-foot">
            <div class="foot-num">{{contentData.contentList.length}}个项目</div>
            <div class="foot-check">
                <div class="show-type" :class="contentData.showIndex==1?'show-active':''" @click="contentData.showIndex='1'">
                  <img src="/svg/list.png" alt="">
                </div>
                <div class="show-type" :class="contentData.showIndex==2?'show-active':''"  @click="contentData.showIndex='2'">
                  <img src="/svg/table.png" alt="">
                </div>
            </div>
        </div> 
    </div>
    <el-dialog width="40%" v-model="dialogFormVisible" title="表单">
        <el-form :model="form">
            <el-form-item label="图标" :label-width="formLabelWidth">
                <el-upload
                    class="avatar-uploader"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="代码" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="备注信息" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.name" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">
                确定
                </el-button>
            </span>
        </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>

//@ts-nocheck
import InfiniteList from 'vue3-infinite-list';

import ContextMenu from '@imengyu/vue3-context-menu'
import { command, parseAvatar, schema } from '@/ts/base';
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { setCenterStore } from "@/store/setting";
import {storeToRefs} from 'pinia';
const props = defineProps({
  item: {
    type:Object
  },
})
//创建仓库对象
const store= setCenterStore();
// let {currItem}=storeToRefs(store);//结构store
const dialogFormVisible =ref(false) ;
const contentData = reactive({
  showIndex:1,
  contentList :[],
  list:[]
})
let listData = ref([]);
watch(() => props.item, (n) => {
  console.log('b',n);
  // if(n?.item?.content()){
    // let list  = n?.item?.content()
    let list = n;
    let newArray = list.map(function(obj) {
      return { _metadata: obj._metadata };
    });
    console.log(newArray);
    listData.value = newArray;
  // }
})
const getContent = () => {
  const contents: IFile[] = [];
  if (props.current === 'disk') {
    contents.push(orgCtrl.user, ...orgCtrl.user.companys);
  } else {
    console.log('props.current.content()', props.current.content());
    contents.push(...props.current.content());
  }
  return contents;
};
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
const onContextMenu = (e : MouseEvent)=> {
  //prevent the browser's default menu
  e.preventDefault();
  //show your menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      { 
        label: "打开表单", 
        onClick: () => {
            forwardingMessage();
        }
      },
      { 
        label: "二级目录", 
        children: [
          { label: "测试目录1" },
          { label: "测试目录2" },
          { label: "测试目录3" },
        ]
      },
    ]
  }); 
}
const forwardingMessage =()=>{
  dialogFormVisible.value = true;
}
const formLabelWidth = '140px'

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})
</script>
<style lang="scss" scoped>
.content-wrap {
  width: 100%;
  height: calc(100% - 36px);
  
  .dropdown-fix{
    width: 100%;
    height: 100%;
  }
  .content {
    width: 100%;
    height: calc(100% - 36px);
    box-sizing: border-box;
    overflow-y: auto;
    position: relative;
    .list{
        height: calc(100% - 0px);
        overflow-y: auto;
        .list-item{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid #eee;
            padding: 12px;
            img{
                width: 42px;
                margin-right: 20px;
            }
            .list-item-com{
                flex: 1;
                .list-item-name{
                    font-size: 14px;
                    font-weight: bold;
                    color: rgba(0, 0, 0, 0.85);
                    .ml-2{
                        margin-left: 10px;
                    }
                }
                .list-item-text{
                    color: rgba(0, 0, 0, 0.45);
                    padding-right: 20px;
                }
            }
            .list-item-time{
                color: rgba(0, 0, 0, 0.45);
            }
        }
    }
    .card{
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
      
      .card-item{
        width: 160px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
      }
      img{
        width: 42px;
      }
      .card-item-com{
        text-align: center;
        p{
          margin-top: 6px;
          font-size: 14px;
          color: rgba(0,0,0,.85);
        }
        p:last-child {
          font-size: 12px;
          color: rgb(136, 136, 136)
        }
      }
    }
    .list-foot{
        position: fixed;
        bottom: 10px;
        width: calc(100% - 350px);
        height: 36px; 
        display: flex;
        justify-content: space-between;
        align-items: center;
        .foot-check{
          display: flex;
          background: #e7e7e7;
          border: 3px solid #eee;
          .show-type{
            height: 20px;
            widows: 20px;
            box-sizing: content-box;
            padding: 5px;
            border-radius: 3px;
          }
          img{ 
            width: 20px;
            height: 20px;
          }
        } 
        .show-active{
          background: #fff;
        }
    }
  }
}
.drop-box{
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    width: 200px;
}

</style>

<style scoped>
.avatar-uploader .avatar {
  width: 108px;
  height: 108px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 108px;
  height: 108px;
  text-align: center;
}
</style>