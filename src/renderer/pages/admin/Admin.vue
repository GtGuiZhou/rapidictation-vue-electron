<template>
    <div>
        <crud-index :base-url="baseUrl" :insert-form="insertForm" :edit-form="editForm" :filter="filter" :table="table" :fields="fields"></crud-index>
    </div>
</template>

<script>
    import CrudIndex from "../../components/admin/CrudIndex";
    export default {
        name: "Admin",
        components: {CrudIndex},
        data() {
            return {
                baseUrl: '/admin/admins',
                filter: {
                    hideFields: ['password','create_time']
                },
                table: {
                    hideFields: ['password']
                },
                insertForm: {
                    hideFields: ['create_time']
                },
                editForm: {
                    hideFields: ['create_time']
                },
                fields: [
                    {name: 'username',comment: '用户名',validate: [{required: true,message: '用户名不能为空'}]},
                    {name: 'password',comment: '密码',validate: [{required: true,message: '密码不能为空'}]},
                    {name: 'create_time',comment: '创建时间'},
                ]
            }
        },
        methods: {}
    }
</script>

<style scoped>

</style>
