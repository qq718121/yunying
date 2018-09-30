<template>
    <div class="addOperateAdminDetails">
        <Subnav2 :navList="navList" ></Subnav2>
        <div style="margin:40px;">
            <el-form :model="from" class="demo-form-inline">
                <el-form-item label="标题：" required>
                    <el-input v-model="from.titile" placeholder="标题" style="width:300px;"  v-if="type != 'look'"></el-input>
                    <span v-else>{{from.titile}}</span>
                </el-form-item>
                 <el-form-item label="摘要"  :label-width="labelWidth" required>
                   <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        style="width:300px;"
                        v-model="from.abstracts">
                        </el-input>
                </el-form-item>
                <el-form-item label="添加图片"
                        required>
                    <ImgPreview
                    :backgroundPicUrl="preImgSrcList[0].picUrl"
                    @previewImg="previewImg()"
                    @deleteImg="deleteImg()"
                    :isShowDelete="false"
                    />
                    <!--&lt;!&ndash;:isShowDelete="!item.build_show"&ndash;&gt; 是否显示删除按钮-->
                    <!--隐藏重新上传-->
                    <ImgUploader2
                    v-if="type != 'look'"
                    style="margin-left:60px;"
                    :btnId="btnName2"
                    @imgUploader="imgUploader(0)"
                    :btnName="btnNames"
                    />
                </el-form-item>
                <el-form-item label="地址：" required>
                    <el-input v-model="from.newsAddress" placeholder="地址" style="width:300px;" v-if="type != 'look'"></el-input>
                    <span v-else>{{from.newsAddress}}</span>
                </el-form-item>
                <el-form-item label="次序：" required>
                    <el-input type="number" v-model="from.newsOrder" placeholder="次序" style="width:300px;" v-if="type != 'look'"></el-input>
                    <span v-else>{{from.newsOrder}}</span>
                </el-form-item>
                <el-form-item label="状态：" required>
                    <el-radio-group v-model="from.newsStatus" v-if="type != 'look'"> 
                        <el-radio :label="1">在线</el-radio>
                        <el-radio :label="0">离线</el-radio>
                    </el-radio-group>
                    <span v-else>{{from.newsStatus == 1? "在线" : "离线"}} </span>
                </el-form-item>
                
                <el-form-item label="上线时间：" v-if="type != 'add'">
                    <p>{{from.newsUptime}}</p>
                </el-form-item>
                <el-form-item label="下线时间：" v-if="type != 'add'">
                   <p>{{from.newsDowntime}}</p>
                </el-form-item>
                <el-row>
                    <el-button type="primary" v-if="type != 'look'" @click="submitFrom">确认</el-button>
                    <el-button @click="back">返回</el-button>
                 </el-row>

            </el-form>
            <el-dialog :visible.sync="dialogVisible" size="tiny">
                <div class="addImg">
                    <img width="100%" :src="dialogImgSrc" alt="">
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import Subnav2 from '../Subnav2/Subnav2';
import uploader2 from '../../common/uploader2.js'
import ImgPreview from '../Common/ImgPreview/ImgPreview';
import ImgUploader2 from '../Common/ImgUploader2/ImgUploader2'
export default {
    name:'addOperateAdminDetails',
    components:{
      Subnav2,
      ImgPreview,
      ImgUploader2
    },
    data(){
        return{
            btnList:[],
            labelWidth:"",
            currentPage:1,
            navList: [
                {path: '/activity/homepagemanagement', name: '运营管理'},
                {path: '/activity/addoperateadminlists?columnName='+this.$route.query.columnName+'&columnId='+this.$route.query.columnId, name: '文章管理'},
                {path: '', name: this.$route.query.columnName},
            ],
            from:{
                newsId:"",
                newsStatus:"",
                titile:"",
                picUrl:"",
                newsOrder:"",
                newsAddress:"",
                abstracts:""
            },
            btnNames:"上传图片",
            preImgSrcList:[
                {
                    picUrl:""
                }
            ],
            uploaderList: [{ uploader: null }],
            btnName2:'',
            dialogVisible:false,
            dialogImgSrc:'',
            type:this.$route.query.type,
        }
    },
    created(){
        this.init();
        this.initUploader(0);
    },
    methods:{
        init(){
            if(this.$route.query.data){
                this.from = JSON.parse(this.$route.query.data);
                if(this.from.picUrl){   
                    this.preImgSrcList[0].picUrl = this.from.picUrl;
                }
            }
        },
        //初始化插件
        initUploader(index){
            let _this = this,
            btnName = 'Btn' + index;
            this.btnName2 = btnName;
            uploader2(function (src) {
            _this.preImgSrcList[0].picUrl = src;
            }, function (key) {
            _this.from.picUrl = key;
            }, function () {
            _this.preImgSrcList[0].picUrl = '';
            }, function (uploader) {
            _this.uploaderList[0].uploader = uploader;
            }, btnName, false)
        },
        imgUploader(index){
            if (this.uploaderList[0].uploader == null) {
                return;
            }
            this.uploaderList[0].uploader.start();
        },
        previewImg(){
            this.dialogVisible = true;
            this.dialogImgSrc = this.preImgSrcList[0].picUrl;
        },
        back(){
             this.$router.push({
                path: '/activity/addoperateadminlists',
                query: {
                    columnName: this.$route.query.columnName,
                    columnId:this.$route.query.columnId,
                }
            });
        },
        submitFrom(){
            let body = this.from,
                _this = this;
            if((this.from.newsStatus == "" && this.from.newsStatus != 0) || this.from.titile == "" || this.from.picUrl == "" || this.from.newsOrder == "" || this.from.newsAddress == "" || this.from.abstracts == ""){
                 this.$message({
                    type: 'info',
                    message: "有必填项未填写！"
                });
                return;
            }
            body.columnId = this.$route.query.columnId;
             this.$http('/buildingOperate/editOperationColumnNews',{body},{},{},'post').then(function(res){
                if(res.data.code== 0 ){
                    _this.$message({
                        type: 'info',
                        message: "提交成功"
                    });
                    _this.back();
                }
            }).catch(function(err){
                console.log(err)
            })
        },
    },
}
</script>

<style scoped>
    .addnew_wap{border: 1px solid #eee;margin:20px;padding:20px;}
    
</style>


