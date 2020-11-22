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
<%@ page import="com.cloudibpm.core.organization.AbstractPosition" %>
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
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + port + "/api/webSocket/";
    String imgPath = request.getScheme() + "://" + request.getServerName() + ":" + port + "/api/img";
    // http://www.bootply.com/EOgJSIzPGS# 这个页面的代码来源于此。
    AbstractPosition[] positions = login.getPositions();
    String mycate = "";
    String mypos = "";
    if (positions != null && positions.length > 0) {
        for (int i = 0; i < positions.length; i++) {
            if (positions[i].getCategory() != null &&
                    positions[i].getCategory().equals("教师")) {
                mycate = positions[i].getCategory();
                mypos = positions[i].getId();
            } else if (positions[i].getCategory() != null &&
                    positions[i].getCategory().equals("学生")) {
                mycate = positions[i].getCategory();
                //mypos = positions[i].getId();
            }
        }
    }


%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>轩琦科技 - 我的轩琦</title>
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
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.css"/>
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/timepicker/timepicker.css"/>
    <link rel="stylesheet" href="css/dashboard.css">
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.14&key=a7978afe48e4f646cbf7e440d2909dfc"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-addon.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-zh-CN.js"></script>
    <script src="<%=staticUrl%>/api/plugins/echarts.js"></script>
    <script src="<%=staticUrl%>/api/plugins/qrcode.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/address/js/distpicker.data.js"></script>
    <script src="<%=staticUrl%>/api/plugins/address/js/distpicker.js"></script>
    <script src="<%=staticUrl%>/api/plugins/base64.js"></script>
    <script src="<%=staticUrl%>/api/plugins/md5.js"></script>
    <!-- Include all form model js files -->
    <script src="<%=staticUrl%>/api/plugins/mediareader/jquery.media.js"></script>
    <script src="<%=staticUrl%>/api/plugins/base64.js"></script>

    <!-- Include all form model js files -->
    <script src="<%=staticUrl%>/api/js/common/actions/websocketaction.js"></script>
    <script src="<%=staticUrl%>/api/js/common/basic.js"></script>
    <script src="<%=staticUrl%>/api/js/common/utils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/data/data_zh.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/qcodedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/confirmdialog.js"></script>

    <!-- communication panels -->
    <script src="<%=staticUrl%>/api/js/common/ui/model/messageFormat.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/contactspane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/rightpane1.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/rightpane2.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/sessionpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/messagedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicationpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicationdialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/readonlytableview.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/doupload.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/alertbox.js"></script>

    <script src="../pm/js/data/constant.js"></script>
    <script src="../pm/js/data/fileconstant.js"></script>

    <script src="../fm/js/models/component.js"></script>
    <script src="../fm/js/models/constant.js"></script>
    <script src="../fm/js/models/expressions.js"></script>
    <script src="../fm/js/models/assocrule.js"></script>
    <script src="../fm/js/models/reference.js"></script>
    <script src="../fm/js/models/referencedetail.js"></script>
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
    <script src="../fm/js/models/map.js"></script>
    <script src="../fm/js/models/curvechart.js"></script>
    <script src="../fm/js/models/barchart.js"></script>
    <script src="../fm/js/models/piechart.js"></script>

    <script src="../fm/js/models/column.js"></script>
    <script src="../fm/js/models/row.js"></script>
    <script src="../fm/js/models/form.js"></script>
    <script src="../fm/js/models/releasedform.js"></script>

    <script src="../om/js/orgs/userprofile.js"></script>
    <script src="../om/js/models/pcdesktopmwfview.js"></script>
    <script src="../om/js/models/pcdesktopswfview.js"></script>
    <script src="../om/js/models/pcdesktoprow.js"></script>
    <script src="../om/js/models/pcdesktopcolumn.js"></script>
    <script src="../om/js/models/pcdesktopicon.js"></script>
    <script src="../om/js/models/pcdesktopui.js"></script>
    <script src="../om/js/models/pcdesktopuiappview.js"></script>

    <script src="../admin/js/models/course/book.js"></script>
    <script src="../admin/js/models/course/video.js"></script>
    <script src="../admin/js/models/course/audio.js"></script>
    <script src="../admin/js/models/course/live.js"></script>

    <script src="js/data/clt_data_zh.js"></script>
    <script src="js/model/commentModel.js"></script>
    <script src="js/model/twoCommentModel.js"></script>
    <script src="js/model/mywork.js"></script>
    <script src="js/model/invoice.js"></script>

    <script src="js/dlg/createinvoicedialog.js"></script>
    <script src="js/pane/desktopauthiconpane.js"></script>
    <script src="js/pane/desktopiconpane.js"></script>
    <script src="js/pane/dashboard.js"></script>
    <script src="js/pane/newslistpane.js"></script>
    <script src="js/pane/bulletinboard.js"></script>
    <script src="js/pane/notifications.js"></script>
    <script src="js/pane/filemanager.js"></script>
    <script src="js/pane/addpane.js"></script>
    <script src="js/pane/queuepane.js"></script>
    <script src="js/pane/chatpane.js"></script>
    <script src="js/pane/myprofilepane.js"></script>
    <script src="js/pane/myfavorpane.js"></script>
    <script src="js/pane/myorderpane.js"></script>
    <script src="js/pane/mypaymentpane.js"></script>
    <script src="js/pane/myshoppingcartpane.js"></script>
    <script src="js/pane/myconfirmpaypane.js"></script>
    <script src="js/pane/updatepassword.js"></script>
    <script src="js/pane/myinvoicepane.js"></script>
    <script src="js/pane/mysettingpane.js"></script>
    <script src="js/pane/myfeedback.js"></script>
    <script src="js/pane/gethelppane.js"></script>
    <script src="js/pane/workingpane.js"></script>
    <script src="js/pane/workitemlistpane.js"></script>
    <script src="js/pane/workitemlisttabpanel4pc.js"></script>
    <script src="js/pane/searchresultpane.js"></script>
    <script src="js/pane/filemanagerpane.js"></script>
    <script src="js/pane/launchmwfpane.js"></script>
    <script src="js/pane/launchswfpane.js"></script>
    <script src="js/pane/newscontentpane.js"></script>
    <script src="js/pane/newsdetailpane.js"></script>
    <script src="js/pane/upldfiles.js"></script>
    <script src="js/pane/homeworkpane.js"></script>
    <script src="js/pane/studenthomeworkpane.js"></script>
    <script src="js/pane/backuploadfile.js"></script>
    <script src="js/pane/course_management/audioList.js"></script>
    <script src="js/pane/course_management/liveBoradList.js"></script>
    <script src="js/pane/course_management/videoList.js"></script>
    <script src="js/pane/course_management/bookList.js"></script>
    <script src="js/pane/course_management/bookview.js"></script>
    <script src="js/pane/course_management/contentservicepane.js"></script>
    <script src="js/clientundoredo.js"></script>
    <script src="js/clientservices.js"></script>
    <script src="js/clientmenubar.js"></script>
    <script src="js/clientleftmenubar.js"></script>
    <script src="js/foldernamedialog.js"></script>
    <script src="js/clientmaincontent.js"></script>

</head>
<body id="clientbody"></body>
<script>
    var otherComponents = [
        <%
            Staff[] staffs = login.getStaffships();
            StringBuffer sb = new StringBuffer();
            if (staffs != null) {
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
            } else {
                sb.append("{name: \"我的轩琦\", url: \"/client/me.jsp?sessionId=" + sessionId + "\"},");
            }%>
            <%=sb.toString()%>
    ];
    var ownerId = "";
    var mycate = "<%=mycate%>";
    var mypos = "<%=mypos%>";
    <%
      if (login.getStaffships()!=null && login.getStaffships().length>0) {
    %>
    ownerId = "<%=login.getStaffships()[0].getOwner()%>";
    <%
      }
    %>
    var scoket = new WebsocketClient("<%=basePath%>", "<%=sessionId%>", "<%=login.getUser().getId()%>", this);
    var service = new ClientService("<%=userid%>", "", "<%=sessionId%>");
    var nginxHost = "http://192.168.1.55/";
    var clientbody = document.getElementById("clientbody");
    var menu = $(clientbody).clientTopMenuBar({
        title: "我的轩琦",
        user: "<%= userid%>",
        userName: "<%=login.getUser().getFullName()%>",
        websocket: scoket,
        imgUrl: "<%=imgPath%>",
        sessionId: "<%=sessionId%>",
        ownerId: ownerId,
    });
    var menuBar = menu.data("clientTopMenuBar");
    var maincontent = $(clientbody).clientMainContent({
        id: "401",
        userId: "<%=userid%>",
        ownerId: ownerId,
        ownerName: "",
        imgUrl: "<%=imgPath%>",
        userName: "<%=login.getUser().getFullName()%>",
        websocket: scoket,
        sessionId: "<%=sessionId%>",
        mycate: mycate,
        mypos : mypos,// 我的Position ID
    });
    var clientmain = maincontent.data("clientMainContent");
    menuBar.maincontent = clientmain;

    var userId = "<%=userid%>";
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("userId", userId);
        localStorage.setItem("currtab" + userId, "client/me");
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState == "visible") {
                localStorage.setItem("currtab" + userId, "client/me");
            }
        })
    }

    //#wrapper
    $(document).ready(function () {
        $("#menu-toggle").click(function (e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });
    });

</script>
</html>
