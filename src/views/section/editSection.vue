<template>
  <article-detail :is-edit='true'></article-detail>
</template>

<script>
  import ArticleDetail from './components/SectionDetail'

  export default {
    name: 'editForm',
    components: { ArticleDetail }
  }
</script>
