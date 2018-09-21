<template>
  <div class="managers">
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
    <div style="padding:20px">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- <el-tab-pane label="待审核" name="1">
          <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
            <el-col :span="22">
              <el-form :model="filterForm1" class="demo-form-inline">
                <el-form-item label="类型" prop="resource">
                  <el-radio-group v-model="filterForm1.isVideo">
                    <el-radio label=""><span>全部</span></el-radio>
                    <el-radio label="2"><span>照片</span></el-radio>
                    <el-radio label="1"><span>视频</span></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="分类：">
                  <el-radio-group v-model="filterForm1.menuId" @change="menuIdChange($event,1)">
                    <el-radio
                      label="">
                      <span>全部</span>
                    </el-radio>
                    <el-radio
                      v-for="(item,index) in selectList"
                      :key="item.menuName"
                      :label="item.menuId">
                      <span>{{item.menuName}}</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-show="filterForm1.menuId != ''">
                  <span
                    v-for="(item,index) in selectList"
                    :key="item.menuName"
                    style="color:#48576a"
                    v-show="filterForm1.menuId == item.menuId">
                    {{item.menuName}}：
                  </span>
                  <el-select
                    size="small"
                    clearable
                    v-model="filterForm1.menuChildId"
                    style="width:150px"
                    @change="menuChildIdChange($event,1)">
                    <el-option
                      v-for="(item,index) in menuChildList1"
                      :key="item.menuChildName"
                      :label="item.menuChildName"
                      :value="item.menuChildId">
                    </el-option>
                  </el-select>
                  <el-select
                    v-show="filterForm1.menuId == 2 || filterForm1.menuId == 3"
                    size="small"
                    clearable
                    v-model="filterForm1.menuGrandId"
                    style="width:150px">
                    <el-option
                      v-for="(item,index) in menuGrandList1"
                      :key="item.menuGrandName"
                      :label="item.menuGrandName"
                      :value="item.menuGrandId">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="用户：">
                  <el-select size="small" v-model="filterForm1.userType" style="width:150px;">
                    <el-option label="昵称" value="1"></el-option>
                    <el-option label="手机号" value="2"></el-option>
                  </el-select>
                  <el-input style="width: 200px;" size="small" v-model="filterForm1.userValue"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="时间：">
                  <el-select size="small" v-model="filterForm1.timeType" style="width:150px;">
                    <el-option label="提交时间" value="1"></el-option>
                  </el-select>
                  <el-date-picker
                    size="small"
                    style="width:300px"
                    @change="pickerChange"
                    v-model="filterForm1.editTime"
                    type="datetimerange"
                    align="right"
                    placeholder="选择日期范围"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="2" style="text-align:right">
              <el-button type="primary" @click="onSearchSubmit(1)">查询</el-button>
            </el-col>
          </el-row>
          <p v-if="tableData1.pageCount <= 0" style="text-align:center;color: #777;margin-top:100px">无数据</p>
          <div class="tabletopbar" v-if="tableData1.pageCount > 0">
            <span style="margin-left:20px">查询结果：共</span>
            <span style="color:#111">{{tableData1.pageCount}}</span> <span>条</span>
          </div>
          <ExamineItem v-for="(item,index) in tableData1.list" :key="index" :geocoder="geocoder" :data="item" :type="1"
                       :TagList="TagList"
                       :forms="filterForm1"
                       :page="filterForm1.pageNum"
                       @updata="updata" :dataSwi="dataSwi"/>
          <el-pagination
            v-show="tableData1.pageCount>0"
            style="margin: 0 auto;text-align:center;margin-top:20px"
            layout="prev, pager, next,jumper"
            :page-size=10
            :currentPage="currentPage1"
            @current-change="currentChange($event,1)"
            :total="tableData1.pageCount">
          </el-pagination>
        </el-tab-pane> -->

        <el-tab-pane label="已发布审核" name="2">

          <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
            <el-col :span="22">
              <el-form :model="filterForm2" class="demo-form-inline">
                <el-form-item label="分类：">
                  <el-radio-group v-model="filterForm2.isVideo">
                    <el-radio label=""><span>全部</span></el-radio>
                    <el-radio label="2"><span>照片</span></el-radio>
                    <el-radio label="1"><span>视频</span></el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="照片分类：">
                  <el-radio-group v-model="filterForm2.menuId" @change="menuIdChange($event,2)">
                    <el-radio
                      label="">
                      <span>全部</span>
                    </el-radio>
                    <el-radio
                      v-for="(item,index) in selectList"
                      :key="item.menuName"
                      :label="item.menuId">
                      <span>{{item.menuName}}</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- <el-form-item v-show="filterForm2.menuId != ''">
                  <span
                    v-for="(item,index) in selectList"
                    :key="item.menuName"
                    style="color:#48576a"
                    v-show="filterForm2.menuId == item.menuId">
                    {{item.menuName}}：
                  </span>
                  <el-select
                    size="small"
                    clearable
                    v-model="filterForm2.menuChildId"
                    style="width:150px"
                    @change="menuChildIdChange($event,2)">
                    <el-option
                      v-for="(item,index) in menuChildList2"
                      :key="item.menuChildName"
                      :label="item.menuChildName"
                      :value="item.menuChildId">
                    </el-option>
                  </el-select>
                  <el-select
                    v-show="filterForm2.menuId == 2 || filterForm2.menuId == 3"
                    size="small"
                    clearable
                    v-model="filterForm2.menuGrandId"
                    style="width:150px">
                    <el-option
                      v-for="(item,index) in menuGrandList2"
                      :key="item.menuGrandName"
                      :label="item.menuGrandName"
                      :value="item.menuGrandId">
                    </el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="用户：">
                  <el-select size="small" v-model="filterForm2.userType" style="width:150px;">
                    <el-option label="昵称" value="1"></el-option>
                    <el-option label="手机号" value="2"></el-option>
                  </el-select>
                  <el-input style="width: 200px;" size="small" v-model="filterForm2.userValue"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="时间：">
                  <el-select size="small" v-model="filterForm2.timeType" style="width:150px;">
                    <el-option label="提交时间" value="1"></el-option>
                    <el-option label="审核时间" value="2"></el-option>
                  </el-select>
                  <el-date-picker
                    size="small"
                    style="width:300px"
                    @change="pickerChange2"
                    v-model="filterForm2.editTime"
                    type="datetimerange"
                    align="right"
                    placeholder="选择日期范围"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="是否用户上传：">
                  <el-radio-group v-model="filterForm2.isUserUpload">
                    <el-radio label="">全部</el-radio>
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否置顶：">
                  <el-radio-group v-model="filterForm2.isTop">
                    <el-radio v-model="filterForm2.isTop" label="">全部</el-radio>
                    <el-radio v-model="filterForm2.isTop" label="1">置顶</el-radio>
                    <el-radio v-model="filterForm2.isTop" label="0">未置顶</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="2" style="text-align:right">
              <el-button type="primary" @click="onSearchSubmit(2)">查询</el-button>
            </el-col>
          </el-row>

          <p v-if="tableData2.pageCount <= 0" style="text-align:center;color: #777;margin-top:100px">无数据</p>
          <div class="tabletopbar" v-if="tableData2.pageCount > 0">
            <span style="margin-left:20px">查询结果：共</span>
            <span style="color:#111">{{tableData2.pageCount}}</span> <span>条</span>
          </div>

          <ExamineItem v-for="(item,index) in tableData2.list" :key="index" :geocoder="geocoder" :data="item"
                       :TagList="TagList"
                         @updata="updata" :dataSwi="dataSwi"
                        :forms="filterForm2"
                       :page="filterForm2.pageNum"
                       :type="2"/>
          <el-pagination
            v-show="tableData2.pageCount>0"
            style="margin: 0 auto;text-align:center;margin-top:20px"
            layout="prev, pager, next,jumper"
            :page-size=10
            :currentPage="currentPage2"
            @current-change="currentChange($event,2)"
            :total="tableData2.pageCount">
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="未通过" name="3">

          <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
            <el-col :span="22">
              <el-form :model="filterForm3" class="demo-form-inline">
                <el-form-item label="分类：">
                  <el-radio-group v-model="filterForm3.isVideo">
                    <el-radio label=""><span>全部</span></el-radio>
                    <el-radio label="2"><span>照片</span></el-radio>
                    <el-radio label="1"><span>视频</span></el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="照片分类：">
                  <el-radio-group v-model="filterForm3.menuId" @change="menuIdChange($event,3)">
                    <el-radio
                      label="">
                      <span>全部</span>
                    </el-radio>
                    <el-radio
                      v-for="(item,index) in selectList"
                      :key="item.menuName"
                      :label="item.menuId">
                      <!--<span>{{item.menuName}}</span>-->
                      {{item.menuName}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>

                <!-- <el-form-item v-show="filterForm3.menuId != ''">
                  <span
                    v-for="(item,index) in selectList"
                    :key="item.menuName"
                    style="color:#48576a"
                    v-show="filterForm3.menuId == item.menuId">
                    {{item.menuName}}：
                  </span>
                  <el-select
                    size="small"
                    clearable
                    v-model="filterForm3.menuChildId"
                    style="width:150px"
                    @change="menuChildIdChange($event,3)">
                    <el-option
                      v-for="(item,index) in menuChildList3"
                      :key="item.menuChildName"
                      :label="item.menuChildName"
                      :value="item.menuChildId">
                    </el-option>
                  </el-select>
                  <el-select
                    v-show="filterForm3.menuId == 2 || filterForm3.menuId == 3"
                    size="small"
                    clearable
                    v-model="filterForm3.menuGrandId"
                    style="width:150px">
                    <el-option
                      v-for="(item,index) in menuGrandList3"
                      :key="item.menuGrandName"
                      :label="item.menuGrandName"
                      :value="item.menuGrandId">
                    </el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="用户：">
                  <el-select size="small" v-model="filterForm3.userType" style="width:150px;">
                    <el-option label="昵称" value="1"></el-option>
                    <el-option label="手机号" value="2"></el-option>
                  </el-select>
                  <el-input style="width: 200px;" size="small" v-model="filterForm3.userValue"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="时间：">
                  <el-select size="small" v-model="filterForm3.timeType" style="width:150px;">
                    <el-option label="提交时间" value="1"></el-option>
                    <el-option label="审核时间" value="2"></el-option>
                  </el-select>
                  <el-date-picker
                    size="small"
                    style="width:300px"
                    @change="pickerChange3"
                    v-model="filterForm3.editTime"
                    type="datetimerange"
                    align="right"
                    placeholder="选择日期范围"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="2" style="text-align:right">
              <el-button type="primary" @click="onSearchSubmit(3)">查询</el-button>
            </el-col>
          </el-row>

          <p v-if="tableData3.pageCount <= 0" style="text-align:center;color: #777;margin-top:100px">无数据</p>
          <div class="tabletopbar" v-if="tableData3.pageCount > 0">
            <span style="margin-left:20px">查询结果：共</span>
            <span style="color:#111">{{tableData3.pageCount}}</span> <span>条</span>
          </div>

          <ExamineItem v-for="(item,index) in tableData3.list" :key="index" :geocoder="geocoder" :data="item"
                       :TagList="TagList"
                       :type="3"/>

          <el-pagination
            v-show="tableData3.pageCount>0"
            style="margin: 0 auto;text-align:center;margin-top:20px"
            layout="prev, pager, next,jumper"
            :page-size=10
            :currentPage="currentPage3"
            @current-change="currentChange($event,3)"
            :total="tableData3.pageCount">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
      <div id="container" tabindex="0" style="width: 500px;height: 500px;display: none"></div>
    </div>
  </div>
</template>

<script>

  import Subnav2 from '../Subnav2/Subnav2'
  import ExamineItem from '../Common/ExamineItem/ExamineItem'
  import message from '../../common/message'

  export default {
    name: 'managers',
    components: {
      Subnav2,
      ExamineItem
    },
    data() {
      return {
        activeName: '2',
        currentPage1: 1,
        currentPage2: 1,
        currentPage3: 1,
        navList: [
          {path: '/unopened/estateunopenedexamine', name: '首页'},
          {path: '/unopened/estateunopenedexamine', name: '质量寻光楼盘审核'},
          {path: this.$route.fullPath, name: this.$route.query.name}
        ],

        filterForm1: {
          id: this.$route.query.id,
          pageNum: 0,
          isVideo: '',
          pageSize: 10,
          isPass: '1',
          picIsPass: '1',
          menuId: '',
          menuChildId: '',
          menuGrandId: '',
          userType: '1',
          userValue: '',
          editTime: '',
          timeType: '1',
          startTime: '',
          endTime: ''
        },
        tableData1: {
          pageCount: 0,
          list: []
        },
        filterForm2: {
          id: this.$route.query.id,
          pageNum: 0,
          pageSize: 10,
          isPass: '2',
          picIsPass: '2',
          isVideo: '',
          menuId: '',
          menuChildId: '',
          menuGrandId: '',
          userType: '1',
          userValue: '',
          editTime: '',
          timeType: '1',
          startTime: '',
          endTime: '',
          isTop: '',
          isUserUpload:''
        },
        tableData2: {
          pageCount: 0,
          list: []
        },
        filterForm3: {
          id: this.$route.query.id,
          pageNum: 0,
          pageSize: 10,
          isPass: '2',
          picIsPass: '3',
          isVideo: '',
          menuId: '',
          menuChildId: '',
          menuGrandId: '',
          userType: '1',
          userValue: '',
          editTime: '',
          timeType: '1',
          startTime: '',
          endTime: ''
        },
        tableData3: {
          pageCount: 0,
          list: []
        },
        selectList: [],
        menuChildList1: [],
        menuGrandList1: [],
        menuChildList2: [],
        menuGrandList2: [],
        menuChildList3: [],
        menuGrandList3: [],
        dataSwi: false,
        geocoder: null,
        TagList: {},
//        historTagList:[]
      };
    },
    computed: {},
    created(){
      if (this.$route.query.forms) {
//        if (this.selectList.length == 0) {
        this.selectList = JSON.parse(window.localStorage.getItem('eSelectList'));
//        }
        this.filterForm2 = JSON.parse(this.$route.query.forms);
        this.menuIdChange(this.filterForm2.menuId, 1);
        this.menuChildIdChange(this.filterForm2.menuChildId, 1);
      }
      this.getSelectData();
      this.getTagList();
    //   this.getData(1);
      this.getData(2);
      this.getData(3);
      if (this.$route.query.page) {
        this.currentChange(this.$route.query.page + 1, 2);
        this.activeName = this.$route.query.activeName;
      }
    },
    methods: {
      pickerChange(val){
        this.filterForm1.startTime = val.slice(0, 19);
        this.filterForm1.endTime = val.slice(22);
      },
      pickerChange2(val){
        this.filterForm2.startTime = val.slice(0, 19);
        this.filterForm2.endTime = val.slice(22);
      },
      pickerChange3(val){
        this.filterForm3.startTime = val.slice(0, 19);
        this.filterForm3.endTime = val.slice(22);
      },
      //获取标签列表
      getTagList(){
        let body = {};
        this.$http('/buildingContribution/getBuildingContributionPicLabel', {body}, {}, {}, 'post').then(res => {
          this.TagList = res.data.response;
        }).catch(() => {

        })
      },

      initMap(){
        let _this = this;
        let map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 6
        });
        AMap.service('AMap.Geocoder', function () {
          _this.geocoder = new AMap.Geocoder({});
          console.log(_this.geocoder);
        })
      },
      //请求数据方法
      getData(type){
        let [_this, body] = [this, this[`filterForm${type}`]];
        this.$http('/buildingContribution/queryListInfo', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            _this[`tableData${type}`] = res.data.response;
            if (type == 2) {
              _this.dataSwi = !_this.dataSwi;
            }
          }
        })
      },
      //获取下拉数据
      getSelectData(type){
        let _this = this,
          body = {};
        body.sourceStatus = '0';
        this.$http('/buildingContribution/querySourceListInfo', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            _this.selectList = res.data.response.list;
            window.localStorage.eSelectList = JSON.stringify(_this.selectList);
          }
        })
      },
      //menuId 改变
      menuIdChange(menuId, type){
        if (!this.$store.state.filterId) {
          this[`filterForm${type}`].menuChildId = '';
          this[`filterForm${type}`].menuGrandId = '';
        } else {
          this.$store.dispatch('filterIdAction', false);
        }
        this[`menuChildList${type}`] = [];
        this[`menuGrandList${type}`] = [];
        this.selectList.forEach(item => {
          if (item.menuId == menuId) {
            this[`menuChildList${type}`] = item.menuChildList;
          }
        })
      },
      //menuChildId 改变
      menuChildIdChange(menuChildId, type){
        if (this.$store.state.filterId) {
          this[`filterForm${type}`].menuGrandId = '';
        }
        this.selectList.forEach(item => {
          if (item.menuId == this[`filterForm${type}`].menuId) {
            item.menuChildList.forEach(item1 => {
              if (item1.menuChildId == menuChildId) {
                this[`menuGrandList${type}`] = item1.menuGrandList;
              }
            })
          }
        })
      },
      //更新数据
      updata(){
        // this.getData(1);
        this.getData(2);
        this.getData(3);
        //获取用户历史标签列表
        // this.getHistorTagList();
      },
      //tab切换
      handleClick(){
      },
      //触发搜索
      onSearchSubmit(type){
        this[`filterForm${type}`].pageNum = 0;
        if (this[`currentPage${type}`] != 1) {
          this[`currentPage${type}`] = 1;
        } else {
          this.getData(type);
          this.$store.dispatch('filterAction', this.filterForm1);
//          this.$store.dispatch('filterIdAction', true);
        }
      },
      //改变页码
      currentChange(page, type){
        this[`currentPage${type}`] = page;
        this[`filterForm${type}`].pageNum = page - 1;
        this.getData(type);
        console.log(this[`currentPage${type}`], this[`filterForm${type}`].pageNum);
      },
      //刷新方法
      refresh(){

      },
    },
    mounted(){
      this.$store.dispatch('defaultIndexAction', '/unopened/estateunopenedexamine');
      this.initMap();
    },
//    destroyed(){
//        alert('1');
//    }
  }
</script>

<style scoped>
  .el-dialog {
    margin-bottom: 0px;
    margin-top: -100px !important
  }

  .slide-enter-active, .slide-leave-active {
    transition: height 1s
  }

  .slide-enter, .slide-leave-to {
    height: 0
  }

  .slide-leave, .slide-enter-to {
    height: 100px
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
  .el-table--border td, .el-table--border th {
    text-align: center;
  }
</style>
