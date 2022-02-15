const express = require("express");
const cors = require("cors");
const db = require("./models");
const userRouter = require("./routes/user.routes");
const app = express();

var corsOptions = {
    origin: "http://localhost:4005"
}

app.use(cors(corsOptions))


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
db.sequelize.sync();

app.use('/api/users',userRouter);

const PORT = process.env.PORT || 8000

app.listen(PORT, (err) => {
    console.log(`Server is running on port ${PORT}`);
})