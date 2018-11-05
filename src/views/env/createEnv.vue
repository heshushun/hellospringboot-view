<template>
  <env-detail :is-edit='false'></env-detail>
</template>

<script>
  import EnvDetail from './components/EnvDetail'

  export default {
    name: 'createForm',
    components: { EnvDetail }
  }
</script>


