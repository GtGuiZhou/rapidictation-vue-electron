<template>
    <full-screen>
        <el-container style="width: 100%;height: 100%">
            <el-container>
                <el-aside width="200px" class="aside" style="border-right: solid 1px #e6e6e6;">
                    <el-menu :default-active="selectCategory.name" style="border: 0">
                        <el-menu-item v-for="menu in categories" :index="menu.name" :key="menu.name"  @click="openCategory(menu)">
                            <div style="text-align: center">{{menu.name}}</div>
                        </el-menu-item>
                    </el-menu>
                </el-aside>

                <el-main class="main">
                    <category v-if="module === 'category'" :category="selectCategory" @play="openWords"></category>
                    <words v-if="module === 'words'" :category="selectCategory" :level="selectLevel" ></words>
                </el-main>
            </el-container>
        </el-container>
    </full-screen>
</template>

<script>
    import FullScreen from "../../components/FullScreen";
    import Category from "./components/ListenWrite/Category";
    import Words from "./components/ListenWrite/Words";

    export default {
        name: "Index",
        components: {Words, Category, FullScreen},
        data() {
            return {
                module: 'category',
                categories: [],
                selectCategory: {},
                selectLevel: {}
            }
        },

        mounted(){
            this.$http.get('/user/word_categories').then(
                res => {
                    this.categories = res
                    if (this.categories.length > 0){
                        this.selectCategory = this.categories[0]
                    }
                }
            )
        },

        methods: {
            openCategory (category) {
                this.selectCategory = category
                this.module = 'category'
            },

            openWords(level){
                this.module = 'words'
                this.selectLevel = level
            }
        }
    }
</script>

<style scoped>

    .main {
        padding: 0;
        position: relative;
    }
</style>
