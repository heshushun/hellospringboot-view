<template>
  <task-detail :is-edit='false'></task-detail>
</template>

<script>
  import taskDetail from './components/TaskDetail'

  export default {
    name: 'createForm',
    components: { taskDetail }
  }
</script>

