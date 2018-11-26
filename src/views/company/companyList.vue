<template>
  <div class="app-container">

    <!-- 搜索 与 按钮-->
    <div class="filter-container">

      <el-input @keyup.enter.native="handleFilter" clearable style="width: 200px;" class="filter-item" placeholder="股票代码 / 名称" v-model="listQuery.name">
      </el-input>


      <el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" placeholder="所属省" v-model="listQuery.province">
        <el-option v-for="item in provinceList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' clearable style="width: 300px" class="filter-item" placeholder="所属行业" v-model="listQuery.industry">
        <el-option v-for="item in industryList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary"  icon="el-icon-search" >{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-refresh">{{'刷新'}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleDownload"  type="primary" :loading="downloadLoading"  icon="el-icon-download" >{{$t('table.export')}}</el-button>

    </div>


    <el-table :data="list"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="股票代码" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.stockCode}}</span>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" width="200px" align="center" label="公司名称">
        <template slot-scope="scope">
          <span >{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="公司简称">
        <template slot-scope="scope">
          <span>{{scope.row.abbrName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="所属省">
        <template slot-scope="scope">
          <span>{{scope.row.province}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="所属城市">
        <template slot-scope="scope">
          <span>{{scope.row.city}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="上市日期">
        <template slot-scope="scope">
          <span>{{scope.row.listedDate}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80" align="center" label="发行价">
        <template slot-scope="scope">
          <span>{{scope.row.issuePrice}}元</span>
        </template>
      </el-table-column>

      <el-table-column  width="120" align="center" label="所属行业">
        <template slot-scope="scope">
          <span style="width:120px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;" >{{scope.row.industry}}</span>
        </template>
      </el-table-column>

      <el-table-column   width="auto" align="center" label="经营范围">
        <template slot-scope="scope">
          <!--<el-tooltip placement="top">
            <div slot="content">{{scope.row.businessMajor}}</div>
            <span style="width:200px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;" >{{scope.row.businessMajor}}</span>
          </el-tooltip>-->
          <span style="width:200px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{scope.row.businessMajor}}</span>
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="操作" width="270">
        <template slot-scope="scope">
          <el-button v-if="scope.row.taskOnline!='1'" size="small" type="success" @click="handleModifyStatus(scope.row,'1')" icon="el-icon-success">Open</el-button>
          <el-button v-if="scope.row.taskOnline!='0'" size="small" type="info" @click="handleModifyStatus(scope.row,'0')" icon="el-icon-error">Close</el-button>
          <el-button type="danger" size="small" @click="deleteById(scope.row.taskId)" icon="el-icon-delete">Del</el-button>
          <router-link :to="'/task/editTask/'+scope.row.taskId">
            <el-button type="primary" size="small" icon="el-icon-edit">Edit</el-button>
          </router-link>
        </template>
      </el-table-column>-->

    </el-table>


    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.current"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { companyList, industryList } from '@/api/company'
  import { parseTime } from '@/utils' // 导出

  export default {
    name: 'companyList',
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        provinceList: ['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '台湾', '香港', '澳门'],
        industryList: [],
        listQuery: {
          province: '',
          industry: '',
          name: '',
          current: 1,
          limit: 10
        },
        downloadLoading: false
      }
    },
    computed: {
      /* openSwitch() {
        return this.taskOnlineStatus
      }*/
    },
    created() {
      this.getList()
      this.getIndustryList()
    },
    methods: {
      getList() {
        this.listLoading = true
        companyList(this.listQuery).then(response => {
          // console.log(response.data.data.records)
          this.list = response.data.data.records
          this.total = response.data.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      getIndustryList() {
        industryList().then(response => {
          // console.log(response.data.data)
          this.industryList = response.data.data
          // console.log(this.industry)
        }).catch(() => {
          this.$message({
            message: '行业列表加载失败...',
            type: 'error'
          })
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
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['股票代码', '公司名称', '公司简称', '所属省', '所属城市', '上市日期', '发行价', '所属行业', '经营范围']
          const filterVal = ['stockCode', 'name', 'abbrName', 'province', 'city', 'listedDate', 'issuePrice', 'industry', 'businessMajor']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'company-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === '股票代码') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>

<style>

  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }

  /*.el-tooltip__popper.is-dark{
    width: 300px !important;
    background-color: #68af40;
  }*/

</style>
