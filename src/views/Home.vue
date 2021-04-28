<template>
        
    <el-container class='home-container'>
            <!-- 头部区域 -->
        <el-header>
        <div class="headerDiv">
            <img src="../assets/imgs/home/heima.png" alt="">
        <span>管理系统</span> 
        </div>
        <el-button type="info" @click="exit">退出</el-button>
        
        </el-header>
            
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="cola? '64px': '200px'">
                <div class="show" @click="togglecolapse">|||</div>
             <!-- 侧边栏菜单 -->
                <el-menu background-color="#333744"  active-text-color="#409EFF" text-color='#fff' unique-opened  :collapse="cola" :collapse-transition="false" >
                  <!-- 一级菜单 -->
                  <el-submenu :index="item.id + ''"  v-for="item in menulist" :key="item.id">
                    <!-- 模板 -->
                    <template #title>
                    <!-- 图标 -->
                    <i :class="iconObj[item.id]"></i>
                    <!-- 文本 -->
                    <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <el-menu-item :index="subItem.id + ''" v-for ="subItem in item.children" :key="subItem.id"  @click = "getRouter(subItem)">
                         <!-- 模板 -->
                        <template #title>
                        <!-- 图标 -->
                        <i class="el-icon-menu"></i>
                        <!-- 文本 -->
                        <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                 </el-submenu>
               
                </el-menu>

            </el-aside>
            <!-- 主体 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import {Request} from '../networks/request.js'
export default {
    data () {
        return {
            menulist:[],
            cola:false,
            iconObj:{
                '125':'el-icon-user-solid',
                '103':'el-icon-s-operation',
                '101':'el-icon-s-goods',
                '102':'el-icon-notebook-2',
                '145':'el-icon-s-data',

            },
        activate_path : '/users'
            
        }
    },
    created () {
        this.getMenuList()  
        this.activate()      
    },
    methods: {
        exit(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        togglecolapse(){
            this.cola = !this.cola
        },
        getMenuList(){
            Request({
                url:'/menus',
                method:'get'
            }).then(data=>{
                if (data.data.meta.status!=200){
                    
                    ElMessage.error('登陆失败')
                    return }
                this.menulist = data.data.data
            }).catch(err=>{
                console.log(err)
            })
        },
        getRouter(path){
            this.$router.push(path.path)
            this.activate_path = path.path
        },
        activate(){
            this.activate_path = window.sessionStorage.getItem('activate')
        }
    }
}
</script>

<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-header{
    display: flex;
    justify-content: space-between;

    background-color: #373d41;
    padding-left: 0%;
    color: white;
    align-items: center;
    font-size: 15px;
}
.el-header div{
    display: flex;
    align-items: center;
    span{
        margin-left:15px ;
    }
}
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right: none;
    }
}
.el-main{
    background-color: #eaedf1;
}
.show{
    color: white;
    background-color:#4A5064;
    font-size: 20px;
    text-align: center;
    letter-spacing:0.2em;
    line-height: 24px;
    cursor: pointer;
}
</style>