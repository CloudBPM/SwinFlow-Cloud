<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<%
    String port="8088";
    String staticUrl = request.getScheme() + "://" + request.getServerName() + ":" + port;
//    String staticUrl="localhost:8088";
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>轩琦科技 - 商店</title>
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
    <meta name="format-detection" content="telephone=no">
    <link rel="shortcut icon" href="favicon.ico"/>

    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/font-awesome-4.5.0/css/font-awesome.min.css">
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>

    <!-- Custom styles and js -->
    <link href="css/vendors.css" rel="stylesheet">
    <link href="css/carousel.css" rel="stylesheet">

    <script src="js/carousel.js"></script>
</head>

<body>
<div class="container-fluid">
    <nav class="navbar navbar-default navbar-fixed-top">
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
                    <li><a href="">您好，曹大海</a></li>
                    <li><a href=""><span class="glyphicon glyphicon-th"></span></a></li>
                    <li class="active"><a href="">退出<span class="sr-only">(current)</span></a></li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </nav>

    <div class="container" id="mycontainer">
        <!-- Carousel ================================================== -->
        <script>
            var p3 = $(document.getElementById("mycontainer")).carousel({
                id: "016",
            });
            this.carousel = p3.data("carousel");
            this.carousel.createIndicator("0", "active");
            this.carousel.createIndicator("1");
            this.carousel.createIndicator("2");
            this.carousel.createBanner("first-slide", "", "H1",
                "图片1", "图片1", "active");
            this.carousel.createBanner("second-slide", "", "H1",
                "图片2", "图片2");
            this.carousel.createBanner("third-slide", "", "H1",
                "图片3", "图片3");
        </script>
        <!-- /.carousel -->


    </div>
    <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3"></div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <div class="row">
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>
                <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                    <div class="row">
                        <form>
                            <div class="form-group">
                                <input type="text" class="form-control" name="searchit"
                                       id="searchit" placeholder="在琦快上搜索想要的软件或输入软件名"/>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>
            </div>
            <div class="row">
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">某点菜软件1</div>
                        <div style="padding: 5px;">
                            购买价：￥1000<br> 使用价：￥1/次<br>已经10万+人评价<br>运行次数：10万
                        </div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">酒楼管理2</div>
                        <div style="padding: 5px;">
                            购买价：￥1500<br> 使用价：￥1.3/次<br>已经8万+人评价<br>运行次数：50万
                        </div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">快餐连锁3</div>
                        <div style="padding: 5px;">
                            购买价：￥3500<br> 使用价：￥2.4/次<br>已经29万+人评价<br>运行次数：100万
                        </div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">光碟租售4</div>
                        <div style="padding: 5px;">
                            购买价：免费<br> 使用价：免费<br>已经5万+人评价<br>运行次数：13万
                        </div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称5</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称6</div>
                        <div></div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称1</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称2</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称3</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称4</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称5</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称6</div>
                        <div></div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称1</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称2</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称3</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称4</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称5</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称6</div>
                        <div></div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称1</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称2</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称3</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称4</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称5</div>
                        <div></div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
                    <div
                            style="width: 150px; height: 120px; border: solid #ddd 1px; border-radius: 3px;">
                        <div style="background: #eee; padding: 5px;">软件名称6</div>
                        <div></div>
                    </div>
                </div>
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
                    轩琦科技 &middot; 最后更新: 2018年5月26日 &middot; 维护: Webmaster (<a
                        href="mailto:cdh@xuanqiyun.com">cdh@xuanqiyun.com</a>)
                </div>
                <div
                        class="col-lg-4 col-md-4 col-sm-12 col-xs-12 pagination-right footer-link">
                    <span>&copy; 2018 杭州轩琦信息科技有限公司 保留所有权利.</span>
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
<%
    String userid = request.getParameter("usr");
%>
<script
        src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/ie10-viewport-bug-workaround.js">
    var userId = "<%=userid%>";
    if (typeof(Storage) !== "undefined") {
        //console.log("localStorage:");
        //console.log(localStorage);
        localStorage.setItem("userId", userId);
        localStorage.setItem("currtab" + userId, "vendors");
        document.addEventListener("visibilitychange", function () {

            if (document.visibilityState == "visible") {
                localStorage.setItem("currtab" + userId, "vendors");
                //console.log(localStorage.getItem("currtab" + userId));
            }
        })
    }

</script>

</body>
</html>