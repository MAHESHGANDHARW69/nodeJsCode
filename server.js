require('dotenv').config();
const express = require('express');
const db = require("./models");
const passport = require('passport')
const session = require('express-session')
require('./config/passport')(passport)

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
db.sequelize.sync();
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.set('views', './views')


app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.use(passport.initialize())
app.use(passport.session())

const authRouter = require('./routes/auth.routes');//routes
app.use('/',authRouter)

app.listen(PORT, () => { console.log(`running port no ${PORT}`) })