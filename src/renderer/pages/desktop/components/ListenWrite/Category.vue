<template>
    <div>
        <div>
            <div class="files">
                <div v-for="(level,index) in category.children" :key="index" @click="openLevel(level)">
                    <el-tooltip class="item" effect="dark" :content="level.name" placement="bottom-end">
                        <el-card :class="read(level)?'readborder':'unreadborder'" class="all-center">
                            <i class="iconfont icon-qizi-copy" style="font-size: 32px"/>
                            <br>
                            <br>
                            <label style="white-space: nowrap;">{{level.name.substr(0,8)}}</label>
                        </el-card>
                    </el-tooltip>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Category",
        props: {
            category: {
                type: Object,
                required: true
            }
        },
        data() {
            return {}
        },
        methods: {
            openLevel(level){
                let key = this.category.name + '-' +level.name
                localStorage.setItem(key, 1)
                this.$emit('play', level)
            },

            read(level) {
                let key = this.category.name + '-' +level.name
                return !!localStorage.getItem(key)
            }
        }
    }
</script>

<style scoped>
    .files {
        cursor: pointer;
        display: flex;
        justify-content: start;
        flex-flow: row wrap;
    }

    .files .item {
        width: 150px;
        height: 120px;
        text-align: center;
        margin: 5px;
        font-weight: bold;
        font-size: 0.8rem;
    }

    .files .item label {
        overflow: hidden;
    }

    .files .item i {
        margin: 10px;
    }

    .unreadborder {
        color: gray;
    }

    .readborder {
        color: #67C23A;
    }
</style>
