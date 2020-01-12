<template>
    <full-parent v-loading="loading" style="overflow-x: hidden;background-color: white">
        <div class="tool between">
            <div>
                <el-link type="success" style="margin-right: 15px;line-height: 28px" v-if="!isPause" @click="pause">暂停
                </el-link>
                <el-link type="success" style="margin-right: 15px;line-height: 28px" v-else @click="begin">开始</el-link>
                <el-link type="warning" style="margin-right: 15px;line-height: 28px" @click="reset">重听</el-link>
                <el-link type="primary" style="margin-right: 15px;line-height: 28px" @click="submit">报告</el-link>
            </div>
            <div style="margin-right: 20px">
                <el-link type="info" style="margin-right: 15px;line-height: 28px" @click="visualSetting = true">设置
                </el-link>
                <el-switch
                        :value="speechType === 'us'"
                        @change="v => speechType = v?'us':'uk'"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="美音"
                        inactive-text="英音">
                </el-switch>
            </div>


            <!--            <router-link v-if="mode !== 'WordBook'" to="/desktop/word_book">-->
            <!--                <el-link type="primary" style="margin-right: 45px;line-height: 28px;float: right">单词本</el-link>-->
            <!--            </router-link>-->
        </div>
        <div class="word-area">
            <template v-for="(word,index) in words">
                <div class="word-item " :key="word.id"
                     :style="{borderColor: word.status === 'error'?'#F56C6C':'#909399'}">
                    <div v-if="!isSubmitted" class="word-tip"
                         :style="{backgroundColor: word.isPlay ? '#67C23A':'#909399'}"></div>
                    <div v-else style="font-weight: bold">
                        <i v-if="word.status === 'normal'" class="el-icon-remove-outline" style="color: #909399"></i>
                        <i v-if="word.status === 'correct'" class="el-icon-check" style="color: #67C23A"></i>
                        <i v-if="word.status === 'error'" class="el-icon-close" style="color: #F56C6C"></i>
                    </div>

                    <div>
                        <span v-if="!isPlay" class="word-action" @click="play(index)">
                            <i class="iconfont icon-erji"></i>
                        </span>
                        &nbsp;
                        <span v-if="mode !== 'WordBook'" class="word-action" @click="addWord(word)">
                            <i class="iconfont icon-changshi-"></i>
                        </span>
                        &nbsp;
                        <span @click="focusView(word)" class="word-action">
                            <i class="iconfont icon-chakan"></i>
                        </span>
                    </div>
                    <div>
                        <input :ref="'input'+ index" v-model="word.inputWord" @keyup.enter="enterWord(index)"
                               style="width: 150px;height: 20px;font-weight: bold;border-radius: 2px;border: 1px solid   black">
                    </div>

                </div>
            </template>

            <el-dialog
                    :modal-append-to-body='false'
                    title="单词详情"
                    :visible.sync="visualWordDescription"
                    width="700px"
            >
                <div class="between" v-if="visualTsInfo" style="font-size: 16px;">
                    <div><span style="font-weight: bold;color: #E6A23C">原文：</span>{{visualTsInfo.query}}</div>
                    <div v-if="visualTsInfo.basic">
                        <span style="font-weight: bold;color: #E6A23C">翻译：</span>{{visualTsInfo.translation.join(';')}}
                        <div v-for="(explain , index) in visualTsInfo.basic.explains" :key="index">{{explain}}</div>
                    </div>
                </div>
            </el-dialog>

            <el-dialog
                    :visible.sync="visualSubmit"
                    :modal-append-to-body='false'
                    width="600px"
                    style="font-weight: bold;"
            >
                <div slot="title">
                    听词报告 - {{category.name}}（<label style="color: #409EFF">{{level.name}}</label>）
                </div>
                <el-form>
                    <el-form-item label="听词时间">
                        <label style="color: #409EFF"> {{curDateTime()}}</label>
                    </el-form-item>

                    <el-form-item label="查询次数">
                        <label style="color: #409EFF"> {{viewCount}}</label>
                    </el-form-item>

                    <el-form-item label="听词数量">
                        <label style="color: #409EFF"> {{hearCount}}</label>
                    </el-form-item>

                    <el-form-item label="错词数量">
                        <label style="color: #409EFF"> {{errorCount}}</label>
                    </el-form-item>

                    <el-form-item label="听词得分">
                        <label style="color: #409EFF">{{hearCount !== 0?parseInt((hearCount - errorCount )/ hearCount *
                            100):0}}</label>（<label
                            style="color: #409EFF">100</label>分）
                    </el-form-item>
                </el-form>
                <div style="text-align: center">
                    <el-button type="primary" @click="visualSubmit = false">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog
                    title="设置播放模式"
                    :visible.sync="visualSetting"
                    :modal-append-to-body='false'
                    width="350px"
            >
                <el-form :inline="true">
                    <el-form-item label="重复播放次数：">
                        <el-input-number size="mini" v-model="wordRepeatCount" :min="0" :step="1"></el-input-number>
                        次
                    </el-form-item>
                    <el-form-item label="重复播放次数：">
                        <el-input-number size="mini" :value="playWordDelay / 1000"
                                         @change="v => playWordDelay = v * 1000"
                                         :min="0"
                                         :step="1"></el-input-number>
                        秒
                    </el-form-item>
                    <el-form-item label="重复播放次数：">
                        <el-input-number size="mini" :value="inputWordDelay / 1000"
                                         @change="v => inputWordDelay = v * 1000"
                                         :min="0"
                                         :step="1"></el-input-number>
                        秒
                    </el-form-item>
                </el-form>
                <div style="text-align: center">
                    <el-button type="primary" @click="visualSetting = false">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog
                    title="加入单词本"
                    :visible.sync="visualCategory"
                    :modal-append-to-body='false'
                    width="600px"
                    style="font-weight: bold;"
            >
                <el-table
                        :data="localWords"
                        style="width: 100%">
                    <el-table-column
                            label="分类名称"
                            prop="name"
                    >
                    </el-table-column>
                    <el-table-column
                            label="单词数量"
                    >
                        <template slot-scope="scope">
                            {{scope.row.words.length}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="添加"
                    >
                        <template slot-scope="scope">
                            <el-link style="margin-right: 25px" type="primary" @click="onInsertWord(scope.row)">
                                添加
                            </el-link>
                        </template>
                    </el-table-column>
                </el-table>

                <div style="text-align: center;margin: 10px 0">
                    <div v-if="showInputCategory">
                        <el-input style="max-width: 300px;display: inline-block" v-model="inputCategory"
                                  placeholder="请输入分类名称"
                                  @keypress.enter="enterInputCategory"></el-input>

                        <div style="text-align: center;margin-top: 10px">
                            <el-button plain type="primary" @click="enterInputCategory(inputCategory)">确定</el-button>
                            <el-button plain type="info" @click="showInputCategory = false">取消</el-button>
                        </div>
                    </div>
                    <el-link @click="showInputCategory = true" v-else type="primary" :underline="false">
                        <h1>
                            <i class="el-icon-plus"></i>
                            新增分类
                        </h1>
                    </el-link>
                </div>
            </el-dialog>
        </div>

    </full-parent>
</template>

<script>
    import FullParent from "../../../../components/FullParent";
    import word_store from "../../mixin/word_store";
    import moment from 'moment'

    let resetTimer
    // 定时循环播放定时
    let playTimer = null

    let repeatPlayTimer = null
    export default {
        name: "Words",
        components: {FullParent},
        props: {
            importWords: {
                type: Array,
                default: () => []
            },
            mode: {
                type: String,
                default: 'ListenWrite'
            },
            category: {
                type: Object,
                required: true
            },
            level: {
                type: Object,
                required: true
            },
        },
        mixins: [
            word_store
        ],
        data() {
            return {
                visualSetting: false,
                showInputCategory: false,
                inputCategory: '',
                localWords: [],
                visualCategory: false,
                visualBWordBook: false,
                visualWordDescription: false,
                visualTsInfo: null,
                visualSubmit: false,
                loading: true,
                words: [],
                inputWord: '',
                isPlay: false,
                playWord: null,
                showWord: null,
                playWordDelay: 0,
                inputWordDelay: 0,
                playWordIndex: 0,
                wordRepeatCount: 3,
                viewCount: 0,
                hearCount: 0,
                errorCount: 0,
                isSubmitted: false,
                speechType: 'us',
                isPause: true,
                resetLock: false
            }
        },
        watch: {
            localWords: {
                handler(val) {
                    if (this.mode === 'ListenWrite') {
                        localStorage.setItem('localWords', JSON.stringify(val))
                    }
                },
                deep: true
            }
        },
        mounted() {

            window.console.log('reset')
            if (this.mode === 'ListenWrite') {
                this.$http.get('/user/word_categories/' + this.level.id + '/words').then(
                    res => {
                        // let key = ''
                        this.words = res
                        this.loading = false
                        this.reset()
                    }
                )
            }

            if (this.mode === 'WordBook') {
                this.words = this.importWords
                this.loading = false
                this.reset()
            }


        },
        methods: {
            curDateTime(){
              return moment().format('YYYY-MM-DD HH:mm:ss')
            },

            pause() {
                this.isPause = true
            },

            begin() {
                if (this.isPlay) {
                    this.$notify.warning('请先等待上一次播放结束在开启播放')
                    return
                }
                this.isPause = false
                this.play(this.playWordIndex, false)
            },

            addCategory(word) {
                this.visualCategory = true
                this.selectWord = word
            },

            addWord(word) {
                this.visualCategory = true
                this.selectWord = word
            },


            onInsertWord(category) {
                this.selectCategory = category
                this.insertWord(this.selectWord)
            },

            enterWord(index) {
                index = parseInt(index)
                let refName = 'input' + index
                if (index < this.words.length - 1) {
                    refName = 'input' + (index + 1)
                    window.console.log(this.$refs[refName])
                    this.$refs[refName][0].focus()
                }

            },

            focusView(word) {
                word.showWord = !word.showWord
                if (word.showWord === true) {
                    this.viewCount++
                    this.visualWordDescription = true
                    let info = word.ts_info
                    if (!(word.ts_info instanceof Object)) {
                        info = JSON.parse(word.ts_info)
                    }
                    this.visualTsInfo = info
                }
            },

            submit() {
                if (!this.isSubmitted) {
                    this.checkErrorWord()
                }
                this.isSubmitted = true
                this.visualSubmit = true
                this.pause()
            },

            reset() {
                this.pause()
                this.resetListenWriteData()
            },

            resetListenWriteData(){
                this.isSubmitted = false
                this.words = this.words.map(word => {
                    word.status = 'normal'
                    word.inputWord = ''
                    word.showWord = false
                    word.isPlay = false
                    return word
                })
                this.viewCount = 0
                this.hearCount = 0
                this.errorCount = 0
            },

            checkErrorWord() {
                this.words.forEach(word => {
                    if (word.isPlay) {
                        if (word.inputWord.replace(/(^\s*)|(\s*$)/g, "") !== word.word.replace(/(^\s*)|(\s*$)/g, "")) {
                            this.errorCount++
                            word.status = 'error'
                        } else {
                            word.status = 'correct'
                        }
                    }
                })
            },

            async play(index, isReset = true) {
                this.isPause = false
                this.$refs['input' + index][0].focus()
                if (isReset) {
                    this.resetListenWriteData()
                }
                this.isPlay = true
                this.playWordIndex = index
                // 听写单词列表
                for (; this.playWordIndex < this.words.length; this.playWordIndex++) {
                    if (this.isPause) {
                        this.isPlay = false
                        return
                    }
                    // 获取播放单词
                    let word = this.words[this.playWordIndex]
                    word.isPlay = true
                    // 记录听词播放数量
                    this.hearCount++
                    // 重复播放该单词
                    for (let i = 0; i < this.wordRepeatCount; i++) {
                        if (this.isPause) {
                            this.isPlay = false
                            return
                        }
                        if (this.speechType === 'us') {
                            await this.playAudio(word.us_audio)
                        } else {
                            await this.playAudio(word.uk_audio)
                        }
                        await this.sleep(this.playWordDelay)
                    }
                    await this.sleep(this.inputWordDelay)
                }
                this.submit()
                this.isPlay = false
            },

            playAudio(url) {
                return new Promise(resolve => {
                    let audio = new Audio(url)
                    audio.play()
                    audio.onended = () => resolve()
                })
            },

            sleep(ms) {
                return new Promise(resolve => {
                    setTimeout(() => resolve(), ms)
                })
            }
        }
    }
</script>

<style scoped>
    .word-action i {
        cursor: pointer;
        color: #409EFF;
        font-weight: bold;
        font-size: 16px
    }

    .tool {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 10px;
        border-bottom: 1px solid #e6e6e6;
    }

    .word-area {
        width: 100%;
        position: absolute;
        left: 0;
        top: 50px;
        bottom: 0;
        overflow-x: scroll;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
    }

    .word-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 300px;
        height: 40px;
        padding: 10px;
        margin: 10px;
        border-radius: 5px;
        box-sizing: border-box;
        border: 1px dashed #e6e6e6;
    }

    .word-tip {
        width: 16px;
        height: 16px;
        border-radius: 20px;
    }

    .word-text {
        font-weight: bold;

    }

    .normalStatus {
        background-color: gray;
    }

    .errorStatus {
        background-color: #F56C6C;
    }

    .correctStatus {
        background-color: #67C23A;
    }
</style>


