const router = require('koa-router')()
const Auth = require('../../controller/Auth')
const Article = require('../../controller/Article')
router.prefix('/v1')

// 用户
router.post('/register', Auth.register)
router.post('/login', Auth.login)

// 文章
router.post('/article', Article.add)
router.delete('/article', Article.delete)
router.put('/article', Article.update)
router.get('/article/:id', Article.gain)

router.get('/', async (ctx) => {
  ctx.body = 'hello'
})

module.exports = router
