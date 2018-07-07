const router = require('koa-router')()
const Auth = require('../../controller/Auth')
const Article = require('../../controller/Article')
const Admin = require('../../controller/Admin')
const Basic = require('../../controller/Basic')
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

router.post('/upload', Basic.upload)

router.get('/', async (ctx) => {
  ctx.body = 'hello'
})

module.exports = router
