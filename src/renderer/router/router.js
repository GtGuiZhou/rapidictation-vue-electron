// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = process.env.NODE_ENV === 'development'?file => require('@/pages/' + file).default:file => () => import('@/pages/' + file)

const sortRouter = (path, name = null, component = null) => {
    if (!component) {
        component = path.split('/:')[0]
    }
    if (!name) {
        name = component.replace(/\//g, "-")
    }
    return {
        name: name,
        path: '/' + path,
        component: require('@/pages/' + component).default
    }
}


export default [
    {
      path: '/',
      redirect: '/desktop'
    },
    {
        name:'admin-app',
        component:_import('AdminApp'),
        path: '/admin',
        redirect: '/admin/welcome',
        children: [
            {
                name:'admin-container',
                component:_import('admin/Container'),
                path: '/admin/container',
                redirect: '/admin/welcome',
                children: [
                    sortRouter('admin/welcome','welcome','admin/Welcome'),
                    sortRouter('admin/crud','crud','admin/Crud'),
                    sortRouter('admin/admin','admin','admin/Admin'),
                    sortRouter('admin/active_code','active_code','admin/ActiveCode'),
                    sortRouter('admin/word','word','admin/Word'),
                    sortRouter('admin/word_category','word_category','admin/WordCategory'),
                ]
            },
            sortRouter('admin/login','crud','admin/Login'),
        ]
    },


    {
        name:'desktop-app',
        component:_import('DesktopApp'),
        path: '/desktop',
        redirect: '/desktop/welcome',
        children: [
            sortRouter('desktop/listen_write','ListenWrite','desktop/ListenWrite'),
            sortRouter('desktop/word_book','WordBook','desktop/WordBook'),
            sortRouter('desktop/welcome','Welcome','desktop/Welcome'),
        ]
    },
    sortRouter('*','404','404')
]
