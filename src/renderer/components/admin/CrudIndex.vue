<template>
    <div class="container">
        <div class="range" v-if="visualFilter">
                <crud-filter :filter-config="filter"  :filter-form="filterForm" :fields="fields" @query="queryFilter"></crud-filter>
        </div>

        <div class="range">
            <div class="between" style="flex-wrap: wrap;">
                <div>
                    <el-button plain icon="el-icon-refresh" @click="refresh"></el-button>
                    <el-button type="primary" plain @click="insertRow" v-if="isAuth('insert')"
                               icon="el-icon-circle-plus">
                        新增
                    </el-button>
                    <el-button type="danger" plain @click="deleteSelection" :disabled="selection.length < 1"
                               icon="el-icon-delete-solid"
                               v-if="isAuth('delete')">删除选中
                    </el-button>
                </div>
                <div>
                    <el-input style="width: 250px" v-model="searchContent" placeholder="请输入搜索内容"></el-input>
                    <el-button type="success" plain icon="el-icon-search">搜索</el-button>
                    <el-button type="warning" plain icon="el-icon-s-operation" @click="toggleFilter">筛选</el-button>
                    <el-button type="info" icon="el-icon-more" @click="visualMore = true"></el-button>
                </div>
            </div>
        </div>

        <div class="range">
            <el-table
                    :default-expand-all="tableConfig.defaultExpandAll"
                    :row-key="tableConfig.rowKey"
                    :tree-props="tableConfig.treeProps"
                    @sort-change="sortChange"
                    v-loading="loadingData"
                    @selection-change="onSelectionChange"
                    height="500"
                    ref="singleTable" :data="tableData" border highlight-current-row style="width: 100%">
                <el-table-column

                        v-if="tableConfig.selection"
                        type="selection"
                        width="55">
                </el-table-column>

                <template v-for="field in fields">
                    <slot :name="'table-col-' + field.name">
                        <el-table-column
                                sortable="custom"
                                :formatter="field.formatter"
                                :width="field.width"
                                v-if="isHideField(field.name)"
                                :key="field.name"
                                :label="field.comment?field.comment:field.name"
                                :prop="field.name"
                        >
                            <template slot-scope="scope">
                                <column :field="field" :row="scope.row"></column>
                            </template>
                        </el-table-column>
                    </slot>
                </template>

                <el-table-column label="操作" :width="tableConfig.actionWidth" v-if="tableConfig.actionColumn">
                    <template slot-scope="scope">
                            <slot name="table-action-left" v-bind="scope"></slot>
                            <el-button type="warning" plain @click="editRow(scope.row)" v-if="isAuth('edit')"
                                       icon="el-icon-edit" size="mini">编辑
                            </el-button>
                            <slot name="table-action-middle" v-bind="scope"></slot>
                            <el-button type="danger" plain @click="deleteRow(scope.row)" v-if="isAuth('delete')"
                                       icon="el-icon-delete" size="mini">删除
                            </el-button>
                            <slot name="table-action-right" v-bind="scope"></slot>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <div class="range" style="text-align: center">
            <el-pagination
                    @size-change="size => setPagingSize(size)"
                    @current-change="index => setPagingIndex(index)"
                    :current-page="pagingIndex"
                    :page-sizes="[10, 20, 50, 100, 'all']"
                    :page-size="pagingSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagingTotal">
            </el-pagination>
        </div>

        <el-dialog :modal="false" :visible.sync="visualForm">
            <div slot="title" style="border-bottom: 1px solid #e6e6e6;padding-bottom: 10px"><i
                    class="el-icon-document"/>{{formTitle}}
            </div>
            <crud-form :submit="formSubmit" :form-config="formConfig" :form-data="formData"
                       :fields="fields" @submit-success="refresh"></crud-form>
            <div slot="footer" class="form-footer">
                <!--                这里用云的动漫图-->
<!--                <img src="../../assets/form_footer.jpg">-->
            </div>
        </el-dialog>

        <el-dialog :modal="false" :visible.sync="visualMore" title="更多">
            <slot name="more"></slot>
        </el-dialog>
    </div>
</template>

<script>
    // import Field from "./fields/field";
    import CrudForm from "./CrudForm";
    import CrudFilter from "./CrudFilter";
    import Column from "./column/column";

    export default {
        name: "CrudIndex",
        components: {Column, CrudFilter, CrudForm},
        // components: {Field},
        props: {
            wherePlus:{
                type: Object,
                default: () => ({})
            },
            orderPlus:{
                type: Object,
                default: () => ({})
            },
            baseUrl: {
                type: String,
                default: ''
            },
            relations: {
                type: Array,
                default: () => []
            },
            insertForm: {
                type: Object,
                default: () => ({})
            },
            editForm: {
                type: Object,
                default: () => ({})
            },
            filter: {
                type: Object,
                default: () => ({})
            },
            table: {
                type: Object,
                default: () => ({})
            },
            fields: {
                default: []
            }
        },
        computed: {
            tableConfig() {
                let _default = {
                    treeProps: {},
                    pk: 'id',
                    selection: true,
                    actionColumn: true,
                    auth: ['insert', 'delete', 'edit'],
                    hideFields: [],
                    baseUrl: '',
                    getUrl: '',
                    insertUrl: '',
                    editUrl: '',
                    deleteUrl: '',
                    actionWidth: '200',
                    rowKey: '',
                    defaultExpandAll: false
                }
                for (let key in this.table) {
                    _default[key] = this.table[key]
                }
                return _default
            },
            primaryFieldName() {
                return this.tableConfig.pk
            },

        },
        data() {
            return {
                tableData: [],
                selection: [],
                searchContent: '',
                pagingIndex: 1,
                pagingSize: 10,
                pagingTotal: 0,
                loadingData: false,
                deleteRowIds: '',
                visualForm: false,
                visualMore: false,
                visualFilter: false,
                formTitle: '',
                formData: {},
                formConfig: {},
                formSubmit: null,
                sort: {},
                where: {},
                filterForm: {}
            }
        },
        mounted() {
            this.refresh()
        },
        methods: {
            // 刷新数据
            async refresh() {
                this.loadingData = true
                this.$emit('refresh-before')
                try {
                    const res = await this.$http.get(this.getUrl())
                    this.tableData = res.data
                    this.pagingTotal = res.total
                } finally {
                    this.loadingData = false
                }
                this.$emit('refresh-after')
            },
            // 新增一行数据
            insertRow() {
                this.formTitle = '新增'
                this.formConfig = this.insertForm
                this.formSubmit = formData => {
                    return this.$http.post(this.insertUrl(), formData)
                }
                this.visualForm = true
                let row = {}
                // 构造表单数据
                this.fields.forEach(field => {
                    // 填入默认值
                    row[field.name] = 'default' in field ? field.default : ''
                })
                this.formData = row
            },

            // 编辑指定行数据
            editRow(row) {
                this.formTitle = '编辑'
                this.formConfig = this.editForm
                this.formData = JSON.parse(JSON.stringify(row))
                this.formSubmit = formData => {
                    return this.$http.put(this.editUrl() + '/' + this.formData[this.primaryFieldName], formData)
                }
                this.visualForm = true
            },

            // 删除指定行
           async deleteRow(row) {
               this.deleteRowIds = row[this.primaryFieldName]
               await this.$http.delete(this.deleteUrl())
               this.$notify.success('删除成功')
               this.refresh()
            },
            // 删除选中行
            async deleteSelection() {
                this.deleteRowIds = this.selection.map(item => item[this.primaryFieldName]).join(',')
                await this.$http.delete(this.deleteUrl())
                this.$notify.success('删除成功')
                this.refresh()
            },
            // 设置当前数据分页
            setPagingIndex(index) {
                this.pagingIndex = index
                this.refresh()
            },
            // 设置分页数据大小
            setPagingSize(size) {
                this.pagingSize = size
                this.refresh()
            },
            // 选中行改变
            onSelectionChange(selection) {
                this.selection = selection
            },
            // 排序改变
            sortChange({prop,order}) {
                this.sort = {} // 由于el-table 暂不支持同时多个排序，所以先清空之前的排序
                this.sort[prop] = order
                this.refresh()
            },
            // toggle过滤模块
            toggleFilter(){
                this.visualFilter = !this.visualFilter
                if (this.visualFilter){
                    let row = {}
                    // 构造表单数据
                    this.fields.forEach(field => {
                        // 填入默认值
                        row[field.name] = ''
                    })
                    this.filterForm = row
                } else {
                    this.where = {}
                }
            },
            // 执行过滤查询
            queryFilter(where){
                this.where = where
                this.refresh()
            },
            // 关闭更多弹出框
            closeMoreDialog(){
              this.visualMore = false
            },

            // 组件方法
            isHideField(fieldName) {
                return !this.tableConfig.hideFields.some(item => {
                    return item === fieldName
                })
            },
            // 其他
            isAuth(authName) {
                return this.tableConfig.auth.some(item => authName === item)
            },
            // URL，放在Computed中有些问题
            getUrl() {
                // 排序查询
                let sort = {}
                for(let key in this.sort){
                    sort[key] = this.sort[key] === 'descending'?'desc':'asc'
                }

                let sortStr = encodeURIComponent(JSON.stringify(sort))

                let where = JSON.parse(JSON.stringify(this.where))
                for (let key in this.wherePlus){
                    where[key] = this.wherePlus[key]
                }
                let whereStr = encodeURIComponent(JSON.stringify(where))

                let releationsStr = encodeURIComponent(JSON.stringify(this.relations))
                return this.baseUrl + this.tableConfig.getUrl + '?page=' + this.pagingIndex + '&size=' + this.pagingSize
                    + "&sort=" + sortStr + '&where=' + whereStr + '&search=' + this.searchContent + '&relations=' + releationsStr
            },
            insertUrl() {
                return this.baseUrl + this.tableConfig.insertUrl
            },
            editUrl() {
                return this.baseUrl + this.tableConfig.editUrl
            },
            deleteUrl() {
                return this.baseUrl + this.tableConfig.deleteUrl + '/' + this.deleteRowIds
            }
        }
    }
</script>

<style scoped>
    .range {
        border: 1px solid #e6e6e6;
        /*border-radius: 5px;*/
        margin: 10px 10px 0 10px;
        padding: 10px;
    }


    .container {
        display: flex;
        flex-direction: column;
        /*flex-wrap: wrap;*/
    }

    .form-footer {
        position: relative;
    }

    .form-footer img {
        position: absolute;
        height: 50px;
        width: 100%;
        bottom: 0;
        left: 0;
    }
</style>
