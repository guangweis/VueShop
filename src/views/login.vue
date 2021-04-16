<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avater_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登陆表单区域 -->
            <el-form  :model='loginform' ref="loginRef" :rules='loginFormRelus' label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop='username'>
                    <el-input v-model="loginform.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                    <!-- 密码 -->
                <el-form-item  prop='password'>
                    <el-input type='password' v-model="loginform.password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>

                <el-form-item class='btns'>
                    <el-button type="primary" @click='login'>登陆</el-button>
                    <el-button type="info" @click='resetForm'>重置</el-button>
                </el-form-item>

               

             </el-form>
        </div>
    </div>
</template>

<script>
import {loginRequest} from '../networks/login_axios.js'
import { ElMessage } from 'element-plus'

export default {
    data () {
        return {
            loginform:{
                username:'admin',
                password:'123456',
            },
            loginFormRelus:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        resetForm(){
            // this.loginform.username = ''
            // this.loginform.password = ''
            this.$refs.loginRef.resetFields()
        },
        login(){
            this.$refs.loginRef.validate(valid=>{
                if (!valid){
                    console.log('验证失败')
                    return 
                }
                
               
                loginRequest({
                    url:'/login',
                    method: 'post',
                    data:this.loginform
                    
                }).then((data)=>{
                    if (data.data.meta.status!=200){
                         ElMessage.error('登陆失败')
                        return
                    }
                    ElMessage.success({
                                message: '登陆成功',
                                type: 'success'
                            })
                    window.sessionStorage.setItem('token',data.data.data.token)
                    this.$router.push('/home')
                }).catch(err=>{
                    console.log(err)
                })
                }

            )
        }
    }
    
}
</script>

<style lang="less" scoped>
.login_container{
    background-color:#2b4b6b;
    height: 100%;}
.login_box{
    width: 450px;
    height: 300px;
    border-radius: 3px;
    background-color: #fff;
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    top :0;
    bottom: 0;
}
.avater_box{
    height: 130px;
    width:130px;
    border:1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position:absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
}
.avater_box img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
}

.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}
</style>