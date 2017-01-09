"use strict";

function login() {
    var username = $("#username").val(),
        password = $("#password").val();
    console.log(username);
    console.log(password);
    if(username === "yuqing" && password === "yuqing") {
        window.location.href = "index.html";
    }else {
        var info = { 
                title: "您好!",
                text: "账号或者密码错误！请重试",
                image: "",
                sticky: false,
                time: "",
                class_name: ""
        };
        $.gritter.add(info);
    }
    // if (username === '') {
    //     notify_warning("提示", "<span style='font-size: large;'>请输入用户名</span>", "stack_bar_top");
    //     return;
    // }
    // if (password === '') {
    //     notify_warning("提示", "<span style='font-size: large;'>请输入密码</span>", "stack_bar_top");
    //     return;
    // }
    //window.location.href = "index.html";
}
