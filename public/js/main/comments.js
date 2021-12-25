
var limit = 5; 
var page = 1;
var pages = 0;

var comments = [];

$(function () {
    $("#messageBtn").on('click', function () {
        var url = '/api/comment/post';
        var postData = {
            contentID: $("#contentID").val(),
            comment: $("#messageContent").val()
        };
        $.ajax({
            type: 'post',
            url: url,
            data: postData,
            success: function (resData) {
                $("#messageContent").val('');
                comments = resData.data.comments.reverse();
                renderComments();
            },
            error: function (err) {
                alert(err);
            }
        });
    });
});
$.ajax({
    type: 'get',
    url: '/api/comment',
    data: {
        contentID: $('#contentID').val()
    },
    success: function (resData) {
        comments = resData.data;
        renderComments();
    },
    error: function (err) {
        alert(err);
    }
});
$('.pager').delegate('a', 'click', function () {
    if ($(this).parent().hasClass("previous")) {
        page--;
    } else {
        page++;
    }
    renderComments(comments);
});
function renderComments() {
    var length = 0;
    if (comments !== null) length = comments.length;
    pages = Math.ceil(length / limit);
    $lis = $(".pager li");
    $lis.eq(1).html(page + '/' + pages);
    var start = (page - 1) * limit;
    var end = Math.min(start + limit, length);
    if (page < 1) {
        page = 1;
        $lis.eq(0).html('<span>没有上一页了</span>');
    }
    else {
        $lis.eq(0).html('<a href="javascript:;">上一页</a>')
    }
    if (page > pages) {
        page = pages;
        $lis.eq(2).html('<span>没有下一页了</span>');
    }
    else {
        $lis.eq(2).html('<a href="javascript:;">下一页</a>')
    }

    $("#messageCount").html(length);
    var htmlStr = '';
    if (comments.length === 0) {
        htmlStr += '<div class="messageBox"><p>暂时还没有评论！</p></div>';
        $(".pager").hide();
    }
    else {
        for (var i = start; i < end; i++) {
            var username = (comments[i].username === undefined) ? '游客' : comments[i].username;
            htmlStr += '<div class="messageBox">'
            htmlStr += '<p class="messageLine clear"><span class="floatLeft">' + username + '</span>'
            htmlStr += '<span class="floatRight">' + StringToDate(comments[i].postTime).format('yyyy-MM-dd hh:mm') + '</span> </p>'
            htmlStr += '<p>' + comments[i].comment + '</p>'
            htmlStr += '</div>';
        }
    }
    $(".messageList").html(htmlStr);
}