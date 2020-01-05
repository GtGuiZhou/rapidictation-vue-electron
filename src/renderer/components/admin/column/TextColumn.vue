<template>
    <span>{{row[field.name]}}</span>
</template>

<script>
    import fieldProps from './columnProps'

    export default {
        name: "TextColumn",
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
