import DateTimeField from "./DateTimeField";
import TextField from "./TextField";
import fieldProps from './fieldProps'
import FileField from "./FileField";
import SelectField from "./SelectField";
import RadioField from "./RadioField";
import TextAreaField from "./TextAreaField";
import NumberField from "./NumberField";

export default {
    props: {
        ...fieldProps
    },
    data: () => ({
        componentsMap: {
            'text': TextField, // 这个一定不要删除，默认情况下为该组件
            'datetime': DateTimeField,
            'file' : FileField,
            'select': SelectField,
            'radio': RadioField,
            'textarea': TextAreaField,
            'number' : NumberField
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
        for (let propKey in fieldProps){
            props[propKey] = this[propKey]
        }
        return createElement(component, {
            props: props
        }, this.$slots.default)
    }
}
