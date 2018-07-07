const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const db = require('./models/db')
const tokenValid = require('./middleware/TokenValid')
const ErrorRouter = require('./middleware/ErrorRouter')
// const { jwtConf } = require('./config')
// const jwt = require('koa-jwt')

const basic = require('./routes/basic')
const index = require('./routes/v1/index')

// error handler
onerror(app)

// middlewares
/* app.use(jwt({ secret: jwtConf.secret }).unless({
  path: [
    /\/register/, 
    /\/login/
  ]
})) */
app.use(ErrorRouter)
app.use(tokenValid)
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(basic.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
