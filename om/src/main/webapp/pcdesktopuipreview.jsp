<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<%@ page session="false" %>
<%@ page import="java.util.*,com.cloudibpm.core.user.*" %>

<%@ page import="com.cloudibpm.core.session.utils.SessionUtils" %>
<%
    Login login = SessionUtils.getInstance().getLogin(request);
    String sessionId = SessionUtils.getInstance().getSessionId(request);
    if (login == null) {
        response.setContentType("text/html; charset=utf-8");
        response.sendRedirect("/login/logout.jsp");
        return;
    }
    String port = "8088";
    String staticUrl = request.getScheme() + "://" + request.getServerName() + ":" + port;
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + port + "/api/webSocket/";
    String imgPath=request.getScheme() + "://" + request.getServerName() + ":" + port + "/api/img";

%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>轩琦科技 - 创意轩 - 桌面设计预览</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="//cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <meta name="format-detection" content="telephone=no">
    <link rel="shortcut icon" href="favicon.ico"/>

    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/font-awesome-4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.css"/>
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/timepicker/timepicker.css"/>

    <script src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.14&key=a7978afe48e4f646cbf7e440d2909dfc"></script>
    <script src="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-addon.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-zh-CN.js"></script>
    <script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/echarts.js"></script>
    <script src="<%=staticUrl%>/api/js/common/basic.js"></script>
    <script src="<%=staticUrl%>/api/js/common/utils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/confirmdialog.js"></script>

    <!-- loading the fm models for desktop UI designing -->
    <script src="../fm/js/models/component.js"></script>
    <script src="../fm/js/models/assocrule.js"></script>
    <script src="../fm/js/models/expressions.js"></script>
    <script src="../fm/js/models/constant.js"></script>
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
    <!-- loading the fm models for desktop UI designing -->

    <script src="js/omservices.js"></script>
    <script src="js/models/pcdesktopswfview.js"></script>
    <script src="js/models/pcdesktopmwfview.js"></script>
    <script src="js/models/pcdesktopuiappview.js"></script>
    <script src="js/models/pcdesktoprow.js"></script>
    <script src="js/models/pcdesktopcolumn.js"></script>
    <script src="js/models/pcdesktopicon.js"></script>
    <script src="js/models/pcdesktopui.js"></script>
    <script src="js/orgs/category.js"></script>
    <script src="js/layouts/onecol.js"></script>
    <script src="js/layouts/onecol.js"></script>
    <script src="js/layouts/twocols.js"></script>
    <script src="js/layouts/threecols.js"></script>
    <script src="js/layouts/fourcols.js"></script>
    <script src="js/layouts/sixcols.js"></script>
    <script src="js/layouts/eightfourcols.js"></script>
    <script src="js/layouts/foureightcols.js"></script>
    <script src="js/layouts/desktopicon.js"></script>
    <script src="js/pcdesktoppreview.js"></script>


<body id="managerbody">
</body>

<script>
    var service = new OMService("<%=login.getUser().getId()%>", "", "<%=sessionId%>");
    var map = {};
    $(document.getElementById("managerbody")).pcDesktopPreview({
        id: "<%=request.getParameter("cid")%>",
        owner: "<%=request.getParameter("owner")%>",
    });
</script>
</html>
