<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布</el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" prop="healthyTitle">
              <MDinput name="healthyTitle" v-model="postForm.healthyTitle" required :maxlength="100">
                标题
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" prop="healthyAuthor">
              <MDinput name="healthyAuthor" v-model="postForm.healthyAuthor" required :maxlength="50">
                作者
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>


        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="60px" label="来源:" prop="healthyOrgin" class="postInfo-container-item">
                <el-select v-model="postForm.healthyOrgin" clearable  filterable remote placeholder="来源">
                  <!--<el-option v-for="item in orginList" :label="item.name"  v-bind:value="item.id">
                    {{ item.name }}
                  </el-option>-->
                  <el-option v-for="item in orginList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-show="showUrl" >
              <el-form-item style="margin-bottom: 40px;" prop="healthyOrginUrl">
                <MDinput name="healthyOrginUrl" v-model="postForm.healthyOrginUrl" required :maxlength="50">
                  文章来源地址
                </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
        </div>


        <div class="editor-container">
          <el-form-item style="margin-bottom: 40px;" prop="healthyContent">
            <Tinymce :height=400 ref="editor" v-model="postForm.healthyContent" />
          </el-form-item>
        </div>

      </div>
    </el-form>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/singleImage3'
  import MDinput from '@/components/MDinput'
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  import Sticky from '@/components/Sticky' // 粘性header组件
  import { validateURL } from '@/utils/validate'
  import { createHealthy, fetchHealthy, updateHealthy } from '@/api/healthy'
  import Warning from '../../news/components/Warning'
  import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from '../../news/components/Dropdown/index'

  const defaultForm = {
    status: 'draft',
    healthTitle: '', // 文章题目
    healthAuthor: '', // 作者
    healthContent: '', // 文章内容
    healthOrginUrl: '', // 文章外链
    healthOrgin: '', // 文章来源
    comment_disabled: false,
    importance: 0
  }

  export default {
    name: 'articleDetail',
    components: { Tinymce, MDinput, Upload, Multiselect, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateHealthyTitle = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            // message: rule.field + '为必传项',
            message: '标题为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateHealthyAuthor = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '作者为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateHealthyContent = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '公告内容为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateHealthyOrgin = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '新闻来源为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateSourceUri = (rule, value, callback) => {
        if (this.postForm.healthyOrgin !== 1 || this.postForm.healthyOrgin === null) {
          if (value) {
            if (validateURL(value)) {
              callback()
            } else {
              return callback(new Error('请输入正确格式的URL， 例：http://'))
            }
          } else {
            this.$message({
              message: '非原创 URL为必传项',
              type: 'error'
            })
          }
        } else {
          callback()
        }
      }
      return {
        postForm: Object.assign({}, defaultForm),
        loading: false,
        orginList: [{ id: 1, name: '原创' }, { id: 2, name: '转载' }, { id: 3, name: '译文' }],
        rules: {
          healthyTitle: [{ required: true, trigger: 'blur', validator: validateHealthyTitle }],
          healthyAuthor: [{ required: true, trigger: 'blur', validator: validateHealthyAuthor }],
          healthyContent: [{ required: true, trigger: 'blur', validator: validateHealthyContent }],
          healthyOrgin: [{ required: true, trigger: 'change', validator: validateHealthyOrgin }],
          healthyOrginUrl: [{ required: true, trigger: 'blur', validator: validateSourceUri }]
        }
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.content_short.length
      },
      showUrl() {
        if (typeof (this.postForm.healthyOrgin) === 'number' && this.postForm.healthyOrgin === 1) {
          return false
        }
        return true
      }
    },
    created() {
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        this.fetchData(id)
      } else {
        this.postForm = Object.assign({}, defaultForm)
      }
    },
    methods: {
      fetchData(id) {
        fetchHealthy(id).then(response => {
          this.postForm = response.data.data
          this.postForm.healthyOrgin = this.orginList[this.postForm.healthyOrgin - 1].id
        }).catch(err => {
          console.log(err)
        })
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            if (this.isEdit) {
              updateHealthy(this.postForm).then(response => {
                this.$notify({
                  title: '成功',
                  message: '更新文章成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(err => {
                console.log(err)
              })
            } else {
              createHealthy(this.postForm).then(response => {
                this.$notify({
                  title: '成功',
                  message: '发布文章成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(err => {
                console.log(err)
              })
            }

            // this.postForm.status = 'published'
            this.loading = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      draftForm() {
        if (this.postForm.healthContent.length === 0 || this.postForm.healthTitle.length === 0) {
          this.$message({
            message: '请填写必要的标题和内容',
            type: 'warning'
          })
          return
        }
        this.$message({
          message: '保存成功',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        this.postForm.status = 'draft'
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
