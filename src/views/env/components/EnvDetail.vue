<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">保存</el-button>
      </sticky>

      <div class="createPost-main-container">

        <el-row>
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" prop="envName">
              <MDinput name="envName" v-model="postForm.envName" required :maxlength="100">
                环境名称
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="postInfo-container">

          <el-row>
            <el-col :span="8">
              <el-form-item label-width="90px" label="环境类型:" prop="envType" class="postInfo-container-item">
                <el-select v-model="postForm.envType" clearable filterable remote placeholder="环境类型">
                  <el-option v-for="item in orginList" :key="item.itemCode" :label="item.itemName" :value="item.itemCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="90px" label="是否可用:" prop="isEnable" class="postInfo-container-item">
                <el-select v-model="postForm.isEnable" clearable filterable remote placeholder="是否可用">
                  <el-option v-for="item in enableList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

        </div>

        <el-form-item style="margin-top: 60px;" prop="envUrl">
          <div class="upload">
            <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 20px;" @click="imagecropperShow=true">上传环境图片
            </el-button>
          </div>
          <img :src="postForm.envUrl" class="image" v-model="postForm.envUrl" v-show="postForm.envUrl.length>0"/>
          <image-cropper :width="350" :height="300" url="http://47.98.204.145:8080/zhy/img/upload" @close='close' @crop-upload-success="cropSuccess" langType="en"
                         :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>
        </el-form-item>

      </div>
    </el-form>

  </div>
</template>

<script>
  import ImageCropper from '@/components/ImageCropper'
  import Tinymce from '@/components/Tinymce'
  import MDinput from '@/components/MDinput'
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  import Sticky from '@/components/Sticky' // 粘性header组件
  import { createEnv, fetchEnv, updateEnv } from '@/api/env'
  import { getDictItems } from '@/api/dict'
  import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from '../../news/components/Dropdown/index'

  const defaultForm = {
    status: 'draft',
    envName: '',
    envType: '1',
    envUrl: '',
    isEnable: 1
  }

  export default {
    name: 'envDetail',
    components: { Tinymce, MDinput, Multiselect, Sticky, CommentDropdown, PlatformDropdown, SourceUrlDropdown, ImageCropper },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateEnvName = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            // message: rule.field + '为必传项',
            message: '环境名称为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateEnvType = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '环境类型为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateIsEnable = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '是否可用为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateEnvUrl = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '环境图片为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      return {
        imagecropperShow: false,
        imagecropperKey: 0,
        postForm: Object.assign({}, defaultForm),
        loading: false,
        orginList: [],
        enableList: [{ id: 1, name: '是' }, { id: 0, name: '否' }],
        rules: {
          envName: [{ required: true, trigger: 'blur', validator: validateEnvName }],
          envType: [{ required: true, trigger: 'change', validator: validateEnvType }],
          isEnable: [{ required: true, trigger: 'change', validator: validateIsEnable }],
          envUrl: [{ required: true, trigger: 'blur', validator: validateEnvUrl }]
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
      this.getDictItems()
    },
    methods: {
      cropSuccess(resData) {
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        this.postForm.envUrl = resData.data
      },
      close() {
        this.imagecropperShow = false
      },
      fetchData(id) {
        fetchEnv(id).then(response => {
          this.postForm = response.data.data
          this.postForm.isEnable = this.enableList[this.postForm.isEnable - 1].id
        }).catch(err => {
          console.log(err)
        })
      },
      getDictItems() {
        getDictItems(4).then(response => {
          this.orginList = response.data.data
        }).catch(err => {
          console.log(err)
        })
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            if (this.isEdit) {
              updateEnv(this.postForm).then(response => {
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(err => {
                console.log(err)
              })
            } else {
              createEnv(this.postForm).then(response => {
                this.$notify({
                  title: '成功',
                  message: '发布成功',
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
  .el-form-item__label {
    text-align: left !important;
  }

  .upload {
    width: 100%;
    position: relative;
    padding-top: 20px;
    min-height: 40px;
    button {
      left: -22px !important;
      bottom: 20px !important;
    }
  }
  img{
    width: 500px;
    height: 200px;
    border: 1px dotted #ccc;
  }

</style>
