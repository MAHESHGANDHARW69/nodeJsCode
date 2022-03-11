require('dotenv').config();
const express = require('express');
const routes = require('./routes/routerUsers.js')
const db = require('./models')

const app = express();

db.sequelize.sync();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/',routes)

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>console.log(`App is running on port no ${PORT}`));
