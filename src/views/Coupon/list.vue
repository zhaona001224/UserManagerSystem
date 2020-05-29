<template>
	<div class="list">
		<el-card class="box-card">
			<el-button type="primary" class="common-btn" @click.native="gotoPage('Add')">新增权限</el-button>
			<el-button type="primary" class="common-btn" @click.native="modifyPermission">修 改</el-button>
			<el-button type="danger" class="common-btn" @click.native="deletePermission">删 除</el-button>
			<el-button type="primary" class="common-btn" @click.native="showPermission">查看权限</el-button>
      <el-input
        class="search-input"
        @change="queryTable"
        prefix-icon="el-icon-search"
        v-model="keyword"
        :placeholder="'请输入'+texts[this.type]"
        maxlength="10"></el-input>
		</el-card>

		<!--<el-card class="box-card">
			<el-select v-model="type" placeholder="请选择" class="search-input">
		    	prefix-icon="el-icon-search"
		    	v-model="keyword"
		    	:placeholder="'请输入'+texts[this.type]"
		    	maxlength="10"></el-input>
<<<<<<< HEAD
		</el-card>
=======
		</el-card>-->
		<el-card class="box-card">
			<el-table
		      :data="tableData"
		      width="100%">
			  <el-table-column
			   	header-align="left"
			   	align="center"
			    label="选择"
			    width="80px">
			    <template slot-scope="scope">
		            <el-radio :label="scope.row.id" v-model="selectid">&nbsp;</el-radio>
		        </template>
			  </el-table-column>
		      <el-table-column
			   	header-align="left"
		        prop="acl_key"
		        label="权限ID"
		        min-width="100px">
		      </el-table-column>
		      <el-table-column
			   	header-align="left"
		        prop="acl_name"
		        label="权限名称"
		        min-width="100px">
		      </el-table-column>
		      <el-table-column
			   	header-align="left"
		        prop="description"
		        label="备注"
		        min-width="100px">
		      </el-table-column>
		    </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
		</el-card>
	</div>
</template>

<script>
export default {
	name: 'List',
	data(){
		return {
			type:"name",
			keyword:"",
			tableData:[],
			selectid:null,
      pageNum: 1,
			pageSize: 10,
			total:0,
			texts:{
				name:"权限名称"
			},
			types:[{
				text:"按权限名称",
				value:"name"
			}]
		}
	},
	methods:{
		gotoPage(path,params){
			this.$router.push({path:path,query:params});
		},
		checkSeleted(){
			if(!this.selectid){
        this.$message({
          message: '请先选择权限!',
          type: 'warning'
        });
				return false;
			}
			return true;
		},
		modifyPermission(){
			if(!this.checkSeleted()){
				return;
			}
      const selectItem= this.tableData.filter(item =>item.id==this.selectid);
			this.gotoPage('Modify',{id:selectItem[0].acl_key})
		},
		deletePermission(){
      if (!this.checkSeleted()) {
        return;
      }
      const selectItem= this.tableData.filter(item =>item.id==this.selectid);
      this.$post("/acl/del", {
        acl_key: selectItem[0].acl_key,
        token: this.store.state.token,
      }).then(response => {
        if (response.code == 1) {
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
		showPermission(){
			if(!this.checkSeleted()){
				return;
			}
      const selectItem= this.tableData.filter(item =>item.id==this.selectid);
      this.gotoPage('Detail',{acl_key:selectItem[0].acl_key})
		},
		queryTable(){
			this.$post("/acl/index",{
				keywords:this.keyword,
				page:this.pageNum,
				per_page:this.pageSize
			}).then(response => {
				this.tableData = response.data.data;
				this.total = parseInt(response.data.pagination.total);
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
    	resetDatas(){
    		this.type = "name";
			this.keyword = "";
			this.tableData = [];
			this.queryTable();
    	},
	},
	created(){
		this.resetDatas();
	},
	actived(){
		this.resetDatas();
	}
}
</script>

<style>
  @import "../../assets/css/list.css";
</style>
