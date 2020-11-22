<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" %>
<%@ page session="false" %>
<%
	String port = "8088";
	String staticUrl = request.getScheme() + "://" + request.getServerName() + ":" + port;
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<title>轩琦科技 - 用户免费注册</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="renderer" content="webkit">
<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
      <script src="//cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
<link rel="shortcut icon" href="favicon.ico" />

<!-- Bootstrap core CSS -->
<link rel="stylesheet" href="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/css/bootstrap.min.css">
<!-- Custom styles and js -->
<link rel="stylesheet" href="<%=staticUrl%>/api/css/custom.css" rel="stylesheet">
<script type="text/javascript" src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/plugins/md5.js"></script>

<script type="text/javascript" src="<%=staticUrl%>/api/js/common/basic.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/js/common/ui/footer.js"></script>
<script type="text/javascript" src="js/orgs/userprofile.js"></script>

<script type="text/javascript" src="js/omsignupmenubar.js"></script>
<script type="text/javascript" src="js/omsignup4user.js"></script>


<style type="text/css">
body {
	background-color: #fff;
}
</style>
</head>
<body id="mainbody">
	<script>
		$(document.getElementById("mainbody")).omSignupMenuBar({
			title : "轩琦科技 - 用户免费注册",
		});
		$(document.getElementById("mainbody")).omSignin({
			title : "轩琦科技 - 用户免费注册",
			greeting : "您好",
			user : "",
		});
		$(document.getElementById("mainbody")).footer({
			id : "",
		});
	</script>
</body>

<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script	src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/ie10-viewport-bug-workaround.js"></script>

</html>