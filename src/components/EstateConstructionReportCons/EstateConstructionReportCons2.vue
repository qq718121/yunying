<template>
  <div class="change">
    <el-form-item label="类别选择：" :label-width="formLabelWidth" required>
      <el-cascader
        expand-trigger="hover"
        :options="options"
        v-model="selectedOptions2"
        @change="handleSelect"
        style="width:50%;"
        ref="haha"
      >
      </el-cascader>
    </el-form-item>
  </div>
</template>

<script>
  export default {
    name: "EstateConstructionReportTab2",
    props: {
      _buildingId: {
        default: ''
      },
    },
    data(){
      return {
        formLabelWidth: '140px',
        options: [],
        selectedOptions: [],
        selectedOptions2: [],
        a:[]
      }
    },
    created(){
      window.bus.$on('f_buildingId',(val)=>{
        this.selectedOptions2 = [];
      });
      this.a = this._buildingId;
      this.get_type();
    },
    methods:{
      get_type(){
        let url = '/buildingConstructionReport/constructionSourceInfo';
        let body = {};
        body.sourceType = '2';
        this.$http(url, {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            for (let i in res.data.response.list) {
              this.options.push({
                value: res.data.response.list[i].key,
                label: res.data.response.list[i].value
              });
            }
            this.get_type_three(0);
          }
        })
      },
      get_type_three(index){
        let url = '/buildingContribution/querySourceListInfo';
        let body = {};
        body.sourceStatus = '1';
        this.$http(url, {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            for (let i in this.options) {
              if (i == 0) {
              } else {
                if (res.data.response.list.length > 0) {
                  this.options[i].children = [];
                }
                for (let j in  res.data.response.list) {
                  this.options[i].children.push({
                    value: res.data.response.list[j].menuId,
                    label: res.data.response.list[j].menuName,
                  });
                  if (res.data.response.list[j].menuChildList.length > 0) {
                    this.options[i].children[j].children = [];
                  }
//                  this.options[i].children[j].children = [];
                  for (let b in res.data.response.list[j].menuChildList) {
                    this.options[i].children[j].children.push({
                      value: res.data.response.list[j].menuChildList[b].menuChildId,
                      label: res.data.response.list[j].menuChildList[b].menuChildName,
                    });
                    if (res.data.response.list[j].menuChildList[b].menuGrandList.length > 0) {
                      this.options[i].children[j].children[b].children = [];
                    }
//                    this.options[i].children[j].children[b].children = [];
                    for (let c in res.data.response.list[j].menuChildList[b].menuGrandList) {
                      this.options[i].children[j].children[b].children.push({
                        value: res.data.response.list[j].menuChildList[b].menuGrandList[c].menuGrandId,
                        label: res.data.response.list[j].menuChildList[b].menuGrandList[c].menuGrandName,
                      });
                    }
                  }
                }
              }
            }
          }
        })
      },
      handleSelect(str){
        // console.log(str);
        // console.log(this.selectedOptions2);
        this.$emit('update:_buildingId',this.selectedOptions2);
      },
      mounted(){

      },
    },
  }
</script>

<style scoped>

</style>
