 <template>
  <Submenu :name="menuList.id">
    <!-- 父级菜单 -->
    <template slot="title">
      <!-- <Icon :type="menuList.icon" /> -->
      <i class="iconfont" :class="menuList.icon"></i>
      <span>{{ menuList.name }}</span>
    </template>
    <template v-for="item in menuList.children">
      <!-- 如果还有子集，继续调用   -->
      <left-menu-nav v-if="item.children && item.children.length !== 0" :menuList="item" :key="item.index">
      </left-menu-nav>
      <!-- 子菜单  -->
      <el-menu-item v-else :key="item.id" :name="item.id">
        <!-- <Icon :type="item.icon"></Icon> -->
        <i class="iconfont" :class="item.icon"></i>
        {{ item.name }}
      </el-menu-item>
    </template>
  </Submenu>
</template>
<script lang="ts" setup>
const props = defineProps<{ menuList: any }>({
  menuList: {}
})

</script>
<style  scoped>
</style>
