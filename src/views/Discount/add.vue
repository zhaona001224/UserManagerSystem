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
					<el-form-item label="name" prop="name">
						<el-input style="width:400px" placeholder="Please fill in name" maxlength="" v-model="form.name">
						</el-input>
					</el-form-item>
					<el-form-item label="discount List" width="700px">
						<el-table :data="form.discountList" width="700px" :rules="rules">
							<el-table-column cell-style="text-align:center" header-align="center" label="level" width="120px">
								<template slot-scope="scope">
									<el-form-item :inline-message="true" :prop="'discountList.'+scope.$index+'.level'" :rules="tableRules.level">
										<el-input width="120px" v-model="scope.row.level"></el-input>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column cell-style="text-align:center" header-align="center" label="qty" width="120px">
								<template slot-scope="scope">
									<el-form-item :inline-message="true" :rules="tableRules.qty" :prop="'discountList.'+scope.$index+'.qty'">
										<el-input width="120px" v-model.number="scope.row.qty"></el-input>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column cell-style="text-align:center" header-align="center" label="discount" width="220px">
								<template slot-scope="scope">
									<el-form-item :inline-message="true" :rules="tableRules.discount" :prop="'discountList.'+scope.$index+'.discount'">
										<el-input width="220px" v-model="scope.row.discount"></el-input>
									</el-form-item>

								</template>
							</el-table-column>
							<el-table-column label="operation" width="120px" cell-class-name="center" header-align="center">
								<template slot-scope="scope">
									<el-button type="text" size="small" @click="handleDelete(scope.$index)">Delete</el-button>
									<el-button type="text" size="small" @click="handleAdd(scope.$index)">Add</el-button>
								</template>
							</el-table-column>
						</el-table>

					</el-form-item>
					<el-form-item label="online" prop="online">
						<el-radio-group  v-model="form.online" >
							<el-radio label="true">{{true}}</el-radio>
							<el-radio label="false">{{false}}</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="rangeTime" prop="rangeTime">
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
			var validatePass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('qty不能为空'));
				} else {

					var index = rule.field.split('.')[1] * 1;

					if(this.form.discountList[index - 1] && this.form.discountList[index - 1].qty > value) {
						callback(new Error('qty不能小于前一条数据的qty'));
						return
					}
					if(this.form.discountList[index + 1] && (this.form.discountList[index + 1].qty < value)) {

						callback(new Error('qty不能大于后一条数据的qty'));
						return
					}
					callback();
				}
			};
			return {

				form: {
					discountList: [{
						level: '',
						qty: '',
						discount: ''
					}],
					online:'false',
				},

				list: {

				},
				tableRules: {
					level: [{
						required: true,
						message: 'level不能为空',
						trigger: 'blur'
					}],
					qty: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					discount: [{
						required: true,
						message: 'discount不能为空',
						trigger: 'blur'
					}],
				},
				activeKey: '',
				rules: {
					name: [{
						message: "请填写name",
						required: true,
						trigger: 'blur'
					}],
					rangeTime: [{
						message: "请填写rangeTime",
						required: true,
						trigger: 'blur'
					}]

				},
			}
		},
		methods: {
			handleAdd(index) {
				this.$refs.form.validate((valid) => {
					if(valid) {
						this.form.discountList.splice(index + 1, 0, {
							level: '',
							qty: '',
							discount: ''
						})
						this.$forceUpdate();
					} else {

						return false;
					}
				});

			},
			handleDelete(index) {
				this.form.discountList.splice(index, 1)
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