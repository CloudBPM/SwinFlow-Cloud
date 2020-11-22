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
    String imgPath = request.getScheme() + "://" + request.getServerName() + ":" + port + "/api/img";

%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>轩琦科技 - 创意轩 - 组织人事部</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta>
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

    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/font-awesome-4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/jstree/themes/default/style.min.css"/>
    <link rel="stylesheet"
          href="<%=staticUrl%>/api/plugins/fontawesome-iconpicker-1.3.0/css/fontawesome-iconpicker.min.css"/>
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.css"/>
    <link rel="stylesheet" href="<%=staticUrl%>/api/plugins/timepicker/timepicker.css"/>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="<%=staticUrl%>/api/plugins/jquery-2.1.1.min.js"></script>
    <script type="text/javascript"
            src="https://webapi.amap.com/maps?v=1.4.14&key=a7978afe48e4f646cbf7e440d2909dfc"></script>
    <script src="<%=staticUrl%>/api/plugins/jqueryui/jquery-ui.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<%=staticUrl%>/api/plugins/bootstrap-3.3.5/js/bootstrap.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-addon.js"></script>
    <script src="<%=staticUrl%>/api/plugins/timepicker/jquery-ui-timepicker-zh-CN.js"></script>
    <script src="<%=staticUrl%>/api/plugins/fontawesome-iconpicker-1.3.0/js/fontawesome-iconpicker.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/jstree/jstree.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/birthday-picker/jquery-birthday-picker.min.js"></script>
    <script src="<%=staticUrl%>/api/plugins/echarts.js"></script>

    <script src="<%=staticUrl%>/api/plugins/address/js/distpicker.data.js"></script>
    <script src="<%=staticUrl%>/api/plugins/address/js/distpicker.js"></script>
    <script src="<%=staticUrl%>/api/plugins/qrcode.min.js"></script>

    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<%=staticUrl%>/api/js/common/basic.js"></script>
    <script src="<%=staticUrl%>/api/js/common/utils.js"></script>
    <script src="<%=staticUrl%>/api/js/common/data/data_zh.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/statusbar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/progressbar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/alertbox.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/confirmdialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/messagedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/treeview.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/mcplugin.js"></script>
    <%--<script src="<%=staticUrl%>/api/js/common/ui/omuploadplugin.js"></script>--%>
    <script src="<%=staticUrl%>/api/js/common/ui/doupload.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/mainmenubar.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/readonlytableview.js"></script>
    <script src="<%=staticUrl%>/api/js/common/model/systemnotice.js"></script>
    <script src="<%=staticUrl%>/api/js/common/actions/websocketaction.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/sysmessagedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/slidemodaldialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/renamedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/selectiondialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/applytoonlinedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/qcodedialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/model/message.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/model/messageFormat.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/model/person.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/rightpane1.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/rightpane2.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/contactspane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/pane/sessionpane.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicationdialog.js"></script>
    <script src="<%=staticUrl%>/api/js/common/ui/communicationpane.js"></script>

    <script src="../pm/js/data/constant.js"></script>
    <script src="../pm/js/data/fileconstant.js"></script>

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

    <script src="js/models/pcdesktopmwfview.js"></script>
    <script src="js/models/pcdesktopswfview.js"></script>
    <script src="js/models/pcdesktopuiappview.js"></script>
    <script src="js/models/pcdesktoprow.js"></script>
    <script src="js/models/pcdesktopcolumn.js"></script>
    <script src="js/models/pcdesktopicon.js"></script>
    <script src="js/models/pcdesktopui.js"></script>
    <script src="js/layouts/onecol.js"></script>
    <script src="js/layouts/onecol.js"></script>
    <script src="js/layouts/twocols.js"></script>
    <script src="js/layouts/bigthreecols.js"></script>
    <script src="js/layouts/threecols.js"></script>
    <script src="js/layouts/fourcols.js"></script>
    <script src="js/layouts/sixcols.js"></script>
    <script src="js/layouts/eightfourcols.js"></script>
    <script src="js/layouts/foureightcols.js"></script>
    <script src="js/layouts/desktopicon.js"></script>

    <script src="js/dlg/errormessagedialog.js"></script>
    <script src="js/dlg/importnormalstaffdialog.js"></script>
    <script src="js/dlg/searchiddialog.js"></script>
    <script src="js/dlg/newuserdialog.js"></script>
    <script src="js/dlg/editauthoritydialog.js"></script>
    <script src="js/dlg/editgroupmemberdialog.js"></script>
    <script src="js/dlg/editjobassignmentdialog.js"></script>
    <script src="js/dlg/createmodeldialog.js"></script>
    <script src="js/dlg/mspluginstoredialog.js"></script>
    <script src="js/dlg/processstoredialog.js"></script>
    <script src="js/dlg/foldernamedialog.js"></script>
    <script src="js/dlg/delholidaydialog.js"></script>
    <script src="js/dlg/createholidaydialog.js"></script>
    <script src="js/dlg/delPerioddialog.js"></script>
    <script src="js/dlg/createPerioddialog.js"></script>

    <script src="js/orgs/abstractdepartment.js"></script>
    <script src="js/orgs/organization.js"></script>
    <script src="js/orgs/personstyle.js"></script>
    <script src="js/orgs/department.js"></script>
    <script src="js/orgs/division.js"></script>
    <script src="js/orgs/projectteam.js"></script>
    <script src="js/orgs/relationship.js"></script>
    <script src="js/orgs/textlabel.js"></script>
    <script src="js/orgs/abstractposition.js"></script>
    <script src="js/orgs/position.js"></script>
    <script src="js/orgs/projectrole.js"></script>
    <script src="js/orgs/staff.js"></script>
    <script src="js/orgs/userprofile.js"></script>
    <script src="js/orgs/userloginhistory.js"></script>
    <script src="js/orgs/authoritygroup.js"></script>
    <script src="js/orgs/groupmember.js"></script>
    <script src="js/orgs/authority.js"></script>
    <script src="js/orgs/groupmembereditlist.js"></script>
    <script src="js/orgs/jobassignment.js"></script>
    <script src="js/orgs/jobassignmenteditlist.js"></script>
    <script src="js/orgs/homepagetemplate.js"></script>
    <script src="js/orgs/constant.js"></script>
    <script src="js/orgs/fileconstant.js"></script>
    <script src="js/orgs/category.js"></script>

    <script src="js/models/mbbutton.js"></script>
    <script src="js/models/mbcol.js"></script>
    <script src="js/models/mbrow.js"></script>
    <script src="js/models/mbtopbaritem.js"></script>
    <script src="js/models/mbtopbar.js"></script>
    <script src="js/models/mbsearchbar.js"></script>
    <script src="js/models/mbcontentpanel.js"></script>
    <script src="js/models/mbboard.js"></script>
    <script src="js/models/mbui.js"></script>

    <script src="js/editors/textcelleditor.js"></script>
    <script src="js/editors/numbercelleditor.js"></script>
    <script src="js/editors/emailcelleditor.js"></script>
    <script src="js/editors/textareacelleditor.js"></script>
    <script src="js/editors/datecelleditor.js"></script>
    <script src="js/editors/bcselectcelleditor.js"></script>
    <script src="js/editors/bcdselectcelleditor.js"></script>
    <script src="js/editors/rankselectcelleditor.js"></script>
    <script src="js/editors/staffscaleselectcelleditor.js"></script>
    <script src="js/editors/phonenumbercelleditor.js"></script>
    <script src="js/editors/yesnocelleditor.js"></script>
    <script src="js/editors/statuscelleditor.js"></script>
    <script src="js/editors/orgnamecelleditor.js"></script>
    <script src="js/editors/webcelleditor.js"></script>
    <script src="js/editors/dateselector.js"></script>
    <script src="js/editors/userfullnamecelleditor.js"></script>
    <script src="js/editors/usergendercelleditor.js"></script>
    <script src="js/editors/simpledatecelleditor.js"></script>
    <script src="js/editors/useridtypecelleditor.js"></script>
    <script src="js/editors/useridnumcelleditor.js"></script>
    <script src="js/editors/usertextpropcelleditor.js"></script>
    <script src="js/editors/usertextareapropcelleditor.js"></script>
    <script src="js/editors/usernumpropcelleditor.js"></script>
    <script src="js/editors/staffpropselectcelleditor.js"></script>
    <script src="js/editors/stafftextpropcelleditor.js"></script>
    <script src="js/editors/stafftextapropcelleditor.js"></script>
    <script src="js/editors/staffphonenumpropcelleditor.js"></script>
    <script src="js/editors/staffdatecelleditor.js"></script>
    <script src="js/editors/grouptextpropcelleditor.js"></script>
    <script src="js/editors/grouptextareapropcelleditor.js"></script>
    <script src="js/editors/hpvaluecelleditor.js"></script>
    <script src="js/editors/hpskineditor.js"></script>
    <script src="js/editors/selectcelleditor.js"></script>
    <script src="js/editors/mbnamecelleditor.js"></script>
    <script src="js/editors/fontfamilycelleditor.js"></script>
    <script src="js/editors/fontsizecelleditor.js"></script>
    <script src="js/editors/fontweightcelleditor.js"></script>
    <script src="js/editors/colorselectcelleditor.js"></script>
    <script src="js/editors/dticonnamecelleditor.js"></script>
    <script src="js/editors/heightselecteditor.js"></script>

    <script src="js/pane/upldfiles.js"></script>
    <script src="js/pane/listfilepane.js"></script>
    <script src="js/pane/staffhistorypanel.js"></script>
    <script src="js/pane/loginhistorypane.js"></script>
    <script src="js/pane/assignhistorypane.js"></script>
    <script src="js/pane/organizationeditpanel.js"></script>
    <script src="js/pane/groupmemberauthoritypanel.js"></script>
    <script src="js/pane/groupmemberpane.js"></script>
    <script src="js/pane/authoritylistpane.js"></script>
    <script src="js/pane/positioncateeditpane.js"></script>
    <script src="js/pane/positioncalendarsetting.js"></script>
    <script src="js/pane/positionovertimework.js"></script>
    <script src="js/pane/positionmemberpane.js"></script>
    <script src="js/pane/positionkpipane.js"></script>
    <script src="js/pane/positionproppanel.js"></script>
    <script src="js/pane/orgdiskpanel.js"></script>
    <script src="js/pane/orgsitepanel.js"></script>
    <script src="js/pane/orgpaypanel.js"></script>
    <script src="js/pane/firstpagepanel.js"></script>
    <script src="js/pane/orginformationpanel.js"></script>
    <script src="js/pane/orgproductspanel.js"></script>
    <script src="js/pane/orgnewpanel.js"></script>
    <script src="js/pane/filemanagecontent.js"></script>
    <script src="js/pane/departcatepane.js"></script>
    <script src="js/pane/positioncatepane.js"></script>
    <script src="js/pane/mbbuttonpane.js"></script>
    <script src="js/pane/mbbuttonpanel.js"></script>
    <script src="js/pane/inheriteduipane.js"></script>
    <script src="js/pane/mbuipanel.js"></script>
    <script src="js/pane/deparmenteditpanel.js"></script>
    <script src="js/pane/pcdesktopappiconpane.js"></script>
    <script src="js/pane/pcdesktopuiiconpanel.js"></script>
    <script src="js/pane/pcdesktopappsettingpane.js"></script>

    <script src="js/omservices.js"></script>
    <script src="js/basicpropertysheet.js"></script>
    <script src="js/propertysheet.js"></script>
    <script src="js/orgundoredo.js"></script>
    <script src="js/omorganiztioneditor.js"></script>
    <script src="js/omofficecalendareditor.js"></script>
    <script src="js/omHoliday.js"></script>
    <script src="js/omdivisioneditor.js"></script>
    <script src="js/omdepartmenteditor.js"></script>
    <script src="js/omprojectteameditor.js"></script>
    <script src="js/omstaffeditor.js"></script>
    <script src="js/omgroupeditor.js"></script>
    <script src="js/homepageeditor.js"></script>
    <script src="js/omuploadplugin.js"></script>
    <script src="js/filemanagementeditor.js"></script>
    <script src="js/paymenteditor.js"></script>
    <script src="js/licenceeditor.js"></script>
    <script src="js/pcdesktopeditor.js"></script>
    <script src="js/ommbuieditor.js"></script>
    <script src="js/categoryeditor.js"></script>
    <script src="js/ommaincontent.js"></script>

    <style type="text/css">
        .col {
            float: left;
            position: relative;
            min-height: 1px;
        }
    </style>
</head>
<body id="managerbody"></body>
<script>
    var otherComponents = [
        <%
            Staff[] staffs = login.getStaffships();
            List<String> auths = new ArrayList<String>();
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < staffs.length; i++) {
                for (int j = 0; j < staffs[i].getAuthorizations().length; j++) {
                    if (!auths.contains(staffs[i].getAuthorizations()[j])) {
                        auths.add(staffs[i].getAuthorizations()[j]);
                    }
                }
            }
            sb.append("{name: \"首页\", url: \"/client/me.jsp?sessionId=" + sessionId+ "\"},");
            if (auths.contains("0000000002")) {
                sb.append("{name: \"组织人事部\", url: \"/om/ommain.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000001")) {
                sb.append("{name: \"应用坊\", url: \"/pm/pmmain.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000003")) {
                sb.append("{name: \"微服务库\", url: \"/am/ammain.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000004")) {
                sb.append("{name: \"表单居\", url: \"/fm/fmmain.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000005")) {
                sb.append("{name: \"服务台\", url: \"/admin/admin.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000006")) {
                sb.append("{name: \"我的轩琦\", url: \"/client/me.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000007")) {
                sb.append("{name: \"服务器\", url: \"/svm/svmmain.jsp?sessionId=" + sessionId + "\"},");
            }
            if (auths.contains("0000000008")) {
                sb.append("{name: \"大数据\", url: \"/bdm/bdmmain.jsp?sessionId=" + sessionId + "\"},");
            }
        %>
        <%=sb.toString()%>
    ];
    // var lastTime = new Date().getTime();
    // var currentTime = new Date().getTime();
    // var timeOut = 5 * 60 * 1000; //设置超时时间： 5分
    // $(function () {
    //     /* 鼠标移动事件 */
    //     $(document).mouseover(function () {
    //         lastTime = new Date().getTime(); //更新操作时间
    //     });
    // });
    // function testTime() {
    //     currentTime = new Date().getTime(); //更新当前时间
    //     if (currentTime - lastTime > timeOut) { //判断是否超时
    //         console.log("超时");
    //     }
    // }
    // /* 定时器  间隔1秒检测是否长时间未操作页面  */
    // window.setInterval(testTime, 1000);

    var omservices = new OMService("<%=login.getUser().getId()%>", "", "<%=sessionId%>");
    var service = new OMService("<%=login.getUser().getId()%>", "", "<%=sessionId%>");
    var managerbody = document.getElementById("managerbody");
    // var message = $(managerbody).messageDialog({
    //     id: "",
    //     title: vendor + " - 提示",
    //     parent: this,
    // });
    // var messageDialog = message.data("messageDialog");

    var menuBar = null;
    if ($(managerbody).mainMenuBar != undefined) {
        var menu = $(managerbody).mainMenuBar({
            title: "创意轩",
            greeting: "您好，<%=login.getUser().getFullName()%>	",
            userName: "<%=login.getUser().getFullName()%>",
            userId: "<%=login.getUser().getId()%>",
            sessionId: "<%=sessionId%>",
            owner: "<%=login.getStaffships()[0].getOwner()%>",
            menuname: "组织人事部",
            mopt: [1, 1, 0],
            websocket: new WebsocketClient("<%=basePath%>", "<%=sessionId%>",
                "<%=login.getUser().getId()%>", this),
            imgUrl: "<%=imgPath%>"
        });
        menuBar = menu.data("mainMenuBar");
    }
    var maincontent = $(managerbody).mainContent({
        id: "201",
        uid: "<%= login.getUser().getId()%>",
    });

    var main = maincontent.data("mainContent");
    menuBar.setManager(main);
    main.menubar = menuBar;
    $(managerbody).statusBar({
        title: "状态条",
    });
    // menuBar.putMessage(message);
    var userId = "<%=login.getUser().getId()%>";
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("userId", userId);
        //first open tab
        localStorage.setItem("currtab" + userId, "om");
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState == "visible") {
                //change tab front
                localStorage.setItem("currtab" + userId, "om");
            }
        })
    }


</script>
</html>
