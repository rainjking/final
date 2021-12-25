 var express = require('express');
 //加载模板处理模块
 var swig = require('swig');
 var path = require('path');
 var mongoose = require('mongoose');
 var bodyParser = require('body-parser');
 var Cookies = require('cookies');
 var User = require('./models/User');
 var app = express();
 // app.use(express.static(path.join(__dirname,'public')));
 app.use('/public', express.static(__dirname + '/public'));

 app.engine('html', swig.renderFile);

 app.set('views', './views');
 

 app.set('view engine', 'html');
 

 swig.setDefaults({cache: false});
 
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: true}));

 app.use(function (req, res, next) {
     req.cookies = new Cookies(req, res);

     req.userInfo = {};
     if (req.cookies.get('userInfo')) {
         try {
             req.userInfo = JSON.parse(req.cookies.get('userInfo'));

             User.findById(req.userInfo._id).then(function (userInfo) {
                 req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                 req.userInfo.isSuperAdmin = Boolean(userInfo.isSuperAdmin);
                 next();
             });
         }
         catch (e) {
             console.log('Cookies have some Error');
             next();
         }
     }
     else {
         console.log('不存在用户cookie 数据！');
         next();
     }
 });
 
 //路由控制
 app.use('/', require('./routers/main'));
 app.use('/admin', require('./routers/admin'));
 app.use('/user', require('./routers/users'));
 app.use('/api', require('./routers/api'));
 
 
 //监听Http请求  XXX端口的信息数据
 mongoose.Promise=global.Promise;
 mongoose.connect('mongodb://172.21.2.236:27017/190110910810', function (err) {
     if (err) {
         console.log('数据库连接失败');
         return;
     }
     else {
         app.listen(10810, '172.21.17.144');
         console.log('Success');
     }
 });

 