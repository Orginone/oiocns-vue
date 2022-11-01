<template>
  <template v-if="menus.length > 0">
    <ul
      class="setAppMenu-wrap"
      :class="className"
      v-for="(menuItem, menuIndex) in menus"
      :key="menuItem.customId"
      @click.stop
    >
      <!-- 子集导航样式 -->
      <li class="menu-item flex">
        <div :class="['menu-label', readOnly ? '' : 'required']">资源名称:</div>
        <el-input
          placeholder="请设置资源名称"
          v-model="menuItem.name"
          :readonly="readOnly"
        ></el-input>
        <el-icon
          class="child-btn"
          v-if="!readOnly"
          @click.stop="handleEvent('Delete', menuItem.customId)"
          ><Delete
        /></el-icon>
        <el-icon
          class="child-btn"
          v-if="!readOnly"
          @click.stop="handleEvent('Up', menuItem.customId)"
          ><SortUp
        /></el-icon>
        <el-icon
          class="child-btn"
          v-if="!readOnly"
          @click.stop="handleEvent('Down', menuItem.customId)"
          ><SortDown
        /></el-icon>
      </li>
      <!-- 共有部分 -->
      <li class="menu-item flex">
        <div :class="['menu-label', readOnly ? '' : 'required']">资源地址:</div>
        <el-input
          placeholder="例如:http://anyinone.com:800/"
          v-model="menuItem.link"
          :readonly="readOnly"
        ></el-input>
      </li>

      <li class="menu-item flex">
        <div :class="['menu-label', readOnly ? '' : 'required']">资源编码:</div>
        <el-input placeholder="请设置" v-model="menuItem.code" :readonly="readOnly"></el-input>
      </li>

      <div class="custom-title">
        <p> <span class="custom-span"></span> 流程信息 </p>
        <el-icon class="add-btn" :size="20" @click.stop="handleAddMenu('Add', menuIndex)">
          <CirclePlus />
        </el-icon>
      </div>
      <ul
        class="setToDoMenu-wrap"
        :class="className"
        v-for="(item, fIndex) in menuItem.flows"
        :key="item.customId"
        @click.stop
      >
        <li class="menu-item flex">
          <div class="menu-label">业务信息:</div>
          <el-input
            placeholder="请设置流程名称"
            v-model="item.business"
            :readonly="readOnly"
          ></el-input>
          <el-icon
            class="child-btn"
            v-if="!readOnly"
            @click.stop="handleAddMenu('Delete', menuIndex, item.customId)"
            ><Delete
          /></el-icon>
        </li>
        <!-- 共有部分 -->
        <div class="custom-title">
          <p> <span class="custom-span"></span> 流程字段 </p>
          <el-icon
            class="add-btn"
            :size="20"
            @click.stop="handlFieldMenu('Add', menuIndex, fIndex)"
          >
            <CirclePlus />
          </el-icon>
        </div>
        <ul
          class="setToDoMenu-wrap"
          :class="className"
          v-for="(fItem, index) in item.field"
          :key="item.customId"
          @click.stop
        >
          <li class="menu-item flex">
            <div class="menu-label">字段名称:</div>
            <el-input
              placeholder="请设置字段名称"
              v-model="fItem.name"
              :readonly="readOnly"
            ></el-input>
            <el-icon
              class="child-btn"
              v-if="!readOnly"
              @click.stop="handlFieldMenu('Delete', menuIndex, fIndex, fItem.customId)"
              ><Delete
            /></el-icon>
          </li>
          <li class="menu-item flex">
            <div class="menu-label">字段编号:</div>
            <el-input
              placeholder="请设置字段编号"
              v-model="fItem.code"
              :readonly="readOnly"
            ></el-input>
          </li>
          <li class="menu-item flex">
            <div class="menu-label">字段类型:</div>
            <el-select v-model="fItem.type" class="m-2" placeholder="Select">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!-- <el-input
              placeholder="请设置字段编号"
              v-model="fItem.code"
              :readonly="readOnly"
            ></el-input> -->
          </li>
          <div v-if="fItem.type=='DICT'">
            <div class="custom-title" >
              <p> <span class="custom-span"></span> 枚举 </p>
              <el-icon
                class="add-btn"
                :size="20"
                @click.stop="handlFieldMenu('Add', menuIndex, fIndex,fItem.customId)"
              >
                <CirclePlus />
              </el-icon>
            </div>
            <ul class="setToDoMenu-wrap"  v-for="(dicItem, dicIndex) in fItem.dict" :key="dicItem.code">
              <li class="menu-item flex">
                <div :class="['menu-label', readOnly ? '' : 'required']">枚举名称:</div>
                <el-input
                  placeholder="请输入名称"
                  v-model="dicItem.name"
                  :readonly="readOnly"
                ></el-input>
                  <div :class="['menu-label', readOnly ? '' : 'required']">枚举值:</div>
                <el-input
                  placeholder="请输入值"
                  v-model="dicItem.code"
                  :readonly="readOnly"
                ></el-input>
                <el-icon
                  class="child-btn"
                  @click.stop="handlFieldMenu('Delete', menuIndex, fIndex, fItem.customId, dicIndex)"
                  ><Delete
                /></el-icon>
              </li>

            </ul>

          </div>
        </ul>
      </ul>
      <div class="custom-title">
        <p> <span class="custom-span"></span> 应用组件 </p>
        <el-icon class="add-btn" :size="20" @click.stop="handleAddComponents('Add', menuIndex)">
          <CirclePlus />
        </el-icon>
      </div>
      <ul
        class="setToDoMenu-wrap"
        :class="className"
        v-for="(comItem, index) in menuItem.components"
        :key="comItem.customId"
        @click.stop
      >
        <li class="menu-item flex">
          <div class="menu-label">组件名称:</div>
          <el-input
            placeholder="请设置流程名称"
            v-model="comItem.name"
            :readonly="readOnly"
          ></el-input>
          <el-icon
            class="child-btn"
            v-if="!readOnly"
            @click.stop="handleAddComponents('Delete', menuIndex, comItem.customId)"
            ><Delete
          /></el-icon>
        </li>
        <!-- 共有部分 -->
        <li class="menu-item flex">
          <div class="menu-label">链接地址:</div>
          <el-input
            placeholder="请设置链接地址"
            v-model="comItem.url"
            :readonly="readOnly"
          ></el-input>
        </li>
        <li class="menu-item flex">
          <div class="menu-label">组件宽度:</div>
          <el-input
            placeholder="请设置宽度"
            v-model="comItem.width"
            :readonly="readOnly"
          ></el-input>
        </li>
        <li class="menu-item flex">
          <div class="menu-label">组件高度:</div>
          <el-input
            placeholder="请设置高度"
            v-model="comItem.height"
            :readonly="readOnly"
          ></el-input>
        </li>
      </ul>
      <el-divider v-if="menuIndex !== menus.length - 1" />
    </ul>
  </template>
  <template v-else>
    <div class="noData" style="text-align: center; margin-top: 50px">暂无资源</div>
  </template>
</template>
<script lang="ts" setup>
  // import SetAppMenu from './setAppMenu.vue'
  type Props = {
    readOnly?: boolean
    menus?: AppResourcesType[]
    className?: string
    isChildren?: boolean
  }

  const options = [
    {
      value: 'NUMERIC',
      label: '数字'
    },
    {
      value: 'STRING',
      label: '字符串'
    },
    {
      value: 'DICT',
      label: '枚举'
    }
  ]

  // type ProductMenuEventType = 'add' | 'delete' | 'up' | 'down'
  const { menus, className, readOnly } = withDefaults(defineProps<Props>(), {
    isChildren: false,
    readOnly: false
  })
  const emit = defineEmits([
    'handleMemuEvent',
    'handleAddMenu',
    'handleAddComponents',
    'handlFieldMenu'
  ])
  const handleEvent = (type: ProductMenuEventType, id: string | number) => {
    emit('handleMemuEvent', type, id)
  }
  const handlFieldMenu = (
    type: ProductMenuEventType,
    index: number,
    fIndex: number,
    selectId?: string,
    dicIndex?:number
  ) => {
    emit('handlFieldMenu', type, index, fIndex, selectId, dicIndex)
  }
  const handleAddComponents = (type: ProductMenuEventType, index: number, selectId?: string) => {
    emit('handleAddComponents', type, index, selectId)
  }
  const handleAddMenu = (type: ProductMenuEventType, index: number, selectId?: string) => {
    emit('handleAddMenu', type, index, selectId)
  }
</script>

<style lang="scss" scoped>
  :deep(.el-select) {
    width: 100%;
  }
  // 自定义标题
  .custom-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 26px;
    font-size: 14px;
    margin-left: 40px;
    margin-bottom: 10px;

    .custom-span {
      display: inline-block;
      width: 3px;
      height: 14px;
      margin-right: 6px;
      background-color: #3e5ed8;
    }
  }
  .add-btn {
    cursor: pointer;
    color: var(--el-color-primary);
    margin: 0 10px;
  }
  .setToDoMenu-wrap {
    width: calc(100% - 40px);
    margin-left: 40px;
  }
  .setAppMenu-wrap {
    min-height: 100px;

    .menu-item {
      margin-bottom: 6px;
      display: flex;
      align-items: center;

      .menu-label {
        position: relative;
        width: 90px;
        min-width: 90px;
        height: 34px;
        font-size: 14px;
        line-height: 34px;
        text-align: right;
        color: var(--el-text-color-regular);
        padding-right: 10px;
        box-sizing: border-box;
      }

      .required::after {
        position: absolute;
        left: -8px;
        font-size: 14px;
        content: '*';
        color: var(--el-color-danger);
        margin-right: 4px;
        transform: translateX(20px);
      }

      .add-btn {
        cursor: pointer;
        color: var(--el-color-primary);
        margin: 0 10px;
      }

      .child-btn {
        cursor: pointer;
        color: var(--el-text-color-regular);
        margin: 0 8px;

        &:hover {
          color: var(--el-color-primary);
        }
      }
    }

    .more-btn {
      text-align: center;

      .more {
        transform: rotate(90deg);
      }

      .noMore {
        transform: rotate(270deg);
      }
    }

    .child-comp {
      padding-left: 30px;
    }

    :deep(.el-divider--horizontal) {
      margin: 10px 0;
    }
    .noData {
      text-align: center;
    }
  }
</style>
