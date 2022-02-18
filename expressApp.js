const express = require("express");
const cors = require("cors");
const db = require("./models");
const userRouter = require("./routes/user.routes");
const app = express();
require('dotenv').config();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
db.sequelize.sync();

app.use('/api/users',userRouter);

app.set('view engine','ejs'); //emplate engine ejs
app.set('views','./views');

app.get('/index',function(req,res){
    res.render('index');
})

const PORT = process.env.PORTADD || 5000

app.listen(PORT, (err) => {
    console.log(`Server is running on port ${PORT}`);
})