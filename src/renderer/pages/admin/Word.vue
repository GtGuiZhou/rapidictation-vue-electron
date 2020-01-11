<template>
    <div>
        <crud-index :base-url="baseUrl" ref="crud" :insert-form="insertForm" :edit-form="editForm" :filter="filter" :table="table" :fields="fields">
            <template  #table-action-left="scope">
                <el-button plain type="success" size="mini" @click="againTranslation(scope.row)" v-if="scope.row.is_translation !== 'no'">重新翻译</el-button>
            </template>

            <template slot="more">
                <el-form >
                    <el-form-item label="批量创建">
                        <el-tag
                                type="success"
                                style="margin: 5px"
                                :key="word"
                                v-for="(word,index) in words"
                                closable
                                :disable-transitions="false"
                                @close="delWord(index)">
                            {{word}}
                        </el-tag>
                        <el-input
                                style="width: 200px"
                                class="input-new-tag"
                                v-model="word"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="insertWord"
                                placeholder="请输入单词，按enter键确认"
                        >
                        </el-input>
                        <div>
                            <el-button plain type="primary" @click="batchWord" style="float: right">立即创建</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </template>


        </crud-index>

    </div>
</template>

<script>
    import CrudIndex from "../../components/admin/CrudIndex";
    export default {
        name: "Word",
        components: {CrudIndex},
        data() {
            return {
                baseUrl: '/admin/words',
                filter: {
                    disabledFields: ['is_translation','status','comment'],
                    hideFields: ['create_time','ts']
                },
                table: {
                    actionWidth: 300
                },
                insertForm: {
                    disabledFields: ['is_translation','status','comment'],
                    hideFields: ['create_time','ts']
                },
                editForm: {
                    disabledFields: ['is_translation','status','comment'],
                    hideFields: ['create_time']
                },
                fields: [
                    {name: 'word',comment: '单词'},
                    {name: 'is_translation',comment: '是否翻译',default: 'no',type: 'radio',options: [{label: '已翻译',value: 'yes'},{label: '未翻译',value: 'no'}]},
                    {name: 'status',comment: '状态',default: 'normal',type: 'radio',options: [{label: '正常',value: 'normal'},{label: '异常',value: 'exception'}]},
                    {name: 'comment',comment: '备注',type: 'textarea'},
                    {name: 'create_time',comment: '创建时间'},
                ],
                words: [],
                word: ''
            }
        },

        methods: {
            handleNodeClick(row){
                window.console.log(row)
            },
            async batchWord() {
                if (this.words.length < 1){
                    this.$notify.error('创建单词不能为空')
                    return
                }
                await this.$http.post('/admin/words/batchImport',this.words)
                this.$refs.crud.refresh()
                this.words = []
            },
            delWord(index){
                this.words.splice(index,1)
            },
            insertWord(){
                if (!this.word || !/[a-z]+$/i.test(this.word)){
                    this.$notify.error('格式不正确')
                    return
                }

                this.words.push(this.word)
                this.word = ''
            },
            againTranslation(row){

                this.$http.put(this.baseUrl + '/' + row.id + '/again_translation').then(
                    () => {
                        this.$refs.crud.refresh()
                        this.$notify.success('执行成功')
                    }
                )
            }
        }
    }
</script>

<style scoped>

</style>
