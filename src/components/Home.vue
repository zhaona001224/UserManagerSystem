<template>

	<div class="home-container">

		<el-container>

			<!--头部-->
			<el-header>
				<el-row type="flex" class="row-bg header" justify="space-between">
					<el-col class="header-left">
						<div class="header-left-cont">
							<img src="../assets/image/home/logo.png" height="60">
							<div class="header-left-cont-text">
								<h2>管理平台</h2>
								<p></p>
							</div>
						</div>
					</el-col>

					<el-col class="header-right">
						<div class="header-right-cont">
							<el-dropdown trigger="hover">
								<span class="el-dropdown-link userinfo-inner">
              <span>{{ userInfo.admin_email }}</span>
								<i class="el-icon-caret-bottom"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item @click.native="doLoginOut">
										<i class="el-icon-circle-close-outline"></i> 退出登录
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</el-col>
				</el-row>
			</el-header>

			<el-container>
				<!--侧边栏-->
				<el-aside>
					<el-menu :router=true :default-active="onRoutes" class="el-menu-vertical-demo">
						<el-submenu index="1">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>Product</span>
							</template>
							<el-menu-item-group>
								<el-menu-item v-for="part in menuTrees" :index="'/template/List/'+part.name" :key="part.name">{{part.name}}</el-menu-item>

							</el-menu-item-group>

						</el-submenu>
						<el-menu-item index="/Order/list">
							<i class="el-icon-menu"></i>
							<span slot="title">Order</span>
						</el-menu-item>
						<el-menu-item index="/Coupon/list" key="Coupon">
							<i class="el-icon-menu"></i>
							<span slot="title">Coupon</span>
						</el-menu-item>
						<el-menu-item  index="/Discount/list" key="Discount">
							<i class="el-icon-menu"></i>
							<span slot="title">Discount</span>
						</el-menu-item>
						<el-submenu index="4">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span slot="title">Systems</span>
							</template>
							<el-menu-item-group>
								<el-menu-item index='/photo/list' key="Photo">Photo</el-menu-item>
								<el-menu-item index='/config' key="Config">Config</el-menu-item>
								<el-menu-item index='/user/list' key="User">User</el-menu-item>
							</el-menu-item-group>

						</el-submenu>

					</el-menu>

				</el-aside>

				<!--路由内容-->
				<el-main>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</el-main>

			</el-container>

		</el-container>

	</div>

</template>

<script>
	import * as types from '../store/types'

	export default {
		name: "app",
		data() {
			return {
				onRoutes: '',
				//菜单
				menuTrees: [

				],

				//用户信息(初始化获取到)
				userName: localStorage.getItem("userName"),
			}
		},

		methods: {

			//退出登录
			doLoginOut() {
				var that = this;
				this.$confirm('确认退出登录?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.$post("/admin/v1/logout", {

					}).then(response => {
						if(response.retCode == 0) {
							this.$store.commit(types.LOGOUT);
							this.$router.replace({
								path: '/',
								query: {
									redirect: this.$router.currentRoute.path
								}
							});

						} else {

							that.$message({
								type: 'warning',
								message: response.message
							});
						}

					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						});
					});
				})
			},

		},

		created() {
			this.menuTrees = JSON.parse(this.store.state.loginData);
			this.userInfo = JSON.parse(this.store.state.configData)
			this.onRoutes = this.$route.fullPath
		}
	}
</script>