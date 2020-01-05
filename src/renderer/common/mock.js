import Mock from 'mockjs'
Mock.setup({
    timeout: '200-600'
})

Mock.mock(/\/crud\/page\/\d+\/size\/\d+/,'get',{
    "data" : {
        "total|1-1000": 100,
        "data|10": [{
            "id|1-1000": 100,
            name: '@cname',
            avatar: '@cname',
            address: '@county(true)',
            date: '@date("yyyy-MM-dd h:m:s")'
        }]
    },
})


export default Mock
