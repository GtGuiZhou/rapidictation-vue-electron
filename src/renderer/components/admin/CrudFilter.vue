<template>
    <el-form :inline-message="true" :inline="true" ref="form" :label-width="getConfig('labelWidth','80px')">
        <template v-for="field in fields">
            <el-form-item
                    v-if="isHideField(field.name)"
                    :key="field.name"
                    :label="field.comment?field.comment:field.name">
                <field :form-data="filterForm" :field="field"></field>
            </el-form-item>
        </template>
        <el-form-item>
            <el-button v-loading="submitLoading" type="primary" @click="onSubmit" icon="el-icon-s-promotion">查 询
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import Field from "./fields/field";

    export default {
        name: "CrudFilter",
        components: {Field},
        props: {
            // 过滤表单，用来和表单组件做双向绑定
            filterForm: {
                type: Object,
                default: () => ({})
            },
            filterConfig: {
                type: Object,
                default: () => ({})
            },
            // 字段描述，用来生成表单组件
            fields: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                submitLoading: false
            }
        },
        methods: {
            onSubmit() {
                let where = {}
                let filterForm = this.filterForm
                for(let field in filterForm){
                    let val = filterForm[field]
                    if (val !== '' && val !== null && val !== undefined){
                        where[field] = val
                    }
                }
                this.$emit('query',where)
            },
            // 组件方法
            isHideField(fieldName) {
                const hideFields = this.getConfig('hideFields', [])
                return !hideFields.some(item => {
                    return item === fieldName
                })
            },
            // 其他
            getConfig(configName, _default) {
                if (configName in this.filterConfig) {
                    return this.filterConfig[configName]
                } else {
                    return _default
                }
            }
        }
    }
</script>

<style scoped>
</style>
