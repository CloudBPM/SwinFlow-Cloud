/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "myPaymentPane";
    var defaults = {
        id: "",
    };

    var Board = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
        this.loading()
    };

    Board.prototype.init = function (options) {
        this.board = document.createElement("DIV");
        this.element.appendChild(this.board);
        this.show(false);

        var panel = document.createElement("DIV");
        this.board.appendChild(panel);
        panel.className = "container-fluid";

        // row0
        var panelRow0 = document.createElement("DIV");
        panel.appendChild(panelRow0);
        panelRow0.className = "row";

        var panelCol0 = document.createElement("DIV");
        panelRow0.appendChild(panelCol0);
        panelCol0.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        this.createTitle(panelCol0, "fa fa-credit-card", "服务订购", "#1129dc");

        // row1
        var panelRow1 = document.createElement("DIV");
        panel.appendChild(panelRow1);
        panelRow1.className = "row";

        var panelCol41 = document.createElement("DIV");
        panelRow1.appendChild(panelCol41);
        panelCol41.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";

        // var panelCol42 = document.createElement("DIV");
        // panelRow1.appendChild(panelCol42);
        // panelCol42.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";
        //
        // var panelCol43 = document.createElement("DIV");
        // panelRow1.appendChild(panelCol43);
        // panelCol43.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";
        //
        // var panelCol44 = document.createElement("DIV");
        // panelRow1.appendChild(panelCol44);
        // panelCol44.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";

        this.createBasicServicePricingPane(panelCol41);

        // ----------------
        // this.createPricingPane(panelCol41, "基础开发", 499);
        // this.createPricingPane(panelCol42, "中级开发服务", 699);
        // this.createPricingPane(panelCol43, "高级开发服务", 999);

        // // row2
        // var panelRow2 = document.createElement("DIV");
        // panel.appendChild(panelRow2);
        // panelRow2.className = "row";
        //
        // var row2Col0 = document.createElement("DIV");
        // panelRow2.appendChild(row2Col0);
        // row2Col0.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        //
        // this.createTitle(row2Col0, "fa fa-credit-card fa-lg", "支付方式", "blue");
        //
        // // row3
        // var panelRow3 = document.createElement("DIV");
        // panel.appendChild(panelRow3);
        // panelRow3.className = "row";
        //
        // var row3Col0 = document.createElement("DIV");
        // panelRow3.appendChild(row3Col0);
        // row3Col0.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        //
        // var payPanel = document.createElement("DIV");
        // row3Col0.appendChild(payPanel);
        // payPanel.className = "panel panel-default";
        // var payBodyPanel = document.createElement("DIV");
        // payPanel.appendChild(payBodyPanel);
        // payBodyPanel.className = "panel-body";
        //
        // var payPane = document.createElement("DIV");
        // payBodyPanel.appendChild(payPane);
        //
        // var payImg = document.createElement("img");
        // payPane.appendChild(payImg);
        // payImg.src = "img/payqucode.png";


    };
    Board.prototype.loading =function(){
        $("#progressbar").show();
        var that = this;
        $.post(service.api(27), {
            productId: "0000000001",
        }).complete(function(data) {
            console.log(data);
            if (data.responseJSON.codeMessage.message==="success"){
                that.basicBuyButton.disabled = true;
                that.basicBuyButton.innerHTML="您已经购买该产品,无需重复购买。"
            }
            $("#progressbar").hide();
        });
    };

    Board.prototype.createTitle = function (parent, icon, title, color) {
        var titleSpan = document.createElement("SPAN");
        parent.appendChild(titleSpan);

        var h3 = document.createElement("H3");
        titleSpan.appendChild(h3);
        h3.className = "page-header";
        h3.style.margin = "0";

        var span = document.createElement("SPAN");
        h3.appendChild(span);
        span.className = icon;
        span.setAttribute("aria-hidden", "true");
        span.style.color = color;

        var text = document.createTextNode(" " + title);
        h3.appendChild(text);

        return titleSpan;
    };

    Board.prototype.createBasicServicePricingPane = function (parent) {
        var contentPanel = document.createElement("DIV");
        parent.appendChild(contentPanel);
        contentPanel.className = "panel panel-default";
        contentPanel.style.marginTop = "10px";
        contentPanel.style.backgroundColor = "#198af3";
        contentPanel.style.borderColor = "#017df3";

        var bodyPanel = document.createElement("DIV");
        contentPanel.appendChild(bodyPanel);
        bodyPanel.className = "panel-body";

        // title
        var row1 = document.createElement("DIV");
        bodyPanel.appendChild(row1);
        row1.className = "row";

        var col1 = document.createElement("DIV");
        row1.appendChild(col1);
        col1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        var title = document.createElement("P");
        col1.appendChild(title);
        title.className = "text-center";

        var head41 = document.createElement("H2");
        title.appendChild(head41);
        head41.innerHTML = "基础开发";
        head41.style.color = "#fff";

        // description
        var row2 = document.createElement("DIV");
        bodyPanel.appendChild(row2);
        row2.className = "row";

        var col2 = document.createElement("DIV");
        row2.appendChild(col2);
        col2.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        var p2 = document.createElement("P");
        col2.appendChild(p2);
        p2.className = "text-center";
        p2.innerHTML = "适合初次学习SaaS开发的人，了解开发环境，学习如何使用基本服务"
        p2.style.color = "#fff";

        // pricing
        var row3 = document.createElement("DIV");
        bodyPanel.appendChild(row3);
        row3.className = "row";

        var col3 = document.createElement("DIV");
        row3.appendChild(col3);
        col3.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        col3.style.backgroundColor = "#fff";

        var p3 = document.createElement("H1");
        col3.appendChild(p3);
        p3.className = "text-center";
        p3.innerHTML = "599元";

        var row4 = document.createElement("DIV");
        bodyPanel.appendChild(row4);
        row4.className = "row";

        var col4 = document.createElement("DIV");
        row4.appendChild(col4);
        col4.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        col4.style.backgroundColor = "#fff";

        var p4 = document.createElement("P");
        col4.appendChild(p4);
        p4.className = "text-center";
        p4.appendChild(document.createTextNode("内含"));
        var hdnum = document.createElement("SPAN");
        p4.appendChild(hdnum);
        hdnum.style.fontSize = "20px";
        hdnum.innerHTML = "20";
        p4.appendChild(document.createTextNode("功能服务"));

        var p5 = document.createElement("P");
        col4.appendChild(p5);
        p5.className = "text-center";

        var dl1 = document.createElement("dl");
        p5.appendChild(dl1);

        var dt1 = document.createElement("dt");
        dl1.appendChild(dt1);
        dt1.innerHTML = "组织人事部 —— 政府企事业单位管理";
        dt1.style.color = "#017df3";
        dt1.style.fontSize = "16px";

        this.createDD(dl1, "组织结构管理", "#80b7ea");
        this.createDD(dl1, "岗位结构管理", "#80b7ea");
        this.createDD(dl1, "权限管理", "#80b7ea");
        this.createDD(dl1, "用户管理", "#80b7ea");
        this.createDD(dl1, "（单位）文件管理", "#80b7ea");

        var dt2 = document.createElement("dt");
        dl1.appendChild(dt2);
        dt2.innerHTML = "应用坊 —— SaaS应用管理";
        dt2.style.color = "#017df3";
        dt2.style.fontSize = "16px";

        this.createDD(dl1, "应用过程设计", "#80b7ea");
        this.createDD(dl1, "应用过程变量设计", "#80b7ea");
        this.createDD(dl1, "应用过程任务设计及属性设置", "#80b7ea");
        this.createDD(dl1, "应用过程任务表单与数据变量绑定", "#80b7ea");
        this.createDD(dl1, "应用版本创建", "#80b7ea");
        this.createDD(dl1, "应用上线下线", "#80b7ea");

        var dt3 = document.createElement("dt");
        dl1.appendChild(dt3);
        dt3.innerHTML = "表单居 —— SaaS应用用户界面设计管理";
        dt3.style.color = "#017df3";
        dt3.style.fontSize = "16px";

        this.createDD(dl1, "表单设计", "#80b7ea");
        this.createDD(dl1, "表单组件属性设置", "#80b7ea");
        this.createDD(dl1, "表单版本创建", "#80b7ea");
        this.createDD(dl1, "表单上线下线", "#80b7ea");
        this.createDD(dl1, "表单预览", "#80b7ea");

        var dt4 = document.createElement("dt");
        dl1.appendChild(dt4);
        dt4.innerHTML = "大数据 —— SaaS应用大数据管理";
        dt4.style.color = "#017df3";
        dt4.style.fontSize = "16px";

        this.createDD(dl1, "大数据普通报表设计", "#80b7ea");
        this.createDD(dl1, "大数据分页报表设计", "#80b7ea");
        this.createDD(dl1, "大数据报表导出", "#80b7ea");
        this.createDD(dl1, "大数据报表预览", "#80b7ea");

        //
        // var i43 = document.createElement("i");
        // p2.appendChild(i43);
        // i43.className = "fa fa-jpy fa-lg";
        //
        // var font43 = document.createElement("font");
        // i43.appendChild(font43);
        // font43.style.fontSize = "20pt";
        // font43.innerHTML = pricing + "每年";

    };

    Board.prototype.createDD = function (parent, content, color) {
        var dt = document.createElement("dt");
        parent.appendChild(dt);

        var itag = document.createElement("i");
        itag.className = "fa fa-check";
        dt.appendChild(itag);
        dt.appendChild(document.createTextNode(content));
        dt.style.color = color;
        return dt;
    };


    Board.prototype.createBasicServicePricingPane = function (parent) {
        var contentPanel = document.createElement("DIV");
        parent.appendChild(contentPanel);
        contentPanel.className = "panel panel-default";
        contentPanel.style.marginTop = "10px";
        contentPanel.style.backgroundColor = "#198af3";
        contentPanel.style.borderColor = "#017df3";

        var bodyPanel = document.createElement("DIV");
        contentPanel.appendChild(bodyPanel);
        bodyPanel.className = "panel-body";

        // title
        var row1 = document.createElement("DIV");
        bodyPanel.appendChild(row1);
        row1.className = "row";

        var col1 = document.createElement("DIV");
        row1.appendChild(col1);
        col1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        var title = document.createElement("P");
        col1.appendChild(title);
        title.className = "text-center";

        var head41 = document.createElement("H2");
        title.appendChild(head41);
        head41.innerHTML = "基础开发";
        head41.style.color = "#fff";

        // description
        var row2 = document.createElement("DIV");
        bodyPanel.appendChild(row2);
        row2.className = "row";

        var col2 = document.createElement("DIV");
        row2.appendChild(col2);
        col2.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        var p2 = document.createElement("P");
        col2.appendChild(p2);
        p2.className = "text-center";
        p2.innerHTML = "适合初次学习SaaS开发的人，了解开发环境，学习如何使用基本服务"
        p2.style.color = "#fff";

        // pricing
        var row3 = document.createElement("DIV");
        bodyPanel.appendChild(row3);
        row3.className = "row";

        var col3 = document.createElement("DIV");
        row3.appendChild(col3);
        col3.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        col3.style.backgroundColor = "#fff";

        var p3 = document.createElement("H1");
        col3.appendChild(p3);
        p3.className = "text-center";
        p3.innerHTML = "599元";

        var row4 = document.createElement("DIV");
        bodyPanel.appendChild(row4);
        row4.className = "row";
        row4.style.backgroundColor = "#fff";

        var col4 = document.createElement("DIV");
        row4.appendChild(col4);
        col4.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        this.basicBuyButton = document.createElement("BUTTON");
        col4.appendChild(this.basicBuyButton);
        this.basicBuyButton.className = "btn btn-primary btn-block";
        this.basicBuyButton.innerHTML = "立即选购";
        this.basicBuyButton.addEventListener("click", this, false);

        var row5 = document.createElement("DIV");
        bodyPanel.appendChild(row5);
        row5.className = "row";

        var col5 = document.createElement("DIV");
        row5.appendChild(col5);
        col5.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        col5.style.backgroundColor = "#fff";

        var p4 = document.createElement("P");
        col5.appendChild(p4);
        p4.className = "text-center";
        p4.appendChild(document.createTextNode("内含"));
        var hdnum = document.createElement("SPAN");
        p4.appendChild(hdnum);
        hdnum.style.fontSize = "20px";
        hdnum.innerHTML = "20";
        p4.appendChild(document.createTextNode("功能服务"));

        var p5 = document.createElement("P");
        col5.appendChild(p5);
        p5.className = "text-center";

        var dl1 = document.createElement("dl");
        p5.appendChild(dl1);

        var dt1 = document.createElement("dt");
        dl1.appendChild(dt1);
        dt1.innerHTML = "组织人事部 —— 政府企事业单位管理";
        dt1.style.color = "#017df3";
        dt1.style.fontSize = "16px";

        this.createDD(dl1, "组织结构管理", "#80b7ea");
        this.createDD(dl1, "岗位结构管理", "#80b7ea");
        this.createDD(dl1, "权限管理", "#80b7ea");
        this.createDD(dl1, "用户管理", "#80b7ea");
        this.createDD(dl1, "（单位）文件管理", "#80b7ea");

        var dt2 = document.createElement("dt");
        dl1.appendChild(dt2);
        dt2.innerHTML = "应用坊 —— SaaS应用管理";
        dt2.style.color = "#017df3";
        dt2.style.fontSize = "16px";

        this.createDD(dl1, "应用过程设计", "#80b7ea");
        this.createDD(dl1, "8种应用过程变量设计", "#80b7ea");
        this.createDD(dl1, "4种应用过程组件设计及属性设置", "#80b7ea");
        this.createDD(dl1, "应用过程任务表单与数据变量绑定", "#80b7ea");
        this.createDD(dl1, "应用版本创建", "#80b7ea");
        this.createDD(dl1, "应用上线下线", "#80b7ea");

        var dt3 = document.createElement("dt");
        dl1.appendChild(dt3);
        dt3.innerHTML = "表单居 —— SaaS应用用户界面设计管理";
        dt3.style.color = "#017df3";
        dt3.style.fontSize = "16px";

        this.createDD(dl1, "表单设计", "#80b7ea");
        this.createDD(dl1, "15种基本表单组件属性设置", "#80b7ea");
        this.createDD(dl1, "表单版本创建", "#80b7ea");
        this.createDD(dl1, "表单上线下线", "#80b7ea");
        this.createDD(dl1, "表单预览", "#80b7ea");

        var dt4 = document.createElement("dt");
        dl1.appendChild(dt4);
        dt4.innerHTML = "大数据 —— SaaS应用大数据管理";
        dt4.style.color = "#017df3";
        dt4.style.fontSize = "16px";

        this.createDD(dl1, "大数据普通报表设计", "#80b7ea");
        this.createDD(dl1, "大数据分页报表设计", "#80b7ea");
        this.createDD(dl1, "大数据报表导出", "#80b7ea");
        this.createDD(dl1, "大数据报表预览", "#80b7ea");

    };

    Board.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    Board.prototype.show = function (show) {
        if (show) {
            this.board.style.display = "";
        } else {
            this.board.style.display = "none";
        }
    };

    Board.prototype.addOrder=function(){
        $("#progressbar").show();
        var that = this;
        $.post(service.api(26), {

        }).complete(function(data) {

            $("#progressbar").hide();
        });
    };

    Board.prototype.doClick = function (evt) {
        if (evt.target == this.basicBuyButton) {
            Utils.stopDefaultEvent(evt);
            if (this.options.parent != undefined &&
                this.options.parent.myShoppingCartPane != undefined) {
                this.addOrder();
                this.options.parent.hiddenAll();
                this.options.parent.myShoppingCartPane.show(true);
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Board(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);