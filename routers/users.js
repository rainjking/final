//用户路由
var express = require('express');
var userRouter = express.Router();

userRouter.get('/', function (req, res, next) {
    res.render('user/userIndex', {});
});

module.exports = userRouter;