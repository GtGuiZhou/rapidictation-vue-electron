<template>
    <el-input type="textarea"  :disabled="disabled" v-model="formData[field.name]" placeholder="请输入内容"></el-input>
</template>

<script>
    import fieldProps from './fieldProps'

    export default {
        name: "TextAreaField",
        props: {
            ...fieldProps
        },
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped>

</style>
