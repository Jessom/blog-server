const jsonwebtoken = require('jsonwebtoken')
const { jwtConf } = require('../config')
const exclude = ['/v1/register', '/v1/login', '/v1/article']

module.exports = async (ctx, next) => {
  const token = ctx.header.authorization
  if(token) {
    const payload = jsonwebtoken.verify(token, jwtConf.secret)
    console.log(payload)
  } else if(exclude.includes(ctx.request.url)) {
    await next()
  } else {
    ctx.status = 403
    ctx.body = { code: 403, msg: '您没权限' }
  }
}