<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" prop="newsTitle">
              <MDinput name="newsTitle" v-model="postForm.newsTitle"  required :maxlength="100">
                标题
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" prop="newsAuthor" >
              <MDinput name="newsAuthor" v-model="postForm.newsAuthor"  required :maxlength="50">
                作者
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>

          <div class="postInfo-container">
            <el-row>
              <el-col :span="24">
                <el-form-item label-width="60px" label="来源:" prop="newsOrgin" class="postInfo-container-item">
                  <el-select v-model="postForm.newsOrgin" clearable filterable  remote placeholder="来源">
                    <el-option v-for="item in orginList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-show="showUrl">
                <el-form-item style="margin-bottom: 40px;" prop="newsOrginUrl">
                  <MDinput name="newsOrginUrl" v-model="postForm.newsOrginUrl" required :maxlength="50">
                    文章来源地址
                  </MDinput>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

        <div class="editor-container">
          <el-form-item style="margin-bottom: 40px;" prop="newsContent">
            <Tinymce :height=400 ref="editor" v-model="postForm.newsContent" />
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
import { createNews, fetchNews, updateNews } from '@/api/news'
import Warning from './Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  status: 'draft',
  newsTitle: '', // 文章题目
  newsAuthor: '', // 作者
  newsContent: '', // 文章内容
  newsOrginUrl: '', // 文章外链
  newsOrgin: '', // 文章来源
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
    const validateNewsTitle = (rule, value, callback) => {
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
    const validateNewsAuthor = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: '作者为必传项',
          type: 'error'
        })
      } else {
        callback()
      }
    }
    const validateNewsContent = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: '新闻内容为必传项',
          type: 'error'
        })
      } else {
        callback()
      }
    }
    const validateNewsOrgin = (rule, value, callback) => {
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
      if (this.postForm.newsOrgin !== 1 || this.postForm.newsOrgin === null) {
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
        newsTitle: [{ required: true, trigger: 'blur', validator: validateNewsTitle }],
        newsAuthor: [{ required: true, trigger: 'blur', validator: validateNewsAuthor }],
        newsContent: [{ required: true, trigger: 'blur', validator: validateNewsContent }],
        newsOrgin: [{ required: true, trigger: 'change', validator: validateNewsOrgin }],
        newsOrginUrl: [{ required: true, trigger: 'blur', validator: validateSourceUri }]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    showUrl() {
      if (typeof (this.postForm.newsOrgin) === 'number' && this.postForm.newsOrgin === 1) {
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
      fetchNews(id).then(response => {
        this.postForm = response.data.data
        this.postForm.newsOrgin = this.orginList[this.postForm.newsOrgin - 1].id
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateNews(this.postForm).then(response => {
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
            createNews(this.postForm).then(response => {
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
      if (this.postForm.newsContent.length === 0 || this.postForm.newsTitle.length === 0) {
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
