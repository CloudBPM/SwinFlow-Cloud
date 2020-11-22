<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page session="true"%>

<!DOCTYPE html>
<html lang="zh-CN">
<head>
<title>轩琦科技 - 创意轩 - SaaS应用执行服务</title>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
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
<link rel="shortcut icon" href="favicon.ico" />
<%
	String port="8088";
	String staticUrl = request.getScheme() + "://" + request.getServerName() + ":" + port;
%>

<!-- Bootstrap core CSS -->
<link rel="stylesheet"
	href="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/css/bootstrap.min.css">
<link rel="stylesheet"
	href="<%=staticUrl%>/api/plugins/font-awesome-4.5.0/css/font-awesome.min.css">

<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>

<script src="js/panel/overviewpane.js"></script>

<script src="js/severservices.js"></script>
<script src="js/serverdashboard.js"></script>
<script src="js/serverstatusbar.js"></script>
<script src="js/progressbar.js"></script>
<script src="js/serverutils.js"></script>

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
var service = new ServerService();
var managerbody = document.getElementById("managerbody");
var maincontent = $(managerbody).serverDashboard({
	id : "svr001",
});
var main = maincontent.data("serverDashboard");

</script>

</body>
</html>