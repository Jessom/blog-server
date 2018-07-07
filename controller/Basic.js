const path = require('path')
const fs = require('fs')
const qiniu = require('../utils/qiniu.util')
const Busboy = require('busboy')

// 删除文件
const removeTemImage = async path => {
  try {
    await fs.unlink(path)
  } catch (error) {
    throw error
  }
}

// 写入
const mkdirsSync = dirname => {
  if(fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
  return false
}

const getSuffix = (fileName) => {
  return fileName.split('.').pop()
}

// 重命名
const Rename = (fileName) => {
  return Math.random().toString(16).substr(2) + '.' + getSuffix(fileName)
}

// 上传至本地
const uploadFile = (ctx, options) => {
  // https://segmentfault.com/a/1190000010398718
  const _emmiter = new Busboy({ headers: ctx.request.headers })
  const fileType = options.fileType
  const filePath = path.join(options.path, fileType)
  const confirm = mkdirsSync(filePath)
  if(!confirm) { return }

  console.log('start uploading...')
  return new Promise((resolve, reject) => {
    _emmiter.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const fileName = Rename(filename)
      const saveTo = path.join(path.join(filePath, fileName))
      file.pipe(fs.createWriteStream(saveTo))
      file.on('end', () => {
        resolve({
          imgPath: `/${fileType}/${fileName}`,
          imgKey: fileName
        })
      })
    })

    _emmiter.on('finish', function () {
      console.log('finished...')
    })

    _emmiter.on('error', function (err) {
      console.log('err...')
      reject(err)
    })

    ctx.req.pipe(_emmiter)
  })
}

class Basic {
  static async upload(ctx) {
    try {
      const data = new Date()
      const serverPath = path.join(__dirname, `../uploads/`)
      const result = await uploadFile(ctx, { fileType: 'album', path: serverPath })
      const imgPath = path.join(serverPath, result.imgPath)
      const q = await qiniu.uptoQiniu(imgPath, `uploads/${data.getFullYear()}/${data.getMonth() + 1}-${data.getDate()}/${result.imgKey}`)
      removeTemImage(imgPath)
      ctx.status = 200
      ctx.body = {
        code: 200,
        msg: '上传成功',
        url: `http://p94agf1t4.bkt.clouddn.com/${q.key}`,
        imgPath
      }
    } catch (error) {
      ctx.throw(500)
    }
  }
}

module.exports = Basic