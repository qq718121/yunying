<template>
  <div>
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
    <div style="padding:20px">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-loading="contrationLoading">
        <el-tab-pane label="基础信息" name="first">
          <EstateConstructionReportBasic :buildingId="buildingId"/>
        </el-tab-pane>
        <el-tab-pane label="建设进度" name="second" :disabled='first_is'>
          <EstateConstructionReportBuild :buildingId="buildingId"/>
        </el-tab-pane>
        <el-tab-pane label="施工现场" name="third" :disabled="first_is">
          <EstateConstructionReportCons :buildingId="buildingId"/>
        </el-tab-pane>
        <el-tab-pane label="整改记录" name="four" :disabled="first_is">
          <EstateConstructionReportRecti :buildingId="buildingId"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import Subnav2 from '../Subnav2/Subnav2';
  import EstateConstructionReportBasic from '../EstateConstructionReportBasic/EstateConstructionReportBasic';
  import EstateConstructionReportBuild from '../EstateConstructionReportBuild/EstateConstructionReportBuild';
  import EstateConstructionReportCons from '../EstateConstructionReportCons/EstateConstructionReportCons';
  import EstateConstructionReportRecti from '../EstateConstructionReportRecti/EstateConstructionReportRecti';
  import message from '../../common/message';
  import {mapState} from 'vuex';
  export default{
    name: 'EstateConstructionReportTab',
    components: {
      Subnav2,
      EstateConstructionReportBasic,
      EstateConstructionReportBuild,
      EstateConstructionReportCons,
      EstateConstructionReportRecti
    },
    data(){
      let name = this.$route.query.buildingName;
      return {
        tabLoading:true,
        activeName: 'first',
        bar_index: null,
        navList: [
          {path: '/index/estateprocessmonitoringmanagement', name: '首页'},
          {path: this.$route.query.path, name: this.$route.query.buildingName},
          {path: this.$route.fullPath, name: '建设中报告'}
        ],
        infoList:[]
      }
    },
    created(){
      this.$store.dispatch('defaultIndexAction', '/index/estateprocessmonitoringdetail');
    },
    computed: {
      ...mapState({
        first_is: state => state.first_is,
        contrationLoading: state => state.contrationLoading
      }),
      buildingId: function () {
        return this.$route.query.buildingId;
      }
    },
    methods: {
      //tab切换
      handleClick(tab){
        this.bar_index = tab.$data.index;
      },

      //刷新
      refresh(){
        bus.$emit('tip', this.bar_index);
      }
    }
  }
</script>
<style scoped>

</style>
