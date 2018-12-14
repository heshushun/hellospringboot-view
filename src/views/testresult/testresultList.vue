<template>
  <div class="app-container">

    <!-- 搜索 与 按钮-->
    <div class="filter-container">

      <el-select @change='handleFilter' clearable style="width: 200px" class="filter-item" placeholder="项目" v-model="listQuery.project">
        <el-option v-for="item in projectList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" placeholder="响应码" v-model="listQuery.responceCode">
        <el-option v-for="item in responceCodeList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" placeholder="断言状态" v-model="listQuery.status">
        <el-option v-for="item in statusList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;" class="filter-item" placeholder="输入：时间戳" v-model="listQuery.group1">
      </el-input>

      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary"  icon="el-icon-search" >{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-refresh">{{'刷新'}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleDownload"  type="primary" :loading="downloadLoading"  icon="el-icon-download" >{{$t('table.export')}}</el-button>
     <!-- <el-button class="filter-item" style="margin-left: 10px;" @click="exportExcel"  type="primary"   icon="el-icon-download" >{{$t('table.export')}}2</el-button>-->
    </div>


    <el-table :data="list"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="50px" v-if="this.show">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="项目名称" width="120px">
        <template slot-scope="scope">
          <span style="width:120px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{scope.row.project}}</span>
        </template>
      </el-table-column>

      <el-table-column width="70px" align="center" label="功能号">
        <template slot-scope="scope">
          <span >{{scope.row.functionId}}</span>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" width="200px" align="center" label="请求描述">
        <template slot-scope="scope">
          <span style="width:200px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{scope.row.requestMsg}}</span>
        </template>
      </el-table-column>

      <el-table-column  width="auto"  align="center" label="预期结果">
        <template slot-scope="scope">
          <span style="width:120px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{scope.row.expectResult}}</span>
        </template>
      </el-table-column>

      <el-table-column width="auto" align="center" label="响应结果">
        <template slot-scope="scope">
          <span style="width:120px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{scope.row.responceResult}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="响应码">
        <template slot-scope="scope">
          <span>{{scope.row.responceCode}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="断言">
        <template slot-scope="scope">
          <!--<span>{{scope.row.status}}</span>-->
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status === 'fail' ? ' 失败' : '通过' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column  width="130" align="center" label="时间戳">
        <template slot-scope="scope">
          <span>{{scope.row.group1}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="115">
        <template slot-scope="scope">
          <!--<el-button type="danger" size="mini" @click="deleteById(scope.row.id)" icon="el-icon-tickets" ></el-button>-->
          <router-link :to="'/testresult/testresultDetail/'+scope.row.id">
            <el-tooltip  effect="dark" content="详情" placement="top">
              <el-button type="primary" size="mini" icon="el-icon-tickets" ></el-button>
            </el-tooltip>
          </router-link>
          <router-link :to="'/testresult/compareTestresult/'+scope.row.id">
            <el-tooltip  effect="dark" content="比对" placement="top">
              <el-button type="success" size="mini" icon="el-icon-view" ></el-button>
            </el-tooltip>
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
  import { testresultList, projectList, exportTestResult, getExportList } from '@/api/testresult'
  import { parseTime } from '@/utils' // 导出
  // import axios from 'axios'

  export default {
    name: 'testresultList',
    data() {
      return {
        show: false,
        list: null,
        total: 0,
        listLoading: true,
        exportList: null,
        projectList: [],
        responceCodeList: ['200', '500', '404', '503', '403'],
        statusList: ['pass', 'fail'],
        listQuery: {
          group1: '',
          project: '',
          responceCode: '',
          status: '',
          current: 1,
          limit: 10
        },
        downloadLoading: false
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          'pass': 'success',
          'fail': 'danger'
        }
        return statusMap[status]
      }
    },
    computed: {

    },
    created() {
      this.getList()
      this.getProjectList()
      this.getExportList()
    },
    methods: {
      getList() {
        this.listLoading = true
        testresultList(this.listQuery).then(response => {
          // console.log(response.data.data.records)
          this.list = response.data.data.records
          this.total = response.data.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      getProjectList() {
        projectList().then(response => {
          this.projectList = response.data.data
        }).catch(() => {
          this.$message({
            message: '项目列表加载失败...',
            type: 'error'
          })
        })
      },
      getExportList() {
        getExportList(Object.assign({}, { 'group1': this.listQuery.group1, 'project': this.listQuery.project,
          'responceCode': this.listQuery.responceCode, 'status': this.listQuery.status })).then(response => {
          this.exportList = response.data.data
        }).catch(() => {
          this.$message({
            message: '导出数据获取失败...',
            type: 'error'
          })
        })
      },
      handleFilter() {
        this.listQuery.current = 1
        this.getList()
        this.getExportList()
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
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['项目名称', '功能号', '请求描述', '预期结果', '响应结果', '响应码', '断言状态', '时间戳']
          const filterVal = ['project', 'functionId', 'requestMsg', 'expectResult', 'responceResult', 'responceCode', 'status', 'group1']
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '自动化测试结果'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'abc') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      exportExcel() {
        // this.downloadLoading = true
        exportTestResult({ 'fileName': 'testresult-list', 'group1': this.listQuery.group1, 'project': this.listQuery.project,
          'responceCode': this.listQuery.responceCode, 'status': this.listQuery.status }).then((res) => {
          // console.log(res)
          const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = 'test.xls'
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }

 /*.el-tooltip__popper.is-dark{
    width: 50px !important;
    background-color: #68af40;
  }*/

</style>
