<template>
    <div>{{value}}</div>
</template>

<script>
    import fieldProps from './columnProps'

    export default {
        name: "RadioColumn",
        props: {
            ...fieldProps
        },
        data() {
            return {}
        },
        computed: {
            value () {
                let _default = this.row[this.field.name]
                let item = this.options.find(item => {
                    return item[this.valueName] === _default
                })
                if (item) _default = item[this.labelName]
                return _default
            },

            options() {
                return this.field.options ? this.field.options : []
            },
            labelName(){
                return this.field.labelName ? this.field.labelName : 'label'
            },
            valueName(){
                return this.field.valueName ? this.field.valueName : 'value'
            }
        },
        methods: {}
    }
</script>

<style scoped>

</style>
