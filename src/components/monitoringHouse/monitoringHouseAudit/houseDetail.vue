<template>
  <div class="aditAudit">
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
    <div class="adit-EDitInner">
      <el-form ref="form" :model="form">
        <div style="margin-top: 15px;margin-bottom: 10px">楼盘名称：保利拉菲公馆</div>
        <div style="margin-top: 15px;margin-bottom: 10px">照片ID：253053</div>
        <div style="margin-top: 15px;margin-bottom: 10px">照片：</div>
        <div style="margin-top: 15px;margin-bottom: 10px">当前状态：待审核</div>
        <div style="margin-top: 15px;margin-bottom: 10px">质量问题：发士大夫大师傅士大夫是</div>
        <div style="margin-top: 15px;margin-bottom: 10px">工程质量定义：户进度</div>
        <el-form-item label="照片分类：" :label-width="formLabelWidth">
          <el-radio v-model="radio" label="1">工程进度</el-radio>
          <el-radio v-model="radio" label="2">安全文明</el-radio>
          <el-radio v-model="radio" label="1">施工工艺流程</el-radio>
          <el-radio v-model="radio" label="2">工程施工质量</el-radio>
        </el-form-item>
        <el-form-item label="照片类型：" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期数：" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼幢号：" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单元号：" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼   层：" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号：" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能分区：" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择功能分区">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="构件：" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择构件">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="照片标签">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="普通照片"></el-checkbox>
            <el-checkbox label="需整改"></el-checkbox>
            <el-checkbox label="已整改"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="2"
            style="width: 300px;"
            autosize
            placeholder="请输入内容"
            v-model="textarea">
          </el-input>
        </el-form-item>
        <div>
          <span>拍照人：网民</span>
          <span>拍照时间：网民</span>
          <span>上传时间：网民</span>
        </div>
        <el-form-item label="操作">
          <el-radio v-model="radio" label="1">审核通过</el-radio>
          <el-radio v-model="radio" label="2">审核未通过</el-radio>
          <el-select v-model="form.region" placeholder="选择未通过原因">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <p>注：*字段为编辑操作时必填字段</p>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>
<script>
  import Subnav2 from '../../Subnav2/Subnav2'
  export default {
    data(){
      return {
        navList: [
          {path: '/unopened/estateunopenedexamine', name: '首页'},
          {path: '/unopened/estateunopenedexamine', name: '历史楼盘'},
          {path: this.$route.fullPath, name: this.$route.query.name}
        ],
        formLabelWidth: 300,
        form: {}
      }
    },
    components: {
      Subnav2,
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
  .adit-EDitInner {
    padding-left: 50px;
  }
</style>
