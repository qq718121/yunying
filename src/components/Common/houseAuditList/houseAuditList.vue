<template>
  <div class="houseAuditList" v-loading="loading2"
       element-loading-text="正在载入图片。。请稍候"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <span v-show="false" v-if="aaa">111</span>
    <div class='audit-ine-img'
         v-if="data.detailType == 0">
      <div class="audit-ine-imgs">
        <img
          :src="data.picPath.substring(7,20) == '171.8.196.125'? data.picPath: data.picPath+'?imageView2/2/h/300' "
          alt="">
      </div>
    </div>
    <div class="video-in" style="width: 100%;height:100%;" v-else>
      <video style="width: 100%;height:100%;" :src="data.picPath"
             controls
             :poster="data.videoPreImage"></video>
    </div>
    <div class="wap" id="NOclick" v-if="data.detailType == 0">
      <i class="el-icon-view ico" @click.prevent="viewImg(data.picPath)"></i>
      <i class="addTag" @click="addTags(data.picPath)" v-if="!isView">
        {{data.tagList.length > 0 ? '点击编辑标签' : '点击添加标签'}}
      </i>
    </div>

    <el-dialog :before-close="handleClose" v-if="outerVisible"
               :visible.sync="outerVisible"
               :close-on-click-modal="false"
    >
      <div v-if="!isView && !isViews">
        <span style="display: inline-block" class="demonstration">照片显示比例：</span>
        <el-slider style="width: 300px;" v-model="scaleX"></el-slider>
      </div>
      <div v-if="!isView && !isViews">
        <el-button @click="dialogFormVisibles = true">添加更多标签</el-button>
      </div>
      <div style="overflow: auto;">
        <el-button style="float: right;" @click="closeDia" v-if="!isView && !isViews"><span>清空标签</span></el-button>
        <el-button style="float: right;margin-right: 10px" @click="subMitTag" v-if="!isView && !isViews">
          <span>保存编辑</span></el-button>
      </div>
      <div style="margin-top: 20px" v-if="!isView && !isViews">
        <span>历史标签</span>
        <div class="historTag">
      <span
        v-for="(val,index) in tagSects" v-if="index < 4"
        :key="index"
        @click="cheTagHandlers(val,index,val.tagType)">{{val.name}}</span>
        </div>
        <p style="margin-top: 20px" v-if="!isView && !isViews">点击添加标签，拖拽调整位置,点击小圆点切换方向，点击X删除标签</p>
      </div>
      <div style="overflow: hidden;margin-top: 20px;position: relative" @mousedown="imgDrop($event)">
        <div id="imgDropId" :style='`transform:scale(${scaleX/50},${scaleX/50});position: relative`'>
         <!-- @contextmenu.prevent="show1()" -->
          <span v-for="(val,index) in data.tagList"
                @mousedown="drop($event,index)"
                :key="index"
                :class="data.tagList[index].tagType == 7 || data.tagList[index].tagType == 1?'tags':'tagsH'"
                :id="`tagIs${index}`"
                :ref="`tagIs${index}`">
          <i :id="`lines${index}`"
             v-if="data.tagList[index].lableDirection == 1"
             class="line_L"></i>
          <i :id="`lines${index}`" v-else class="line_"></i>
          <span v-if="data.tagList[index].lableDirection == 2"
                class="tagClose" @click="removeTag(index)"><i>X</i></span>
          <span v-else class="tagClose1" @click="removeTag(index)"><i>X</i></span>
          <i :id="`dots${index}`" @click="checkoutType(val,index)" v-if="

         (data.tagList[index].tagType == 7 || data.tagList[index].tagType == 1) &&
          data.tagList[index].lableDirection == 1

          " class="tagsIconL"></i>
          <i :id="`dots${index}`" @click="checkoutType(val,index)" v-else-if="

          (data.tagList[index].tagType == 7 || data.tagList[index].tagType == 1) &&
          data.tagList[index].lableDirection != 1

          " class="tagsIconR"></i>
          <i :id="`dots${index}`" @click="checkoutType(val,index)" v-else-if="

          (data.tagList[index].tagType != 7 || data.tagList[index].tagType != 1) &&
          data.tagList[index].lableDirection == 1

          " class="tagsHIconL"></i>

          <i :id="`dots${index}`" @click="checkoutType(val,index)" v-else class="tagsHIconR"></i>
          {{val.name}}
          </span>

          <img style="width:100%" :src="dialogImgSrc" alt="">
        </div>
      </div>
    </el-dialog>
    <!--添加标签列表-->
    <el-dialog title="" :visible.sync="dialogFormVisibles" :show-close="true" :close-on-click-modal="false">
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
  import message from '../../../common/message';
  export default {
    props: {
      data: {
        default: null
      },
      isView: {
        default: false
      },
      TagLists: {
        default: false
      },
      isGetTagList: {
        default: false
      },
      detailType: {
        default: 0
      }
    },
    data(){
      return {
        datas: null,
        loading2: false,
        outerVisible: false,
        dialogFormVisibles: false,
        dialogImgIndex: 0,
        dialogImgSrc: '',
        picPath: '',
//        tagLen: 0,
        scaleX: 50,
        tagSects: [],
        isViews: false,
        aaa: false,
        tagNameList: [],
        TagList: {
          qualityTagList: []
        },
        detailTypes: 0
      }
    },

    created(){
//      this.data = this.data;
      this.picPath = this.data.picPath;
      this.detailTypes = this.detailType;
    //   console.log(this.data.tagList);
    },

//    watch: {
//      detailType: function () {
//        this.data = this.data;
//        this.detailTypes = this.detailType;
//      },
//      data: function () {
//        this.data = this.data;
//        this.detailTypes = this.detailType;
//      }
//    },
    methods: {
      handleClose(done){
        this.remove();
        done();
      },
      //获取标签列表
      getTagList(){
        let body = {};
        this.$http('/buildingContribution/getBuildingContributionPicLabel', {body}, {}, {}, 'post').then(res => {
          this.TagList = res.data.response;
        }).catch(() => {

        })
      },
      //获取历史标签
      getHistoryTagList(){
        this.$http('/buildingCamera/getBackUserContributionPicLabel', {}, {}, {}, 'post').then(res => {
          this.tagSects = res.data;
        })
      },
      //添加历史标签
      setHistoryTagList(labelId){
        let body = {labelId};
        this.$http('/buildingCamera/setHisPhotoLabels', {body}, {}, {}, 'post').then(res => {
        })
      },
     removeHander(el, type, callback) {
       if (el.removeEventListener) {
         el.removeEventListener(type, callback, false);
       } else if (el.detachEvent) {
         el.detachEvent("on" + type, callback);
       } else {
         el["on" + type] = null;
       }
     },
      imgDrop(e){
        if (!e.target.src || !this.outerVisible) {
          return;
        }
        let disX = e.pageX - e.target.parentNode.offsetLeft;
        let disY = e.clientY - e.target.parentNode.offsetTop;
        let oDiv = e.target.parentNode;
        document.onmousemove = function (e) {
          e.preventDefault();
          //通过事件委托，计算移动的距离
          let l = e.pageX - disX;
          let t = e.clientY - disY;
          //移动当前元素
          oDiv.style.left = l + 'px';
          oDiv.style.top = t + 'px';
          //将此时的位置传出去
        };
        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
          e = null;
          disX = null;
          disY = null;
          oDiv = null;
          this.imgDrop = null;
        }
      },
      drop(e, index){
        if (e.target.id != `tagIs${index}` || !this.outerVisible) {

          return;
        }
        if (this.isView || this.isViews) {
          return;
        }
        let disX = e.pageX - e.target.offsetLeft;
        let disY = e.clientY - e.target.offsetTop;
        let oDiv = e.target;
        let _this = this;
        document.onmousemove = function (e) {
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

          if (this_.data.tagList[index].lableDirection == 2) {
            x1w1 = (oDiv.offsetLeft + oDiv.offsetWidth + 38) / oDiv.parentNode.parentNode.offsetWidth;
            x1Y1 = (oDiv.offsetTop + (oDiv.offsetHeight / 2)) / oDiv.parentNode.parentNode.offsetHeight;
          } else {
            x1w1 = (oDiv.offsetLeft - 38) / oDiv.parentNode.parentNode.offsetWidth;
            x1Y1 = (oDiv.offsetTop + (oDiv.offsetHeight / 2) ) / oDiv.parentNode.parentNode.offsetHeight;
          }
          var obj = {x: x1w1.toFixed(6), y: x1Y1.toFixed(6), i: index * 1};
          _this.greet(obj);
          document.onmousemove = null;
          document.onmouseup = null;
          e = null;
          disX = null;
          disY = null;
          oDiv = null;
          _this = null;
          x1w1 = null;
          x1Y1 = null;
          obj = null;
          this.drop = null;
        }
      },
      greet(val){
        var arr = this.data.tagList;
        arr[val.i].lableX = val.x;
        arr[val.i].lableY = val.y;
      },
      //获取标签的宽高
      getWidth(num){
        var arr = this.data.tagList;
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
                document.getElementById(n).style.width = x1W / 375 * i1 + 'px';
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
              document.getElementById(n).style.width = x1W / 375 * i1 + 'px';
            }
          }
        }
        i1 = null;
        i2 = null;
        x1 = null;
        x1W = null;
        x1Y = null;
      },

      imgUpload(){
        let this_ = this;
        this_.loading2 = true;
        let pro = new Promise((resolve, reject) => {
          let img = new Image();
          img.onload = function () {
            let ir = setTimeout(() => {
              this_.loading2 = false;
              resolve();
              clearTimeout(ir);
            }, 500)
          };
          img.src = this_.dialogImgSrc;
        });
        return pro;
      },
      viewImg(src){
        this.dialogImgSrc = src;

        this.imgUpload().then(() => {
          this.outerVisible = true;
          this.isViews = true;
          this.remove();
          this.$nextTick(() => {
            let ids = setTimeout(() => {
              this.getWidth();
              this.getTags();
              window.clearTimeout(ids);
            }, 0)
          })
        });
      },
      remove(){
        let this_ = this;
        window.addEventListener('resize', () => {
          if (this.outerVisible) {
            this_.getTags();
            return;
          }
          this_.removeHander(window, 'onresize', this_.getTags);
        });
      },
      addTags(src, index){
        this.dialogImgSrc = src;
        this.dialogImgIndex = index;

        this.imgUpload().then(() => {
          this.outerVisible = true;
          this.isViews = false;
          this.remove();
          this.getHistorTagList();
          this.getHistoryTagList();
          this.getTagList();
          this.$nextTick(() => {
            setTimeout(() => {
              this.getWidth();
              this.getTags();
            }, 0)
          })
        });

      },
      //删除标签之后重新记录
      //删除标签
      removeTag(index){
        if (this.isView || this.isViews) {
          return;
        }
        var arr = this.data.tagList;
        arr.splice(index, 1);
        if (arr.length > 0) {
          this.getTags();
        }
      },
      checkoutType(index, val){
        if (this.isView || this.isViews) {
          return;
        }
        var arr = this.data.tagList;
        var oDiv = document.getElementById(`tagIs${val}`);
        var x1w1;
        var x1Y1;

        if (arr[val].lableDirection == 1) {
          arr[val].lableDirection = 2;
          this.aaa = !this.aaa;
//          this.$set(this.data.tagList[val],'lableDirection',2);
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
          this.aaa = !this.aaa;
        }
//        this.getWidth();
//        this.getTags();
      },
      //记录选择添加的标签
      //关闭标签选择弹窗
      cheTagHandler(val, index, tagType){
        var arr = this.data.tagList;
        if (arr.length > 3) {
          message(this, '最多添加四条标签', 'warning');
          return;
        } else {
          arr.push({
            uploaddetailId: this.data.picId,
            id: '',
            name: val.tagName,
            lableDirection: 1,
            lableId: val.tagId,
            lableX: 0,
            lableY: 0,
            tagType: tagType,
          });
          setTimeout(() => {
            this.getWidth(1);
            this.setHistoryTagList(val.tagId);
          }, 0)
        }
        this.dialogFormVisibles = false;
      },
      //记录选择添加的标签
      //关闭标签选择弹窗
      cheTagHandlers(val, index, tagType){
        var arr = this.data.tagList;
        if (arr.length > 3) {
          message(this, '最多添加四条标签', 'warning');
          return;
        } else {
          arr.push({
            uploaddetailId: this.data.picId,
            id: '',
            name: val.name,
            lableDirection: 1,
            lableId: val.lableId,
            lableX: 0,
            lableY: 0,
            tagType: val.tagType,
          });

          let ids = setTimeout(() => {
            this.getWidth(1);
            this.setHistoryTagList(val.lableId);
            clearTimeout(ids);
          }, 0);

        }
        this.dialogFormVisibles = false;
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
      //获取标签位置
      getTags(){

        var arr = this.data.tagList;
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
            y2 = y2 - i2;
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

        i1 = null;
        i2 = null;
        x1 = null;
        x1W = null;
        x1Y = null;
        oDiv = null;
      },
      //保存当前图片的标签
      subMitTag(){
        this.$confirm('确认保存吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let body = {};
          body.tagList = this.data.tagList;
          body.photoId = this.data.picId;
          this.$http('/buildingCamera/setPhotoLabels', {body}, {}, {}, 'post').then(res => {
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
            this.$emit('tagUpdate');
            this.outerVisible = false;
          }).catch(() => {
          });
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '取消操作!'
          });
        })
      },

      //取消保存
      closeDia(){
        this.data.tagList = [];
      },
      show1(){
          console.log(1);
      }
    }

  }
</script>
<style scoped>
  .houseAuditList {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .audit-ine-img {
    width: 100%;
    height: 100%;
    background-size: cover;
    position: relative;
  }

  .video-in {
    width: 100%;
    height: 100%;
  }

  .houseAuditList:hover .wap {
    display: block;
  }

  .houseAuditList .wap {
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

  .houseAuditList .wap .ico {
    color: #FFF;
  }

  .wap i {
    display: inline-block;
    margin-top: 20%;
    margin-bottom: 0;
  }

  .addTag {
    width: 200px;
    height: 50px;
    line-height: 50px;
    color: #fff;
    margin: auto;
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
    background: rgba(255, 0, 0, .4);
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

  .historTag span {
    display: inline-block;
    width: 150px;
    height: 50px;
    background: ghostwhite;
    text-align: center;
    line-height: 50px;
    margin-left: 5px;
    margin-top: 5px;
  }

  .audit-ine-imgs {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }

  .audit-ine-imgs img {
    width: 100%;
    max-height: 100%;
  }
</style>
