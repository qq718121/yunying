<template>
  <el-card class="ex-item">
    <el-tag type="info" class="tag" v-if="type==1">待审核</el-tag>
    <el-tag type="info" class="tag" color="#169BD5" size="medium" v-if="data.isUserUpload==1">用户上传</el-tag>
    <el-tag type="danger" class="tag" v-if="type==3">未通过</el-tag>
    <el-row style="padding-left:0px;">
      <el-row style="font-size: 12px;color: #777;margin-top:20px;">
        <el-col :span="10">
          位置信息：{{data.buildingName}}
          <span v-if="data.locationType == 1">(自动定位)</span>
          <span v-else>(手动选择)</span>
        </el-col>
        <el-col v-if="data.isVideo == 2 || !data.isVideo" :span="10">
          照片类型：{{data.menuName}}
        </el-col>
        <el-col v-else :span="10">
          视频类型：{{data.menuName}}
        </el-col>
      </el-row>
      <el-row v-if="data.isVideo == 2 || !data.isVideo" style="font-size: 12px;color: #777;margin-top:5px;">
        <!-- <el-col :span="10">照片分类：{{data.menuSecondName}}</el-col> -->
        <el-col :span="10">标题：{{data.describe}}</el-col>
      </el-row>
      <el-row v-else style="font-size: 12px;color: #777;margin-top:5px;">
        <!-- <el-col :span="10">视频分类：{{data.menuSecondName}}</el-col> -->
        <el-col :span="10">标题：{{data.describe}}</el-col>
      </el-row>
      <el-row style="font-size: 12px;color: #777;margin-top:5px;">
        <el-col :span="10">提交用户：{{data.userName}}{{data.userPhone}}</el-col>
        <el-col :span="10">提交时间：{{data.uploadTime}}</el-col>
      </el-row>
      <el-row style="font-size: 12px;color: #777;margin-top:5px;" v-if="type==2 || type == 3">
        <el-col :span="10">审核人：{{data.toExamineUserName}}</el-col>
        <el-col :span="10">审核时间：{{data.toExamineTime}}</el-col>
      </el-row>
      <el-row style="font-size: 12px;color: #777;margin-top:5px;">
        <el-col :span="15">分享内容：{{data.shareDesc}}</el-col>
      </el-row>
      <el-row style="font-size: 12px;color: #777;margin-top:5px;" v-if="type == 3">
        <el-col :span="15">未通过原因：{{data.rejectReason}}</el-col>
      </el-row>
      <el-row style="font-size: 12px;color: #777;margin-top:5px;" v-if="type==2">
        <el-col :span="10">
          是否编辑：
          <span v-if="data.isEdit==1 || !data.isEdit">否</span>
          <span v-else>是</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="data.buildingContributionPicsList.length >0">
        <el-col :span="6" v-for="(item,index) in data.buildingContributionPicsList" :key="index">
          <div class="img-container" :style="{backgroundImage:'url('+item.picUrl+')'}">
            <span class="remove_icon" v-if="item.picTagList.length > 0">
              <i></i>
            </span>
            <el-checkbox
              style="position: absolute;left: 10px;top: 10px;z-index: 3"
              v-if="checks[index] && type == 2"
              v-model="checks[index].checked"
              @change="checkChange(checks[index].id)">
            </el-checkbox>
            <div class="wap">
              <i class="el-icon-view ico" @click="viewImg(item.picUrl,index)"></i>
              <i class="addTag" @click="addTags(item.picUrl,index,item.id)" v-if="type == '1'">
                {{item.picTagList.length > 0 ? '点击编辑标签' : '点击添加标签'}}
                </i>
            </div>
          </div>
          <p style="text-align: center;font-size: 13px;color: #777;margin-top: 5px;">{{item.nearBuildingName}}</p>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-else>
        <el-col :span="6">
          <div class="video-in">
            <div class="video-tit">
              {{`${data.videoSize ? data.videoSize : '--'}  &nbsp;时长：${data.videoDuration ? data.videoDuration : '--'}`}}
            </div>
            <video style="width: 100%;height:320px;" :src="data.videoInfo.videoUrl" controls
                   :poster="data.videoInfo.videoPreImage"></video>
          </div>
        </el-col>
      </el-row>
      <el-row style="text-align: center;margin-top:20px;" v-if="type == 1">
        <el-button type="primary" size="small" @click="hande(1)">通过审核</el-button>
        <el-button size="small" @click="hande(2)">编辑审核</el-button>
      </el-row>
      <el-row style="text-align: center" v-if="type == 2">
        <el-button @click="hande(3)">编辑审核</el-button>
        <el-button type="danger" style="margin:50px 20px 20px" @click="rejectExamineDialog()">驳回</el-button>
        <el-button type="primary" style="margin:50px auto 20px" @click="f_isTop">{{f_top_btn}}</el-button>
        <!-- <el-button type="danger" 
            style="margin:50px auto 20px" 
            @click="addIsOnline">{{data.isOnline == 1? '下线' : '上线'}}</el-button> -->
      </el-row>
    </el-row>
    <!--通过审核-->
    <el-dialog title="审核" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="width: 50%;margin: 0 auto">
        <el-form-item label="勾选的照片会通过审核">
        </el-form-item>
        <el-form-item label="请选择其他照片的驳回理由：">
          <el-radio-group v-model="form.rejectReason"
                          :disabled="selects.length == data.buildingContributionPicsList.length">
            <el-radio label="1" class="raLab">照片包含违法信息</el-radio>
            <el-radio label="2" class="raLab">照片与主题无关</el-radio>
            <el-radio label="3" class="raLab">照片模糊不清</el-radio>
            <el-radio label="4" class="raLab">照片重复上传</el-radio>
            <el-radio label="5" class="raLab">同一问题重复提交</el-radio>
            <el-radio label="6" class="raLab">照片不符合收录要求</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="diaSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
        title="审核"
        :visible.sync="dialogVisibleReject"
        width="30%">
        <el-form>
            <el-form-item label="请选择驳回的理由:">
                <el-radio-group v-model="form.rejectReason">
                    <el-radio label="1" class="raLab">照片包含违法信息</el-radio>
                    <el-radio label="2" class="raLab">照片与主题无关</el-radio>
                    <el-radio label="3" class="raLab">照片模糊不清</el-radio>
                    <el-radio label="4" class="raLab">照片重复上传</el-radio>
                    <el-radio label="5" class="raLab">同一问题重复提交</el-radio>
                    <el-radio label="6" class="raLab">照片不符合收录要求</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleReject = false">取 消</el-button>
            <el-button type="primary" @click="rejectExamine()">确 定</el-button>
        </span>
        </el-dialog>

    <el-dialog @before-close="diaHander(2)" v-if="data.buildingContributionPicsList.length >0 && outerVisible"
         
               :visible.sync="outerVisible" >
      <div class="" v-show="isCha">
        <span style="display: inline-block" class="demonstration">照片显示比例：</span>
        <el-slider style="width: 300px;" v-model="scaleX"></el-slider>
      </div>
      <div style="margin-top: 20px" v-show="isCha">
        <el-button @click="dialogFormVisibles = true">添加更多标签</el-button>
      </div>
        <div style="overflow: auto;">
        <el-button style="float: right;margin-right: 10px" @click="subMitTag()" v-show="isCha">
          <span>保存编辑</span></el-button>
      </div>
      <div style="margin-top: 20px" v-show="isCha">
        <span>历史标签</span>
        <div class="historTag">
          <span
            v-for="(val,index) in tagSect" v-if="index < 4" :key="index" @click="cheTagHandler(val,index,val.tagType)">{{val.tagName}}</span>
        </div>
        <p style="margin-top: 20px" v-show="isCha">点击添加标签，拖拽调整位置,点击小圆点切换方向，点击X删除标签</p>
      </div>
      <div style="overflow: hidden;margin-top: 20px;">
        <div :style='`transform:scale(${scaleX/50},${scaleX/50});position: relative`'>
         <!-- @contextmenu.prevent="show1()" -->
          <span v-for="(val,index) in data.buildingContributionPicsList[dialogImgIndex].picTagList"
          :key="index"
                @mousedown="drop($event,index)"
                :class="data.buildingContributionPicsList[dialogImgIndex].picTagList[index].type == 1?'tags':'tagsH'"
                :id="`tagIs${index}`"
                :ref="`tagIs${index}`">
          <i :id="`lines${index}`"
             v-if="data.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection == 1"
             class="line_L"></i>
          <i :id="`lines${index}`" v-else class="line_"></i>
          <span v-show="isCha"
                v-if="data.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection == 2"
                class="tagClose" @click="removeTag(index)"><i>X</i></span>

          <span v-show="isCha" v-else class="tagClose1" @click="removeTag(index)"><i>X</i></span>
                          <i :id="`dots${index}`" @click="checkoutType(val,index)" v-if="

                data.buildingContributionPicsList[dialogImgIndex].picTagList[index].type == 1 &&
                 data.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection == 1

                " class="tagsIconL"></i>
                          <i :id="`dots${index}`" @click="checkoutType(val,index)" v-else-if="

                data.buildingContributionPicsList[dialogImgIndex].picTagList[index].type == 1 &&
                 data.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection != 1

                " class="tagsIconR"></i>
                          <i :id="`dots${index}`" @click="checkoutType(val,index)" v-else-if="

                data.buildingContributionPicsList[dialogImgIndex].picTagList[index].type != 1 &&
                 data.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection == 1

                " class="tagsHIconL"></i>

          <i :id="`dots${index}`" @click="checkoutType(val,index)" v-else class="tagsHIconR"></i>

          {{val.labelName}}
          </span>
          <img style="width:100%" :src="dialogImgSrc" alt="">
        </div>
      </div>
      <!--<div>-->
      <!--<el-button @click="subMitTag">保存编辑</el-button>-->
      <!--<el-button @click="closeDia">取消编辑</el-button>-->
      <!--</div>-->
    </el-dialog>
    <!--添加标签列表-->
    <el-dialog v-if="formArr.buildingContributionPicsList.length >0" title="" :visible.sync="dialogFormVisibles">
      <div class="checkoutTg">
        <p>问题点标注</p>
        <ul class="tagLists">
          <li v-for="(val,index) in tagNameList.qualityTagList" :key="index" @click="cheTagHandler(val,index,1)">{{val.tagName}}</li>
        </ul>
        <p>普通标签</p>
        <ul class="tagList">
          <li v-for="(val,index) in tagNameList.allTagList" :key="index" @click="cheTagHandler(val,index,2)">{{val.tagName}}</li>
        </ul>
      </div>
    </el-dialog>
    <el-dialog title="审核选中的视频" :visible.sync="dialogVideo">
      <el-form :model="form" style="width: 50%;margin: 0 auto">
        <el-form-item label="">
          <el-radio-group v-model="form.isPass" @change="videoRejectReasons">
            <el-radio label="2">审核通过</el-radio>
            <el-radio label="3">审核未通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="videoWhy" label="请选择其他照片的驳回理由：">
          <el-select
            clearable
            v-model="form.rejectReason"
            style="width:250px">
            <el-option
              label="视频与主题不符"
              value="视频与主题不符">
            </el-option>
            <el-option
              label="视频重复上传"
              value="视频重复上传">
            </el-option>
            <el-option
              label="视频不符合收录要求"
              value="视频不符合收录要求">
            </el-option>
            <el-option
              label="敏感视频包含违法信息"
              value="敏感视频包含违法信息">
            </el-option>
            <el-option
              label="视频不清晰"
              value="视频不清晰">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideo = false">取 消</el-button>
        <el-button type="primary" @click="diaSure">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import message from '../../../common/message';
  import ComGrap from '../ComGrap/comGrap.vue'
  import Qs from 'qs'
  export default {
    name: '',
    components: {ComGrap},
    props: {
      data: {
        default: {}
      },
      type: {
        default: '0'
      },
      dataSwi: {},
      geocoder: {
        default: null
      },
      TagList: {
        default: null
      },
      forms: {},
      page: {
        default: 1
      }
    },
    data(){
      return {
        dialogFormVisible: false,
        dialogImgIndex: 0,
        dialogVisible: false,
        dialogVideo: false,
        dialogFormVisibles: false,
        dialogVisibleReject:false,
        issub: false,
        isCha: true,
        videoWhy: false,
        dialogImgSrc: '',
        tagsClass: 'tagsH',
        tagsCloase: 'tagClose',
        scaleX: 50,
        checks: [],
        tagList: [{tagName: '11111111'}],
        outerVisible: false,
        innerVisible: false,
        selects: [],
        tagNameList: {},
        historTagLists: [],
        istop: 0,
        formArr: [],
        formArr_: [],
        allForms: {},
        tagSect: [],
        pages: 1,
        form1: {
          videoRejectReason: '0',
          menuChildIds: ''
        },
        form: {
          isPass: '',
          menuChildIds: '',
          buildingId: '',
          userId: '',
          id: '',
          menuId: '',
          isVideo: '',
          menuChildId: '',
          menuGrandId: '',
          isEdit: '1',
          picIds: '',
          rejectReason: '',
        },
        addPicId:'',
      }
    },

    created(){
      this.formArr = this.data;
      this.initSelect();
      this.istop = this.data.isTop;
      this.tagNameList = this.TagList;
      this.formArr_ = _.cloneDeep(this.formArr);
    },
    mounted(){
      let this_ = this;
      this.allForms = this.forms;
      this.pages = this.page;
      window.onresize = function () {
        this_.getTags();
      };
    },

    watch: {
      'dataSwi': {
        handler(val){
          this.initSelect();
        }
      },
      'data': {
        handler(){
          this.formArr = this.data;
          this.formArr_ = _.cloneDeep(this.formArr);
        }
      }
    },
    computed: {
      f_top_btn: function () {
        switch (this.data.isTop) {
          case 1 :
            return '取消置顶';
            break;
          default:
            return '置顶';
            break;
        }
      },
    },
    methods: {
      drop(e, index){
        if (!this.isCha) {
          return;
        }
//        e.stopPropagation();
        let disX = e.pageX - e.target.offsetLeft;
        let disY = e.clientY - e.target.offsetTop;
        let oDiv = e.target;
        let _this = this;
        document.onmousemove = function (e) {
//          e.preventDefault();
          //通过事件委托，计算移动的距离
          let l = e.pageX - disX;
          let t = e.clientY - disY;
          //移动当前元素
          oDiv.style.left = l + 'px';
          oDiv.style.top = t + 'px';
          //将此时的位置传出去
        };
        var this_ = this;
        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
          if (oDiv.offsetLeft - 38 < 0) {
            oDiv.style.left = '38px';
          }
          if (oDiv.offsetTop < 0) {
            oDiv.style.top = '38px';
          }
          if (oDiv.offsetLeft > oDiv.offsetParent.offsetWidth - oDiv.offsetWidth - 38) {
            oDiv.style.left = oDiv.offsetParent.offsetWidth - oDiv.offsetWidth - 38 - 10 + 'px';
          }
          if (oDiv.offsetTop > oDiv.offsetParent.offsetHeight - oDiv.offsetHeight) {
            oDiv.style.top = oDiv.offsetParent.offsetHeight - oDiv.offsetHeight;
          }
          var x1w1;
          var x1Y1;

          if (this_.formArr.buildingContributionPicsList[this_.dialogImgIndex].picTagList[index].lableDirection == 2) {
            x1w1 = (oDiv.offsetLeft + oDiv.offsetWidth + 38) / oDiv.parentNode.parentNode.offsetWidth;
            x1Y1 = (oDiv.offsetTop + oDiv.offsetHeight - 5) / oDiv.parentNode.parentNode.offsetHeight;
          } else {
            x1w1 = (oDiv.offsetLeft - 38) / oDiv.parentNode.parentNode.offsetWidth;
            x1Y1 = oDiv.offsetTop / oDiv.parentNode.parentNode.offsetHeight;
          }
          var obj = {x: x1w1.toFixed(6), y: x1Y1.toFixed(6), i: index * 1};
          _this.greet(obj);
        }
      },
      greet(val){
        var arr = this.formArr.buildingContributionPicsList[this.dialogImgIndex].picTagList;
        arr[val.i].lableX = val.x;
        arr[val.i].lableY = val.y;
      },
      f_isTop(){
        let body = {
          id: this.data.id,
          status: this.data.isTop,
          isVideo: this.formArr.isVideo
        };
        if (!this.data.isTop) {
          body.status = '1';
        }
        if (this.data.isTop == '1') {
          body.status = '0';
        } else {
          body.status = '1';
        }

        this.$confirm('确认提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('/buildingContribution/updateIsTop', {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              message(this, '提交成功', 'success');
              this.data.isTop = res.data.response.status;
            } else {
              message(this, '提交失败', 'warning');
            }
          })
        }).catch(() => {

        })
      },
      checkoutType(index, val){
        if (!this.isCha) {
          return;
        }
        var arr = this.formArr.buildingContributionPicsList[this.dialogImgIndex].picTagList;
        var oDiv = document.getElementById(`tagIs${val}`);
        var x1w1;
        var x1Y1;

        if (arr[val].lableDirection == 1 && this.isCha) {
          arr[val].lableDirection = 2;
          x1w1 = (oDiv.offsetLeft + oDiv.offsetWidth + 38) / oDiv.parentNode.parentNode.offsetWidth;
          x1Y1 = (oDiv.offsetTop + oDiv.offsetHeight - 5) / oDiv.parentNode.parentNode.offsetHeight;

          var obj = {x: x1w1.toFixed(6), y: x1Y1.toFixed(6), i: index * 1};
          arr[val].lableX = obj.x;
          arr[val].lableY = obj.y;

        } else {

          arr[val].lableDirection = 1;
          x1w1 = (oDiv.offsetLeft - 38) / oDiv.parentNode.parentNode.offsetWidth;
          x1Y1 = oDiv.offsetTop / oDiv.parentNode.parentNode.offsetHeight;
          var obj = {x: x1w1.toFixed(6), y: x1Y1.toFixed(6), i: index * 1};
          arr[val].lableX = obj.x;
          arr[val].lableY = obj.y;

        }
//        this.getWidth();
//        this.getTags();
      },
      //上下线
      addIsOnline(){
        let _this = this;
        let body = {};
        body.isVideo = this.data.isVideo;
        
        if(this.data.isVideo == 1){
            body.id=this.data.isVideo;
        }else if(this.data.isVideo == 2){
            body.id=this.data.id;
        }
         if(this.data.isOnline == 1){
            body.isOnline = 0;
        }else if(this.data.isOnline == 0){
            body.isOnline = 1;
        }
          _this.$confirm('确认上/下线吗?', '提示', {
	            confirmButtonText: '确定',
	            cancelButtonText: '取消',
	            type: 'warning'
	          }).then(() => {
	          	_this.$http('/buildingContribution/updateContributionPicStatus',{body},{},{},'post').then(res =>{
		          if(res.data.code == 0){
                            if(this.data.isOnline == 1){
                                this.data.isOnline = 0;
                            }else if(this.data.isOnline == 0){
                                this.data.isOnline = 1;
                            }
		          	if(res.data.response.status == 1){
						message(_this,'提交成功','success');
		          	}
		          }
		        })
	          }).catch(() => {

	          });
      },
      searchAdd(x, y, func){
        var lnglatXY = [x, y];
        this.geocoder.getAddress(lnglatXY, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            func(result.regeocode.formattedAddress)
          }
        });
      },

      initSelect(){
        for (let i in this.form) {
          if (i == 'isEdit') {
            this.form[i] = '1';
          } else if (i == 'picIds' || i == 'rejectReason') {
            this.form[i] = '';
          } else {
            this.form[i] = this.data[i];
          }
        }
        this.checks = [];
        this.selects = [];
        this.data.buildingContributionPicsList.forEach(item => {
          this.checks.push({
            id: item.id,
            checked: false
          });
          if (item.nearBuildingName == '') {
            if (item.longitude == 0 && item.latitude == 0) {
              return;
            }
            this.searchAdd(item.longitude, item.latitude, function (res) {
              item.nearBuildingName = res ? res : `经纬度为：${item.longitude},${item.latitude}`;
            })
          }
        });
      },
      checkChange(id){
        let set = new Set(this.selects);
        if (set.has(id)) {
          set.delete(id);
        } else {
          set.add(id);
        }
        this.selects = Array.from(set);
      },
      hande(type){
        if (type == 1) {
          this.form.rejectReason = '';
          if (this.data.isVideo == 2) {
            this.dialogFormVisible = true;
          } else {
            this.dialogVideo = true;
          }
        } else if (type == 2) {
//          this.$store.dispatch('filterIdAction', true);

          this.$router.push({
            path: '/unopened/unopenedexamineedit',
            query: {
              info: JSON.stringify(this.formArr),
              path: this.$route.fullPath,
              name: this.$route.query.name,
              forms: JSON.stringify(this.allForms),
              page: this.page,
              activeName:"1"
            }
          })
        }else if(type ==3){
            this.$router.push({
            path: '/unopened/unopenedexamineedit',
            query: {
              info: JSON.stringify(this.formArr),
              path: this.$route.fullPath,
              name: this.$route.query.name,
              forms: JSON.stringify(this.allForms),
              page: this.page,
              activeName:"2",
            }
          })
        }
      },
      viewImg(src, index){
        this.dialogImgSrc = src;
        this.dialogImgIndex = index;
        this.outerVisible = true;
        this.issub = false;
        this.isCha = false;

        this.$nextTick(() => {
          setTimeout(() => {
            this.getTags();
            this.getWidth();
          }, 0)
        })
      },
      diaSure(){
        let body;
        if (this.data.isVideo == 1) {
          if (this.form.isPass == '') {
            message(this, '请选择是否通过', 'warning');
            return;
          } else if (this.form.isPass == '3') {
            if (this.form.rejectReason == '') {
              message(this, '请选择驳回理由', 'warning');
              return;
            }
          }
          body = _.cloneDeep(this.form);
        } else {
          if (this.form.rejectReason == '' && this.selects.length != this.data.buildingContributionPicsList.length) {
            message(this, '请选择驳回理由', 'warning');
            return;
          }
          body = _.cloneDeep(this.form);
          body.picIds = this.selects.join(',');
          body.buildingContributionPicsList = this.formArr.buildingContributionPicsList;
        }
        this.$http('/buildingContribution/updateInfo', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            if (res.data.response.res == 1) {
              this.dialogFormVisible = false;
              this.dialogVideo = false;
              this.$emit('updata');
              message(this, '提交成功', 'success')
            } else {
              message(this, '提交失败', 'warning')
            }
          } else if (res.data.code == 301) {
            message(this, res.data.response, 'warning');
            this.dialogFormVisible = false;
            this.dialogVideo = false;
            this.$emit('updata');
          }
        })
      },
      addTags(src, index,pid){
        this.getHistorTagList();
        this.dialogImgSrc = src;
        this.dialogImgIndex = index;
        this.outerVisible = true;
        this.innerVisible = false;
        this.issub = false;
        this.isCha = true;
        this.$nextTick(() => {
          setTimeout(() => {
            this.getTags();
            this.getWidth();
          }, 0)
        })
        this.addPicId = pid;
      },
      tagSure(){

      },
      //获取用户历史标签列表
      getHistorTagList(){
        let body = {};
        this.$http('/buildingContribution/getUserBuildingContributionPicLabel', {body}, {}, {}, 'post').then(res => {
          let arr_res = res.data.response.labels;
          let arr_all = this.TagList.allTagList;
          let arr_que = this.TagList.qualityTagList;
          this.tagSect.length = 0;
          for (let i in arr_res) {
            this.tagSect.push(arr_res[i]);
          }
        }).catch(() => {
        })
      },
      //记录选择添加的标签
      //关闭标签选择弹窗
      cheTagHandler(val, index, type){

        var arr = this.formArr.buildingContributionPicsList[this.dialogImgIndex].picTagList;

        if (arr.length > 3) {
          message(this, '最多添加四条标签', 'warning');
          return;
        } else {
          arr.push({
            buildingContributionPicsId: '',
            id: '',
            labelName: val.tagName,
            lableDirection: 1,
            lableId: val.tagId,
            lableX: 0,
            lableY: 0,
            type: type,
          });
          setTimeout(() => {
            this.getWidth(1);
          }, 0)
//          this.$emit('addTagsOne', val);
        }
//        console.log(this.formArr.buildingContributionPicsList[this.dialogImgIndex].picTagList, this.formArr_.buildingContributionPicsList[this.dialogImgIndex].picTagList);
        this.dialogFormVisibles = false;
      },
      //获取标签的宽高
      getWidth(num){
        var arr = this.formArr.buildingContributionPicsList[this.dialogImgIndex].picTagList;
        if (num == 1) {
          if (arr.length >= 0) {
            for (let i in arr) {
              if (i == arr.length - 1) {
                var n = `tagIs${i}`;
                var l = `lines${i}`;
                var d = `dots${i}`;
                var i1 = document.getElementById(n).offsetWidth;
                var i2 = document.getElementById(n).offsetHeight / 2;
                var x1 = document.getElementById(n).parentNode.parentNode;
                var x1W = x1.offsetWidth;
                var x1Y = x1.offsetHeight;
                document.getElementById(n).style.fontSize = x1W / 375 * 12 + 'px';
//                document.getElementById(n).style.paddingLeft = x1W / 375 * 12 + 'px';
                document.getElementById(n).style.width = x1W / 375 * i1 + 'px';
//              arr[i].a = true;
              }
            }
          }
        } else {
          if (arr.length >= 0) {
            for (let i in arr) {
//            if (!arr[i].a) {
              var n = `tagIs${i}`;
              var l = `lines${i}`;
              var d = `dots${i}`;
              var i1 = document.getElementById(n).offsetWidth;
              var i2 = document.getElementById(n).offsetHeight / 2;
              var x1 = document.getElementById(n).parentNode.parentNode;
              var x1W = x1.offsetWidth;
              var x1Y = x1.offsetHeight;
              document.getElementById(n).style.fontSize = x1W / 375 * 12 + 'px';
//              document.getElementById(n).style.paddingLeft = x1W / 375 * 12 + 'px';
              document.getElementById(n).style.width = x1W / 375 * i1 + 'px';
//              arr[i].a = true;
//            }
            }
          }
        }
      },
      //删除标签之后重新记录
      //删除标签
      removeTag(index){

        var arr = this.formArr.buildingContributionPicsList[this.dialogImgIndex].picTagList;
        arr.splice(index, 1);
        this.getTags();
      },
      closeDia(){
        this.outerVisible = false;
//        this.formArr.buildingContributionPicsList[this.dialogImgIndex].picTagList = this.formArr_.buildingContributionPicsList[this.dialogImgIndex].picTagList;
      },
      subMitTag(){
        this.$confirm('确认保存吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var arr = this.formArr.buildingContributionPicsList[this.dialogImgIndex].picTagList;

            this.issub = true;
            let body = {}

            body.buildingContributionPicsList = this.formArr.buildingContributionPicsList;
            this.$http('/buildingContribution/storePhotoTags', {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
                if (res.data.response.status == 1) {
                this.dialogFormVisible = false;
                this.dialogVideo = false;
                this.$emit('updata');
                message(this, '提交成功', 'success')
                }
            } else if (res.data.code == 301) {
                message(this, res.data.response, 'warning');
                this.dialogFormVisible = false;
                this.dialogVideo = false;
                this.$emit('updata');   
            }
            })
          this.outerVisible = false;
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '保存失败!'
          });
        })
      },
      videoRejectReasons(e){
        if (e == 3) {
          this.videoWhy = true;
        } else {
          this.videoWhy = false;
        }
        this.form.isPass = e;
      },
      //获取标签位置
      getTags(){
        this.$nextTick(() => {
          var arr = this.formArr.buildingContributionPicsList[this.dialogImgIndex].picTagList;
          for (let i in arr) {
            var oDiv = document.getElementById(`tagIs${i}`);
            var i1 = document.getElementById(`tagIs${i}`).offsetWidth;
            var i2 = document.getElementById(`tagIs${i}`).offsetHeight / 2;
            var x1 = document.getElementById(`tagIs${i}`).parentNode.parentNode;
            var x1W = x1.offsetWidth;
            var x1Y = x1.offsetHeight;
            var x2 = arr[i].lableX * x1W;
            var y2 = arr[i].lableY * x1Y;
            if (arr[i].lableDirection != 1) {
              x2 = x2 - i1 - 38;
              y2 = y2 - i2 + 5;
            } else {
              x2 = x2 + 38;
              y2 = y2 - i2;
            }
            document.getElementById(`tagIs${i}`).style.left = x2 + 'px';
            document.getElementById(`tagIs${i}`).style.top = y2 + 'px';
            if (oDiv.offsetLeft - 38 < 0) {
              oDiv.style.left = '0px';
            }
            if (oDiv.offsetTop < 0) {
              oDiv.style.top = '0px';
            }
            if (oDiv.offsetLeft > oDiv.offsetParent.offsetWidth - oDiv.offsetWidth - 38) {
              oDiv.style.left = oDiv.offsetParent.offsetWidth - oDiv.offsetWidth - 38 - 10 + 'px';
            }
            if (oDiv.offsetTop > oDiv.offsetParent.offsetHeight - oDiv.offsetHeight) {
              oDiv.style.top = oDiv.offsetParent.offsetHeight - oDiv.offsetHeight;
            }

          }
        })
      },
      //视频审核
      dialogVideoMine(){
        if (this.form1.videoRejectReason == '1' && this.form1.menuChildIds == '') {
          message(this, '请选择驳回理由', 'warning');
          return;
        }
        let body = _.cloneDeep(this.form1);
        this.$http('/buildingContribution/updateInfo', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            if (res.data.response.res == 1) {
              this.dialogFormVisible = false;
              this.$emit('updata');
              message(this, '提交成功', 'success')
            } else {
              message(this, '提交失败', 'warning')
            }
          } else if (res.data.code == 301) {
            message(this, res.data.response, 'warning');
            this.dialogFormVisible = false;
            
          }
        })
      },
      rejectExamineDialog(){
          console.log( this.form);
          if(this.selects.length < 1 && this.form.isVideo == 2){
            message(this, '请选择驳回图片', 'warning');
            return;
        }
        this.dialogVisibleReject = true
      },
    //   驳回
    rejectExamine(){
        
        if (this.form.rejectReason == '') {
            message(this, '请选择驳回理由', 'warning');
            return;
          }
          let body = {};
        body.isVideo = this.form.isVideo;
        body.picIds = this.selects.join(',');
        body.rejectReason = this.form.rejectReason;
        body.id = this.form.id;
         this.$http('/buildingContribution/rejectPics', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            if (res.data.response.status == 1) {
              this.dialogVisibleReject = false;
              this.$emit('updata');
              this.initSelect();
              message(this, '提交成功', 'success')
            } else {
              message(this, '提交失败', 'warning')
            }
          } else if (res.data.code == 301) {
            message(this, res.data.response, 'warning');
            this.dialogVisibleReject = false;
            this.$emit('updata');
          }
        })
    },
    show1(){
        console.log(2);
    }
    }
  }
</script>

<style scoped>
  .raLab {
    width: 100%;
    margin-top: 5px;
    margin-left: 0px
  }

  .ex-item {
    margin-top: 20px;
    position: relative;
  }

  .ex-item .el-form-item {
    margin-bottom: 0px;
  }

  .ex-item .el-tag {
    border-radius: 0px;
  }

  .ex-item .tag {
  }

  .img-container {
    position: relative;
    cursor: pointer;
    margin-top: 20px;
    height: 180px;
    padding-top: 100px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
  }

  .img-container:hover .wap {
    display: block;
  }

  .img-container .wap {
    z-index: 2;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    line-height: 180px;
    display: none;
  }

  .img-container .wap .ico {
    color: #FFF;
  }

  .addTag {
    display: block !important;
    width: 200px;
    height: 50px;
    line-height: 50px;
    color: #fff;
    margin: auto;
  }

  .historTag span {
    display: inline-block;
    width: 180px;
    height: 50px;
    background: ghostwhite;
    text-align: center;
    line-height: 50px;
  }

  .checkoutTg {
    width: 500px;
    margin: auto;
  }

  .checkoutTg div, .tagList li, .tagLists li {
    width: 100%;
    height: 50px;
    background: #fff;
    text-align: center;
    line-height: 50px;
    margin: auto;
    list-style: none;
  }

  .tagList li, .tagLists li {
    background: ghostwhite;
    border: 1px solid gray;
    margin: 10px auto;
  }

  .tagList {
    height: 450px;
    padding: 10px 20px 50px 20px;
    overflow-y: scroll;
  }

  .tagLists {
    height: 100px;
    padding: 10px 20px 50px 20px;
    overflow-y: scroll;
  }

  .tags, .tagsH {
    padding-left: 20px;
    padding-right: 20px;
    display: inline-block;
    height: 40px;
    position: absolute;
    top: 50px;
    left: 210px;
    z-index: 999;
    cursor: crosshair;
    text-align: center;
    line-height: 40px;
    color: #fff;
  }

  .tags {
    background: rgba(255,0,0,.4);
  }

  .tagsH {
    background: rgba(0, 0, 0, 0.5);
  }

  .tagsIconR, .tagsIconL, .tagsHIconL, .tagsHIconR {

    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    margin-top: -5px;
  }

  .tagsIconR {
    right: -38px !important;
    left: calc(100% + 38px) !important;
    background: #fff;
  }

  .tagsIconL {
    left: -38px !important;
    background: #fff;
  }

  .tagsHIconL {
    left: -38px !important;
    background: #000;
  }

  .tagsHIconR {
    left: calc(100% + 38px) !important;
    right: -38px !important;
    background: #000;
  }

  .line_ {
    position: absolute;
    right: -38px;
    top: 50%;
    display: inline-block;
    width: 38px;
    border-top: 1px solid #fff;
  }

  .line_L {
    position: absolute;
    left: -38px;
    top: 50%;
    display: inline-block;
    width: 38px;
    border-top: 1px solid #fff;
  }

  .tagsIconL {
    content: '';
    display: inline-block;
    background: #fff;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    position: absolute;
    right: -10px;
    top: 50%;
    margin-top: -5px;
  }

  .tagClose {
    color: #fff;
    position: absolute;
    left: 5px;
  }

  .tagClose1 {
    color: #fff;
    position: absolute;
    right: 5px;
  }

  .video-in {
    position: relative;
    padding-bottom: 40px;
    width: 100%;
  }

  .video-tit {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    background: rgba(0, 0, 0, 0.5);
    text-align: right;
    line-height: 40px;
    color: #fff;
    padding-right: 10px;
  }

  .remove_icon {
    position: absolute;
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 20px;
    background: darkred;
    line-height: 20px;
    right: 10px;
    top: 10px;
  }

  .remove_icon i {
    position: absolute;
    display: block;
    top: 50%;
    width: 20px;
    border-top: 2px solid #fff;
  }
</style>
