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

    String basePath = request.getScheme() + "://"  + request.getServerName() + ":" + port + "/api/webSocket/";
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>轩琦科技 - 创意轩 - 表单预览</title>
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
    <script src="<%=staticUrl%>/api/plugins/echarts.js"></script>
    <script src="<%=staticUrl%>/api/plugins/qrcode.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/mediareader/jquery.media.js"></script>
    <!-- CEditor plugin -->
    <script src="<%=staticUrl%>/api/plugins/ckeditor_4.10.0_full/ckeditor/ckeditor.js"></script>
    <!-- jQuery Date time picker plugin -->
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-addon.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-zh-CN.js"></script>

    <script src="<%=staticUrl%>/api/js/common/basic.js"></script>
    <script src="<%=staticUrl%>/api/js/common/utils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/data/data_zh.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/alertbox.js"></script>

    <!-- Include all compiled plugins (below), or include individual files as needed -->

    <script src="../bdm/js/model/reportcell.js"></script>
    <script src="../bdm/js/model/reportfield.js"></script>
    <script src="../bdm/js/model/reportrow.js"></script>
    <script src="../bdm/js/model/report.js"></script>
    <script src="../bdm/js/model/reportpage.js"></script>
    <script src="../bdm/js/model/reportservice.js"></script>

    <script src="js/models/component.js"></script>
    <script src="js/models/constant.js"></script>
    <script src="js/models/expressions.js"></script>
    <script src="js/models/assocrule.js"></script>
    <script src="js/models/reference.js"></script>
    <script src="js/models/referencedetail.js"></script>
    <script src="js/models/container.js"></script>
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
    <script src="js/models/richtextinput.js"></script>
    <script src="js/models/filereader.js"></script>
    <script src="js/models/filereaders.js"></script>
    <script src="js/models/column.js"></script>
    <script src="js/models/row.js"></script>
    <script src="js/models/form.js"></script>
    <script src="js/models/releasedform.js"></script>

    <script src="js/layouts/onecol.js"></script>
    <script src="js/layouts/twocols.js"></script>
    <script src="js/layouts/threecols.js"></script>
    <script src="js/layouts/fourcols.js"></script>
    <script src="js/layouts/sixcols.js"></script>
    <script src="js/layouts/eightfourcols.js"></script>
    <script src="js/layouts/foureightcols.js"></script>

    <script src="js/fmpreviewpanel.js"></script>
    <script src="js/fmservice.js"></script>
    <script src="js/fmundoredo.js"></script>

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

    var service = new FMService("<%=userid%>", "", "<%=sessionId%>");
    var managerbody = document.getElementById("managerbody");
    $(managerbody).formPreviewPanel({
        id: "F0010",
        fid: Utils.fetchetQueryString("fid"),
        r: Utils.fetchetQueryString("r"),
    });

</script>
</html>

