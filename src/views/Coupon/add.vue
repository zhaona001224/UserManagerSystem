<template>
	<div class="add">
		<!--面包屑-->
		<el-card class="box-card">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/template/Coupon/List'}">Coupon</el-breadcrumb-item>
				<el-breadcrumb-item>{{$route.query.id?'Edit':'Add'}}</el-breadcrumb-item>
			</el-breadcrumb>
		</el-card>

		<el-card class="box-card">
			<div class="align-center" style="width: 100%;">
				<el-form ref="form" :model="form" :rules="rules" label-width="20%" label-position="right">
					<el-form-item label="name" prop="name" >
						<el-input style="width:400px" placeholder="Please fill in name" maxlength="" v-model="form.name">
						</el-input>
					</el-form-item>
					<el-form-item label="level" prop="level" >
						<el-input style="width:400px" placeholder="Please fill in level" maxlength="" v-model="form.level">
						</el-input>
					</el-form-item>
					<el-form-item label="qty" prop="qty" >
						<el-input style="width:400px" placeholder="Please fill in qty" maxlength="" v-model="form.qty">
						</el-input>
					</el-form-item>
					<el-form-item label="discount" prop="discount" >
						<el-input style="width:400px" placeholder="Please fill in discount" maxlength="" v-model="form.discount">
						</el-input>
					</el-form-item>
					<el-form-item label="rangeTime" prop="rangeTime" >
						<el-date-picker value-format="yyyy-MM-dd" v-model="form.rangeTime" type="daterange" range-separator="To" start-placeholder="startTime" end-placeholder="endTime">
						</el-date-picker>
					</el-form-item>
					<div class="cls"></div>
					<div class="cls"></div>
					<div class="return-btn">
						<el-button @click.native="submit" type="info" class="button-purple">confirm</el-button>
						<el-button @click.native="$util.goBack" type="info" class="button-gray">cancel</el-button>
					</div>

				</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { ptn } from '@/utils/common/validate'
	import E from "wangeditor";
	export default {
		name: 'Add',
		data() {
			return {
				form: {

				},
				activeKey: '',
				rules: {
					//										name: [{
					//											message: "请填写name",
					//											required: true,
					//											trigger: 'blur'
					//										}],

				},
			}
		},
		methods: {

			refreshData() {
				this.$forceUpdate();
			},

			//新增方法
			submit() {
				var form = {};
				form = JSON.parse(JSON.stringify(this.form)); //this.templateData是父组件传递的对象  
				var that = this;
				this.$refs.form.validate((valid) => {
					if(valid) {

						if(this.$route.query.id) {
							that.$post("/admin/v1/content/update?type=" + Coupon + "&id=" + this.$route.query.id, form).then(response => {
								if(response.retCode == 0) {
									that.$util.successAlert("Modify Success！", '/template/list/' + Coupon, 'return list');
								} else {
									that.$message({
										type: 'warning',
										message: response.message
									});
								}

							})
						} else {
							that.$post("/admin/v1/content?type=" + Coupon, form).then(response => {
								if(response.retCode == 0) {
									that.$util.successAlert("Add Success！", '/template/list/' + Coupon, 'return list');
								} else {
									that.$message({
										type: 'warning',
										message: response.message
									});
								}

							})
						}

					} else {
						that.$message.error("Please fill in the form correctly！");
					}
				})
			},
		},

		created() {
			if(this.$route.query.id) {
				this.$get("/admin/v1/content?type=Coupon&id=" + this.$route.query.id, {}).then(response => {
					if(response.retCode == 0) {
						this.form = response.data;
						this.$forceUpdate();

					} else {
						this.$message({
							message: response.msg,
							type: 'warning'
						})
					}
				})
			} 

		}

	}
</script>

<style scoped="">
	@import "../../assets/css/add.css";
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 128px;
		height: 128px;
		line-height: 128px;
		text-align: center;
		background-color: #fbfdff;
		border: 1px dashed #c0ccda;
		border-radius: 6px;
	}
	
	.avatar {
		width: 128px;
		height: 128px;
		display: block;
	}
	
	/deep/ .w-e-menu,
	/deep/ .w-e-text-container {
		z-index: 1000!important;
	}
</style>