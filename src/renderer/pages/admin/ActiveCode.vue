<template>
    <div>
        <crud-index :base-url="baseUrl" ref="crud" :insert-form="insertForm" :edit-form="editForm" :filter="filter" :table="table" :fields="fields">
            <template slot="more">
                <el-form >
                    <el-form-item label="生成数量">
                         <el-input-number v-model="makeNumber"  :min="1"  label="描述文字"></el-input-number>
                        <el-button plain type="primary" @click="make">批量生成</el-button>
                    </el-form-item>
                </el-form>
            </template>

            <template  #table-action-left="scope">
                <el-button  size="mini" plain type="primary" @click="e => copyActiveCode(e,scope.row.code)">复制</el-button>
                <el-button plain type="success" size="mini" @click="release(scope.row)" v-if="scope.row.status !== 'release'">发布</el-button>
            </template>
        </crud-index>
    </div>
</template>

<script>
    import CrudIndex from "../../components/admin/CrudIndex";
    import Clipboard from 'clipboard'
    export default {
        name: "ActiveCode",
        components: {CrudIndex},
        data() {
            return {
                baseUrl: '/admin/active_codes',
                filter: {
                    hideFields: ['create_time','update_time']
                },
                table: {
                    actionWidth: '350',
                },
                insertForm: {
                    hideFields: ['create_time','update_time']
                },
                editForm: {
                    disabledFields: ['code'],
                    hideFields: ['create_time','update_time']
                },
                fields: [
                    {name: 'code',comment: '激活码',validate: []},
                    {name: 'machine_code',comment: '机器码',validate: []},
                    {name: 'status',comment: '状态',validate: [],default: 'normal',type: 'radio',options: [{label: '拉黑',value: 'mask'},{label: '未使用',value: 'normal'},{label: '已发放',value: 'release'},{label: '已激活',value: 'active'}]},
                    {name: 'create_time',comment: '创建时间'},
                    {name: 'active_time',comment: '激活时间'},
                ],
                makeNumber: 1,
            }
        },
        methods: {
            make(){
                this.$http.post('/admin/active_codes/randGenerate/' + this.makeNumber).then(
                    () => {
                        this.$refs.crud.refresh()
                        this.$notify.success('创建成功')
                    }
                )
            },

            release(row){
                this.$http.put('/admin/active_codes/release/' + row.id).then(
                    () => {
                        this.$refs.crud.refresh()
                        this.$notify.success('发放成功')
                    }
                )
            },

            copyActiveCode(e,code){
                const clipboard = new Clipboard(e.target, {
                    text: () => code
                })
                clipboard.on('success', () => {
                    this.$notify.success('激活码已保存到您的剪贴板中')
                    clipboard.destroy()
                })
                clipboard.on('error', () => {
                    this.$notify.success('激活码保存失败')
                    clipboard.destroy()
                })
                clipboard.onClick(e)
            }
        },

    }
</script>

<style scoped>

</style>
