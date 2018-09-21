<template>
  <div style="padding:20px">
    <el-row>
      <el-col :span="4"
              @click.native="routeConstru1"
              style="cursor: pointer">
          <el-card :body-style="{ padding: '0px' }" class="report-card">
            <div >
              <p>楼栋进度</p>
            </div>
          </el-card>
      </el-col>
      <el-col :span="4"
              style="cursor: pointer"
              @click.native="routeConstru">
          <el-card :body-style="{ padding: '0px' }" class="report-card">
            <div>
              <p>报告管理</p>
            </div>
          </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import message from '../../common/message';
  export default{
    name:'EstateProcessMonitoringManagement',
    components:{
      message
    },
    data(){
      return{
          
      }
    },
    created(){
        
    },
    methods:{
      routeConstru(){
        this.$router.push({
          path: '/Index/estateconstructionreport',
          query: this.$route.query
        });
      },
      routeConstru1(){
        this.$router.push({
          path: '/index/estatebuildingprogress',
          query: this.$route.query
        });
      },
     
    }
  }
</script>

<style scoped>
  .report-card{
    padding: 14px;
    width: 120px;
    height:120px;
  }
  .report-card p{
    color: #777;
    font-size: 14px;
    text-align: center;
  }
  .report-card p:nth-child(1){
    margin:20px 0px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
</style>
