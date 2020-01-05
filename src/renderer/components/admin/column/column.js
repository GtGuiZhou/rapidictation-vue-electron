import TextColumn from "./TextColumn";
import columnProps from './columnProps'
import FileColumn from "./FileColumn";
import RadioColumn from "./RadioColumn";
import SelectColumn from "./SelectColumn";

export default {
    props: {
        ...columnProps
    },
    data: () => ({
        componentsMap: {
            'text': TextColumn, // 这个一定不要删除，默认情况下为该组件
            'file' : FileColumn,
            'radio': RadioColumn,
            'select': SelectColumn
        },
    }),
    render: function (createElement) {
        let type = this.field.type
        type = type ? type : 'text'
        let component
        if (type in this.componentsMap) {
            component = this.componentsMap[type]
        } else {
            component = this.componentsMap['text']
        }
        let props = {}
        for (let propKey in columnProps){
            props[propKey] = this[propKey]
        }
        return createElement(component, {
            props: props
        }, this.$slots.default)
    }
}
