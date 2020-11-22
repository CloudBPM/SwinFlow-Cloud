<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<%@ page session="false" %>
<%@ page import="com.cloudibpm.core.session.utils.SessionUtils,
				 com.cloudibpm.core.user.Login,
				 com.cloudibpm.core.user.Staff,
				 com.cloudibpm.core.util.DateUtility,
				 com.cloudibpm.core.util.encode.MD5Util,
				 com.cloudibpm.core.util.encode.SecretKeyUtil" %>
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
    String port="8088";
    String staticUrl = request.getScheme() + "://" + request.getServerName() + ":" + port;
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>轩琦科技 - SaaS智能化敏捷开发交付交易系统 - 实验室</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="renderer" content="webkit">
    <meta name="format-detection" content="telephone=no">

    <link rel="shortcut icon" href="favicon.ico"/>
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="//cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet"
          href="<%=staticUrl%>/api/plugins/font-awesome-4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="<%=staticUrl%>/api/css/intltel/intlTelInput.css">
    <link rel="stylesheet"
          href="<%=staticUrl%>/api/plugins/jstree/themes/default/style.min.css"/>
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.css"/>
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/timepicker/timepicker.css"/>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/intltel/js/intlTelInput.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/intltel/js/utils.js"></script>

    <script src="<%=staticUrl%>/api/plugins/jstree/jstree.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/birthday-picker/jquery-birthday-picker.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-addon.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-zh-CN.js"></script>

    <script src="js/workflowentity.js"></script>

    <script src="js/dlg/confirmdialog.js"></script>
    <script src="js/dlg/messagedialog.js"></script>
    <script src="js/dlg/alertbox.js"></script>
    <script src="js/dlg/testdialog.js"></script>

    <script src="js/pane/uploadplugin.js"></script>
    <script src="js/pane/doupload.js"></script>

    <script src="js/model/person.js"></script>

    <script src="js/editors/textareacelleditor.js"></script>
    <script src="js/editors/textcelleditor.js"></script>

    <script src="js/pane/listpane.js"></script>

    <script src="js/data/data_zh.js"></script>

    <script src="js/maincontent.js"></script>
    <script src="js/mainmenubar.js"></script>
    <script src="js/myservices.js"></script>
    <script src="js/personvieweditor.js"></script>
    <script src="js/listviewpaneeditor.js"></script>
    <script src="js/personeditor.js"></script>
    <script src="js/statusbar.js"></script>
    <script src="js/personundoredo.js"></script>
    <script src="js/basicpropertysheet.js"></script>
    <script src="js/progressbar.js"></script>
    <script src="js/propertysheet.js"></script>
    <script src="js/uploadfileeditor.js"></script>

    <style type="text/css">
        .col {
            float: left;
            position: relative;
            min-height: 1px;
        }
    </style>
</head>
<body id="managerbody">
</body>

<script>
    var otherComponents = [
        <%
            Staff[] staffs = login.getStaffships();
            List<String> auths = new ArrayList<String>();
            for (int i = 0; i < staffs.length; i++) {
                for (int j = 0; j < staffs[i].getAuthorizations().length; j++) {
                    if (!auths.contains(staffs[i].getAuthorizations()[j])) {
                        auths.add(staffs[i].getAuthorizations()[j]);
                    }
                }
            }

            out.println("{name: \"首页\", url: \"/client/index.jsp?sessionId=" + sessionId + "\"},");
            if (auths.contains("0000000002")) {
                out.println("{name: \"组织人事部\", url: \"/om/ommain.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000001")) {
                out.println("{name: \"应用坊\", url: \"/pm/pmmain.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000003")) {
                out.println("{name: \"微服务库\", url: \"/am/ammain.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000004")) {
                out.println("{name: \"表单居\", url: \"/fm/fmmain.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000005")) {
                out.println("{name: \"服务台\", url: \"/admin/admin.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000006")) {
                out.println("{name: \"我的轩琦\", url: \"/client/me.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000007")) {
                out.println("{name: \"服务器\", url: \"/svm/svmmain.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000008")) {
                out.println("{name: \"大数据\", url: \"/bdm/bdmmain.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000009")) {
                out.println("{name: \"账房\", url: \"/blm/blmmain.jsp?sessionId=" + sessionId + "\"},");
            }
            out.println("{name: \"服务市场\", url: \"/vendors/index.jsp?sessionId=" + sessionId + "\"},");
            out.println("{name: \"实验室\", url: \"/experiment/index.jsp?sessionId=" + sessionId + "\"},");
//             else {
//                out.println("{name: \"组织人事部\", url: \"/om/ommain.jsp?sessionId=" + sessionId + "\"},");
//            }
        %>
    ];

    var services = new MyService0("<%=userid%>", "", "<%=sessionId%>");
    var managerbody = document.getElementById("managerbody");
    var main = null;
    var menuBar = null;
    if ($(managerbody).mainMenuBar != undefined) {
        var menu = $(managerbody).mainMenuBar({
            title: "轩琦科技",
            greeting: "您好，<%=login.getUser().getFullName()%>	",
        });
        menuBar = menu.data("mainMenuBar");
    }
    if ($(managerbody).mainContent != undefined) {
        var maincontent = $(managerbody).mainContent({
            id: "001",
            author: "<%=login.getUser().getFullName()%>",
        });
        main = maincontent.data("mainContent");
    }
    if (menuBar != null) {
        menuBar.setManager(main);
    }
    if (main != null) {
        main.menubar = menuBar;
    }
    $(managerbody).statusBar({
        title: "状态条",
    });

</script>
</html>
