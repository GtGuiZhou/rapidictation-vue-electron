<template>
    <div>

    </div>
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
