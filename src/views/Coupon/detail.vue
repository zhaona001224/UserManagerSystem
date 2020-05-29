<template>
  <div class="add">
<<<<<<< HEAD
    <el-card class="box-card">
      <div class="title-text">
        用户管理&nbsp;&nbsp;&gt;&nbsp;&nbsp;查看权限
      </div>
    </el-card>
    <el-card class="box-card">
      <div class="align-center" style="width: 100%;">
        <el-form ref="form" :model="form" :rules="rules" label-width="35%" label-position="right">
          <el-form-item label="权限ID：" prop="id">
            <el-input
              placeholder="必填，字母与数字组合，不超过10位字符"
              maxlength="10"
              v-model="form.id">
            </el-input>
          </el-form-item>
          <el-form-item label="权限名称：" prop="name">
            <el-input
              placeholder="必填，不超过20位字符"
              maxlength="20"
              v-model="form.name">
            </el-input>
          </el-form-item>
          <el-form-item label="权限配置：" prop="permission">
            <div>
              <el-select v-model="permission" placeholder="请选择" style="margin-right: 20px;">
                <el-option
                  v-for="item in permissions"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
              </el-tree>
            </div>
            <div>
              <el-tree
                v-model="form.permission"
                :data="treeData[form.type]"
                :props="defaultProps"
                show-checkbox>
              </el-tree>
            </div>
          </el-form-item>
          <el-form-item label="备注：" prop="note">
            <el-input
              placeholder="非必填，不超过40字符"
              maxlength="40"
              v-model="form.note">
            </el-input>
          </el-form-item>
          <div class="cls"></div>
          <div class="cls"></div>
        </el-form>
      </div>
    </el-card>
=======
    <!--面包屑-->
    <el-card class="box-card">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Permission/List' }">权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看权限</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <el-card class="box-card">
      <el-row>
        <el-col :span="6" class="place"></el-col>
        <el-col :span="12">
          <el-form ref="addData" :model="baseData" label-width="100px" label-position="right">
            <el-form-item label="权限ID："> {{baseData.acl_key}} </el-form-item>
            <el-form-item label="权限名称："> {{baseData.acl_name}} </el-form-item>
            <el-form-item label="权限配置："> {{baseData.pname}} </el-form-item>
            <el-form-item label="备注："> {{baseData.description}} </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" class="place"></el-col>
      </el-row>
      <div class="return-btn">
        <el-button  type="info" @click.native="$util.goBack">返 回</el-button>
      </div>
    </el-card>

>>>>>>> 4af9458982cd345395f4b15555d928a06d613157
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
        //详情
        aclKey: {
          aclKey: "",
          aclName: "",
          parentId: "",
          remark: "",
        },
        baseData:{

        },
        //权限列表
        aclPowerList: [],
        selectedKey: this.$route.query.id,
        //tree
        defaultProps: {
          children: 'sons',
          label: 'acl_name'
        }

      }
    },
    methods:{
      //获取用户信息
      getUserInfo(){
        let that = this;
        this.$post("/acl/info",{
          acl_key: that.selectedKey,
        }).then(response => {
          that.baseData = response.data;

        })
      }
    },
    created(){
      this.getUserInfo();
    }

  }

<style>
  @import "../../assets/css/add.css";
</style>

