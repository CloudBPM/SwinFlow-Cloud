/**
 *
 */

;
(function($, window, document, undefined) {
    var pluginName = "myInvoicePane";
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
        this.loading()
    };

    Board.prototype.init = function(options) {
        this.board = document.createElement("DIV");
        this.element.appendChild(this.board);
        this.show(false);

        var panel = document.createElement("DIV");
        this.board.appendChild(panel);
        panel.className = "container-fluid";

        var col0 = this.createSingleRow(panel);

        this.createTitle(col0, "fa fa-file-o", "我的发票记录", "#5f65b3");

        this.col1 = this.createSingleRow(panel);

        //this.createShoppingCartPane(col1, options.userName, "201901919229292")
    };

    Board.prototype.createSingleRow = function (parent, icon, title, color) {
        var panelRow = document.createElement("DIV");
        parent.appendChild(panelRow);
        panelRow.className = "row";

        var panelCol = document.createElement("DIV");
        panelRow.appendChild(panelCol);
        panelCol.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        return panelCol;
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

    Board.prototype.createShoppingCartPane = function (parent,object) {
        var contentPanel = document.createElement("DIV");
        parent.appendChild(contentPanel);
        contentPanel.className = "panel panel-default";
        contentPanel.style.marginTop = "10px";

        var bodyPanel = document.createElement("DIV");
        contentPanel.appendChild(bodyPanel);
        bodyPanel.className = "panel-body";

        // title
        var row1 = document.createElement("DIV");
        bodyPanel.appendChild(row1);
        row1.className = "row";

        var col1 = document.createElement("DIV");
        row1.appendChild(col1);
        col1.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

        var onumDiv = document.createElement("DIV");
        col1.appendChild(onumDiv);
        onumDiv.innerHTML = "订单号:" + object.orderId;

        var orderTimeDiv = document.createElement("DIV");
        col1.appendChild(orderTimeDiv);
        orderTimeDiv.innerHTML = "申请时间:" + object.applyTime;

        var invoiceTypeDiv = document.createElement("DIV");
        col1.appendChild(invoiceTypeDiv);
        invoiceTypeDiv.innerHTML = "发票类型:" +object.invoiceType;

        var receiptorTypeDiv = document.createElement("DIV");
        col1.appendChild(receiptorTypeDiv);
        receiptorTypeDiv.innerHTML = "收件人类型:" + object.receivePersonType;

        var receiptorTypeDiv = document.createElement("DIV");
        col1.appendChild(receiptorTypeDiv);
        receiptorTypeDiv.innerHTML = "发票抬头:" + object.invoiceHead;

        var col2 = document.createElement("DIV");
        row1.appendChild(col2);
        col2.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

        var ostatusDiv = document.createElement("DIV");
        col2.appendChild(ostatusDiv);
        ostatusDiv.innerHTML = "发票状态:"+object.invoiceStatus;
        ostatusDiv.style.color = "#DE3434";
        ostatusDiv.style.fontWeight = "bold";
        ostatusDiv.className = "text-right";

        var amountDiv = document.createElement("DIV");
        col2.appendChild(amountDiv);
        amountDiv.innerHTML = "已付款：599.00元";
        amountDiv.className = "text-right";

        var payDivFooterPane = document.createElement("DIV");
        contentPanel.appendChild(payDivFooterPane);
        payDivFooterPane.className = "panel-footer text-right";

        this.checkInvoiceButton = document.createElement("Button");
        payDivFooterPane.appendChild(this.checkInvoiceButton);
        this.checkInvoiceButton.type = "button";
        this.checkInvoiceButton.className = "btn btn-default";
        this.checkInvoiceButton.innerHTML = "查看发票";
        this.checkInvoiceButton.addEventListener("click", this, false);

        var whitepsace = document.createElement("SPAN");
        payDivFooterPane.appendChild(whitepsace);
        whitepsace.innerHTML = "&nbsp;&nbsp;";

        this.sendInvoiceButton = document.createElement("Button");
        payDivFooterPane.appendChild(this.sendInvoiceButton);
        this.sendInvoiceButton.className = "btn btn-primary";
        this.sendInvoiceButton.type = "button";
        this.sendInvoiceButton.innerHTML = "发送邮箱";
        this.sendInvoiceButton.addEventListener("click", this, false);

    };

    Board.prototype.handleEvent = function(e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    Board.prototype.loading=function(){
        var that = this;
        $.get(service.api(30),{

        }).complete(function (data) {
           if (data.responseJSON.codeMessage.message==="success"){
               that.loadData(data.responseJSON.data);
               console.log(data)
           }
        })
    };

    Board.prototype.loadData=function(obj){
        var invoice = new Invoice();
        for (var i=0;i<obj.length;i++){
            var newInvoice = invoice.parseFormJSON(obj[i]);
            this.createShoppingCartPane(this.col1,newInvoice)
        }
    };
    Board.prototype.show = function(show) {
        if (show) {
            this.board.style.display = "";
        } else {
            this.board.style.display = "none";
        }
    };

    Board.prototype.doClick = function(evt) {

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