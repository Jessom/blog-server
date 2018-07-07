const Administrator = require('../models/Schema/Administrator')
const Validator = require('../utils/valid')
const md5 = require('md5')
const jsonwebtoken = require('jsonwebtoken')
const { config, jwtConf } = require('../config')

class Auth {
  static async register(ctx) {
    const { body } = ctx.request
    // 验证数据的合法性
    let validator = new Validator()
    validator.add(body.account, [{ strategy: 'isNonEmpty', errorMsg: '账号不能为空' },{ strategy: 'isEmail', errorMsg: '请输入合法的邮箱地址' }])
    validator.add(body.password, [{ strategy: 'isNonEmpty', errorMsg: '密码不能为空' },{ strategy: 'isPassword', errorMsg: '密码为8至18位字符' }])
    validator.add(body.name, [{ strategy: 'isNonEmpty', errorMsg: '用户名不能为空' }])
    let validErr = validator.start()
    validator = null
    if(validErr) {
      ctx.status = 400
      ctx.body = { msg: validErr }
      return
    }

    try {
      // 密码加密
      body.password = md5(md5(body.password+config.password))
      let d = await Administrator.findOne({ account: body.account })
      if(d) {
        ctx.status = 406
        ctx.body = { msg: '账号已存在' }
      } else {
        let admin = new Administrator(body)
        await admin.save()
        ctx.status = 200
        ctx.body = {
          msg: '注册成功',
          account: body.account,
          name: body.name,
          token: jsonwebtoken.sign({
            account: body.account,
            name: body.name,
            exp: jwtConf.exp
          }, jwtConf.secret)
        }
        admin = null
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

  static async login(ctx) {
    const { body } = ctx.request
    // 验证数据的合法性
    let validator = new Validator()
    validator.add(body.account, [{ strategy: 'isNonEmpty', errorMsg: '账号不能为空' },{ strategy: 'isEmail', errorMsg: '请输入合法的邮箱地址' }])
    validator.add(body.password, [{ strategy: 'isNonEmpty', errorMsg: '密码不能为空' },{ strategy: 'isPassword', errorMsg: '密码为8至18位字符' }])
    let validErr = validator.start()
    validator = null
    if(validErr) {
      ctx.status = 400
      ctx.body = { msg: validErr }
      return
    }

    try {
      const user = await Administrator.findOne({ account: body.account })
      if(!user) {
        ctx.status = 400
        ctx.body = { msg: '账号不存在' }
        return
      }
      // 比对密码是否正确
      if(user.password === md5(md5(body.password + config.password))) {
        if(!user.status) {
          ctx.status = 400
          ctx.body = { msg: '您的账号已被禁用，请联系超级管理员' }
          return
        }

        await user.update({ lastTime: Date.now() })
        ctx.status = 200
        ctx.body = {
          msg: '登录成功',
          account: user.account,
          name: user.name,
          id: user._id,
          token: jsonwebtoken.sign({
            account: user.account,
            name: user.name,
            id: user._id,
            exp: jwtConf.exp
          }, jwtConf.secret)
        }
      } else {
        ctx.status = 401
        ctx.body = { msg: '密码或账号错误' }
      }
    } catch (error) {
      ctx.throw(500)
    }
  }
}

module.exports = Auth