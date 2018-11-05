<template>
  <div class="app-container">

    <!-- 搜索 与 按钮-->
    <div class="filter-container">

      <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;" class="filter-item" placeholder="备注" v-model="listQuery.remark">
      </el-input>

      <el-select @change='handleFilter' clearable style="width: 140px" class="filter-item" placeholder="是否开启" v-model="listQuery.isEnabled">
        <el-option v-for="item in isEnabled" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary"  icon="el-icon-search" >{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-refresh">{{'刷新'}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleDownload"  type="primary" :loading="downloadLoading"  icon="el-icon-download" >{{$t('table.export')}}</el-button>

    </div>


    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="编号" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="banner图片">
        <template slot-scope="scope">
          <!--<span style="width:300px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{scope.row.bannerUrl}}</span>-->
          <img v-bind:src="scope.row.bannerUrl" height="60" width="120" />
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="是否已开启" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isEnabled | statusFilter">{{scope.row.isEnabled == 0 ? ' 否' : '是' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="auto" align="center" label="备注">
        <template slot-scope="scope">
          <span style="width:300px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{scope.row.remark}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="207">
        <template slot-scope="scope">
          <el-button size="small" type="danger" @click="deleteById(scope.row.id)" icon="el-icon-delete">Delete</el-button>
          <el-button v-if="scope.row.isEnabled!='1'" size="small" type="success" @click="handleModifyStatus(scope.row,'1')" icon="el-icon-success">Open</el-button>
          <el-button v-if="scope.row.isEnabled!='0'" size="small" type="info" @click="handleModifyStatus(scope.row,'0')" icon="el-icon-error">Close</el-button>
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
  import { fetchList, deleteById, updateStatus } from '@/api/banner'
  import { getDictItems } from '@/api/dict'
  import { parseTime } from '@/utils' // 导出

  export default {
    name: 'bannerList',
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        isEnabled: [{ id: 1, name: '是' }, { id: 0, name: '否' }],
        listQuery: {
          isEnabled: '',
          remark: '',
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
    created() {
      this.getList()
      this.getDictItems()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          // console.log(response.data.data.records)
          this.list = response.data.data.records
          this.total = response.data.data.total
          this.listLoading = false
          // console.log('this.listLoading' + this.listLoading)
        }).catch(() => {
          this.listLoading = false
        })
      },
      getDictItems() {
        getDictItems(4).then(response => {
          this.envType = response.data.data
        }).catch(err => {
          console.log(err)
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
      handleModifyStatus(row, isEnabled) {
        row.isEnabled = isEnabled
        updateStatus(Object.assign({}, { 'bannerId': row.id, 'isEnabled': isEnabled })).then(response => {
          if (isEnabled === '1') {
            this.$message({
              message: '开启成功',
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
      },
      deleteById(id) {
        this.$confirm('此操作将永久删除banner图 ' + id + '  , 是否继续?', '提示', { type: 'warning' })
          .then(() => {
            deleteById(Object.assign({}, { 'bannerId': id })).then(response => {
              this.$notify({
                title: '成功',
                message: '删除banner图成功',
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
          const tHeader = ['ID', '创建时间', '是否可用', '地址']
          const filterVal = ['id', 'createTime', 'isEnabled', 'bannerUrl']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'banner-list'
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
