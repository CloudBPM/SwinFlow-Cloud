<%@ page import="com.cloud.core.session.redis.JedisUtil" %>
<%--
  Created by IntelliJ IDEA.
  User: mh
  Date: 2018/11/23
  Time: 17:47
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    //String str=JedisUtil.getInstance().set("123","123321");
    String str=JedisUtil.getInstance().get("123");
    JedisUtil.getInstance().flushAll();
    //str=JedisUtil.getInstance().set("123","redis");
    //JedisUtil.getInstance().expire("123",100);
%>
<%=str%>

