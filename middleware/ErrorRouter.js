module.exports = (ctx, next) => {
  return next().catch(err => {
    switch (err.status) {
      case 401:
        ctx.status = 401
        ctx.body = {
          msg: err.originalError ? err.originalError.message : err.message
        }
        break
      case 500:
        ctx.status = 500
        ctx.body = {
          msg: '服务端错误'
        }
      default:
        throw err
    }
  })
}