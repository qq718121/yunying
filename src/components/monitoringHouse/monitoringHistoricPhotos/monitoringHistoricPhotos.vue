<template>
  <div class="managers">
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>

    <div style="padding:20px">

      <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
        <el-col :span="22">
          <el-form :inline="true" style="" :model="filterForm" class="demo-form-inline">

            <el-form-item label="楼盘id">
              <el-input size="small" v-model="filterForm.id" style="width:80px" placeholder="id"></el-input>
            </el-form-item>

            <!--<el-form-item label="区域">-->
            <!--<ThreeCity-->
            <!--:isShowArea="true"-->
            <!--url="/citis/cityLists"-->
            <!--:_province.sync="filterForm.pid"-->
            <!--:_city.sync="filterForm.cid"-->
            <!--:_area.sync="filterForm.areaId"/>-->
            <!--</el-form-item>-->
            <el-form-item label="区域">
              <!--<MjbArea-->
              <!--:isShowArea="true"-->
              <!--:_province.sync="filterForm.pid"-->
              <!--:_city.sync="filterForm.cid"-->
              <!--:_area.sync="filterForm.areaId"/>-->
              <el-select size="small" style="width: 150px" v-model="filterForm.province" @change="f_provinceIds" clearable placeholder="省">
                <el-option v-for="item in provinceIdsList" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
              <el-select size="small" style="width: 150px" v-model="filterForm.city" clearable @change="f_cityIds" placeholder="市">
                <el-option v-for="item in cityIdsList" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
              <el-select size="small" style="width: 150px" v-model="filterForm.area" clearable @change="f_areaIds" placeholder="区">
                <el-option v-for="item in areaIdsList" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="楼盘名称">
              <MjbBuildingSearch :_buildingName.sync="filterForm.buildingName" :_buildingName2="filterForm.replaceGetBuildingNameList" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2" style="text-align:right">
          <el-button type="primary" @click="onSearchSubmit">查询</el-button>
        </el-col>
      </el-row>

      <div class="tabletopbar">
        <span style="margin-left:20px">查询结果：共</span>
        <span style="color:#111">{{tableData.pageCount}}</span>
        <span>条</span>
      </div>
      <el-table v-loading="tabLoading" :data="tableData.buildingList" border tooltip-effect="dark" style="width: 100%;font-size:12px!important;">
        <el-table-column prop="id" label="ID" width="80">
        </el-table-column>
        <el-table-column prop="name" label="楼盘名" min-width="80">
        </el-table-column>
        <el-table-column prop="fullName" label="所在地区" min-width="80">
        </el-table-column>
        <el-table-column prop="stageCount" label="规划期数" min-width="80">
        </el-table-column>
        <el-table-column prop="imgcount" min-width="60" label="待审核数据（条）">
        </el-table-column>
        <el-table-column prop="timgcount" min-width="60" label="已通过数据（条）">
        </el-table-column>
        <el-table-column prop="wimgcount" min-width="60" label="未通过数据（条）">
        </el-table-column>
        <el-table-column prop="mjbBuildingId" min-width="60" label="对应楼盘ID">
        </el-table-column>
        <el-table-column prop="mjbBuildingName" min-width="60" label="对应楼盘名称">
        </el-table-column>
        <el-table-column prop="mjbCity" min-width="60" label="对应城市">
        </el-table-column>
        <el-table-column min-width="190" label="操作">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row,'',0)">
              <span>审核</span>
            </el-button>
            <el-button size="small" @click="handleEdit(scope.$index, scope.row,'',1)">
              <span>上传照片</span>
            </el-button>
            <el-button size="small" @click="openEdit(scope.$index, scope.row,'',1)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-show="tableData.pageCount>0" style="margin: 0 auto;text-align:center;margin-top:20px" layout="prev, pager, next,jumper" :page-size=10 :currentPage="currentPage" @current-change="currentChange" :total="tableData.pageCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Subnav2 from "../../Subnav2/Subnav2";
import message from "../../../common/message";
import MjbArea from "../../Common/MjbArea/MjbArea";
import MjbBuildingSearch from "../../Common/MjbBuildingSearch/MjbBuildingSearch";
export default {
  name: "managers",
  components: {
    Subnav2,
    MjbArea,
    MjbBuildingSearch
  },
  data() {
    return {
      currentPage: 1,
      cityUrl: "/citis/cityLists",
      provinceIdsList: [],
      cityIdsList: [],
      areaIdsList: [],
      navList: [
        { path: this.$route.fullPath, name: "首页" },
        { path: this.$route.fullPath, name: "历史照片" },
        { path: this.$route.fullPath, name: "列表" }
      ],

      filterForm: {
        pageNum: 0,
        pageSize: 10,
        id: null,
        province: null,
        city: null,
        area: null,
        buildingName: null,
        replaceGetBuildingNameList: "/HistoryBuilding/getHistoryBuildingNames"
      },
      tableData: {
        pageCount: 0,
        buildingList: []
      },
      tabLoading: false
    };
  },
  created() {
    this.getData();
    this.cityGetData();
  },
  methods: {
    //请求数据方法
    getData() {
      let [_this, body] = [this, this.filterForm];
      this.$http(
        "/HistoryBuilding/getBuildingList",
        { body },
        {},
        {},
        "post"
      ).then(res => {
        if (res.data.code == 0) {
          _this.tableData = res.data.response;
        }
      });
    },
    f_provinceIds(val) {
      this.filterForm.city = "";
      this.filterForm.area = "";
      if (val != "") {
        let [_this, body] = [this, { name: val }];
        this.$http(
          "/HistoryBuilding/getHisPicCityInfo",
          { body },
          {},
          {},
          "post"
        ).then(res => {
          if (res.data.code == 0) {
            _this.cityIdsList = res.data.response.list;
          }
        });
      }
    },
    f_cityIds(val) {
      this.filterForm.area = "";
      if (val != "") {
        let [_this, body] = [this, { name: val }];
        this.$http(
          "/HistoryBuilding/getHisPicCityInfo",
          { body },
          {},
          {},
          "post"
        ).then(res => {
          if (res.data.code == 0) {
            _this.areaIdsList = res.data.response.list;
          }
        });
      }
    },
    f_areaIds(val) {
      //        if (val != '') {
      //          let [_this, body] = [this, {id: ''}];
      //          _this.tabLoading = true;
      //          this.$http('/HistoryBuilding/getHisPicCityInfo', {body}, {}, {}, 'post').then(res => {
      //            if (res.data.code == 0) {
      //              _this.provinceIdsList = res.data.response.list;
      //              console.log(_this.provinceIdsList);
      //            }
      //            _this.tabLoading = false;
      //          })
      //        }
    },
    cityGetData() {
      let [_this, body] = [this, { id: "" }];
      _this.tabLoading = true;
      this.$http(
        "/HistoryBuilding/getHisPicCityInfo",
        { body },
        {},
        {},
        "post"
      ).then(res => {
        if (res.data.code == 0) {
          _this.provinceIdsList = res.data.response.list;
        }
        _this.tabLoading = false;
      });
    },
    //触发搜索
    onSearchSubmit() {
      this.filterForm.pageNum = 0;
      if (this.currentPage != 1) {
        this.currentPage = 1;
      } else {
        this.getData();
      }
    },
    //改变页码
    currentChange(page) {
      this.currentPage = page;
      this.filterForm.pageNum = page - 1;
      this.getData();
    },
    //刷新方法
    refresh() {
      for (let i in this.filterForm) {
        if (i == "pageNum") {
          this.filterForm[i] = 0;
        } else if (i != "pageSize") {
          this.filterForm[i] = "";
        }
      }
      if (this.currentPage != 1) {
        this.currentPage = 1;
      } else {
        this.getData();
      }
    },
    //操作
    handleEdit(index, row, type, key) {
      if (key == 0) {
        this.$router.push({
          path: "/monitoring/auditCommonHistor",
          query: {
            id: row.id,
            name: row.name,
            imgcount: row.imgcount
          }
        });
      } else {
        this.$router.push({
          path: "/monitoring/monitoringUp",
          query: {
            id: row.id,
            name: row.name
          }
        });
      }
    },
    // 编辑
    openEdit(index, row, type, key) {
      this.$router.push({
        path: "/monitoring/monitoringhistoricphotosedit",
        query: {
          fullName: row.fullName,
          id: row.id,
          imgcount: row.imgcount,
          mjbCity: row.mjbCity,
          mjbBuildingId: row.mjbBuildingId,
          mjbBuildingName: row.mjbBuildingName,
          modifyDate: row.modifyDate,
          name: row.name,
          area: row.area,
          stageCount: row.stageCount,
          cityName: row.mjbBuildingName,
          cityId: row.mjbBuildingId
        }
      });
    }
  },
  mounted() {
    this.$store.dispatch(
      "defaultIndexAction",
      "/monitoring/monitoringHistoricPhotos"
    );
  }
};
</script>

<style scoped>
.el-dialog {
  margin-bottom: 0px;
  margin-top: -100px !important;
}

.slide-enter-active,
.slide-leave-active {
  transition: height 1s;
}

.slide-enter,
.slide-leave-to {
  height: 0;
}

.slide-leave,
.slide-enter-to {
  height: 100px;
}

.tabletopbar {
  height: 40px;
  background: #eef1f6;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  border-top: 1px solid #dfe6ec;
  line-height: 40px;
  font-size: 12px;
  color: #555;
  padding: 0px 15px;
}
</style>

<style>
.el-table--border td,
.el-table--border th {
  text-align: center;
}
</style>
