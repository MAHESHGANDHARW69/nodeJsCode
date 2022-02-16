var express = require('express');
var router = express.Router();


router.post('/', function(req, res){
   res.send('POST route on things.');
});

router.get('/', function(req, res){
   res.send('GET route on things.');
});

//export this router to use in our index.js
module.exports = router;