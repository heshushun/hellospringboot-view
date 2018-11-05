<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm('postForm')">保存</el-button>
      </sticky>

      <div class="createPost-main-container">
        <div class="postInfo-container">

          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" prop="doctorName" name="医生名称">
                <MDinput name="doctorName" v-model="postForm.doctorName" required :maxlength="100">
                  医生名称
                </MDinput>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label-width="65px" label="性别："  prop="doctorSex" class="postInfo-container-item">
                <el-select v-model="postForm.doctorSex" clearable filterable remote placeholder="性别">
                  <el-option v-for="item in doctorSex" :key="item"  :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label-width="68px" label="科室：" prop="sectionId" class="postInfo-container-item">
                <el-select v-model="postForm.sectionId"  clearable filterable remote placeholder="科室">
                  <el-option v-for="item in section" :key="item.id" :label="item.sectionName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" prop="mobile">
                <MDinput name="name" v-model="postForm.mobile" required :maxlength="11">
                  手机号
                </MDinput>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-top: 20px;" label-width="92px"  prop="visitingMsg" label="就诊时间：" class="postInfo-container-item">
                <el-select style="width:600px;"  v-model="postForm.visitingMsg" clearable multiple filterable remote placeholder="就诊时间">
                  <el-option v-for="item in workTimes" :key="item.id" :label="item.workTimeName" :value="item.id">
                  </el-option>
                </el-select>
                <!--<pre class="language-json"><code>{{ postForm.visitingMsg }}</code></pre>-->
              </el-form-item>
            </el-col>
          </el-row>

        </div>

        <el-row>
          <el-col :span="21">

            <el-form-item style="margin-bottom: 40px;" prop="doctorJob">
              <MDinput name="doctorJob" v-model="postForm.doctorJob" required :maxlength="100">
                医生职位
              </MDinput>
            </el-form-item>

            <el-form-item label="医生简介:" style="margin-bottom: 40px;" prop="doctorIntro">
              <textarea name="doctorIntro" v-model="postForm.doctorIntro" cols="130" rows="6" required :maxlength="500">
              </textarea>
            </el-form-item>

          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" prop="remark">
          <MDinput name="remark" v-model="postForm.remark" required :maxlength="100">
            擅长
          </MDinput>
        </el-form-item>

        <!--<div style="margin-bottom: 20px;">
          <label  style="font-size: 15px;color: #CC9999;" >上传医生头像:</label>
          <Upload v-model="postForm.doctorPortrait" />
        </div>-->


        <div style="margin-top: 20px; "  class="upload">
          <el-form-item>
            <el-button type="primary" icon="upload" style="position: absolute;margin-left: 0px;" @click="imagecropperShow=true">上传医生头像
            </el-button>
          </el-form-item>
        </div>


        <el-form-item prop="doctorPortrait">
          <div class="image-preview">
            <div class="image-preview-wrapper"  v-show="imageUrl.length>1">
              <img :src="imageUrl" v-model="postForm.doctorPortrait">
              <div class="image-preview-action">
                <i @click="rmImage" class="el-icon-delete"></i>
              </div>
            </div>
          </div>
          <image-cropper :width="299" :height="349" url="http://47.98.204.145:8080/zhy/img/upload" @close='close' @crop-upload-success="cropSuccess" langType="en"
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
  import { createDoctor, fetchDoctor, updateDoctor, getSectionIdList } from '@/api/doctor'
  import Warning from '../../news/components/Warning'
  import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from '../../news/components/Dropdown/index'
  import ImageCropper from '@/components/ImageCropper'

  const defaultForm = {
    status: 'draft',
    doctorSex: '', // 医生性别
    doctorName: '', // 医生名称
    doctorJob: '', // 职位
    doctorPortrait: '', // 医生头像
    doctorIntro: '', // 医生简介
    sectionId: '', // 所属科室
    mobile: '', // 手机号
    remark: '', // 擅长
    visitingMsg: '', // 就诊信息
    comment_disabled: false,
    importance: 0
  }

  export default {
    name: 'doctorDetail',
    components: { Tinymce, MDinput, Upload, Multiselect, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown, ImageCropper },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateDoctorName = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            // message: rule.field + '为必传项',
            message: '医生名称为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateDoctorSex = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '医生性别为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateDoctorJob = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '医生职位为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateSection = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '科室为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateMobile = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '手机号为必传项',
            type: 'error'
          })
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          if (reg.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确格式的手机号'))
          }
        }
      }
      const validateVisitingMsg = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '就诊日期为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateDoctorIntro = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '医生简介为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateDoctorPortrait = (rule, value, callback) => {
        if (value.length < 1) {
          this.$message({
            message: '医生头像为必传项',
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
        section: [],
        doctorSex: ['男', '女'],
        workTimes: [
          { id: 1, workTimeName: '星期一' },
          { id: 2, workTimeName: '星期二' },
          { id: 3, workTimeName: '星期三' },
          { id: 4, workTimeName: '星期四' },
          { id: 5, workTimeName: '星期五' },
          { id: 6, workTimeName: '星期六' },
          { id: 7, workTimeName: '星期天' }],
        rules: {
          doctorName: [{ required: true, trigger: 'blur', validator: validateDoctorName }],
          doctorSex: [{ required: true, trigger: 'change', validator: validateDoctorSex }],
          doctorJob: [{ required: true, trigger: 'blur', validator: validateDoctorJob }],
          sectionId: [{ required: true, trigger: 'change', validator: validateSection }],
          mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
          visitingMsg: [{ required: true, trigger: 'change', validator: validateVisitingMsg }],
          doctorIntro: [{ required: true, trigger: 'blur', validator: validateDoctorIntro }],
          doctorPortrait: [{ required: true, trigger: 'blur', validator: validateDoctorPortrait }]
        }
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.content_short.length
      },
      imageUrl() {
        return this.postForm.doctorPortrait
      }
    },
    created() {
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        this.fetchData(id)
      } else {
        this.postForm = Object.assign({}, defaultForm)
      }
      this.getList()
    },
    methods: {
      workTimeToString() {
        this.postForm.visitingMsg = this.postForm.visitingMsg.toString()
      },
      rmImage() {
        this.postForm.doctorPortrait = ''
      },
      cropSuccess(resData) {
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        this.postForm.doctorPortrait = resData.data
      },
      close() {
        this.imagecropperShow = false
      },
      fetchData(id) {
        fetchDoctor(id).then(response => {
          console.log(response.data.data)
          this.postForm = response.data.data
        }).catch(err => {
          console.log(err)
        })
      },
      getList() {
        getSectionIdList().then(response => {
          if (!response.data.data) return
          this.section = response.data.data
        }).catch(err => {
          console.log(err)
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          console.log(valid)
          if (valid) {
            this.loading = true
            this.workTimeToString()
            if (this.isEdit) {
              updateDoctor(this.postForm).then(response => {
                this.$notify({
                  title: '成功',
                  message: '更新医生成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(err => {
                console.log(err)
              })
            } else {
              createDoctor(this.postForm).then(response => {
                this.$notify({
                  title: '成功',
                  message: '提交医生成功',
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
    width: 250px;
    height: 350px;
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
