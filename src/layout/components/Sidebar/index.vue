<!--
 * @Author: 18059301505 275895816@qq.com
 * @Date: 2021-10-27 16:58:22
 * @LastEditors: 18059301505 275895816@qq.com
 * @LastEditTime: 2022-10-10 15:20:33
 * @FilePath: \sd365-permission-centre-front-end\src\layout\components\Sidebar\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!--        用户信息框-->
        <!-- <user-info-item :avatar="this.$store.getters.avatar" :user-name="this.$store.getters.name" :is-collapse="isCollapse" /> -->
        <!-- <user-info-item :avatar="this.$store.getters.avatar" :user-name="this.userName" :is-collapse="isCollapse" /> -->
        <user-info-item :avatar="logo" :user-name="this.userName" :is-collapse="isCollapse" />
        <!--        菜单搜索-->
        <menu-search :is-collapse="isCollapse" />
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import UserInfoItem from '@/layout/components/Sidebar/UserInfoItem'
import MenuSearch from '@/layout/components/Sidebar/MenuSearch'

export default {
  components: { MenuSearch, UserInfoItem, SidebarItem, Logo },
  data() {
    return {
      userName: this.$store.getters.name,
      logo: require('../../../assets/404_images/sdLogoS.png')
      // userName: 'OMP系统'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    /**
     * 取得全部路由，该路由已经根据角色的权限在登录完成后生成
     */
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
