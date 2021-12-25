# 项目名称：个人博客系统

1）项目设计部分：

（1）项目总体构成:

models : 保存数据库模型文件

node_modules: 安装文件夹

public/css: 网页style的css文件夹

public/images:





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

（2）引入的包在项目中的作用相关说明；

（3）项目目录结构和各个部分的说明。

支持用户注册/登录，内容文章查看，评论，后台管理（定制显示的分类版块，进行文章内容添加）超级管理员还可进行用户管理等

目前只是做了一个比较粗糙的版本，跑通主线模块及部分功能

//通过这个个人练手项目的完成，算是对NodeJs 结合Express 进行Web开发有了一定的认识和理解，路漫漫...还有很多需要去Do 

系统还存在很多不稳定及大刀修改的地方【大虾勿喷勿笑】

比较适合刚接触NodeJs 这块的同学，可以当做Demo，代码中注释比较详细

***需要的同学可去[GitHub](https://github.com/HizyOrg/iBlog)*** 

在后续进一步的学习及时间允许下会逐渐完善和添加更多的功能及优化等...

后面的文章会对系统一些模块实现及后期优化等方面的做总结 TODO


**路由实现等说明**

api 接口路由

- / 首页
- /register 用户注册
- /login 用户登录
- /comment 评论获取
- /comment/post 评论提交



main 模块

- / 首页
- /view 内容页


admin 模块//管理模块

- / 首页
- \##用户管理
- /user 用户列表
- \##分类管理
- /category 分类列表
- /category/add 分类添加
- /category/edit 分类修改
- /category/delete 分类删除
- \##文章内容管理
- /article 文章列表
- /article/add 文章添加
- /article/edit 文章编辑
- /article/delete 文章删除
- \##评论内容管理
- /comment 评论列表
- /comment/delete 评论删除