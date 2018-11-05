<template>
  <div class="components-container">
    <code>
      Based on <a class="link-type" href="https://github.com/rowanwins/vue-dropzone"> dropzone </a>.
      {{$t('components.dropzoneTips')}}
    </code>
    <div class="editor-container">
      <!--<dropzone v-on:dropzone-removedFile="dropzoneR" v-on:dropzone-success="dropzoneS" id="myVueDropzone" url="https://httpbin.org/post"></dropzone>-->
      <dropzone v-on:dropzone-removedFile="dropzoneR" v-on:dropzone-success="dropzoneS" id="myVueDropzone" url="http://10.26.211.86:4823/testcloud/api/v1/upload"></dropzone>
    </div>
  </div>
</template>

<script>
import Dropzone from '@/components/Dropzone'

export default {
  name: 'dropzone-demo',
  components: { Dropzone },
  methods: {
    dropzoneS(file) {
      console.log(file)
      this.$message({ message: 'Upload success', type: 'success' })
    },
    dropzoneR(file) {
      console.log(file)
      this.$message({ message: 'Delete success', type: 'success' })
    }
  }
}
</script>


