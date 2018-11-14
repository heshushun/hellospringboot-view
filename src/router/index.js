import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/**
 *  默认路由 什么权限都会加载
 * @type {*[]}
 */
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }

  /* ,
   {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    children: [{
      path: 'index',
      component: () => import('@/views/documentation/index'),
      name: 'documentation',
      meta: { title: 'documentation', icon: 'documentation', noCache: true }
    }]
  },*/

  /* {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [{
      path: 'index',
      component: () => import('@/views/guide/index'),
      name: 'guide',
      meta: { title: 'guide', icon: 'guide', noCache: true }
    }]
  }*/

]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

/**
 *  异步路由
 * @type {*[]}
 */
export const asyncRouterMap = [

  {
    path: '/task',
    component: Layout,
    redirect: '/task/taskList',
    name: 'task',
    meta: {
      title: 'task',
      icon: 'qq'
    },
    children: [
      { path: 'createTask', component: () => import('@/views/task/createTask'), name: 'createTask', meta: { title: 'createTask', icon: 'edit' }},
      { path: 'editTask/:id(\\d+)', component: () => import('@/views/task/editTask'), name: 'editTask', meta: { title: 'editTask', noCache: true }, hidden: true },
      { path: 'taskList', component: () => import('@/views/task/taskList'), name: 'taskList', meta: { title: 'taskList', icon: 'list' }}
    ]
  },

  {
    path: '/company',
    component: Layout,
    redirect: '/company/companyList',
    name: 'company',
    meta: {
      title: 'company',
      icon: 'tab'
    },
    children: [
      { path: 'companyList', component: () => import('@/views/company/companyList'), name: 'companyList', meta: { title: 'companyList', icon: 'list' }}
    ]
  },

  /* {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'page',
      component: () => import('@/views/permission/page'),
      name: 'pagePermission',
      meta: {
        title: 'pagePermission',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }, {
      path: 'directive',
      component: () => import('@/views/permission/directive'),
      name: 'directivePermission',
      meta: {
        title: 'directivePermission'
        // if do not set roles, means: this page does not require permission
      }
    }]
  },*/
  /* {
    path: '/icon',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/svg-icons/index'),
      name: 'icons',
      meta: { title: 'icons', icon: 'icon', noCache: true }
    }]
  },*/
  /* {
    path: '/components',
    component: Layout,
    redirect: 'noredirect',
    name: 'component-demo',
    meta: {
      title: 'components',
      icon: 'component'
    },
    children: [
      { path: 'tinymce', component: () => import('@/views/components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
      { path: 'markdown', component: () => import('@/views/components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
      { path: 'json-editor', component: () => import('@/views/components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
      { path: 'splitpane', component: () => import('@/views/components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }},
      { path: 'avatar-upload', component: () => import('@/views/components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
      { path: 'dropzone', component: () => import('@/views/components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }},
      { path: 'sticky', component: () => import('@/views/components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
      { path: 'count-to', component: () => import('@/views/components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }},
      { path: 'mixin', component: () => import('@/views/components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
      { path: 'back-to-top', component: () => import('@/views/components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }},
      { path: 'drag-dialog', component: () => import('@/views/components-demo/dragDialog'), name: 'dragDialog-demo', meta: { title: 'dragDialog' }},
      { path: 'dnd-list', component: () => import('@/views/components-demo/dndList'), name: 'dndList-demo', meta: { title: 'dndList' }},
      { path: 'drag-kanban', component: () => import('@/views/components-demo/dragKanban'), name: 'dragKanban-demo', meta: { title: 'dragKanban' }}
    ]
  },*/

  /* {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'charts',
    meta: {
      title: 'charts',
      icon: 'chart'
    },
    children: [
      { path: 'keyboard', component: () => import('@/views/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
      { path: 'line', component: () => import('@/views/charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
      { path: 'mixchart', component: () => import('@/views/charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
    ]
  },*/
  /* {
    path: '/tab',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/tab/index'),
      name: 'tab',
      meta: { title: 'tab', icon: 'tab' }
    }]
  },*/
  /* {
    path: '/table',
    component: Layout,
    redirect: '/table/complex-table',
    name: 'table',
    meta: {
      title: 'Table',
      icon: 'table'
    },
    children: [
      { path: 'dynamic-table', component: () => import('@/views/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
      { path: 'drag-table', component: () => import('@/views/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
      { path: 'inline-edit-table', component: () => import('@/views/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
      { path: 'tree-table', component: () => import('@/views/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
      { path: 'custom-tree-table', component: () => import('@/views/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: 'customTreeTable' }},
      { path: 'complex-table', component: () => import('@/views/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}
    ]
  },*/
  /* {
      path: '/example',
      component: Layout,
      redirect: '/example/list',
      name: 'example',
      meta: {
        title: 'example',
        icon: 'example'
      },
      children: [
        { path: 'create', component: () => import('@/views/example/create'), name: 'createArticle', meta: { title: 'createArticle', icon: 'edit' }},
        { path: 'edit/:id(\\d+)', component: () => import('@/views/example/edit'), name: 'editArticle', meta: { title: 'editArticle', noCache: true }, hidden: true },
        { path: 'list', component: () => import('@/views/example/list'), name: 'articleList', meta: { title: 'articleList', icon: 'list' }}
      ]
    },*/

  /* {
    path: '/news',
    component: Layout,
    redirect: '/news/newsList',
    name: 'news',
    meta: {
      title: 'news',
      icon: 'email'
    },
    children: [
      { path: 'createNews', component: () => import('@/views/news/createNews'), name: 'createNews', meta: { title: 'createNews', icon: 'edit' }},
      { path: 'editNews/:id(\\d+)', component: () => import('@/views/news/editNews'), name: 'editNews', meta: { title: 'editNews', noCache: true }, hidden: true },
      { path: 'newsList', component: () => import('@/views/news/newsList'), name: 'newsList', meta: { title: 'newsList', icon: 'list' }}
    ]
  },*/

  /* {
    path: '/notice',
    component: Layout,
    redirect: '/notice/noticeList',
    name: 'notice',
    meta: {
      title: 'notice',
      icon: 'chart'
    },
    children: [
      { path: 'createNotice', component: () => import('@/views/notice/createNotice'), name: 'createNotice', meta: { title: 'createNotice', icon: 'edit' }},
      { path: 'editNotice/:id(\\d+)', component: () => import('@/views/notice/editNotice'), name: 'editNotice', meta: { title: 'editNotice', noCache: true }, hidden: true },
      { path: 'noticeList', component: () => import('@/views/notice/noticeList'), name: 'noticeList', meta: { title: 'noticeList', icon: 'list' }}
    ]
  },*/

  /* {
    path: '/healthy',
    component: Layout,
    redirect: '/healthy/healthyList',
    name: 'healthy',
    meta: {
      title: 'healthy',
      icon: 'table'
    },
    children: [
      { path: 'createHealthy', component: () => import('@/views/healthy/createHealthy'), name: 'createHealthy', meta: { title: 'createHealthy', icon: 'edit' }},
      { path: 'editHealthy/:id(\\d+)', component: () => import('@/views/healthy/editHealthy'), name: 'editHealthy', meta: { title: 'editHealthy', noCache: true }, hidden: true },
      { path: 'healthyList', component: () => import('@/views/healthy/healthyList'), name: 'healthyList', meta: { title: 'healthyList', icon: 'list' }}
    ]
  },*/

  /* {
    path: '/section',
    component: Layout,
    redirect: '/section/sectionList',
    name: 'section',
    meta: {
      title: 'section',
      icon: 'component'
    },
    children: [
      { path: 'createSection', component: () => import('@/views/section/createSection'), name: 'createSection', meta: { title: 'createSection', icon: 'edit' }},
      { path: 'editSection/:id(\\d+)', component: () => import('@/views/section/editSection'), name: 'editSection', meta: { title: 'editSection', noCache: true }, hidden: true },
      { path: 'sectionList', component: () => import('@/views/section/sectionList'), name: 'sectionList', meta: { title: 'sectionList', icon: 'list' }}
    ]
  },*/

  /* {
    path: '/doctor',
    component: Layout,
    redirect: '/doctor/doctorList',
    name: 'doctor',
    meta: {
      title: 'doctor',
      icon: 'qq'
    },
    children: [
      { path: 'createDoctor', component: () => import('@/views/doctor/createDoctor'), name: 'createDoctor', meta: { title: 'createDoctor', icon: 'edit' }},
      { path: 'editDoctor/:id(\\d+)', component: () => import('@/views/doctor/editDoctor'), name: 'editDoctor', meta: { title: 'editDoctor', noCache: true }, hidden: true },
      { path: 'doctorList', component: () => import('@/views/doctor/doctorList'), name: 'doctorList', meta: { title: 'doctorList', icon: 'list' }}
    ]
  },*/

  /* {
    path: '/env',
    component: Layout,
    redirect: '/env/envList',
    name: 'env',
    meta: {
      title: 'env',
      icon: 'star'
    },
    children: [
      { path: 'createEnv', component: () => import('@/views/env/createEnv'), name: 'createEnv', meta: { title: 'createEnv', icon: 'edit' }},
      { path: 'editEnv/:id(\\d+)', component: () => import('@/views/env/editEnv'), name: 'editEnv', meta: { title: 'editEnv', noCache: true }, hidden: true },
      { path: 'envList', component: () => import('@/views/env/envList'), name: 'envList', meta: { title: 'envList', icon: 'list' }}
    ]
  },*/

  /* {
    path: '/banner',
    component: Layout,
    redirect: '/banner/bannerList',
    name: 'banner',
    meta: {
      title: 'banner',
      icon: 'bug'
    },
    children: [
      { path: 'createBanner', component: () => import('@/views/banner/createBanner'), name: 'createBanner', meta: { title: 'createBanner', icon: 'edit' }},
      // { path: 'editBanner/:id(\\d+)', component: () => import('@/views/banner/editBanner'), name: 'editBanner', meta: { title: 'editBanner', noCache: true }, hidden: true },
      { path: 'bannerList', component: () => import('@/views/banner/bannerList'), name: 'bannerList', meta: { title: 'bannerList', icon: 'list' }}
    ]
  },*/

  /*
  {
    path: '/order',
    component: Layout,
    redirect: '/order/orderList',
    name: 'order',
    meta: {
      title: 'order',
      icon: 'form'
    },
    children: [
      { path: 'orderList', component: () => import('@/views/order/orderList'), name: 'orderList', meta: { title: 'orderList', icon: 'list' }}
    ]
  },*/

  /* {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'errorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      { path: '401', component: () => import('@/views/errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
      { path: '404', component: () => import('@/views/errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
    ]
  },*/

  /* {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'log', component: () => import('@/views/errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
  },*/

  /* {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      { path: 'export-excel', component: () => import('@/views/excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
      { path: 'export-selected-excel', component: () => import('@/views/excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
      { path: 'upload-excel', component: () => import('@/views/excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
    ]
  },*/

  /* {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    meta: { title: 'zip', icon: 'zip' },
    children: [{ path: 'download', component: () => import('@/views/zip/index'), name: 'exportZip', meta: { title: 'exportZip' }}]
  },*/

  /* {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: () => import('@/views/theme/index'), name: 'theme', meta: { title: 'theme', icon: 'theme' }}]
  },*/

  /* {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: () => import('@/views/clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
  },*/

  /* {
    path: '/i18n',
    component: Layout,
    children: [{ path: 'index', component: () => import('@/views/i18n-demo/index'), name: 'i18n', meta: { title: 'i18n', icon: 'international' }}]
  },*/

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
