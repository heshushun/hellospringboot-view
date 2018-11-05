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
              <el-form-item label-width="60px" label="类型:" prop="sectionType" class="postInfo-container-item">
                <el-select v-model="postForm.sectionType" clearable filterable remote placeholder="科室类型">
                  <el-option v-for="item in sectionType" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
        </div>

        <el-row>
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" prop="sectionName">
              <MDinput name="sectionName" v-model="postForm.sectionName" required :maxlength="100">
                科室名称
              </MDinput>
            </el-form-item>

            <el-form-item style="margin-bottom: 40px;" prop="sectionAddress">
              <MDinput name="sectionAddress" v-model="postForm.sectionAddress" required :maxlength="100">
                科室位置
              </MDinput>
            </el-form-item>

            <el-form-item label="科室简介:" style="margin-bottom: 40px;" prop="sectionSummary">
              <textarea name="sectionSummary" v-model="postForm.sectionSummary" cols="130" rows="6" required :maxlength="500">
              </textarea>
            </el-form-item>

          </el-col>
        </el-row>

        <el-form-item  prop="sectionContent">
          <div class="editor-container">
            <Tinymce :height=400 ref="editor" v-model="postForm.sectionContent" />
          </div>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" prop="remark">
          <MDinput name="remark" v-model="postForm.remark" required :maxlength="100">
            备注
          </MDinput>
        </el-form-item>


        <!--<div style="margin-bottom: 20px;">
          <label  style="font-size: 15px;color: #CC9999;" >上传科室图片:</label>
          <Upload v-model="postForm.sectionImg" />
        </div>-->

        <div style="margin-top: 20px; " class="upload">
          <el-form-item>
            <el-button type="primary" icon="upload" style="position: absolute;margin-left: 0px;" @click="imagecropperShow=true">上传科室图片
            </el-button>
          </el-form-item>
        </div>
        <!--<img :src="postForm.doctorPortrait" class="image" v-show="postForm.doctorPortrait.length>0"/>-->

        <el-form-item prop="sectionImg">
          <div class="image-preview">
            <div class="image-preview-wrapper" v-show="imageUrl.length>1">
              <img :src="imageUrl" v-model="postForm.sectionImg">
              <div class="image-preview-action">
                <i @click="rmImage" class="el-icon-delete"></i>
              </div>
            </div>
          </div>

          <image-cropper :width="350" :height="300" url="http://47.98.204.145:8080/zhy/img/upload" @close='close' @crop-upload-success="cropSuccess" langType="en"
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
  import { createSection, fetchSection, updateSection } from '@/api/section'
  import Warning from '../../news/components/Warning'
  import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from '../../news/components/Dropdown/index'
  import ImageCropper from '@/components/ImageCropper'

  const defaultForm = {
    status: 'draft',
    sectionType: '', // 科室类型
    sectionName: '', // 科室名称
    sectionAddress: '', // 科室位置
    sectionSummary: '', // 科室简介
    sectionContent: '', // 科室内容
    sectionImg: '', // 科室图片
    comment_disabled: false,
    importance: 0
  }

  export default {
    name: 'articleDetail',
    components: { Tinymce, MDinput, Upload, Multiselect, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown, ImageCropper },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateSectionType = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            // message: rule.field + '为必传项',
            message: '科室类型为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateSectionName = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '科室名称为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateSectionAddress = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '科室位置为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateSectionSummary = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '科室简介为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateSectionContent = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '科室内容为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateSectionImg = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '科室图片为必传项',
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
        sectionType: [{ id: 1, name: '非手术科室' }, { id: 2, name: '手术科室' }, { id: 3, name: '诊断相关科室' }],
        rules: {
          sectionType: [{ required: true, trigger: 'change', validator: validateSectionType }],
          sectionName: [{ required: true, trigger: 'blur', validator: validateSectionName }],
          sectionAddress: [{ required: true, trigger: 'blur', validator: validateSectionAddress }],
          sectionSummary: [{ required: true, trigger: 'blur', validator: validateSectionSummary }],
          sectionContent: [{ required: true, trigger: 'blur', validator: validateSectionContent }],
          sectionImg: [{ required: true, trigger: 'blur', validator: validateSectionImg }]
        }
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.content_short.length
      },
      imageUrl() {
        return this.postForm.sectionImg
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
      rmImage() {
        this.postForm.sectionImg = ''
      },
      cropSuccess(resData) {
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        this.postForm.sectionImg = resData.data
      },
      close() {
        this.imagecropperShow = false
      },
      fetchData(id) {
        fetchSection(id).then(response => {
          this.postForm = response.data.data
          this.postForm.sectionType = this.sectionType[this.postForm.sectionType - 1].id
        }).catch(err => {
          console.log(err)
        })
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            if (this.isEdit) {
              updateSection(this.postForm).then(response => {
                this.$notify({
                  title: '成功',
                  message: '更新科室成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(err => {
                console.log(err)
              })
            } else {
              createSection(this.postForm).then(response => {
                this.$notify({
                  title: '成功',
                  message: '提交科室成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(err => {
                console.log(err)
              })
            }
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
    width: 400px;
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
