<template>
    <el-tree :data="options" :props="defaultProps" @node-click="nodeClick"></el-tree>
</template>

<script>
    import fieldProps from './fieldProps'
    export default {
        name: "CategoryField",
        props: {
            ...fieldProps
        },
        data() {
            return {}
        },
        computed: {
            options() {
                return this.field.options ? this.field.options : []
            },
            defaultProps() {
                return {
                    children: this.field.childrenName ? this.field.childrenName : 'children',
                    label: this.field.labelName ? this.field.labelName : 'label'
                }
            },
            // 主键名称
            // 通过该主键名称设定表单数据
            pkName () {
                return 'pkName' in this.field?this.field.pkName:'id'
            }
        },
        methods: {
            nodeClick(node){
                this.formData[this.field.name] = node[this.pkName]
            }
        }
    }
</script>

<style scoped>

</style>
