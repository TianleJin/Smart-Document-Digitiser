const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const mongoURI = "mongodb://" + process.argv[2] + ":27017/infosys";
console.log("Connecting to MongoDB Service=" + mongoURI);
let path = require('path');

//const records = require('./routers/record');

const app = express();
//app.use(testMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "dist/admin/")));

// database variable
var db;

// connect mongodb client
mongodb.MongoClient.connect(mongoURI, function(err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  db = client.db();
  console.log('Database connected successfully');
  // var server = app.listen(process.env.PORT || 4200, function() {
  //   var port = server.address().port;
  //   console.log("Web App is running on port", port);
  // })
  app.listen(4200, function(){
    console.log("Web App is running on port 4200");
  });
});