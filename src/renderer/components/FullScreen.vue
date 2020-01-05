<template>
    <div id="fullscreen">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "FullScreen",
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped>
 #fullscreen{
     position: fixed;
    bottom: 0;
     left: 0;
     right: 0;
     top: 0;
 }
</style>
