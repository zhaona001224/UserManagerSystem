<template>
  <div class="add">
    <!--面包屑-->
    <el-card class="box-card">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Permission/List' }">权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增权限</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <el-card class="box-card">
      <el-row>
        <el-col :span="6" class="place"></el-col>
        <el-col :span="12">
          <el-form ref="addData" :model="addData" :rules="addDataRule" label-width="100px" label-position="right">

            <el-form-item label="权限ID：" prop="aclKey">
              <el-input placeholder="请输入权限ID，必须由字母、数字、下划线组成"  v-model="addData.aclKey"></el-input>
            </el-form-item>

            <el-form-item label="权限名称：" prop="aclName">
              <el-input placeholder="请输入权限名称，不超过20个字符" maxlength="20" v-model="addData.aclName"></el-input>
            </el-form-item>

            <el-form-item label="权限配置：" prop="parentId">
              <el-input v-model="parentName" placeholder="请选择权限"></el-input>
              <el-tree
                :data="aclPowerList"
                node-key="id"
                ref="tree"
                highlight-current
                :props="defaultProps"
                @current-change = "checkTree">
              </el-tree>

            </el-form-item>

            <el-form-item label="备注：">
              <el-input placeholder="请输入备注，不超过40个字符" maxlength="40" v-model="addData.remark"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" class="place"></el-col>
      </el-row>
      <div class="return-btn">
        <el-button type="info" class="button-purple" @click.native="doSubmitData('addData')">确 定</el-button>
        <el-button type="info" class="button-gray" @click.native="$util.goBack">取 消</el-button>
      </div>

    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Add',
    created() {
      aclPowerList(this);
    },
    data(){
      return {
        //新增
        addData: {
          aclKey: "",
          aclName: "",
          parentId: "",
          remark: "",
        },
        parentName: "",
        addDataRule:{
          aclKey: [
            { required: true, message: '请输入权限ID，必须由字母、数字、下划线组成', trigger: 'blur' },
          ],
          aclName: [
            { required: true, message: '请输入权限名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
          ],
          parentId: [
            { required: true, message: '请选择权限', trigger: 'change' }
          ],
        },

        //权限列表
        aclPowerList: [],

        //tree
        defaultProps: {
          children: 'sons',
          label: 'acl_name'
        }

      }
    },
    methods:{
      //选择树节点
      checkTree(value) {
        this.addData.parentId = this.$refs.tree.getCurrentKey();
        this.parentName = value.acl_name;
      },


      //提交
      doSubmitData(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            aclRole(this);
            this.doResetData(formName);
          } else {
            this.$message.error("请正确填写表单！");
          }
        });
      },

      //返回权限管理
      doGoBack() {
        this.$router.push('/Permission/list');
      },

      //重置
      doResetData(formName) {
        this.$refs[formName].resetFields();
      },
    },

  }


  //初始化角色权限
  function aclPowerList(vue) {
    vue.$post("/acl/options").then(response => {
      vue.aclPowerList = response.data;
    })
  }


  //角色新增/修改
  function aclRole(vue) {
    var dataStr = {
      acl_key: vue.addData.aclKey, //权限Key
      acl_name: vue.addData.aclName, //权限名称
      pid:  vue.addData.parentId,      //父级权限Key
      app_id: 5,
      description: vue.addData.remark
    };

    vue.$post("/acl/edit",{
      AclRequest: dataStr,

    }).then(response => {
      if(response.code == 1) {
        vue.$util.successAlert("权限新增成功！");
      }else {
        vue.$message.error(response.msg);
      }

    })
  }

</script>


<style>
  @import "../../assets/css/add.css";
</style>

