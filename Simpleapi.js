const express = require("express");
 
const app = express();
app.use(express.json())


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

// const bodyParser = require('body-parser')
// var routes = require('./routes/route')
// app.use(bodyParser.json())

// app.use('/api',routes)

// app.post('/api/data',(req,res)=>{
//     res.send(req.body)
//     console.log(req.body)
// })

const apidata = {
    name:"mahesh",
    age:24,
    city:"rampura"
}
//2. data get by postman
app.get('/',(req,res)=>{
    res.send(`${apidata}`)
})

//1. data send by postman
app.post('/send', function (req, res) {
    console.log(req.body)
    res.send(req.body)
})

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`listening port no ${PORT}`)
})