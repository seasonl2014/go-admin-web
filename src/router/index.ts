// 1、导入Vue Router模块
import { createRouter,createWebHashHistory } from 'vue-router'
import Nprogress from "../config/nprogress";
import {useUserStore} from "../store/modules/user";
import {useMenuStore} from "../store/modules/menu";
import {useMemberStore} from "../store/modules/member";
// 定义一些路由，每一个都需要映射到一个组件

// 定义静态路由
export const staticRouter = [
    {
        path: '/',
        redirect: '/homeindex',
        isMenu: false
    },
    {
        path: '/login',
        name: 'Login',
        meta: { title: '后台管理系统-后台登录' },
        component: ()=> import('@/views/system/login/Login.vue'),
        isMenu: false
    },
    {
        path: '/homeindex',
        name: 'homeindex',
        component: ()=> import('@/views/system/layout/Index.vue'),
        redirect: '/home',
        isMenu: true,
        funcNode: 1,
        children: [
            {
                path: '/home',
                name: 'home',
                meta: { title: '首页',icon: 'House',affix: true},
                component: ()=> import('@/views/system/home/Index.vue')
            }
        ]

    },
    {
        path: '/user',
        name: 'userSetting',
        redirect: '/user/setting',
        component: ()=>import('@/views/system/layout/Index.vue'),
        isMenu: true,
        funcNode: 1,
        children: [
            {
                path: 'setting',
                name: 'PersonalSettings',
                meta: { title: '个人设置',icon: 'Basketball' },
                component: ()=> import('@/views/system/user/components/PersonalSettings.vue')
            }
        ]
    }

]

// 定义动态路由
export const asyncRoutes = [
    {
        path: '/system',
        name: 'system',
        meta: {
            title: '系统管理',
            icon: 'GoldMedal'
        },
        redirect: '/system/user',
        component: ()=> import('@/views/system/layout/Index.vue'),
        isMenu: true,
        funcNode: 2,
        children: [
            {
                path: 'user',
                name: 'user',
                meta: {
                    title: '用户管理',
                    icon: 'UserFilled'
                },
                component: ()=> import('@/views/system/user/UserList.vue')
            },
            {
                path: 'role',
                name: 'Role',
                meta: {
                    title: '角色管理',
                    icon: 'Stamp'

                },
                component: () => import('@/views/system/role/RoleList.vue')
            },
            {
                path: 'log',
                name: 'Log',
                meta: {
                    title: '日志管理',
                    icon: 'Histogram'
                },
                component: () => import('@/views/system/log/LogList.vue')
            }
        ]
    }
]


// 3、创建路由实例并传递‘routes’配置
const router = createRouter({
    history: createWebHashHistory(),
    routes: staticRouter
})

// 设置白名单
const whiteList = ['/login']
// 路由拦截守卫
router.beforeEach(async (to,from,next)=> {
    // 1.Nprogress 开始
    Nprogress.start()

    // 2.设置标题
    if(typeof(to.meta.title) === 'string'){
        document.title = to.meta.title ||'后台管理系统'
    }

    // 3.如果是白名单的路径，直接放行
    const some = whiteList.some(function (item) {
        return to.path.indexOf(item)!==-1
    })
    //4. 白名单直接放行
    if (some) {
        next()
    }else{
        // 5.判断是否有token，没有重定向login
        const userStore = useUserStore()
        if(userStore.token!=''){
            // 生成动态路由
            const menuStore = useMenuStore()
            const accessRoutes = menuStore.generateRouter()
            accessRoutes.forEach(item => router.addRoute(item))
            next()
        }else {
            return next({path: `/login?redirect=${to.path}`,replace:true})
        }
    }

})

// 路由跳转结束
router.afterEach(()=> {
    Nprogress.done()
})

// 路由跳转失败
router.onError(error=> {
    Nprogress.done()
    console.warn("路由错误",error.message)
})

export default router
