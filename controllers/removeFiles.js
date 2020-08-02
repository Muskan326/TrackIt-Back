const aws = require('aws-sdk');
const dotenv = require('dotenv');
const response=require('./../libs/responseLib')
dotenv.config();

aws.config.update({
  secretAccessKey: '',
  accessKeyId: '',
  region: 'ap-south-1' //E.g us-east-1
});

const s3 = new aws.S3();


//remove an Attachment
let deleteFile=(req,res)=>{
    
    var params = {
      Bucket: '', 
      Key: req.body.key
    };
    s3.deleteObject(params, function(err, data) {
      if (err){
        let apiresponse=response.generate(true,403,'File Not Deleted',err)
        res.send(apiresponse)
      }// an error occurred
      else{
        let apiresponse=response.generate(false,200,'File Deleted',data)
        res.send(apiresponse)
      }          // successful response
    });
    
  }

  


  module.exports={
    deleteFile:deleteFile
  }