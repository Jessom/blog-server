class Users {
  // 用户注册
  static async register(ctx) {
    const { body } = ctx.request
    ctx.body = body
  }
}

module.exports = Users