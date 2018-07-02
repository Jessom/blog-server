const qiniuConf = require('../config/qiniu.conf')
const qiniu = require('qiniu')

/**
 * 上传至七牛云
 * @param {*} filePath 
 * @param {*} key 
 */
const uptoQiniu = (filePath, key) => {
  const accessKey = qiniuConf.accessKey
  const secretKey = qiniuConf.secretKey
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

  const options = { scope: qiniuConf.scope }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)

  // 空间对应的机房
  const config = new qiniu.conf.Config()
  config.zone = qiniu.zone.Zone_z0  // 华东地区
  const localFile = filePath
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()

  // 文件上传
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr, respBody, respInfo) => {
      if(respErr) {
        reject(respErr)
      }
      if(respInfo.statusCode == 200) {
        resolve(respBody)
      } else {
        resolve(respBody)
      }
    })
  })
}

module.exports = {
  uptoQiniu
}
