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
    String port = "8088";
    String staticUrl = request.getScheme() + "://" + request.getServerName() + ":" + port;
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + port
            + "/api/webSocket/";
    String imgPath=request.getScheme() + "://" + request.getServerName() + ":" + port + "/api/img";
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>轩琦科技 - 创意轩 - 表单居</title>
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
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/font-awesome-4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/jstree/themes/default/style.min.css"/>
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/fontawesome-iconpicker-1.3.0/css/fontawesome-iconpicker.min.css"/>
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.css"/>
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/timepicker/timepicker.css"/>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.14&key=a7978afe48e4f646cbf7e440d2909dfc"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/jstree/jstree.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/fontawesome-iconpicker-1.3.0/js/fontawesome-iconpicker.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/echarts.js"></script>
    <script src="<%=staticUrl%>/api/plugins/qrcode.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/mediareader/jquery.media.js"></script>

    <script src="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.js"></script>
    <!-- CEditor plugin -->
    <script src="<%=staticUrl%>/api/plugins/ckeditor_4.10.0_full/ckeditor/ckeditor.js"></script>
    <!-- jQuery Date time picker plugin -->
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-addon.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-zh-CN.js"></script>

    <script src="<%=staticUrl%>/api/js/common/basic.js"></script>
    <script src="<%=staticUrl%>/api/js/common/utils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/data/data_zh.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/statusbar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/progressbar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/buildtimeutils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/runtimeutils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/alertbox.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/confirmdialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/messagedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/sysmessagedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/treeview.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/doupload.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/mcplugin.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/renamedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/mainmenubar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/readonlytableview.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/applytoonlinedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/approvallogpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/actions/websocketaction.js"></script>
    <script src="<%=staticUrl%>/api/js/common/model/systemnotice.js"></script>
    <script src="<%=staticUrl%>/api/js/common/model/submittingapprovallog.js"></script>
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

    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/compts/sinicon.js"></script>
    <script src="js/compts/selecticon.js"></script>
    <script src="js/compts/mulicon.js"></script>
    <script src="js/compts/checkboxicon.js"></script>
    <script src="js/compts/radioicon.js"></script>
    <script src="js/compts/buttonicon.js"></script>
    <script src="js/compts/lgbuttonicon.js"></script>
    <script src="js/compts/listicon.js"></script>
    <script src="js/compts/imgicon.js"></script>
    <script src="js/compts/fileicon.js"></script>
    <script src="js/compts/urlicon.js"></script>
    <script src="js/compts/headericon.js"></script>
    <script src="js/compts/paragraphicon.js"></script>
    <script src="js/compts/stlsticon.js"></script>
    <script src="js/compts/pageabletableviewicon.js"></script>
    <script src="js/compts/tableviewicon.js"></script>
    <script src="js/compts/integericon.js"></script>
    <script src="js/compts/decimalsicon.js"></script>
    <script src="js/compts/currencyicon.js"></script>
    <script src="js/compts/naturalnumbericon.js"></script>
    <script src="js/compts/datetimeicon.js"></script>
    <script src="js/compts/datetimerangeicon.js"></script>
    <script src="js/compts/richtexticon.js"></script>
    <script src="js/compts/filereadericon.js"></script>
    <script src="js/compts/filereadersicon.js"></script>
    <script src="js/compts/barcharticon.js"></script>
    <script src="js/compts/piecharticon.js"></script>
    <script src="js/compts/curvecharticon.js"></script>
    <script src="js/compts/mapicon.js"></script>

    <script src="../pm/js/data/constant.js"></script>
    <script src="../pm/js/data/datetimeconstant.js"></script>
    <script src="../pm/js/data/timdurationconstant.js"></script>
    <script src="../pm/js/data/fileconstant.js"></script>

    <script src="js/models/component.js"></script>
    <script src="js/models/assocrule.js"></script>
    <script src="js/models/constant.js"></script>
    <script src="js/models/expressions.js"></script>
    <script src="js/models/container.js"></script>
    <script src="js/models/reference.js"></script>
    <script src="js/models/referencedetail.js"></script>
    <script src="js/models/decimalsinput.js"></script>
    <script src="js/models/integerinput.js"></script>
    <script src="js/models/currencyinput.js"></script>
    <script src="js/models/naturalnumberinput.js"></script>
    <script src="js/models/datetimeinput.js"></script>
    <script src="js/models/datetimerangeplugin.js"></script>
    <script src="js/models/datetimerangeinput.js"></script>
    <script src="js/models/pageabletableviewplugin.js"></script>
    <script src="js/models/pageabletableview.js"></script>
    <script src="js/models/tableviewplugin.js"></script>
    <script src="js/models/tableview.js"></script>
    <script src="js/models/tableviewconfirmdlg.js"></script>
    <script src="js/models/richtextinput.js"></script>
    <script src="js/models/filereader.js"></script>
    <script src="js/models/filereaders.js"></script>
    <script src="js/models/singleinput.js"></script>
    <script src="js/models/singleselect.js"></script>
    <script src="js/models/multipleinput.js"></script>
    <script src="js/models/checkboxes.js"></script>
    <script src="js/models/checkbox.js"></script>
    <script src="js/models/radios.js"></script>
    <script src="js/models/radio.js"></script>
    <script src="js/models/button.js"></script>
    <script src="js/models/largebutton.js"></script>
    <script src="js/models/list.js"></script>
    <script src="js/models/img.js"></script>
    <script src="js/models/fileupload.js"></script>
    <script src="js/models/anchor.js"></script>
    <script src="js/models/header.js"></script>
    <script src="js/models/paragraph.js"></script>
    <script src="js/models/staticlist.js"></script>
    <script src="js/models/map.js"></script>
    <script src="js/models/curvechart.js"></script>
    <script src="js/models/barchart.js"></script>
    <script src="js/models/piechart.js"></script>

    <script src="js/models/column.js"></script>
    <script src="js/models/row.js"></script>
    <script src="js/models/form.js"></script>
    <script src="js/models/releasedform.js"></script>

    <script src="../bdm/js/model/reportcell.js"></script>
    <script src="../bdm/js/model/reportfield.js"></script>
    <script src="../bdm/js/model/reportrow.js"></script>
    <script src="../bdm/js/model/report.js"></script>
    <script src="../bdm/js/model/reportpage.js"></script>
    <script src="../bdm/js/model/reportservice.js"></script>

    <script src="js/layouts/onecol.js"></script>
    <script src="js/layouts/twocols.js"></script>
    <script src="js/layouts/threecols.js"></script>
    <script src="js/layouts/fourcols.js"></script>
    <script src="js/layouts/sixcols.js"></script>
    <script src="js/layouts/eightfourcols.js"></script>
    <script src="js/layouts/foureightcols.js"></script>

    <script src="js/editors/textareacelleditor.js"></script>
    <script src="js/editors/pricecelleditor.js"></script>
    <script src="js/editors/formnamecelleditor.js"></script>
    <script src="js/editors/textcelleditor.js"></script>
    <script src="js/editors/yesnocelleditor.js"></script>
    <script src="js/editors/imgshapecelleditor.js"></script>
    <script src="js/editors/selectlistcelleditor.js"></script>
    <script src="js/editors/numbercelleditor.js"></script>
    <script src="js/editors/textinputbhselcelleditor.js"></script>
    <script src="js/editors/comselecteditor.js"></script>
    <script src="js/editors/bhelecteditor.js"></script>
    <script src="js/editors/referencenamecelleditor.js"></script>
    <script src="js/editors/selectbhselcelleditor.js"></script>
    <script src="js/editors/checkboxbhselcelleditor.js"></script>
    <script src="js/editors/radiobhselcelleditor.js"></script>
    <script src="js/editors/trialselectcelleditor.js"></script>

    <script src="js/dlg/createmodeldialog.js"></script>
    <script src="js/dlg/previewdialog.js"></script>
    <script src="js/dlg/conditiondialog.js"></script>
    <script src="js/dlg/conditioneditpane.js"></script>
    <script src="js/dlg/constanteditdialog.js"></script>
    <script src="js/dlg/releaseformdialog.js"></script>
    <script src="js/dlg/buyhiredialog.js"></script>

    <script src="js/pane/singleinputeditpanel.js"></script>
    <script src="js/pane/singleinputproppane.js"></script>
    <script src="js/pane/singleinputassocpane.js"></script>
    <script src="js/pane/singleselecteditpanel.js"></script>
    <script src="js/pane/singleselectproppane.js"></script>
    <script src="js/pane/singleselectassocpane.js"></script>
    <script src="js/pane/multipleinputeditpanel.js"></script>
    <script src="js/pane/multipleinputproppane.js"></script>
    <script src="js/pane/multipleinputassocpane.js"></script>
    <script src="js/pane/checkboxeditpanel.js"></script>
    <script src="js/pane/checkboxproppane.js"></script>
    <script src="js/pane/checkboxassocpane.js"></script>
    <script src="js/pane/checkboxeseditpanel.js"></script>
    <script src="js/pane/checkboxesproppane.js"></script>
    <script src="js/pane/radioeditpanel.js"></script>
    <script src="js/pane/radioproppane.js"></script>
    <script src="js/pane/radioassocpane.js"></script>
    <script src="js/pane/radioseditpanel.js"></script>
    <script src="js/pane/radiosproppane.js"></script>
    <script src="js/pane/buttoneditpanel.js"></script>
    <script src="js/pane/buttonproppane.js"></script>
    <script src="js/pane/buttonassocpane.js"></script>
    <script src="js/pane/lgbuttoneditpanel.js"></script>
    <script src="js/pane/lgbuttonproppane.js"></script>
    <script src="js/pane/listeditpanel.js"></script>
    <script src="js/pane/listproppane.js"></script>
    <script src="js/pane/listassocpane.js"></script>
    <script src="js/pane/imageeditpanel.js"></script>
    <script src="js/pane/imageproppane.js"></script>
    <script src="js/pane/fileuploadeditpanel.js"></script>
    <script src="js/pane/fileuploadproppane.js"></script>
    <script src="js/pane/anchoreditpanel.js"></script>
    <script src="js/pane/anchorproppane.js"></script>
    <script src="js/pane/headerditpanel.js"></script>
    <script src="js/pane/headerproppane.js"></script>
    <script src="js/pane/paragrapheditpanel.js"></script>
    <script src="js/pane/paragraphproppane.js"></script>
    <script src="js/pane/staticlisteditpanel.js"></script>
    <script src="js/pane/staticlistproppane.js"></script>
    <script src="js/pane/rlformproppanel.js"></script>
    <script src="js/pane/pageabletableviewproppane.js"></script>
    <script src="js/pane/pageabletableviewpanel.js"></script>
    <script src="js/pane/tableviewproppane.js"></script>
    <script src="js/pane/tableviewpanel.js"></script>
    <script src="js/pane/integerinputeditpanel.js"></script>
    <script src="js/pane/integerinputproppane.js"></script>
    <script src="js/pane/integerinputassocpane.js"></script>
    <script src="js/pane/decimalsinputeditpanel.js"></script>
    <script src="js/pane/decimalsinputproppane.js"></script>
    <script src="js/pane/decimalsinputassocpane.js"></script>
    <script src="js/pane/currencyinputeditpanel.js"></script>
    <script src="js/pane/currencyinputproppane.js"></script>
    <script src="js/pane/currencyinputassocpane.js"></script>
    <script src="js/pane/naturalnuminputproppane.js"></script>
    <script src="js/pane/naturalnuminputassocpane.js"></script>
    <script src="js/pane/naturalnuminputeditpanel.js"></script>
    <script src="js/pane/datetimeinputproppane.js"></script>
    <script src="js/pane/datetimeinputassocpane.js"></script>
    <script src="js/pane/datetimeinputeditpanel.js"></script>
    <script src="js/pane/dtrangeinputproppane.js"></script>
    <script src="js/pane/dtrangeinputassocpane.js"></script>
    <script src="js/pane/dtrangeinputeditpanel.js"></script>
    <script src="js/pane/filedisplayerproppane.js"></script>
    <script src="js/pane/filedisplayereditpanel.js"></script>
    <script src="js/pane/filesdisplayerproppane.js"></script>
    <script src="js/pane/filesdisplayereditpanel.js"></script>

    <script src="js/fmservice.js"></script>
    <script src="js/fmundoredo.js"></script>
    <script src="js/fmpublisheditor.js"></script>
    <script src="js/fmeditor.js"></script>
    <script src="js/rlfmeditor.js"></script>
    <script src="js/fmreferenceeditor.js"></script>
    <script src="js/basicpropertysheet.js"></script>
    <script src="js/propertysheet.js"></script>
    <script src="js/fmmaincontent.js"></script>

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

    var service = new FMService("<%=userid%>", "", "<%=sessionId%>");

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
            menuname: "表单居",
            mopt: [1, 1, 0],
            websocket: new WebsocketClient("<%=basePath%>", "<%=sessionId%>",
                "<%=login.getUser().getId()%>",this),
            imgUrl:"<%=imgPath%>"
        });
        menuBar = menu.data("mainMenuBar");
    }

    var maincontent = $(managerbody).fmMainContent({
        id: "F0010",
        uid: "<%=userid%>",
        uname: "<%=login.getUser().getFullName()%>",
        sid: "<%=sessionId%>",
    });
    var main = maincontent.data("fmMainContent");
    menuBar.setManager(main);
    main.menubar = menuBar;
    $(managerbody).statusBar({
        title: "状态条",
    });
    var userId = "<%=userid%>";
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("userId", userId);
        localStorage.setItem("currtab" + userId, "fm");
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState == "visible") {
                localStorage.setItem("currtab" + userId, "fm");
            }
        })
    }

</script>
</html>

