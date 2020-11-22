<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<%@ page session="false" %>
<%@ page
        import="com.cloudibpm.core.session.utils.SessionUtils,
                com.cloudibpm.core.user.Login,
                com.cloudibpm.core.user.Staff"
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
    String userid = login.getUser().getId();

    String requestPort=Integer.toString(request.getServerPort());

    String port = "8088";
    String staticUrl = request.getScheme() + "://" + request.getServerName() + ":" + port;
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + port
            + "/api/webSocket/";
    String imgPath=request.getScheme() + "://" + request.getServerName() + ":" + port + "/api/js/common/img";
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>轩琦科技 - 创意轩 - SaaS应用执行服务管理</title>
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
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/font-awesome-4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/jstree/themes/default/style.min.css"/>
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.css"/>
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/timepicker/timepicker.css"/>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/jstree/jstree.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-addon.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-zh-CN.js"></script>
    <script src="<%=staticUrl%>/api/plugins/qrcode.min.js"></script>

    <script src="<%=staticUrl%>/api/js/common/basic.js"></script>
    <script src="<%=staticUrl%>/api/js/common/utils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/data/data_zh.js"></script>

    <script src="<%=staticUrl%>/api/js/common/ui/statusbar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/progressbar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/alertbox.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/confirmdialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/messagedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/treeview.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/mcplugin.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/mainmenubar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/qcodedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/doupload.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicationdialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicationpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicatinglistpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicatingpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/contactinfopane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/contactpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/contactspane.js"></script>

    <script src="<%=staticUrl%>/api/js/common/ui/sysmessagedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/actions/websocketaction.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/slidemodaldialog.js"></script>

    <script src="<%=staticUrl%>/api/js/common/ui/model/message.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/model/messageFormat.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/model/person.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/rightpane1.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/rightpane2.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/contactspane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/sessionpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicationdialog.js"></script>

    <script src="js/model/serverinfo.js"></script>

    <script src="js/pane/enginepane.js"></script>
    <script src="js/pane/searchpane.js"></script>

    <script src="js/svrservices.js"></script>
    <script src="js/serverinfoeditor.js"></script>
    <!--  <script src="js/pmundoredo.js"></script>
    <script src="js/pmrlprocessditor.js"></script> -->
    <script src="js/basicpropertysheet.js"></script>
    <script src="js/propertysheet.js"></script>
    <script src="js/svrmaincontent.js"></script>


    <style type="text/css">
        .col {
            float: left;
            position: relative;
            position: relative;
            min-height: 1px;
        }
    </style>
</head>
<body id="managerbody">
<script>
    var otherComponents = [
        <%
            Staff[] staffs = login.getStaffships();
            List<String> auths = new ArrayList<String>();
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < staffs.length; i++) {
                for (int j = 0; j < staffs[i].getAuthorizations().length; j++) {
                    if (!auths.contains(staffs[i].getAuthorizations()[j])) {
                        auths.add(staffs[i].getAuthorizations()[j]);
                    }
                }
            }
            if (auths.contains("0000000002")) {
                    sb.append("{name: \"组织人事部\", url: \"/om/ommain.jsp?sessionId=" + sessionId + "\"},");
                }
                if (auths.contains("0000000001")) {
                    sb.append("{name: \"应用坊\", url: \"/pm/pmmain.jsp?sessionId=" + sessionId + "\"},");
                }
                if (auths.contains("0000000003")) {
                    sb.append("{name: \"微服务库\", url: \"/am/ammain.jsp?sessionId=" + sessionId + "\"},");
                }
                if (auths.contains("0000000004")) {
                    sb.append("{name: \"表单居\", url: \"/fm/fmmain.jsp?sessionId=" + sessionId + "\"},");
                }
                if (auths.contains("0000000005")) {
                    sb.append("{name: \"服务台\", url: \"/admin/admin.jsp?sessionId=" + sessionId + "\"},");
                }
                if (auths.contains("0000000006")) {
                    sb.append("{name: \"我的轩琦\", url: \"/client/me.jsp?sessionId=" + sessionId + "\"},");
                }
                if (auths.contains("0000000007")) {
                    sb.append("{name: \"服务器\", url: \"/svm/svmmain.jsp?sessionId=" + sessionId + "\"},");
                }
                if (auths.contains("0000000008")) {
                    sb.append("{name: \"大数据\", url: \"/bdm/bdmmain.jsp?sessionId=" + sessionId + "\"},");
                }
         %>
        <%=sb.toString()%>
    ];

    var mysvr = new SvrInfoService();
    var service = new SVRService("<%=userid%>", "", "<%=sessionId%>");
    var managerbody = document.getElementById("managerbody");
    if ($(managerbody).mainMenuBar != undefined) {
        var menu = $(managerbody).mainMenuBar({
            title: "创意轩",
            greeting: "您好，<%=login.getUser().getFullName()%>	",
            userName: "<%=login.getUser().getFullName()%>",
            userId: "<%=login.getUser().getId()%>",
            sessionId: "<%=sessionId%>",
            owner:"<%=login.getStaffships()[0].getOwner()%>",
            menuname: "服务器",
            mopt: [1, 1, 0],
            websocket: new WebsocketClient("<%=basePath%>", "<%=sessionId%>",
                "<%=login.getUser().getId()%>",this),
            imgUrl:"<%=imgPath%>"
        });
    }
    var menuBar = menu.data("mainMenuBar");
    var maincontent = $(managerbody).mainContent({
        id: "svr001",
        uid: "<%=userid%>",
    });
    var main = maincontent.data("mainContent");
    menuBar.setManager(main);
    main.menubar = menuBar;
    $(managerbody).statusBar({
        title: "状态条",
    });
    var userId = "<%=userid%>";
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("userId", userId);
        localStorage.setItem("currtab" + userId, "svm");
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState == "visible") {
                localStorage.setItem("currtab" + userId, "svm");
            }
        })
    }

</script>

</body>
</html>