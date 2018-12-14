<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">提交修改</el-button>
      </sticky>

      <div class="createPost-main-container">

        <div class="postInfo-container">

          <el-row>
            <el-col :span="15" style="margin: auto 180px;">
              <el-form-item style="margin-bottom: 40px;" prop="password">
                <el-input  :type="passwordType" v-model="postForm.password" required :maxlength="6" placeholder="请输入新密码">
                  <template slot="prepend">新 密 码</template>
                </el-input>
                <span class="show-pwd" @click="showPwd">
                   <svg-icon icon-class="eye" />
                </span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="15" style="margin: auto 180px;">
              <el-form-item style="margin-bottom: 40px;" prop="confirmPassword">
                <el-input  :type="passwordType" v-model="postForm.confirmPassword" required :maxlength="6" placeholder="请再输入新密码">
                  <template slot="prepend">确认密码</template>
                </el-input>
                <span class="show-pwd" @click="showPwd">
                   <svg-icon icon-class="eye" />
                </span>
              </el-form-item>
            </el-col>
          </el-row>

        </div>

      </div>
    </el-form>
  </div>

</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import MDinput from '@/components/MDinput'
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  import Sticky from '@/components/Sticky' // 粘性header组件
  import { selectByAccount, updatePass } from '@/api/user'

  const defaultForm = {
    account: '', // 账号
    password: '', // 密码
    confirmPassword: '' // 确认密码
  }

  export default {
    name: 'userInfo',
    components: { Tinymce, MDinput, Multiselect, Sticky },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '新密码不能为空',
            type: 'error'
          })
        } else if (value.length !== 6) {
          this.$message({
            message: '密码需要6位',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateConfirmPassword = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '确认密码不能为空',
            type: 'error'
          })
        } else if (value !== this.postForm.password) {
          this.$message({
            message: '密码不一致，请重新输入',
            type: 'error'
          })
        } else {
          callback()
        }
      }

      return {
        postForm: Object.assign({}, defaultForm),
        loading: false,
        passwordType: 'password',
        rules: {
          password: [{ required: true, trigger: 'blur', validator: validatePassword }],
          confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }]
        }
      }
    },
    computed: {
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      fetchData(id) {
        selectByAccount(id).then(response => {
          this.postForm.account = response.data.data.account
        }).catch(err => {
          console.log(err)
        })
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            updatePass(Object.assign({}, { 'account': this.postForm.account, 'password': this.postForm.password })).then(response => {
              // console.log(response)
              if (response.data.success) {
                this.$notify({
                  title: '成功',
                  message: '修改密码成功',
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

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }

</style>
