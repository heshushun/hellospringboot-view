<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">提交</el-button>
      </sticky>

      <div class="createPost-main-container">

        <div class="postInfo-container">
          <el-row>
            <el-col :span="21">
              <el-form-item  label-width="100px" label="是否启用：" prop="taskStatus" class="postInfo-container-item">
                <el-select v-model="postForm.taskStatus"  clearable filterable remote placeholder="是否启用">
                  <el-option v-for="item in taskStatus" :key="item.id"  :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-row>
          <el-col :span="21">

            <el-form-item style="margin-bottom: 40px;" prop="taskName">
              <MDinput name="taskName" v-model="postForm.taskName"  required :maxlength="100">
                任务名称
              </MDinput>
            </el-form-item>

            <el-form-item style="margin-bottom: 40px;" prop="taskExeClass">
              <MDinput name="taskExeClass" v-model="postForm.taskExeClass"  required :maxlength="100">
                执行类
              </MDinput>
            </el-form-item>

            <el-form-item style="margin-bottom: 40px;" prop="taskExeMethod" >
              <MDinput name="taskExeMethod" v-model="postForm.taskExeMethod"  required :maxlength="50">
                执行方法
              </MDinput>
            </el-form-item>

            <el-form-item style="margin-bottom: 40px;" prop="taskCron" >
              <MDinput name="taskCron" v-model="postForm.taskCron"  required :maxlength="50">
                执行时间
              </MDinput>
            </el-form-item>

          </el-col>
        </el-row>

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
  import { createTask, fetchTask, updateTask } from '@/api/task'

  const defaultForm = {
    taskName: '', // 任务名
    taskExeClass: '', // 执行类
    taskExeMethod: '', // 执行方法
    taskCron: '', // 执行时间
    taskStatus: '' // 是否启用
  }

  export default {
    name: 'taskDetail',
    components: { Tinymce, MDinput, Multiselect, Sticky },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateTaskName = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '任务名为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateTaskExeMethod = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '任务执行方法为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateTaskExeClass = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '任务执行类为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateTaskCron = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '任务执行时间为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }
      const validateTaskStatus = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: '任务是否启用为必传项',
            type: 'error'
          })
        } else {
          callback()
        }
      }

      return {
        postForm: Object.assign({}, defaultForm),
        loading: false,
        taskStatus: [{ id: '1', name: '是' }, { id: '0', name: '否' }],
        rules: {
          taskName: [{ required: true, trigger: 'blur', validator: validateTaskName }],
          taskExeClass: [{ required: true, trigger: 'blur', validator: validateTaskExeClass }],
          taskExeMethod: [{ required: true, trigger: 'blur', validator: validateTaskExeMethod }],
          taskCron: [{ required: true, trigger: 'blur', validator: validateTaskCron }],
          taskStatus: [{ required: true, trigger: 'change', validator: validateTaskStatus }]
        }
      }
    },
    computed: {
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
        fetchTask(id).then(response => {
          this.postForm = response.data.data
        }).catch(err => {
          console.log(err)
        })
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            if (this.isEdit) {
              updateTask(this.postForm).then(response => {
                console.log(response)
                if (response.data.success) {
                  this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                  })
                }
              }).catch(err => {
                console.log(err)
              })
            } else {
              createTask(this.postForm).then(response => {
                if (response.data.success) {
                  this.$notify({
                    title: '成功',
                    message: '提交成功',
                    type: 'success',
                    duration: 2000
                  })
                }
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
</style>
