export default {
    field: {
        type: Object,
        default: () => ({
            name: '',
            comment: '',
            type: 'text'
        })
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    formData: {
        type: Object,
        default: () => ({})
    }
}
