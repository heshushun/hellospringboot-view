<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm"  ref="postForm">

      <div class="createPost-main-container">

        <el-row>
          <el-col :span="21">
            <el-form-item >
              <el-input readonly="true" v-model="postForm.project">
                <template slot="prepend">项目名称</template>
              </el-input>
            </el-form-item>

            <el-form-item >
              <el-input readonly="true" v-model="postForm.functionId">
                <template slot="prepend"> 功 能 号:</template>
              </el-input>
            </el-form-item>

            <el-form-item >
              <el-input readonly="true" v-model="postForm.responceCode">
                <template slot="prepend"> 响应代码</template>
              </el-input>
            </el-form-item>

            <el-form-item >
              <el-input readonly="true" v-model="postForm.status">
                <template slot="prepend">断言状态</template>
              </el-input>
            </el-form-item>

            <el-form-item >
              <el-input readonly="true" v-model="postForm.group1">
                <template slot="prepend">时间分组</template>
              </el-input>
            </el-form-item>

          </el-col>
        </el-row>


        <el-row>
          <el-col :span="21">

            <el-form-item label="请求信息" style="margin-bottom: 20px;">
              <el-input
                readonly="true"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5}"
                placeholder="请求信息"
                v-model="postForm.requestMsg">
              </el-input>
            </el-form-item>

            <el-form-item label="预期结果" style="margin-bottom: 20px;">
              <el-input
                readonly="true"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6}"
                placeholder="预期结果"
                v-model="postForm.expectResult">
              </el-input>
            </el-form-item>

            <el-form-item label="响应结果" style="margin-bottom: 20px;">
              <el-input
                readonly="true"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6}"
                placeholder="响应结果"
                v-model="postForm.responceResult">
              </el-input>
            </el-form-item>

          </el-col>
        </el-row>

      </div>
    </el-form>

  </div>
</template>

<script>
  import { fetchTestResult } from '@/api/testresult'

  const defaultForm = {
    project: '', // 项目名
    functionId: '', // 功能号
    responceCode: '', // 响应代码
    status: '', // 断言状态
    group1: '', // 时间戳
    requestMsg: '', // 请求信息
    expectResult: '', // 预期结果
    responceResult: '' // 响应结果
  }

  export default {
    name: 'testresultDetail',
    data() {
      return {
        postForm: Object.assign({}, defaultForm),
        loading: false
      }
    },
    computed: {
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    },
    methods: {
      fetchData(id) {
        fetchTestResult(id).then(response => {
          // console.log(response.data.data)
          this.postForm = response.data.data
          // console.log(this.postForm)
        }).catch(err => {
          console.log(err)
        })
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
