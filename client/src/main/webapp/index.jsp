<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<%@ page session="false" %>
<%@ page
        import="java.util.*,
        		com.cloudibpm.core.user.*,
        		com.cloudibpm.core.util.*,
        		com.cloudibpm.core.util.encode.*,
        		org.codehaus.jackson.map.*,
        		org.apache.catalina.session.*"
%>
<%
    String port="8088";
    String staticUrl = request.getScheme() + "://" + request.getServerName() + ":" + port;
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>轩琦科技 - 我的轩琦</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="renderer" content="webkit">
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="//cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <meta name="format-detection" content="telephone=no">

    <link rel="shortcut icon" href="favicon.ico"/>
    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/font-awesome-4.5.0/css/font-awesome.min.css">
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
    <script src="<%=staticUrl%>/api/js/common/alertbox.js"></script>
    <!-- Custom styles and js -->
    <link href="css/client.css" rel="stylesheet">

</head>

<body>
<nav class="navbar navbar-default navbar-static-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed"
                    data-toggle="collapse" data-target="#navbar" aria-expanded="false"
                    aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span> <span
                    class="icon-bar"></span> <span class="icon-bar"></span> <span
                    class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">轩琦</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav navbar-right">
                <%
                    if (getServletContext() != null) {
                        String userid = request.getParameter("usr");
                        String token = request.getParameter("token");
                        String sessiondata = request.getParameter("sessiondata");
                        String username = null;
                        ServletContext context1 = getServletContext().getContext("/login");
                        if (context1 != null && userid != null && token != null) {
                            HttpSession session2 = (StandardSessionFacade) context1.getAttribute(userid);
                            try {
                                if (session2 == null || session2.getAttribute("loggedinstaff") == null) {
                                    response.setContentType("text/html; charset=utf-8");
                                    response.sendRedirect("/login/logout.jsp?usr=" + userid);
                                    return;
                                }
                            } catch (IllegalStateException e) {
                                response.setContentType("text/html; charset=utf-8");
                                response.sendRedirect("/login/logout.jsp?usr=" + userid);
                                return;
                            }
                            username = session2.getAttribute("username").toString();
                            String s = MD5Util.getMD5(token + username + userid + DateUtility.getCurrentDate());
                            if (!SecretKeyUtil.getInstance().recognizeKey(token) || !s.equals(sessiondata)) {
                                response.setContentType("text/html; charset=utf-8");
                                response.sendRedirect("/login/logout.jsp?usr=" + userid);
                                return;
                            } else {
                                Object obj = session2.getAttribute("loggedinstaff");
                                ObjectMapper mapper = new ObjectMapper();
                                mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                                Login loggedinstaff = mapper.readValue((String) obj, Login.class);

                                token = SecretKeyUtil.getInstance().createKey();
                                sessiondata = MD5Util.getMD5(token + username + userid + DateUtility.getCurrentDate());
                                String securitytoken = "?usr=" + userid + "&token=" + token + "&sessiondata=" + sessiondata;
                                Staff[] staffs = loggedinstaff.getStaffships();
                                List<String> auths = new ArrayList<String>();
                                if (staffs != null) {
                                    for (int i = 0; i < staffs.length; i++) {
                                        for (int j = 0; j < staffs[i].getAuthorizations().length; j++) {
                                            if (!auths.contains(staffs[i].getAuthorizations()[j])) {
                                                auths.add(staffs[i].getAuthorizations()[j]);
                                            }
                                        }
                                    }
                                }
                %>
                <li><a href="./me.jsp<%=securitytoken%>">您好，<%=loggedinstaff.getUser().getFullName()%>
                </a></li>
                <li><a href=""><span class="glyphicon glyphicon-th"></span></a></li>
                <li class="active"><a
                        href="/login/logout.jsp?usr=<%=loggedinstaff.getUser().getId()%>">
                    退出<span class="sr-only">(current)</span>
                </a></li>

                <script>
                    var userId = "<%=userid%>";
                    if (typeof(Storage) !== "undefined") {
                        localStorage.setItem("userId", userId);
                        localStorage.setItem("currtab" + userId, "client/index");
                        document.addEventListener("visibilitychange", function () {
                            if (document.visibilityState == "visible") {
                                localStorage.setItem("currtab" + userId, "client/index");
                            }
                        })
                    }

                </script>

                <%
                    }
                } else {
                %>
                <li><a href="/login">登录<span class="sr-only">(current)</span></a></li>
                <li><a href="/signin">注册</a></li>
                <li><a href=""><span class="glyphicon glyphicon-th"></span></a></li>
                <%
                        }
                    }
                %>

            </ul>
        </div>
        <!--/.nav-collapse -->
    </div>
</nav>
<div class="container-fluid">
    <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3"></div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <div class="row">
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>
                <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                    <div class="row">
                        <form>
                            <div class="form-group">
                                <p>&nbsp;</p>
                                <p>&nbsp;</p>
                                <p>&nbsp;</p>
                                <p>&nbsp;</p>
                                <h1 style="text-align: center">琦快搜索</h1>
                                <p>&nbsp;</p>
                                <p>&nbsp;</p>
                                <input type="text" class="form-control" name="searchit"
                                       id="searchit" placeholder="在琦快上搜索想要的软件或输入软件名"/>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>
            </div>
            <div class="row">
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>
                <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                    <div class="row">
                        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                            <div
                                    style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                                <div style="background: #eee; padding: 5px;">常用软件名称1</div>
                                <div></div>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                            <div
                                    style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                                <div style="background: #eee; padding: 5px;">常用软件名称2</div>
                                <div></div>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                            <div
                                    style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                                <div style="background: #eee; padding: 5px;">常用软件名称3</div>
                                <div></div>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                            <div
                                    style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                                <div style="background: #eee; padding: 5px;">常用软件名称4</div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>
            </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3"></div>
    </div>
</div>

<!-- /container -->

<!-- FOOTER -->
<footer class="footer_bg">
    <div id="footer-container" class="container">
        <div id="footer" class="footer-body">
            <div class="row clearfix">
                <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                    <span class="footer-title">资源中心</span>
                    <ul class="footer-link-list">
                        <li><a class="footer-link"
                               href="http://swinflowcloud.thss.tsinghua.edu.cn/docs/docs_index.html"
                               target="_blank">文档</a></li>
                        <li><a class="footer-link"
                               href="http://swinflowcloud.thss.tsinghua.edu.cn/resource/help.html"
                               target="_blank">帮助</a></li>
                        <li><a class="footer-link"
                               href="http://swinflowcloud.thss.tsinghua.edu.cn/resource/usercases.html"
                               target="_blank">用户案例</a></li>
                        <li><a class="footer-link"
                               href="http://swinflowcloud.thss.tsinghua.edu.cn/resource/sdks_tools.html"
                               target="_blank">SDKs &amp; Tools</a></li>
                        <li><a class="footer-link"
                               href="http://swinflowcloud.thss.tsinghua.edu.cn/resource/faqs.html"
                               target="_blank">常见问题</a></li>
                        <li><a class="footer-link"
                               href="http://swinflowcloud.thss.tsinghua.edu.cn/resource/articles.html"
                               target="_blank">文章</a></li>
                    </ul>

                </div>
                <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                    <span class="footer-title">关于</span>
                    <ul class="footer-link-list">
                        <li><a class="footer-link"
                               href="http://swinflowcloud.thss.tsinghua.edu.cn/about/events.html"
                               target="_blank">新闻</a></li>
                        <li><a class="footer-link"
                               href="http://swinflowcloud.thss.tsinghua.edu.cn/about/ourteam.html"
                               target="_blank">团队</a></li>
                        <li><a class="footer-link"
                               href="http://swinflowcloud.thss.tsinghua.edu.cn/about/contactus.html"
                               target="_blank">联系我们</a></li>
                    </ul>

                </div>
                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <span class="footer-title">我们的联系</span>
                    <ul class="footer-link-list">
                        <li><a class="footer-link"
                               href="https://groups.google.com/forum/#!forum/swinflow-cloud"
                               target="_blank">Google Group Mail List</a></li>
                        <li><a class="footer-link"
                               href="https://github.com/CloudBPM" target="_blank">GitHub</a></li>
                        <li><a class="footer-link"
                               href="http://au.linkedin.com/in/dahaicao" target="_blank">Linkedin</a></li>
                        <li><a class="footer-link"
                               href="https://www.facebook.com/jurassic.cao">Facebook</a></li>
                        <li><a class="footer-link"
                               href="http://stackoverflow.com/users/4503098/dahai"
                               target="_blank">Stackoverflow</a></li>
                        <li><a class="footer-link"
                               href="https://www.researchgate.net/profile/Dahai_Cao"
                               target="_blank">ResearchGate</a></li>
                    </ul>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12"></div>
            </div>

            <div class="row clearfix">
                <div
                        class="col-lg-8 col-md-8 col-sm-12 col-xs-12 pagination-left footer-link">
                    曹大海 &middot; 最后更新: 2017年3月28日 &middot; 维护: Webmaster (<a
                        href="mailto:dhcao92@gmail.com">dhcao92@gmail.com</a>)
                </div>
                <div
                        class="col-lg-4 col-md-4 col-sm-12 col-xs-12 pagination-right footer-link">
                    <span>&copy; 2017 SwinFlow-Cloud R &amp; D Team. 保留所有权利.</span>
                </div>
            </div>

        </div>
    </div>
</footer>
<!-- end of footer -->

<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->


<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script
        src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/ie10-viewport-bug-workaround.js"></script>

</body>
</html>