const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      massive = require('massive'),
      AWS = require('aws-sdk'),
      config = require('./config');

AWS.config.update({
  accessKeyId: config.aws.ACCESS_KEY,
  secretAccessKey: config.aws.SECRET_KEY,
  region: 'config.aws.region' //where ever bucket is created is the region, go to AWS services, click on S3, create bucket + set region, most likely will be us-west-1 (or 2)
});

const s3 = new AWS.S3();

const app = module.exports = express();
app.use(bodyParser.json({limit: '50mb'})); //limits file size, default limit is 100kb
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static('./public'));
app.use('/node_modules', express.static('./node_modules'));


app.post('/api/newimage', function(req, res, next) {
  const buf = new Buffer(req.body.imageBody.replace(/^dat:image\/\w+;base64,/,''), 'base64')
  const bucketName = 'heatherh/' + req.body.userEmail;
  const params = {
    Bucket: bucketName,
    Key: req.body.imageName,
    Body: bug,
    ContentType: 'image/' + req.body.imageExtension,
    ACL: 'public-read'
  }

  s3.upload(params, function(err, data) {
    if (err) res.satus(500).send(err);
    res.status(200).json(data);
    console.log('upload', data);
  });
});

app.listen(3000, function() {
  console.log('Listening on 3000');
})
