<template>
  <div>
    <el-form label-width="100px" :model="form" class="demo-form-inline">

      <el-form-item label="报告名称" required>
        <el-input v-if="$route.query.type!='view'" size="small" v-model="form.reportName" style="width:300px"
                  placeholder="报告名称"
                  @change="basic_change"
        ></el-input>
        <span v-else>{{form.reportName}}</span>
      </el-form-item>
        <el-form-item label="楼盘期数" required>
          <el-select :clearable="true" 
           v-if="$route.query.type!='view'" 
          v-model="form.houseNumberId" placeholder="请选择期数" @change="basic_change">
              <el-option v-for="item in houseNumberList" 
                                :key="item.houseNumber" :label="item.houseNumber"
                                :value="item.houseNumberId">
                </el-option>
          </el-select>
          <span v-else>{{form.houseNumber}}</span>
        </el-form-item>
      <el-form-item label="报告期数" required>
        <el-select v-if="$route.query.type!='view'" size="small" @change="basic_change"
                   v-model="form.reportVersion" style="width:200px;">
          <el-option v-for="(item,index) in 100" :key="index" :label="'第'+item+'期'" :value="item"></el-option>
        </el-select>
        <span v-else>{{form.reportVersion}}</span>
      </el-form-item>

      <el-form-item label="当前状态" v-if="$route.query.type =='view'">
        <el-select v-model="form.isOnline.toString()" v-if="$route.query.type=='edit'">
          <el-option label="在线" value="2">在线</el-option>
          <el-option label="离线" value="1">离线</el-option>
        </el-select>
        <span v-else>{{form.isOnline == '2' ? '在线' : '离线'}}</span>
      </el-form-item>
      <el-form-item label="创建人" v-if="$route.query.type=='view'">
        <!--<el-input v-if="$route.query.type=='view'" size="small" v-model="form.createUserName" style="width:300px"-->
        <!--placeholder="创建人"></el-input>-->
        <span>{{form.createUserName}}</span>
      </el-form-item>
      <el-form-item label="创建时间" v-if="$route.query.type =='view'">
        <span>{{form.createTime}}</span>
      </el-form-item>
      <el-form-item label="编辑人" v-if="$route.query.type=='view'">
        <el-input v-if="$route.query.type!='view'" size="small" v-model="form.editUserName" style="width:300px"
                  placeholder="编辑人"></el-input>
        <span v-else>{{form.editUserName}}</span>
      </el-form-item>
      <el-form-item label="编辑时间" v-if="$route.query.type=='view'">
        <el-input v-if="$route.query.type!='view'" size="small" v-model="form.editTime" style="width:300px"
                  placeholder="编辑时间"></el-input>
        <span v-else>{{form.editTime}}</span>
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left:100px" type="primary" @click="onSubmit"
                   v-if="$route.query.type!='view' && basic_btn">
          <span>确认</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import message from '../../common/message';
  import {mapState} from 'vuex';
  export default{
    name: 'EstateConstructionReportTab',
    props: {
      buildingId: {
        default: ''
      }
    },
    components: {},
    data(){
      return {
        basic_btn: false,
        form: {
          reportName: '',
          reportVersion: 1,
          isOnline: 1,
          buildingId: this.buildingId,
          houseNumberId:'',
        },
        houseNumberList:[],
      }
    },
    created(){
      this.$store.dispatch('reportIdAction','');
      this.getHouseNumberList();
      bus.$on('tip', (text) => {
        switch (text) {
          case '0': {
            if (this.$route.query.type != 'add') {
              this.$store.dispatch('first_is_show_action', false);
              this.view_get();
//        this.getData();
//        console.log(this.$route.query);
            } else {
              this.$store.dispatch('first_is_show_action', true);
            }
            break;
          }
          default:
            if (this.$route.query.type != 'add') {
              this.$store.dispatch('first_is_show_action', false);
              this.view_get();
//        this.getData();
//        console.log(this.$route.query);
            } else {
              this.$store.dispatch('first_is_show_action', true);
            }
            break;
        }
      });
      if (this.$route.query.type != 'add') {
        this.$store.dispatch('first_is_show_action', false);
        this.view_get();
//        this.getData();
//        console.log(this.$route.query);
      } else {
        this.$store.dispatch('first_is_show_action', true);
      }
      if (this.$route.query.type == 'edit') {
        this.basic_show = true;
        this.basic_num_change = true;
      }
    },
    computed: {
      ...mapState({
        reportId: state => state.estate.reportId,
      })
    },
    methods: {
      basic_show_change(){
        this.basic_show = false;
      },
      basic_show_num_change(){
        this.basic_num_change = false;
      },
      view_get(){
        this.$store.dispatch('contrationLoadingAction', true);
        this.form = this.$route.query.tab;
        this.form.reportVersion = this.form.reportVersion * 1;
        this.form.isOnline = this.$route.query.tab.isOnline.toString();
        this.$store.dispatch('contrationLoadingAction', false);
        this.form.houseNumberId = this.$route.query.houseNumberId;
      },
      basic_change(){
        this.basic_btn = true;
      },

      onSubmit(){
        let msg = "";
        if(this.$route.query.type == "edit"){
          msg = '确认修改报告？';
        }else{
          msg = '确认创建报告？'
        }
        if (this.form.reportName == '') {
          message(this, '请输入报告名', 'warning');
          return;
        }
        if(this.form.houseNumberId == "" && this.form.houseNumberId !== 0){
            message(this, '请选择楼盘期数', 'warning');
            return;
        }
        if (this.form.reportVersion == '') {
          message(this, '请选报告择期数', 'warning');
          return;
        }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let body = _.cloneDeep(this.form), url;

          if (this.$route.query.type == 'edit') {
            url = '/buildingConstructionReport/updateInfo';
          } else if (!this.reportId) {
            url = '/buildingConstructionReport/insertInfo';
          } else {
            url = '/buildingConstructionReport/updateInfo';
            body.id = this.reportId;
          }

          this.$http(url, {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              this.basic_btn = false;
              this.basic_show = true;
              this.basic_num_change = true;
              message(this, '提交成功', 'success');
              this.$store.dispatch('reportIdAction', res.data.response.id);
              this.$store.dispatch('first_is_show_action', false);
            }
          })
        }).catch(() => {
        })
      },
      getHouseNumberList(){
        let _this = this;
        let body = {};
        // console.log(this.$route.query);
        // body.buildingId = this.$route.query.buildingId;
        this.$http('/buildingCamera/getAllHouseNumber',{body},{},{},'post').then(res => {
		if(res.data.code == 0){
            let response = res.data.response;
            _this.houseNumberList = response.list;
				  }else if(res.data.code == 300){
					_this.$router.push('/login')
				  }
				}).catch(err => {
				  console.log(err);
				})
      },
    }
  }
</script>
<style scoped>

</style>
