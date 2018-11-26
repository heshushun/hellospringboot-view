<template>
  <user-detail :is-edit='false'></user-detail>
</template>

<script>
  import userDetail from './components/UserDetail'

  export default {
    name: 'createForm',
    components: { userDetail }
  }
</script>

