<template>
  <div>
    <el-row style="border:1px solid #ccc;padding:20px 10px 0px">
      <el-col :span="20">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline">
          <el-form-item label="楼栋号">
            <el-select
              size="small"
              clearable
              @change="conditionChange('bBan',1)"
              v-model="filterForm.bBan"
              placeholder="不限">
              <el-option v-for="(item,index) in bBanArray" :key="item.id" :label="item.id" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单元">
            <el-select
              size="small"
              clearable
              :disabled="filterForm.bBan==''"
              @change="conditionChange('bUnit',1)"
              v-model="filterForm.bUnit"
              placeholder="不限">
              <el-option v-for="(item,index) in bUnitArray" :key="item.id" :label="item.id"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼层">
            <el-select
              size="small"
              clearable
              :disabled="filterForm.bBan=='' || filterForm.bUnit==''"
              @change="conditionChange('bDiv',1)"
              v-model="filterForm.bDiv" placeholder="不限">
              <el-option v-for="(item,index) in bDivArray" :key="item.id" :label="item.id" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="户号">
            <el-select
              size="small"
              clearable
              :disabled="filterForm.bBan=='' || filterForm.bUnit=='' || filterForm.bDiv==''"
              v-model="filterForm.bNum"
              placeholder="不限">
              <el-option v-for="(item,index) in bNumArray" :key="item.id" :label="item.id" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button style="float:right;margin-left:5px;" type="primary" @click="addNew" v-if="type==='edit'">添加户内全景

        </el-button>
        <el-button style="float:right" type="primary" @click="onSearchSubmit">查询</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px">
      <div class="tabletopbar">
        <span>查询结果：共</span>
        <span style="color:#111">{{tableData.pageCount}}</span> <span>条</span>
      </div>
      <el-table
        v-loading="tabLoading"
        :data="tableData.list"
        border
        tooltip-effect="dark"
        style="font-size:12px!important">
        <el-table-column
          prop="pName"
          label="名称"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="httpUrl"
          label="地址"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="bBan"
          label="楼栋"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="bUnit"
          label="单元"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="bDiv"
          label="楼层"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="bNum"
          label="门牌号"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="buildingPanoramaLableName"
          label="更新标签"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="submitTime"
          min-width="100"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="editTime"
          min-width="100"
          label="最近更新时间">
        </el-table-column>
        <el-table-column
          width="200"
          label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="handle(scope.row,1)">
              查看


            </el-button>
            <el-button
              size="small"
              v-if="type==='edit'"
              @click="handle(scope.row,2)">
              编辑


            </el-button>
            <el-button
              size="small"
              v-if="type==='edit'"
              @click="handle(scope.row,3)">
              删除


            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="tableData.pageCount>0"
        style="margin: 0 auto;text-align:center;margin-top:20px"
        layout="prev, pager, next,jumper"
        :page-size="10"
        :currentPage="currentPage"
        @current-change="currentChange"
        :total="tableData.pageCount">
      </el-pagination>
    </el-row>
    <BigDialog dialogTitle="添加户内全景" :dialogFormVisible="dialogFormVisible" @dialogCancel="dialogCancel(1)"
               @dialogConfirm="dialogConfirm(1)">
      <div slot="dia_body">
        <el-form style="" :model="editAndCreatePaParkDetail" class="demo-form-inline" label-width="150px">
          <el-form-item label="户内全景图名称：" required>
            <el-input size="small" v-model="editAndCreatePaParkDetail.pName" style="width:350px"></el-input>
          </el-form-item>
          <el-form-item label="户内全景图地址：" required>
            <el-input size="small" v-model="editAndCreatePaParkDetail.httpUrl" style="width:350px"></el-input>
          </el-form-item>
          <el-form-item label="全景缩略图：" required>
            <ImgPreview
              v-for="(item,index) in preImgSrcList"
              :key="index"
              :backgroundPicUrl="item.preImgSrc"
              @previewImg="previewImg(index)"
              @deleteImg="deleteImg(index)"
            />
            <ImgUploader2
              :btnId="btnList[0]"
              @imgUploader="imgUploader(0)"
            />
          </el-form-item>
          <el-form-item label="上传时间">
            <el-date-picker
              v-model="editAndCreatePaParkDetail.submitTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="本期更新点标签：" required>
            <el-checkbox-group size="small" v-model="editAndCreatePaParkDetail.buildingPanoramaLable">
              <el-checkbox v-for="(item,index) in buildingPanoramaLableList" :key="index" :label="item.key">{{item.value}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="位置：" required>
            <el-select
              size="small"
              clearable
              @change="conditionChange('bBan',2)"
              v-model="editAndCreatePaParkDetail.bBan"
              placeholder="楼栋号">
              <el-option v-for="(item,index) in bBanArray2" :key="item.id" :label="item.id"
                         :value="item.id"></el-option>
            </el-select>

            <el-select
              size="small"
              clearable
              :disabled="editAndCreatePaParkDetail.bBan==''"
              @change="conditionChange('bUnit',2)"
              v-model="editAndCreatePaParkDetail.bUnit"
              placeholder="单元">
              <el-option v-for="(item,index) in bUnitArray2" :key="item.id" :label="item.id"
                         :value="item.id"></el-option>
            </el-select>

            <el-select
              size="small"
              clearable
              :disabled="editAndCreatePaParkDetail.bBan=='' || editAndCreatePaParkDetail.bUnit==''"
              @change="conditionChange('bDiv',2)"
              v-model="editAndCreatePaParkDetail.bDiv" placeholder="楼层">
              <el-option v-for="(item,index) in bDivArray2" :key="item.id" :label="item.id"
                         :value="item.id"></el-option>
            </el-select>

            <el-select
              size="small"
              clearable
              :disabled="editAndCreatePaParkDetail.bBan=='' || editAndCreatePaParkDetail.bUnit=='' || editAndCreatePaParkDetail.bDiv==''"
              v-model="editAndCreatePaParkDetail.bNum"
              placeholder="户号">
              <el-option v-for="(item,index) in bNumArray2" :key="item.id" :label="item.id"
                         :value="item.id"></el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="创建：" v-if="handleType!='add'">
            <span>{{editAndCreatePaParkDetail.submitManName}}</span>
            <span>{{editAndCreatePaParkDetail.submitTime}}</span>
          </el-form-item>
          <el-form-item label="最近编辑：" v-if="handleType!='add'">
            <span>{{editAndCreatePaParkDetail.editManName}}</span>
            <span>{{editAndCreatePaParkDetail.editTime}}</span>
          </el-form-item>
        </el-form>
      </div>
    </BigDialog>

    <BigDialog dialogTitle="户内全景详情" :isShowCancel="false" :dialogFormVisible="viewDialogFormVisible"
               @dialogCancel="dialogCancel(2)" @dialogConfirm="dialogConfirm(2)">
      <div slot="dia_body">
        <el-form style="" class="demo-form-inline" label-width="150px">
          <el-form-item label="户内全景图名称：">
            <span>{{paParkDetail.pName}}</span>
          </el-form-item>
          <el-form-item label="户内全景图地址：">
            <a :href="paParkDetail.httpUrl" style="word-wrap:break-word" target="_blank">{{paParkDetail.httpUrl}}</a>
          </el-form-item>
          <el-form-item label="全景缩略图：">
            <ImgPreview
              v-for="(item,index) in preImgSrcList"
              :key="index"
              :backgroundPicUrl="item.preImgSrc"
              :isShowDelete="isShowDelete"
              @previewImg="previewImg(index)"
              @deleteImg="deleteImg(index)"
            />
          </el-form-item>
          <el-form-item label="上传时间：">
            <p>{{this.editAndCreatePaParkDetail.submitTime}}</p>
          </el-form-item>
          <el-form-item label="本期更新点标签：">
            <el-tag
              style="margin-right:10px"
              v-for="(item,index) in paParkDetail.buildingPanoramaLableName"
              :key="index"
              type="warning">
              {{item}}


            </el-tag>
          </el-form-item>
          <el-form-item label="位置：">
            <span>楼栋号 {{paParkDetail.bBan}}</span>
            <span>单元 {{paParkDetail.bUnit}}</span>
            <span>楼层 {{paParkDetail.bDiv}}</span>
            <span>户号 {{paParkDetail.bNum}}</span>
          </el-form-item>
          <el-form-item label="创建：">
            <span>{{paParkDetail.submitManName}}</span>
            <span>{{paParkDetail.submitTime}}</span>
          </el-form-item>
          <el-form-item label="最近编辑：">
            <span>{{paParkDetail.editManName}}</span>
            <span>{{paParkDetail.editTime}}</span>
          </el-form-item>
        </el-form>
      </div>
    </BigDialog>

    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImgSrc" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import uploader2 from '../../common/uploader2.js'
  import ImgUploader2 from '../Common/ImgUploader2/ImgUploader2'
  import ImgPreview from '../Common/ImgPreview/ImgPreview'
  import BigDialog from '../Common/BigDialog/BigDialog';
  import message from '../../common/message';
  export default{
    name: 'EstatePanoramaPark',
    components: {
      BigDialog,
      ImgUploader2,
      ImgPreview
    },
    data(){
      return {
        tabLoading: false,
        dialogFormVisible: false,
        viewDialogFormVisible: false,
        isShowDelete: true,
        currentPage: 1,
        btnList: ['htBtn0'],
        preImgSrcList: [{preImgSrc: ''}],
        uploaderList: [{uploader: null}],
        dialogVisible: false,
        dialogImgSrc: '',

        filterForm: {
          pageNum: 0,
          pageSize: 10,
          bId: this.$route.query.buildingId,
          pType: 3,
          bBan: '',
          bUnit: '',
          bDiv: '',
          bNum: ''
        },

        handleType: '',
        bBanArray: [],
        bUnitArray: [],
        bDivArray: [],
        bNumArray: [],
        bBanArray2: [],
        bUnitArray2: [],
        bDivArray2: [],
        bNumArray2: [],

        buildingPanoramaLableList: [],
        editAndCreatePaParkDetail: {
          id: '',
          bId: this.$route.query.buildingId,
          pType: 3,
          pName: '',
          httpUrl: '',
          backstageImgUrl: '',
          buildingPanoramaLable: [],
          bBan: '',
          bUnit: '',
          bDiv: '',
          bNum: '',
          submitTime: ''
        },
        paParkDetail: {
          pName: '',
          httpUrl: '',
          backstageImgUrl: '',
          buildingPanoramaLableName: [],
          bBan: '',
          bUnit: '',
          bDiv: '',
          bNum: '',
          submitManName: '',
          submitTime: '',
          editManName: '',
          editTime: '',
        },
        tableData: {
          list: [],
          pageCount: 10
        }
      }
    },
    computed: {
      type: function () {
        return this.$route.query.type;
      },
      buildingId: function () {
        return this.$route.query.buildingId;
      }
    },
    created(){
      if (this.buildingPanoramaLableList.length <= 0) {
        this.getLabelData();
      }
    },
    mounted(){
      this.conditionChange('bBan', 1);
      this.conditionChange('bBan', 2);
      this.getData();
      if(window.localStorage.buildingNumArray){
        this.buildingNumArray = JSON.parse(window.localStorage.buildingNumArray);
      }

    },
    methods: {
      //获取标签内容
      getLabelData(){
        let _this = this,
          body = {type: 6};
        this.$http('/buildingPanorama/getLableList', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            _this.buildingPanoramaLableList = res.data.response.list;
          } else {
            message(_this, '标签获取失败', 'warning')
          }
        }).catch(err => {
          console.log(err)
        })
      },
      //获取下拉数据
      conditionChange(name, type){
        if (name === 'bBan') {
          if (type == 1) {
            this.filterForm.bUnit = '';
            this.filterForm.bDiv = '';
            this.filterForm.bNum = '';
          } else {
            this.editAndCreatePaParkDetail.bUnit = '';
            this.editAndCreatePaParkDetail.bDiv = '';
            this.editAndCreatePaParkDetail.bNum = '';
          }
        } else if (name === 'bUnit') {
          if (type == 1) {
            this.filterForm.bDiv = '';
            this.filterForm.bNum = '';
          } else {
            this.editAndCreatePaParkDetail.bDiv = '';
            this.editAndCreatePaParkDetail.bNum = '';
          }
        } else if (name === 'bDiv') {
          if (type == 1) {
            this.filterForm.bNum = '';
          } else {
            this.editAndCreatePaParkDetail.bNum = '';
          }
        }
        let _this = this, body;
        if (type == 1) {
          body = {
            buildingId: this.buildingId,
            buildingNum: this.filterForm.bBan,
            unitNum: this.filterForm.bUnit,
            floor: this.filterForm.bDiv,
            accountNum: this.filterForm.bNum
          };
        } else {
          body = {
            buildingId: this.buildingId,
            buildingNum: this.editAndCreatePaParkDetail.bBan,
            unitNum: this.editAndCreatePaParkDetail.bUnit,
            floor: this.editAndCreatePaParkDetail.bDiv,
            accountNum: this.editAndCreatePaParkDetail.bNum
          };
        }
        ;
        if (body.buildingId == '') {
          console.log(body.buildingId)
          return;
        }
        this.$http('/buildingMonitor/pullDownExcelInfo', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            let response = res.data.response;
            if (type == 1) {
              _this.bBanArray = response.buildingNumArray;
              _this.bUnitArray = response.unitNumArray;
              _this.bDivArray = response.floorArray;
              _this.bNumArray = response.accountNumArray;
            } else {
              _this.bBanArray2 = response.buildingNumArray;
              _this.bUnitArray2 = response.unitNumArray;
              _this.bDivArray2 = response.floorArray;
              _this.bNumArray2 = response.accountNumArray;
            }
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //获取数据
      getData(){
        let _this = this,
          body = _.cloneDeep(this.filterForm);
        _this.tabLoading = true;
        this.$http('/buildingPanorama/queryListInfo', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            _this.tableData = res.data.response;
          } else {
            message(_this, '请求失败', 'warning')
          }
          _this.tabLoading = false;
        }).catch(err => {
          console.log(err)
          _this.tabLoading = false;
        })
      },
      //页码改变
      currentChange(page){
        this.filterForm.pageNum = page - 1;
        this.getData();
      },
      //搜索
      onSearchSubmit(){
        this.filterForm.pageNum = 0;
        this.getData();
      },
      //新增
      addNew(){
        this.dialogFormVisible = true;
        this.isShowDelete = true;
        this.handleType = 'add';
        if (this.uploaderList[0].uploader == null) {
          this.initUploader(0);
        }
        ;
        for (var i in this.editAndCreatePaParkDetail) {
          if (i == 'bId' || i == 'pType') {

          } else if (i == 'buildingPanoramaLable') {
            this.editAndCreatePaParkDetail[i] = [];
          } else {
            this.editAndCreatePaParkDetail[i] = '';
          }
        }
        this.preImgSrcList[0].preImgSrc = '';
      },
      //初始化上传插件对象
      initUploader(index){
        let _this = this,
          btnName = 'htBtn' + index;
        uploader2(function (src) {
          _this.preImgSrcList[0].preImgSrc = src;
        }, function (key) {
          _this.editAndCreatePaParkDetail.backstageImgUrl = key;
        }, function () {
          _this.preImgSrcList[0].preImgSrc = '';
        }, function (uploader) {
          _this.uploaderList[index].uploader = uploader;
        }, btnName, false)
      },
      //预览上传图
      previewImg(index){
        this.dialogImgSrc = this.preImgSrcList[index].preImgSrc;
        this.dialogVisible = true;
      },
      //删除图片
      deleteImg(index){
        this.preImgSrcList[0].preImgSrc = '';
        this.editAndCreatePaParkDetail.backstageImgUrl = '';
      },
      //开始上传
      imgUploader(index){
        if (this.uploaderList[index].uploader == null) {
          return;
        }
        ;
        this.uploaderList[index].uploader.start();
      },
      //关闭-模态框
      dialogCancel(type){
        if (type == 1) {
          this.dialogFormVisible = false;
        } else {
          this.viewDialogFormVisible = false;
        }
        ;
      },
      //确认-模态框
      dialogConfirm(type){
        if (type == 1) {
          let _this = this,
            url,
            body = _.cloneDeep(this.editAndCreatePaParkDetail);
          body.buildingPanoramaLable = body.buildingPanoramaLable.join(',');
          if (body.pName == '') {
            message(_this, '请填写全景图名称', 'warning');
            return;
          }
          if (body.httpUrl == '') {
            message(_this, '请填写全景图地址', 'warning');
            return;
          }
          if (body.backstageImgUrl == '') {
            message(_this, '请添加全景缩略图', 'warning');
            return;
          }
          if (body.buildingPanoramaLable == '') {
            message(_this, '请选择更新标签', 'warning');
            return;
          }
          if (body.bBan == '') {
            message(_this, '请选择楼栋号', 'warning');
            return;
          }
          if (body.bUnit == '') {
            message(_this, '请选择单元', 'warning');
            return;
          }
          if (body.bDiv == '') {
            message(_this, '请选择楼层', 'warning');
            return;
          }
          if (body.bNum == '') {
            message(_this, '请选择户号', 'warning');
            return;
          }
          if (this.handleType == 'add') {
            url = '/buildingPanorama/insertInfo';
            delete body.id;
            delete body.editManName;
            delete body.editTime;
            delete body.submitManName;
            delete body.submitTime;
          } else {
            url = '/buildingPanorama/updateInfo';
            delete body.editManName;
            delete body.editTime;
            delete body.submitManName;
            delete body.submitTime;
            delete body.bId;
          }
          ;
          this.$http(url, {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              message(_this, '请求成功', 'success');
              _this.dialogFormVisible = false;
              _this.getData();
            } else {
              message(_this, '请求失败', 'warning');
            }
            ;
          }).catch(err => {
            console.log(err);
          })
        } else {
          this.viewDialogFormVisible = false;
        }
      },
      //操作
      handle(row, type){
        if (type == 1) {
          this.isShowDelete = false;
          this.handleType = 'view';
          this.paParkDetail = _.cloneDeep(row);
          this.paParkDetail.buildingPanoramaLableName = this.paParkDetail.buildingPanoramaLableName.split(',');
          this.preImgSrcList[0].preImgSrc = row.backstageImgUrl;
          this.viewDialogFormVisible = true;
        } else if (type == 2) {
          this.isShowDelete = true;
          this.handleType = 'edit';

          for (var i in row) {
            if (i != 'bBan' && i != 'bUnit' && i != 'bDiv' && i != 'bNum') {
              this.editAndCreatePaParkDetail[i] = row[i];
            }
          }
          this.editAndCreatePaParkDetail.buildingPanoramaLable = row.buildingPanoramaLable.split(',');
          this.$nextTick(function () {
            this.editAndCreatePaParkDetail.bBan = row.bBan;
            this.$nextTick(function () {
              this.editAndCreatePaParkDetail.bUnit = row.bUnit;
              this.$nextTick(function () {
                this.editAndCreatePaParkDetail.bDiv = row.bDiv;
                this.$nextTick(function () {
                  this.editAndCreatePaParkDetail.bNum = row.bNum;
                })
              })
            })
          })
          this.preImgSrcList[0].preImgSrc = row.backstageImgUrl;
          this.dialogFormVisible = true;
          if (this.uploaderList[0].uploader == null) {
            this.initUploader(0);
          }
          ;
        } else {
          let _this = this,
            body = {
              id: row.id
            };
          this.$confirm('是否确定删除该条数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.$http('/buildingPanorama/delInfo', {body}, {}, {}, 'post').then(res => {
              if (res.data.code == 0) {
                if (res.data.response.res == 1) {
                  message(_this, '删除成功!', 'success');
                  _this.getData();
                } else {
                  message(_this, '删除失败', 'warning');
                }
              } else {
                message(_this, '删除失败', 'warning');
              }
            }).catch(function (err) {
              console.log(err)
            })
          }).catch(() => {
          });
        }
      },
    }
  }
</script>

<style scoped>
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

  .el-checkbox {
    margin-left: 0px;
    margin-right: 10px;
  }
</style>
