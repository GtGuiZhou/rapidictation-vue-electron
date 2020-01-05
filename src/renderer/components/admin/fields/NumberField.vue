<template>
    <el-input-number  :disabled="disabled" v-model="formData[field.name]" placeholder="请输入内容"></el-input-number>
</template>

<script>
    import fieldProps from './fieldProps'

    export default {
        name: "NumberField",
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
