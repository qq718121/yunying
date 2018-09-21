<template>
  <div class="monitoringUp">
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
    <div class="monitoringUp-ine">
      <div class="monitoringUp-ine-top">上传照片</div>
      <ImgUp />
    </div>
  </div>
</template>
<script>
  import Subnav2 from '../../Subnav2/Subnav2'
  import ImgUp from '../../Common/imgUpLoad/imgupload.vue'
  export default {
    data(){
      return {
        navList: [
          {path: '/unopened/estateunopenedexamine', name: '首页'},
          {path: '/monitoring/monitoringHistoricPhotos', name: '历史照片'},
          {path: this.$route.fullPath, name: this.$route.query.name}
        ]
      }
    },
    components: {
      Subnav2,
      ImgUp
    },
    methods: {
      onSubmit(){

      },
      //刷新方法
      refresh(){

      },
    }
  }
</script>
<style scoped>
  .monitoringUp-ine {
    padding: 20px;
  }

  .monitoringUp-ine-top {
    width: 100%;
    height: 30px;
    background: cornflowerblue;
    text-align: center;
    line-height: 30px;
    color: #fff;
  }

</style>
