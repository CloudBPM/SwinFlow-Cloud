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
<title>轩琦科技 - 单位免费注册</title>
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
<link rel="stylesheet" href="<%=staticUrl%>/api/plugins/intltel/css/intlTelInput.css">
<!-- <link rel="stylesheet" href="../api/plugins/intltel/css/demo.css"> -->
<!-- Custom styles and js -->
<link rel="stylesheet" href="<%=staticUrl%>/api/css/custom.css">
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script type="text/javascript" src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/plugins/intltel/js/intlTelInput.min.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/plugins/intltel/js/utils.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/plugins/birthday-picker/jquery-birthday-picker.min.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/plugins/address/js/distpicker.data.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/plugins/address/js/distpicker.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/plugins/base64.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/js/common/basic.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/js/common/utils.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/js/common/data/data_zh.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/js/common/ui/alertbox.js"></script>
<script type="text/javascript" src="<%=staticUrl%>/api/js/common/ui/footer.js"></script>
<script type="text/javascript" src="js/omservices.js"></script>
<script type="text/javascript" src="js/orgs/abstractdepartment.js"></script>
<script type="text/javascript" src="js/orgs/organization.js"></script>
<script type="text/javascript" src="js/omsignupmenubar.js"></script>
<script type="text/javascript" src="js/omsignup4org.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<style type="text/css">
.iti-flag {
	background-image: url("<%=staticUrl%>/api/plugins/intltel/img/flags.png");
}

body {
	background-color: #fff;
}
</style>

</head>
<body id="mainbody" style="margin: 0px; padding: 0px">
	<script>
		$(document.getElementById("mainbody")).omSignupMenuBar({
			title : "轩琦科技 - 单位免费注册",
		});
		$(document.getElementById("mainbody")).omOrganizationSignup({
			title : "单位注册",
		});
		$(document.getElementById("mainbody")).footer({
			id : "",
		});
	</script>
</body>
<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/ie10-viewport-bug-workaround.js"></script>
</html>