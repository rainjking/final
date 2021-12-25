var express = require('express');
var routerApi = express.Router();

var User = require('../models/User');
var Content = require('../models/Content');
var responseData;
routerApi.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
});
routerApi.post('/user/register', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    
    if (username === '') {
        responseData.code = '1';
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }

    if (password === '' || repassword === '') {
        responseData.code = '2';
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    if (password !== repassword) {
        responseData.code = '3';
        responseData.message = '两次密码不一致';
        res.json(responseData);
        return;
    }
    User.findOne({
        username: username
    }).then(function (userInfo) {
        if (userInfo) {
            responseData.code = '4';
            responseData.message = '用户名已被注册';
            res.json(responseData);
            return;
        }
        else {
            var userRegisterData = new User({
                username: username,
                password: password,
                isSuperAdmin: false,
                isAdmin: true
            });
            userRegisterData.save();//
            return;
        }
    }).then(function (newUserInfo) {
        console.log(newUserInfo);//
        responseData.code = '0';
        responseData.message = '成功';
        res.json(responseData);
        return;
    });

});
routerApi.post('/user/login', function (req, res, next) {
    var uName = req.body.username;
    var pWord = req.body.password;
    User.findOne({
        username: uName,
        password: pWord
    }).then(function (userInfo) {
        if (!userInfo) {
            responseData.code = '1';
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        responseData.code = '0';
        responseData.message = '成功';
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        };
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);
        return;
    });
});
routerApi.get('/user/logout', function (req, res) {
    responseData.code = '0';
    req.cookies.set('userInfo', null);
    res.json(responseData);
    return;
});

routerApi.get('/comment', function (req, res, next) {
    var contentID = req.query.contentID || '';
    Content.findOne({
        _id: contentID
    }).then(function (content) {
        responseData.data = content.comments.reverse();
        res.json(responseData);
    });
});

routerApi.post('/comment/post', function (req, res, next) {
    var contentID = req.body.contentID;
    var postData = {
        username: req.userInfo.username || '游客',
        postTime: new Date(),
        comment: req.body.comment
    }
    Content.findOne({
        _id: contentID
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message = "评论成功";
        responseData.data = newContent;
        res.json(responseData);
    });
});


module.exports = routerApi;
