<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">保存</el-button>
      </sticky>

      <div class="createPost-main-container">

        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="100px" label="是否开启：" prop="isEnabled" class="postInfo-container-item">
                <el-select v-model="postForm.isEnabled"  clearable filterable remote placeholder="是否开启">
                  <el-option v-for="item in isEnabled" :key="item.id"  :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-form-item style="margin-bottom: 30px;" >
          <MDinput name="remark" v-model="postForm.remark" required :maxlength="100">
            备注
          </MDinput>
        </el-form-item>

        <div style="margin-top: 80px; " class="upload">
          <el-form-item  prop="remark">
            <el-button type="primary" icon="upload" style="position: absolute;margin-left: 0px;" @click="imagecropperShow=true">上传banner图
            </el-button>
          </el-form-item>
        </div>

        <el-form-item  prop="bannerUrl">
          <div class="image-preview">
            <div class="image-preview-wrapper" v-show="imageUrl.length>1">
              <img :src="imageUrl" v-model="postForm.bannerUrl" >
              <div class="image-preview-action">
                <i @click="rmImage" class="el-icon-delete"></i>
              </div>
            </div>
          </div>

          <image-cropper :width="1230" :height="300" url="http://47.98.204.145:8080/zhy/img/upload" @close='close' @crop-upload-success="cropSuccess" langType="en"
                         :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>

        </el-form-item>
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
  import { createBanner } from '@/api/banner'
  import Warning from '../../news/components/Warning'
  import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from '../../news/components/Dropdown/index'
  import ImageCropper from '@/components/ImageCropper'

  const defaultForm = {
    bannerUrl: '', // 图片地址
    isEnabled: '', // 是否开启
    remark: ''// 备注
  }

  export default {
    name: 'bannerDetail',
    components: { Tinymce, MDinput, Upload, Multiselect, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown, ImageCropper },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateBannerUrl = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            // message: rule.field + '为必传项',
            message: 'banner图为必传项',
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
      return {
        imagecropperShow: false,
        imagecropperKey: 0,
        postForm: Object.assign({}, defaultForm),
        loading: false,
        isEnabled: [{ id: 1, name: '是' }, { id: 0, name: '否' }],
        rules: {
          isEnabled: [{ required: true, trigger: 'change', validator: validateIsEnable }],
          bannerUrl: [{ required: true, trigger: 'blur', validator: validateBannerUrl }]
        }
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.content_short.length
      },
      imageUrl() {
        return this.postForm.bannerUrl
      }
    },
    created() {
      this.postForm = Object.assign({}, defaultForm)
    },
    methods: {
      rmImage() {
        this.postForm.bannerUrl = ''
      },
      cropSuccess(resData) {
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        this.postForm.bannerUrl = resData.data
      },
      close() {
        this.imagecropperShow = false
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            createBanner(this.postForm).then(response => {
              this.$notify({
                title: '成功',
                message: '提交banner图成功',
                type: 'success',
                duration: 2000
              })
            }).catch(err => {
              console.log(err)
            })
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

  .image-preview {
    width: 600px;
    height: 300px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 0px;
    margin-top: 30px;
    margin-bottom: 50px;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
  .image-app-preview {
    width: 320px;
    height: 180px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    .app-fake-conver {
      height: 44px;
      position: absolute;
      width: 100%; // background: rgba(0, 0, 0, .1);
      text-align: center;
      line-height: 64px;
      color: #fff;
    }
  }


</style>
