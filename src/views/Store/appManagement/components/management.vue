<template>
    <div class="store-detail">
        <div class="detail-main">
            <div class="main-wrap">
                <div class="title-tips">应用管理</div>
                <div class="content">
                    <div class="row">
                        <div class="app-title">应用分配</div>
                        <div class="app-btn"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";

</script>

<style lang="scss" scoped>
    .store-detail{
        width: 100%;
        background: #fff;
        padding: 10px 20px;
        font-size: 14px;
        margin-top: 4px;
        .detail-main{
            color: #303133;
            display: flex;
            justify-content: space-between;
            .main-wrap{
                display: flex;
                flex-direction: column;
                .title-tips{
                    font-weight: bold;
                    margin-bottom: 20px;
                    font-size: 16px;
                    
                }
            }
            .content{
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
   
            }
        }
    }
</style>
