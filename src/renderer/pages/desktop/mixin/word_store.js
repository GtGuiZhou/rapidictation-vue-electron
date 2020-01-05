export default {
    data() {
        return {
            localWords: [],
            selectCategory: {},
            selectWord: null,
        }
    },
    watch: {
        localWords: {
            handler(val) {
                window.console.log(val)
                localStorage.setItem('localWords', JSON.stringify(val))
            },
            deep: true
        }
    },
    mounted() {
        try {
            this.localWords = JSON.parse(localStorage.getItem('localWords'))
            this.localWords = this.localWords.map(category => {
                category.words = category.words.map(word => {
                    window.console.log(word)
                    if (!(word.ts_info instanceof Object)) {
                        word.ts_info = JSON.parse(word.ts_info)
                    }
                    return word
                })

                return category
            })
        } catch (e) {
            window.console.log(e)
            this.localWords = []
        }
    },
    methods: {
        enterInputCategory(categoryName) {
            if (this.localWords.find(item => item.name === categoryName)) {
                this.$notify.warning('该分类名称已经存在')
                return
            }

            this.localWords.push({name: categoryName, words: [], checked: false})

            this.inputCategory = ''
            this.visualNewCategory = false
        },

        async insertWord(word) {
            if (!(word.ts_info instanceof Object)){
                word.ts_info = JSON.parse(word.ts_info)
            }
            if (  this.selectCategory.words.find(item => item.id === word.id)) {
                this.$notify.warning('该分类已经存在该单词')
                return
            }

            this.selectCategory.words.push(word)
        },

        deleteCategory(index) {
            this.$confirm('您确定删除：' + this.localWords[index].name + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.localWords.splice(index, 1)
            })
        },

    }
}


