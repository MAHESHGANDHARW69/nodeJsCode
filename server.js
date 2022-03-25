require('dotenv').config();
const express = require('express');
const session = require('express-session');
//import files
const routes = require('./routes/routerUsers.js')
const db = require('./models')

const app = express();
//1.use session
app.use(session({
    secret: process.env.JWT_SECRET,
    saveUninitialized: false,
    resave: false
}));
//2.call database
db.sequelize.sync();
app.use(express.json()); //define middleware
app.use(express.urlencoded({extended: true}));
//3.define & use routes
app.use('/',routes)
//4.static files
app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/img',express.static(__dirname + 'public/img'))
app.use('/demo',express.static(__dirname + 'public/demo'))
app.use('/fonts',express.static(__dirname + 'public/fonts'))
//5.set ejs template
app.set('view engine','ejs');
app.set('views','./views')

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>console.log(`App is running on port no ${PORT}`));
