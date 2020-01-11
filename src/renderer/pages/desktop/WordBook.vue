<template>
    <div>
        <el-header class="header" style="height: 40px">
            <div style="float: left;line-height: 40px;font-size: 16px;font-weight: bold;cursor: pointer" @click="$router.push('/desktop/welcome')"><i class="el-icon-back"></i>返回主页</div>
            <div style="line-height: 40px;font-size: 16px;font-weight: bold">学好英语，从听懂单词开始！</div>
            <div style="position:absolute;right:10px;top:0;z-index: 9999;line-height: 40px;font-size: 20px;font-weight: bold;cursor: pointer" @click="visualNewCategory = true">
                新增分类<i class="el-icon-plus"></i>
            </div>
        </el-header>
        <el-container style="width: 100%;height: 100%">
<!--            <div style="padding: 10px">-->
<!--                <router-link to="/desktop/welcome">-->
<!--                    <el-button plain type="primary"><i class="el-icon-back"></i> 返回</el-button>-->
<!--                </router-link>-->
<!--                <el-button plain type="success" style="float: right" @click="visualNewCategory = true"><i-->
<!--                        class="el-icon-plus"></i> 新增分类-->
<!--                </el-button>-->
<!--            </div>-->

            <div style="padding: 0 10px;overflow-y: auto;width: 100%">
                <el-table
                        :data="localWords"
                        style="width: 100%">
                    <el-table-column
                            label="分类名称"
                            prop="name"
                    >
                    </el-table-column>
                    <el-table-column
                            width="200"
                            label="单词数量"
                    >
                        <template slot-scope="scope">
                            {{scope.row.words.length}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="300"
                            label="操作"
                    >
                        <template slot-scope="scope">
                            <el-link style="margin-right: 25px" type="primary" @click="wordManager(scope.row)">
                                管理
                            </el-link>
                            <el-link style="margin-right: 25px" type="success"
                                     @click="e => exportCategoryWords(e,scope.row)">
                                导出
                            </el-link>
                            <el-link style="margin-right: 25px" type="info"
                                     @click="e => listenWriteCategory(scope.row.words)">
                                听写
                            </el-link>
                            <el-link type="danger" @click="deleteCategory(scope.$index)">
                                删除
                            </el-link>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <el-dialog :modal="false" :visible.sync="visualNewCategory" title="新建分类" width="450px">
                <div style="text-align: center">
                    <el-input v-model="inputCategory" placeholder="请输入分类名称"
                              @keypress.enter="enterInputCategory(inputCategory)"></el-input>
                    <br>
                    <br>
                    <el-button plain type="primary" @click="enterInputCategory(inputCategory)">创建分类</el-button>
                </div>
            </el-dialog>


            <el-dialog width="80%" :close-on-click-modal="false" :modal="false" :visible.sync="visualWordManager"
                       title="单词管理">
                <div style="display: flex">
                    <div class="word-list">
                        <div class="word-list-header">
                            <div>
                                <el-input
                                        ref="inputWord"
                                        style="width: 200px"
                                        class="input-new-tag"
                                        v-model="inputValue"
                                        size="small"
                                        @keyup.enter.native="onInsertWord"
                                        placeholder="请输入要添加的单词"
                                >
                                </el-input>
                                <el-button class="button-new-tag" size="small" @click="onInsertWord">添加</el-button>
                            </div>
                            <div>
                                <el-switch
                                        :value="speechType === 'us'"
                                        @change="v => speechType = v?'us':'uk'"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-text="美音"
                                        inactive-text="英音">
                                </el-switch>
                                <el-link type="success" @click="listenWriteChecked"
                                         style="margin: 0 10px;line-height: 20px">
                                    听写选中
                                </el-link>
                                <el-link type="danger" @click="deleteCheckedWord"
                                         style="margin: 0 10px;line-height: 20px">
                                    删除选中
                                </el-link>
                            </div>
                        </div>
                        <div class="word-list-item">
                            <el-table
                                    @selection-change="selectWordsChange"
                                    :data="selectCategory.words"
                                    style="width: 100%;height: 400px;overflow-y: auto">
                                <el-table-column
                                        type="selection"
                                        width="55">
                                </el-table-column>
                                <el-table-column label="发音" width="50">
                                    <template slot-scope="scope">
                                        <i class="el-icon-video-play"
                                           style="font-size: 24px;color: #409EFF;cursor: pointer"
                                           @click="playWord(scope.row)"></i>
                                    </template>
                                </el-table-column>
                                <el-table-column label="单词" prop="word"></el-table-column>
                                <el-table-column label="词义">
                                    <template slot-scope="scope">
                                        {{ scope.row.ts_info.basic ?scope.row.ts_info.basic.explains[0]:''}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="查看" width="50">
                                    <template slot-scope="scope">
                                        <el-link type="primary" @click="selectWord = scope.row">查看</el-link>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div class="word-description">
                        <div v-if="selectWord">
                            <div class="title">发音</div>
                            <div>
                                美式音标：[{{selectWord.ts_info.basic['us-phonetic']}}]<br>
                                英式音标：[{{selectWord.ts_info.basic['uk-phonetic']}}]
                            </div>

                            <div class="title">词义</div>
                            <div>
                                <div v-for="(explain,index) in selectWord.ts_info.basic.explains" :key="index"
                                     style="margin: 10px 0">
                                    {{explain}}
                                </div>
                            </div>

                            <div v-if="selectWord.ts_info.web">
                                <div class="title">相关</div>
                                <div v-for="(word,index) in selectWord.ts_info.web" :key="index" style="margin: 10px 0">
                                    {{word.key}}：{{word.value.join(',')}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-dialog>

            <el-dialog :close-on-click-modal="false" :modal="false" :visible.sync="visualListenWrite" title="单词听写"
                       width="80%" style="overflow-x: hidden">
                <div style="height: 300px;">
                    <words :category="selectCategory" :level="{name: '单词本'}" mode="WordBook"
                           :import-words="selectWords"></words>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
    import Clipboard from 'clipboard'
    import word_store from "./mixin/word_store";
    import Words from "./components/ListenWrite/Words";

    export default {
        name: "WordBook",
        components: {Words},
        mixins: [word_store],
        data() {
            return {
                visualListenWrite: false,
                speechType: 'us',
                visualNewCategory: false,
                selectWords: [], // table的复选框
                showInputCategory: false,
                inputCategory: '',
                allChecked: false,
                visualWordManager: false,
                inputVisible: false,
                inputValue: '',
                localWords: []
            }
        },
        methods: {
            selectWordsChange(val) {
                window.console.log(val)
                this.selectWords = val
            },

            listenWriteChecked() {
                this.visualWordManager = false
                this.visualListenWrite = true
            },
            listenWriteCategory(category) {
                this.selectWords = category
                this.visualWordManager = false
                this.visualListenWrite = true
            },

            deleteCheckedWord() {
                this.selectWords.forEach(
                    (word) => {
                        let index = this.selectCategory.words.findIndex(cword => cword.id === word.id)
                        this.selectCategory.words.splice(index, 1)
                    }
                )
            },

            async onInsertWord() {
                let word = this.inputValue
                if (!word || !/[a-z]+$/i.test(word)) {
                    this.$notify.error('格式不正确')
                    return
                }

                let res = await this.$http.post('/user/words', {word: word})
                await this.insertWord(res)
                this.inputValue = ''
            },

            wordManager(row) {
                this.selectCategory = row
                if (this.selectCategory.words.length > 0) {
                    this.selectWord = this.selectCategory.words[0]
                }
                this.visualWordManager = true
            },

            showInputWord() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.inputWord.focus();
                });
            },

            playWord(word) {
                let mp3 = null
                if (this.speechType === 'us') {
                    mp3 = new Audio(word.us_audio)
                } else {
                    mp3 = new Audio(word.uk_audio)
                }
                mp3.play()
            },

            exportCategoryWords(e, category) {
                window.console.log(e)
                let result = ''
                category.words.forEach(word => {
                    let tsStr = word.ts_info.basic.explains.join('\r\n')
                    result += `[${word.word}]\r\n${tsStr}\r\n\r\n`
                })

                const clipboard = new Clipboard(e.target, {
                    text: () => result
                })
                clipboard.on('success', () => {
                    this.$notify.success('单词已保存到您的剪贴板中')
                    clipboard.destroy()
                })
                clipboard.on('error', () => {
                    this.$notify.success('单词保存失败')
                    clipboard.destroy()
                })
                clipboard.onClick(e)
            }
        }
    }
</script>

<style scoped>
    .word-list {
        min-width: 670px;
        border: 1px solid #e6e6e6;
    }

    .word-description {
        padding: 0 10px;
        width: 260px;
        border-top: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
        overflow-y: auto;
    }

    .word-description .title {
        font-weight: bold;
        color: #409EFF;
        margin: 10px 0;
    }

    .word-list-header {
        padding: 10px;
        border-bottom: 1px solid #e6e6e6;
    }

    .word-list-header {
        display: flex;
        justify-content: space-between;
    }

    .category {
        color: #409EFF;
        font-weight: bold;
        padding: 10px 0;
        border-bottom: 1px solid #e6e6e6
    }

    .category td {
        padding: 10px 0;
    }

    .range {
        border: 1px solid #e6e6e6;
        /*border-radius: 5px;*/
        margin: 10px;
        padding: 10px;
    }

    .header {
        background-color: #409EFF;
        color: white;
        text-align: center;
    }
</style>
