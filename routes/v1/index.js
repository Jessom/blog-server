const router = require('koa-router')()
const Auth = require('../../controller/Auth')
const Article = require('../../controller/Article')
const Admin = require('../../controller/Admin')
// const Basic = require('../../controller/Basic')
const Site = require('../../controller/Site')
router.prefix('/v1')

// 用户
router.post('/register', Auth.register)
router.post('/login', Auth.login)

// 文章
router.post('/article', Article.add)
router.delete('/article', Article.delete)
router.put('/article', Article.update)
router.get('/article/:id', Article.gain)

// 管理员
router.post('/admin', Admin.add)
router.delete('/admin/:id', Admin.delete)
router.put('/admin', Admin.able)
router.get('/admin', Admin.getAll)

// 上传图片
// router.post('/upload', Basic.upload)

// 站点设置
router.post('/site', Site.add)
router.put('/site', Site.update)
router.get('/site', Site.agni)
router.post('/logo', Site.logo)

router.get('/', async (ctx) => {
  ctx.body = 'hello'
})

module.exports = router
