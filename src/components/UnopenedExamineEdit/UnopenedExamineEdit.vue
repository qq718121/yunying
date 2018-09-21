<template>
  <div>
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
    <div style="padding:20px;margin-bottom: 100px">
      <el-form :model="form" class="demo-form-inline">
        <el-form-item label="当前楼盘：">
          <span>{{form.buildingName}}</span>
        </el-form-item>
        <el-form-item label="照片状态：" >
          <span>已发布</span>
          <!-- <span v-if="form.isPass==2">已审核</span> -->
        </el-form-item>
        <!-- <el-form-item label="视频状态：" v-else>
          <span v-if="form.isPass==1">未审核</span>
          <span v-if="form.isPass==2">已审核</span>
        </el-form-item> -->
        <el-form-item label="照片类型：" required v-if=" !form.isVideo || form.isVideo == 2">
          <el-select
            size="small"
            clearable
            v-model="form.menuId"
            @change="menuIdChange($event,true)"
            style="width:150px">
            <el-option
              v-for="(item,index) in selectList"
              :key="item.menuName"
              :label="item.menuName"
              :value="item.menuId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频类型：" required v-else>
          <el-select
            size="small"
            clearable
            v-model="form.menuId"
            @change="menuIdChange($event,true)"
            style="width:150px">
            <el-option
              v-for="(item,index) in selectList"
              :key="item.menuName"
              :label="item.menuName"
              :value="item.menuId">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="照片分类：" required v-if=" !form.isVideo || form.isVideo == 2">
          <el-select
            size="small"
            clearable
            v-model="form.menuChildId"
            @change="menuChildIdChange($event,true)"
            style="width:150px">
            <el-option
              v-for="(item,index) in menuChildList"
              :key="item.menuChildName"
              :label="item.menuChildName"
              :value="item.menuChildId">
            </el-option>
          </el-select>
          <el-select size="small" clearable v-show="menuGrandList.length>0" v-model="form.menuGrandId"
                     style="width:150px">
            <el-option
              v-for="(item,index) in menuGrandList"
              :key="item.menuGrandName"
              :label="item.menuGrandName"
              :value="item.menuGrandId">
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="视频分类：" required v-else>
          <el-select
            size="small"
            clearable
            v-model="form.menuChildId"
            @change="menuChildIdChange($event,true)"
            style="width:150px">
            <el-option
              v-for="(item,index) in menuChildList"
              :key="item.menuChildName"
              :label="item.menuChildName"
              :value="item.menuChildId">
            </el-option>
          </el-select>
          <el-select size="small" clearable v-show="menuGrandList.length>0" v-model="form.menuGrandId"
                     style="width:150px">
            <el-option
              v-for="(item,index) in menuGrandList"
              :key="item.menuGrandName"
              :label="item.menuGrandName"
              :value="item.menuGrandId">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="标题：">
          <el-input v-if="$route.query.type!='view'" type="textarea"
                    style="width: 40%;"
                    :rows='2'
                    v-model="form.describe"
                    placeholder="标题(请输入0-50字)" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="位置信息：">
	            	<span>
	            		{{form.buildingName}}
						<span v-if="form.locationType == 1">(自动定位)</span>
          				<span v-else>(手动选择)</span>
	            	</span>
        </el-form-item>
        <el-form-item label="提交用户：">
          <span>{{form.userName}}{{form.userPhone}}</span>
        </el-form-item>
        <el-form-item label="提交时间：">
          <span>{{form.uploadTime}}</span>
        </el-form-item>
        <el-form-item label="分享内容：">
          <el-input v-if="$route.query.type!='view'" type="textarea" :rows=3*1
                    style="width: 40%;"
                    v-model="form.shareDesc"
                    placeholder="分享内容(请输入0-500字)" :maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="照片：" v-if=" !form.isVideo || form.isVideo == '2' ">
          <el-row :gutter="20" style="padding-left: 80px">
            <el-col :span="8" v-for="(item,index) in form.buildingContributionPicsList" :key="index">
              <div class="img-container" :style="{backgroundImage:'url('+item.picUrl+')'}">
                <el-checkbox
                  style="position: absolute;left: 10px;top: 10px;z-index: 3"
                  v-if="checks[index]"
                  v-model="checks[index].checked"
                  @change="checkChange(checks[index].id)">
                </el-checkbox>
                <div class="wap">
                  <i class="el-icon-view ico" @click="viewImg(item.picUrl,index)"></i>
                  <i class="addTag" @click="addTags(item.picUrl,index)">
                    {{form.buildingContributionPicsList[index].picTagList.length > 0 ? '点击编辑标签' : '点击添加标签'}}
                  </i>
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- <span style="font-size: 13px;color: #1d90e6;position: relative;top: 10px;left: 80px">&nbsp;请勾选您认为符合要求的照片</span> -->
        </el-form-item>
        <el-form-item label="视频：" v-else>
          <el-row :gutter="20" style="padding-left: 80px">
            <el-col :span="8">
              <div>
                <video style="width: 371px;height:280px;" :src="form.videoInfo.videoUrl" controls
                       :poster="form.videoInfo.videoPreImage"></video>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="请为不通过的照片选择理由：" v-if=" !form.isVideo || form.isVideo == '2'">
          <el-radio-group v-model="form.rejectReason"
                          :disabled="selects.length <= 0">
            <el-radio label="1" class="raLab">照片包含违法信息</el-radio>
            <el-radio label="2" class="raLab">照片与主题无关</el-radio>
            <el-radio label="3" class="raLab">照片模糊不清</el-radio>
            <el-radio label="4" class="raLab">照片重复上传</el-radio>
            <el-radio label="5" class="raLab">同一问题重复提交</el-radio>
            <el-radio label="6" class="raLab">照片不符合收录要求</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="请选择是否通过：" v-else>
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
              label="视频重复提交"
              value="视频重复提交">
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
        <el-form-item>
          <el-button style="margin-left: 150px" type="primary" @click="submit">确认</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--放大图片标签编辑-->
    <!--<el-dialog :visible.sync="dialogVisible" v-if="form.buildingContributionPicsList.length >0 && dialogVisible">-->
    <!--<div ref="tagImg" style="width: 100%;position: relative">-->
    <!--<span v-for="(val,index) in form.buildingContributionPicsList[dialogImgIndex].picTagList"-->
    <!--@mousedown="drop($event,index)"-->
    <!--:class="form.buildingContributionPicsList[dialogImgIndex].picTagList[index].type == 1?'tags':'tagsH'"-->
    <!--:id="`tagIs${index}`"-->
    <!--:ref="`tagIs${index}`">-->
    <!--<i :id="`lines${index}`"-->
    <!--v-if="form.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection == 1"-->
    <!--class="line_L"></i>-->
    <!--<i :id="`lines${index}`" v-else class="line_"></i>-->
    <!--<span v-show="isCha"-->
    <!--v-if="form.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection == 2"-->
    <!--class="tagClose" @click="removeTag(index)">X</span>-->

    <!--<span v-show="isCha" v-else class="tagClose1" @click="removeTag(index)">X</span>-->
    <!--<i :id="`dots${index}`" @click="checkoutType(val,index)" v-if="-->

    <!--form.buildingContributionPicsList[dialogImgIndex].picTagList[index].type == 1 &&-->
    <!--form.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection == 1-->

    <!--" class="tagsIconL"></i>-->
    <!--<i :id="`dots${index}`" @click="checkoutType(val,index)" v-else-if="-->

    <!--form.buildingContributionPicsList[dialogImgIndex].picTagList[index].type == 1 &&-->
    <!--form.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection != 1-->

    <!--" class="tagsIconR"></i>-->
    <!--<i :id="`dots${index}`" @click="checkoutType(val,index)" v-else-if="-->

    <!--form.buildingContributionPicsList[dialogImgIndex].picTagList[index].type != 1 &&-->
    <!--form.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection == 1-->

    <!--" class="tagsHIconL"></i>-->

    <!--<i :id="`dots${index}`" @click="checkoutType(val,index)" v-else class="tagsHIconR"></i>-->

    <!--{{val.labelName}}-->
    <!--</span>-->
    <!--<img width="100%" :src="dialogImgSrc" alt="">-->
    <!--</div>-->
    <!--</el-dialog>-->
    <!--添加标签-->
    <el-dialog @before-close="diaHander(2)" v-if="form.buildingContributionPicsList.length >0 && outerVisible"
               :visible.sync="outerVisible"

    >
      <div class="" v-show="isCha">
        <span style="display: inline-block" class="demonstration">照片显示比例：</span>
        <el-slider style="width: 300px;" v-model="scaleX"></el-slider>
      </div>
      <div style="margin-top: 20px" v-show="isCha">
        <el-button @click="dialogFormVisibles = true">添加更多标签</el-button>
      </div>
      <div style="margin-top: 20px" v-show="isCha">
        <span>历史标签</span>
        <div class="historTag">
         <span
           v-for="(val,index) in tagSect" v-if="index < 4"
           :key="index"
           @click="cheTagHandler(val,index,val.tagType)">{{val.tagName}}</span>
        </div>
        <p style="margin-top: 20px" v-show="isCha">点击添加标签，拖拽调整位置,点击小圆点切换方向，点击X删除标签</p>
      </div>
      <div style="overflow: hidden;margin-top: 20px;">
        <div :style='`transform:scale(${scaleX/50},${scaleX/50});position: relative`'>
         <!-- @contextmenu.prevent="show1()" -->
          <!--<ComGrap-->
          <!--:picTagList.sync="form.buildingContributionPicsList[dialogImgIndex].picTagList"-->
          <!--:id="dialogImgIndex"-->
          <!--:isCha="isCha"-->
          <!--v-on:removeTag="removeTag"-->
          <!--v-on:update="updateGrap"-->
          <!--/>-->
          <span v-for="(val,index) in form.buildingContributionPicsList[dialogImgIndex].picTagList"
                @mousedown="drop($event,index)"
                :key="index"
                :class="form.buildingContributionPicsList[dialogImgIndex].picTagList[index].type == 1?'tags':'tagsH'"
                :id="`tagIs${index}`"
                :ref="`tagIs${index}`">
          <i :id="`lines${index}`"
             v-if="form.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection == 1"
             class="line_L"></i>
          <i :id="`lines${index}`" v-else class="line_"></i>
          <span v-show="isCha"
                v-if="form.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection == 2"
                class="tagClose" @click="removeTag(index)"><i>X</i></span>

          <span v-show="isCha" v-else class="tagClose1" @click="removeTag(index)"><i>X</i></span>
                          <i :id="`dots${index}`" @click="checkoutType(val,index)" v-if="

                form.buildingContributionPicsList[dialogImgIndex].picTagList[index].type == 1 &&
                 form.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection == 1

                " class="tagsIconL"></i>
                          <i :id="`dots${index}`" @click="checkoutType(val,index)" v-else-if="

                form.buildingContributionPicsList[dialogImgIndex].picTagList[index].type == 1 &&
                 form.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection != 1

                " class="tagsIconR"></i>
                          <i :id="`dots${index}`" @click="checkoutType(val,index)" v-else-if="

                form.buildingContributionPicsList[dialogImgIndex].picTagList[index].type != 1 &&
                 form.buildingContributionPicsList[dialogImgIndex].picTagList[index].lableDirection == 1

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
    <el-dialog title="" :visible.sync="dialogFormVisibles">
      <div class="checkoutTg">
        <p>问题点标注</p>
        <ul class="tagLists">
          <li v-for="(val,index) in TagList.qualityTagList" :key="index" @click="cheTagHandler(val,index,1)">{{val.tagName}}</li>
        </ul>
        <p>普通标签</p>
        <ul class="tagList">
          <li v-for="(val,index) in TagList.allTagList" :key="index" @click="cheTagHandler(val,index,2)">{{val.tagName}}</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Subnav2 from '../Subnav2/Subnav2';
  import message from '../../common/message';
  import ComGrap from '../Common/ComGrap/comGrap.vue'

  export default{
    name: 'EstateProcessMonitoringUser',
    components: {
      Subnav2,
      ComGrap
    },
    data(){
      return {
        dialogFormVisible: false,
        TagList: [],
        dialogImgIndex: 0,
        dialogVisible: false,
        dialogFormVisibles: false,
        dialogImgSrc: '',
        videoWhy: false,
        tagsClass: 'tagsH',
        tagsCloase: 'tagClose',
        form_: [],
        scaleX: 50,
        isCha: true,
        issub: false,
        checks: [],
        outerVisible: false,
        innerVisible: false,
        selects: [],
        tagSect: [],
        a: [{
          f: this.greet,
          b: 10,
          c: 10
        }],
        navList: [
          {path: '/unopened/estateunopenedexamine', name: '首页'},
          {path: '/unopened/estateunopenedexamine', name: '质量寻光楼盘审核'},
          {path: this.$route.fullPath, name: this.$route.query.name},
        ],
        selectList: [],
        menuChildList: [],
        menuGrandList: [],
        menuId: '',
        menuChildId: '',
        menuGrandId: '',
        describe: '',
        questionDesc: '',
        form: {}
      }
    },
    created(){
      this.initData();
      this.getTagList();
      this.$store.dispatch('defaultIndexAction', '/unopened/estateunopenedexamine');
      this.form.rejectReason = "";
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

          if (this_.form.buildingContributionPicsList[this_.dialogImgIndex].picTagList[index].lableDirection == 2) {
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
        var arr = this.form.buildingContributionPicsList[this.dialogImgIndex].picTagList;
        arr[val.i].lableX = val.x;
        arr[val.i].lableY = val.y;
      },
      //初始化数据
      initData(){
        let info = JSON.parse(this.$route.query.info);
        this.form = _.cloneDeep(info);
        this.form.isPass = "";
        this.form_ = _.cloneDeep(this.form);
        this.menuId = this.form.menuId;
        this.menuChildId = this.form.menuChildId;
        this.menuGrandId = this.form.menuGrandId;
        this.describe = this.form.describe;
        this.questionDesc = this.form.shareDesc ? this.form.shareDesc : '';
//        this.videoInfo = this.form.videoInfo.videoUrl;
        this.initSelect();
        this.selectList = window.localStorage.eSelectList ? JSON.parse(window.localStorage.eSelectList) : [];
        this.menuIdChange(this.form.menuId, false);
        this.menuChildIdChange(this.form.menuChildId, false);
      },
      initSelect(){
        this.checks = [];
        this.selects = [];
        this.form.buildingContributionPicsList.forEach(item => {
          this.checks.push({
            id: item.id,
            checked: false
          })
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
      //menuId 改变
      menuIdChange(menuId, swi){
        if (swi) {
          this.form.menuChildId = '';
          this.form.menuGrandId = '';
        }
        ;
        this.menuChildList = [];
        this.menuGrandList = [];
        this.selectList.forEach(item => {
          if (item.menuId == menuId) {
            this.menuChildList = item.menuChildList;
          }
        })
      },
      //menuChildId 改变
      menuChildIdChange(menuChildId, swi){
        if (swi) {
          this.form.menuGrandId = '';
        }
        ;
        this.menuGrandList = [];
        this.selectList.forEach(item => {
          if (item.menuId == this.form.menuId) {
            item.menuChildList.forEach(item1 => {
              if (item1.menuChildId == menuChildId) {
                this.menuGrandList = item1.menuGrandList;
              }
            })
          }
        })
      },
      checkoutType(index, val){
        if (!this.isCha) {
          return;
        }
        var arr = this.form.buildingContributionPicsList[this.dialogImgIndex].picTagList;
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
      //提交
      submit(){
        if (this.form.menuId == '') {
          message(this, '请选择照片类型', 'warning');
          return;
        }
        // if (this.form.menuChildId == '' || (this.menuGrandList.length > 0 && this.form.menuGrandId == '')) {
        //   message(this, '请选择照片分类', 'warning');
        //   return;
        // }

        if (this.form.isVideo == 1) {

          if (this.form.isPass == 1) {
            message(this, '请选择审核状态', 'warning');
            return;
          } else if (this.form.isPass == 3) {
            if (this.form == '') {
              message(this, '请选择驳回理由', 'warning');
              return;
            }
          }
        } else {
            console.log(this.form.rejectReason);
          if (this.form.rejectReason == "" && this.selects.length > 0) {
            message(this, '请选择驳回理由', 'warning');
            return;
          }
        }


        let body = _.cloneDeep(this.form);
        console.log(body);
        console.log(this.selects);
        if (this.form.isVideo == 1) {
          body.isVideo = '1';
          body.isEdit = (body.menuId == this.menuId &&
            body.menuChildId == this.menuChildId &&
            body.menuGrandId == this.menuGrandId &&
            body.describe == this.describe &&
            body.shareDesc == this.questionDesc &&
            body.videoInfo.videoUrl == this.videoInfo
          ) ? 1 : 2;
        } else {
          body.isVideo = '2';
          body.isEdit = (body.menuId == this.menuId && body.menuChildId == this.menuChildId && body.menuGrandId == this.menuGrandId) ? 1 : 2;
        }
//        console.log(body.isEdit,body.shareDesc,this.questionDesc);
//        for (let i in body) {
//          if (i != 'id' && i != 'menuId' && i != 'menuChildId' && i != 'menuGrandId' && i != 'rejectReason' && i != 'isEdit' && i != 'buildingId' && i != 'userId' && i != 'describe' && i != 'shareDesc') {
//            delete body[i];
//          }
//        }

        body.picIds = this.selects.join(',');
        this.$confirm('确认提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('/buildingContribution/updateInfo', {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              if (res.data.response.res == 1) {
                this.back();
                message(this, '提交成功', 'success')
              } else {
                message(this, '提交失败', 'warning')
              }
            }
          })
        }).catch(() => {

        })
      },
      //返回
      back(){
        this.$router.push({
          path: this.$route.query.path,
          query: {
            forms: this.$route.query.forms,
            page: this.$route.query.page,
            activeName:this.$route.query.activeName
          }
        })
      },
      //刷新
      refresh(){
        this.initData()
      },
      viewImg(src, index){
        if (!this.isCha) {
          this.checkoutType = function () {
          };
        }
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
      addTags(src, index){
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
      },
      //获取标签位置
      getTags(){
        this.$nextTick(() => {
          var arr = this.form.buildingContributionPicsList[this.dialogImgIndex].picTagList;
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
      //获取标签列表
      getTagList(){
        let body = {};
        this.$http('/buildingContribution/getBuildingContributionPicLabel', {body}, {}, {}, 'post').then(res => {
          this.TagList = res.data.response;
        }).catch(() => {
            
        })
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
        var arr = this.form.buildingContributionPicsList[this.dialogImgIndex].picTagList;
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
        }
        this.dialogFormVisibles = false;
      },
      videoRejectReasons(e){
        if (e == 3) {
          this.videoWhy = true;
        } else {
          this.videoWhy = false;
        }
        this.form.isPass = e;
      },
      getWidth(num){
        var arr = this.form.buildingContributionPicsList[this.dialogImgIndex].picTagList;
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
                document.getElementById(n).style.paddingLeft = x1W / 375 * 12 + 'px';
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
              document.getElementById(n).style.paddingLeft = x1W / 375 * 12 + 'px';
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

        var arr = this.form.buildingContributionPicsList[this.dialogImgIndex].picTagList;
        arr.splice(index, 1);
        this.getTags();
      },
      subMitTag(){
        this.$confirm('确认保存吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var arr = this.form.buildingContributionPicsList[this.dialogImgIndex].picTagList;
          var arr1 = this.form_.buildingContributionPicsList[this.dialogImgIndex].picTagList;
          arr = arr1.slice(0);
          this.issub = true;
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
          this.outerVisible = false;
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '保存失败!'
          });
        })
      },
      closeDia(){
        this.outerVisible = false;
//        this.form.buildingContributionPicsList[this.dialogImgIndex].picTagList = this.form_.buildingContributionPicsList[this.dialogImgIndex].picTagList;
//        console.log(this.form.buildingContributionPicsList[this.dialogImgIndex].picTagList);
      },
      show1(){
          console.log(3);
      }
    }
  }
</script>

<style scoped>

  .img-container {
    position: relative;
    cursor: pointer;
    margin-top: 20px;
    height: 180px;
    position: relative;
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
    background: red;
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

  textarea{
      overflow: hidden;
  }
</style>
