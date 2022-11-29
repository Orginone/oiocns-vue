<template>
    <div class="store-detail">
        <i class="icon iconfont icon-jiantou-left" @click="goback()"></i>
        <div class="detail-main">
            <div class="main-wrap">
                <img class="app-logo" src="@/assets/img/whatsapp.png" alt="" />
                <div class="content">
                    <div class="title">应用名称1</div>
                    <div class="describe">描述描述描述描述描述描述描述描述描述描述</div>
                    <div class="content-foot">
                        <div class="vision">版本号 2.6.6</div>
                        <div class="end-time">订阅到期时间：2022-06-12</div>
                        <div class="help">遇到问题？联系运维</div>
                    </div>
                </div>
            </div>
            <!-- <div class="operation">
                <div class="pay-btn">续费</div>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        ···
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                        <el-dropdown-item>其他操作</el-dropdown-item>
                        <el-dropdown-item>退订</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { onMounted, reactive, ref } from 'vue'

  const router = useRouter()
  const goback = () => {
    router.go(-1)
  }
</script>

<style lang="scss" scoped>
    .store-detail{
        background: #fff;
        height: 175px;
        padding: 8px 16px;
        font-size: 14px;
        .icon{
            font-size: 24px;
            margin-bottom: 18px;
        }
        .detail-main{
            display: flex;
            justify-content: space-between;
            .main-wrap{
                display: flex;
            }
            .app-logo{
                width: 55px;
                height: 55px;
                border-radius: 5px;
            }
            .content{
                display: flex;
                margin:0 20px;
                justify-content: space-between;
                flex-direction: column;
                .describe{
                    margin-top: 15px;
                    color: #606266;
                }
                .content-foot{
                    font-size: 14px;
                    color: #909399;
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    .vision{
                        margin-right: 15px;
                    }
                    .end-time{
                        margin-right: 15px;
                    }
                    .help{
                        color: #154AD8;
                    }
                }
            }
        }
        .operation{
            width: 120px;
            display: flex;
            align-items: center;
            .pay-btn{
                width: 72px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                color: #fff;
                background: #154AD8;
                border-radius: 15px;
            }
            .el-dropdown-link{
                transform:rotate(90deg);
            }
        }
    }
</style>
