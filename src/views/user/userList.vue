<template>
  <div class="app-container">

    <!-- 搜索 与 按钮-->
    <div class="filter-container">


      <el-select @change='handleFilter' clearable style="width: 140px" class="filter-item" placeholder="是否可用" v-model="listQuery.userStatus">
        <el-option v-for="item in Status" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' clearable style="width: 140px" class="filter-item" placeholder="部门" v-model="listQuery.departmentId">
        <el-option v-for="item in department" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' clearable style="width: 140px" class="filter-item" placeholder="性别" v-model="listQuery.sex">
        <el-option v-for="item in sexs" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;" class="filter-item" placeholder="名称/账号" v-model="listQuery.name">
      </el-input>

      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary"  icon="el-icon-search" >{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-refresh">{{'刷新'}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleDownload"  type="primary" :loading="downloadLoading"  icon="el-icon-download" >{{$t('table.export')}}</el-button>
      <!--<el-button class="filter-item" style="margin-left: 10px;" @click="handleInit" type="success" icon="el-icon-star-on">{{'初始化'}}</el-button>-->
    </div>


    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="107px" align="center" label="头像">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.portrait" height="50" width="50" />
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="账号">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="部门">
        <template slot-scope="scope">
          <div v-if="scope.row.departmentId == 1">平台测试部</div>
          <div v-if="scope.row.departmentId == 2">资管测试部</div>
          <div v-if="scope.row.departmentId == 3">经纪测试部</div>
          <div v-if="scope.row.departmentId == 4">银行测试部</div>
          <div v-if="scope.row.departmentId == 5">交易所测试部</div>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="年龄">
        <template slot-scope="scope">
          <span>{{scope.row.age}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex}}</span>
        </template>
      </el-table-column>

      <el-table-column width="auto" align="center" label="微信">
        <template slot-scope="scope">
          <span>{{scope.row.wechat}}</span>
        </template>
      </el-table-column>

      <el-table-column width="140" align="center" label="可用状态">
        <template slot-scope="scope">
          <el-switch class="switch"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     active-value= "1"
                     inactive-value= "0"
                     active-text ="ON"
                     inactive-text = "OFF"
                     v-model="scope.row.userStatus"
                     @change=changeStatus(scope.$index,scope.row)>
          </el-switch>

        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-tooltip  effect="dark" content="删除" placement="top">
            <el-button type="danger" size="mini" @click="deleteById(scope.row.id)" icon="el-icon-delete"></el-button>
          </el-tooltip>
          <router-link :to="'/user/editUser/'+scope.row.id">
            <el-tooltip  effect="dark" content="修改" placement="top">
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            </el-tooltip>
          </router-link>
          <el-tooltip  effect="dark" content="重置密码" placement="top">
            <el-button type="success" size="mini" @click="ResetPassword(scope.row.id)" icon="el-icon-setting"></el-button>
          </el-tooltip>
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
  import { userList, deleteById, updateStatus, resetPassword } from '@/api/user'

  export default {
    name: 'userList',
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        Status: [{ id: '1', name: '是' }, { id: '0', name: '否' }],
        department: [{ id: '1', name: '平台测试部' }, { id: '2', name: '资管测试部' }, { id: '3', name: '经纪测试部' }, { id: '4', name: '银行测试部' }, { id: '5', name: '交易所测试部' }],
        sexs: ['男', '女'],
        listQuery: {
          userStatus: '',
          departmentId: '',
          sex: '',
          name: '',
          current: 1,
          limit: 10
        },
        downloadLoading: false
      }
    },
    computed: {
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        userList(this.listQuery).then(response => {
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
      changeStatus(index, row) {
        // console.log('index:' + index, 'Id:' + row.id, 'Status:' + row.userStatus)
        updateStatus(Object.assign({}, { 'id': row.id, 'userStatus': row.userStatus })).then(response => {
          const resultStatus = response.data.success
          if (row.userStatus === '1' && resultStatus === true) {
            this.$message({
              message: '账号 解冻 成功',
              type: 'success'
            })
          } else if (row.userStatus === '0' && resultStatus === true) {
            this.$message({
              message: '账号 冻结 成功',
              type: 'success'
            })
          } else if (row.userStatus === '0' && resultStatus === false) {
            this.$message({
              message: '冻结失败',
              type: 'error'
            })
            row.userStatus = '1'
          } else if (row.userStatus === '1' && resultStatus === false) {
            this.$message({
              message: '解冻失败',
              type: 'error'
            })
            row.userStatus = '0'
          }
        }).catch(err => {
          console.log(err)
        })
      },
      deleteById(id) {
        this.$confirm('此操作将永久删除用户 ' + id + '  , 是否继续?', '提示', { type: 'warning' })
          .then(() => {
            deleteById(Object.assign({}, { 'id': id })).then(response => {
              this.$notify({
                title: '成功',
                message: '删除用户成功',
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
      ResetPassword(id) {
        this.$confirm('重置该用户 ' + id + '  密码, 是否继续?', '提示', { type: 'warning' })
          .then(() => {
            resetPassword(Object.assign({}, { 'id': id })).then(response => {
              this.$notify({
                title: '成功',
                message: '重置密码成功',
                type: 'success',
                duration: 2000
              })
              // this.getList()
            }).catch(err => {
              console.log(err)
            })
          }).catch(() => {
            this.$message.info('已取消操作!')
          })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ID', '账号', '用户名', '年龄', '微信', '头像', '性别', '错误剩余数', '可用状态']
          const filterVal = ['id', 'account', 'name', 'age', 'wechat', 'portrait', 'sex', 'maxError', 'userStatus']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'user-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
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
