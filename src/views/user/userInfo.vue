<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">提交修改</el-button>
      </sticky>

      <div class="createPost-main-container">

        <div class="postInfo-container">

          <el-row>
            <el-col :span="10" style="margin-right: 40px;">
              <el-form-item style="margin-bottom: 40px;" prop="account">
                <el-input :disabled="true"  v-model="postForm.account" required :maxlength="20">
                  <template slot="prepend">账号</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item style="margin-bottom: 40px;" prop="name">
                <el-input v-model="postForm.name" required :maxlength="40">
                  <template slot="prepend">用户名</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10" style="margin-right: 40px;">
              <el-form-item style="margin-bottom: 40px;" prop="age">
                <el-input  v-model="postForm.age" required :maxlength="20">
                  <template slot="prepend">年龄</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item style="margin-bottom: 40px;" prop="wechat">
                <el-input  v-model="postForm.wechat" required :maxlength="40">
                  <template slot="prepend">微信</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10" style="margin-right: 40px;">
              <el-form-item style="margin-bottom: 40px;" prop="account">
                <el-select v-model="postForm.sex"  clearable filterable remote placeholder="性别">
                  <el-option v-for="item in sexs" :key="item"  :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item style="margin-bottom: 40px;" prop="departmentId">
                <el-select v-model="postForm.departmentId"  clearable filterable remote placeholder="部门">
                  <el-option v-for="item in department" :key="item.id"  :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

        </div>

        <div style="margin-top: 20px; " class="upload">
          <el-form-item>
            <el-button type="primary" icon="upload" style="position: absolute;margin-left: 0px;" @click="imagecropperShow=true">上传头像
            </el-button>
          </el-form-item>
        </div>
        <el-form-item  prop="portrait">
          <div class="image-preview">
            <div class="image-preview-wrapper" v-show="imageUrl.length>1">
              <img :src="imageUrl" v-model="postForm.portrait" >
              <div class="image-preview-action">
                <i @click="rmImage" class="el-icon-delete"></i>
              </div>
            </div>
          </div>
          <!--<image-cropper :width="300" :height="300" url="http://127.0.0.1:7003/img/upload" @close='close' @crop-upload-success="cropSuccess" langType="en"
                         :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>-->
          <image-cropper :width="300" :height="300" url="http://10.20.65.161:7003/img/upload" @close='close' @crop-upload-success="cropSuccess" langType="en"
                         :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>
        </el-form-item>


      </div>
    </el-form>
  </div>

</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import MDinput from '@/components/MDinput'
  import Upload from '@/components/Upload/singleImage3'
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  import Sticky from '@/components/Sticky' // 粘性header组件
  import { selectByAccount, updateUser } from '@/api/user'
  import ImageCropper from '@/components/ImageCropper'

  const defaultForm = {
    account: '', // 账号
    name: '', // 用户名
    password: '', // 密码
    sex: '', // 性别
    departmentId: '', // 部门
    age: '', // 年龄
    wechat: '', // 微信
    portrait: '' // 头像
  }

  export default {
    name: 'userInfo',
    components: { Tinymce, MDinput, Multiselect, Sticky, ImageCropper, Upload },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateName = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '用户名为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateDepartmentId = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '部门为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validatePortrait = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '头像为必传项',
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
        department: [{ id: '1', name: '平台测试部' }, { id: '2', name: '资管测试部' }, { id: '3', name: '经纪测试部' }, { id: '4', name: '银行测试部' }, { id: '5', name: '交易所测试部' }],
        sexs: ['男', '女'],
        rules: {
          name: [{ required: true, trigger: 'blur', validator: validateName }],
          departmentId: [{ required: true, trigger: 'blur', validator: validateDepartmentId }],
          portrait: [{ required: true, trigger: 'change', validator: validatePortrait }]
        }
      }
    },
    computed: {
      imageUrl() {
        return this.postForm.portrait
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    },
    methods: {
      rmImage() {
        this.postForm.portrait = ''
      },
      cropSuccess(resData) {
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        this.postForm.portrait = resData.data
      },
      close() {
        this.imagecropperShow = false
      },
      fetchData(id) {
        selectByAccount(id).then(response => {
          this.postForm = response.data.data
          this.postForm.departmentId = this.department[this.postForm.departmentId - 1].id
        }).catch(err => {
          console.log(err)
        })
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            updateUser(this.postForm).then(response => {
              // console.log(response)
              if (response.data.success) {
                this.$notify({
                  title: '成功',
                  message: '修改资料成功',
                  type: 'success',
                  duration: 2000
                })
              }
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
    width: 300px;
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
