<%--
  Created by IntelliJ IDEA.
  User: mh
  Date: 2018/12/10
  Time: 11:22
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String port="8088";
    String CONTEXT_URL = request.getScheme() + "://" + request.getServerName() + ":" + port;
//    String CONTEXT_URL = request.getScheme() + "://" + request.getServerName() + "/a";
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>轩琦科技 - 用户登录</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

    <link rel="shortcut icon" href="favicon.ico"/>
    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="<%=CONTEXT_URL%>/api/plugins/bootstrap-3.3.5/css/bootstrap.min.css">
    <!-- Custom styles and js -->
    <link rel="stylesheet" href="<%=CONTEXT_URL%>/api/css/custom.css" rel="stylesheet">

    <script type="text/javascript" src="<%=CONTEXT_URL%>/api/plugins/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="<%=CONTEXT_URL%>/api/plugins/qrcode.min.js"></script>
    <script type="text/javascript"
            src="<%=CONTEXT_URL%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="<%=CONTEXT_URL%>/api/plugins/md5.js"></script>
    <script type="text/javascript" src="<%=CONTEXT_URL%>/api/js/common/basic.js"></script>
    <script type="text/javascript" src="<%=CONTEXT_URL%>/api/js/common/ui/footer.js"></script>

    <script type="text/javascript" src="js/loginmenubar.js"></script>
    <script type="text/javascript" src="js/login4user.js"></script>
    <script type="text/javascript" src="js/traditionalLogin.js"></script>
    <script type="text/javascript" src="js/verificationCodeLogin.js"></script>
    <script type="text/javascript" src="js/appdownload.js"></script>
    <script type="text/javascript" src="js/scanCodeLogin.js"></script>
    <script type="text/javascript" src="js/bulletinboard.js"></script>
    <style type="text/css">
        body {
            background-color: #fff;
        }
    </style>
</head>
<body id="mainbody">
<script>
    var bdy = document.getElementById("mainbody");
    $(bdy).loginMenuBar({
        title: "轩琦科技 - 用户登录",
    });
    var h = document.documentElement.clientHeight;
    var main = document.createElement("DIV");
    bdy.appendChild(main);
    var header = document.createElement("h1");
    main.appendChild(header);
    header.className = "text-center";
    header.innerHTML = "SaaS智能化敏捷开发交付系统";
    var header1 = document.createElement("h4");
    main.appendChild(header1);
    header1.className = "text-center";
    header1.innerHTML = "v2.0.0.0（教育版）";
    var loginpane = document.createElement("DIV");
    main.appendChild(loginpane);
    main.style.height = (h - 320) + "px";
    var plugin0 = $(loginpane).login({
        title: "轩琦科技 - 用户登录",
        url : ["Authenticate", "LoginFindMobile"],
    });
    var lgn = plugin0.data("login");
    $(loginpane).bulletinBoard({
        id: "",
        loginpane: lgn,
        url : "SysNoticeService",
    });
    $(loginpane).mobileAppDownload({
        title: "轩琦手机APP下载",
    });
    $(bdy).footer({
        id: "",
    });
</script>

</body>

<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script
        src="<%=CONTEXT_URL%>/api/plugins/bootstrap-3.3.5/js/ie10-viewport-bug-workaround.js"></script>

</html>
