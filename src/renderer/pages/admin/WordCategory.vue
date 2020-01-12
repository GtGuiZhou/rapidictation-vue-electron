<template>
    <div>
        <crud-index  :where-plus="{pid: 0}" :order-plus="{rank: 'desc'}"
                     :base-url="baseUrl"
                     :relations="relations"  ref="crud"
                     :insert-form="insertForm" :edit-form="editForm"
                     :filter="filter" :table="table" :fields="fields">
            <template  #table-action-left="scope">
                <el-button plain type="success" size="mini" @click="addChildren(scope.row)" v-if="scope.row.pid == '0'">添加等级</el-button>
                <el-button plain type="primary" size="mini" @click="wordManager(scope.row)" v-if="scope.row.pid != '0'">单词管理</el-button>
            </template>
        </crud-index>

        <el-dialog :modal="false" :visible.sync="visualAddChildren" title="添加子节点">
            <crud-form :form-config="insertForm" :form-data="form" :fields="fields" :submit="submit" @submit-success="refresh"></crud-form>
        </el-dialog>

        <el-dialog :modal="false" :visible.sync="visualWordManager" :close-on-click-modal="false" title="单词管理">
            <el-tag
                    style="margin: 5px"
                    :key="index"
                    v-for="(tag,index) in words"
                    closable
                    :disable-transitions="false"
                    @close="delWord(tag,index)">
                {{tag.word}}
            </el-tag>
            <el-input
                    ref="inputWord"
                    style="width: 150px"
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    size="small"
                    @keyup.enter.native="insertWord"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInputWord">+ New Tag</el-button>

        </el-dialog>
    </div>
</template>

<script>
    import CrudIndex from "../../components/admin/CrudIndex";
    import CrudForm from "../../components/admin/CrudForm";

    export default {
        name: "WordCategory",
        components: {CrudForm, CrudIndex},
        data() {
            return {
                baseUrl: '/admin/word_categories',
                relations: ['children'],
                filter: {
                    disabledFields: ['is_translation', 'status', 'comment'],
                    hideFields: ['create_time', 'ts']
                },
                table: {
                    defaultExpandAll: true,
                    treeProps: {children: 'children'},
                    actionWidth: 300,
                    rowKey: 'id'
                },
                insertForm: {
                    disabledFields: ['is_translation', 'status', 'comment'],
                    hideFields: ['create_time', 'ts']
                },
                editForm: {
                    disabledFields: ['is_translation', 'status', 'comment'],
                    hideFields: ['create_time']
                },
                fields: [
                    {name: 'name', comment: '名称', validate: [{required: true, message: '名称不能为空'}]},
                    {name: 'rank', comment: '排序', validate: [{validator: (rule,value,callback) => {parseInt(value)?callback():callback(new Error('必须为数字'))}}],type: 'number',default: 0},
                ],
                parentOptions: [],
                words: [],
                word: '',
                visualAddChildren: false,
                visualWordManager: false,
                form: {
                    name: '',
                    pid: 0,
                },
                dynamicTags: ['标签一', '标签二', '标签三'],
                inputVisible: false,
                inputValue: '',
                selectCategory: {}
            }
        },
        methods: {
            refresh(){
                this.$refs.crud.refresh()
            },

            submit(){
                return this.$http.post(this.baseUrl,this.form)
            },

            addChildren(row){
                this.form.pid = row.id
                this.visualAddChildren = true
            },

            wordManager(row){
                this.selectCategory = row
                this.$http.get(this.baseUrl + '/' + row.id + '/words').then(
                    res => {
                        this.words = res
                    }
                )
                this.visualWordManager = true
            },

            async delWord(row,index){
                await this.$http.delete(this.baseUrl + '/' + this.selectCategory.id + '?relation=words&relation_id=' + row.id)
                this.words.splice(index,1)
            },
            async insertWord(){
                this.inputValue = this.inputValue.replace(/(^\s*)|(\s*$)/g, "")
                if (!this.inputValue || !/[a-z]+$/i.test(this.inputValue)){
                    this.$notify.error('格式不正确')
                    return
                }

                let res = await this.$http.post(this.baseUrl + '/' + this.selectCategory.id + '/words',{word: this.inputValue})
                this.words.push(res)
                this.inputValue = ''

            },

            showInputWord() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.inputWord.focus();
                });
            },

        }
    }
</script>

<style scoped>

</style>
