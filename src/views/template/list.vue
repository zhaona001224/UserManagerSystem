<template>
	<div class="list">
		<el-card class="box-card">
			<el-button type="primary" class="common-btn" @click.native="$router.push('/template/Add/'+$route.params.key)">Add</el-button>
			<el-input class="search-input" prefix-icon="el-icon-search" v-model="keyword" placeholder="请输入搜索内容" maxlength="10">
			</el-input>
			<el-button type="primary" class="common-btn" @click="search">Search</el-button>
		</el-card>
		<el-card class="box-card">
			<el-table :data="tableData" width="100%">
				<!--<el-table-column header-align="left" label="选择" width="80px">
					<template slot-scope="scope">
						<el-radio :label="scope.row.yun_id" v-model="selectid">&nbsp;</el-radio>
					</template>
				</el-table-column>-->
				<el-table-column header-align="left" prop="id" label="id" width="90px">
				</el-table-column>

				<el-table-column :sortable="item.name=='name'" v-for="(item,index) in formData" :key="item.id" v-if="item.data.type!='textarea'&&item.data.type!='file'" header-align="left" :prop="item.name" :label="item.name" width="140px">
				</el-table-column>

				<el-table-column v-for="(item,index) in formData" :key="item.id" v-if="item.data.type=='file'" cell-style="text-align:center" header-align="center" :prop="item.name" :label="item.name" width="110px">
					<template slot-scope="scope">
						<img v-if="scope.row[item.name]" style="width: 80px;height: 80px;" :src="imgUrl+scope.row[item.name]" />
					</template>
				</el-table-column>

				<el-table-column prop="updated" sortable label="updateTime" width="160px" cell-class-name="center" header-align="center">
				</el-table-column>
				<el-table-column label="operation" width="240px" cell-class-name="center" header-align="center">
					<template slot-scope="scope">
						<!--<el-button type="text" size="small" v-if="scope.row.online" @click="handleStatus(scope.row)">{{scope.row.online?'outLine':'online'}}</el-button>-->
						<el-button type="text" size="small" @click="handleEdit(scope.row)">Edit</el-button>
						<el-button type="text" size="small" @click="handleDelete(scope.row)">Delete</el-button>
						<el-button type="text" class="clip" size="small" :data-clipboard-text="getFromData(scope.row)" @click="copy">copy</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination v-if="notSearch" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNum" :page-sizes="[5, 10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>

		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'List',
		data() {
			return {
				type: "name",
				keyword: "",
				tableData: [],
				selectid: null,
				pageNum: 1,
				pageSize: 10,
				total: 0,
				formData: [],
				notSearch: true

			}
		},
		methods: {
			checkSeleted() {
				if(!this.selectid) {
					this.$message({
						message: '请先选择用户!',
						type: 'warning'
					});
					return false;
				}
				return true;
			},
			getFromData(item) {
				var string = "";
				for(var key in item) {
					string = string + item[key] + " " + " " + " " + " " + " " + " " + " "
				}
				return string

			},
			handleEdit(item) {
				this.$router.push('/template/Add/' + this.$route.params.key + '?id=' + item.id)
			},

			copy() {
				var clipboard1 = new this.clipboard('.clip')
				clipboard1.on('success', e => {
					console.log('复制成功')
					// 释放内存
					clipboard1.destroy()
				})
				clipboard1.on('error', e => {
					// 不支持复制
					console.log('该浏览器不支持自动复制')
					// 释放内存
					clipboard.destroy()
				})
			},
			//删除
			handleStatus(item) {
				var url = ''
				if(item.online == "true") {
					url = '/admin/v1/content/reject'
				} else {
					url = '/admin/v1/content/approve'
				}
				this.$post(url + "?type=" + this.$route.params.key + "&id=" + item.id, {}).then(response => {
					if(response.retCode == 0) {
						this.$message({
							message: '操作成功!',
							type: 'success'
						})
						this.queryTable();
					} else {
						this.$message({
							message: response.msg,
							type: 'warning'
						})
					}
				})

			},
			//删除
			handleDelete(item) {
				this.$delete("/admin/v1/content?type=" + this.$route.params.key + "&id=" + item.id, {}).then(response => {
					if(response.retCode == 0) {
						this.$message({
							message: '删除成功!',
							type: 'success'
						})
						this.queryTable();
					} else {
						this.$message({
							message: response.msg,
							type: 'warning'
						})
					}
				})

			},

			queryTable() {
				this.$get('/admin/v1/contents?type=' + this.$route.params.key + "&offset=" + this.pageNum + "&count=" + this.pageSize, {

				}).then(response => {

					if(response.retCode == 0) {
						this.notSearch = true;
						this.tableData = response.data || [];
						this.tableData.sort((a, b) => {
							//排序基于的数据
							return b.updated - a.updated;
						})
						this.tableData && this.tableData.map((item) => {
							for(var key in this.dataSource.formData.data) {

								if(this.dataSource.formData.data[key].type == "select" || this.dataSource.formData.data[key].type == "tree") {
									item[key] = item[key] && item[key].split(',')[1]
								}
								if(this.dataSource.formData.data[key].type == "bool") {
									item[key] = item[key] + ''
								}

							}

							item.updated = this.$util.formatTime(item.updated, 'YYYY-MM-DD HH:mm:ss');

						})
						
						this.total = response.meta.total ? parseInt(response.meta.total) : 0;
					} else {

						this.$message({
							type: 'warning',
							message: response.message
						});
					}

				})

			},
			search() {
				if(!this.keyword) {
					this.pageNum = 1;
					this.queryTable();
					return
				}
				this.notSearch = false;
				this.$get('/admin/v1/contents/search?type=' + this.$route.params.key + "&q=" + this.keyword + "&status=public", {

				}).then(response => {

					if(response.retCode == 0) {
						this.tableData = response.data || [];
						this.tableData.sort((a, b) => {
							//排序基于的数据
							return b.updated - a.updated;
						})
						this.tableData && this.tableData.map((item) => {
							for(var key in this.dataSource.formData.data) {

								if(this.dataSource.formData.data[key].type == "select" || this.dataSource.formData.data[key].type == "tree") {

									item[key] = item[key] && item[key].split(',')[1]
								}
								if(this.dataSource.formData.data[key].type == "bool") {
									item[key] = item[key] + ''
								}

							}
							item.updated = this.$util.formatTime(item.updated, 'YYYY-MM-DD HH:mm:ss')
						})
						this.total = response.meta.total ? parseInt(response.meta.total) : 0;
					} else {

						this.$message({
							type: 'warning',
							message: response.message
						});
					}

				})

			},
			//选择页数
			handleCurrentChange() {
				this.queryTable();
			},

			//选择每页条数
			handleSizeChange(val) {
				this.pageSize = val;
				this.queryTable();
			},

		},
		created() {
			this.imgUrl = this.store.state.imgUrl
			var menuTrees = JSON.parse(this.store.state.loginData);
			menuTrees.map((item, index) => {
				if(item.name == this.$route.params.key) {
					this.dataSource = item
				}
			})
			for(var key in this.dataSource.formData.data) {
				this.formData[this.dataSource.formData.data[key].order - 1] = {
					name: key,
					data: this.dataSource.formData.data[key]
				}

			}
			this.queryTable();

		},
		mounted() {

		},
		actived() {

			this.resetDatas();
		}
	}
</script>

<style>
	@import "../../assets/css/list.css";
	.center {
		text-align: center;
	}
</style>