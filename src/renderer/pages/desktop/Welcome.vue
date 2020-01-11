<template>
    <full-parent class="all-center">
        <div class="category">
            <router-link to="/desktop/listen_write" style="text-decoration: none">
                <el-card class="item">
                    <div style="text-align: center">
                        <img src="../../assets/listen_write.png">
                        <h1 >单词听写</h1>
                    </div>
                </el-card>
            </router-link>

            <router-link to="/desktop/word_book" style="text-decoration: none">
                <el-card class="item">
                    <div style="text-align: center">
                        <img  src="../../assets/word_book.png">
                        <h1>单词本</h1>
                    </div>
                </el-card>
            </router-link>
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
        methods: {}
    }
</script>

<style scoped>
    .category {
        display: flex;
    }

    .category .item {
        width: 300px;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px;
        color: #67C23A;
        cursor: pointer;
    }

    .category .item:hover {
        transform: scale(1.1);
    }



    .category .item i {
        font-size: 64px;
    }
</style>
