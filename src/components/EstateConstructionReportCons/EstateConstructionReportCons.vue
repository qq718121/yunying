<template>
  <div style="padding:0px 20px">
    <el-form label-width="100px" style="width:60%" :model="form" class="demo-form-inline">
      <div v-if="$route.query.type=='view' && form.list.length <=1 && !form.list[0].id && buildingId2 == true"
           style="width: 60%;text-align: center;color:lightgrey"><span>暂无数据</span>
      </div>
      <div v-if="!form.list[0].id && $route.query.type!='view'" style="padding-top: 40px">
        <el-button style="margin-left: 50px" type="text" @click=""
                   v-if=""
        >
          <span style="color:#8391a5">施工现场中暂无照片引用</span>
        </el-button>
        <el-button style="margin-left:50px"
                   @click="goHouseAudit"
                   type="primary">
          <span>马上去引用报告</span>
        </el-button>
      </div>
      <div :class="buildingId2 == true? 'addClass' : ''"
        v-for="(item,index) in form.list" v-show="item.isShow" :key="index">
        <el-button style="position: absolute;right: 0;top: 0" type="text" @click="deleteList(index)"
                   :disabled="$route.query.type!='view' && item.build_show"
                   v-if="$route.query.type!='view' && buildingId2 == true"><span>删除</span>
        </el-button>
        <el-button style="position: absolute;right:50px;top: 0" type="text"
                   v-if="$route.query.type!='view' && buildingId2 == true"
                   :disabled="$route.query.type!='view' && !item.build_show"
                   @click="build_show_change(index)"><span>编辑</span>
        </el-button>
        <div class="change" @click="save_show(index)">
          <el-form-item label="类别选择" required>
            <el-cascader
              expand-trigger="hover"
              :options="item.options"
              v-model="item.selectedOptions2"
              v-if="$route.query.type!='view' && !item.build_show"
              style="width:100%;"
              ref="haha"
            >
            </el-cascader>
            <div v-else>
              <span>{{item.tp_d}}</span>
              <span v-if="item.me_d">{{'/' + item.me_d }}</span>
              <span v-if="item.mc_d">{{'/' + item.mc_d}}</span>
              <span v-if="item.mg_d">{{'/' + item.mg_d}}</span>
            </div>
          </el-form-item>
        </div>

        <el-form-item label="整体描述" v-show="buildingId2 == true">
          <el-input v-if="$route.query.type!='view' && !item.build_show" type="text" size="small"
                    v-model="item.wholeDesc"
                    :disabled="item.build_show"
                    placeholder="整体描述(请输入0-50字)" :maxlength="50" @change="save_show(index)"></el-input>
          <span v-else>{{item.wholeDesc}}</span>
        </el-form-item>
        <el-form-item label="整体描述" v-show="false">
          <el-input v-if="$route.query.type!='view'" type="text" size="small" v-model="item.wholeDesc"
                    :disabled="a"
                    placeholder="整体描述(请输入0-50字)" :maxlength="50" @change="save_show(index)"></el-input>
          <span v-else>{{item.wholeDesc}}</span>
        </el-form-item>
        <div v-for="(item2,num) in item.picList"  v-show="buildingId2 == true">
          <div style="text-align: right">
            <el-button style=""
                       type="text"
                       @click="cancelQuote(index,num)"
                       v-show="item2.picId">
              <span v-show="$route.query.type!='view'">取消引用</span>
            </el-button>
          </div>
          <el-form-item :label="'添加图片'+(num+1)"
                        label-width="110px"
                        style="display: inline-block;"
                        required>
            <ImgPreview
              :backgroundPicUrl="cs[index].preImgSrcList[num].picUrl"
              @previewImg="previewImg(index,num)"
              @deleteImg="deleteImg(index,num)"
              :isShowDelete="false"
            />
            <ImgUploader2
              :btnId="btnList[index][num]"
              @imgUploader="imgUploader(index,num)"
              v-show="$route.query.type!='view' && !item.build_show && !item2.picId"
              :btnName="item2.btnNames"
            />
          </el-form-item>

          <el-form-item label="图片描述"
                        style="width: 60%;height:148px;display: inline-block;vertical-align: top;">

            <el-input v-if="$route.query.type!='view' && !item.build_show" @change="save_show(index)"
                      type="textarea"
                      resize="none"
                      :rows="6"
                      :disabled="item.build_show"
                      v-model="item.picList[num].picDesc" placeholder="图片描述(请输入0-50字)" :maxlength="50"></el-input>
            <span v-else>{{item.picList[num].picDesc}}</span>
          </el-form-item>
        </div>
        <div v-show="buildingId2 == true">
          <el-button style="margin-left: 100px" type="text" @click="addImgData(index)"
                     v-if="$route.query.type!='view' && item.post_img">
            <span>继续添加图片</span>
          </el-button>
          <!--<el-button style="" type="text" @click="deleteImgData(index)" v-if="$route.query.type!='view'"-->
                     <!--v-show="item.picList.length > 1 && item.post_img">-->
            <!--<span>删除一组图片</span>-->
          <!--</el-button>-->
          <el-button style="margin-left:100px" type="primary" @click="onSubmit(index)"
                     :disabled="item.onSubmit_button" v-if="$route.query.type!='view'  && !item.onSubmit_button">
            <span>保存</span>
          </el-button>
        </div>
      </div>
      <el-button style="margin-left: 100px" type="text" @click="addList" v-if="$route.query.type!='view' && new_ && buildingId2 == true">
        <span>添加新的监测点信息</span>
      </el-button>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <div class="addImg">
        <img width="100%" :src="dialogImgSrc" alt="">
        <div class="addImg-bg" v-if="dialogContVisible">{{ area }}</div>
      </div>
      <div class="add-bottom" v-if="dialogContVisible">
        <div class="tableData2Icon">
          <span>{{ scoreLable }}</span>
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
  import uploader2 from '../../common/uploader2.js';
  import ImgPreview from '../Common/ImgPreview/ImgPreview';
  import ImgUploader2 from '../Common/ImgUploader2/ImgUploader2';
  export default{
    name: 'EstateConstructionReportTab',
    props: {
      buildingId: {
        default: ''
      },
      _buildingId2:{ // 添加 false 会因隐藏部分功能
        default:true
      }
    },
    components: {
      ImgUploader2,
      ImgPreview
    },
    data(){
      return {
        buildingId2:true,
        a: true,
        new_: true,
        b_save: null,
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
        houseNum: null,
        save: null,
        getBuildingList: [],
        btnList: [],
        options: [],
        selectedOptions: [],
        selectedOptions2: [],
        form: {
          list: [
            {
              tp_d: '',
              me_d: '',
              mc_d: '',
              mg_d: '',
              onSubmit_button: false,
              isShow: true,
              typeId: '',
              build_show: false,
              post_img: true,
              typeIdText: '',
              wholeDesc: '',
              options: [],
              selectedOptions: [],
              selectedOptions2: [],
              lableType: '2',
              picList: [
                {
                  picDesc: '',
                  picUrl: '',
                  btnNames: '点击上传',
                  buildingNum: '',
                  area:'',
                  scoreLable:'',
                  scoreConfig:'',
                  userName:'',
                  picTime:'',
                  examine:'',
                  examineTime:'',//dialog
                }
              ]
            }
          ]
        },
      };
    },
    created(){
      this.buildingId2 = this._buildingId2
      this.get_type(0);
      bus.$on('tip', (text) => {
        switch (text) {
          case '2': {
            this.form.list.length = 0;
            this.cs.length = 0;
            this.btnList.length = 0;
            this.getData(text);
            break;
          }
          default:
            break;
        }
      });
      let this_ = this;
      if (this_.$route.query.type == 'add') {
        this_.initAddData();
        this_.initUploader(0, 0);
        this_.form.list[0].options = this_.options;
      } else {
        this_.initAddData();
      }
      if (this.$route.query.type == 'view' && this.form.list.length <= 1 && !this.form.list[0].id) {
        this.form.list[0].isShow = false;
      }
    },
    computed: {
      ...mapState({
        reportId: state => state.estate.reportId,
      }),
    },
    methods: {
      f_typeId_change(ar_d, id, i, num){
        ar_d.map((it_1, ind) => {
          if (id == it_1.value) {
            this.form.list[i].tp_d = it_1.label;
            return;
          } else {
            if (!id && num == 1) {
              this.form.list[i].me_d = '';
            } else {
              if (it_1.children) {
                it_1.children.map(it_2 => {
                  if (id == it_2.value) {
                    this.form.list[i].me_d = it_2.label;
                    return;
                  } else {
                    if (!id && num == 2) {
                      this.form.list[i].mc_d = '';
                    } else {
                      if (it_2.children) {
                        it_2.children.map(it_3 => {
                          if (id == it_3.value) {
                            this.form.list[i].mc_d = it_3.label;
                            return;
                          } else {
                            if (!id && num == 3) {
                              this.form.list[i].mg_d = '';
                            } else {
                              if (it_3.children) {
                                it_3.children.map(it_4 => {
                                  if (id == it_4.value) {
                                    this.form.list[i].mg_d = it_4.label;
                                    return;
                                  }
                                });
                              }
                            }
                          }
                        });
                      }
                    }
                  }
                });
              }
            }
          }
        });
      },

      initAddData(){
        this.btnList.push(['CBtn00']);
        this.cs.push({
          preImgSrcList: [{picUrl: ''}],
          uploaderList: [{uploader: null}]
        });
      },

      addImgData(index){
        let len = this.form.list[index].picList.length;
        this.save = index;
        this.btnList[index].push(`CBtn${index}${len}`);
        this.cs[index].uploaderList.push({uploader: null});
        this.cs[index].preImgSrcList.push({picUrl: ''});
        this.form.list[index].picList.push({
          picUrl: ''
        });
        this.initUploader(index, len);
      },
      deleteImgData(index){
        this.save = null;
        this.btnList[index].pop();
        this.cs[index].uploaderList.pop();
        this.cs[index].preImgSrcList.pop();
        this.form.list[index].picList.pop();
        this.save_show(index);
      },
      addList(){
        let len = this.form.list.length;
        this.btnList.push([`CBtn${len}0`]);
        this.cs.push({
          preImgSrcList: [{picUrl: ''}],
          uploaderList: [{uploader: null}]
        });
        this.form.list.push({
          isShow: true,
          wholeDesc: '',
          build_show: false,
          post_img: true,
          typeId: '',
          lableType: '2',
          buildingConstructionReportId: '',
          id: '',
          options: [],
          selectedOptions2: [],
          picList: [
            {
              picDesc: '',
              buildingNum: '',
              picUrl: '',
              area:'',
              scoreLable:'',
              scoreConfig:'',
              userName:'',
              picTime:'',
              examine:'',
              examineTime:'',//dialog
            }
          ]
        });

        this.form.list[len].options = this.options;
        this.initUploader(len, 0);
      },
      deleteList(index){
        if (this.form.list[index].id) {
          let body = {};
          body.id = this.form.list[index].id;
          if (this.reportId) {
            body.buildingConstructionReportId = this.reportId;
          } else {
            body.buildingConstructionReportId = this.$route.query.id;
          }
          let arrs = [];
          for(let i in this.form.list[index].picList){
             if(this.form.list[index].picList[i].picId){
              arrs.push(this.form.list[index].picList[i].picId);
            }
          }
          body.picId = arrs.join(',');
          body.lableType = '1';
          this.tabLoading = true;
          this.$http('/buildingConstructionReport/delConstructionInfo', {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              this.form.list[index].isShow = false;
              this.form.list[index].id = '';
              this.new_ = true;
              message(this, '删除成功', 'success');
            }
            this.tabLoading = false;
          })
        } else {
          this.form.list[index].isShow = false;
        }
      },
      // 取消引用
      cancelQuote(index,num){
        this.$confirm('确认提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let [_this,body] = [this,{}];
          body.picId = this.form.list[index].picList[num].picId;
          body.id = this.form.list[index].picList[num].id;
          body.buildingConstructionInfoId = this.form.list[index].picList[num].buildingConstructionInfoId;
          body.buildingConstructionReportId = this.form.list[index].buildingConstructionReportId;
          this.$http('/buildingCamera/cancelQuotePhoto', {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              message(this, '取消成功', 'success');
              this.getData(index);
            }
          })
        }).catch(() => {

        })
      },
      //跳转楼盘
      goHouseAudit(){
        this.$router.push({
          path: '/monitoring/houseAudit',
          query: {
            id: this.$route.query.tab.buildingId,
            name: this.$route.query.buildingName
          }
        })
      },
      getHouse(){
        let url = '/buildingConstructionReport/getBuildingNum';
        let body = {};
        body.buildingId = this.$route.query.buildingId;
        this.$http(url, {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            this.getBuildingList = res.data.response.list;
          }
        })
      },
      get_type(index){
        let url = '/buildingConstructionReport/constructionSourceInfo';
        let body = {};
        body.sourceType = '2';
        this.$http(url, {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            for (let i in res.data.response.list) {
              this.options.push({
                value: res.data.response.list[i].key,
                label: res.data.response.list[i].value
              });
            }
            this.get_type_three(0);
          }
        })
      },

      get_type_three(index){
        let url = '/buildingContribution/querySourceListInfo';
        let body = {};
        body.sourceStatus = '1';
        this.$http(url, {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            for (let i in this.options) {
              if (i == 0) {
              } else {
                if (res.data.response.list.length > 0) {
                  this.options[i].children = [];
                }
                for (let j in  res.data.response.list) {
                  this.options[i].children.push({
                    value: res.data.response.list[j].menuId,
                    label: res.data.response.list[j].menuName,
                  });
                  if (res.data.response.list[j].menuChildList.length > 0) {
                    this.options[i].children[j].children = [];
                  }
//                  this.options[i].children[j].children = [];
                  for (let b in res.data.response.list[j].menuChildList) {
                    this.options[i].children[j].children.push({
                      value: res.data.response.list[j].menuChildList[b].menuChildId,
                      label: res.data.response.list[j].menuChildList[b].menuChildName,
                    });
                    if (res.data.response.list[j].menuChildList[b].menuGrandList.length > 0) {
                      this.options[i].children[j].children[b].children = [];
                    }
//                    this.options[i].children[j].children[b].children = [];
                    for (let c in res.data.response.list[j].menuChildList[b].menuGrandList) {
                      this.options[i].children[j].children[b].children.push({
                        value: res.data.response.list[j].menuChildList[b].menuGrandList[c].menuGrandId,
                        label: res.data.response.list[j].menuChildList[b].menuGrandList[c].menuGrandName,
                      });
                    }
                  }
                }
              }
            }
            if (this.$route.query.type != 'add') {
              this.getData();
            }
          }
        })
      },

      getData(text){
        this.$store.dispatch('contrationLoadingAction', true);
        let body = {};
        body.id = this.$route.query.id;
        body.lableType = '2';
        this.tabLoading = true;
        this.$http('/buildingConstructionReport/queryConstructionListInfo', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            let a = res.data.response.list;
            this.$store.dispatch('contrationLoadingAction', false);
            if (a.length == 0) {
              this.initUploader(0, 0);
              this.form.list[0].isShow = false;
              this.form.list[0].id = "";
              // this.form.list[0].options = this.options;
              this.form.list[0].picList = '';
              return;
            }
            this.form.list.length = 0;
            this.cs.shift();
            this.btnList.shift();
            for (let i in a) {
              a[i].isShow = true;
              this.form.list.push(a[i]);
              this.form.list[i].typeId = a[i].typeId;
              this.form.list[i].options = this.options;
              this.form.list[i].onSubmit_button = true;
              this.form.list[i].build_show = true;
              this.form.list[i].post_img = false;

              if (a[i].typeId != 4) {
                this.form.list[i].selectedOptions2 = [
                  a[i].typeId * 1,
                  a[i].menuId ? a[i].menuId.toString() : '',
                  a[i].menuChildId ? a[i].menuChildId.toString() : '',
                  a[i].menuGrandId ? a[i].menuGrandId.toString() : ''
                ];
              } else {
                this.form.list[i].selectedOptions2 = [
                  a[i].typeId * 1,
                  '',
                  '',
                  ''
                ];
              }
              this.f_typeId_change(this.form.list[i].options, this.form.list[i].selectedOptions2[0], i, 0);
              this.f_typeId_change(this.form.list[i].options, this.form.list[i].selectedOptions2[1], i, 1);
              this.f_typeId_change(this.form.list[i].options, this.form.list[i].selectedOptions2[2], i, 2);
              this.f_typeId_change(this.form.list[i].options, this.form.list[i].selectedOptions2[3], i, 3);

              let len = this.form.list.length;
              this.btnList.push([`CBtn${len}`]);
              this.cs.push({
                preImgSrcList: [{picUrl: ''}],
                uploaderList: [{uploader: null}]
              });
              this.cs[i].preImgSrcList.pop();
              this.cs[i].uploaderList.pop();
              this.btnList[i].shift();
              for (let j in a[i].picList) {
                let len = this.cs[i].preImgSrcList.length;
                this.cs[i].preImgSrcList.push({picUrl: a[i].picList[j].picUrl});
                this.cs[i].uploaderList.push({uploader: null});
                this.btnList[i].push(`CBtn${i}${len}`);
                if (!text && this.$route.query.type != 'view') {
                  this.initUploader(i, len);
                }
              }
            }
          }
        })
      },

      //楼盘景观图-插件初始化
      initUploader(index, num){
        let _this = this,
          btnName = 'CBtn' + index + num;
        uploader2(function (src) {
          _this.cs[index].preImgSrcList[num].picUrl = src;
          _this.form.list[index].picList[num].btnNames = '重新上传';
          _this.save = index;
        }, function (key) {
          _this.form.list[index].picList[num].picUrl = key;
        }, function () {
          _this.cs[index].preImgSrcList[num].micUrl = '';
        }, function (uploader) {
          _this.cs[index].uploaderList[num].uploader = uploader
        }, btnName, false)
      },

      //楼盘景观图-开始上传
      imgUploader(index, num){

        if (this.cs[index].uploaderList[num].uploader == null) {
          return;
        }
        this.cs[index].uploaderList[num].uploader.start();
      },

      //楼盘效果图-预览
      previewImg(index, num)
      {
        this.dialogImgSrc = this.cs[index].preImgSrcList[num].picUrl;
        if(this.form.list[index].picList[num]){
          this.dialogContVisible = true;
          this.area = this.form.list[index].picList[num].area;
          this.scoreLable = this.form.list[index].picList[num].scoreLable;
          this.scoreConfig = this.form.list[index].picList[num].scoreConfig;
          this.userName = this.form.list[index].picList[num].userName;
          this.examine =this.form.list[index].picList[num].examine;
          this.examineTime = this.form.list[index].picList[num].examineTime;
        }else{
          this.dialogContVisible = false;
        }


        this.dialogVisible = true;
      },

      //楼盘效果图-删除
      deleteImg(index, num){
        this.save = index;
        this.cs[index].preImgSrcList[num].picUrl = '';
        this.form.list[index].picList[num].picUrl = '';
        this.form.list[index].picList[num].btnNames = '点击上传';
      },

      onSubmit(index){
        console.log(this.form.list[index]);
        let swi = true, f = _.cloneDeep(this.form.list[index]);
        delete f.isShow;
        for (var j in f.picList) {
          if (f.picList[j].picUrl == '') {
            swi = false;
            break;
          }
          if (f.typeId == '3') {
            if (!f.picList[j].buildingNum) {
              swi = false;
              break;
            }
          }
        }
        console.log(this.form.list[index].selectedOptions2);
        if(this.form.list[index].selectedOptions2.length <= 0){
          swi = false;
        }

        if (!swi) {
          message(this, '有必填项未填写', 'warning')
          return
        }

        this.$confirm('确认提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let body = _.cloneDeep(this.form.list[index]),
            sec_op = this.form.list[index].selectedOptions2,
            url;
          body.typeId = sec_op[0] ? sec_op[0] : '';
          body.menuId = sec_op[1] ? sec_op[1] : '';
          body.menuChildId = sec_op[2] ? sec_op[2] : '';
          body.menuGrandId = sec_op[3] ? sec_op[3] : '';
          delete body.options;
          delete body.selectedOptions2;
          delete body.tp_d;
          delete body.me_d;
          delete body.mc_d;
          delete body.mg_d;

          if (!this.form.list[index].id) {
            url = '/buildingConstructionReport/insertConstructionInfo';
            if (this.reportId) {
              body.buildingConstructionReportId = this.reportId;
            } else {
              body.buildingConstructionReportId = this.$route.query.id;
            }
          } else {
            url = '/buildingConstructionReport/updateConstructionInfo';
            body.id = this.form.list[index].id;
          }

          this.$http(url, {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              let a_list = this.form.list[index];
              this.a = !this.a;
              this.save = null;
              if (this.$route.query.type != 'view') {
                a_list.build_show = true;
                a_list.post_img = false;
                a_list.onSubmit_button = true;
                this.new_ = true;
              } else {
                a_list.post_img = true;
              }
              message(this, '提交成功', 'success');
              if (!a_list.id) {
                a_list.id = res.data.response.id;
              }
              for (let i in res.data.response.picList) {
                a_list.picList[i].id = res.data.response.picList[i].id;
              }
              this.form.list.map((item, index) => {
                let ar_opt = this.form.list[index].options;
                let ar_sep = this.form.list[index].selectedOptions2;
                this.f_typeId_change(ar_opt, ar_sep[0], index, 0);
                this.f_typeId_change(ar_opt, ar_sep[1], index, 1);
                this.f_typeId_change(ar_opt, ar_sep[2], index, 2);
                this.f_typeId_change(ar_opt, ar_sep[3], index, 3);
              });
            }
          })
        }).catch(() => {

        })
      },
      build_show_change(index){
        this.form.list[index].build_show = false;
        this.form.list[index].post_img = true;
        this.form.list[index].onSubmit_button = false;
        this.a = !this.a;
        this.new_ = false;
        for (let i in this.form.list[index].picList) {
          if (this.form.list[index].picList[i].id) {
            this.form.list[index].picList[i].btnNames = '重新上传';
          }
        }
      },
      save_show(index){
        if (this.save !== index) {
          this.save = index;
        }
      },
      handleChange(value) {

      }
    }
  }
</script>
<style scoped>
  .addClass{
    border-bottom: 1px solid #ccc;margin-bottom: 20px;padding-bottom: 20px;position: relative;padding-top: 30px
  }

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
