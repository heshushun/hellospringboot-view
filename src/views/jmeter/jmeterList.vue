<template>
  <div class="app-container yy-card pic-activity">
    <div class="filter-container">

      <el-input  style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.name"></el-input>
      <el-select @change='handleFilter' clearable style="width: 200px" class="filter-item" placeholder="状态" v-model="listQuery.status">
        <el-option v-for="item in isDisableds" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item fr" v-waves style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">新增</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="" border fit highlight-current-row
              style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="别名名称"  width="250">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="JMX名称"  width="250">
        <template slot-scope="scope">
          <span>{{scope.row.jmxName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="200">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" >
        <template slot-scope="scope">
          <span style="width:100px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作"  width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button circle v-if="scope.row.status == 0" type="success" icon="el-icon-error" @click="handleEnable(scope.row)"></el-button>
          <el-button circle v-if="scope.row.status == 1" type="danger" icon="el-icon-success"  @click="handleDisable(scope.row)"></el-button>-->
          <!--<el-button circle type="primary" icon="el-icon-winner-bianji" @click="handleEdit(scope.row)"></el-button>-->
          <el-button  type="success" size="mini" icon="el-icon-star-on" @click="handleTableStartJmx(scope.$index, scope.row)">启动</el-button>
          <el-button  type="danger" size="mini" icon="el-icon-delete" @click="handleTableItemDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <!-- 新增dialog begin -->
    <el-dialog
      :title="textMap[dialogStatus]"
      ref="temp_form"
      :close-on-click-modal="false"
      :close-on-press-escape="isDialogEsc"
      :visible.sync="dialogFormVisible" width="750px" @close="dialogClosed">
      <el-form
        :model="temp_form"
        :rules="rules"
        label-width="80px"
        label-position="left"
        style="width: 700px; margin-left:0; padding: 0 75px 0 25px;"
        ref="temp_form">
        <el-form-item label="别名名称" prop="name">
          <el-input v-model="temp_form.name"  placeholder="请输入名称，2-20个字符"></el-input>
        </el-form-item>
        <el-form-item label="JMX名称" prop="jmxName">
          <el-input v-model="temp_form.jmxName"  placeholder="请输入名称，2-20个字符"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-select v-model="temp_form.status">
            <el-option v-for="item in isDisableds" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="doSave">确 定</el-button>
        <el-button v-else type="primary" @click="doEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增dialog end -->

  </div>
</template>

<script>
  import { jmeterList, deleteById, createJmeter, startJmx } from '@/api/jmeter'
  import waves from '@/directive/waves' // 水波纹指令
  import NProgress from 'nprogress' // progress bar
  import 'nprogress/nprogress.css'// progress bar style

  export default {
    name: 'jmeterList',
    directives: {
      waves
    },
    data() {
      return {
        textMap: {
          edit: '编辑',
          create: '新增'
        },
        // 表单数据
        temp_form: {
          id: '',
          name: '',
          jmxName: '',
          status: ''
        },
        isDisableds: [{ id: '1', name: '启用' }, { id: '0', name: '禁用' }],
        formLabelWidth: '100px',
        dialogFormVisible: false,
        isDialogEsc: true, // dialog可否通过esc按键关闭
        tableKey: 0,
        list: null,
        total: null,
        listLoading: false,
        listQuery: {
          page: 1,
          pageSize: 10,
          status: '',
          name
        },
        dialogStatus: 'create',
        multipleSelection: [],
        rules: {
          name: [
            { required: true, message: '请输入脚本别名', trigger: 'change' }
          ],
          jmxName: [
            { required: true, message: '请输入JMX名称', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ]
        },
        downloadLoading: false
      }
    },
    created() {
      this.queryJmeters()
    },
    methods: {
      queryJmeters() {
        this.listLoading = true
        jmeterList(this.listQuery).then(response => {
          this.list = response.data.data.records
          this.total = response.data.data.total
          this.listLoading = false
        })
      },
      // 选中
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      resetTemp() {
        this.temp_form = {
          id: undefined,
          name: '',
          jmxName: '',
          status: ''
        }
      },
      // 打开保存表单并保存数据
      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.resetTemp()
        this.$nextTick(() => {
          this.$refs['temp_form'].clearValidate()
        })
      },
      doSave() {
        this.$refs['temp_form'].validate((valid) => {
          if (valid) {
            createJmeter(this.temp_form).then(() => {
              this.dialogFormVisible = false
              this.queryJmeters()
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
            })
          }
        })
      },
      // 编辑
      /* handleEdit(row) {
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
        this.resetTemp()
        this.$nextTick(() => {
          this.$refs['temp_form'].clearValidate()
        })
        this.temp_form.id = row.id
        this.temp_form.name = row.name
        this.temp_form.jmxName = row.jmxName
        this.temp_form.status = row.status
      },
      doEdit() {
        this.$refs['temp_form'].validate((valid) => {
          if (valid) {
            hospitalEdit(this.temp_form).then(() => {
              this.dialogFormVisible = false
              this.queryJmeters()
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
            })
          }
        })
      },*/
      /* doEnableOrDisable(param) {
        hospitalEnableOrDisable(param).then(response => {
          this.queryHospitals()
          this.$message({
            type: 'success',
            message: '更新状态成功!'
          })
        })
      },
      handleDisable(row) {
        this.$confirm('确认禁用所选医院?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doEnableOrDisable({
            id: row.id,
            isDisabled: 0
          })
        }).catch(() => {})
      },
      handleEnable(row) {
        this.$confirm('确认启用所选医院?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doEnableOrDisable({
            id: row.id,
            isDisabled: 1
          })
        }).catch(() => {})
      },*/
      // 搜索
      handleFilter() {
        this.listQuery.page = 1
        this.queryJmeters()
      },
      // 改变每页数量
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.queryJmeters()
      },
      // 查询指定页数
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.queryJmeters()
      },
      handleTableItemDelete(index, row) {
        this.$confirm('此操作将删除该条记录, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteById({ id: row.id }).then(() => {
            this.$message.success('删除成功')
            this.queryJmeters()
          }).catch((err) => {
            this.$message.error(err)
          })
        }).catch(() => {})
      },
      handleTableStartJmx(index, row) {
        this.$confirm('是否启动   ' + row.name + '   脚本？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          startJmx({ id: row.id }).then(() => {
            this.$message.success('启动成功')
          }).catch((err) => {
            this.$message.error(err)
          })
        }).catch(() => {})
      },
      dialogClosed() {
        this.resetTemp()
      }

    }

  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .pic-activity{
    .el-upload-dragger{
      width: 520px;
    }
    .el-tabs__header{
      .el-tabs__nav-wrap{
        display: none;
      }
    }
    .el-form-item{
      .el-form-item{
        margin-bottom: 18px
      }
    }
    .ql-toolbar.ql-snow{
      .ql-formats{
        line-height: 24px
      }
    }
    .icon-bg-gray{
      background: #f1f1f1;
    }
    .limit{
      height: 30px;
      border: 1px solid #ccc;
      line-height: 30px;
      text-align: right;
    }
    .limit.error{
      span{
        color: #ee2a7b;
      }
    }
    .limit.limit-fullscreen{
      position: fixed;
      right: 0;
      bottom: 0;
      z-index: 10000;
      text-align: right;
      padding-right: 1em;
      border: none;
    }
    .quill-editor{
      .ql-container{
        height: 180px;
      }
    }
    .act-fullscreen{
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 10000;
      background: #fff;
    }
    .el-form-item{
      margin-bottom: 32px;
      .el-select--medium,.el-input-number--medium{
        width: 100%;
      }
    }
    .border-red{
      border: 1px solid #f56c6c;
    }
  }

  /** 下拉 查看详情 */
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

</style>

