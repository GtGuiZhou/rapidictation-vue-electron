<template>
    <div id="fullparent">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "FullParent",
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped>
    #fullparent{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        right: 0;
    }
</style>
