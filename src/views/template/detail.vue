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
						<el-button type="info" @click.native="$util.goBack">返 回</el-button>
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
		name: 'Detail',
		data() {
			return {
				id: null,
				organStr: "",
				form: {
					role: [""]
				},
				roles: [],
				editor: null,
				editorContent: ''
			}
		},
		// catchData是一个类似回调函数，来自父组件，当然也可以自己写一个函数，主要是用来获取富文本编辑器中的html内容用来传递给服务端
		props: ['catchData'], // 接收父组件的方法
		methods: {
			//获取用户信息
			getUserInfo() {
				let that = this;
				this.$post("/user/info", {
					user_id: this.$route.query.id
				}).then(response => {
					that.form = response.data;
					that.organStr = that.form.org[0].org_name;
					for(let i = 1; i < that.form.org.length; i++) {
						that.organStr = that.form.org[i].org_name + "/" + that.organStr;
					}
					that.form.roleName = that.form.role.map(item => {
						return item.role_name;
					}).join(";");
				})
			}
		},
		mounted() {
			let that = this;
			this.id = this.$route.query.id;
		},
		created() {
			this.editor = new E(this.$refs.editorElem);
			// 编辑器的事件，每次改变会获取其html内容
			this.editor.customConfig.onchange = html => {
				this.editorContent = html;
				this.catchData(this.editorContent); // 把这个html通过catchData的方法传入父组件
			};
			this.editor.customConfig.menus = [
				// 菜单配置
				'head', // 标题
				'bold', // 粗体
				'fontSize', // 字号
				'fontName', // 字体
				'italic', // 斜体
				'underline', // 下划线
				'strikeThrough', // 删除线
				'foreColor', // 文字颜色
				'backColor', // 背景颜色
				'link', // 插入链接
				'list', // 列表
				'justify', // 对齐方式
				'quote', // 引用
				'emoticon', // 表情
				'image', // 插入图片
				'table', // 表格
				'code', // 插入代码
				'undo', // 撤销
				'redo' // 重复
			];
			this.editor.create(); // 创建富文本实例
		},

		watch: {
			id() {
				this.getUserInfo();
			}
		}
	}
</script>

<style>
	@import "../../assets/css/detail.css";
</style>