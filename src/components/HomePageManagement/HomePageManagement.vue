<template>
    <div class="homePageManagement">
         <Subnav2 :navList="navList" ></Subnav2>
            <!-- 全景管理 -->
        <div>
            <div class="top_wap">
                <el-form class="demo-form-inline">
                    <el-form-item label="选择城市：">
                        <el-radio-group v-model="cid">
                            <el-radio :label="item.cid"
                            v-for="(item,index) in tableData.list"
                            :key="index"
                            >{{item.cityName}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <div class="top_wap">
                <p class="addTitle">全景管理</p>
                <panoramaAdmin :_cityId="cid" />
            </div>
            <!-- 运营管理 -->
            <div class="top_wap">
                <p class="addTitle">运营管理</p>
                <addOperateAdmin :_cityId="cid" />
            </div>
        </div>
    </div>
</template>
<script>
import Subnav2 from '../Subnav2/Subnav2'
import panoramaAdmin from '../panoramaAdmin/panoramaAdmin'
import addOperateAdmin from '../addOperateAdmin/addOperateAdmin'
export default {
    name:"homePageManagement",
    components:{
        Subnav2,
        panoramaAdmin,
        addOperateAdmin
    },
    data(){
        return{
            navList: [
                {path: '', name: '首页'},
                {path: '/activity/homepagemanagement', name: '首页管理'},
            ],
            cid:"",
            tableData:{
                list:[]
            }
        }
    },
    created(){
        this.getCity();
    },
    methods:{
        getCity(){
            let _this = this;
            this.$http('/buildingOperate/getCityInfoList',{},{},{},'post').then(function(res){
                if(res.data.code== 0 ){
                    _this.tableData = res.data.response;
                    _this.cid = res.data.response.list[0].cid;
                }
            }).catch(function(err){
                console.log(err)
            })
        },
    },
}
</script>
<style scoped>
    .top_wap{border: 1px solid #e9eef2;margin:20px;padding:20px;}
    .addTitle{
        line-height:40px;font-size:20px;
    }
</style>

