const express = require("express");

const app = express();
const bodyParser = require('body-parser')
var routes = require('./routes/route')
app.use(bodyParser.json())
var multer = require('multer');
var upload = multer();

app.use('/api',routes)

app.get('/api/for', function(req, res){
    res.render('index');
 });
 
 app.set('view engine', 'ejs');
 app.set('views', './views');
 
 // for parsing application/json
 app.use(bodyParser.json()); 
 
 // for parsing application/xwww-
 app.use(bodyParser.urlencoded({ extended: true })); 
 //form-urlencoded
 
 // for parsing multipart/form-data
 app.use(upload.array()); 
 app.use(express.static('public'));
 
 app.post('/api/send', function(req, res){
    console.log(req.body);
    res.send(req.body);
 });
// app.use(express.json())

// app.use('/api',routes)
// app.set('view engine','ejs');
// app.set('views','./views')
// app.get('/api/first_template',(req,res)=>{
//     res.render('index',{
//         name:"tutorial_point"
//     })
// })
// app.post('/api/data',(req,res)=>{
//     res.send(req.body)
//     console.log(req.body)
// })
// app.use(express.json())


// app.use(express.static('public'))
// app.set('view engine', 'ejs');
// app.get("/",(req,res)=>{
//     res.render("index")
// })

// app.get("/", (req, res) => {
//     res.status(200).send('<h1>hello from home page</h1>')
// });

// app.get("/about", (req, res) => {
//     res.send("<h1>Hello from about page</h1>")
// });

// app.get("/contact",(req,res)=>{
//     res.status(200).send("<h1>Hello from contact page</h1>")
// })
// app.get("*",(req,res)=>{
//     res.render("404")
// })


// const apidata = {
//     name:"mahesh",
//     age:24,
//     city:"rampura"
// }
// //2. data get by postman
// app.get('/',(req,res)=>{
//     res.send(`${apidata}`)
// })

// //1. data send by postman
// app.post('/send', function (req, res) {
//     console.log(req.body)
//     res.send(req.body)
// })

// var routes = require('./routes/route.js');

// //both index.js and things.js should be in same directory
// app.use('/api', routes);

// app.get('/api/:name/:id', (req, res) => {
//     res.send('this is your id : ' + req.params.id + ' and Name:' + req.params.name);
// })
// app.get('*', function (req, res) {
//     res.send('Sorry, this is an invalid URL.');
// });
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`listening port no ${PORT}`)
})