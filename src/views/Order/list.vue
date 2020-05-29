<template>
	<div class="list">

    <!--功能按钮-->
		<el-card class="box-card">
			<el-button type="primary" class="common-btn" @click.native="doAddRole">新增角色</el-button>
			<el-button type="primary" class="common-btn" @click.native="doUpdateRole">修 改</el-button>
			<el-button type="danger" class="common-btn" @click.native="doDeleteRole">删 除</el-button>
			<el-button type="primary" class="common-btn" @click.native="doDetailRole">查看角色</el-button>
      <el-input
        class="search-input "
        @change="doSelectDataList"
        prefix-icon="el-icon-search"
        v-model="keyword"
        placeholder="请输入角色名称"
        maxlength="10">
      </el-input>
		</el-card>

    <!--搜索-->
		<el-card class="box-card">


		</el-card>

    <!--列表-->
		<el-card class="box-card">
			<el-table
		      :data="tableData"
		      width="100%">
			  <el-table-column
          header-align="left"
			    label="选择"
			    width="80px">
			    <template slot-scope="scope">
		            <el-radio :label="scope.row.role_key" v-model="selectedKey">&nbsp;</el-radio>
		        </template>
			  </el-table-column>
		      <el-table-column
            header-align="left"
		        prop="role_key"
		        label="角色ID">
		      </el-table-column>
		      <el-table-column
            header-align="left"
		        prop="role_name"
		        label="角色名称">
		      </el-table-column>
		      <el-table-column
            header-align="left"
		        prop="description"
		        label="备注">
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
  created(){
    dataList(this);
  },
	data(){
		return {
			type: "name",
			keyword: "",
			tableData: [],
      selectedKey: "",

      //分页
      pageSize: 10,
      pageNum: 1,
      total: 0
		}
	},
	methods:{

    //搜索列表数据
    doSelectDataList(){
      dataList(this);
    },

    //新增角色
    doAddRole(){
			this.$router.push({
        path:'Add',
			});
		},

    //修改角色
    doUpdateRole() {
      if(!this.doCheckSeleted()){
        return;
      }else {
        this.$router.push({
          path:'Modify',
          query: {role_key: this.selectedKey}
        });
      }
    },

    //删除角色
    doDeleteRole(){
      if(!this.doCheckSeleted()){
        return;
      }else {
        deleteRole(this);
        dataList(this);
      }
    },

    //查看用户(详情)
    doDetailRole() {
      if(!this.doCheckSeleted()){
        return;
      }else {
        this.$router.push({
          path:'Detail',
          query: {role_key: this.selectedKey}
        });
      }
    },

    //是否选中用户
    doCheckSeleted(){
      if(!this.selectedKey){
        this.$message({
          message: '请先选择角色!',
          type: 'warning'
        });
        return false;
      }
      return true;
    },

    //选择页数
    handleCurrentChange() {
      dataList(this);
    },

    //选择每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      dataList(this);
    },

	},
}

    //初始化角色列表
    function dataList(vue) {
      vue.$post("/role/index",{
        keywords: vue.keyword,
        page: vue.pageNum,
        per_page: vue.pageSize
      }).then(response => {
        vue.tableData = response.data.data.reverse();
        vue.total = parseInt(response.data.pagination.total);
      })
    }


    //删除角色
    function deleteRole(vue) {
      vue.$post("/role/del",{
        role_key: vue.selectedKey,
      }).then(response => {
        if(response.code == 1) {
          vue.$message({
            message: '删除成功!',
            type: 'success'
          })
        }else {
          vue.$message({
            message: response.msg,
            type: 'warning'
          })
        }
      })
    }

</script>


<style>
  @import "../../assets/css/list.css";
</style>
