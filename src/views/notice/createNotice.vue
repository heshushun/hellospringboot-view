<template>
  <article-detail :is-edit='false'></article-detail>
</template>

<script>
  import ArticleDetail from './components/NoticeDetail'

  export default {
    name: 'createForm',
    components: { ArticleDetail }
  }
</script>


