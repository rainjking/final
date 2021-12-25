
var express = require('express');
var routerAdmin = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

routerAdmin.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.send('你不是管理员，不能访问后台管理！');
        return;
    }
    next();
});

//管理首页
routerAdmin.get('/', function (req, res, next) {
    res.render('admin/adminIndex', {
        userInfo: req.userInfo
    });
});

//用户管理
routerAdmin.get('/user', function (req, res, next) {
    var reqPage = Number((req.query.page) === undefined ? 0 : req.query.page);
    var page = reqPage <= 0 ? 1 : reqPage;
    var limit = 5;
    var pages = 0;
    var skip = (page - 1) * limit;
    User.count().then(function (count) {
        pages = Math.ceil(count / limit);
        User.find().sort({_id: -1}).limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,
                count: count,
                limit: limit,
                pages: pages,
                page: page
            });
        });
    });

});
//分类首页
routerAdmin.get('/category', function (req, res, next) {
    var reqPage = Number((req.query.page) === undefined ? 0 : req.query.page);
    var page = reqPage <= 0 ? 1 : reqPage;
    var limit = 5;
    var pages = 0;
    var skip = (page - 1) * limit;
    Category.count().then(function (count) {
        pages = Math.ceil(count / limit);
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                count: count,
                limit: limit,
                pages: pages,
                page: page
            });
        });
    });


});
//分类添加页面
routerAdmin.get('/category/add', function (req, res, next) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});
//分类添加数据上传
routerAdmin.post('/category/add', function (req, res, next) {
    var name = req.body.name || '';
    if (name === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空',
            url: ''
        });
    }
    else {
        Category.findOne({
            name: name
        }).then(function (resData) {
            if (resData) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '分类已经存在'
                });
            }
            else {
                return new Category({
                    name: name
                }).save();
            }
        }).then(function (newCategory) {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '分类保存成功',
                url: '/admin/category',
                categories: newCategory
            });
        });
    }

});
//分类编辑
routerAdmin.get('/category/edit', function (req, res) {
    var id = req.query.id || '';
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Pramise.reject();
        }
        else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    });

});
//分类修改 保存
routerAdmin.post('/category/edit', function (req, res) {
    var id = req.query.id || '';
    var newName = req.body.name || '';

    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Pramise.reject();
        }
        else {
            if (newName === category.name) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
            }
            else {
                return Category.findOne({
                    _id: {$ne: id},
                    name: newName
                });
            }

        }
    }).then(function (sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类',
            });
            return Pramise.reject();
        }
        else {
            return Category.update({
                    _id: id
                }, {
                    name: newName
                }
            );
        }
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    });


});
//分类删除
routerAdmin.get('/category/delete', function (req, res) {
    var id = req.query.id || '';
    Category.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        })
    });
});
//内容管理首页
routerAdmin.get('/content', function (req, res, next) {
    var reqPage = Number((req.query.page) === undefined ? 0 : req.query.page);
    var page = reqPage <= 0 ? 1 : reqPage;
    var limit = 10;
    var pages = 0;
    var skip = (page - 1) * limit;
    Content.count().then(function (count) {
        pages = Math.ceil(count / limit);
        Content.find().sort({addTime: -1}).limit(limit).skip(skip).populate('category').then(function (contents) {
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                limit: limit,
                pages: pages,
                page: page
            });
        });
    });
});
//内容添加
routerAdmin.get('/content/add', function (req, res, next) {
    Category.find().sort({_id: -1}).then(function (categories) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        });
    });
});

//内容添加 数据上传
routerAdmin.post('/content/add', function (req, res, next) {
    var postData = req.body;
    if (postData.category === '' || postData.title === '' || postData.content === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '有未填写的信息'
        });
        return;
    }
    else {
        var newContent = new Content({
            category: postData.category,
            user: req.userInfo._id.toString(),
            title: postData.title,
            description: postData.description,
            content: postData.content
        });
        // console.log(newContent);
        newContent.save().then(function (rs) {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '内容数据保存成功',
                url: '/admin/content'
            });
        });
    }
});


routerAdmin.get('/content/edit', function (req, res, next) {
    //
    var id = req.query.id || '';
    var resCategories = {};
    Category.find().sort({_id: -1}).then(function (categories) {
        resCategories = categories;
        return Content.findOne({
            _id: id
        }).populate('category').then(function (content) {
            if (!content) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '内容信息不存在'
                });
                return Pramise.reject();
            }
            else {
                res.render('admin/content_edit', {
                    userInfo: req.userInfo,
                    categories: resCategories,
                    content: content
                });
            }
        });
    });

});

//保存修改内容
routerAdmin.post('/content/edit', function (req, res, next) {

    var id = req.query.id || '';
    var postData = req.body;
    if (postData.category === '' || postData.title === '' || postData.content === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '有未填写的信息'
        });
        return;
    }
    else {
        Content.update({
            _id: id
        }, {
            category: postData.category,
            title: postData.title,
            description: postData.description,
            content: postData.content
        }).then(function () {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '内容数据修改成功',
                url: '/admin/content'
            });
        });
    }

});
//内容删除
routerAdmin.get('/content/delete', function (req, res, next) {
    var id = req.query.id || '';
    Content.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        });
    });
});

//退出
routerAdmin.get('/logout', function (req, res) {
    req.cookies.set('userInfo', null);
    res.render('main/mainIndex', {});
});

module.exports = routerAdmin;




