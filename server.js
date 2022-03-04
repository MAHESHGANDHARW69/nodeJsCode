require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const router = require('./routes/routes');
const db = require('./models');
require('./config/google.passport')(passport);
require('./config/facebook.passport')(passport);

const app = express();

db.sequelize.sync();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/',router);

app.set('view engine','ejs');
app.set('views','./views')

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 6000;

app.listen(PORT,()=>{console.log(`server running on port no ${PORT}`)})