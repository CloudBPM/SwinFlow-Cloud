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
    <title>轩琦科技 - 创意轩 - 大数据</title>
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
    <script src="<%=staticUrl%>/api/js/common/ui/confirmdialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/basic.js"></script>
    <script src="<%=staticUrl%>/api/js/common/utils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/data/data_zh.js"></script>

    <script src="../fm/js/models/component.js"></script>
    <script src="../fm/js/models/container.js"></script>
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

    <script src="../client/js/pane/launchmwfpane.js"></script>
    <script src="../client/js/pane/launchswfpane.js"></script>
    <script src="../client/js/clientundoredo.js"></script>

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

    <script src="js/bdmservice.js"></script>
    <script src="js/dlg/launchdialog.js"></script>
    <script src="js/pane/reportpreview.js"></script>
    <script src="js/pane/pageablereportpreview.js"></script>
    <script src="js/model/reportcell.js"></script>
    <script src="js/model/reportrow.js"></script>
    <script src="js/model/reportfield.js"></script>
    <script src="js/model/reportpage.js"></script>
    <script src="js/model/report.js"></script>
    <script src="js/model/reportservice.js"></script>


</head>
<body id="managerbody">

</body>

<script>
    var service = new BDMService("<%=userid%>", "", "<%=sessionId%>");
    var map = {};
    var managerbody = document.getElementById("managerbody");
    if ($(managerbody).reportServicePreview != undefined) {
        var plugin1 = $(managerbody).reportServicePreview({
            id: "rpttab4",
            pid: "<%=request.getParameter("prtid")%>",// report service Object Id
            basicpropsheet: null,
            propsheet: null,
            width: 100,
            height: 0,
            parent: this,
        });
        this.reportServicePreview = plugin1.data("reportServicePreview");
        this.reportServicePreview.initialize();
    }
</script>
</html>
