<template>
  <el-menu :router="router" :default-active="defaultIndex" class="el-menu-vertical-demo leftbar" @open="handleOpen"
           @close="handleClose" :unique-opened=true style="overflow-x:hidden" :style="navStyle">
    <el-submenu :index="(index+1).toString()" v-for="(item,index) in navList" :key="item.name">
      <template slot="title">
        <i :class="item.icon" style="margin-right:10px"></i>
        <span slot="title">{{item.name}}</span>
      </template>
      <el-menu-item v-for="(item2,index2) in item.subList"
                    :key="item2.index2"
                    :index="item2.sourceUrl">
        {{item2.name}}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
  import {mapState} from 'vuex';
  import message from '../../common/message';
  export default {
    name: 'leftbar',
    data() {
      return {
        router: true,
        navList: []
      };
    },
    computed: {
      name () {
        return 'first'
      },
      ...mapState({
        navStyle: state => state.navStyle,
        defaultIndex: state => state.defaultIndex
      })
    },
    created(){
      this.initData();
    },
    methods: {
      initData(){
        if (localStorage._Mjb_navList) {
          this.navList = JSON.parse(localStorage._Mjb_navList);
        } else {
          this.$router.push('/login');
        }
      },
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      },
    },
    mounted(){

    }
  }
</script>

<style scoped>

  .leftbar::-webkit-scrollbar-thumb {
    background: #324157;
    width: 3px
  }

  .leftbar::-webkit-scrollbar-track {
    background: #ccc;
    width: 3px
  }

  .leftbar::-webkit-scrollbar {
    width: 3px
  }
</style>
