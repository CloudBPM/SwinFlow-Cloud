/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "myShoppingCartPane";
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
    };

    Board.prototype.init = function (options) {
        this.board = document.createElement("DIV");
        this.element.appendChild(this.board);
        this.show(false);

        this.panel = document.createElement("DIV");
        this.board.appendChild(this.panel);
        this.panel.className = "container-fluid";

        // row0
        var panelRow0 = document.createElement("DIV");
        this.panel.appendChild(panelRow0);
        panelRow0.className = "row";

        var panelCol0 = document.createElement("DIV");
        panelRow0.appendChild(panelCol0);
        panelCol0.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        this.createTitle(panelCol0, "fa fa-shopping-cart", "我的购物车", "#5f65b3");
        this.loading();
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

    Board.prototype.loading=function(){
        $("#progressbar").show();
        var that = this;
        $.post(service.api(25), {

        }).complete(function(data) {
            console.log(data);
            that.loadData(data.responseJSON)
            $("#progressbar").hide();
        });
    };

    Board.prototype.loadData=function(obj){
        this.contentPanel = "";
        this.opersonDiv = "";
        this.ostatusDiv = "";
        this.amountDiv = "";
        if (obj.data!=null){
            var objs = obj.data.data;
            for (var i = 0;i<objs.length;i++){
                this.createShoppingCartPane(this.createSingleRow(this.panel), obj.data.name,objs[i].orderId);
            }
        }
    };
    Board.prototype.createShoppingCartPane = function (parent, userfullname, ordernumber) {
        this.contentPanel = document.createElement("DIV");
        parent.appendChild(this.contentPanel);
        this.contentPanel.className = "panel panel-default";
        this.contentPanel.style.marginTop = "10px";

        var bodyPanel = document.createElement("DIV");
        this.contentPanel.appendChild(bodyPanel);
        bodyPanel.className = "panel-body";

        // title
        var row1 = document.createElement("DIV");
        bodyPanel.appendChild(row1);
        row1.className = "row";

        var col1 = document.createElement("DIV");
        row1.appendChild(col1);
        col1.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

        // var onumDiv = document.createElement("DIV");
        // col1.appendChild(onumDiv);
        // onumDiv.innerHTML = "订单号:" + ordernumber;

        this.opersonDiv = document.createElement("DIV");
        col1.appendChild(this.opersonDiv);
        this.opersonDiv.innerHTML = "订购客户:" + userfullname;

        var col2 = document.createElement("DIV");
        row1.appendChild(col2);
        col2.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

        this.ostatusDiv = document.createElement("DIV");
        col2.appendChild(this.ostatusDiv);
        this.ostatusDiv.innerHTML = "订单状态：待支付";
        this.ostatusDiv.style.color = "#DE3434";
        this.ostatusDiv.style.fontWeight = "bold";
        this.ostatusDiv.className = "text-right";

        this.amountDiv = document.createElement("DIV");
        col2.appendChild(this.amountDiv);
        this.amountDiv.innerHTML = "应付款：688.00元";
        this.amountDiv.className = "text-right";

        var tableDivPane = document.createElement("DIV");
        this.contentPanel.appendChild(tableDivPane);
        tableDivPane.className = "table-responsive";

        this.tableList = document.createElement("table");
        tableDivPane.appendChild(this.tableList);
        this.tableList.className = "table table-striped table-hover";

        // $(this.tableList).children().remove();

        this.addListHeader();

        var row = this.tableList.insertRow(-1);
        this.createCell(0, "基础开发服务使用费用", row, "");
        this.createCell(1, "688.00", row, "right");

        var payDivFooterPane = document.createElement("DIV");
        this.contentPanel.appendChild(payDivFooterPane);
        payDivFooterPane.className = "panel-footer text-right";

        this.cancelOrderButton = document.createElement("Button");
        payDivFooterPane.appendChild(this.cancelOrderButton);
        this.cancelOrderButton.type = "button";
        this.cancelOrderButton.className = "btn btn-default";
        this.cancelOrderButton.innerHTML = "取消订单";
        this.cancelOrderButton.addEventListener("click", this, false);

        var whitepsace = document.createElement("SPAN");
        payDivFooterPane.appendChild(whitepsace);
        whitepsace.innerHTML = "&nbsp;&nbsp;";

        this.confirmOrderButton = document.createElement("Button");
        payDivFooterPane.appendChild(this.confirmOrderButton);
        this.confirmOrderButton.className = "btn btn-danger";
        this.confirmOrderButton.type = "button";
        this.confirmOrderButton.innerHTML = "立即支付";
        this.confirmOrderButton.addEventListener("click", this, false);

    };

    Board.prototype.addListHeader = function() {
        var header = this.tableList.createTHead();
        var row = header.insertRow(0);
        this.createHead("订购服务", row, "");
        this.createHead("服务价格（元）", row, "right");
    };

    Board.prototype.createHead = function(content, row, align) {
        var th = document.createElement('th');
        th.setAttribute("nowrap", "true");
        th.innerHTML = content;
        if (align == "right") {
            th.className = "text-right";
        } else if (align == "center") {
            th.className = "text-center";
        }
        row.appendChild(th);
    };

    Board.prototype.createCell = function(no, cellname, row, align) {
        var cell = row.insertCell(no);
        cell.setAttribute("nowrap", "true");
        if (align == "right") {
            cell.className = "text-right";
        } else if (align == "center") {
            cell.className = "text-center";
        }
        if (cellname != null && cellname != "") {
            cell.innerHTML = cellname;
        }
        return cell;
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

    Board.prototype.doClick = function (evt) {
        if (evt.target == this.cancelOrderButton) {


        } else if (evt.target == this.confirmOrderButton) {
            if (this.options.parent != undefined &&
                this.options.parent.myConfirmPayPane != undefined) {
                this.options.parent.hiddenAll();
                this.options.parent.myConfirmPayPane.show(true);
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