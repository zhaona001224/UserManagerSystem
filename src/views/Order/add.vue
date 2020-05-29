<template>
	<div class="add">
    <!--面包屑-->
		<el-card class="box-card">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Role/List' }">角色管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增角色</el-breadcrumb-item>
      </el-breadcrumb>
		</el-card>

		<el-card class="box-card">
      <el-row>
        <el-col :span="6" class="place"></el-col>
        <el-col :span="12">
          <el-form ref="addData" :model="addData" :rules="addDataRule" label-width="100px" label-position="right">

            <el-form-item label="角色ID：" prop="roleKey">
              <el-input placeholder="请输入角色ID，必须由字母、数字、下划线组成，不超过10个字符" maxlength="10" v-model="addData.roleKey"></el-input>
            </el-form-item>

            <el-form-item label="角色名称：" prop="roleName">
              <el-input placeholder="请输入角色名称，不超过20个字符" maxlength="20" v-model="addData.roleName"></el-input>
            </el-form-item>

            <el-form-item label="选择权限：" prop="aclKeys">
              <el-tree
                :data="rolePowerList"
                @check="doSelectTree"
                show-checkbox
                node-key="acl_key"
                ref="tree"
                highlight-current
                :props="defaultProps">
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
    rolePowerList(this);
  },
	data(){
		return {
      //新增
      addData: {
        roleKey: "",
        roleName: "",
        aclKeys: [],
        remark: "",
      },
      addDataRule:{
        roleKey: [
          { required: true, message: '请输入角色ID，必须由字母、数字、下划线组成', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在10个字符以内', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
        ],
        aclKeys: [
          { type: 'array', required: true, message: '请至少选择一个角色权限', trigger: 'blur' },
        ],
      },

      //权限列表
      rolePowerList: [],

      //tree
      defaultProps: {
        children: 'sons',
        label: 'acl_name'
      }

		}
	},
	methods:{
    //选择树
    doSelectTree() {
      this.addData.aclKeys = [];
      //选中的树节点
      var nodeName = this.$refs.tree.getCheckedNodes();
      for(var i in nodeName) {
        this.addData.aclKeys.push(nodeName[i].acl_key);
      }
    },

    //提交
    doSubmitData(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {

          addRole(this);
          this.doResetData(formName);

        } else {
          this.$message.error("请正确填写表单！");
        }
      });
		},

    //重置
    doResetData(formName) {
      this.$refs[formName].resetFields();
    },
	},

}


  //初始化角色权限
  function rolePowerList(vue) {
    vue.$post("/acl/options").then(response => {
      vue.rolePowerList = response.data;
    })
  }


  //角色新增/修改
  function addRole(vue) {
    var dataStr = {
      role_key: vue.addData.roleKey,   //角色Key
      role_name: vue.addData.roleName,   //角色名称
      acl_keys: vue.addData.aclKeys,   //权限Key的数组，每个元素对应权限的Key
      description: vue.addData.remark  //备注
    };

    vue.$post("/role/edit",{
      RoleRequest: dataStr,

    }).then(response => {
      if(response.code == 1) {
        vue.$util.successAlert("角色新增成功！");
      }else {
        vue.$message.error(response.msg);
      }

    })
  }

</script>


<style>
  @import "../../assets/css/add.css";
</style>

