<template>

  <el-menu class="navbar" mode="horizontal">

    <!-- 导航栏缩进按钮 -->
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <!-- 显示页面路径 -->
    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">

      <!-- 错误提示按钮 -->
      <error-log class="errLog-container right-menu-item"></error-log>

      <!-- 全屏按钮 -->
      <!--<el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>-->

      <!-- 国际化按钮 -->
      <lang-select class="international right-menu-item"></lang-select>

      <!-- 主题选择按钮 -->
      <!--<el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>-->

      <!-- 个人信息 -->
      <el-dropdown class="avatar-container right-menu-item" trigger="click">

        <!-- 头像 -->
        <div class="avatar-wrapper">
          <!--<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
          <img class="user-avatar" :src="imageUrl">
          <i class="el-icon-caret-bottom"></i>
        </div>

        <!-- 个人信息下拉框 -->
        <el-dropdown-menu slot="dropdown">

          <router-link to="/">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
          <router-link to="/user/userInfo">
            <el-dropdown-item>
              {{$t('navbar.userInfo')}}
            </el-dropdown-item>
          </router-link>
          <router-link to="/user/updatePass">
            <el-dropdown-item>
              {{$t('navbar.updatePass')}}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>

        </el-dropdown-menu>

      </el-dropdown>

    </div>
  </el-menu>

</template>


<script>
import { mapGetters } from 'vuex' // 获取头像姓名等
import Breadcrumb from '@/components/Breadcrumb' // 导航栏缩进 插件
import Hamburger from '@/components/Hamburger' // 显示页面路径 插件
import ErrorLog from '@/components/ErrorLog' // 错误日志 插件
import Screenfull from '@/components/Screenfull' // 全屏按钮 插件
import LangSelect from '@/components/LangSelect' // 国际化语言选择 插件
import ThemePicker from '@/components/ThemePicker' // 主题选择 插件
import { selectByAccount } from '@/api/user'

export default {
  data() {
    return {
      portrait: 'http://127.0.0.1:8081/image/20181128/7b8efe4ac826780.png',
      account: ''
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker
  },
  created() {
    this.getPortrait()
  },
  computed: {
    imageUrl() {
      return this.portrait
    },
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  methods: {
    getPortrait() {
      selectByAccount().then(response => {
        this.portrait = response.data.data.portrait
        this.account = response.data.data.account
        // console.log(this.account)
      }).catch(() => {
      })
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
