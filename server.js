require('dotenv').config();
const express = require('express');
const session = require('express-session');
const routes = require('./routes/routerUsers.js')
const db = require('./models')

const app = express();


app.use(session({
    secret: process.env.JWT_SECRET,
    saveUninitialized: false,
    resave: false
}));

db.sequelize.sync();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/',routes)

app.set('view engine','ejs');
app.set('views','./views')

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>console.log(`App is running on port no ${PORT}`));
