<template>
    <div >
        <router-view></router-view>
        <el-dialog
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false"
                :modal-append-to-body='false'
                title="您必须输入激活码才能使用该工具"
                :visible.sync="loggingActive"
                width="700px"
        >
            <div style="display: flex;justify-content: space-between;padding: 100px">
                <img src="../assets/person.png" />
                <div style="text-align: center">
                    <div style="position: relative;left: -40px">
                        <h2>疯狂听抄</h2>
                        <h3>Crazy Transcription</h3>
                    </div>
                    <div style="display: flex">
                        <el-input style="width: 300px" v-model="active_code" placeholder="请输入您的激活码"></el-input>
                        &nbsp;&nbsp;&nbsp;
                        <el-button type="primary" @click="active">激 活</el-button>
                    </div>
                    <br>
                    <div style="position: relative;left: -40px">
                        <a href="###" style="color: #409EFF" @click="setClipContent">粘贴无效？点我试试</a>
                    </div>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">

            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {machineId, machineIdSync} from 'node-machine-id';
    const { clipboard } = require('electron')
    import Vue from 'vue'
    import ElementUI from 'element-ui';
    import 'element-ui/lib/theme-chalk/index.css';

    Vue.use(ElementUI);
    export default {
        name: "DesktopApp",
        data() {
            return {
                loggingActive: true,
                active_code: '',
                mac_code: machineIdSync()
            }
        },
        created(){
            window.addEventListener('keydown',  e => {
                window.console.log(e)
                if (e.key === 'F3'){
                    this.$router.push('/admin')
                }
            })
            // 重写401错误处理方法
            this.$http.err401 = () => {
                this.loggingActive = true
            }

            // 重写错误消息处理方法
            this.$http.errMsg = msg => {
                this.$notify.error(msg)
            }
        },
        async mounted(){
            const loading = this.$loading({
                lock: true,
                text: '系统校验中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            try {
                await this.$http.post('/user/login/' + this.mac_code)
                this.loggingActive = false
            }finally {
                loading.close()
            }
        },
        methods: {
            setClipContent(){
                this.active_code = clipboard.readText()
            },
            active() {
                if (this.active_code.length < 1) {
                    return
                }

                if (this.active_code === '登入后台系统') {
                    this.$router.push('/admin')
                    return;
                }

                this.$http.post('/user/active', {active_code: this.active_code, machine_code: this.mac_code}).then(
                    () => {
                            this.$notify.success('激活成功')
                            this.loggingActive = false
                    }
                )
            },
        }
    }
</script>

<style scoped>

</style>
