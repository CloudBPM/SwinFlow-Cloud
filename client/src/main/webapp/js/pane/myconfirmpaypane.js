/**
 *
 */
var orderId = "";
;
(function($, window, document, undefined) {
    var pluginName = "myConfirmPayPane";
    var defaults = {
        id : "",
    };

    var Board = function(element, options) {
        this.element = element;
        this.options = $.extend({
            id : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    Board.prototype.init = function(options) {
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

        this.createTitle(panelCol0, "fa fa-money", "确认付款", "#5f65b3");

        var panelRow1 = document.createElement("DIV");
        panel.appendChild(panelRow1);
        panelRow1.className = "row";

        var panelCol1 = document.createElement("DIV");
        panelRow1.appendChild(panelCol1);
        panelCol1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        this.createConfirmPane(panelCol1, options.userName);
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


        // setInterval(function () {
        //     console.log("fdasdfa");
        // }, 1000);

        return titleSpan;
    };

    // Board.prototype.payResult = function() {
    //     $("#progressbar").show();
    //     var that = this;
    //     $.post(service.api(23), {
    //         orderId:orderId
    //     }).complete(function(data) {
    //         console.log(data);
    //         $("#progressbar").hide();
    //     });
    // };

    Board.prototype.createConfirmPane = function (parent, userfullname) {
        var contentPanel = document.createElement("DIV");
        parent.appendChild(contentPanel);
        contentPanel.className = "panel panel-default";
        contentPanel.style.marginTop = "10px";
        contentPanel.style.borderColor = "#eee";

        var bodyPanel = document.createElement("DIV");
        contentPanel.appendChild(bodyPanel);
        bodyPanel.className = "panel-body";

        var row0 = document.createElement("DIV");
        bodyPanel.appendChild(row0);
        row0.className = "row";

        var col0 = document.createElement("DIV");
        row0.appendChild(col0);
        col0.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        var payer = document.createElement("P");
        col0.appendChild(payer);

        this.head50 = document.createElement("H4");
        payer.appendChild(this.head50);
        // head50.innerHTML = "订购客户：" + this.options.userName;

        var proName = document.createElement("P");
        col0.appendChild(proName);

        this.head51 = document.createElement("H4");
        proName.appendChild(this.head51);
        // head51.innerHTML = "应付金额：" + "688.00元";

        var payAmount = document.createElement("P");
        col0.appendChild(payAmount);

        this.head52 = document.createElement("H4");
        payAmount.appendChild(this.head52);
        this.head52.innerHTML = "应付金额：" + "599.00元";


        // title
        var row1 = document.createElement("DIV");
        bodyPanel.appendChild(row1);
        row1.className = "row";

        var col1 = document.createElement("DIV");
        row1.appendChild(col1);
        col1.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

        var title = document.createElement("P");
        col1.appendChild(title);
        title.className = "text-center";

        var head41 = document.createElement("H3");
        title.appendChild(head41);
        head41.innerHTML = "微信扫码支付";
        head41.style.color = "#47e24e";

        this.weixinPayCode = document.createElement("div");
        col1.appendChild(this.weixinPayCode);

        this.payImg = document.createElement("div");
        this.weixinPayCode.appendChild(this.payImg);
        this.payImg.style.width = "280px";
        this.payImg.style.height = "280px";
        this.payImg.style.margin = "0 auto";

        // var col2 = document.createElement("DIV");
        // row1.appendChild(col2);
        // col2.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
        //
        // var title2 = document.createElement("P");
        // col2.appendChild(title2);
        // title2.className = "text-center";
        //
        // var head42 = document.createElement("H3");
        // title2.appendChild(head42);
        // head42.innerHTML = "支付宝扫码支付";
        // head42.style.color = "#2e8dff";
        //
        // this.zhifubaoPayCode = document.createElement("P");
        // col2.appendChild(this.zhifubaoPayCode);
        // this.zhifubaoPayCode.className = "text-center";
        //
        // var payImg1 = document.createElement("img");
        // this.zhifubaoPayCode.appendChild(payImg1);
        // payImg1.src = "img/payqucode.png";


        // complete pay
        var row2 = document.createElement("DIV");
        bodyPanel.appendChild(row2);
        row2.className = "row";

        var col3 = document.createElement("DIV");
        row2.appendChild(col3);
        col3.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        var autoValidateService = document.createElement("P");
        col3.appendChild(autoValidateService);
        autoValidateService.className = "text-center";
        autoValidateService.innerHTML = "支付成功后，自动开通服务";

        var completeButton = document.createElement("P");
        col3.appendChild(completeButton);
        completeButton.className = "text-center";

        this.completeButton = document.createElement("Button");
        completeButton.appendChild(this.completeButton);
        this.completeButton.innerHTML = "我已完成支付"
        this.completeButton.type = "button";
        this.completeButton.className = "btn btn-success";
        this.completeButton.addEventListener("click", this, false);

    };

    Board.prototype.handleEvent = function(e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    Board.prototype.show = function(show) {
        if (show) {
            this.board.style.display = "";
            this.loading()
        } else {
            this.board.style.display = "none";
        }
    };
    Board.prototype.loading=function(){
        $("#progressbar").show();
        var that = this;
        $.post(service.api(22), {
            productId:"0000000001",
        }).complete(function(data) {
            that.loadData(data.responseJSON);
            $("#progressbar").hide();
        });
    };

    Board.prototype.loadData=function(obj){
        this.payImg.innerHTML = "";
        var qrcode = new QRCode( this.payImg, {
            width : 280,
            height : 280,
        });
        qrcode.makeCode(obj.result);
        orderId = obj.order;
        this.head51.innerHTML = "商品名称:"+obj.body;
        this.head50.innerHTML = "订单号:"+obj.order;
    }

    Board.prototype.doClick = function(evt) {
        if (evt.target == this.completeButton) {
            console.log("validate service!");
        }
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Board(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);