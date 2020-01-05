<template>
    <full-screen>
        <el-container style="width: 100%;height: 100%">
            <el-header class="header between">
                <router-link to="/admin/welcome" class="title"><i class="el-icon-cold-drink"></i>SuperCrud</router-link>

                <div class="toolbar">
                    <!--                    全屏-->
                    <i class="el-icon-full-screen" @click="toggleFullScreen"></i>
                    <!--                    日志-->
                    <i class="el-icon-tickets"></i>
                    <el-dropdown style="cursor: pointer">
                        <div>
                            你好， {{$store.state.user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item ><span @click="logout">退出登录</span></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px" class="aside" style="border-right: solid 1px #e6e6e6;">
                    <el-menu :default-active="$route.path" style="border: 0">
                        <template v-for="menu in menuList">
                            <el-submenu :index="menu.url" v-if="menu.sub_menu.length > 0" :key="menu.url">
                                <template slot="title">
                                    <i :class="menu.icon" v-if="menu.icon"></i>
                                    <span slot="title">{{menu.name}}</span>
                                </template>
                                <el-menu-item v-for="subMenu in menu.sub_menu" :index="subMenu.url"
                                              :key="subMenu.url" @click="$router.push(subMenu.url)">
                                    <i :class="subMenu.icon" v-if="subMenu.icon"></i>
                                    <span slot="title">{{subMenu.name}}</span>
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item :index="menu.url" :key="menu.url" v-else @click="$router.push(menu.url)">
                                <i :class="menu.icon" v-if="menu.icon"></i>
                                {{menu.name}}
                            </el-menu-item>
                        </template>
                    </el-menu>
                </el-aside>


                <el-main class="main">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </full-screen>
</template>

<script>
    import FullScreen from "../../components/FullScreen";

    export default {
        name: "Container",
        components: {FullScreen},
        data() {
            return {
                menuList: [
                    {'icon': 'el-icon-user-solid', 'name': '管理员管理', url: '/admin/admin', sub_menu: []},
                    // {'icon': 'el-icon-user', 'name': '用户管理', url: '/admin/user', sub_menu: []},
                    {'icon': 'el-icon-star-on', 'name': '激活码管理', url: '/admin/active_code', sub_menu: []},
                    {'icon': 'el-icon-s-opportunity', 'name': '单词管理', url: '/admin/word', sub_menu: []},
                    {'icon': 'el-icon-menu', 'name': '单词分类管理', url: '/admin/word_category', sub_menu: []},
                    {'icon': 'el-icon-back', 'name': '返回', url: '/desktop', sub_menu: []},
                ]
            }
        },

        methods: {
            async logout(){
                await this.$http.put('/admin/admins/logout')
                this.$router.replace('/admin/login')
            },
            toggleFullScreen() {
                if (!document.fullscreenElement &&
                    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    } else if (document.documentElement.msRequestFullscreen) {
                        document.documentElement.msRequestFullscreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullscreen) {
                        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
            }

        }
    }
</script>

<style scoped>
    .header {
        border-bottom: 1px solid #e6e6e6;
    }

    .header .title {
        color: black;
        padding: 10px;
        font-weight: bold;
        font-size: 20px;
        text-decoration: none;
    }

    .header .toolbar {
        padding: 10px;
    }

    .header .toolbar i {
        cursor: pointer;
        padding: 0 10px;
        font-weight: bold;
    }


    .main {
        padding: 0;
        position: relative;
    }
</style>
