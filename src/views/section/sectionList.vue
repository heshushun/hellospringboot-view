<template>
  <div class="app-container">

    <!-- 搜索 与 按钮-->
    <div class="filter-container">

      <el-input @keyup.enter.native="handleFilter" clearable style="width: 300px;" class="filter-item" placeholder="科室名称/位置" v-model="listQuery.sectionName">
      </el-input>


      <el-select  @change='handleFilter' clearable style="width: 140px" class="filter-item" placeholder="科室类别" v-model="listQuery.sectionType">
        <el-option v-for="item in sectionType" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary"  icon="el-icon-search" >{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-refresh">{{'刷新'}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleDownload"  type="primary" :loading="downloadLoading"  icon="el-icon-download" >{{$t('table.export')}}</el-button>

    </div>


    <el-table :data="list" v-loading.body="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="40">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="137px" align="center" label="科室名称">
        <template slot-scope="scope">
          <span>{{scope.row.sectionName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="科室简介">
        <template slot-scope="scope">
          <span style="width:300px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{scope.row.sectionSummary}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="科室类型">
        <template slot-scope="scope">
          <span>{{scope.row.sectionType}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="科室位置">
        <template slot-scope="scope">
          <span>{{scope.row.sectionAddress}}</span>
        </template>
      </el-table-column>

      <el-table-column width="auto" align="center" label="科室内容">
        <template slot-scope="scope">
          <span style="width:300px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{scope.row.sectionContent}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="207">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="deleteById(scope.row.id)" icon="el-icon-delete">Delete</el-button>
          <router-link :to="'/section/editSection/'+scope.row.id">
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
  import { sectionList, deleteById } from '@/api/section'
  import { parseTime } from '@/utils' // 导出

  export default {
    name: 'sectionList',
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        sectionType: [{ id: 1, name: '非手术科室' }, { id: 2, name: '手术科室' }, { id: 3, name: '诊断相关科室' }],
        listQuery: {
          sectionName: '',
          sectionType: '',
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
    },
    methods: {
      getList() {
        this.listLoading = true
        sectionList(this.listQuery).then(response => {
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
      deleteById(id) {
        this.$confirm('此操作将永久删除科室 ' + id + '  , 是否继续?', '提示', { type: 'warning' })
          .then(() => {
            deleteById(Object.assign({}, { 'sectionId': id })).then(response => {
              this.$notify({
                title: '成功',
                message: '删除科室成功',
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
          const tHeader = ['ID', '科室名称', '科室简介', '科室类型', '科室位置', '科室内容']
          const filterVal = ['id', 'sectionName', 'sectionSummary', 'sectionType', 'sectionAddress', 'sectionContent']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'section-list'
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
