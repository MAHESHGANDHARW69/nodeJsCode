require('dotenv').config();
const express = require('express');
const router = require('./routes/routes');
const db = require('./models');

const app = express();

db.sequelize.sync();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/',router);

app.set('view engine','ejs');
app.set('views','./views')

const PORT = process.env.PORT || 6000;

app.listen(PORT,()=>{console.log(`server running on port no ${PORT}`)})