<template>
  <div style="padding:0px 20px">
    <el-form label-width="100px" style="width:60%" :model="form" class="demo-form-inline">
      <div v-if="$route.query.type=='view' && form.list.length <=1 && !form.list[0].id"
           style="width: 100%;text-align: center;color:lightgrey"><span>暂无数据</span>
      </div>
      <div v-if="!form.list[0].id && $route.query.type!='view'" style="padding-top: 40px">
        <el-button style="margin-left: 50px" type="text">
          <span style="color:#8391a5">建设进度中暂无照片引用</span>
        </el-button>
        <el-button style="margin-left:50px"
                   @click="goHouseAudit"
                   type="primary">
          <span>马上去引用报告</span>
        </el-button>
      </div>
      <div
        style="border-bottom: 1px solid #ccc;margin-bottom: 20px;padding-bottom: 20px;position: relative;padding-top: 30px"
        v-for="(item,index) in form.list" v-show="item.isShow" :key="index">
        <el-button style="position: absolute;right: 0;top: 0" type="text"
                   :disabled="$route.query.type!='view' && item.build_show"
                   v-if="$route.query.type!='view'"
                   @click="deleteList(index)"><span>删除</span>
        </el-button>
        <el-button style="position: absolute;right:50px;top: 0" type="text"
                   :disabled="$route.query.type!='view' && !item.build_show"
                   v-if="$route.query.type!='view'"
                   @click="build_show_change(index)"><span>编辑</span>
        </el-button>
        <el-form-item label="类别选择" required>
          <el-select v-if="$route.query.type!='view' && !item.build_show" size="small" v-model="item.typeId"
                     @change="save_show(index)"
                     :disabled="item.build_show"
                     style="width:200px;">
            <el-option label="整体进度" value="1"></el-option>
            <el-option label="园区进度" value="2"></el-option>
            <el-option label="楼栋进度" value="3"></el-option>
          </el-select>
          <span v-else>{{item.typeId == 3 ? '楼栋进度' : item.typeId == 2 ? '园区进度' : '整体进度'}}</span>
        </el-form-item>
        <el-form-item label="整体描述">

          <el-input v-if="$route.query.type!='view' && !item.build_show" type="text" size="small"
                    v-model="item.wholeDesc"
                    :disabled="item.build_show"
                    placeholder="整体描述(请输入0-50字)" :maxlength="50" @change="save_show(index)"></el-input>
          <span v-else>{{item.wholeDesc}}</span>
        </el-form-item>
        <el-form-item label="整体描述" v-show="false">
          <el-input v-if="$route.query.type!='view'" type="textarea" size="small" v-model="item.wholeDesc"
                    :disabled="a"
                    placeholder="整体描述(请输入0-50字)" :maxlength="50" @change="save_show(index)"></el-input>
          <span v-else>{{item.wholeDesc}}</span>
        </el-form-item>
        <div v-for="(item2,num) in item.picList">
          <div style="text-align: right">
            <el-button style=""
                       type="text"
                       @click="cancelQuote(index,num)"
                       v-show="item2.picId">
              <span v-show="$route.query.type!='view'">取消引用</span>
            </el-button>
          </div>
          <el-form-item v-if="item.typeId == 3" label="楼栋号"
                        required>
            <el-select v-if="$route.query.type!='view' && !item.build_show" size="small"
                       @change="save_show(index)"
                       v-model="item2.buildingNum"
                       style="width:200px;">
              <el-option v-for="(iten,num) in getBuildingList" :label="iten.id" :value="iten.id"></el-option>
            </el-select>
            <span v-if="item.build_show">{{item2.buildingNum}}</span>
          </el-form-item>
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
            <!--&lt;!&ndash;:isShowDelete="!item.build_show"&ndash;&gt; 是否显示删除按钮-->
            <!--隐藏重新上传-->
            <ImgUploader2
              :btnId="btnList[index][num]"
              @imgUploader="imgUploader(index,num)"
              v-show="$route.query.type!='view' && !item.build_show && !item2.picId"
              :btnName="item2.btnNames"
            />

          </el-form-item>

          <el-form-item label="图片描述"
                        style="width:60%;height:148px;display: inline-block;vertical-align: top;">

            <el-input v-if="$route.query.type!='view' && !item.build_show"
                      type="textarea"
                      style="width: 100%;height: 100%;"
                      resize="none"
                      :rows="6"
                      :disabled="item.build_show"
                      v-model="item.picList[num].picDesc"
                      placeholder="图片描述(请输入0-50字)" :maxlength="50" @change="save_show(index)"></el-input>
            <span v-else>{{item.picList[num].picDesc}}</span>
          </el-form-item>
        </div>
        <div>
          <el-button style="margin-left: 100px" type="text" @click="addImgData(index)"
                     v-if="$route.query.type!='view' && item.post_img"
          >
            <span>继续添加图片</span>
          </el-button>
          <!--<el-button style="" type="text" @click="deleteImgData(index)" v-if="$route.query.type!='view'"-->
                     <!--v-show="item.picList.length > 1 && item.post_img">-->
            <!--<span>删除一组图片</span>-->
          <!--</el-button>-->
          <el-button style="margin-left:100px" type="primary" @click="onSubmit(index)"
                     :disabled="!item.onSubmit_button" v-if="$route.query.type!='view' && item.onSubmit_button">
            <span>保存</span>
          </el-button>
        </div>
      </div>
      <el-button style="margin-left: 100px" type="text" v-if="$route.query.type!='view'"
                 @click="addList">
                 <!-- 禁用 -->
                 <!-- :disabled="$route.query.type!='view' && !new_"  -->
        <span>继续新的进度信息</span>
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
        a: true,
        new_: true,
        tabLoading: true,
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
        id: '',
        btnList: [],
        houseNum: null,
        getBuildingList: [],
        save: null,
        imgs: [],
        form: {
          list: [
            {
              isShow: true,
              wholeDesc: '',
              build_show: false,
              post_img: true,
              onSubmit_button: true,
              buildingConstructionReportId: '',
              id: '',
              typeId: '',
              buildingNum: '',
              lableType: '1',
              picList: [
                {
                  picDesc: '',
                  btnNames: '点击上传',
                  picUrl: '',
                  picId: '',
                  area:'',
                  scoreLable:'',
                  scoreConfig:'',
                  userName:'',
                  picTime:'',
                  examine:'',
                  examineTime:'',
                }
              ]
            }
          ]
        }
      }
    },
    created(){
      if (this.$route.query.type == 'view' && this.form.list.length <= 1 && !this.form.list[0].id) {
        this.form.list[0].isShow = false;
      }
      bus.$on('tip', (text) => {
        switch (text) {
          case '1': {
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
      if (this.$route.query.type == 'add') {
        this.initAddData();
        this.initUploader(0, 0);
      } else {
        this.initAddData();
        this.getData();
      }
    },
    computed: {
      ...mapState({
        reportId: state => state.estate.reportId,
      })
    },
    beforeRouteUpdate (to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      alert(this);
    },
    methods: {
      initAddData()
      {
        this.btnList.push(['Btn00']);
        this.cs.push({
          preImgSrcList: [{picUrl: ''}],
          uploaderList: [{uploader: null}]
        });
      },
      addImgData(index){
        let len = this.form.list[index].picList.length;
        this.save_show(index);
        this.btnList[index].push(`Btn${index}${len}`);
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
              this.getData();

            }
          })
        }).catch(() => {

        })
      },
      //跳转楼盘
      goHouseAudit(){
        let buildId = "";
        if(this.$route.query.buildingId){
          buildId = this.$route.query.buildingId;
        }else if(this.$route.query.tab.buildingId){
          buildId = this.$route.query.tab.buildingId;
        }
        let routeData = this.$router.resolve({
            path: '/monitoring/houseAudit',
            params: {
                id: buildId,
                name: this.$route.query.buildingName
          },
           query: {
                id: buildId,
                name: this.$route.query.buildingName
          }
        });
        window.open(routeData.href, '_blank');
      },
      addList(){
        let len = this.form.list.length;
        this.btnList.push([`Btn${len}0`]);
        this.cs.push({
          preImgSrcList: [{picUrl: ''}],
          uploaderList: [{uploader: null}]
        });
        this.form.list.push({
          isShow: true,
          wholeDesc: '',
          typeId: '',
          lableType: '1',
          build_show: false,
          onSubmit_button: true,
          post_img: true,
          buildingConstructionReportId: '',
          id: '',
          picList: [
            {
              buildingNum: '',
              picDesc: '',
              picUrl: '',
              picId: '',
              area:'',
              scoreLable:'',
              scoreConfig:'',
              userName:'',
              picTime:'',
              examine:'',
              examineTime:'',
            }
          ]
        });
        this.initUploader(len, 0)
      },
      deleteList(index){
        if (this.form.list[index].id) {
          let body = {};
          body.id = this.form.list[index].id;
          if (this.reportId) {
            body.buildingConstructionReportId = this.reportId;
          } else {
            body.buildingConstructionReportId = this.$route.query.tab.id;
          }
          body.lableType = '1';
          this.tabLoading = true;
          let arrs = [];
          for(let i in this.form.list[index].picList){
            if(this.form.list[index].picList[i].picId){
              arrs.push(this.form.list[index].picList[i].picId);
            }
          }
          body.picId = arrs.slice(',').join(',');
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
      getData(text){
        this.$store.dispatch('contrationLoadingAction', true);
        let body = {};
        body.id = this.$route.query.id;
        body.lableType = '1';
        this.tabLoading = true;
        this.$http('/buildingConstructionReport/queryConstructionListInfo', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            this.$store.dispatch('contrationLoadingAction', false);
            let a = res.data.response.list;
            if (a.length == 0) {
              this.form.list[0].isShow = false;
              this.form.list[0].id = "";
              this.initUploader(0, 0);
              this.form.list[0].picList = '';
              return;
            }
            this.form.list.length = 0;
            this.cs.shift();
            this.btnList.shift();
            for (let i in a) {
              a[i].isShow = true;
              this.form.list.push(a[i]);
              this.form.list[i].typeId = a[i].typeId.toString();
              this.form.list[i].id = a[i].id;
              this.form.list[i].build_show = true;
              this.form.list[i].post_img = false;
              this.form.list[i].onSubmit_button = false;
              if (this.form.list[i].typeId == '3') {
                this.getHouse();
                this.houseNum = i;
              } else {
                this.houseNum = null;
              }
              let len = this.form.list.length;
              this.btnList.push([`Btn${len}`]);
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
                this.btnList[i].push(`Btn${i}${len}`);
                if (!text && this.$route.query.type != 'view') {
                  this.initUploader(i, len);
                }
              }
            }
            //
          }
          console.log(this.form, this.cs, this.btnList);
        })
      },
      //楼盘景观图-插件初始化
      initUploader(index, num){
        let _this = this,
          btnName = 'Btn' + index + num;
        uploader2(function (src) {
          _this.cs[index].preImgSrcList[num].picUrl = src;
          _this.form.list[index].picList[num].btnNames = '重新上传';
          _this.save_show(index);
        }, function (key) {
          _this.form.list[index].picList[num].picUrl = key;
        }, function () {
          _this.cs[index].preImgSrcList[num].picUrl = '';
        }, function (uploader) {
          _this.cs[index].uploaderList[num].uploader = uploader;
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
      previewImg(index, num){
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
        console.log(index,num);
      },

      //楼盘效果图-删除
      deleteImg(index, num){
        this.save = index;
        this.cs[index].preImgSrcList[num].picUrl = '';
        this.form.list[index].picList[num].picUrl = '';
        this.form.list[index].picList[num].btnNames = '点击上传';
      },
      //获取楼栋号
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
      onSubmit(index){
        let swi = true, f = _.cloneDeep(this.form.list[index]);
        delete f.isShow;

        if (f.typeId == '') {
          swi = false;
        }

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
            url;
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
              this.save = null;
              this.a = !this.a;
              if (this.$route.query.type != 'view') {
                this.form.list[index].build_show = true;
                this.form.list[index].post_img = false;
                this.form.list[index].onSubmit_button = false;
                this.new_ = true;
              } else {
                this.form.list[index].post_img = true;
              }

              message(this, '提交成功', 'success');

              if (!this.form.list[index].id) {
                this.form.list[index].id = res.data.response.id;
              }
              for (let i in res.data.response.picList) {
                this.form.list[index].picList[i].id = res.data.response.picList[i].id;
              }
            }
          })
        }).catch(() => {

        })
      },
      build_show_change(index){
        this.form.list[index].build_show = false;
        this.form.list[index].post_img = true;
        this.form.list[index].onSubmit_button = true;
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

        if (this.form.list[index].typeId == '3') {
          this.getHouse();
          this.houseNum = index;
        } else {
          this.houseNum = null;
        }
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
