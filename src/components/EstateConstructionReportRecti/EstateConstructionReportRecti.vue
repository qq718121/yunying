<template>
  <div style="padding:0px 20px">
    <el-form label-width="150px" style="width: 80%;padding-top: 20px" :model="form" class="demo-form-inline">
      <div style="border-bottom: 1px solid #ccc;">
        <el-form-item label="已整改记录"
                      required v-for="(item,index) in form.reList"
                      :key="index"
                      v-show="form.reList.length>0"
        >
          <el-button
            style="float: right;margin-right: 50px"
            type="text"
            v-show="form.reList.length>0 && $route.query.type!='view'"
            @click="deleteRe(index)">
            <span>删除</span>
          </el-button>
          <el-input
            style="width: 80%"
            v-if="$route.query.type!='view'"
            size="small"
            v-model="item.questionDesc"
            placeholder="整体描述(请输入0-30字)"
            @change="record_target()"
            :maxlength="30">
          </el-input>
          <span v-if="$route.query.type=='view'">{{item.questionDesc ? item.questionDesc : '无数据'}}</span>
        </el-form-item>
        <el-button style="margin-left: 150px" type="text" @click="addRe" v-if="$route.query.type!='view'">
          <span>继续添加整改记录</span>
        </el-button>
        <el-button style="margin-left:150px;margin-bottom: 20px" v-if="record_save" type="primary"
                   @click="onSubmit_record()">
          <span>保存</span>
        </el-button>
      </div>

      <div v-for="(item,index) in form.reDetailList" :key="index" style="padding-top: 20px" v-if="item.isShow"
      >
        <el-form-item label="已整改问题点描述">
          <el-input
            style="width: 80%"
            v-if="$route.query.type!='view'&& !item.recti_show"
            type="text" size="small"
            v-model="item.a"
            @change="onSubmit_button_show(index)"
            placeholder="已整改问题点描述(请输入0-30字)"
            :disabled="item.recti_show"
            :maxlength="30">
          </el-input>
          <span v-else style="width: 90%;display: inline-block">{{item.a ? item.a : '无数据'}}</span>
          <el-button
            stlye="flaot:right"
            type="text"
            v-show="form.reDetailList.length > 0 && $route.query.type!='view'"
            :disabled="form.reDetailList.length > 0 && $route.query.type!='view' && item.recti_show"
            @click="deleteRes(index)">
            <span>删除</span>
          </el-button>
          <el-button style="" type="text"
                     v-if="$route.query.type!='view'"
                     :disabled="$route.query.type!='view'&& !item.recti_show"
                     @click="recti_show_change(index)"><span>编辑</span>
          </el-button>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="整改前图片">
              <ImgPreview
                :backgroundPicUrl="cs[index].preImgSrcList[0].picUrl"
                @previewImg="previewImg(index,0)"
                @deleteImg="deleteImg(index,0)"
                :isShowDelete="false"
              />
              <ImgUploader2
                :btnId="btnList[index][0]"
                @imgUploader="imgUploader(index,0)"
                v-show="$route.query.type!='view' && !item.recti_show && !item.picBeforeId"
                :btnName="item.picList[0].btnNames"
              />
              <!--<div v-if="!cs[index].preImgSrcList[0].picUrl && item.recti_show"-->
                   <!--style="width: 150px;height: 150px;border: 1px solid lightgray;line-height: 150px;text-align: center">-->
                <!--<span>暂无图片</span>-->
              <!--</div>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="整改后图片">
              <ImgPreview
                :backgroundPicUrl="cs[index].preImgSrcList[1].picUrl"
                @previewImg="previewImg(index,1)"
                @deleteImg="deleteImg(index,1)"
                :isShowDelete="false"
              />
              <ImgUploader2
                :btnId="btnList[index][1]"
                @imgUploader="imgUploader(index,1)"
                v-show="$route.query.type!='view' && !item.recti_show && !item.picAfterId"
                :btnName="item.picList[1].btnNames"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="问题点描述">
          <el-input
            style="width: 80%"
            v-if="$route.query.type!='view' && !item.recti_show"
            type="text" size="small"
            v-model="item.b"
            @change="onSubmit_button_show(index)"
            placeholder="问题点描述(请输入0-50字)"
            :disabled="item.recti_show"
            :maxlength="50">
          </el-input>
          <span v-else>{{item.b ? item.b : '无数据'}}</span>
        </el-form-item>
        <el-form-item label="问题点描述" required v-show="false">
          <el-input
            style="width: 80%"

            @change="onSubmit_button_show(index)"
            placeholder="问题点描述(请输入0-50字)"
            :disabled="a"
            :maxlength="50">
          </el-input>
        </el-form-item>
        <el-button style="margin-left:150px;margin-bottom: 20px"
                   v-if="$route.query.type!='view' && !item.onSubmit_button"
                   :disabled="item.onSubmit_button"
                   type="primary"
                   @click="onSubmit(index)">
          <span>保存</span>
        </el-button>
      </div>

      <el-button style="margin-left: 100px" type="text" @click="addList" v-if="$route.query.type!='view'">
        <span>添加新的监测点信息</span>
      </el-button>
      <div v-if="form.reDetailList.length <= 0 && $route.query.type!='view'" style="padding-top: 40px">
        <el-button style="margin-left: 50px" type="text">
          <span style="color:#8391a5">建设进度中暂无照片引用</span>
        </el-button>
        <el-button style="margin-left:50px"
                   @click="goHouseAudit"
                   type="primary">
          <span>马上去引用报告</span>
        </el-button>
      </div>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <div class="addImg">
        <img width="100%" :src="dialogImgSrc" alt="">
        <div class="addImg-bg" v-if="dialogContVisible">{{ area }}</div>
      </div>
      <div class="add-bottom" v-if="dialogContVisible">
        <div class="tableData2Icon">
          <span>{{ scoreLable }}</span>
          <!--<span>上传照片</span>-->
        </div>
        <div class="audit-item">
          <span>照片类型：</span>
          <p class="audit-item-addw">{{ scoreConfig }}</p>
        </div>
        <div class="audit-item">
          <span>拍照人：</span>
          <p class="audit-item-addw">{{ userName }}</p>
        </div>
        <div class="audit-item">
          <span>拍照时间：</span>
          <p class="audit-item-addw">{{ picTime }}</p>
        </div>
        <div class="audit-item">
          <span>审核人：</span>
          <p class="audit-item-addw">{{ examine }}</p>
        </div>
        <div class="audit-item">
          <span>审核时间：</span>
          <p class="audit-item-addw">{{ examineTime }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import message from '../../common/message';
  import uploader2 from '../../common/uploader2.js'
  import ImgPreview from '../Common/ImgPreview/ImgPreview';
  import ImgUploader2 from '../Common/ImgUploader2/ImgUploader2'
  export default{
    name: 'EstateConstructionReportTab',
    props: {
      buildingId: {
        default: ''
      }
    },
    components: {
      ImgUploader2,
      ImgPreview
    },
    data(){
      return {
        dialogImgSrc: '',
        area:'',
        scoreLable:'',
        scoreConfig:'',
        userName:'',
        picTime:'',
        examine:'',
        examineTime:'',//dialog
        dialogContVisible:false,
        dialogVisible: false,
        cs: [],
        a: true,
        new_: true,
        onSubmit_button: null,
        record_save: false,
        record_new: true,
        btnList: [],
        btnLists: [],
        form: {
          buildingConstructionReportId: '',
          reList: [{questionDesc: '', id: ''}],
          reDetailList: [{
            isShow: true,
            recti_show: false,
            onSubmit_button: true,
            a: '',
            b: '',
            picBeforeId:'',
            picAfterId:'',
            buildingConstructionReportId:'',
            picList: [{picUrl: '', uploader: '', btnNames: '点击上传'}, {picUrl: '', uploader: '', btnNames: '点击上传'}],
            // picBeforeList:[],
            // picAfterList:[],
          }],
        }
      }
    },

    created(){
      bus.$on('tip', (text) => {
//        this.cs.length = 0;
//        this.btnList.length = 0;
        switch (text) {
          case '3': {
            this.form.reDetailList.length = 0;
            this.getData(text);
            break;
          }
          default:
            break;
        }
      });
      if (this.$route.query.type == 'add') {
        // this.initAddData();
        this.form.reDetailList.length = 0;
        this.form.reList.length = 0;
      } else {
        this.btnList.push(['EBtn00', 'EBtn01']);
        this.cs.push({
          preImgSrcList: [{picUrl: ''}, {picUrl: ''}],
          uploaderList: [{uploader: null}, {uploader: null}]
        });
        this.getData();
      }

    },
    computed: {
      ...mapState({
        reportId: state => state.estate.reportId,
      })
    },
    methods: {
      recti_show_change(index){
          
          console.log(this.cs[index].uploaderList);
          // if(this.cs[index].uploaderList[0].uploader === null){
            this.initUploader(index,0);
            this.initUploader(index,1);
          // }else if(this.cs[index].uploaderList[1].uploader === null){
          //   this.initUploader(index,0);
          //   this.initUploader(index,1);
          // }
        this.form.reDetailList[index].recti_show = false;
        this.form.reDetailList[index].onSubmit_button = false;
        if (this.form.reDetailList[index].picList[0].picUrl != '') {
          this.form.reDetailList[index].picList[0].btnNames = '重新上传'
        } else {
          this.form.reDetailList[index].picList[0].btnNames = '点击上传'
        }
        if (this.form.reDetailList[index].picList[1].picUrl != '') {
          this.form.reDetailList[index].picList[1].btnNames = '重新上传'
        } else {
          this.form.reDetailList[index].picList[1].btnNames = '点击上传'
        }
        this.new_ = false;
        this.a = !this.a;
      },

      addRe(){
        this.form.reList.push({
          re: ''
        });
        this.record_new = false;
      },

      deleteRe(index){
        let num = 1;
        this.onSubmit_record(index, num);
      },
      deleteRes(index){
        console.log(index);
        console.log(this.form.reDetailList[index].id);
        console.log(this.form.reDetailList[index]);
        this.tabLoading = true;
        if (this.form.reDetailList[index].id) {
          let body = {};
          body.id = this.form.reDetailList[index].id;
          body.picAfterId = this.form.reDetailList[index].picAfterId;
          body.picBeforeId = this.form.reDetailList[index].picBeforeId;
          body.buildingConstructionReportId = this.form.reDetailList[index].buildingConstructionReportId;
          // if (this.reportId) {
          //   body.buildingConstructionReportId = this.reportId;
          // } else {
          //   body.buildingConstructionReportId = this.$route.query.tab.id;
          // }
          this.tabLoading = true;
          this.$http('/buildingConstructionReport/delConstructionPointInfo', {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              message(this, '删除成功', 'success');
              this.form.reDetailList.splice(index, 1);
              this.cs.splice(index, 1);
              this.btnList.splice(index, 1);
              this.record_new = true;
              this.tabLoading = false;
            }
          });
        } else {
          this.form.reDetailList.splice(index, 1);
          this.cs.splice(index, 1);
          this.btnList.splice(index, 1);
          this.record_new = true;
        }

      },
      initAddData(){
        this.btnList.push(['EBtn00', 'EBtn01']);
        this.cs.push({
          preImgSrcList: [{picUrl: ''}, {picUrl: ''}],
          uploaderList: [{uploader: null}, {uploader: null}]
        });
        this.initUploader(0, 0);
        this.initUploader(0, 1);
      },

      //楼盘景观图-插件初始化
      initUploader(index, num){
        let _this = this,
          btnName = 'EBtn' + index + num;
        uploader2(function (src) {
          _this.cs[index].preImgSrcList[num].picUrl = src;
          _this.form.reDetailList[index].picList[num].btnNames = '重新上传';
        }, function (key) {
          _this.form.reDetailList[index].picList[num].picUrl = key;
        }, function () {
          _this.cs[index].preImgSrcList[num].picUrl = '';
        }, function (uploader) {
          _this.cs[index].uploaderList[num].uploader = uploader;
        }, btnName, false)
      },

      //楼盘景观图-开始上传
      imgUploader(index, num){
        this.onSubmit_button = index;
        // if (this.cs[index].uploaderList[num].uploader === null) {
        //    this.initUploader(index,num);
        //     setTimeout(()=>{
        //     //   // alert('1');
        //       document.getElementById('EBtn' + index + num).click(()=>{
        //         this.cs[index].uploaderList[num].uploader.start();
        //       });
        //     },3000);
        // }else{

        // }
        // if (this.save == index) {1
        // }
       // setTimeout(()=>{
         
         this.cs[index].uploaderList[num].uploader.start();
       //   this.cs[index].uploaderList[num].uploader.start();
       // },2000)
      },

      addImgData(index){
        let len = this.form.list[index].imgData.length;
        this.btnList[index].push(`EBtn${index}${len}`);
        this.cs[index].uploaderList.push({uploader: null});
        this.cs[index].preImgSrcList.push({imgUrl: ''});
        this.form.list[index].imgData.push({
          imgUrl: ''
        });
        this.initUploader(index, len);
      },

      deleteImgData(index){
        this.btnList[index].pop();
        this.cs[index].uploaderList.pop();
        this.cs[index].preImgSrcList.pop();
        this.form.list[index].imgData.pop();
      },
      addList(){
        
        this.form.reDetailList.push({
          a: '',
          b: '',
          isShow: true,
          recti_show: false,
          picList: [
            {picUrl: '', uploader: ''},
            {picUrl: '', uploader: ''}
          ]
        });
        let len = this.form.reDetailList.length - 1;
        this.btnList.push([`EBtn${len}0`, `EBtn${len}1`]);
        this.cs.push(
          {
            preImgSrcList: [{picUrl: ''}, {picUrl: ''}],
            uploaderList: [{uploader: null}, {uploader: null}]
          }
        );
        this.initUploader(len, 0);
        this.initUploader(len, 1);
      },

      getData(text){
        this.$store.dispatch('contrationLoadingAction', true);
        let body = {};
        // console.log(this.$route.query,this.reportId);
        if(this.$route.query.id){
          body.id = this.$route.query.id;
        }else{
           body.id = this.reportId;
        }
       
        this.tabLoading = true;
        this.$http('/buildingConstructionReport/queryConstructionListPointInfo', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            if (res.data.response.descLi.length == 0 && res.data.response.pointLi.length == 0) {
              let this_ = this;
              this.form.reDetailList[0].isShow = false;
              this.form.reDetailList.length = 0;
              this.form.reList.length = 0;
              // setTimeout(function () {
              //   // this_.initUploader(0, 0);
              //   // this_.initUploader(0, 1);
              // }, 2000)
            } else {
              let descLi = res.data.response.descLi;
              let pointLi = res.data.response.pointLi;
              let len = 0;
              this.form.reList.length = 0;
              this.form.reDetailList.length = 0;
              this.cs.length = 0;
              this.btnList.length = 0;
              for (let i in descLi) {
                this.form.reList.push({questionDesc: '', id: ''});
                this.form.reList[i].questionDesc = descLi[i].questionDesc;
                this.form.reList[i].id = descLi[i].id;
              }
              for (let j in pointLi) {
                this.form.reDetailList.push({
                  a: '',
                  b: '',
                  picList: [{picUrl: '', uploader: ''}, {picUrl: '', uploader: ''}]
                });
                this.cs.push(
                  {
                    preImgSrcList: [{picUrl: ''}, {picUrl: ''}],
                    uploaderList: [{uploader: null}, {uploader: null}]
                  }
                );
                len = this.cs.length - 1;
                this.btnList.push([`EBtn${len}0`, `EBtn${len}1`]);
                // if (!text && this.$route.query.type != 'view') {
                //   this.initUploader(len, 0);
                //   this.initUploader(len, 1);
                // }
                if (this.form.reDetailList[j].picList[0].picUrl != '') {
                  this.form.reDetailList[j].picList[0].btnNames = '重新上传'
                } else {
                  this.form.reDetailList[j].picList[0].btnNames = '点击上传'
                }
                if (this.form.reDetailList[j].picList[1].picUrl != '') {
                  this.form.reDetailList[j].picList[1].btnNames = '重新上传'
                } else {
                  this.form.reDetailList[j].picList[1].btnNames = '点击上传'
                }
                this.form.reDetailList[j].isShow = true;
                this.form.reDetailList[j].recti_show = true;
                this.form.reDetailList[j].id = pointLi[j].id;
                this.form.reDetailList[j].a = pointLi[j].questionPoint;
                this.form.reDetailList[j].onSubmit_button = true;
                this.form.reDetailList[j].b = pointLi[j].wholeDesc;
                this.form.reDetailList[j].picAfterId = pointLi[j].picAfterId;
                this.form.reDetailList[j].picBeforeId = pointLi[j].picBeforeId;
                this.form.reDetailList[j].buildingConstructionReportId = pointLi[j].buildingConstructionReportId;

                this.form.reDetailList[j].picList[0].picUrl = pointLi[j].picUrlBefore;
                this.form.reDetailList[j].picList[1].picUrl = pointLi[j].picUrlAfter;
                this.form.reDetailList[j].picBeforeList = pointLi[j].picBeforeList;
                this.form.reDetailList[j].picAfterList = pointLi[j].picAfterList;
                this.cs[j].preImgSrcList[0].picUrl = pointLi[j].picUrlBefore;
                this.cs[j].preImgSrcList[1].picUrl = pointLi[j].picUrlAfter;
              }
            }
          }
          this.$store.dispatch('contrationLoadingAction', false);
          console.log(this.form);
        })
      },

      //楼盘效果图-预览
      previewImg(index, num){
        // this.dialogContVisible = true;
        this.dialogVisible = true;
        console.log(this.cs[index].preImgSrcList);
        this.dialogImgSrc = this.cs[index].preImgSrcList[num].picUrl;
        if(this.form.reDetailList[index].picBeforeList[num]){
          this.area = this.form.reDetailList[index].picBeforeList[num].area;
          this.scoreConfig = this.form.reDetailList[index].picBeforeList[num].scoreConfig;
          this.scoreLable = this.form.reDetailList[index].picBeforeList[num].scoreLable;
          this.userName = this.form.reDetailList[index].picBeforeList[num].userName;
          this.picTime = this.form.reDetailList[index].picBeforeList[num].picTime;
          this.examine = this.form.reDetailList[index].picBeforeList[num].examine;
          this.examineTime = this.form.reDetailList[index].picBeforeList[num].examineTime;
        }else if(this.form.reDetailList[index].picAfterList[num-1]){
          this.dialogContVisible = true;
          this.area = this.form.reDetailList[index].picAfterList[num-1].area;
          this.scoreConfig = this.form.reDetailList[index].picAfterList[num-1].scoreConfig;
          this.scoreLable = this.form.reDetailList[index].picAfterList[num-1].scoreLable;
          this.userName = this.form.reDetailList[index].picAfterList[num-1].userName;
          this.picTime = this.form.reDetailList[index].picAfterList[num-1].picTime;
          this.examine = this.form.reDetailList[index].picAfterList[num-1].examine;
          this.examineTime = this.form.reDetailList[index].picAfterList[num-1].examineTime;
        }else{
          this.dialogContVisible = false;
          this.area = '';
          this.scoreConfig = '';
          this.scoreLable = '';
          this.userName = '';
          this.picTime = '';
          this.examine = '';
          this.examineTime = '';
        }



      },

      //楼盘效果图-删除
      deleteImg(index, num){
        this.onSubmit_button = index;
        this.cs[index].preImgSrcList[num].picUrl = '';
        this.form.reDetailList[index].picList[num].picUrl = '';
        this.form.reDetailList[index].picList[num].btnNames = '点击上传';
      },
      //跳转楼盘
      goHouseAudit(){
        let buildingId = "";
        if(this.$route.query.buildingId){
          buildingId = this.$route.query.buildingId;
        }else if(this.$route.query.tab.buildingId){
          buildingId = this.$route.query.tab.buildingId;
        }
        this.$router.push({
          path: '/monitoring/houseAudit',
          query: {
            id: buildingId,
            name: this.$route.query.buildingName
          }
        })
      },
      //已整改记录添加
      onSubmit_record(index, num){
        console.log(index, num);
        let _this = this;
        let swi = true;
        for (let i in this.form.reList) {
          if (this.form.reList[i].questionDesc == '') {
            swi = false;
          }
        }
        if (!swi) {
          message(this, '有必填项未填写', 'warning');
          return
        }
        this.$confirm('确认提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let f = this.form.reList;
          if(num){
            f.splice(index, 1);
          }
          let url = '/buildingConstructionReport/updateConstructionDescInfo';
          let body = {};
          if (this.reportId) {
            body.id = this.reportId;
          } else {
            body.id = this.$route.query.id;
          }

          body.descList = _.cloneDeep(f);
          console.log(body);

          this.$http(url, {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              this.record_new = true;
              this.record_save = false;

              if(res.data.response.descList != []){
                for (let i in _this.form.reList) {
                  _this.form.reList[i].id = res.data.response.descList[i].id;
                }
              }

              // if (num) {
              //   this.form.reList.splice(index, 1);
              // }
              // _this.getData();
              message(this, '提交成功', 'success');

            }
          })
        }).catch(() => {
        });
      },
      onSubmit(index){
        let swi = true;
        // if (this.form.reDetailList[index].a == '' || this.form.reDetailList[index].b == '') {
        //   swi = false;
        // }


        if (this.form.reDetailList[index].picList[1].picUrl == '' && this.form.reDetailList[index].picList[0].picUrl == "") {
          swi = false;
        }

        if (!swi) {
          message(this, '有必填项未填写', 'warning');
          return
        }
        this.$confirm('确认提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
//             _.cloneDeep(this.form)
          let body = {},
            url;
//          body.questionPoint = this.form.reList[0].questionDesc;
          body.questionPoint = this.form.reDetailList[index].a;
          body.wholeDesc = this.form.reDetailList[index].b;
          body.picUrlBefore = this.form.reDetailList[index].picList[0].picUrl;
          body.picUrlAfter = this.form.reDetailList[index].picList[1].picUrl;

          if (this.$route.query.type == 'edit') {

            if (!this.form.reDetailList[index].id) {
              console.log(1);
              url = '/buildingConstructionReport/insertConstructionPointInfo';
              body.buildingConstructionReportId = this.$route.query.id;
            } else {
              console.log(2);
              url = '/buildingConstructionReport/updateConstructionPointInfo';
              body.id = this.form.reDetailList[index].id;
            }
          } else {
            console.log(3);
           
            if(!this.form.reDetailList[index].id){
              console.log(4);
               url = '/buildingConstructionReport/insertConstructionPointInfo';
              body.buildingConstructionReportId = this.reportId;

            }else{
              console.log(5);
              url = '/buildingConstructionReport/updateConstructionPointInfo';
              body.id = this.form.reDetailList[index].id;
            }
          }

          this.$http(url, {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              message(this, '提交成功', 'success');
              this.a = !this.a;
              this.form.reDetailList[index].onSubmit_button = true;
              // this.form.reDetailList[index].id = res.data.response.id;
              console.log(res.data.response);
              if (this.$route.query.type != 'view') {
                this.form.reDetailList[index].recti_show = true;
                this.new_ = true;
              }
              // this.getData();
            }
          })
        }).catch(() => {

        })
      },
      onSubmit_button_show(index){
        this.form.reDetailList[index].onSubmit_button = false;
      },
      record_target(index){
        this.record_save = true;
      }
    }
  }
</script>
<style scoped>

  .addImg{
    width:100%;
    height: auto;
    position: relative;
  }
  .addImg-bg{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 20px;
    line-height: 60px;
    text-align: center;
    display: flex;
    justify-content: space-around;
  }
  .add-bottom{
    width: 100%;
    height: auto;
  }
  .tableData2Icon {
    margin-top: 10px;
    font-size:18px;
  }

  .tableData2Icon span:nth-child(1) {
    padding: 3px 10px 3px 10px;
    line-height: 20px;
    border: 1px solid green;
    display: inline-block;
    color: green;
  }

  .tableData2Icon span:nth-child(2) {
    padding: 3px 10px 3px 10px;
    line-height: 20px;
    border: 1px solid gray;
    display: inline-block;
    color: gray;
  }
  .tableData2Icon span:nth-child(3) {
    padding: 3px 10px 3px 10px;
    line-height: 20px;
    border: 1px solid #149bd3;
    display: inline-block;
    color: #149bd3;
  }
  .audit-item {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    margin: 5px auto;
    padding-right: 5px;
    padding-left: 5px;
    font-size:18px;
  }

  .audit-item p {
    width: 90%;
  }

  .audit-item span {
    white-space: nowrap;
    margin: 0 auto;
    margin-left: 0;
    margin-right: 0;
  }

  .audit-item p {
    width: 65%;
  }
</style>
