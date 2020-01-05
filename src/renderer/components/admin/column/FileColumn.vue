<template>
    <viewer :images="images" style="display: flex;justify-content: left;margin: 10px 0">
        <div v-for="url in images"
             :key="url"
             :style="{width:config.imgWidth,height:config.imgHeight,position: 'relative',lineHeight:'0',marginRight:'5px'}">
            <img :src="config.model === 'image'?url:fileIcon">
        </div>
    </viewer>
</template>

<script>
    import FileIcon from '../../../assets/file-field-icon.png'
    import fieldProps from './columnProps'

    export default {
        name: "FileColumn",
        props: {
            ...fieldProps
        },
        data() {
            return {
                fileList: [],
                fileIcon: FileIcon,
                uploadBtnLoading: false
            }
        },
        computed: {
            images () {
                let image = this.row[this.field.name]
                if (image){
                    return image(',')
                } else {
                    return  []
                }
            },
            config() {
                let _default = {
                    imgWidth: '80px',
                    imgHeight: '80px',
                    mode: 'file',
                }
                for (let key in this.field) {
                    _default[key] = this.field[key]
                }
                return _default
            }
        },
        methods: {
        }
    }
</script>

<style scoped>
    .cross {
        position: absolute;
        right: 2px;
        top: 2px;
    }
</style>
