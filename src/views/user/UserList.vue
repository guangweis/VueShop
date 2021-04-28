<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >用户管理</el-breadcrumb-item>
            <el-breadcrumb-item >用户列表</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- 卡片视图 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="14">
                    <el-input placeholder="请输入内容"  class="input-with-select" v-model="qureyinof.query">
                        <template #append>
                            <el-button icon="el-icon-search" @click="query" clearable @clear='this.getUserList()'></el-button>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="3">

                    <el-button type="primary" @click="adduserdialog=true">添加用户</el-button>
                </el-col>
            </el-row>
        
        <!-- 用户列表区 -->
            <el-table :data="userList" style="width: 100%" border stripe>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column prop="username" label="姓名" width="180">
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="180">
                </el-table-column>
                <el-table-column prop="mobile" label="电话" width="180">
                </el-table-column>
                <el-table-column prop="role_name" label="角色" >
                </el-table-column>
                <el-table-column prop="mg_state" label="状态" >
                    <template v-slot="state">
                        <el-switch v-model="state.row.mg_state" @change='userStateChange(state.row)' > </el-switch>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="180">
                    <template v-slot="state">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="moduserDialog(state.row)" ></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click='deleteUser(state.row)'></el-button>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable='false'>
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    <!-- 对话框 -->
         <!-- 添加用户对话框 -->
                <el-dialog
                                    title="添加用户"
                                    v-model="adduserdialog"
                                    width="30%"
                                    @close="addDialogClose"
                                >
                                    <el-form :model="adduser" :rules="adduserRules" ref="adduserRef" label-width="70px" >
                                        <el-form-item label="用户名" prop="username">
                                            <el-input v-model="adduser.username"></el-input>
                                        </el-form-item>
                                        <el-form-item label="密码" prop="password">
                                            <el-input v-model="adduser.password"></el-input>
                                        </el-form-item>
                                        <el-form-item label="手机" prop="mobile">
                                            <el-input v-model="adduser.mobile"></el-input>
                                        </el-form-item>
                                        <el-form-item label="邮箱" prop="email">
                                            <el-input v-model="adduser.email"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <template #footer>
                                        <span class="dialog-footer">
                                        <el-button @click="adduserdialog = false">取 消</el-button>
                                        <el-button type="primary" @click="adduserdialogConfirm">确 定</el-button>
                                        </span>
                                    </template>
                </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
                        title="修改用户"
                        v-model="modDialog"
                        width="30%"
                        @close="modDialogClose"
                    >
                        <el-form :model="modUserData" :rules="moduserRules" ref="moduserRef" label-width="70px" >
                            <el-form-item label="用户名" >
                                <el-input v-model="modUserData.username" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="modUserData.email" ></el-input>
                            </el-form-item>
                            <el-form-item label="手机号" prop='mobile'>
                                <el-input v-model="modUserData.mobile" ></el-input>
                            </el-form-item>

                        </el-form>
                        <template #footer>
                            <span class="dialog-footer">
                            <el-button @click="modDialog = false">取 消</el-button>
                            <el-button type="primary" @click="modUserInfo">确 定</el-button>
                            </span>
                        </template>
    </el-dialog>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="qureyinof.pagenum"
      :page-sizes="[1, 2, 5]"
      :page-size="qureyinof.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
            </div>
</template>
<script>
import {Request} from '../../networks/request.js'
import { ElMessage } from 'element-plus'

export default {
    created () {
        this.getUserList()
    },
    methods: {
        // 请求数据
        getUserList(){
            Request({
                url:'/users',
                method:'get',
                params:this.qureyinof
            }).then(data=>{
                if (data.status!=200){
                    ElMessage.error('用户列表获取失败')
                    return
                }
                this.userList = data.data.data.users
                this.total = data.data.data.total
            }).catch(err=>{
                console.log(err)
            })
        },
        // 监听一次显示页码数
        handleSizeChange(size){
            this.qureyinof.pagesize = size
            this.getUserList()
        },
        // 监听页码改变
        handleCurrentChange(currentpage){
            this.qureyinof.pagenum = currentpage
            this.getUserList()

        },
        // 监听switch状态改变
        userStateChange(userchange){
            Request({
                method:'put',
                url:`users/${userchange.id}/state/${userchange.mg_state}`
            }).then(data=>{
                if (data.data.meta.status!==200){
                    ElMessage.error('修改失败')
                    userchange.mg_state = !userchange.mg_state
                    return 
                }
                ElMessage.success('更新状态成功')
            }).catch(err=>{
                console.log(err)

            })
        },
        // 搜索
        query(){
            this.getUserList()
        },
        // 添加对话框
        addDialogClose(){
            this.$refs.adduserRef.resetFields()
        },
        // 修改对话框
        modDialogClose(){
            this.$refs.moduserRef.resetFields()
        },
        
        // 添加用户对话框确认
        adduserdialogConfirm(){
            
            this.$refs.adduserRef.validate(valid=> {
                if (valid){
                    Request({
                        url:'/users',
                        method:'post',
                        data:this.adduser
                    }).then(data =>{
                        if (data.data.meta.status!==201){
                                ElMessage.error('登陆失败')
                                return
                                
                            }
                        ElMessage.success({
                                message: '添加成功',
                                type: 'success'

                        })
                        this.adduserdialog=false
                        this.getUserList()
                    }).catch(err=>{
                        console.log(err)
                    })
                }
            })
            this.adduserdialog=false
        },
        //修改时查询id
        moduserDialog(data){
            this.modDialog=true
            Request({
                url:'/users/'+data.id,

            }).then(data=>{
                if (data.data.meta.status!==200){
                    ElMessage.error('用户列表获取失败')
                    return
                }
                this.modUserData = data.data.data
                
            })
        },
        //修改表单预验证
        modUserInfo(data){
            this.modDialog=false
            this.$refs.moduserRef.validate(valid=>{
                if (valid){
                    Request({
                        url:'/users/'+this.modUserData.id,
                        method:'put',
                        data:{
                            id:this.modUserData.id,
                            email:this.modUserData.email,
                            mobile:this.modUserData.mobile
                        }
                    }).then(data=>{
                        if (data.data.meta.status!=200){
                            ElMessage.error('修改失败')
                            return 
                        }
                        ElMessage.success('修改成功')
                        this.getUserList()

                    })
                }
            })
        },
        //删除提示框
        deleteUser(data){
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                Request({
                    url:'users/'+data.id,
                    method:'delete',
                    params:{
                        id:data.id
                    }
                }).then(data=>{
                    if(data.data.meta.status!=200){
                        ElMessage.error(data.data.meta.msg)
                        return
                    }
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getUserList()
                })
                
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
                });
        }
        
    },

    data () {
        // email验证
        var checkEmail = (relu,value,cb)=>{
            const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (regEmail.test(value)){
                return cb()
            }
            cb(new Error('请输入正确的邮箱'))
        }
        // 手机号验证
        var chickphone = (relu,value,cb)=>{
            const regPhone = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
            if (regPhone.test(value)){
                cb()
            }
            cb(new Error('请输入正确的手机号'))
        }
        return {
            input:'',
            qureyinof:{
                query:'',
                pagenum:1,
                pagesize:2
            },
            userList:[],
            total :0,
            adduserdialog:false,
            //控制修改用户对话框
            modDialog:false,
            //添加用户数据
            adduser:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            //添加用户表单规则
            adduserRules:{
                username:[
                    { required: true, message: '输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                mobile:[
                    { required: true, message: '输入手机号', trigger: 'blur' },
                    {validator:chickphone,trigger:'blur'}
                ],
                email:[
                    { required: true, message: '输入邮箱', trigger: 'blur' },
                    {validator:checkEmail,trigger:'blur'}
                ],
            },
            //修改用户数据
            modUserData:{

            },
            //修改用户表单规则
            moduserRules:{
                mobile:[
                    { required: true, message: '输入手机号', trigger: 'blur' },
                    {validator:chickphone,trigger:'blur'}
                ],
                email:[
                    { required: true, message: '输入邮箱', trigger: 'blur' },
                    {validator:checkEmail,trigger:'blur'}
                ],
            }
            
        }
    }
    
}
</script>
<style scoped>
.el-table{
    margin-top: 20px;
}
.el-pagination{
    margin-top:20px;
}
</style>