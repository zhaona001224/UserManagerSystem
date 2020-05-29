<template>
	<div class="list">
		<el-card class="box-card">
			<el-button type="primary" class="common-btn" @click.native="$router.push('/template/Add/'+$route.params.key)">Add</el-button>
			<el-input class="search-input" @change="queryTable" prefix-icon="el-icon-search" v-model="keyword" placeholder="请输入搜索内容" maxlength="10">
			</el-input>
		</el-card>

	<el-table
		      :data="tableData"
		      width="100%">
			
		      <el-table-column
            header-align="left"
		        prop="role_key"
		        label="id">
		      </el-table-column>
		      <el-table-column
            header-align="left"
		        prop="role_name"
		        label="name">
		      </el-table-column>
		      <el-table-column
            header-align="left"
		        prop="description"
		        label="备注">
		      </el-table-column>
		    </el-table>

				<el-table-column label="operation" width="240px" cell-class-name="center" header-align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="handleStatus(scope.row)">Status</el-button>
						<el-button type="text" size="small" @click="handleEdit(scope.row)">Edit</el-button>
						<el-button type="text" size="small" @click="handleDelete(scope.row)">Delete</el-button>
						<el-button type="text" class="clip" size="small" :data-clipboard-text="getFromData(scope.row)" @click="copy">copy</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNum" :page-sizes="[5, 10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
				formData: []

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
					string=string+item[key]+" "+" "+" "+" "+" "+" "+" "
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
						this.tableData = response.data||[];
						this.tableData && this.tableData.map((item) => {
							item.online = item.online + ''
							item.hot = item.hot + ''
							item.updated = this.$util.formatTime(item.updated, 'YYYY-MM-DD HH:mm:ss')
						})
						this.total = response.meta.total?parseInt(response.meta.total):0;
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

			resetDatas() {
				this.type = "name";
				this.name = "";
				this.card = "";
				this.id = "";
				this.tableData = [];
				this.queryTable();
			},
			formatOrg(row, column, cellValue, index) {
				return row.org.map(item => {
					return item.org_name;
				}).join("/");
			}
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