require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport)
const routes = require('./routes/routes.js');
const db = require("./models");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db.sequelize.sync();

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/',routes);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => { console.log(`server running on port on ${PORT}`) })