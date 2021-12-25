// * 用户博客首页

$(function () {

    $rightModule = $(".rightModule");//

    var $registerBtn = $("#registerBtn");
    var $loginBtn = $("#loginBtn");
    var $logoutBtn = $("#logout");
    $registerBtn.on('click', function () {
        uploadRegisterDataFunc();
    });
    $loginBtn.on('click', function () {
        loginFunc();
    });
    $rightModule.find('.textRight').find('a').on('click', function () {
        var thisTextName = $(this).attr('name');
        if (thisTextName === 'login') {
            $registerBtn.parents('.rightBox').addClass('boxHidden');

            $loginBtn.parents('.rightBox').removeClass('boxHidden');
        }
        else if (thisTextName === 'backLogin') {
            $loginBtn.parents('.rightBox').addClass('boxHidden');
            $logoutBtn.parents('.rightBox').addClass('boxHidden');
            $registerBtn.parents('.rightBox').removeClass('boxHidden');
        }
        else if (thisTextName === 'logout') {
            logoutFunc();
        }
        else {
            //
            alert('功能正在开发...');
        }

    });
});

function uploadRegisterDataFunc() {
    var registerBox = $("#registerBox");
    var loginBox = $("#loginBox");
    var userInfoBox = $("#userInfoBox");
    var username = registerBox.find('input[name="username"]').val();
    var password = registerBox.find('input[name="password"]').val();
    var repassword = registerBox.find('input[name="repassword"]').val();
    if (username === '') {
        alert('你未输入用户名...');
    } else {
        $.ajax({
            type: 'post',
            url: 'api/user/register',
            data: {
                username: username,
                password: password,
                repassword: repassword
            },
            dataType: 'json',
            success: function (resData) {
                if (resData.code === '0') {
                    alert(resData.message);
                    registerBox.addClass('boxHidden');
                    loginBox.removeClass('boxHidden');
                }
                else {
                    alert(resData.message);
                }
            },
            error: function () {
                alert('Error');
            }

        });
    }

}
function loginFunc() {
    var loginBox = $("#loginBox");
    var userInfoBox = $("#userInfoBox");
    var username = loginBox.find('input[name="username"]').val();
    var password = loginBox.find('input[name="password"]').val();
    if (username === '' || password === '') {
        alert('你的信息未填写完整...')
    }
    else {
        $.ajax({
            type: 'post',
            url: 'api/user/login',
            data: {
                username: username,
                password: password
            },
            dataType: 'json',
            success: function (resData) {
                if (resData.code === '0') {
                    window.location.reload();
                }
                else {
                    alert(resData.message);
                }
            },
            error: function () {
                alert('Error');
            }

        });
    }

}

function logoutFunc() {
    $.ajax({
        type: 'Get',
        url: 'api/user/logout',
        data: {},
        dataType: 'json',
        success: function (resData) {
            if (resData.code === '0') {
                alert('你已成功退出系统');
                window.location.reload();
            }


        },
        error: function (err) {
            alert(err);
        }
    });
}