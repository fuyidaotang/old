const chooseCate = resolve => require(['./views/chooseCate.vue'], resolve);
const submitGoods = resolve => require(['./views/submitGoods.vue'], resolve);
const goodsManager = resolve => require(['./views/goodsManager.vue'], resolve);
const orderManager = resolve => require(['./views/orderManager.vue'], resolve);
const commentManager = resolve => require(['./views/commentManager.vue'], resolve);
const chartsShare = resolve => require(['./views/chartsShare.vue'], resolve);
const columnManager = resolve => require(['./views/columnManager.vue'], resolve);
const childAccount = resolve => require(['./views/childAccount.vue'], resolve);
const realShop = resolve => require(['./views/realShop.vue'], resolve);
const submitAttribute = resolve => require(['./views/submitAttribute.vue'], resolve);
const attributeManager = resolve => require(['./views/attributeManager.vue'], resolve);
const liveManager = resolve => require(['./views/liveManager.vue'], resolve);

const shopTemplate = resolve => require(['./views/shopTemplate.vue'], resolve);
const goodsTemplate = resolve => require(['./views/goodsTemplate.vue'], resolve);
const expressTemplate = resolve => require(['./views/expressTemplate.vue'], resolve);
const myAddress = resolve => require(['./views/myAddress.vue'], resolve);
const orderPrint = resolve => require(['./views/orderPrint.vue'], resolve);
const expressOrder = resolve => require(['./views/addExpressOrder.vue'], resolve);
const addModel = resolve => require(['./views/addModel.vue'], resolve);
const printOrder = resolve => require(['./views/printOrder.vue'], resolve);
const routes = [{
  path:"/shopTemplate",
  component:shopTemplate,
  meta: { requiresAuth: true }
},{
  path:"/goodsTemplate",
  component:goodsTemplate,
  meta: { requiresAuth: true }
},{
  path:"/expressTemplate",
  component:expressTemplate,
  meta: { requiresAuth: true }
},{
  path:"/myAddress",
  component:myAddress,
  meta: { requiresAuth: true }
},{
    path:"/",
    component:chooseCate,
    meta: { requiresAuth: true }
},{
    path:"/chooseCate/:state",
    component:chooseCate,
    meta: { requiresAuth: true }
},{
    path: '/submitGoods/:categoryCode',
    component: submitGoods,
    meta: { requiresAuth: true }
},{
    path: '/goodsManager/:goodsStatus',
    component: goodsManager,
    meta: { requiresAuth: true }
},{
    path: '/goodsManager',
    component: goodsManager,
    meta: { requiresAuth: true }
},{
    path: '/orderManager/:orderStatus',
    component: orderManager,
    meta: { requiresAuth: true }
}, {
    path: '/commentManager',
    component: commentManager,
    meta: { requiresAuth: true }
},{
    path: '/columnManager',
    component: columnManager,
    meta: { requiresAuth: true }
},{
    path: '/childAccount',
    component: childAccount,
    meta: { requiresAuth: true }
},{
    path: '/realShop',
    component: realShop,
    meta: { requiresAuth: true }
},{
    path: '/submitAttribute/:categoryCode',
    component: submitAttribute,
    meta: { requiresAuth: true }
},{
    path: '/attributeManager',
    component: attributeManager,
    meta: { requiresAuth: true }
},{
    path: '/chartsShare',
    component: chartsShare,
    meta: { requiresAuth: true }
},{
  path: '/liveManager',
  component: liveManager,
  meta: { requiresAuth: true }
},{
    path:"/orderPrint",
    name:'orderPrint',
    component:orderPrint,
    meta: { requiresAuth: true }
},{
    path:"/addModel",
    name:'addModel',
    component:addModel,
    meta: { requiresAuth: true }
},{
    path:"/printOrder",
    name:'printOrder',
    component:printOrder,
    meta: { requiresAuth: true }
},{
    path:"/expressOrder",
    name:'expressOrder',
    component:expressOrder,
    meta: { requiresAuth: true }
}]

export default routes;