<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="com.cloud.core.session.redis.JedisUtil" %>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<%
	Cookie[] cookies = request.getCookies();
	Cookie cookie = null;
	String sessionId = null;
	if(cookies !=null) {
		for (Cookie item : cookies) {
			if (StringUtils.equals("sessionId", item.getName())) cookie = item;
		}
	}
	if(cookie!=null){
	    sessionId=cookie.getValue();
	    cookie.setMaxAge(0);
	    response.addCookie(cookie);
	}else{
	    sessionId=request.getParameter("sessionId");
	}
	if(sessionId!=null){
		JedisUtil.getInstance().del(sessionId);
	}
	response.sendRedirect("/login");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>退出系统</title>
</head>
<body>

</body>
</html>