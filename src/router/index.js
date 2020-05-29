import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/store'
import * as types from '../store/types'
import Login from '../components/Login'
import Home from '../components/Home'
import UserList from '../views/User/list'
import CouponList from '../views/Coupon/list'
import OrderList from '../views/Order/list'
import UserAdd from '../views/User/add'
import UserModify from '../views/User/modify'
import UserDetail from '../views/User/detail'
import CouponAdd from '../views/Coupon/add'
import CouponDetail from '../views/Coupon/detail'
import CouponModify from '../views/Coupon/modify'
import OrderAdd from '../views/Order/add'
import OrderModify from '../views/Order/modify'
import OrderDetail from '../views/Order/detail'
import TemplateList from '../views/template/list'
import TemplateAdd from '../views/template/add'
import PhotoList from '../views/photoList'
import Config from '../views/config'
Vue.use(VueRouter);

const routes = [{
		path: '/login',
		name: 'login',
		component: resolve => require(['@/components/Login'], resolve)
	},
	{
		path: '/template',
		name: 'Template',
		component: Home,
		children: [{
				path: 'List/:key',
				name: '列表',
				component: TemplateList
			},
			{
				path: 'Add/:key',
				name: '新增',
				component: TemplateAdd
			}
		],
		meta: {
			requireAuth: true //添加该字段，true表示进入这个路由是需要登录的,false不需要登录
		},
	}, {
		path: '/User',
		name: 'User',
		component: Home,
		children: [{
				path: 'List',
				name: '用户列表',
				component: UserList
			},
			{
				path: 'Add',
				name: '新增用户',
				component: UserAdd
			},
			{
				path: 'Modify',
				name: '修改用户',
				component: UserModify
			},
			{
				path: 'Detail',
				name: '查看用户',
				component: UserDetail
			},
		],
		meta: {
			requireAuth: true //添加该字段，true表示进入这个路由是需要登录的,false不需要登录
		},
	},

	{
		path: '/Photo',
		name: 'Photo',
		component: Home,
		children: [{
				path: 'List',
				name: 'Photo',
				component: PhotoList
			}
		],
		meta: {
			requireAuth: true //添加该字段，true表示进入这个路由是需要登录的,false不需要登录
		},
	},
	{
		path: '/Config',
		name: 'Config',
		component: Home,
		children: [{
				path: '/',
				name: 'Config',
				component: Config
			}
		],
		meta: {
			requireAuth: true //添加该字段，true表示进入这个路由是需要登录的,false不需要登录
		},
	},

	{
		path: '/Order',
		name: 'Order',
		component: Home,
		children: [{
				path: 'List',
				name: '权限列表',
				component: OrderList
			},
			{
				path: 'Add',
				name: '权限新增',
				component: OrderAdd
			},
			{
				path: 'Modify',
				name: '修改权限',
				component: OrderModify
			},
			{
				path: 'Detail',
				name: '查看权限',
				component: OrderDetail
			},
		],
		meta: {
			requireAuth: true //添加该字段，true表示进入这个路由是需要登录的,false不需要登录
		},
	},
];

if(window.localStorage.getItem('userName')) {
	store.commit(types.LOGINDATA, window.localStorage.getItem('loginData'));
}
if(window.localStorage.getItem('configData')) {
	store.commit(types.CONFIGDATA, window.localStorage.getItem('configData'));
}
if(window.localStorage.getItem('loginData')) {
	store.commit(types.LOGINDATA, window.localStorage.getItem('loginData'));
}


const router = new VueRouter({
	routes
});

//未登录状态返回登录页进行登录
router.beforeEach((to, from, next) => {
	/*if (to.matched.some(r => r.meta.requireAuth)) {
	  if (store.state.token) {
	    next();
	  } else {
	    next({name: 'login'})
	  }
	} else {
	  next();
	}*/
	next();
});

export default router;