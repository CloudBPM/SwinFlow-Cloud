/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "myOrderPane";
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
        var p2 = $(this.element).messageDialog({
            id: "017",
            title: "提示",
            parent: this,
        });
        this.messageDialog = p2.data("messageDialog");

        this.board = document.createElement("DIV");
        this.element.appendChild(this.board);
        this.show(false);

        var panel0 = document.createElement("DIV");
        this.board.appendChild(panel0);

        if ($(panel0).createInvoiceDialog != undefined) {
            var board = $(panel0).createInvoiceDialog({
                id: "createInvoiceDialog" + options.userId,
                title : "我要开发票",
                parent: this,
                userId: options.userId,
                userName: options.userName
            });
            this.createInvoiceDialog = board.data("createInvoiceDialog");
        }

        this.panel = document.createElement("DIV");
        this.board.appendChild(this.panel);
        this.panel.className = "container-fluid";

        var col0 = this.createSingleRow(this.panel);
        this.createTitle(col0, "fa fa-shopping-cart", "我的订购记录", "#b32d11");
        //
        // var col1 = this.createSingleRow(panel);
        // this.createShoppingCartPane(col1, options.userName, "201901919229292");
        //
        // var col2 = this.createSingleRow(panel);
        // this.createShoppingCartPane(col2, options.userName, "201901919229293");
        //
        // var col3 = this.createSingleRow(panel);
        // this.createShoppingCartPane(col3, options.userName, "201901919229294");
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

    Board.prototype.loading = function(){
        $("#progressbar").show();
        var that = this;
        $.post(service.api(24), {

        }).complete(function(data) {
            that.loadData(data.responseJSON)
            $("#progressbar").hide();
        });
    };

    Board.prototype.loadData = function(obj){
        if (obj.data!=null){
            var objs = obj.data.data;
            for (var i = 0;i<objs.length;i++){
                this.createShoppingCartPane(this.createSingleRow(this.panel), obj.data.name,objs[i].orderId,objs[i].createTime);
                this.orderid=objs[i].orderId;  //目前只有一个服务 以后服务多了 订单号变多了，如何获取点击的
                                                //订单的订单号，暂未实现
            }
        }
    };
    Board.prototype.createShoppingCartPane = function (parent, userfullname, ordernumber,createTime) {
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
        onumDiv.innerHTML = "订单号:" + ordernumber;

        var opersonDiv = document.createElement("DIV");
        col1.appendChild(opersonDiv);
        opersonDiv.innerHTML = "订购客户:" + userfullname;

        var orderTimeDiv = document.createElement("DIV");
        col1.appendChild(orderTimeDiv);
        orderTimeDiv.innerHTML = "交易时间:"+createTime ;

        var col2 = document.createElement("DIV");
        row1.appendChild(col2);
        col2.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

        var ostatusDiv = document.createElement("DIV");
        col2.appendChild(ostatusDiv);
        ostatusDiv.innerHTML = "订单状态：已支付";
        ostatusDiv.style.color = "#DE3434";
        ostatusDiv.style.fontWeight = "bold";
        ostatusDiv.className = "text-right";

        var amountDiv = document.createElement("DIV");
        col2.appendChild(amountDiv);
        amountDiv.innerHTML = "已付款：599.00元";
        amountDiv.className = "text-right";

        var tableDivPane = document.createElement("DIV");
        contentPanel.appendChild(tableDivPane);
        tableDivPane.className = "table-responsive";

        this.tableList = document.createElement("table");
        tableDivPane.appendChild(this.tableList);
        this.tableList.className = "table table-striped table-hover";

        // $(this.tableList).children().remove();

        this.addListHeader();

        var row = this.tableList.insertRow(-1);
        this.createCell(0, "基础开发服务使用费用", row, "");
        this.createCell(1, "599.00", row, "right");

        var payDivFooterPane = document.createElement("DIV");
        contentPanel.appendChild(payDivFooterPane);
        payDivFooterPane.className = "panel-footer text-right";

        var createInvoiceBtn = document.createElement("Button");
        payDivFooterPane.appendChild(createInvoiceBtn);
        createInvoiceBtn.className = "btn btn-primary";
        createInvoiceBtn.type = "button";
        createInvoiceBtn.innerHTML = "我要开发票";
        var that = this;
        createInvoiceBtn.addEventListener("click", function(evt) {
            that.createInvoiceDialog.show();
        }, false);

    };

    Board.prototype.addListHeader = function () {
        var header = this.tableList.createTHead();
        var row = header.insertRow(0);
        this.createHead("订购服务", row, "");
        this.createHead("服务价格（元）", row, "right");
    };

    Board.prototype.createHead = function (content, row, align) {
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

    Board.prototype.createCell = function (no, cellname, row, align) {
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

    Board.prototype.applyInvoice = function(obj){
      var that = this;
      $.post(service.api(28),{
          data:JSON.stringify(obj),
          userId:this.options.userId,
          orderId:this.orderid,
      }).complete(function (data) {
          if (data.responseJSON.codeMessage.message=="success"){
            that.messageDialog.show("申请成功");
          }
      })
    };
    Board.prototype.doClick = function (evt) {
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