const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const fs = require('fs');

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


// Generic error handler
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({'error': message});
}

//RESTful API for setting(backgroud color, input fields, logo imgae)
// read color and upload color
app.get('/color', function (req, res){
    fs.readFile('dist/admin/assets/color/color.json', function(err, content) {
        if (err) {
            handleError(res, err.message, "Failed to get color.");
        } else {
            res.status(200).json(content);
        }
    })
});
  
app.post('/color', function (req, res){
    const jsonString = JSON.stringify(req.body);
    if (!jsonString) {
        handleError(res, "Invalid color JSON file", "Must provide a color.", 400);
    } else {
        fs.writeFile('dist/admin/assets/color/color.json', jsonString, function(err, content){
            if (err) {
                handleError(res, err.message, "Failed to write color into dist/admin/assets.");
            } else {
                res.status(201).json(content);
            }
        })
    
        fs.writeFile('src/assets/color/color.json', jsonString, function(err, content){
            if (err) {
                handleError(res, err.message, "Failed to write color into src/assets.");
            } else {
                res.status(201).json(content);
            }
        })
    }
    
})