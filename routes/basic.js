const router = require('koa-router')()
const Basic = require('../controller/Basic')
router.prefix('/basic')

router.post('/upload', Basic.upload)

module.exports = router