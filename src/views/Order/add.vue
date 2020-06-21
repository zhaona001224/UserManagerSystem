<template>
	<div class="add">
		<!--面包屑-->
		<el-card class="box-card">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/Order/List'}">Order</el-breadcrumb-item>
				<el-breadcrumb-item>{{$route.query.id?'Edit / ':'Add'}}<span v-if="$route.query.id" style="color: #544c64;font-weight: bold;">{{form.order_id}}</span></el-breadcrumb-item>
			</el-breadcrumb>
		</el-card>

		<el-card class="box-card">
			<div class="align-center" style="width: 100%;">
				<el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
					<el-row>
						<el-col :span="12">
							<el-form-item label="bad" prop="bad">
								<el-radio-group v-model="form.bad" disabled>
									<el-radio :label="true">true</el-radio>
									<el-radio :label="false">false</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="status" prop="status">
								<el-select :clearable="true"  @change="refreshData" style="width:300px;border: 1px solid greenyellow;" v-model="form.status" placeholder="Please select status">
									<el-option v-for="subItem in statusList" :key="subItem.name" :label="subItem.name" :value="subItem.name">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">

						</el-col>
						<el-col :span="12">

						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="total" prop="total">
								<el-input disabled style="width:300px" maxlength="" v-model="form.total">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="currency" prop="currency">
								<el-input disabled style="width:300px" maxlength="" v-model="form.currency">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="payment_id" prop="payment_id">
								<el-input disabled style="width:300px" maxlength="" v-model="form.payment_id">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="vendor" prop="vendor">
								<el-input disabled style="width:300px" maxlength="" v-model="form.vendor">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="method" prop="method">
								<el-input disabled style="width:300px" maxlength="" v-model="form.method">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="payment_note" prop="payment_note">
								<el-input disabled style="width:300px" maxlength="" v-model="form.payment_note">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="payer" prop="payer">
								<el-input disabled style="width:300px" maxlength="" v-model="form.payer">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="payer_link" prop="payer_link">
								<el-input disabled style="width:300px" maxlength="" v-model="form.payer_link">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="paid" prop="paid">
								<el-input disabled style="width:300px" maxlength="" v-model="form.paid">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="pay_time" prop="pay_time">
								<el-input disabled style="width:300px" maxlength="" v-model="form.pay_time ">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="delivery_time" prop="delivery_time">
								<el-input disabled style="width:300px" maxlength="" v-model="form.delivery_time">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="worker" prop="worker">
								<el-input disabled style="width:300px" maxlength="" v-model="form.worker">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="net" prop="net">
								<el-input disabled style="width:300px" maxlength="" v-model="form.net">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="request_time" prop="request_time">
								<el-input disabled style="width:300px" maxlength="" v-model="form.request_time">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="is_refund" prop="is_refund">
								<el-radio-group v-model="form.is_refund" disabled>
									<el-radio :label="true">true</el-radio>
									<el-radio :label="false">false</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="is_chargeback" prop="is_chargeback">
								<el-radio-group v-model="form.is_chargeback" disabled>
									<el-radio :label="true">true</el-radio>
									<el-radio :label="false">false</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="refund_time" prop="refund_time">
								<el-input disabled style="width:300px" maxlength="" v-model="form.refund_time">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="last_update" prop="last_update">
								<el-input disabled style="width:300px" maxlength="" v-model="form.last_update">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="delivery" prop="delivery">
								<el-input disabled style="width:300px" maxlength="" v-model="form.delivery">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="coupon" prop="coupon">
								<el-input disabled style="width:300px" maxlength="" v-model="form.coupon">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-form-item label="notify_info " prop="notify_info ">
							<pre style="height: 300px;overflow-y: auto;">{{form.notify_info&&JSON.parse(form.notify_info)}}</pre>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="order_detail " prop="order_detail ">
							<pre style="height: 300px;overflow-y: auto;">{{form.order_detail&&JSON.parse(form.order_detail)}}</pre>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="comments" prop="comments">
							<el-input type="textarea" disabled style="width:600px" maxlength="" v-model="form.comments">
							</el-input>
						</el-form-item>
					</el-row>
					<el-form-item label="note" prop="note">
						<el-tag :key="tag" v-for="(tag,subIndex) in form.note" closable :disable-transitions="false" @close="handleClose(subIndex)">
							{{tag}}
						</el-tag>

						<el-input class="input-new-tag" v-if="inputVisible==1" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm()" @blur="handleInputBlur()">
						</el-input>
						<el-button v-else class="button-new-tag" size="small" @click="showInput()">+Note</el-button>
					</el-form-item>
					</el-row>
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
				if(value) {
					if(value.split('.')[1] && value.split('.')[1].length > 3) {
						callback(new Error('最多只能输入3位小数'));
						return
					}
					callback();
				} else {
					callback(new Error(rule.field + '不能为空'));

				}
			};
			return {

				form: {

					online: false,
					type: 1,
				},
				statusList: [],
				list: {

				},
				inputValue: '',
				inputVisible: '',
				activeKey: '',
				rules: {

				},
			}
		},
		methods: {
			creatEdit() {
				var that = this;
				setTimeout(() => {
					this.editor = new E(this.$refs['editorElem']);
					// 编辑器的事件，每次改变会获取其html内容
					this.editor.customConfig.onchange = html => {
						that.form['desc'] = html;
						that.$forceUpdate();
					};
					this.editor.create(); // 创建富文本实例
					this.editor.txt.html(that.form['desc'])
				}, 1000)

			},
			refreshData(e) {
				console.log(e)
				this.$forceUpdate();
			},
			showInput(index) {
				this.inputVisible = 1;
				this.form.note.splice(index, 0);
				this.$forceUpdate();
				this.$nextTick(_ => {
					//					debugger
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			handleInputBlur(index) {
				this.inputVisible = 0;
				this.$forceUpdate();
			},
			handleClose(subIndex) {
				this.form.note.splice(subIndex, 1);
			},
			handleInputConfirm(index) {
				let inputValue = this.inputValue;
				var d = new Date(),
					str = '';
				str += d.getFullYear() + '-'; //获取当前年份 
				str += d.getMonth() + 1 + '-'; //获取当前月份（0——11） 
				str += d.getDate() + ' ';
				str += d.getHours() + ':';
				str += d.getMinutes() + ':';
				str += d.getSeconds() + '';
				var email = JSON.parse(this.store.state.configData).admin_email
				if(inputValue) {
					this.form.note.push(' [' + str + ']' + ' [' + email + ']:' + inputValue);
				}
				this.inputVisible = 0;
				this.inputValue = '';
				this.$forceUpdate();
			},
			getDataSource() {
				var that = this;
				that.$get('/admin/v1/contents?type=Orderstatus', {

				}).then(response => {
					if(response.retCode == 0) {
						this.statusList = response.data || [];

						this.$forceUpdate();
					} else {

						that.$message({
							type: 'warning',
							message: response.message
						});
					}

				})
			},
			dateFormat(date, format) {         
				date = new Date(date);         
				date.setHours(date.getHours() - 14);         
				var o = {             
					'M+': date.getMonth() + 1, //month
					             'd+': date.getDate(), //day
					             'H+': date.getHours(), //hour
					             'm+': date.getMinutes(), //minute
					             's+': date.getSeconds(), //second
					             'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
					             'S': date.getMilliseconds() //millisecond
					         
				};

				         
				if(/(y+)/.test(format))              format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));

				         
				for(var k in o)             
					if(new RegExp('(' + k + ')').test(format)) {                 
						format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));             
					}         
				return format;      
			},
			//新增方法
			submit() {
				var form = {};
				var that = this;
				if(this.form.note.length == 0) {
					this.originFrom.note = "";
				} else {
					this.originFrom.note = this.form.note.join(',')
				}
				this.originFrom.status = this.form.status;
				this.$refs.form.validate((valid) => {
					if(valid) {
						if(this.$route.query.id) {
							that.$post("/admin/v1/content/update?type=Order&id=" + this.$route.query.id, this.originFrom).then(response => {
								if(response.retCode == 0) {
									that.$util.successAlert("Modify Success！", '/Order/list', 'return list');
								} else {
									that.$message({
										type: 'warning',
										message: response.message
									});
								}

							})
						} else {
							that.$post("/admin/v1/content?type=Order", form).then(response => {
								if(response.retCode == 0) {
									that.$util.successAlert("Add Success！", '/Order/list', 'return list');
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
			this.getDataSource();
			if(this.$route.query.id) {
				this.$get("/admin/v1/content?type=Order&id=" + this.$route.query.id, {}).then(response => {

					if(response.retCode == 0) {
						this.form = response.data;
						this.originFrom = JSON.parse(JSON.stringify(this.form))
						this.form.note = this.form.note && this.form.note.split(',');
						this.form.pay_time = this.form.pay_time ? this.dateFormat(this.form.pay_time, 'yyyy-MM-dd HH:mm:ss') : '';
						this.form.request_time = this.form.request_time ? this.dateFormat(this.form.request_time, 'yyyy-MM-dd HH:mm:ss') : '';
						this.form.last_update = this.form.last_update ? this.dateFormat(this.form.last_update, 'yyyy-MM-dd HH:mm:ss') : ''
						this.form.refund_time = this.form.refund_time ? this.dateFormat(this.form.refund_time, 'yyyy-MM-dd HH:mm:ss') : ''
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
	
	.el-tag {
		position: relative;
		max-width: 600px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
		margin-bottom: 20px;
		padding-right: 20px;
	}
	.el-tag .el-tag__close{
		position: absolute;
		right: 10px;
		top: 4px!important;
	}
	/deep/ .w-e-menu,
	/deep/ .w-e-text-container {
		z-index: 1000!important;
	}
</style>