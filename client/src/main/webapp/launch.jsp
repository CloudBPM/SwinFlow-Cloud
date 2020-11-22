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

    // http://www.bootply.com/EOgJSIzPGS# 这个页面的代码来源于此。
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
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/font-awesome-4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.css"/>
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/timepicker/timepicker.css"/>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.14&key=a7978afe48e4f646cbf7e440d2909dfc"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-addon.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-zh-CN.js"></script>
    <script src="<%=staticUrl%>/api/plugins/mediareader/jquery.media.js"></script>
    <script src="<%=staticUrl%>/api/plugins/echarts.js"></script>
    <script src="<%=staticUrl%>/api/plugins/md5.js"></script>
    <script src="<%=staticUrl%>/api/js/common/basic.js"></script>
    <script src="<%=staticUrl%>/api/js/common/utils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/data/data_zh.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/confirmdialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/actions/websocketaction.js"></script>

    <script src="../om/js/orgs/userprofile.js"></script>
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

    <script src="js/clientservices.js"></script>
    <script src="js/clientundoredo.js"></script>
    <script src="js/pane/launchswfpane.js"></script>
    <script src="js/pane/launchmwfpane.js"></script>

</head>
<body id="clientbody">
</body>
<script>
    var map = {};
    var service = new ClientService("<%=userid%>", "", "<%=sessionId%>");
    var mainContent = document.getElementById("clientbody");
    if ($(mainContent).launchSWfPane != undefined) {
        var board = $(mainContent).launchSWfPane({
            id : "launchSWfPane",
            parent : this,
        });
        this.launchSWfPane = board.data("launchSWfPane");
    }

    if ($(mainContent).launchMWfPane != undefined) {
        var board = $(mainContent).launchMWfPane({
            id : "launchMWfPane",
            parent : this,
        });
        this.launchMWfPane = board.data("launchMWfPane");
    }
    var that = this;
    this.pid = Utils.fetchetQueryString("pid");// definition Id
    $.get(service.api("LL0"), {
        pid : pid,// definition id;
    }).complete(function(data) {
        var p = data.responseJSON;
        if (p != null) {
            if (p.workflowType == 1) { // single wf
                that.launchMWfPane.loading(pid);
            } else if (p.workflowType == 2) { // multiple wf
                that.launchMWfPane.loading(pid);
            }
        }
    });
</script>
</html>

