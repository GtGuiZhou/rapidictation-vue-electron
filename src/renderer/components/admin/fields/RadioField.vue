<template>
    <div>
        <el-radio :disabled="disabled" v-model="value" :label="item[valueName]" v-for="item in options" :key="item[valueName]">{{item[labelName]}}</el-radio>
    </div>
</template>

<script>
    import fieldProps from './fieldProps'

    export default {
        name: "SelectField",
        props: {
            ...fieldProps
        },
        data() {
            return {}
        },
        computed: {
            value: {
                get() {
                    return this.formData[this.field.name]
                },
                set(val) {
                    this.formData[this.field.name] = val
                }
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
