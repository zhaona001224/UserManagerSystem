<template>
	<div class="detail">
    <!--面包屑-->
    <el-card class="box-card">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/User/List' }">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

		<el-card class="box-card">
			<div class="align-center" style="width: 100%;">
			<el-form ref="form" :model="form" label-width="35%" label-position="right">
			 <el-form-item label="用户ID：">
			    {{form.id}}
			  </el-form-item>
			  <el-form-item label="用户名：">
			    {{form.username}}
			  </el-form-item>
			  <el-form-item label="姓名：">
        {{form.full_name}}
      </el-form-item>
			  <el-form-item label="组织选择：">
			    {{organStr}}
			  </el-form-item>
			  <el-form-item label="角色：">
			    {{form.roleName}}
			  </el-form-item>
			  <el-form-item label="状态：">
	          	{{form.state=="1"?"正常":(form.state=="2"?"挂起":"删除")}}
			  </el-form-item>
			  <el-form-item label="备注：">
			    {{form.remark}}
			  </el-form-item>
				<div class="cls"></div>
				<div class="cls"></div>
				<div class="return-btn">
	  			<el-button  type="info" @click.native="$util.goBack">返 回</el-button>
				</div>
			</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>

import { ptn } from '@/utils/common/validate'

export default {
	name: 'Detail',
	data(){
		return {
			id:null,
			organStr:"",
			form:{
				role:[""]
			},
			roles:[],
		}
	},
	methods:{
		//获取用户信息
		getUserInfo(){
			let that = this;
			this.$post("/user/info",{
				user_id:this.$route.query.id
			}).then(response => {
				that.form = response.data;
				that.organStr = that.form.org[0].org_name;
				for(let i=1;i<that.form.org.length;i++){
					that.organStr = that.form.org[i].org_name + "/" + that.organStr;
				}
				that.form.roleName = that.form.role.map(item => {
					return item.role_name;
				}).join(";");
			})
		}
	},
	mounted(){
		let that = this;
		this.id = this.$route.query.id;
	},
	activated(){
		this.form = {
			role:[""]
		};
		this.$refs.form.clearValidate();
		this.id = this.$route.query.id;
	},
	watch:{
		id(){
			this.getUserInfo();
		}
	}
}
</script>



<style>
  @import "../../assets/css/detail.css";
</style>
