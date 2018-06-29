exports.config = {
  password: 'watasi_password_secret'
}

exports.db = {
  url: 'mongodb://localhost:27017/blog'
}

exports.jwtConf = {
  secret: 'watasi_secret_base',
  exp: Math.floor(Date.now() / 1000) + (60 * 60), // 60 seconds * 60 minutes = 1 hour
}