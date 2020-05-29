<template>
	<div class="detail">
    <!--面包屑-->
		<el-card class="box-card">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Role/List' }">角色管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色详情</el-breadcrumb-item>
      </el-breadcrumb>
		</el-card>

    <!--正文-->
		<el-card class="box-card">

			<el-row>
        <el-col :span="6" class="place"></el-col>
        <el-col :span="12">
          <el-form ref="detailData" :model="detailData" label-width="100px" label-position="right">
            <el-form-item label="角色ID："> {{detailData.role_key}} </el-form-item>
            <el-form-item label="角色名称："> {{detailData.role_name}} </el-form-item>
            <el-form-item label="角色权限：">
              <el-tag type="success" class="tag" v-for="item in detailData.acl" :key="item.acl_name">{{ item.acl_name }}</el-tag>
            </el-form-item>
            <el-form-item label="备注："> {{detailData.description}} </el-form-item>
            <el-form-item label="编辑时间："> {{ detailData.updated_time }} </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" class="place"></el-col>
      </el-row>
        <div class="return-btn">
          <el-button  type="info" @click.native="$util.goBack">返 回</el-button>
        </div>
		  </el-card>

	</div>
</template>

<script>
export default {
	name: 'Detail',
  created() {
    detailRole(this);
  },

	data(){
		return {
      selectedKey: this.$route.query.role_key,
      detailData: {}
		}
	},
	methods:{}
}

  //角色详情
  function detailRole(vue) {
    vue.$post("/role/info",{
      role_key: vue.selectedKey,
    }).then(response => {
      if(response.code == 1) {
        vue.detailData = response.data;
      }
    })
  }
</script>



<style>
  @import "../../assets/css/detail.css";
</style>
