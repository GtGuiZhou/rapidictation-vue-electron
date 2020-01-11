<template>
    <full-parent class="all-center">
        <div style="text-align: center">
            <div class="welcome">欢迎使⽤ Rapidictation 听词软件 </div>
<!--            <div class="author">-->
<!--                <small >Power By GtGuiZhou</small><br>-->
<!--                <small > Copyright ©  2019 GtGuiZhou. All Rights Reserved. GtGuiZhou 版权所有 </small>-->
<!--            </div>-->
        </div>
    </full-parent>
</template>

<script>

    import FullParent from "../../components/FullParent";
    export default {
        name: "Welcome",
        components: {FullParent},
        data() {
            return {}
        },
        methods: {

        }
    }
</script>

<style scoped>
    .welcome{
        color: black;
        font-size: 64px;
    }

    .author{
        color: gray;
    }
</style>
