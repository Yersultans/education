const config = require('../config')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const { SECRET_ACCESS_KEY, ACCESS_KEY_ID, BUCKET_NAME, REGION } = config.s3
const s3url =
  'https://explorerpass-submission-assets.s3.ap-southeast-1.amazonaws.com/'

aws.config.update({
  endpoint: s3url,
  s3ForcePathStyle: true,
  secretAccessKey: SECRET_ACCESS_KEY,
  accessKeyId: ACCESS_KEY_ID,
  region: REGION,
  s3BucketEndpoint: true
})

const s3 = new aws.S3({ params: { Bucket: BUCKET_NAME } })

const upload = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key(req, file, cb) {
      const today = new Date()
      const day = today.getDate()
      const month = today.getMonth()
      const second = today.getSeconds()
      const fileName = `${req.query.projectName}/${req.query.userName}_${day}_${month}_${second}`
      cb(null, fileName)
    }
  })
})

module.exports = {
  upload
}
