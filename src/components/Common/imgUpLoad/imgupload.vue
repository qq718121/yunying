<template>
  <div>
    <form id="videoForm" style="padding: 50px 0 50px 10px;">
      <input v-show="false" type="file" accept="image/gif" @change="fileLoad" multiple="multiple"
             class="file-load" id="file-load" readonly ref="upload" webkitdirectory directory>
      <el-button type="primary" @click="aaa" class="el-icon-share icon">&nbsp;选择文件</el-button>
      <el-button type="primary" @click="submits">全部上传<i class="el-icon-upload el-icon--right"></i></el-button>
      <el-button type="danger" @click="allRemove">全部删除 <i class="el-icon-delete icon"></i></el-button>
    </form>
    <div style="position: relative;display: flex;flex-wrap: wrap">

      <div class="img-container" :style="{backgroundImage:'url('+val.src+')'}" v-for="(val,index) in imgs">
        <div v-show="val.isShow"
             style="text-align: center;position: absolute;top: 50%;margin-top: -65px;margin-left: -60px;left: 50%;z-index: 999999999">
          <el-progress type="circle" :percentage="val.stage" status=""></el-progress>
        </div>
        <div class="wap">
          <i class="el-icon-view ico" @click="viewImg(val.src)"></i>
          <i class="el-icon-upload2 ico" @click="submittwo(index)"></i>
          <i class="el-icon-delete ico" @click="deletes(index)"></i>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="outerVisible">
      <div style="overflow: hidden;margin-top: 20px;">
        <div :style='`transform:scale(${scaleX/50},${scaleX/50});position: relative`'>
          <img style="width:100%" :src="dialogImgSrc" alt="">
        </div>
      </div>
    </el-dialog>
  </div>
  <!--<div class="imgupload" style="position: relative">-->
  <!--<div class="upBtn">-->
  <!--<el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
  <!--<el-button style="margin: auto;" size="small" type="success" @click="submitUpload">-->
  <!--开始上传-->
  <!--</el-button>-->
  <!--</div>-->
  <!--<el-upload-->
  <!--class="upload-demo"-->
  <!--ref="upload"-->
  <!--:action="baseUrls"-->
  <!--:on-preview="handlePictureCardPreview"-->
  <!--:on-remove="handleRemove"-->
  <!--:file-list="fileList"-->
  <!--:data="datas"-->
  <!--list-type="picture-card"-->
  <!--multiple-->
  <!--:http-request="a"-->
  <!--:auto-upload="false"-->
  <!--&gt;-->
  <!--&lt;!&ndash;<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>&ndash;&gt;-->
  <!--</el-upload>-->
  <!--<el-dialog :visible.sync="dialogVisible">-->
  <!--<img width="100%" :src="dialogImageUrl" alt="">-->
  <!--</el-dialog>-->
  <!--</div>-->
</template>
<script>
  import $ from 'jquery'
  import Url from '../../../common/url'
  export default {
    data() {
      return {
        dialogVisible: false,
        dialogImageUrl: '',
        dialogImgSrc: '',
        scaleX: 50,
        fileDa: '',
        outerVisible: false,
        fileList: [],
//        baseUrl:Url + '/HistoryBuilding/uploadPhotos',
        baseUrls: '/HistoryBuilding/uploadPhotos',
        datas: {
          token: localStorage._Mjb_token
        },
        formData: [],
        formData2:{
          token:"",
          buildingId:"",
          allName:"",
          imgurl : "",
          readyName: "",
          status: ""
        },
        imgs: []
      };
    },

    methods: {
      aaa(){
        this.$refs.upload.click();
      },
      //上传图片保存路径函数及兼容性处理
      getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      },
      fileLoad(){
        var that = this;
        for (let j = 0; j < that.$refs.upload.files.length; j++) {
          that.formData.push(that.$refs.upload.files[j]);
        }
        for (let i = 0; i < that.formData.length; i++) {
          let fileT = that.formData[i].webkitRelativePath.indexOf('.') + 1;
          let str = that.formData[i].webkitRelativePath.slice(fileT, that.formData[i].webkitRelativePath.length);
          if (str != 'png' && str !="jpg" && str != "bmp") {
            that.formData.splice(i, 1);
          }
          var objUrl = that.getObjectURL(that.formData[i]);
          var obj = {
            src: objUrl,
            stage: 0,
            isShow: false,
            isUp: false
          };
          this.$set(this.imgs, i, obj);
          console.log(that.formData);
        }
        var videoForm = document.getElementById("videoForm"); //获取表单对象
        videoForm.reset();// 重置表单
      },
      deletes(index){
        if (this.imgs.length > 0) {
          this.imgs.splice(index, 1);
          this.formData.splice(index, 1);
        } else {
          return;
        }
      },
      allRemove(){
        if (this.imgs.length > 0) {
          this.imgs.splice(0, this.imgs.length);
          this.formData.splice(0, this.formData.length);
        }
      },
      viewImg(val){
        this.dialogImgSrc = val;
        this.outerVisible = true;
      },
      submittwo(index){
        let that = this;
        if (this.formData.length <= 0) {
          return;
        }
        if (this.imgs[index].isUp) {
          return;
        }
        var fd = new FormData();
        fd.append('file', this.formData[index]);
        fd.append('filename', this.formData[index].images);
        fd.append("name", this.formData[index].imagesName);
        fd.append("token", localStorage._Mjb_token);
        fd.append("buildingId", this.$route.query.id);
        this.$axios({
          method: 'post',
          url: Url + this.baseUrls,
          data: fd,
//            headers: {'Content-Type': 'multipart/form-data'},
          onUploadProgress(progressEvent){
            if (progressEvent.lengthComputable) {
              let val = (progressEvent.loaded / progressEvent.total * 100).toFixed(0);
              that.imgs[index].isShow = true;
              setTimeout(() => {
                that.imgs[index].stage = parseInt(val);
              }, 300);

              setTimeout(() => {
                if (that.imgs[index].stage = 100) {
                  that.imgs.splice(index, 1);
                  that.formData.splice(index, 1);
                  that.imgs[index].isShow = false;
                }
              }, 1000)
            }
          }
        }).then((response) => {
          if (response.data.code == '500') {
            this.$message({
              type: 'error',
              message: `图片命名无效!`
            });
            return;
          }
          this.imgs[index].isUp = true;
        }).catch(function (error) {
          console.log(error);
        })
      },
      submits(){
        let that = this;
        if (this.formData.length <= 0) {
          return;
        }
        for (let i = 0; i < this.formData.length; i++) {
          if (!this.imgs[i].isUp) {
            var fd = new FormData();
            fd.append('file', this.formData[i]);
            fd.append('filename', this.formData[i].images);
            fd.append("name", this.formData[i].imagesName);
            fd.append("token", localStorage._Mjb_token);
            fd.append("buildingId", this.$route.query.id);
            this.$axios({
              method: 'post',
              // url: Url + this.baseUrls,
              url:'http://www.cnmjw.com.cn/upload/multiUploadId',
              data: fd,
              headers: {'Content-Type': 'multipart/form-data'},
              onUploadProgress(progressEvent){
                if (progressEvent.lengthComputable) {
                  let val = (progressEvent.loaded / progressEvent.total * 100).toFixed(0);
                  that.imgs[i].isShow = true;
                  setTimeout(() => {
                    that.imgs[i].stage = parseInt(val);
                  }, 100);
                  if (that.imgs[i].stage = 100) {
                    setTimeout(() => {
                      that.imgs[i].isShow = false;
                      that.imgs[i].isUp = true;
                      if (i == that.formData.length - 1) {
                        that.allRemove();
                      }
                    }, 1000);
                  }

                }
              }
            }).then((response) => {
              if (response.data.code == '500') {
                this.$message({
                  type: 'error',
                  message: `第${i + 1}张图片命名无效!`
                });
              } else {
                  console.log(response);
                  if(response.status == 200){
                    console.log(response);
                    let [_this, body] = [this, this.formData2];
                    console.log(body);
                    body.token = localStorage._Mjb_token;
                    body.buildingId = this.$route.query.id;
                    body.allName = response.data.allName;
                    body.imgurl = response.data.imgurl;
                    body.readyName = response.data.readyName;
                    body.status = response.data.status;
                    this.$http('/HistoryBuilding/uploadPhotos', {body}, {}, {}, 'post').then(res => {
                      if (res.data.code == 0) {
                        console.log(res);
                      }
                    })
                  }
              }
              console.log(this.formData2);
            }).catch(function (error) {
              console.log(error);
            })
          }
        }
      }
//      submitUpload() {
//        this.$refs.upload.submit();
//      },
//      handleRemove(file, fileList) {
//
//      },
//      handlePictureCardPreview(file) {
//        this.dialogImageUrl = file.url;
//        this.dialogVisible = true;
//      },
//      a(file){
//        var formdata1 = new FormData();// 创建form对象
//        formdata1.append('file', file.file, file.file.name);// 通过append向form对象添加数据,可以通过append继续添加数据
//        let config = {
//          headers: {
//            'Content-Type': 'multipart/form-data',
//            'accept': '*/*'
//          }
//        };
////        let url = Url + '/HistoryBuilding/uploadPhotos';
//        let url = this.baseUrls;
//        this.$axios.post(url, formdata1, config).then((res) => {
//          console.log(res);
//        });
//      },
//      b(response, file, fileList){
//        console.log(response, file, fileList);
//      }
    },
    created(){
      console.log();
    }
  }
</script>
<style scoped>
  .upBtn {
    margin: 30px auto;
    text-align: center;
  }

  .upBtn button {
    margin: auto;
    width: 200px;
    height: 60px;
    font-size: 20px;
  }

  .upBtn button:nth-child(1) {
    position: absolute;
    left: 0;
  }

  .img-container {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 10px 10px 10px 10px;
    /*position: relative;*/
    /*cursor: pointer;*/
    /*margin-top: 20px;*/
    /*height: 180px;*/
    /*padding-top: 100px;*/
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
</style>
<style>
  .el-upload-list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .el-upload-list--picture .el-upload-list__item {
    width: 400px;
    height: 300px;
  }

  .el-upload-list--picture .el-upload-list__item-thumbnail {
    width: 100%;
    height: 100%;
  }

  .el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name {
    position: absolute;
  }

  .el-upload--picture-card {
    position: absolute;
    top: 0;
    height: 60px;
    width: 200px;
    background: #fff;
    border: none;
    z-index: 999;
    opacity: 0;
  }

  .img-container:hover .wap {
    display: block;
  }

  .img-container .wap {
    width: 100%;
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

  /*.el-upload--picture-card:before {*/
  /*content: '选取文件';*/
  /*position: absolute;*/
  /*top:-42px;*/
  /*height:100%;*/
  /*width:100%;*/
  /*}*/
</style>
