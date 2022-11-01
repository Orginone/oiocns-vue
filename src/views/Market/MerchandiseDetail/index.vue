<template>
  <div class="managerApproval">
    <MarketCard>
      <template #routeContent>
        <!-- <HeadImg
          :name="market.name"
          :url="market.icon || storeImg"
          :imgWidth="35"
          :limit="1"
          :isSquare="false"
      /> -->
      </template>
      <!-- <template #marketNameSlot
        ><span style="color: grey; font-size: 17px; margin-right: 20px"
          >{{ market.name }}
        </span></template
      > -->
    </MarketCard>
    <div class="common-layout">
      <div style="height: 85vh">
        <div
          style="
            height: 15vh;
            margin: 5px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div style="width: 66%; height: 100%">
            <div class="left" style="width: 10%; margin: 15px 0px; float: left; text-align: left">
              <el-image
                style="width: auto; height: auto; max-width: 80%; max-height: 80%"
                :src="bijianImg"
              />
            </div>
            <div
              class="right"
              style="width: 90%; float: right; text-align: left; margin: 15px 0px; float: right"
            >
              <div>
                <div style="font-size: 24px">{{route.query.caption}}</div>
              </div>
              <div>
                <div style="font-size: 14px; color: silver"
                  >广告检测-病毒检测-人工复检-绿色应用</div
                >
              </div>
              <div style="right: 10px" align="right">
                <el-button type="primary" round style="width: 100px"
                  >￥{{ market.price }}</el-button
                >
              </div>
              <div style="display: flex">
                <div style="margin-right: 20px">
                  <el-rate
                    v-model="market.score"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                  />
                </div>
                <div style="font-size: 14px; color: grey; margin-right: 20px; margin-top: 6px"
                  >销量:{{ thousands(market.orderNum) }}单</div
                >
                <div style="font-size: 14px; color: grey; margin-right: 20px; margin-top: 6px"
                  >年满12周岁</div
                >
              </div>
            </div>
          </div>
        </div>
        <div
          style="
            height: 35vh;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div style="width: 66%; height: 100%; border-bottom: 1px solid silver">
            <el-image
              style="
                width: auto;
                height: auto;
                max-width: 15%;
                max-height: 100%;
                margin-right: 20px;
                border-radius: 15px;
              "
              :src="bj1"
            />
            <el-image
              style="
                width: auto;
                height: auto;
                max-width: 15%;
                max-height: 100%;
                margin-left: 20px;
                margin-right: 20px;
                border-radius: 15px;
              "
              :src="bj2"
            />
            <el-image
              style="
                width: auto;
                height: auto;
                max-width: 15%;
                max-height: 100%;
                margin-left: 20px;
                margin-right: 20px;
                border-radius: 15px;
              "
              :src="bj3"
            />
            <el-image
              style="
                width: auto;
                height: auto;
                max-width: 15%;
                max-height: 100%;
                margin-left: 20px;
                margin-right: 20px;
                border-radius: 15px;
              "
              :src="bj4"
            />
            <el-image
              style="
                width: auto;
                height: auto;
                max-width: 15%;
                max-height: 100%;
                margin-left: 20px;
                margin-right: 20px;
                border-radius: 15px;
              "
              :src="bj5"
            />
          </div>
        </div>
        <div
          style="
            height: 3vh;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div
            style="
              width: 66%;
              height: 100%;
              border-bottom: 1px solid silver;
              color: grey;
              font-size: 14px;
            "
            >UP主都在用的免费剪辑神器</div
          >
        </div>
        <div
          style="
            height: 2vh;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div style="width: 66%; height: 100%; color: black; font-size: 14px">
            最新版本{{ market.version }}&nbsp;&nbsp;&nbsp;&nbsp;更新内容:
          </div>
        </div>
        <div
          style="
            height: 15vh;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div
            style="
              width: 66%;
              height: 100%;
              border-bottom: 1px solid silver;
              color: grey;
              font-size: 14px;
              overflow-y: scroll;
            "
          >
            【智能字幕】识别画面内容一键生成风格字幕，高效酷炫！<br />
            【文字视频】全新改版，支持替换各类素材，文字转视频更高效！<br />
            【配音工具】支持自由创作剧本配音，修改多角色台词生成新字幕，释放创意~<br />
            【智能字幕】识别画面内容一键生成风格字幕，高效酷炫！<br />
            【文字视频】全新改版，支持替换各类素材，文字转视频更高效！<br />
            【配音工具】支持自由创作剧本配音，修改多角色台词生成新字幕，释放创意~<br />
          </div>
        </div>
        <div
          style="
            height: 2vh;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div style="width: 66%; height: 100%; color: black; font-size: 14px"> 应用介绍： </div>
        </div>
        <div
          style="
            height: 20vh;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div
            style="
              width: 66%;
              height: 100%;
              border-bottom: 1px solid silver;
              color: grey;
              font-size: 14px;
              overflow-y: scroll;
            "
          >
            必剪是一款UP主都在用的剪辑神器，在这里你可以创建你的专属虚拟形象，实现0成本做虚拟UP主！还可体验高清录屏、游戏高光识别、神配图、封面智能抠图、视频模板、封面模板、批量粗剪、录音提词、文本朗读、语音转字幕、画中画、蒙版等功能，剪辑从此得心应手！还有超燃音乐、素材及专业画面特效，给视频加点料！一键投稿，支持投稿免流量，账号互通，投稿快人一步！<br/>
            【虚拟形象】一键生成多张专属B站头像，为自己捏一个头像吧～<br/>
            【文字视频】 - B站专栏一键转视频，让文字动起来 - 支持随心添加贴纸，为你的视频锦上添花！<br/>
            【鬼畜工具】 - 鬼畜剧场镜头支持搜索，快速找到目标镜头 - 鬼畜剧场空镜支持编辑，创作更自由<br/>
            - 支持多角色切换，轻松玩转鬼畜全明星 【高清录屏】 一键游戏实况解说，精彩时刻不错过！<br/>
            『快捷录屏』 主流游戏，一键唤起录屏~ 『高清录制』最高支持1080P录制，多档码率、帧率可调！<br/>
            【录音提词】 先录音后剪辑，体验全新剪辑工作流！<br/>
            『提词器』录音时可使用提词器功能，录音更流畅！<br/>
            『录音字幕识别』录音自动识别转为文字，剪视频更轻松！ 【全能剪辑】<br/>
            全轨道展示，画中画模式，剪辑从此得心应手！<br/>
            『批量粗剪』视频批量粗剪、排序、备注，高效剪辑一步到位！<br/>
            『文本朗读』多语种任你选，一键配音，效率加倍！<br/>
            『一键三连』关注三连弹幕随心加，涨粉求赞一键到位～<br/>
            『神配图』一键匹配神配图，海量素材等你来创作~<br/>
            『游戏高光识别』相册自动识别击杀瞬间，一步剪辑到位！<br/>
            『视频打点』支持视频标记，一键视频音频卡点，混剪视频也能轻松剪辑！<br/>
            『封面智能抠图』一键抠出人像/萌宠，提升封面制作效率 ，让你的封面从此与众不同！<br/>
            『视频模板』高端VLOG片头/搞笑视频模板等你来体验，轻松实现一键出片！<br/>
            『我的素材库』一键添加常用素材，剪辑时添加素材更快捷！<br/>
            『画中画』支持画中画、蒙版功能，让创作有更多可能！ 『变速』0.1-8倍自由变速、曲线变速~<br/>
            『变声』男女生、卡通声、混响声，随心选择！ 『变焦』专业运镜效果，拯救手残！<br/>
            『倒放』一键倒放，素材翻倍~ 【语音转字幕】 一键转字幕，批量编辑，效率从此翻倍~<br/>
            『识别字幕』一键语音转字幕，省心！ 『批量编辑』批量编辑字幕，省时！ 【热门素材】<br/>
            宝藏音乐库，丰富素材，给视频加点料！ 『音乐库』丰富曲库任你挑，镇站神曲了解一下~<br/>
            『音频提取』一键提取视频音轨。 『文字』超多模板样式，让视频“字”成一派~<br/>
            『贴纸』独家贴纸，UP主必备~ 『封面模板』时下流行模板随你选，一键制作爆款封面！<br/>
            【画面特效】 专业转场，神仙特效，小白一秒变大神！ 『专业』神级转场效果，一键get~<br/>
            『丰富』漫画、动感、梦幻、复古等神仙特效任你挑选！ 【一键投稿】<br/>
            支持投稿免流量，账号互通，创作快人一步！ 『投稿免流』支持部分免流卡投稿免流量！<br/>
            『修改封面』封面支持裁剪，添加文字！ 『账号互通』主站账号互通，登录快人一步~<br/>
            『快捷投稿』谁不想要快一点呢？一键投稿快如闪电！ 来必剪，让创作更有趣！<br/>
          </div>
        </div>
        <div
          style="
            height: 2vh;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div style="width: 66%; height: 100%; color: black; font-size: 14px"> 商品详情： </div>
        </div>
        <div
          style="
            height: 15vh;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: grey;
          "
        >
          <div style="width: 66%; height: 100%">
            <!-- 发布者 条款 版权号Copyright 联系我们  -->
              <el-row :gutter="100">
                <el-col :span="12" ><div class="infoitem"><span style="color: black;">资费</span><span style="float: right;">{{market.price}}</span></div></el-col>
                <el-col :span="12" ><div class="infoitem"><span style="color: black;">应用分类</span><span style="float: right;">{{market.type}}</span></div></el-col>
        
                <el-col :span="12" ><div class="infoitem"><span style="color: black;">版本</span><span style="float: right;">{{market.version}}</span></div></el-col>
                <el-col :span="12" ><div class="infoitem"><span style="color: black;">更新时间</span><span style="float: right;">2022/09/06</span></div></el-col>
                <el-col :span="12" ><div class="infoitem" @click="showPolicy"><span style="color: black;">隐私政策</span><span style="float: right;"> > </span></div></el-col>
                <el-col :span="12" ><div class="infoitem" @click="showPermissions"><span style="color: black;">应用权限</span><span style="float: right;" >权限 > </span></div></el-col>
                <el-col :span="12" ><div class="infoitem"><span style="color: black;">供应商</span><span style="float: right;">吴胖胖</span></div></el-col>
                <el-col :span="12" ><div class="infoitem"><span style="color: black;">联系电话</span><span style="float: right;">0571-85201102</span></div></el-col>
              </el-row>
              <el-dialog
                v-model="permissionsIsShowed"
                append-to-body
                :before-close="closeDialog"
                :title="'应用权限'"
              >
              检测出此应用获取 15 个敏感隐私权限：<br/>
              1.完全的网络访问权限<br/>
              2.安装快捷方式<br/>
              3.更改网络连接性<br/>
              4.修改或删除存储卡中的内容<br/>
              5.读取存储卡中的内容<br/>
              6.录制音频<br/>
              7.相机<br/>
              8.显示在其他应用上面<br/>
              9.查看 Wi-Fi 连接<br/>
              10.连接 Wi-Fi 或断开连接<br/>
              11.读取通话状态和移动网络信息<br/>
              12.访问大致位置信息（使用网络进行定位）<br/>
              13.访问确切位置信息（使用 GPS 和网络进行定位）<br/>
              14.开机启动<br/>
              15.与蓝牙设备配对<br/>
              </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  <script lang="ts" setup>
import $services from '@/services'
import { onMounted, reactive, ref } from 'vue'
import MarketCard from '@/components/marketCard/index.vue'
import storeImg from '@/assets/img/app_icon.png'
import bijianImg from '@/assets/img/app_icon.png'
import bj1 from '@/assets/img/bj1.jpg'
import bj2 from '@/assets/img/bj2.jpg'
import bj3 from '@/assets/img/bj3.jpg'
import bj4 from '@/assets/img/bj4.jpg'
import bj5 from '@/assets/img/bj5.jpg'
import { ElMessage } from 'element-plus'
import DiyTable from '@/components/diyTable/index.vue'
  import { useRouter, useRoute } from 'vue-router'
  const router = useRouter()
  const route = useRoute()
const diyTable = ref(null)
const state = reactive({
  applyList: [],
  tableHead: []
})
const market = ref({
  // name: route.query.market?route.query.market.name:'',
  icon: null,
  score: 4.5,
  orderNum: 56789,
  version: 'beta1.0.1',
  price: route.query.price?route.query.price:'免费',
  type: 'web应用'
})

onMounted(() => {
  starterAppApprovalList()
})

const thousands = (num: number) => {
  var str = num.toString()
  var reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  return str.replace(reg, '$1,')
}
const showPolicy = () => {
  window.open('https://www.bilibili.com/blackboard/activity-GpejgaRvl5.html')
}
const permissionsIsShowed = ref(false)
const showPermissions = () => {
  permissionsIsShowed.value = true
}
const closeDialog = () => {
  permissionsIsShowed.value = false
}
//查询上架申请
const starterAppApprovalList = async () => {
  await $services.appstore
    .searchPublishApply({
      data: {
        offset: 0,
        limit: 10,
        filter: ''
      }
    })
    .then((res: ResultType) => {
      if (res.success) {
        const { result = [], total = 0 } = res.data
        state.applyList = []
        state.applyList = result?.map(
          (item: {
            product: { name: any; code: any; source: any; authority: any; typeName: any }
          }) => {
            return {
              ...item,
              productCode: item.product.code,
              productName: item.product.name,
              productSource: item.product.source,
              productAuthority: item.product.authority,
              productTypeName: item.product.typeName
            }
          }
        )
        state.tableHead = [
          {
            prop: 'productCode',
            label: '应用编号'
          },
          {
            prop: 'productName',
            label: '应用名称'
          },
          {
            prop: 'productSource',
            label: '应用来源'
          },
          {
            prop: 'productAuthority',
            label: '应用权限'
          },
          {
            prop: 'productTypeName',
            label: '应用类型'
          },
          {
            prop: 'price',
            label: '价格'
          },
          {
            prop: 'days',
            label: '使用期限'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            width: '200'
          }
        ]
      }
    })
}
</script>
  
  <style lang="scss" scoped>
.managerApproval {
  width: 100%;
  height: 130%;
  background-color: #fff;
  .tabList {
    width: 100%;
    height: calc(100vh - 130px);
    padding-left: 16px;
  }
  .infoitem {
    border-bottom: 1px solid;
    color: grey;
    font-size: 14px;
    padding: 5px;
  }
  .infoitem:hover{
    background-color: rgb(231, 231, 231);
  }
}
</style>
  