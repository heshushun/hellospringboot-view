<template>
  <div class="app-container">

    <!-- 搜索 与 按钮-->
    <div class="filter-container">

      <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.noticeTitle">
      </el-input>

      <el-date-picker v-model="listQuery.beginTime" clearable type="date" class="filter-item" format="yyyy-MM-dd" placeholder="大于时间">
      </el-date-picker>

      <el-date-picker v-model="listQuery.endTime" clearable type="date" class="filter-item" format="yyyy-MM-dd" placeholder="小于时间">
      </el-date-picker>

      <el-select @change='handleFilter' clearable style="width: 140px" class="filter-item" placeholder="阅读量排序" v-model="listQuery.viewCountType">
        <el-option v-for="item in viewCountType" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary"  icon="el-icon-search" >{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-refresh">{{'刷新'}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleDownload"  type="primary" :loading="downloadLoading"  icon="el-icon-download" >{{$t('table.export')}}</el-button>

    </div>


    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="标题">
        <template slot-scope="scope">
          <span>{{scope.row.noticeTitle}}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{scope.row.noticeAuthor}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{scope.row.noticeCreateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="阅读量">
        <template slot-scope="scope">
          <span>{{scope.row.noticeViewCount}}</span>
        </template>
      </el-table-column>

      <el-table-column width="auto" align="left" label="内容">
        <template slot-scope="scope">
          <span style="width:300px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{scope.row.noticeContent}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="207">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="deleteById(scope.row.id)" icon="el-icon-delete">Delete</el-button>
          <router-link :to="'/notice/editNotice/'+scope.row.id">
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
  import { noticeList, deleteById } from '@/api/notice'
  import { parseTime } from '@/utils' // 导出

  export default {
    name: 'noticeList',
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        viewCountType: [{ id: '1', name: '阅读量倒序' }, { id: '2', name: '阅读量正序' }],
        listQuery: {
          noticeTitle: '',
          beginTime: '',
          viewCountType: '',
          endTime: '',
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
        noticeList(this.listQuery).then(response => {
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
        this.$confirm('此操作将永久删除公告 ' + id + '  , 是否继续?', '提示', { type: 'warning' })
          .then(() => {
            deleteById(Object.assign({}, { 'noticeId': id })).then(response => {
              this.$notify({
                title: '成功',
                message: '删除文章成功',
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
          const tHeader = ['编号', '公告标题', '公告作者', '发布日期', '阅读量']
          const filterVal = ['id', 'noticeTitle', 'noticeAuthor', 'noticeCreateTime', 'noticeViewCount']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'notice-list'
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
