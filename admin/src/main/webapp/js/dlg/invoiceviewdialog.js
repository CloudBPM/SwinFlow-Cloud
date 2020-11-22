/**
 *
 */

;
(function($, window, document, undefined) {
    var pluginName = "invoiceInforEditor";
    var defaults = {
        id : "",
        title : "",
        parent : "",
        uid : "",
        ownerId : "",
    };

    var Editor = function(element, options) {
        this.element = element;
        this.options = $.extend({
            id : "",
            title : "",
            parent : "",
            uid : "",
            ownerId : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    Editor.prototype.init = function(options) {
        this.modalframe = document.createElement("div");
        this.element.appendChild(this.modalframe);

        // dialog
        this.modalframe.className = "modal fade";
        this.modalframe.id = "myModal" + options.id;
        this.modalframe.setAttribute("role", "dialog");
        this.modalframe.setAttribute("aria-labelledby", "modal" + options.id);

        var modaldialogDIV = document.createElement("div");
        modaldialogDIV.className = "modal-dialog";
        modaldialogDIV.setAttribute("role", "document");
        modaldialogDIV.style.width = "800px"
        this.modalframe.appendChild(modaldialogDIV);

        var dialogContentDIV = document.createElement("div");
        dialogContentDIV.className = "modal-content";
        modaldialogDIV.appendChild(dialogContentDIV);

        // dialog headding
        var dialogHeaderDIV = document.createElement("div");
        dialogHeaderDIV.className = "modal-header";
        dialogContentDIV.appendChild(dialogHeaderDIV);

        var closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "close";
        closeButton.setAttribute("data-dismiss", "modal");
        closeButton.setAttribute("aria-label", "Close");

        var closeSpan = document.createElement("span");
        closeSpan.setAttribute("aria-hidden", "true");
        closeSpan.innerHTML = "&times;";
        closeButton.appendChild(closeSpan);
        dialogHeaderDIV.appendChild(closeButton);

        var titleH4 = document.createElement("h4");
        titleH4.className = "modal-title";
        titleH4.id = "modal" + options.id;
        dialogHeaderDIV.appendChild(titleH4);

        var infoIcon = document.createElement("i");
        infoIcon.className = "fa fa-plus-circle fa-lg";
        infoIcon.style.color = "green";
        titleH4.appendChild(infoIcon);

        var info = document.createElement("label");
        info.innerHTML = options.title;
        titleH4.appendChild(info);

        // dialog body
        var dialogForm = document.createElement("form");
        dialogContentDIV.appendChild(dialogForm);

        var dialogBodyDIV = document.createElement("div");
        dialogBodyDIV.className = "modal-body";
        dialogForm.appendChild(dialogBodyDIV);

        var dialogBodyFrameDIV = document.createElement("div");
        dialogBodyFrameDIV.className = "container-fluid";
        dialogBodyDIV.appendChild(dialogBodyFrameDIV);

        this.bodyRow = document.createElement("div");
        this.bodyRow.className = "row";
        this.bodyRow.id = "bodyrow" + options.id;
        dialogBodyFrameDIV.appendChild(this.bodyRow);

        // add form panel here...

        // dialog footer
        var dialogFooterDIV = document.createElement("div");
        dialogFooterDIV.className = "modal-footer";
        dialogForm.appendChild(dialogFooterDIV);

        // var saveButton = document.createElement("button");
        // saveButton.type = "Button";
        // saveButton.id = "OKButton" + options.id;
        // saveButton.className = "btn btn-primary";
        // saveButton.addEventListener("click", this, false);
        // // saveButton.setAttribute("data-dismiss", "modal");
        // saveButton.innerHTML = "确定";
        // dialogFooterDIV.appendChild(saveButton);

        var cancelButton = document.createElement("button");
        cancelButton.type = "Button";
        cancelButton.id = "CancelButton" + options.id;
        cancelButton.className = "btn btn-default";
        cancelButton.innerHTML = "取消";
        cancelButton.setAttribute("data-dismiss", "modal");
        dialogFooterDIV.appendChild(cancelButton);

        // var dialog = $(bodyRow).alertBox({
        //     id : "myalert" + options.id,
        // });
        // this.messageBox = dialog.data("alertBox");

    };
    
    Editor.prototype.show = function(id) {
        console.log("id"+id);
        $(this.modalframe).modal({
            backdrop : 'static',
            keyboard : true
        });
        this.loading(id);
    };

    
    Editor.prototype.loading=function(id){
        this.bodyRow.innerHTML='';
        var that = this;
        $.post(service.api(40),{
            invoiceId:id
        }).complete(function (data) {
            console.log(data);
            if (data.responseJSON.codeMessage.message==="success"){
             that.loadData(data.responseJSON.data);
            }
        })
    };

    // private String invoiceId; //发票ID
    // private String invoiceType;  //发票类型 1、增值税普通发票 2、增值税专用发票
    // private String receivePersonType;  //接收人类型 1、单位 2、个人
    // private String invoiceHead;  // 发票抬头
    // private String invoiceContent;  //发票内容 1、软件服务费 2、培训服务费
    // private String receiveType;  //接收方式 1、电子邮件 2、快递
    // private String email;   //电子邮箱
    // private String taxpayersNumber;  //纳税人识别号
    // private String companyAddress;  // 公司地址
    // private String financialTel;  //公司财务电话
    // private String depositaryBank;  //开户行
    // private String bankNumber;   //银行账号
    // private String receiveName;  //收件人姓名
    // private String receiveTel;  //收件人电话
    // private String reciveAddress;  //收件人地址
    // private String note; //备注
    // private String orderId; //订单Id
    // private int invoiceStatus;
    // private String applyTime;
    // private String orderPrice;//商品金额

    Editor.prototype.loadData=function(obj){
        var data = new Invoice();
        var invoice= data.parseFromJSON(obj);
        this.invoiceTypeDiv = document.createElement("div");
        var invoiceTypeSpan= document.createElement("span");
        invoiceTypeSpan.innerText = "发票类型:"+invoice.invoiceType;
        this.invoiceTypeDiv.appendChild(invoiceTypeSpan);
        this.bodyRow.appendChild(this.invoiceTypeDiv)

        this.receivePersonTypeDiv = document.createElement("div");
        this.receivePersonTypeDiv.style.marginTop = "5px";
        var receivePersonTypeSapn = document.createElement("span");
        receivePersonTypeSapn.innerText="收件人类型:"+invoice.receivePersonType;
        this.receivePersonTypeDiv.appendChild(receivePersonTypeSapn);
        this.bodyRow.appendChild(this.receivePersonTypeDiv)


        this.invoiceHeadDiv = document.createElement("div");
        this.invoiceHeadDiv.style.marginTop = "5px";
        var invoiceHeadSpan = document.createElement("span");
        invoiceHeadSpan.innerText = "发票抬头:"+invoice.invoiceHead;
        this.invoiceHeadDiv.appendChild(invoiceHeadSpan);
        this.bodyRow.appendChild(this.invoiceHeadDiv)

        this.invoiceContentDiv = document.createElement("div");
        this.invoiceContentDiv.style.marginTop = "5px";
        var invoiceContentSpan = document.createElement("span");
        invoiceContentSpan.innerText = "发票内容:"+invoice.invoiceContent;
        this.invoiceContentDiv.appendChild(invoiceContentSpan)
        this.bodyRow.appendChild(this.invoiceContentDiv)

        this.receiveTypeDiv = document.createElement("div");
        this.receiveTypeDiv.style.marginTop = "5px";
        var receiveTypeSpan = document.createElement("span");
        receiveTypeSpan.innerText="领取方式:"+invoice.receiveType;
        this.receiveTypeDiv.appendChild(receiveTypeSpan);
        this.bodyRow.appendChild(this.receiveTypeDiv)

        this.emailDiv = document.createElement("div");
        this.emailDiv.style.marginTop = "5px";
        var emailSpan = document.createElement("span");
        emailSpan.innerText = "电子邮件地址:"+invoice.email;
        this.emailDiv.appendChild(emailSpan);
        this.bodyRow.appendChild(this.emailDiv)

        this.taxpayersNumberDiv = document.createElement("div");
        this.taxpayersNumberDiv.style.marginTop = "5px";
        var taxpayersNumberSpan = document.createElement("span");
        taxpayersNumberSpan.innerText = "纳税人识别号:"+invoice.taxpayersNumber;
        this.taxpayersNumberDiv.appendChild(taxpayersNumberSpan)
        this.bodyRow.appendChild(this.taxpayersNumberDiv)

        this.companyAddressDiv = document.createElement("div");
        this.companyAddressDiv.style.marginTop = "5px";
        var companyAddressSpan = document.createElement("span");
        companyAddressSpan.innerText = "单位地址:"+invoice.companyAddress;
        this.companyAddressDiv.appendChild(companyAddressSpan);
        this.bodyRow.appendChild(this.companyAddressDiv)

        this.financialTelDiv = document.createElement("div");
        this.financialTelDiv.style.marginTop = "5px";
        var financialTelSpan = document.createElement("span");
        financialTelSpan.innerText = "公司财务电话:"+invoice.financialTel;
        this.financialTelDiv.appendChild(financialTelSpan);
        this.bodyRow.appendChild(this.financialTelDiv)

        this.depositaryBankDiv = document.createElement("div");
        this.depositaryBankDiv.style.marginTop = "5px";
        var depositaryBankSpan = document.createElement("span");
        depositaryBankSpan.innerText = "开户银行:"+invoice.depositaryBank;
        this.depositaryBankDiv.appendChild(depositaryBankSpan)
        this.bodyRow.appendChild(this.depositaryBankDiv);

        this.receiveNameDiv = document.createElement("div");
        this.receiveNameDiv.style.marginTop = "5px";
        var receiveNameSpan = document.createElement("span");
        receiveNameSpan.innerText = "接收人姓名:"+invoice.receiveName;
        this.receiveNameDiv.appendChild(receiveNameSpan);
        this.bodyRow.appendChild(this.receiveNameDiv);

        this.receiveTelDiv = document.createElement("div");
        this.receiveTelDiv.style.marginTop = "5px";
        var receiveTelSpan = document.createElement("span");
        receiveTelSpan.innerText="接收人电话:"+invoice.receiveTel;
        this.receiveTelDiv.appendChild(receiveTelSpan);
        this.bodyRow.appendChild(this.receiveTelDiv);

        this.reciveAddressDiv = document.createElement("div");
        this.reciveAddressDiv.style.marginTop = "5px";
        var reciveAddressSpan = document.createElement("span");
        reciveAddressSpan.innerText="接收人地址:"+invoice.reciveAddress;
        this.reciveAddressDiv.appendChild(reciveAddressSpan);
        this.bodyRow.appendChild(this.reciveAddressDiv);

        this.noteDiv = document.createElement("div");
        this.noteDiv.style.marginTop = "5px";
        var noteSpan = document.createElement("span");
        noteSpan.innerText = "备注:"+invoice.note;
        this.noteDiv.appendChild(noteSpan);
        this.bodyRow.appendChild(this.noteDiv);

        if (obj.taxpayersNumber==""||obj.taxpayersNumber==null){
            this.taxpayersNumberDiv.style.display = "none"
        }

        if (obj.companyAddress==""||obj.companyAddress==null){
            this.companyAddressDiv.style.display = "none"
        }

        if (obj.financialTel==null||obj.financialTel==""){
            this.financialTelDiv.style.display = "none";
        }

        if (obj.depositaryBank==null||obj.depositaryBank==""){
            this.depositaryBankDiv.style.display = "none"
        }
        if (obj.receiveName==null||obj.receiveName==""){
            this.receiveNameDiv.style.display = "none"
        }
        if (obj.receiveTel==null||obj.receiveTel==""){
            this.receiveTelDiv.style.display="none"
        }
        if (obj.reciveAddress==null||obj.reciveAddress==""){
            this.reciveAddressDiv.style.display = "none"
        }

    };

    Editor.prototype.hide = function() {
        $(this.modalframe).modal('hide');
    };

    Editor.prototype.handleEvent = function(e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    $.fn[pluginName] = function(options) {
        return this
            .each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Editor(this,
                        options));
                } else if ($.isFunction(Plugin.prototype[options])) {
                    $.data(this, pluginName)[options]();
                }
            });
    };

})(jQuery, window, document);