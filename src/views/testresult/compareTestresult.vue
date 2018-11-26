<template>
  <div class="createPost-container">
    <el-form class="form-container">

      <div class="createPost-main-container">

        <div class="postInfo-container">

          <el-row :gutter="10" >

            <el-col :span="12">
              <el-form-item >
                <el-input v-model="oldStr" type="textarea" :autosize="{minRows: 10, maxRows: 15}" placeholder="请输入旧数据"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item >
                <el-input v-model="newStr" type="textarea" :autosize="{minRows: 10, maxRows: 15}" placeholder="请输入新数据"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="展示效果：" >
                <el-switch v-model="fotmat" active-text="单屏" inactive-text="双屏"></el-switch>
              </el-form-item>
            </el-col>

            <!--<el-col :span="12">
              <el-form-item label="差异化范围：">
                <el-input-number v-model="context" placeholder=""></el-input-number>
              </el-form-item>
            </el-col>-->

          </el-row>
        </div>
      </div>
    </el-form>

    <div class="createPost-main-container">
      <div class="postInfo-container">
        <code-diff :old-string="oldStr" :new-string="newStr" :context="context" :output-format="outputFormat" />
      </div>
    </div>
    <!--<code-diff :old-string="oldStr" :new-string="newStr" :context="context" :output-format="outputFormat" />-->

  </div>
</template>

<script>
  import codeDiff from 'vue-code-diff'
  import { fetchTestResult } from '@/api/testresult'

  export default {
    name: 'CodeDiff',
    components: {
      codeDiff
    },
    data() {
      return {
        oldStr: '',
        newStr: '',
        fotmat: true,
        context: 1
      }
    },
    created() { // 初始化对比
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    },
    methods: {
      fetchData(id) {
        fetchTestResult(id).then(response => {
          this.oldStr = response.data.data.expectResult
          this.newStr = response.data.data.responceResult
        }).catch(err => {
          console.log(err)
        })
      }
    },
    computed: {
      outputFormat() {
        return this.fotmat ? 'line-by-line' : 'side-by-side'
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>
