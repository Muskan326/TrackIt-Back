const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
dotenv.config();

aws.config.update({
  secretAccessKey: '',
  accessKeyId: '',
  region: 'ap-south-1' 
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
     cb(null, true);
  } 


//Uploading File to bucket
const upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: '',
    key: function(req, file, cb) {
      /*I'm using Date.now() to make sure my file has a unique name*/
      req.file = Date.now() + file.originalname;
      cb(null, Date.now() + file.originalname);
    }
  })
});



module.exports = upload;
