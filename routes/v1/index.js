const router = require('koa-router')()
const Auth = require('../../controller/Auth')
router.prefix('/v1')

// 注册新用户
router.post('/register', Auth.register)
router.post('/login', Auth.login)

router.get('/', async (ctx) => {
  ctx.body = 'hello'
})

module.exports = router
