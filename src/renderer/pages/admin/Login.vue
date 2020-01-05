<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="60px" v-on:keypress.enter="onSubmit">
            <el-card class="login-card">
                <h2 class="title">登录</h2>
                <el-form-item prop="username" label="账号">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input v-model="form.password" show-password @keyup.enter="onSubmit()"></el-input>
                </el-form-item>
                <div style="text-align: center">
                    <el-button type="primary" @click="onSubmit">登陆系统</el-button>
                </div>
            </el-card>
        </el-form>

        <div class="footer">
            <!--            Power by <a href="http://www.guotao.pro">GtGuiZhou</a>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                rules: {
                    username: [{required: true,message: '必须填写用户名'}],
                    password: [{required: true,message: '必须填写密码'}],
                },
                form: {
                    username: '',
                    password: ''
                }
            }
        },
        methods: {
            onSubmit(){
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http.post('/admin/admins/login',this.form).then(
                            res => {
                                this.$store.commit('setUser',res)
                                this.$router.replace('/admin')
                            }
                        )
                    } else {
                        return false;
                    }
                });

            }
        }
    }
</script>

<style scoped>
    .login-card {
        width: 500px;
        margin: 200px auto;
    }

    .footer{
        text-align: center;
        width: 100%;
        color: gray;
    }

    .title{
        color: gray;
        margin: 20px;
        text-align: center;
    }

    .footer a{
        text-decoration: none;
        color: black;
    }
</style>


