<template>
    <el-input  :disabled="disabled" v-model="formData[field.name]" placeholder="请输入内容"></el-input>
</template>

<script>
    import fieldProps from './fieldProps'

    export default {
        name: "TextField",
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
