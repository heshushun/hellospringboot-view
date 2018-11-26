<template>
  <div class="app-container">

    <!-- 搜索 与 按钮-->
    <div class="filter-container">

      <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;" class="filter-item" placeholder="ID / 名称" v-model="listQuery.taskName">
      </el-input>


      <el-select @change='handleFilter' clearable style="width: 140px" class="filter-item" placeholder="是否启用" v-model="listQuery.taskStatus">
        <el-option v-for="item in Status" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' clearable style="width: 140px" class="filter-item" placeholder="是否启动" v-model="listQuery.taskOnline">
        <el-option v-for="item in Online" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary"  icon="el-icon-search" >{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-refresh">{{'刷新'}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleDownload"  type="primary" :loading="downloadLoading"  icon="el-icon-download" >{{$t('table.export')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleInit" type="success" icon="el-icon-star-on">{{'初始化'}}</el-button>
    </div>


    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.taskId}}</span>
        </template>
      </el-table-column>

      <el-table-column width="auto" align="center" label="任务名称">
        <template slot-scope="scope">
          <span>{{scope.row.taskName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="任务执行类">
        <template slot-scope="scope">
          <span>{{scope.row.taskExeClass}}</span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="center" label="任务执行方法">
        <template slot-scope="scope">
          <span>{{scope.row.taskExeMethod}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="任务执行时间">
        <template slot-scope="scope">
          <span>{{scope.row.taskCron}}</span>
        </template>
      </el-table-column>

      <el-table-column width="140" align="center" label="启用状态">
        <template slot-scope="scope">
          <!--<span>{{scope.row.taskStatus}}</span>-->
          <el-switch class="switch"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     active-value="1"
                     inactive-value="0"
                     active-text ="ON"
                     inactive-text = "OFF"
                     v-model="scope.row.taskStatus"
                     @change=changeTaskStatus(scope.$index,scope.row)>
          </el-switch>

        </template>
      </el-table-column>

      <el-table-column class-name="status-col"  width="80" align="center" label="启动状态">
        <template slot-scope="scope">
          <!--<span>{{scope.row.taskOnline}}</span>-->
          <el-tag :type="scope.row.taskOnline | statusFilter">{{scope.row.taskOnline == 0 ? ' 否' : '是' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="270">
        <template slot-scope="scope">
          <el-button v-if="scope.row.taskOnline!='1'" size="small" type="success" @click="handleModifyStatus(scope.row,'1')" icon="el-icon-success">Open</el-button>
          <el-button v-if="scope.row.taskOnline!='0'" size="small" type="info" @click="handleModifyStatus(scope.row,'0')" icon="el-icon-error">Close</el-button>
          <el-button type="danger" size="small" @click="deleteById(scope.row.taskId)" icon="el-icon-delete">Del</el-button>
          <router-link :to="'/task/editTask/'+scope.row.taskId">
            <el-button type="primary" size="small" icon="el-icon-edit">Edit</el-button>
          </router-link>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.current"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { taskList, deleteById, updateTaskStatus, updateTaskOnline, initTasks } from '@/api/task'
  import { parseTime } from '@/utils' // 导出

  export default {
    name: 'taskList',
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        Status: [{ id: '1', name: '是' }, { id: '0', name: '否' }],
        Online: [{ id: '1', name: '是' }, { id: '0', name: '否' }],
        taskOnlineStatus: false,
        listQuery: {
          taskStatus: '',
          taskOnline: '',
          taskName: '',
          current: 1,
          limit: 10
        },
        downloadLoading: false
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          '1': 'success',
          '0': 'danger'
        }
        return statusMap[status]
      }
    },
    computed: {
      /* openSwitch() {
        return this.taskOnlineStatus
      }*/
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        taskList(this.listQuery).then(response => {
          // console.log(response.data.data.records)
          this.list = response.data.data.records
          this.total = response.data.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.current = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.current = val
        this.getList()
      },
      handleCreate() {
        this.getList()
      },
      handleInit() {
        initTasks().then(response => {
          if (response.data.success) {
            this.$message({
              message: '初始化启动成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '初始化启动失败',
              type: 'error'
            })
          }
          this.getList()
        }).catch(err => {
          console.log(err)
        })
      },
      changeTaskStatus(index, row) {
        if (row.taskOnline === '0') {
          console.log('index:' + index, 'taskId:' + row.taskId, 'taskStatus:' + row.taskStatus)
          updateTaskStatus(Object.assign({}, { 'taskId': row.taskId, 'taskStatus': row.taskStatus })).then(response => {
            if (row.taskStatus === '1') {
              this.$message({
                message: '启用成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '关闭成功',
                type: 'success'
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          row.taskStatus = '1'
          this.$message({
            message: '任务正在启动，不能直接关闭，需先下线任务',
            type: 'error'
          })
        }
      },
      handleModifyStatus(row, isEnabled) {
        if (row.taskStatus === '1') {
          row.taskOnline = isEnabled
          updateTaskOnline(Object.assign({}, { 'taskId': row.taskId, 'taskOnline': isEnabled })).then(response => {
            if (isEnabled === '1') {
              // this.taskOnlineStatus = true
              this.$message({
                message: '上线成功',
                type: 'success'
              })
            } else {
              // this.taskOnlineStatus = false
              this.$message({
                message: '下线成功',
                type: 'success'
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message({
            message: '非启用任务，无法 【启动】',
            type: 'error'
          })
        }
      },
      deleteById(id) {
        this.$confirm('此操作将永久删除任务 ' + id + '  , 是否继续?', '提示', { type: 'warning' })
          .then(() => {
            deleteById(Object.assign({}, { 'taskId': id })).then(response => {
              this.$notify({
                title: '成功',
                message: '删除任务成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(err => {
              console.log(err)
            })
          }).catch(() => {
          this.$message.info('已取消删除!')
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ID', '任务名称', '任务执行类', '任务执行方法', '任务执行时间', '是否启用', '启动状态']
          const filterVal = ['taskId', 'taskName', 'taskExeClass', 'taskExeMethod', 'taskCron', 'taskStatus', 'taskOnline']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'task-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'ID') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
