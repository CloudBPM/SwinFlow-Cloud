<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<%@ page session="false" %>
<%@ page
        import="com.cloudibpm.core.session.utils.SessionUtils,
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
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + port
            + "/api/webSocket/";
    String imgPath=request.getScheme() + "://" + request.getServerName() + ":" + port + "/api/img";
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>轩琦科技 - 创意轩 - 微服务库</title>
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
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/ckeditor_4.10.0_full/ckeditor/ckeditor.js"></script>
    <script src="<%=staticUrl%>/api/plugins/jstree/jstree.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/base64.js"></script>
    <script src="<%=staticUrl%>/api/plugins/echarts.js"></script>
    <script src="<%=staticUrl%>/api/plugins/qrcode.min.js"></script>

    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<%=staticUrl%>/api/js/common/basic.js"></script>
    <script src="<%=staticUrl%>/api/js/common/utils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/data/data_zh.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/statusbar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/progressbar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/alertbox.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/confirmdialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/messagedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/sysmessagedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/renamedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/treeview.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/mcplugin.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/uploadplugin.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/doupload.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/mainmenubar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/actions/websocketaction.js"></script>
    <!-- note: how to add a service here -->
    <script src="<%=staticUrl%>/api/js/common/ui/approvallogpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/readonlytableview.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/applytoonlinedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/model/submittingapprovallog.js"></script>
    <!-- note: how to add a service here -->
    <script src="<%=staticUrl%>/api/js/common/ui/slidemodaldialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/qcodedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicationdialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicationpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicatinglistpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicatingpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/contactinfopane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/contactpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/contactspane.js"></script>

    <script src="<%=staticUrl%>/api/js/common/ui/model/message.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/model/messageFormat.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/model/person.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/rightpane1.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/rightpane2.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/contactspane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/sessionpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicationdialog.js"></script>

    <script src="js/app/testpostaction.js"></script>
    <script src="js/app/testgetaction.js"></script>

    <script src="js/dlg/createmodeldialog.js"></script>
    <script src="js/dlg/editaccesscontroldialog.js"></script>
    <script src="js/dlg/settestingdialog.js"></script>

    <script src="js/editor/statusselectcelleditor.js"></script>
    <script src="js/editor/textcelleditor.js"></script>
    <script src="js/editor/acctypeselectcelleditor.js"></script>
    <script src="js/editor/textareacelleditor.js"></script>
    <script src="js/editor/pricecelleditor.js"></script>
    <script src="js/editor/pwcelleditor.js"></script>
    <script src="js/editor/textpropscelleditor.js"></script>

    <script src="js/pane/httpheadereditpane.js"></script>
    <script src="js/pane/httpparaeditpane.js"></script>
    <script src="js/pane/paranamecelleditor.js"></script>
    <script src="js/pane/paravalcelleditor.js"></script>
    <script src="js/pane/headerkeycelleditor.js"></script>
    <script src="js/pane/headervalcelleditor.js"></script>
    <script src="js/pane/httpautheditpane.js"></script>
    <script src="js/pane/basicauthpane.js"></script>
    <script src="js/pane/digestauthpane.js"></script>
    <script src="js/pane/oauthpane.js"></script>
    <script src="js/pane/webappproppanel.js"></script>
    <script src="js/pane/testresultdisplaypane.js"></script>
    <script src="js/pane/filedatapane.js"></script>
    <script src="js/pane/accesscontrolpane.js"></script>
    <script src="js/pane/accesshistorypane.js"></script>
    <script src="js/pane/paradtselectcelleditor.js"></script>
    <script src="js/pane/paracmtcelleditor.js"></script>
    <script src="js/pane/emailattachmentpane.js"></script>
    <script src="js/pane/emailtemplateproppanel.js"></script>
    <script src="js/pane/filemanagementcontentpane.js"></script>
    <script src="js/pane/listfilepane.js"></script>
    <script src="js/pane/httprespeditpane.js"></script>
    <script src="js/pane/uploadfilesplugin.js"></script>
    <script src="js/pane/uploadiconsplugin.js"></script>
    <script src="js/pane/androidappproppanel.js"></script>

    <script src="js/app/dockerimages.js"></script>
    <script src="js/app/emailtemplate.js"></script>
    <script src="js/app/smstemplate.js"></script>
    <script src="js/app/appfiles.js"></script>
    <script src="js/app/webappservice.js"></script>
    <script src="js/app/parameter.js"></script>
    <script src="js/app/header.js"></script>
    <script src="js/app/servicecontainer.js"></script>
    <script src="js/app/appserviceaccesscontrol.js"></script>
    <script src="../om/js/pane/upldfiles.js"></script>
    <script src="../pm/js/data/constant.js"></script>
    <script src="../pm/js/data/fileconstant.js"></script>
    <script src="js/app/androidapp.js"></script>

    <script src="js/amservice.js"></script>
    <script src="js/amundoredo.js"></script>
    <script src="js/amandroidappplugineditor.js"></script>
    <script src="js/amandroidappeditor.js"></script>
    <script src="js/amsmstemplateeditor.js"></script>
    <script src="js/amwebappeditor.js"></script>
    <script src="js/amemailtemplateeditor.js"></script>
    <script src="js/amwebappserviceeditor.js"></script>
    <script src="js/basicpropertysheet.js"></script>
    <script src="js/propertysheet.js"></script>
    <script src="js/ammaincontent.js"></script>
    <script src="js/mssvrconfigureeditor.js"></script>
    <script src="js/mssvreditor.js"></script>
    <script src="js/filemanagementeditor.js"></script>
    <script src="js/datastatisticseditor.js"></script>
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

    var service = new AMService("<%=userid%>", "", "<%=sessionId%>");
    var imgUrl = "<%=imgPath%>";
    var managerbody = document.getElementById("managerbody");
    var menuBar = null;
    if ($(managerbody).mainMenuBar != undefined) {
        var menu = $(managerbody).mainMenuBar({
            title: "创意轩",
            greeting: "您好，<%=login.getUser().getFullName()%>	",
            userName: "<%=login.getUser().getFullName()%>",
            userId: "<%=login.getUser().getId()%>",
            sessionId: "<%=sessionId%>",
            owner:"<%=login.getStaffships()[0].getOwner()%>",
            menuname: "微服务库",
            mopt: [1, 1, 0],
            websocket: new WebsocketClient("<%=basePath%>", "<%=sessionId%>",
                "<%=login.getUser().getId()%>",this),
            imgUrl:"<%=imgPath%>"
        });
        menuBar = menu.data("mainMenuBar");
    }
    var maincontent = $(managerbody).amMainContent({
        id: "005",
        uid: "<%=userid%>",
        uname: "<%=login.getUser().getFullName()%>",
    });
    var main = maincontent.data("amMainContent");
    menuBar.setManager(main);
    main.menubar = menuBar;
    $(managerbody).statusBar({
        title: "状态条",
    });

    var userId = "<%=userid%>";
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("userId", userId);
        localStorage.setItem("currtab" + userId, "am");
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState == "visible") {
                localStorage.setItem("currtab" + userId, "am");
            }
        })
    }
</script>
</html>

