<template>
    <div>
        <crud-index :filter="filter" :table="table" :fields="fields"></crud-index>
    </div>
</template>

<script>
    import CrudIndex from "../../components/admin/CrudIndex";
    export default {
        name: "crud",
        components: {CrudIndex},
        data() {
            return {
                filter: {
                    hideFields: ['avatar']
                },
                table: {
                    baseUrl: '/crud'
                },
                fields: [
                    {name: 'avatar',comment: '头像',type: 'file',mode: 'image'},
                    {name: 'date',type: 'datetime',comment:'日期'},
                    {name: 'name',comment:'名字'},
                    {name: 'address',comment: '地址'},
                ]
            }
        },
        methods: {}
    }
</script>

<style scoped>

</style>
