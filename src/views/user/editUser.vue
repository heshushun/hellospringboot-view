<template>
  <user-detail :is-edit='true'></user-detail>
</template>

<script>
  import userDetail from './components/UserDetail'

  export default {
    name: 'editForm',
    components: { userDetail }
  }
</script>
