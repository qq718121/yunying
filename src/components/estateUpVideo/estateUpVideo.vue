<template>
  <div class="estateUpVideo">
    <Subnav2 :navList="navList"></Subnav2>
    <div class="monitoringUp-ine">
      <div class="monitoringUp-ine-top">上传视频</div>
      <!--<video src="http://owvhh3jdd.bkt.clouddn.com/%E4%B8%87%E7%A7%91%E5%9F%8E_1520490241774613?avvod/m3u8/s/750x422/vb/1000k"></video>-->
      <el-form :model="filterForm1" ref="filterForm1" label-width="100px" class="demo-dynamic">
        <el-form-item label="上传视频" requird prop="resource"
                      :rules="[{ required: true, message: ''}]"
        >
          <video id="aa" v-show="picUrl" style="width: 100%;" :src="picUrl" controls="controls"></video>
          <el-progress :text-inside="true" :stroke-width="18" :percentage="progress" status="success"></el-progress>
          <ImgUploader2
            :btnId="btnList"
            @imgUploader="imgUploader"
            :btnName="BtnName"
            v-show="isBtn"
          />
          <el-button :id="btnList" size="small" v-if="isUpBtn" @click="removeUp">取消上传</el-button>
        </el-form-item>

        <el-form-item label="视频分类" requird prop="menuId"
                      :rules="[{ required: true, message: ''}]"
        >
          <el-radio-group v-model="filterForm1.menuId" @change="menuIdChange($event,1)">
            <el-radio
              v-for="(item,index) in selectList"
              :key="item.menuName"
              :label="item.menuId">
              <span>{{item.menuName}}</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <div id="ha">
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
        </div> -->


        <el-form-item label="视频标题" prop="questionDesc" :maxlength="50"
                      :rules="[{ required: true, message: ''}]"
        >
          <el-input v-model="filterForm1.questionDesc"></el-input>
        </el-form-item>

        <el-form-item label="分享内容" prop="desc" :maxlength="500">
          <el-input type="textarea" v-model="filterForm1.shareDesc"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">立即创建</el-button>
          <el-button @click="resetForm()">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import Subnav2 from '../Subnav2/Subnav2'
  import uploader2 from '../../common/videoUploader'
  import ImgPreview from '../Common/ImgPreview/ImgPreview';
  import ImgUploader2 from '../Common/ImgUploader2/ImgUploader2'
  import 'video.js/dist/video-js.css'

  import {videoPlayer} from 'vue-video-player'
  export default {
    data(){
      return {
        navList: [
          {path: '/unopened/estateunopenedexamine', name: '首页'},
          {path: '/unopened/estateunopenedexamine', name: '质量寻光楼盘'},
          {path: this.$route.fullPath, name: this.$route.query.name}
        ],
        fileList: [{}],
        isBtn: true,
        filterForm1: {
          buildingId: this.$route.query.id,
          menuId: '',
          menuChildId: '',
          menuGrandId: '',
          videoUrl: '',
          isTop: '',
          questionDesc: '',
          shareDesc: '',
          locationType: '2',
          longitude: '0',
          latitude: '0',
          videoSize: '',
          videoDuration: ''
        },
        menuChildList1: [],
        menuGrandList1: [],
        menuChildList2: [],
        menuGrandList2: [],
        menuChildList3: [],
        menuGrandList3: [],
        selectList: [],
        qiniuUploader: null,
        progress: 0,
        isUpBtn: false,
        BtnName: '上传视频',
        btnList: 'Btn00',
        picUrl: '',
        uploader: '',
        rules: {},
        fileList3: [],
        handleChange(file, fileList) {
          this.fileList3 = fileList.slice(-3);
        }
      }
    },
    components: {
      Subnav2,
      ImgPreview,
      ImgUploader2
    },
    methods: {
      submitForm() {
        if (this.picUrl == '' || this.filterForm1.questionDesc == '') {
          this.$message({
            message: '有必填项未填写',
            type: 'error'
          });
          return;
        }


        // if (this.filterForm1.menuId != '1') {
        //   if (this.filterForm1.menuChildId == "" || this.filterForm1.menuGrandId == '') {
        //     this.$message({
        //       message: '有必填项未填写',
        //       type: 'error'
        //     });
        //     return;
        //   }
        // } else if (this.filterForm1.menuChildId == '') {
        //   this.$message({
        //     message: '有必填项未填写',
        //     type: 'error'
        //   });
        //   return;
        // }
        if(this.filterForm1.menuId == ''){
            this.$message({
            message: '有必填项未填写',
            type: 'error'
          });
          return;
        }
        this.$confirm('确认提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let body = _.cloneDeep(this.filterForm1);
          this.$http('/buildingContribution/insertContributionVideo', {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              if (res.data.response.status == 1) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.resetForm();
              }
            }
          })
        }).catch(() => {

        });

      },
      resetForm() {
        // this.$router.go(-1);
         this.$router.push({
            path: '/unopened/estateunopenedexamine',
            query: {
                data:this.$route.query.data
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
        this[`filterForm${type}`].menuChildId = '';
        this[`filterForm${type}`].menuGrandId = '';
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
        this[`filterForm${type}`].menuGrandId = '';
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
      //楼盘景观图-插件初始化
      initUploader(index, num){
        let _this = this,
          btnName = 'Btn' + index + num;
        this.uploaders(function (src) {
          _this.picUrl = src;

        }, function (key) {
          _this.filterForm1.videoUrl = key;
          _this.isUpBtn = false;
        }, function () {

        }, function (uploader) {
          _this.uploader = uploader;
        }, btnName, false)
      },
      imgUploader(){
//        this.uploader.start();
//        console.log(this.uploader);
      },
      submitUpload(){
        this.$refs.upload.submit();
      },
      removeUp(){
        this.uploader.stop();
//        this.uploader.splice(0);
//        this.uploader.removeFile();
        this.$confirm('此操作将取消上传, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
//          this.uploader.remove();
          this.$message({
            type: 'success',
            message: '取消上传成功!'
          });
          this.isUpBtn = false;
          this.isBtn = true;
          this.picUrl = '';
          this.progress = 0;
        }).catch(() => {
          this.uploader.start();
          this.$message({
            type: 'info',
            message: '未能取消上传'
          });
        });
      },
      uploaders(successfunc, successfunc2, errfunc, func, btnName, multi_selection = true) {
        let _this = this;
        var uptoken = '';
        var uploader = '';
        this.$http('http://back.homehawkeye.com/maijiabangbackstate-1.0-SNAPSHOT/backstageUser/qiniuToken', 'get').then(function (res) {
          uptoken = res.data.response.qiNiuToken;
          // var Qiniu = new QiniuJsSDK();
          uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',      // 上传模式，依次退化
            browse_button: btnName,         // 上传选择的点选按钮，必需
            // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
            // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
            // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
            uptoken: uptoken, // uptoken是上传凭证，由其他程序生成
            // uptoken_url: '/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
            // uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
            //    // do something
            //    return uptoken;
            // },
            get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
            // downtoken_url: '/downtoken',
            // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
            unique_names: false,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
            save_key: false,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
            domain: 'domain',     // bucket域名，下载资源时用到，必需
            container: 'container',             // 上传区域DOM ID，默认是browser_button的父元素
            max_file_size: '100mb',             // 最大文件体积限制
            filters: {
              max_file_size: '100mb',
              // prevent_duplicates: true,
              // Specify what files to browse for
              mime_types: [
                {
                  title: "Image files", extensions: "mp4,flv"
                }, // 限定jpg,gif,png后缀上传
              ]
            },
            multi_selection: multi_selection,
            flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入flash，相对路径
            max_retries: 3,                     // 上传失败最大重试次数
            dragdrop: true,                     // 开启可拖曳上传
            drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '4mb',                  // 分块上传时，每块的体积
            auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
            //x_vars : {
            //    查看自定义变量
            //    'time' : function(up,file) {
            //        var time = (new Date()).getTime();
            // do something with 'time'
            //        return time;
            //    },
            //    'size' : function(up,file) {
            //        var size = file.size;
            // do something with 'size'
            //        return size;
            //    }
            //},
            init: {
              'FilesAdded': function (up, files) {
                plupload.each(files, function (file) {
                  for (var i = 0; i < files.length; i++) {
                    var fileItem = files[i].getNative(),
                      url = window.URL || window.webkitURL || window.mozURL;
                    var src = url.createObjectURL(fileItem);

                  }
                  _this.isBtn = false;
                  _this.isUpBtn = true;
                  // 文件添加进队列后，处理相关的事情
                });
              },
              'BeforeUpload': function (up, file) {
                // 每个文件上传前，处理相关的事情

              },
              'UploadProgress': function (up, file) {
                _this.progress = file.percent;
              },
              'FileUploaded': function (up, file, info) {
                // 每个文件上传成功后，处理相关的事情
                // 其中info是文件上传成功后，服务端返回的json，形式如：
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 查看简单反馈
                var domain = up.getOption('domain');
                var res = JSON.parse(info);
                var sourceLink = domain + "/" + res.key;
                successfunc2(res.key);
                _this.filterForm1.questionDesc = file.name;
                _this.isBtn = true;
                var fileItem = file.getNative(),
                  url = window.URL || window.webkitURL || window.mozURL;
                var src = url.createObjectURL(fileItem);
                if (file.size > 1024 * 1024) {
                  _this.filterForm1.videoSize = (Math.round(file.size / (1024 * 1024))).toString() + 'MB';
                }
                else {
                  _this.filterForm1.videoSize = (Math.round(file.size / 1024)).toString() + 'KB';
                }
                var a = document.getElementById("aa");
                var b, c, d;
                setTimeout(() => {
                  b = parseInt((a.duration) / 3600);
                  c = parseInt((a.duration % 3600) / 60);
                  d = Math.floor(a.duration % 60);
                  _this.filterForm1.videoDuration = `${c}：${d}`;
                }, 500);
                successfunc(src);

                // 获取上传成功后的文件的Url
              },
              'Error': function (up, err, errTip) {
                //上传出错时，处理相关的事情
                errfunc()
              },
              'UploadComplete': function () {
                //队列文件处理完毕后，处理相关的事情
              },
              'Key': function (up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在unique_names: false，save_key: false时才生效

                // var key = "文章"+'123';
                var key = "pms_" + new Date().getTime();
                // do something with key here
                return key
              }
            }
          });
          func(uploader)
        }).catch(function () {

        })
      }
    },
    created(){
      this.initUploader(0, 0);
      this.getSelectData();
    }
  }

</script>
<style scoped>
  .monitoringUp-ine {
    padding: 20px;
    width: 50%;
  }

  .monitoringUp-ine-top {
    width: 100%;
    height: 30px;
    background: cornflowerblue;
    text-align: center;
    line-height: 30px;
    color: #fff;
    margin-bottom: 50px;
  }
</style>
<style>
  #ha .el-form-item__content {
    margin-left: 0 !important;
  }

  #ha {
    padding-left: 30px;
  }
</style>

