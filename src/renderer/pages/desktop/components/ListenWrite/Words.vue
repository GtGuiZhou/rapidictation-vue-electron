<template>
    <full-parent v-loading="loading" style="overflow-x: hidden;background-color: white">
        <div class="tool">
            <el-link type="primary" style="margin-right: 15px;line-height: 28px" @click="submit">提交</el-link>
            <el-link type="success" style="margin-right: 15px;line-height: 28px" v-if="!isPause" @click="pause">暂停</el-link>
            <el-link type="success" style="margin-right: 15px;line-height: 28px"  v-else @click="begin">开始</el-link>
            <el-link type="warning" style="margin-right: 15px;line-height: 28px" @click="reset">重置</el-link>

            <el-link style="margin-right: 15px;text-decoration: none" :underline="false">重复播放次数：
                <el-input-number size="mini" v-model="wordRepeatCount" :min="0" :step="1"></el-input-number>
            </el-link>
            <el-link style="margin-right: 15px;text-decoration: none" :underline="false">重复播放延时：
                <el-input-number size="mini" v-model="playWordDelay" :min="0" :step="1"></el-input-number>
                毫秒
            </el-link>
            <el-link style="margin-right: 15px;text-decoration: none" :underline="false">单词输入延时：
                <el-input-number size="mini" v-model="inputWordDelay" :min="0" :step="1"></el-input-number>
                毫秒
            </el-link>
            <el-switch
                    :value="speechType === 'us'"
                    @change="v => speechType = v?'us':'uk'"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="美音"
                    inactive-text="英音">
            </el-switch>
            <router-link v-if="mode !== 'WordBook'" to="/desktop/word_book">
                <el-link type="primary" style="margin-right: 45px;line-height: 28px;float: right">单词本</el-link>
            </router-link>
        </div>
        <div class="word-area">
            <div class="word-item " v-for="(word,index) in words" :key="word.id">
                <div v-if="!isSubmitted" class="word-tip"
                     :style="{backgroundColor: word.isPlay ? '#67C23A':'#909399'}"></div>
                <div v-else style="font-weight: bold">
                    <i v-if="word.status === 'normal'" class="el-icon-remove-outline" style="color: #909399"></i>
                    <i v-if="word.status === 'correct'" class="el-icon-check" style="color: #67C23A"></i>
                    <i v-if="word.status === 'error'" class="el-icon-close" style="color: #F56C6C"></i>
                </div>

                <div>
                    <el-tag v-if="!isPlay" style="cursor: pointer" @click="play(index)"><i
                            class="el-icon-video-play"></i></el-tag>
                    &nbsp;
                    <el-tag v-if="mode !== 'WordBook'" style="cursor: pointer" @click="addWord(word)"><i
                            class="el-icon-plus"></i></el-tag>
                    &nbsp;
                    <el-tag @click="focusView(word)" style="cursor: pointer"
                    ><i class="el-icon-view"></i></el-tag>
                </div>
                <div>
                    <input :ref="'input'+ index" v-model="word.inputWord" @keyup.enter="enterWord(index)"
                           style="width: 150px;height: 30px">
                    <!--                    <el-input v-model="word.inputWord" style="width: 150px"-->
                    <!--                              @keyup.enter="enterWord"></el-input>-->
                </div>

            </div>

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
                    width="30%"
                    style="font-weight: bold;"
            >
                <div slot="title">
                    听抄报告 - {{category.name}}（<label style="color: #409EFF">{{level.name}}</label>）
                </div>
                <el-form>
                    <el-form-item label="查询次数">
                        <label style="color: #409EFF"> {{viewCount}}</label>
                    </el-form-item>

                    <el-form-item label="听词数量">
                        <label style="color: #409EFF"> {{hearCount}}</label>
                    </el-form-item>

                    <el-form-item label="错词数量">
                        <label style="color: #409EFF"> {{errorCount}}</label>
                    </el-form-item>

                    <el-form-item label="本次听抄得分">
                        <label style="color: #409EFF">{{parseInt((hearCount - errorCount )/ hearCount *
                            100)}}</label>（<label
                            style="color: #409EFF">100</label>分）
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="visualSubmit = false">确 定</el-button>
            </span>
            </el-dialog>


            <el-dialog
                    title="加入单词本"
                    :visible.sync="visualCategory"
                    :modal-append-to-body='false'
                    width="30%"
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
                        <el-button plain type="primary" @click="enterInputCategory(inputCategory)">确定</el-button>
                        <el-button plain type="info" @click="showInputCategory = false">取消</el-button>
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

    // 定时循环播放定时
    let playTimer = null

    let repeatPlayTimer = null
    export default {
        name: "Words",
        components: {FullParent},
        props: {
            importWords: {
                type: Array,
                default: () =>[]
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
                playWordDelay: 1500,
                inputWordDelay: 3000,
                playWordIndex: 0,
                wordRepeatCount: 3,
                viewCount: 0,
                hearCount: 0,
                errorCount: 0,
                isSubmitted: false,
                speechType: 'us',
                isPause: false
            }
        },
        watch: {
            localWords: {
                handler(val) {
                    if (this.mode === 'ListenWrite'){
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

            if(this.mode === 'WordBook'){
                this.words = this.importWords
                this.loading = false
                this.reset()
            }


        },
        methods: {
            pause(){
                if (this.isPlay){
                    this.isPause = true
                    clearInterval(playTimer)
                    clearTimeout(repeatPlayTimer)
                }
            },

            begin(){
                if (this.isPlay){
                    this.isPause = false
                    this.play(this.playWordIndex,false)
                }
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
                    if (!(word.ts_info instanceof Object)){
                        this.visualTsInfo = JSON.parse(word.ts_info)
                    }
                }
            },

            submit() {
                clearInterval(playTimer)
                clearTimeout(repeatPlayTimer)
                if (!this.isSubmitted) {
                    this.checkErrorWord()
                }
                this.isSubmitted = true
                this.visualSubmit = true
                this.isPlay = false
            },

            reset(){
                clearInterval(playTimer)
                clearTimeout(repeatPlayTimer)
                this.isSubmitted = false
                this.isPlay = false
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
                        if (word.inputWord !== word.word) {
                            this.errorCount++
                            word.status = 'error'
                        } else {
                            word.status = 'correct'
                        }
                    }
                })
            },

            play(index,isReset = true) {
                this.$refs['input' + index][0].focus()
                if (isReset){
                    this.reset()
                }
                this.isPlay = true
                this.playWordIndex = index

                let queueFunc = () => {
                    if (this.playWordIndex >= this.words.length) {
                        this.submit()
                        return;
                    }
                    // 获取播放单词
                    let word = this.words[this.playWordIndex]
                    word.isPlay = true
                    // 记录听词播放数量
                    this.hearCount++
                    // 重复播放该单词
                    let playCount = 0
                    let playFunc = () => {
                        let mp3 = null
                        if (this.speechType === 'us') {
                            mp3 = new Audio(word.us_audio)
                        } else {
                            mp3 = new Audio(word.uk_audio)
                        }
                        mp3.play()
                        playCount++
                        if (playCount < this.wordRepeatCount) {
                            repeatPlayTimer = setTimeout(playFunc, this.playWordDelay)
                        }
                    }
                    setTimeout(playFunc, this.playWordDelay)
                    // 切换到下一单词
                    this.playWordIndex++
                }

                queueFunc()
                playTimer = setInterval(queueFunc, this.inputWordDelay + this.playWordDelay * this.wordRepeatCount)
            }
        }
    }
</script>

<style scoped>
    .tool {
        overflow-x: auto;
        min-width: 1324px;
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
        width: 350px;
        height: 50px;
        padding: 10px;
        margin: 10px;
        border-radius: 5px;
        box-sizing: border-box;
        border: 2px dashed #e6e6e6;
    }

    .word-tip {
        width: 20px;
        height: 20px;
        border-radius: 25px;
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


