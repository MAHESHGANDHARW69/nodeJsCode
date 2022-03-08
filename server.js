require('dotenv').config();
const express = require('express');
const db = require('./models')

const app = express();

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>console.log(`App is running on port no ${PORT}`));
