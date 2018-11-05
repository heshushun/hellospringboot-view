<template>
  <div style="background:#f0f2f5;margin-top: -20px;height:100%;">
    <div class="wscn-http404">
      <img :src="Index" width="100%" height="100%" alt="HSB管理系统">
    </div>
  </div>
</template>

<script>
  import Index from '@/assets/avator/index.png'
  export default {
    name: 'page404',
    data() {
      return {
        Index
      }
    },
    computed: {
      message() {
        return '特朗普说这个页面你不能进......'
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
