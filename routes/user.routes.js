const users = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const express = require('express');
const userRouter = express.Router();
userRouter.post("/userRegister",users.createUser);
userRouter.post("/userLogin",users.loginUser);
userRouter.post("/changePassword",auth,users.changePasswordUser);
userRouter.get("/usersInfo",users.getUserInfo);
userRouter.put("/updateProfile",auth,users.updateProfileUsers);
userRouter.delete("/deleteUser",auth,users.deleteUserDetails);
userRouter.post("/renewAccessToken",users.renewAccessToken)
module.exports = userRouter;