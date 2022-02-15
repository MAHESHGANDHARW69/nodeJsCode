const express = require("express");
const cors = require("cors");
const db = require("./models");
// const userRouter = require("./routes/user.routes");
const schoolRouter = require("./routes/school.routes");
const app = express();
app.use(express.json());

var corsOptions = {
    origin: "http://localhost:4005"
}

app.use(cors(corsOptions))


app.use(express.urlencoded({ extended: false }));
db.sequelize.sync();

// app.use('/api/users',userRouter);
app.use('/api/school',schoolRouter)

const PORT = process.env.PORT || 8000

app.listen(PORT, (err) => {
    console.log(`Server is running on port ${PORT}`);
})