<template>
	<div class="modify">
    <!--面包屑-->
    <el-card class="box-card">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/User/List' }">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>修改用户</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

		<el-card class="box-card">
			<div class="align-center" style="width: 100%;">
			<el-form ref="form" :model="form" :rules="rules" label-width="35%" label-position="right">
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
			  <el-form-item label="组织结构：" prop="org_id">
			    <el-tree
			    	ref="tree"
			    	style="width:500px"
			    	:data="treeData"
			    	:props="defaultProps"
			    	:highlight-current="true"
			    	node-key="yun_id"
			    	@node-click="handleNodeClick">
			    </el-tree>
			  </el-form-item>
			  <el-form-item label="选择角色：" prop="role_keys">
			    <el-select multiple v-model="form.role_keys" placeholder="请选择角色">
				    <el-option
				      v-for="item in roles"
				      :key="item.role_key"
				      :label="item.role_name"
				      :value="item.role_key">
				    </el-option>
				</el-select>
			  </el-form-item>
			  <el-form-item label="密码：" prop="yun_password">
			    <el-input
			    	type="password"
			    	placeholder="8-18位，需包含字母、数字"
			    	maxlength="18"
			    	v-model="form.yun_password">
			    </el-input>
			  </el-form-item>
			  <el-form-item label="确认密码：" prop="confirmPass">
			    <el-input
			    	type="password"
			    	placeholder="8-18位，需包含字母、数字"
			    	maxlength="18"
			    	v-model="form.confirmPass">
			    </el-input>
			  </el-form-item>
			  <el-form-item label="备注：" prop="remark">
			    <el-input
			    	placeholder="非必填，不超过40字符"
			    	maxlength="40"
			    	v-model="form.remark">
			    </el-input>
			  </el-form-item>
				<div class="cls"></div>
				<div class="cls"></div>
				<div class="return-btn">
					<el-button @click.native="submit" type="info" class="button-purple">确 定</el-button>
	  			<el-button @click.native="$util.goBack" type="info" class="button-gray">取 消</el-button>
				</div>
			</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>

import { ptn } from '@/utils/common/validate'
import "@/assets/css/detail.css"

export default {
	name: 'Modify',
	data(){
		let that = this;
		//校验方法
		function validateConfirmPass(rule, data, callback){
			if(data!=that.form.yun_password){
				callback(new Error('两次输入密码不一致！'));
			}else{
				callback();
			}
		}
		return {
			id:null,
			organStr:"",
			treeData:[],
			form:{
				role_keys:[]
			},
			roles:[],
			defaultProps:{
	          children: 'sons',
	          label: 'org_name'
	       	},
			rules:{
				username:[{message:"必填，字母与数字组合，不超过10位字符",required: true, trigger: 'blur' },
					{message:"必填，字母与数字组合，不超过10位字符",pattern: ptn.en_num(1, 10), trigger: 'blur' }],
				full_name:[{message:"必填，员工姓名，不超过10位字符",required: true, trigger: 'blur' },
					{message:"必填，员工姓名，不超过10位字符",pattern: ptn.en_num(1, 10), trigger: 'blur' }],
				org_id:[{message:"请选择组织结构",required: true, trigger: 'change' }],
				role_keys:[{message:"请选择一个角色",required: true, trigger: 'change' }],
				yun_password:[{message:"8-18位，需包含字母、数字",required: true, trigger: 'blur' },
					{message:"8-18位，需包含字母、数字",validator: ptn.validatePassword, trigger: 'blur' }],
				confirmPass:[{message:"8-18位，需包含字母、数字",required: true, trigger: 'blur' },
					{validator: validateConfirmPass, trigger: 'blur' }],
				remark:[{message:"非必填，不超过40字符",min:0,max:40, trigger: 'blur' }]
			},
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
				that.form.org_id = that.form.org[0].id;
				that.$refs.tree.setCurrentKey(that.form.org_id);
				that.$refs.tree.store.nodesMap[that.form.org[0].id].expanded = true;
				that.organStr = that.form.org[0].org_name;
				for(let i=1;i<that.form.org.length;i++){
					that.$refs.tree.store.nodesMap[that.form.org[i].id].expanded = true;
					that.organStr = that.form.org[i].org_name + "/" + that.organStr;
				}
		        that.form.role_keys = that.form.role.map(item => {
		        	return item.role_key;
		        });
			})
		},
		//获取所有角色
		getRoles(){
			this.$post("/role/index",{
				per_page:10000
			}).then(response => {
				this.roles = response.data.data;
			})
		},
		//点击组织结构树，选择事件
		handleNodeClick(obj,nodeval,nodes){
			this.form.org_id=obj.yun_id;
			this.getOrgStr(nodeval);
		},
		//获取组织结构选中项的显示文字
		getOrgStr(nodeval){
			this.organStr = nodeval.data.org_name;
			let tmp = nodeval;
			this.form.org = [tmp.data];
			while(tmp.parent&&tmp.parent.label){
				tmp = tmp.parent;
				this.organStr = tmp.data.org_name+"/"+this.organStr;
				this.form.org.push(tmp.data);
			}
		},
		//修改事件
		submit(){
			var that = this;
    		this.$refs.form.validate((valid) => {
		        if (valid) {
		         	that.$post("/user/edit",{UserRequest:that.form}).then(response => {
		         		if(response.code==0){
		         			that.$message.error(response.msg);
		         			return;
		         		}
		         		that.$util.successAlert("用户信息修改成功！");
		         	})
		        } else {
		            that.$message.error("请正确填写项目！");
		        }
	        })
		}
	},
	mounted(){
		let that = this;
		//获取组织结构树
		this.$post("/org/index").then(response => {
			that.treeData = response.data
		})
		this.getRoles();
		this.id = this.$route.query.id;
	},
	activated(){
		this.form = {
			role_keys:[]
		};
		this.$refs.form.clearValidate();
		this.getRoles();
		this.id = this.$route.query.id;
	},
	watch:{
		id(val){
			if(!val){
				return;
			}
			this.getUserInfo();
		}
	}
}
</script>


<style>
  @import "../../assets/css/add.css";
</style>
