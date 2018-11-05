<template>
  <env-detail :is-edit='true'></env-detail>
</template>

<script>
  import EnvDetail from './components/EnvDetail'

  export default {
    name: 'editForm',
    components: { EnvDetail }
  }
</script>
