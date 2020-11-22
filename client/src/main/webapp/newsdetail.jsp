<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<%@ page session="false" %>
<%@ page
        import="com.cloudibpm.core.session.utils.SessionUtils,
        		com.cloudibpm.core.user.Login,
        		com.cloudibpm.core.user.Staff,
        		com.cloudibpm.core.util.DateUtility,
        		com.cloudibpm.core.util.encode.MD5Util,
        		com.cloudibpm.core.util.encode.SecretKeyUtil"
%>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%
    Login login = SessionUtils.getInstance().getLogin(request);
    String sessionId = SessionUtils.getInstance().getSessionId(request);
    if (login == null) {
        response.setContentType("text/html; charset=utf-8");
        response.sendRedirect("/login/logout.jsp");
        return;
    }
    String userid=login.getUser().getId();
    String port="8088";
    String staticUrl = request.getScheme() + "://" + request.getServerName() + ":" + port;
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + port + "/api/webSocket/";
    String imgPath=request.getScheme() + "://" + request.getServerName() + ":" + port + "/api/img";
    // http://www.bootply.com/EOgJSIzPGS# 这个页面的代码来源于此。
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>轩琦科技 - 新闻详情</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="//cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <meta name="format-detection" content="telephone=no">
    <meta name="renderer" content="webkit">
    <link rel="shortcut icon" href="favicon.ico"/>
    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet"
          href="<%=staticUrl%>/api/plugins/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.min.css">
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/font-awesome-4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="css/dashboard.css">
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.js"></script>
    <script src="<%=staticUrl%>/api/plugins/bootstrap-datetimepicker-master/js/locales/bootstrap-datetimepicker.zh-CN.js"></script>
    <script src="<%=staticUrl%>/api/plugins/qrcode.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/address/js/distpicker.data.js"></script>
    <script src="<%=staticUrl%>/api/plugins/address/js/distpicker.js"></script>
    <script src="<%=staticUrl%>/api/plugins/base64.js"></script>
    <script src="<%=staticUrl%>/api/plugins/md5.js"></script>
    <!-- Include all form model js files -->
    <script src="<%=staticUrl%>/api/js/common/actions/websocketaction.js"></script>
    <script src="<%=staticUrl%>/api/js/common/basic.js"></script>
    <script src="<%=staticUrl%>/api/js/common/utils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/data/data_zh.js"></script>

    <script src="js/clientservices.js"></script>
    <script src="js/model/commentModel.js"></script>
    <script src="js/model/twoCommentModel.js"></script>
    <script src="js/pane/newscontentpane.js"></script>

</head>
<body id="clientbody"></body>
<script>

    var service = new ClientService("<%=userid%>", "", "<%=sessionId%>");
    var clientbody = document.getElementById("clientbody");

    var maincontent = $(clientbody).newsContentPane({
        id: "newsdetails001",
        userId: "<%=userid%>",
        ownerId: "<%
                    if(login.getStaffships()!=null&&login.getStaffships().length>0){
                        out.print(login.getStaffships()[0].getOwner());
                    }
                  %>",
        ownerName : "",
        imgUrl : "<%=imgPath%>",
        userName : "<%=login.getUser().getFullName()%>",
        websocket: new WebsocketClient("<%=basePath%>", "<%=sessionId%>",
            "<%=login.getUser().getId()%>",this),
        parent : clientbody,
    });
    var main = maincontent.data("newsContentPane");
    main.detailData(Utils.fetchetQueryString("nid"));// newsid
    main.show(true);

</script>

</body>
</html>