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
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + port
            + "/api/webSocket/";
    String imgPath=request.getScheme() + "://" + request.getServerName() + ":" + port + "/api/img";
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>轩琦科技 - 创意轩 - 服务台</title>
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
    <link rel="stylesheet" href="<%=staticUrl%>/api/css/webuploader.css"/>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.js"></script>
    <!-- CEditor plugin -->
    <script src="<%=staticUrl%>/api/plugins/ckeditor_4.10.0_full/ckeditor/ckeditor.js"></script>
    <!-- JSTree plugin -->
    <script src="<%=staticUrl%>/api/plugins/jstree/jstree.min.js"></script>
    <!-- jQuery Date time picker plugin -->
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-addon.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-zh-CN.js"></script>
    <script src="<%=staticUrl%>/api/plugins/base64.js"></script>
    <script src="<%=staticUrl%>/api/plugins/qrcode.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/laydate/laydate.js"></script>

    <script src="<%=staticUrl%>/api/js/common/basic.js"></script>
    <script src="<%=staticUrl%>/api/js/common/utils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/data/data_zh.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/statusbar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/progressbar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/runtimeutils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/alertbox.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/confirmdialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/messagedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/sysmessagedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/treeview.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/mcplugin.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/doupload.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/uploadplugin.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/readonlylistview.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/readonlytableview.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/mainmenubar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/applytoonlinedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/approvallogpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/model/submittingapprovallog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/model/systemnotice.js"></script>
    <script src="<%=staticUrl%>/api/js/common/actions/websocketaction.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/slidemodaldialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/qcodedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicationdialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicationpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicatinglistpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicatingpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/contactinfopane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/contactpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/contactspane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/webuploader/webuploader.min.js"></script>

    <script src="<%=staticUrl%>/api/js/common/ui/model/message.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/model/messageFormat.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/model/person.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/rightpane1.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/rightpane2.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/contactspane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/sessionpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicationdialog.js"></script>


    <script src="../om/js/orgs/abstractdepartment.js"></script>
    <script src="../om/js/orgs/organization.js"></script>
    <script src="../om/js/pane/upldfiles.js"></script>

    <script src="js/pane/overviewapppane.js"></script>
    <script src="js/pane/overviewpane.js"></script>
    <script src="js/pane/searchapppane.js"></script>
    <script src="js/pane/searchpane.js"></script>
    <script src="js/pane/newseditorpane.js"></script>
    <script src="js/pane/noticeviewpane.js"></script>
    <script src="js/pane/newsviewpane.js"></script>

    <script src="../pm/js/pane/cadidatesettingpane.js"></script>

    <script src="js/adminmbappmsapproval.js"></script>
    <script src="js/adminsystemhelpeditor.js"></script>
    <script src="js/adminundoredo.js"></script>
    <script src="js/runtimeprocessditor.js"></script>
    <script src="js/adminalleditor.js"></script>
    <script src="js/adminappeditor.js"></script>
    <script src="js/adminservice.js"></script>
    <script src="js/basicpropertysheet.js"></script>
    <script src="js/propertysheet.js"></script>
    <script src="js/adminorgapprovaleditor.js"></script>
    <script src="js/adminnewslist.js"></script>
    <script src="js/adminnewsapproval.js"></script>
    <script src="js/adminnewsdetails.js"></script>
    <script src="js/adminaddnews.js"></script>
    <script src="js/adminrlwfprocesseditor.js"></script>
    <script src="js/adminfmrlformeditor.js"></script>
    <script src="js/adminwebappserviceeditor.js"></script>
    <script src="js/adminsysnoticeeditor.js"></script>
    <script src="js/admincontent.js"></script>
    <script src="js/invoiceEditor.js"></script>

    <script src="../fm/js/models/component.js"></script>
    <script src="../fm/js/models/decimalsinput.js"></script>
    <script src="../fm/js/models/integerinput.js"></script>
    <script src="../fm/js/models/currencyinput.js"></script>
    <script src="../fm/js/models/naturalnumberinput.js"></script>
    <script src="../fm/js/models/datetimeinput.js"></script>
    <script src="../fm/js/models/datetimerangeplugin.js"></script>
    <script src="../fm/js/models/datetimerangeinput.js"></script>
    <script src="../fm/js/models/pageabletableviewplugin.js"></script>
    <script src="../fm/js/models/pageabletableview.js"></script>
    <script src="../fm/js/models/tableviewplugin.js"></script>
    <script src="../fm/js/models/tableview.js"></script>
    <script src="../fm/js/models/tableviewconfirmdlg.js"></script>
    <script src="../fm/js/models/richtextinput.js"></script>
    <script src="../fm/js/models/filereader.js"></script>
    <script src="../fm/js/models/filereaders.js"></script>
    <script src="../fm/js/models/container.js"></script>
    <script src="../fm/js/models/form.js"></script>
    <script src="../fm/js/models/row.js"></script>
    <script src="../fm/js/models/column.js"></script>
    <script src="../fm/js/models/singleinput.js"></script>
    <script src="../fm/js/models/singleselect.js"></script>
    <script src="../fm/js/models/multipleinput.js"></script>
    <script src="../fm/js/models/checkboxes.js"></script>
    <script src="../fm/js/models/checkbox.js"></script>
    <script src="../fm/js/models/radios.js"></script>
    <script src="../fm/js/models/radio.js"></script>
    <script src="../fm/js/models/button.js"></script>
    <script src="../fm/js/models/largebutton.js"></script>
    <script src="../fm/js/models/list.js"></script>
    <script src="../fm/js/models/img.js"></script>
    <script src="../fm/js/models/fileupload.js"></script>
    <script src="../fm/js/models/anchor.js"></script>
    <script src="../fm/js/models/header.js"></script>
    <script src="../fm/js/models/paragraph.js"></script>
    <script src="../fm/js/models/staticlist.js"></script>
    <script src="../fm/js/models/assocrule.js"></script>
    <script src="../fm/js/models/expressions.js"></script>
    <script src="../fm/js/models/constant.js"></script>
    <script src="../fm/js/models/reference.js"></script>
    <script src="../fm/js/models/referencedetail.js"></script>
    <script src="../fm/js/models/releasedform.js"></script>

    <script src="../am/js/pane/accesscontrolpane.js"></script>
    <script src="../am/js/pane/testresultdisplaypane.js"></script>
    <script src="../am/js/pane/accesshistorypane.js"></script>
    <script src="../am/js/pane/webappproppanel.js"></script>
    <script src="../am/js/pane/androidappproppanel.js"></script>

    <script src="../am/js/app/webappservice.js"></script>
    <script src="../am/js/app/header.js"></script>
    <script src="../am/js/app/parameter.js"></script>
    <script src="../am/js/app/androidapp.js"></script>

    <script src="../pm/js/pmundoredo.js"></script>
    <script src="../pm/js/tasks/wfprocess.js"></script>
    <script src="../pm/js/tasks/releasedwfprocess.js"></script>
    <script src="../pm/js/tasks/abstracttask.js"></script>
    <script src="../pm/js/tasks/startpoint.js"></script>
    <script src="../pm/js/tasks/endpoint.js"></script>
    <script src="../pm/js/tasks/assigntask.js"></script>
    <script src="../pm/js/tasks/manualtask.js"></script>
    <script src="../pm/js/tasks/subprocesspoint.js"></script>
    <script src="../pm/js/tasks/systemtask.js"></script>
    <script src="../pm/js/tasks/waitingtask.js"></script>
    <script src="../pm/js/tasks/transition.js"></script>
    <script src="../pm/js/tasks/assignment.js"></script>
    <script src="../pm/js/tasks/tasktextlabel.js"></script>
    <script src="../pm/js/tasks/emailreceiving.js"></script>
    <script src="../pm/js/tasks/emailsending.js"></script>
    <script src="../pm/js/tasks/smsreceiving.js"></script>
    <script src="../pm/js/tasks/smssending.js"></script>
    <script src="../pm/js/tasks/accessiblevariable.js"></script>
    <script src="../pm/js/tasks/participant.js"></script>
    <script src="../pm/js/tasks/messagereceiver.js"></script>

    <script src="../pm/js/data/constant.js"></script>
    <script src="../pm/js/data/datavariable.js"></script>
    <script src="../pm/js/data/arrayvariable.js"></script>
    <script src="../pm/js/data/expression.js"></script>

    <script src="../pm/js/data/boolconstant.js"></script>
    <script src="../pm/js/data/intconstant.js"></script>
    <script src="../pm/js/data/doubleconstant.js"></script>
    <script src="../pm/js/data/strconstant.js"></script>
    <script src="../pm/js/data/datetimeconstant.js"></script>
    <script src="../pm/js/data/fileconstant.js"></script>
    <script src="../pm/js/data/handwritingconstant.js"></script>
    <script src="../pm/js/data/jsonconstant.js"></script>
    <script src="../pm/js/data/timdurationconstant.js"></script>
    <script src="../pm/js/data/function.js"></script>

    <script src="../pm/js/editors/basicvaluecelleditor.js"></script>
    <script src="../pm/js/editors/boolvaluecelleditor.js"></script>
    <script src="../pm/js/editors/longtextvaluecelleditor.js"></script>
    <script src="../pm/js/editors/datetimecelleditor.js"></script>
    <script src="../pm/js/editors/datecelleditor.js"></script>
    <script src="../pm/js/editors/timecelleditor.js"></script>
    <script src="../pm/js/editors/durationcelleditor.js"></script>
    <script src="../pm/js/editors/filecelleditor.js"></script>

    <script src="../pm/js/dlg/ruleeditmodaldialog.js"></script>
    <script src="../pm/js/dlg/constanteditdialog.js"></script>
    <script src="../pm/js/dlg/datavariableeditdialog.js"></script>
    <script src="../pm/js/dlg/assignmenteditdialog.js"></script>
    <script src="../pm/js/dlg/createmodeldialog.js"></script>
    <script src="../pm/js/dlg/accessiblevareditdialog.js"></script>
    <script src="../pm/js/dlg/participanteditdialog.js"></script>
    <script src="../pm/js/dlg/receivereditdialog.js"></script>
    <script src="../pm/js/dlg/releaseprocessdialog.js"></script>
    <script src="../pm/js/dlg/appstoredialog.js"></script>
    <script src="../pm/js/dlg/processstoredialog.js"></script>
    <script src="../pm/js/dlg/formstoredialog.js"></script>
    <script src="../pm/js/dlg/constantdialog.js"></script>

    <script src="../pm/js/pane/ruleeditpanel.js"></script>
    <script src="../pm/js/pane/navigationeditpanel.js"></script>
    <script src="../pm/js/pane/routerorderpanel.js"></script>
    <script src="../pm/js/pane/processeditpanel.js"></script>
    <script src="../pm/js/pane/waitingtaskeditpanel.js"></script>
    <script src="../pm/js/pane/assignmenteditpanel.js"></script>
    <script src="../pm/js/pane/manualtaskeditpanel.js"></script>
    <script src="../pm/js/pane/systemtaskeditpanel.js"></script>
    <script src="../pm/js/pane/subprocesseditpanel.js"></script>
    <script src="../pm/js/pane/blankeditpanel.js"></script>
    <script src="../pm/js/pane/accessiblevariablespane.js"></script>
    <script src="../pm/js/pane/clientuisettingpane.js"></script>
    <script src="../pm/js/pane/deadlinesettingpane.js"></script>
    <script src="../pm/js/pane/paticipantspane.js"></script>
    <script src="../pm/js/pane/smssendingtaskeditpanel.js"></script>
    <script src="../pm/js/pane/smsreceiverspane.js"></script>
    <script src="../pm/js/pane/smstemplatesettingpane.js"></script>
    <script src="../pm/js/pane/emailsendingtaskeditpanel.js"></script>
    <script src="../pm/js/pane/emailreceiverspane.js"></script>
    <script src="../pm/js/pane/emailtemplatesettingpane.js"></script>
    <script src="../pm/js/pane/startpointeditpanel.js"></script>
    <script src="../pm/js/pane/endpointeditpanel.js"></script>
    <script src="../pm/js/pane/pointuieditpane.js"></script>
    <script src="../pm/js/pane/exprinitvaleditpane.js"></script>
    <script src="../pm/js/pane/aryinitvaleditpane.js"></script>
    <script src="../pm/js/pane/sppropeditpane.js"></script>
    <script src="../pm/js/pane/constanteditpane.js"></script>
    <script src="../pm/js/pane/rlprocessproppanel.js"></script>

    <script src="../client/js/model/invoice.js"></script>

    <script src="js/dlg/createhelpdialog.js"></script>
    <script src="js/dlg/returnmessagedialog.js"></script>
    <script src="js/dlg/createnotiedialog.js"></script>
    <script src="js/dlg/createnewsdialog.js"></script>
    <script src="js/dlg/invoiceviewdialog.js"></script>

    <script src="js/models/knowledgepage.js"></script>
    <script src="js/models/wfprocessinstance.js"></script>
    <script src="js/models/assigntaskinstance.js"></script>
    <script src="js/models/emailreceivinginstance.js"></script>
    <script src="js/models/emailsendinginstance.js"></script>
    <script src="js/models/endpointinstance.js"></script>
    <script src="js/models/manualtaskinstance.js"></script>
    <script src="js/models/smsreceivinginstance.js"></script>
    <script src="js/models/smssendinginstance.js"></script>
    <script src="js/models/startpointinstance.js"></script>
    <script src="js/models/subprocesspointinstance.js"></script>
    <script src="js/models/systemtaskinstance.js"></script>
    <script src="js/models/transitioninstance.js"></script>
    <script src="js/models/waitingtaskinstance.js"></script>
    <script src="js/models/course/audio.js"></script>
    <script src="js/models/course/book.js"></script>
    <script src="js/models/course/live.js"></script>
    <script src="js/models/course/video.js"></script>
    <script src="js/models/news.js"></script>

    <script src="js/course_management/video.js"></script>
    <script src="js/course_management/videoList.js"></script>
    <script src="js/course_management/audio.js"></script>
    <script src="js/course_management/audioList.js"></script>
    <script src="js/course_management/E-book.js"></script>
    <script src="js/course_management/bookList.js"></script>
    <script src="js/course_management/Livebroadcast.js"></script>
    <script src="js/course_management/liveBoradList.js"></script>
    <script src="js/course_management/uploadFile.js"></script>

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
            StringBuffer sb = new StringBuffer();
            List<String> auths = new ArrayList<String>();
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

    var service = new ADMINService("<%=userid%>", "", "<%=sessionId%>");
    var managerbody = document.getElementById("managerbody");
    var main = null;
    var menuBar = null;
    if ($(managerbody).mainMenuBar != undefined) {
        var menu = $(managerbody).mainMenuBar({
            title: "创意轩",
            greeting: "您好，<%=login.getUser().getFullName()%>	",
            userName: "<%=login.getUser().getFullName()%>",
            userId: "<%=login.getUser().getId()%>",
            sessionId: "<%=sessionId%>",
            owner:"<%=login.getStaffships()[0].getOwner()%>",
            menuname: "服务台",
            mopt: [1, 1, 0],
            websocket: new WebsocketClient("<%=basePath%>", "<%=sessionId%>",
                "<%=login.getUser().getId()%>",this),
            imgUrl:"<%=imgPath%>"
        });
        menuBar = menu.data("mainMenuBar");
    }
    if ($(managerbody).mainContent != undefined) {
        var maincontent = $(managerbody).mainContent({
            id: "001",
            uid: "<%=userid%>",
            uname: "<%=login.getUser().getFullName()%>",
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

    var userId = "<%=userid%>";
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("userId", userId);
        localStorage.setItem("currtab" + userId, "admin");
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState == "visible") {
                localStorage.setItem("currtab" + userId, "admin");
            }
        })
    }
    //var statusbar = pmstatusbar.data("adminStatusBar");
    //var progressbar = statusbar.getProgressBar();
</script>

</html>
