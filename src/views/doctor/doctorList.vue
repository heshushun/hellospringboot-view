<template>
  <div class="app-container">

    <!-- 搜索 与 按钮-->
    <div class="filter-container">

      <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;" class="filter-item" placeholder="姓名" v-model="listQuery.doctorName">
      </el-input>

      <el-select @change='handleFilter' clearable style="width: 130px" class="filter-item" v-model="listQuery.doctorSex" placeholder="性别">
        <el-option v-for="item in doctorSexs"  :label="item" :value="item">
        </el-option>
      </el-select>

      <el-select  @change='handleFilter' clearable style="width: 140px" class="filter-item" placeholder="科室" v-model="listQuery.sectionId">
        <el-option v-for="item in section" :key="item.id" :label="item.sectionName" :value="item.id">
        </el-option>
      </el-select>

      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter"  type="primary"  icon="el-icon-search" >{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-refresh">{{'刷新'}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleDownload"  type="primary" :loading="downloadLoading"  icon="el-icon-download" >{{$t('table.export')}}</el-button>

    </div>




    <el-table :data="list" v-loading.body="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="107px" align="center" label="医生头像">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.doctorPortrait" height="50" width="50" />
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="医生名称">
        <template slot-scope="scope">
          <span>{{scope.row.doctorName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="60px" align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.doctorSex}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="职位">
        <template slot-scope="scope">
          <span>{{scope.row.doctorJob}}</span>
        </template>
      </el-table-column>

      <el-table-column width="107px" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="所属科室">
        <template slot-scope="scope">
          <span>{{scope.row.sectionName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="auto" align="center" label="医生简介">
        <template slot-scope="scope">
          <span style="width:300px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{scope.row.doctorIntro}}</span>
        </template>
      </el-table-column>



      <el-table-column align="center" label="操作" width="207">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="deleteById(scope.row.id)" icon="el-icon-delete">Delete</el-button>
          <router-link :to="'/doctor/editDoctor/'+scope.row.id">
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
  import { doctorList, deleteById, getSectionIdList } from '@/api/doctor'
  import { parseTime } from '@/utils' // 导出

  export default {
    name: 'doctorList',
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        section: [],
        doctorSexs: ['男', '女'],
        listQuery: {
          current: 1,
          limit: 10,
          doctorName: '',
          doctorSex: '',
          sectionId: ''
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
      this.getSectionIdList()
    },
    methods: {
      getList() {
        this.listLoading = true
        doctorList(this.listQuery).then(response => {
          // console.log(response.data.data.records)
          this.list = response.data.data.records
          this.total = response.data.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      getSectionIdList() {
        getSectionIdList().then(response => {
          this.section = response.data.data
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
        this.$confirm('此操作将永久删除医生 ' + id + '  , 是否继续?', '提示', { type: 'warning' })
          .then(() => {
            deleteById(Object.assign({}, { 'doctorId': id })).then(response => {
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
          const tHeader = ['ID', '医生姓名', '性别', '职位', '手机号', '医生简介', '所属科室']
          const filterVal = ['id', 'doctorName', 'doctorSex', 'doctorJob', 'mobile', 'doctorIntro', 'sectionName']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'doctor-list'
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
