<template>
  <div class="cascader">
    <el-form-item :label="labels">
      <el-cascader
        expand-trigger="hover"
        :options="options"
        v-model="selectedOptions"
        @change="change_handler"
        style="width:100%;"

      >
      </el-cascader>
      <!--<div v-else>-->
      <!--<span>{{tp_d}}</span>-->
      <!--<span v-if="me_d">{{'/' + me_d }}</span>-->
      <!--<span v-if="mc_d">{{'/' + mc_d}}</span>-->
      <!--<span v-if="mg_d">{{'/' + mg_d}}</span>-->
      <!--</div>-->
    </el-form-item>
  </div>
</template>
<script>
  export default{
    name: 'cascader',
    data(){
      return {
        options: [],
        // EqcList:null,
        selectedOptions:[],
        tp_d: '',
        me_d: '',
        mc_d: '',
        mg_d: '',
        EqcList: [],
        defList: [],
        userList: [],
        bkUserList: [],
        userLists: [],
        buildingName2s:''
      }
    },
    // props: [
    //   "labels",
    //   "type"
    // ],
    props:{
      labels:{
        default:'',
      },
      type:{
        default:''
      },
      _buildingName2:{
        default:'/HistoryBuilding/getQuerySource',
      }
    },
    methods: {
      getOptions(){
        for (let i in this.EqcList) {
          this.options.push({
            value: this.EqcList[i].id,
            label: this.EqcList[i].name
          });
          this.options[i].children = [];
          for (let j in this.EqcList[i].arrayList) {
            this.options[i].children.push({
              value: this.EqcList[i].arrayList[j].id,
              label: this.EqcList[i].arrayList[j].name
            });
            this.options[i].children[j].children = [];
            for (let a in this.EqcList[i].arrayList[j].arrayList) {
              this.options[i].children[j].children.push({
                value: this.EqcList[i].arrayList[j].arrayList[a].id,
                label: this.EqcList[i].arrayList[j].arrayList[a].name
              });
            }
          }
        }
      },
      change_handler(){
        this.$emit('checkoutHanler', this.selectedOptions,this.type);
        console.log(this.selectedOptions,this.type);
      },
      //获取查询数据列表
      f_getViewData(){
        let [_this, body] = [this, {}];
        this.$http(this.buildingName2s, {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            this.EqcList = res.data.response.EqcList;
            this.defList = res.data.response.defList;
            this.userList = res.data.response.userList;
            this.bkUserList = res.data.response.bkUserList;
            console.log(this.EqcList);
            this.getOptions();
          }
        })
//        this.$axios.get(baseURL + '/HistoryBuilding/getQuerySource').then(res => {
//          if (res.data.code == 0) {
//            this.EqcList = res.data.response.EqcList;
//            this.defList = res.data.response.defList;
//            this.userList = res.data.response.userList;
//            this.bkUserList = res.data.response.bkUserList;
//          }
//        })
      },
      //当三级联动值改变的时候，拿到改变后的值
      checkoutHanlerOn(data, type){
        console.log(data[2],444);

        if(!data[2]){
          this.filterForm1.did='';
          this.filterForm3.did='';
        }
        if (type == 1) {
          this.filterForm1.rid = data[2];
          this.getFore(1);
        } else {
          this.filterForm3.rid = data[2];
          this.getFore(3);
        }
      },
    },
    created(){
      this.buildingName2s = this._buildingName2;
      this.f_getViewData();
        // this.selectedOptions = this.selectedOptions2;
      // this.EqcList = this.EqcLists;
      console.log(this.EqcList,1);

      // this.$nextTick(() => {
      //   setTimeout(() => {

      //   },1000)
      // })

    },


//      get_type(index){
//        let url = '/buildingConstructionReport/constructionSourceInfo';
//        let body = {};
//        body.sourceType = '2';
//        this.$http(url, {body}, {}, {}, 'post').then(res => {
//          if (res.data.code == 0) {
//
//            for (let i in res.data.response.list) {
//              this.options.push({
//                value: res.data.response.list[i].key,
//                label: res.data.response.list[i].value
//              });
//            }
//            this.get_type_three(0);
//          }
//        })
//      },
//      get_type_three(index){
//        let url = '/buildingContribution/querySourceListInfo';
//        let body = {};
//        body.sourceStatus = '1';
//        this.$http(url, {body}, {}, {}, 'post').then(res => {
//          if (res.data.code == 0) {
//            for (let i in this.options) {
//              if (i == 0) {
//              } else {
//                this.options[i].children = [];
//                for (let j in  res.data.response.list) {
//                  this.options[i].children.push({
//                    value: res.data.response.list[j].menuId,
//                    label: res.data.response.list[j].menuName,
//                  });
//                  this.options[i].children[j].children = [];
//                  for (let b in res.data.response.list[j].menuChildList) {
//                    this.options[i].children[j].children.push({
//                      value: res.data.response.list[j].menuChildList[b].menuChildId,
//                      label: res.data.response.list[j].menuChildList[b].menuChildName,
//                    });
//                    this.options[i].children[j].children[b].children = [];
//                    for (let c in res.data.response.list[j].menuChildList[b].menuGrandList) {
//                      this.options[i].children[j].children[b].children.push({
//                        value: res.data.response.list[j].menuChildList[b].menuGrandList[c].menuGrandId,
//                        label: res.data.response.list[j].menuChildList[b].menuGrandList[c].menuGrandName,
//                      });
//                    }
//                  }
//                }
//              }
//            }
//          }
//        })
//      },


  }
</script>
<style>
  .el-cascader {
    width: 40% !important;
  }
</style>
