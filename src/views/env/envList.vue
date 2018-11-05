<template>
  <div class="app-container">

    <!-- 搜索 与 按钮-->
    <div class="filter-container">

      <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.envName">
      </el-input>

      <el-select @change='handleFilter' clearable style="width: 140px" class="filter-item" placeholder="是否可用" v-model="listQuery.isEnable">
        <el-option v-for="item in isEnable" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' clearable style="width: 140px" class="filter-item" placeholder="环境类型" v-model="listQuery.envType">
        <el-option v-for="item in envType" :key="item.itemCode" :label="item.itemName" :value="item.itemCode">
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

      <el-table-column width="120px" align="center" label="环境名称">
        <template slot-scope="scope">
          <span>{{scope.row.envName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="环境类型">
        <template slot-scope="scope">
          <span>{{scope.row.envType}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="是否可用">
        <template slot-scope="scope">
          <span>{{scope.row.isEnable == 0 ? ' 否' : '是' }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="环境预览">
        <template slot-scope="scope">
          <!--<span style="width:300px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{scope.row.envUrl}}</span>-->
          <img v-bind:src="scope.row.envUrl" height="70" width="140" />
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="207">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="deleteById(scope.row.id)" icon="el-icon-delete">Delete</el-button>
          <router-link :to="'/env/editEnv/'+scope.row.id">
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
  import { fetchList, deleteById } from '@/api/env'
  import { getDictItems } from '@/api/dict'
  import { parseTime } from '@/utils' // 导出

  export default {
    name: 'envList',
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        envType: [],
        isEnable: [{ id: 1, name: '是' }, { id: 0, name: '否' }],
        listQuery: {
          envName: '',
          envType: '',
          isEnable: '',
          current: 1,
          limit: 10
        },
        downloadLoading: false
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
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
          console.log('this.listLoading' + this.listLoading)
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
      deleteById(id) {
        this.$confirm('此操作将永久删除环境 ' + id + '  , 是否继续?', '提示', { type: 'warning' })
          .then(() => {
            deleteById(Object.assign({}, { 'envId': id })).then(response => {
              this.$notify({
                title: '成功',
                message: '删除环境成功',
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
          const tHeader = ['ID', '环境名称', '环境类型', '创建时间', '是否可用', '环境地址']
          const filterVal = ['id', 'envName', 'envType', 'createTime', 'isEnable', 'envUrl']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'env-list'
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
