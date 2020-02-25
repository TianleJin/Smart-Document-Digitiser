const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const fs = require('fs');
const multer = require('multer');

const mongoURI = "mongodb://" + process.argv[2] + ":27017/infosys";
const RECORDS_COLLECTION = 'records';
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


// Restful API for mongodb
// Get all records
app.get('/records', function(req, res){
    db.collection(RECORDS_COLLECTION).find({}).toArray(function(err, records) {
        if (err) {
            handleError(res, err.message, "Failed to get records.");
        } else {
            res.status(200).json(records);
        }
    });
});
  
// Create a record
app.post('/records', function(req, res){
    let newRecordDetails = req.body;
    if (!req.body.invoiceID) {
        handleError(res, "Invalid invoice input", "Must provide a name.", 400);
    } else {
        db.collection(RECORDS_COLLECTION).insertOne(newRecordDetails, function(err, record){
            if (err) {
                handleError(res, err.message, "Failed to create new record.");
            } else {
                res.status(201).json(record);
            }
        })
    }
});
  
// Get a single record
app.get('/records/:invoiceID', function(req, res){
    db.collection(RECORDS_COLLECTION).findOne({invoiceID: req.params.invoiceID}, function(err, record){
        if (err) {
            handleError(res, err,message, "Failed to get record");
        } else {
            res.status(200).json(record);
        }
    });
});

// Update a single record
// app.put('/records/:invoiceID', function(req, res){

// });

// Delete a single record
app.delete('/records/:invoiceID', function(req, res){
    db.collection(RECORDS_COLLECTION).deleteOne({invoiceID: req.params.invoiceID}, function(err, record){
        if(err) {
            handleError(res, err.message, "Failed to delete record");
        } else {
            res.status(200).json(req.params.invoiceID);
        }
    });
});

// RESTful API for setting(backgroud color, input fields, logo imgae)
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



// read fields and upload fields
app.get('/field', (req, res) => {
    fs.readFile('dist/admin/assets/field/field.json', function(err, content) {
        if (err) {
            handleError(res, err.message, "Failed to get field.");
        } else {
            res.status(200).json(content);
        }
    })
});
  
app.post('/field', (req, res) => {
    const jsonString = JSON.stringify(req.body);
    if (!jsonString) {
        handleError(res, "Invalid color JSON file", "Must provide a color.", 400);
    } else {
        fs.writeFile('dist/admin/assets/field/field.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err);
            } else {
                console.log('Successfully wrote field file');
            }
        })
        
        fs.writeFile('src/assets/field/field.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err);
            } else {
                console.log('Successfully wrote field file');
            }
        })
    }
});

// read image and upload image

// Set storage engine
// Destination is server directory src/assets/img
const destA = multer.diskStorage({
    destination: 'src/assets/img',
    filename: function(req, file, cb){
      cb(null, "logo" +  path.extname(file.originalname));
    }
});

// Set storage engine
// Destination is Angular app output directory 
const destB = multer.diskStorage({
    destination: 'dist/admin/assets/img',
    filename: function(req, file, cb){
        cb(null, "logo" +  path.extname(file.originalname));
    }
});

// Init UploadA
const uploadA = multer({
    storage: destA,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
});
  
// Init UploadA
const uploadB = multer({
    storage: destB,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
});

// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
};

// Upload file function
function fileUpload(req, res, next) {
    uploadA.single('file')(req, res, next);
    uploadB.single('file')(req, res, next);
    next();
};

// Upload image api
app.post('/image', fileUpload, (req, res, next) => {
    const file = req.file;
    res.send("Received files");
    // if (!file) {
    //     handleError(res, "Invalid image file", "Must provide a image.", 400);
    // } else {
    //     console.log('Successfully upload file');
    // }
});