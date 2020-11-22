/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "createInvoiceDialog";
    var defaults = {
        id: "",
        title: "",
        parent: "",
    };

    var CreateInvoiceDialog = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            title: "",
            parent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    CreateInvoiceDialog.prototype.init = function (options) {
        this.modalframe = document.createElement("div");
        this.element.appendChild(this.modalframe);
        // dialog
        this.modalframe.className = "modal fade";
        this.modalframe.id = "myModal" + options.id;
        this.modalframe.setAttribute("role", "dialog");
        this.modalframe.setAttribute("aria-labelledby", "myModal" + options.id);

        var modaldialogDIV = document.createElement("div");
        this.modalframe.appendChild(modaldialogDIV);
        modaldialogDIV.className = "modal-dialog";
        modaldialogDIV.setAttribute("role", "document");
        modaldialogDIV.style.width = "800px"

        var dialogContentDIV = document.createElement("div");
        modaldialogDIV.appendChild(dialogContentDIV);
        dialogContentDIV.className = "modal-content";

        // dialog headding
        var dialogHeaderDIV = document.createElement("div");
        dialogContentDIV.appendChild(dialogHeaderDIV);
        dialogHeaderDIV.className = "modal-header";

        var closeButton = document.createElement("button");
        dialogHeaderDIV.appendChild(closeButton);
        closeButton.type = "button";
        closeButton.className = "close";
        closeButton.setAttribute("data-dismiss", "modal");
        closeButton.setAttribute("aria-label", "Close");

        var closeSpan = document.createElement("span");
        closeButton.appendChild(closeSpan);
        closeSpan.setAttribute("aria-hidden", "true");
        closeSpan.innerHTML = "&times;";

        var titleH4 = document.createElement("h4");
        dialogHeaderDIV.appendChild(titleH4);
        titleH4.className = "modal-title";
        titleH4.id = "modal" + options.id;

        var infoIcon = document.createElement("i");
        titleH4.appendChild(infoIcon);
        infoIcon.className = "fa fa-file-o";
        infoIcon.style.color = "blue";

        var info = document.createElement("label");
        titleH4.appendChild(info);
        info.innerHTML = "&nbsp;" + options.title;

        // dialog body
        var dialogForm = document.createElement("form");
        dialogContentDIV.appendChild(dialogForm);

        var dialogBodyDIV = document.createElement("div");
        dialogForm.appendChild(dialogBodyDIV);
        dialogBodyDIV.className = "modal-body";

        var dialogBodyFrameDIV = document.createElement("div");
        dialogBodyDIV.appendChild(dialogBodyFrameDIV);
        dialogBodyFrameDIV.className = "container-fluid";

        var bodyRow = document.createElement("div");
        dialogBodyFrameDIV.appendChild(bodyRow);
        bodyRow.className = "row";
        bodyRow.id = "bodyrow" + options.id;

        // add form panel here...
        this.loadPanel(bodyRow);

        // dialog footer
        var dialogFooterDIV = document.createElement("div");
        dialogForm.appendChild(dialogFooterDIV);
        dialogFooterDIV.className = "modal-footer";

        var p1 = $(dialogFooterDIV).alertBox({
            id: "001"
        });
        this.alertBox = p1.data("alertBox");

        this.okButton = document.createElement("button");
        dialogFooterDIV.appendChild(this.okButton);
        this.okButton.type = "button";
        this.okButton.id = "okButton" + options.id;
        this.okButton.className = "btn btn-primary";
        this.okButton.addEventListener("click", this, false);
        this.okButton.innerHTML = "确定";
        this.okButton.setAttribute("data-dismiss", "modal");

        var cancelButton = document.createElement("button");
        dialogFooterDIV.appendChild(cancelButton);
        cancelButton.type = "button";
        cancelButton.id = "cancelButton" + options.id;
        cancelButton.className = "btn btn-default";
        cancelButton.innerHTML = "取消";
        cancelButton.setAttribute("data-dismiss", "modal");
    };

    CreateInvoiceDialog.prototype.loadPanel = function (parent) {
        var form = document.createElement("form");
        parent.appendChild(form);

        var panel = document.createElement("DIV");
        form.appendChild(panel);
        panel.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        // 发票类型
        var group1 = this.createGroup(panel);
        var label1 = document.createElement("LABEL");
        group1.appendChild(label1);

        this.createAsterisk(label1);
        label1.appendChild(document.createTextNode("发票类型"));

        this.invoiceTyeSelect = document.createElement("SELECT");
        group1.appendChild(this.invoiceTyeSelect);
        this.invoiceTyeSelect.className = "form-control";
        this.addOptions(this.invoiceTyeSelect, "增值税普通发票", "增值税普通发票", 0);
        this.addOptions(this.invoiceTyeSelect, "增值税专用发票", "增值税专用发票", 1);
        this.invoiceTyeSelect.addEventListener("change", this, false);

        // 收件人类型
        var group2 = this.createGroup(panel);
        var label2 = document.createElement("LABEL");
        group2.appendChild(label2);

        this.createAsterisk(label2);
        label2.appendChild(document.createTextNode("收件人类型"));

        var radiosDIV = document.createElement("DIV");
        label2.appendChild(radiosDIV);

        var label3 = document.createElement("LABEL");
        radiosDIV.appendChild(label3);
        label3.className = "radio-inline";

        this.recepiptTyeRadio = document.createElement("INPUT");
        label3.appendChild(this.recepiptTyeRadio);
        this.recepiptTyeRadio.type = "radio";
        this.recepiptTyeRadio.name = "recepiptTye";
        this.recepiptTyeRadio.value = "单位";
        this.recepiptTyeRadio.addEventListener("click", this, false);
        label3.appendChild(document.createTextNode("单位"));

        var label4 = document.createElement("LABEL");
        radiosDIV.appendChild(label4);
        label4.className = "radio-inline";

        this.recepiptTyeRadio1 = document.createElement("INPUT");
        label4.appendChild(this.recepiptTyeRadio1);
        this.recepiptTyeRadio1.type = "radio";
        this.recepiptTyeRadio1.name = "recepiptTye";
        this.recepiptTyeRadio1.value = "个人";
        this.recepiptTyeRadio1.checked = true;
        this.recepiptTyeRadio1.addEventListener("click", this, false);
        label4.appendChild(document.createTextNode("个人"));

        // var group3 = this.createGroup(panel);
        // var tipP = document.createElement("P");
        // group3.appendChild(tipP);
        // tipP.innerHTML = "重要提示：根据最新增值税管理办法要求，7月1日起如需为企业" +
        //     "（包括公司、非公司制企业法人、企业分支机构、个人独资企业、合伙企业和其他企业）" +
        //     "开具增值税发票，需提供纳税人识别号或同意社会信用代码，否则该发票无法作为税收凭证。" +
        //     "请准确选择发票抬头类型，若企业发票请填写有效税号信息";

        // 发票抬头
        var group4 = this.createGroup(panel);
        var label5 = document.createElement("LABEL");
        group4.appendChild(label5);

        this.createAsterisk(label5);
        label5.appendChild(document.createTextNode("发票抬头"));

        this.invoiceTitle = document.createElement("INPUT");
        group4.appendChild(this.invoiceTitle);
        this.invoiceTitle.type = "text";
        this.invoiceTitle.className = "form-control";
        this.invoiceTitle.setAttribute("placeholder", "请输入发票抬头");
        // 发票项目：默认将以订单明细开具发票，如需其他项目，请与开票商家沟通。

        // 纳税人识别号
        this.group5 = this.createGroup(panel);
        var label6 = document.createElement("LABEL");
        this.group5.appendChild(label6);

        this.createAsterisk(label6);
        label6.appendChild(document.createTextNode("纳税人识别号（统一社会信用代码）"));

        this.taxNumberInput = document.createElement("INPUT");
        this.group5.appendChild(this.taxNumberInput);
        this.taxNumberInput.type = "text";
        this.taxNumberInput.className = "form-control";
        this.taxNumberInput.setAttribute("placeholder", "请输入纳税人识别号（统一社会信用代码）");

        // 单位地址
        this.group6 = this.createGroup(panel);
        var label7 = document.createElement("LABEL");
        this.group6.appendChild(label7);

        this.createAsterisk(label7);
        label7.appendChild(document.createTextNode("单位地址"));

        this.addressInput = document.createElement("INPUT");
        this.group6.appendChild(this.addressInput);
        this.addressInput.type = "text";
        this.addressInput.className = "form-control";
        this.addressInput.setAttribute("placeholder", "请输入单位注册地址");

        // 开户银行名称
        this.group16 = this.createGroup(panel);
        var label17 = document.createElement("LABEL");
        this.group16.appendChild(label17);

        this.createAsterisk(label17);
        label17.appendChild(document.createTextNode("公司财务电话"));

        this.fphoneInput = document.createElement("INPUT");
        this.group16.appendChild(this.fphoneInput);
        this.fphoneInput.type = "text";
        this.fphoneInput.className = "form-control";
        this.fphoneInput.setAttribute("placeholder", "请输入单位财务电话,座机请带上区号,如:0000-00000000");

        // 开户银行名称
        this.group7 = this.createGroup(panel);
        var label8 = document.createElement("LABEL");
        this.group7.appendChild(label8);

        this.createAsterisk(label8);
        label8.appendChild(document.createTextNode("开户银行"));

        this.bankInput = document.createElement("INPUT");
        this.group7.appendChild(this.bankInput);
        this.bankInput.type = "text";
        this.bankInput.className = "form-control";
        this.bankInput.setAttribute("placeholder", "请输入开户银行");

        // 开户银行账号
        this.group8 = this.createGroup(panel);
        var label9 = document.createElement("LABEL");
        this.group8.appendChild(label9);

        this.createAsterisk(label9);
        label9.appendChild(document.createTextNode("银行账号"));

        this.bankAccountInput = document.createElement("INPUT");
        this.group8.appendChild(this.bankAccountInput);
        this.bankAccountInput.type = "text";
        this.bankAccountInput.className = "form-control";
        this.bankAccountInput.setAttribute("placeholder", "请输入开户银行账号");

        // 发票内容
        var group9 = this.createGroup(panel);
        var label10 = document.createElement("LABEL");
        group9.appendChild(label10);

        this.createAsterisk(label10);
        label10.appendChild(document.createTextNode("发票内容"));

        this.invoiceContentSelect = document.createElement("SELECT");
        group9.appendChild(this.invoiceContentSelect);
        this.invoiceContentSelect.className = "form-control";
        this.addOptions(this.invoiceContentSelect, "软件服务费", "软件服务费", 0);
        this.addOptions(this.invoiceContentSelect, "培训服务费", "培训服务费", 1);

        // 领取方式
        var group10 = this.createGroup(panel);
        var label11 = document.createElement("LABEL");
        group10.appendChild(label11);

        this.createAsterisk(label11);
        label11.appendChild(document.createTextNode("领取方式（如开增值税专用发票，需自行承担快递到付费用）"));

        this.invoiceReceiveSelect = document.createElement("SELECT");
        group10.appendChild(this.invoiceReceiveSelect);
        this.invoiceReceiveSelect.className = "form-control";

        // 收件人姓名
        this.group11 = this.createGroup(panel);
        var label12 = document.createElement("LABEL");
        this.group11.appendChild(label12);

        this.createAsterisk(label12);
        label12.appendChild(document.createTextNode("收件人姓名"));

        this.receiveNameInput = document.createElement("INPUT");
        this.group11.appendChild(this.receiveNameInput);
        this.receiveNameInput.type = "text";
        this.receiveNameInput.className = "form-control";
        this.receiveNameInput.setAttribute("placeholder", "请输入收件人姓名");

        // 收件人地址
        this.group12 = this.createGroup(panel);
        var label13 = document.createElement("LABEL");
        this.group12.appendChild(label13);

        this.createAsterisk(label13);
        label13.appendChild(document.createTextNode("收件人地址"));

        this.receiveAddressInput = document.createElement("INPUT");
        this.group12.appendChild(this.receiveAddressInput);
        this.receiveAddressInput.type = "text";
        this.receiveAddressInput.className = "form-control";
        this.receiveAddressInput.setAttribute("placeholder", "请输入收件人地址");

        // 收件人电话
        this.group13 = this.createGroup(panel);
        var label14 = document.createElement("LABEL");
        this.group13.appendChild(label14);

        this.createAsterisk(label14);
        label14.appendChild(document.createTextNode("收件人电话"));

        this.receivePhoneInput = document.createElement("INPUT");
        this.group13.appendChild(this.receivePhoneInput);
        this.receivePhoneInput.type = "text";
        this.receivePhoneInput.className = "form-control";
        this.receivePhoneInput.setAttribute("placeholder", "请输入收件人电话");

        // 收件人email地址
        this.group15 = this.createGroup(panel);
        var label16 = document.createElement("LABEL");
        this.group15.appendChild(label16);

        this.createAsterisk(label16);
        label16.appendChild(document.createTextNode("电子邮件地址"));

        this.emailInput = document.createElement("INPUT");
        this.group15.appendChild(this.emailInput);
        this.emailInput.type = "text";
        this.emailInput.className = "form-control";
        this.emailInput.setAttribute("placeholder", "请输入电子邮件地址");

        // 备注
        var group14 = this.createGroup(panel);
        var label15 = document.createElement("LABEL");
        group14.appendChild(label15);

        label15.appendChild(document.createTextNode("备注"));

        this.noteInput = document.createElement("INPUT");
        group14.appendChild(this.noteInput);
        this.noteInput.type = "text";
        this.noteInput.className = "form-control";
        this.noteInput.setAttribute("placeholder", "请输入备注内容");
    };

    CreateInvoiceDialog.prototype.createGroup = function (parent) {
        var group = document.createElement("DIV");
        parent.appendChild(group);
        group.className = "form-group";
        return group;
    };

    CreateInvoiceDialog.prototype.createAsterisk = function (parent) {
        var span1 = document.createElement("SPAN");
        parent.appendChild(span1);
        span1.style.color = "red";
        span1.innerHTML = "*";
        return span1;
    };

    CreateInvoiceDialog.prototype.addOptions = function (parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    CreateInvoiceDialog.prototype.show = function (ordernumber) {
        // 默认的
        this.ordernumber = ordernumber;
        this.invoiceTyeSelect.value = "增值税普通发票";
        this.recepiptTyeRadio1.checked = true; // 个人选项
        this.recepiptTyeRadio.checked = false; // 单位选项
        this.invoiceTitle.value = "个人";
        this.group5.style.display = "none"; // 纳税人识别号（社会统一信用代码）
        this.group6.style.display = "none"; // 单位地址
        this.group16.style.display = "none"; // 单位财务电话
        this.group7.style.display = "none"; //开户行名称
        this.group8.style.display = "none"; // 开户行账号
        $(this.invoiceReceiveSelect).empty();
        this.addOptions(this.invoiceReceiveSelect, "电子邮件", "1", 0);
        this.group15.style.display = ""; // 电子邮件地址
        this.group11.style.display = "none"; // 收件人姓名
        this.group12.style.display = "none"; // 收件人地址
        this.group13.style.display = "none"; // 收件人电话

        $(this.modalframe).modal({
            backdrop: 'static',
            keyboard: true
        });
    };

    CreateInvoiceDialog.prototype.hide = function () {
        $(this.modalframe).modal('hide');
    };

    CreateInvoiceDialog.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "change":
                this.doChange(e);
                break;
        }
    };

    CreateInvoiceDialog.prototype.doClick = function (evt) {
        if (evt.target == this.okButton) {
            var number = this.ordernumber;
            // check ...
            if (this.invoiceTyeSelect.value == "增值税普通发票") {
                if (this.recepiptTyeRadio.checked) { // 单位选项

                } else if (this.recepiptTyeRadio1.checked) { // 个人选项

                }
            } else if (this.invoiceTyeSelect.value == "增值税专用发票") {

            }
        } else if (evt.target == this.recepiptTyeRadio) { // 单位
            if (this.invoiceTyeSelect.value == "增值税普通发票") {
                this.group5.style.display = ""; // 纳税人识别号（社会统一信用代码）
                this.invoiceTitle.value = "";
                this.group6.style.display = "none"; // 单位地址
                this.group16.style.display = "none"; // 单位财务电话
                this.group7.style.display = "none"; //开户行名称
                this.group8.style.display = "none"; // 开户行账号
                $(this.invoiceReceiveSelect).empty();
                this.addOptions(this.invoiceReceiveSelect, "电子邮件", "1", 0);
                this.group15.style.display = ""; // 电子邮件地址
                this.group11.style.display = "none"; // 收件人姓名
                this.group12.style.display = "none"; // 收件人地址
                this.group13.style.display = "none"; // 收件人电话
            } else if (this.invoiceTyeSelect.value == "增值税专用发票") {
                this.invoiceTitle.value = "";
                this.group5.style.display = ""; // 纳税人识别号（社会统一信用代码）
                this.group6.style.display = ""; // 单位地址
                this.group16.style.display = ""; // 单位财务电话
                this.group7.style.display = ""; //开户行名称
                this.group8.style.display = ""; // 开户行账号
                $(this.invoiceReceiveSelect).empty();
                this.addOptions(this.invoiceReceiveSelect, "快递", "0", 0);
                this.group15.style.display = "none"; // 电子邮件地址
                this.group11.style.display = ""; // 收件人姓名
                this.group12.style.display = ""; // 收件人地址
                this.group13.style.display = ""; // 收件人电话
            }
        } else if (evt.target == this.recepiptTyeRadio1) { // 个人
            this.invoiceTitle.value = "个人";
            this.group5.style.display = "none"; // 纳税人识别号（社会统一信用代码）
            this.group6.style.display = "none"; // 单位地址
            this.group16.style.display = "none"; // 单位财务电话
            this.group7.style.display = "none"; //开户行名称
            this.group8.style.display = "none"; // 开户行账号
            $(this.invoiceReceiveSelect).empty();
            this.addOptions(this.invoiceReceiveSelect, "电子邮件", "1", 0);
            this.group15.style.display = ""; // 电子邮件地址
            this.group11.style.display = "none"; // 收件人姓名
            this.group12.style.display = "none"; // 收件人地址
            this.group13.style.display = "none"; // 收件人电话
        }

        if (evt.target.id === "okButton" + this.options.id) {
            var flag = false
            if (this.invoiceTyeSelect.value === "增值税普通发票") {
                flag = this.checkDataForCommon()
            } else if (this.invoiceTyeSelect.value === "增值税专用发票") {
                flag = this.checkDataForSpecial()
            }
            if (flag){
                var invoice = new Invoice();
                invoice.invoiceType = this.invoiceTyeSelect.value;
                invoice.receivePersonType = $("input[name='recepiptTye']:checked").val();
                invoice.invoiceHead = this.recepiptTyeRadio1.value;
                invoice.invoiceContent = this.invoiceContentSelect.value;
                invoice.receiveType =this.invoiceReceiveSelect.value;
                invoice.email = this.emailInput.value;
                invoice.note =this.noteInput.value;
                invoice.taxpayersNumber =this.taxNumberInput.value;
                invoice.companyAddress =this.addressInput.value;
                invoice.financialTel = this.fphoneInput.value;
                invoice.depositaryBank = this.bankInput.value;
                invoice.bankNumber = this.bankAccountInput.value;
                invoice.receiveName = this.receiveNameInput.value;
                invoice.receiveAddress = this.receiveAddressInput.value;
                invoice.receiveTel = this.receivePhoneInput.value;
                this.options.parent.applyInvoice(invoice);
            }
        }
    };

    CreateInvoiceDialog.prototype.doChange = function (evt) {
        if (evt.target == this.invoiceTyeSelect) {
            if (this.invoiceTyeSelect.value == "增值税普通发票") {
                this.recepiptTyeRadio1.disabled = false; // 个人选项
                if (this.recepiptTyeRadio.checked) { // 单位选项
                    this.invoiceTitle.value = "";
                    this.group5.style.display = ""; // 纳税人识别号（社会统一信用代码）
                    this.group6.style.display = "none"; // 单位地址
                    this.group16.style.display = "none"; // 单位财务电话
                    this.group7.style.display = "none"; //开户行名称
                    this.group8.style.display = "none"; // 开户行账号
                    $(this.invoiceReceiveSelect).empty();
                    this.addOptions(this.invoiceReceiveSelect, "电子邮件", "1", 0);
                    this.group15.style.display = ""; // 电子邮件地址
                    this.group11.style.display = "none"; // 收件人姓名
                    this.group12.style.display = "none"; // 收件人地址
                    this.group13.style.display = "none"; // 收件人电话
                } else if (this.recepiptTyeRadio1.checked) { // 个人选项
                    this.invoiceTitle.value = "个人";
                    this.group5.style.display = "none"; // 纳税人识别号（社会统一信用代码）
                    this.group6.style.display = "none"; // 单位地址
                    this.group16.style.display = "none"; // 单位财务电话
                    this.group7.style.display = "none"; //开户行名称
                    this.group8.style.display = "none"; // 开户行账号
                    $(this.invoiceReceiveSelect).empty();
                    this.addOptions(this.invoiceReceiveSelect, "电子邮件", "1", 0);
                    this.group15.style.display = ""; // 电子邮件地址
                    this.group11.style.display = "none"; // 收件人姓名
                    this.group12.style.display = "none"; // 收件人地址
                    this.group13.style.display = "none"; // 收件人电话
                }
            } else if (this.invoiceTyeSelect.value == "增值税专用发票") {
                this.invoiceTitle.value = "";
                this.recepiptTyeRadio1.disabled = true; // 个人选项
                this.recepiptTyeRadio1.checked = false; // 个人选项
                this.recepiptTyeRadio.checked = true; // 单位选项
                this.group5.style.display = ""; // 纳税人识别号（社会统一信用代码）
                this.group6.style.display = ""; // 单位地址
                this.group16.style.display = ""; // 单位财务电话
                this.group7.style.display = ""; //开户行名称
                this.group8.style.display = ""; // 开户行账号
                $(this.invoiceReceiveSelect).empty();
                this.addOptions(this.invoiceReceiveSelect, "快递", "0", 0);
                this.group15.style.display = "none"; // 电子邮件地址
                this.group11.style.display = ""; // 收件人姓名
                this.group12.style.display = ""; // 收件人地址
                this.group13.style.display = ""; // 收件人电话
            }
        }
    };
    CreateInvoiceDialog.prototype.checkDataForSpecial = function () {
        var flag = false;
        if (this.invoiceTitle.value === "" || this.invoiceTitle.value == null) {
            this.alertBox.show(3, "请输入发票抬头", true)
            return
        } else {
            flag = true;
        }
        if (this.taxNumberInput.value === "" || this.taxNumberInput.value === null) {
            this.alertBox.show(3, "请输入纳税人识别号", true)
            return
        } else {
            flag = true
        }
        if (this.addressInput.value === "" || this.addressInput.value === null) {
            this.alertBox.show(3, "请输入公司地址", true);
            return;
        } else {
            flag = true;
        }

        if (this.fphoneInput.value === "" || this.fphoneInput.value === null) {
            this.alertBox.show(3, "请输入公司财务电话", true);
            return
        } else {
            phone = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$/;
            telphone = /0\d{2,3}-\d{7,8}/;
            if (!phone.test(this.fphoneInput.value)) {
                if (telphone.test(this.fphoneInput.value)) {
                    this.alertBox.show(3, "请输入正确的电话号码");
                    return;
                } else {
                    flag = true;
                }
            } else {
                flag = true
            }
        }
        if (this.bankInput.value === "" || this.bankInput.value === null) {
            this.alertBox.show(3, "请输入开户行", true);
            return
        } else {
            flag = true;
        }
        if (this.bankAccountInput.value === "" || this.bankAccountInput.value === null) {
            this.alertBox.show(3, "请输入银行账号", true);
            return
        } else {
            flag = true;
        }
        if (this.receiveNameInput.value === "" || this.receiveNameInput.value === null) {
            this.alertBox.show(3, "请输入收件人姓名", true);
            return;
        } else {
            flag = true;
        }
        if (this.receiveAddressInput.value === "" || this.receiveAddressInput.value === null) {
            this.alertBox.show(3, "请输入收件人地址", true);
            return;
        } else {
            flag = true;
        }
        if (this.receivePhoneInput.value === "" || this.receivePhoneInput.value === null) {
            this.alertBox.show(3, "请输入收件人电话", true)
            return;
        } else {
            myreg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$/;
            if (!myreg.test(this.receivePhoneInput.value)) {
                this.alertBox(3, "请输入正确的手机号", true);
                return
            } else {
                flag = true
            }
        }
        return flag;
    };
    CreateInvoiceDialog.prototype.checkDataForCommon = function () {
        var flag = false;
        if (this.invoiceTitle.value === "" || this.invoiceTitle.value == null) {
            this.alertBox.show(3, "请输入发票抬头", true)
            return
        } else {
            flag = true;
        }
        if (this.emailInput.value === "" || this.emailInput.value === null) {
            this.alertBox.show(3, "请输入电子邮件地址", true)
            return;
        } else {
            myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
            if (!myreg.test(this.emailInput.value)) {
                this.alertBox.show(3, "邮箱格式不正确,请输入正确的邮箱", true);
                flag = false;
                return;
            }
            flag = true;
        }
        return flag;
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new CreateInvoiceDialog(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);