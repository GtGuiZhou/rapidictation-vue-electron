export default {
    field: {
        type: Object,
        default: () => ({
            name: '',
            comment: '',
            type: 'text'
        })
    },
    row: {
        type: Object,
        default: () => ({})
    }
}
