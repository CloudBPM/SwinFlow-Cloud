/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "liveBroadcastViewEditor";
    var defaults = {
        id: "",
        owner: "",
        userId: "",
        userfullname: "",
        ownername: "",
        basicpropsheet: "",
        propsheet: "",
        ownerId: "",
        width: 0,
        height: 0,
        parent: "",
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            owner: "",
            userId: "",
            userfullname: "",
            ownername: "",
            basicpropsheet: "",
            propsheet: "",
            ownerId: "",
            width: 0,
            height: 0,
            parent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.initEditor(options);
        this.init(options);
    };

    Editor.prototype.initEditor = function (options) {
        // confirm message dialog plugin
        var p3 = $(this.element).uploadFileEditor({
            id: "001", // plugin id
            //url: service.uploadapi1(5, this.options.ownerId), // uploading arget url
            userId: options.uid,
            userfullname: options.userfullname,
            ownername: options.ownername,
            parent: this, // parent plugin
        });
        this.upload = p3.data("uploadFileEditor");
    };

    Editor.prototype.init = function (options) {
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
        modaldialogDIV.style.width = "1200px"
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

        var bodyRow = document.createElement("div");
        bodyRow.className = "row";
        bodyRow.id = "bodyrow" + options.id;
        dialogBodyFrameDIV.appendChild(bodyRow);

        // create form
        var panelForm = document.createElement("Form");
        bodyRow.appendChild(panelForm);
        panelForm.className = "form-horizontal";
        panelForm.addEventListener("change", this, false);
        this.createBasicInfor(panelForm, options);
        this.commodityInfor(panelForm, options);

        // dialog footer
        var dialogFooterDIV = document.createElement("div");
        dialogFooterDIV.className = "modal-footer";
        dialogForm.appendChild(dialogFooterDIV);

        this.saveButton = document.createElement("button");
        this.saveButton.type = "button";
        this.saveButton.id = "OKButton" + options.id;
        this.saveButton.className = "btn btn-primary";
        this.saveButton.addEventListener("click", this, false);
        // saveButton.setAttribute("data-dismiss", "modal");
        this.saveButton.innerHTML = "确定";
        dialogFooterDIV.appendChild(this.saveButton);

        this.updateButton = document.createElement("button");
        this.updateButton.type = "button";
        this.updateButton.id = "UPButton" + options.id;
        this.updateButton.className = "btn btn-primary";
        this.updateButton.addEventListener("click", this, false);
        // saveButton.setAttribute("data-dismiss", "modal");
        this.updateButton.innerHTML = "修改";
        dialogFooterDIV.appendChild(this.updateButton);

        var cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.id = "CancelButton" + options.id;
        cancelButton.className = "btn btn-default";
        cancelButton.innerHTML = "取消";
        cancelButton.setAttribute("data-dismiss", "modal");
        // cancelButton.addEventListener("click", this, false);
        dialogFooterDIV.appendChild(cancelButton);

        var dialog = $(bodyRow).alertBox({
            id: "myalert" + options.id,
        });
        this.messageBox = dialog.data("alertBox");

        var p4 = $(bodyRow).messageDialog({
            id: "017",
            title: "提示",
            parent: this,
        });
        this.messageDialog = p4.data("messageDialog");
    };

    Editor.prototype.createBasicInfor = function (parent, options) {
        //create row 1
        var row1 = document.createElement("DIV");
        parent.appendChild(row1);
        row1.className = "row";

        var col11 = document.createElement("DIV");
        row1.appendChild(col11);
        col11.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        // create div for name
        this.divName = document.createElement("DIV");
        col11.appendChild(this.divName);
        this.divName.className = "form-group";
        this.divName.id = "Name";

        var label1 = document.createElement("LABEL");
        this.divName.appendChild(label1);
        label1.className = "col-sm-2 control-label";
        label1.innerHTML = "直播名称";

        this.colDIV1 = document.createElement("DIV");
        this.divName.appendChild(this.colDIV1);
        this.colDIV1.className = "col-sm-10";
        this.colDIV1.id = "inputbody1";

        this.inputName = document.createElement("INPUT");
        this.colDIV1.appendChild(this.inputName);
        this.inputName.id = "videoName" + options.cid;
        this.inputName.className = "form-control";
        this.inputName.type = "text";
        this.inputName.setAttribute("placeholder", "直播名称，(建议字数在14个字以内)");
        this.inputName.addEventListener("blur", this, false);
        this.inputName.addEventListener("change", this, false);
        this.inputName.addEventListener("keyup", this, false);

        //row 3
        var row3 = document.createElement("DIV");
        parent.appendChild(row3);
        row3.className = "row";
        var col3_1 = document.createElement("DIV");
        row3.appendChild(col3_1);
        col3_1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        //create author name
        this.liveNameDIV = document.createElement("DIV");
        col3_1.appendChild(this.liveNameDIV);
        this.liveNameDIV.className = "form-group";

        this.liveName = document.createElement("LABEL");
        this.liveNameDIV.appendChild(this.liveName);
        this.liveName.className = "col-sm-2 control-label";
        this.liveName.innerHTML = "直播介绍";

        //create author
        this.liveDIV = document.createElement("DIV");
        this.liveNameDIV.appendChild(this.liveDIV);
        this.liveDIV.className = "col-sm-10";

        this.liveIntroduce = document.createElement("INPUT");
        this.liveDIV.appendChild(this.liveIntroduce);
        this.liveIntroduce.className = "form-control";
        this.liveIntroduce.type = "text";
        this.liveIntroduce.setAttribute("placeholder", "请输入直播介绍");
        this.liveIntroduce.addEventListener("blur", this, false);
        this.liveIntroduce.addEventListener("change", this, false);
        this.liveIntroduce.addEventListener("keyup", this, false);

        // create row2
        var row2 = document.createElement("DIV");
        parent.appendChild(row2);
        row2.className = "row";

        var col2_1 = document.createElement("DIV");
        row2.appendChild(col2_1);
        col2_1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        this.liveTitle = document.createElement("DIV");
        col2_1.appendChild(this.liveTitle);
        this.liveTitle.className = "form-group";

        this.liveLabel = document.createElement("LABEL");
        this.liveTitle.appendChild(this.liveLabel);
        this.liveLabel.className = "col-sm-2 control-label";
        this.liveLabel.innerHTML = "直播形式";

        // create upload video name
        this.bookFile = document.createElement("DIV");
        this.liveTitle.appendChild(this.bookFile);
        this.bookFile.className = "col-sm-10";

        this.li1 = document.createElement("LABEL");
        this.bookFile.appendChild(this.li1);
        this.li1.className = "radio-inline";

        this.liveType = document.createElement("INPUT");
        this.li1.appendChild(this.liveType);
        this.liveType.type = "radio";
        this.liveType.name = "type";
        this.liveType.value = 0;
        this.liveType.id = "liveType";
        this.liveType.addEventListener("click", this, false);

        this.li1.appendChild(document.createTextNode("语言图文直播"));

        this.li2 = document.createElement("LABEL");
        this.bookFile.appendChild(this.li2);
        this.li2.className = "radio-inline";

        this.liveType1 = document.createElement("INPUT");
        this.li2.appendChild(this.liveType1);
        this.liveType1.type = "radio";
        this.liveType1.name = "type";
        this.liveType1.value = 1;
        this.liveType1.id = "liveType1";
        this.liveType1.addEventListener("click", this, false);

        this.li2.appendChild(document.createTextNode("视频录播+语言直播"));

        this.li3 = document.createElement("LABEL");
        this.bookFile.appendChild(this.li3);
        this.li3.className = "radio-inline";

        this.liveType2 = document.createElement("INPUT");
        this.li3.appendChild(this.liveType2);
        this.liveType2.type = "radio";
        this.liveType2.name = "type";
        this.liveType2.value = 2;
        this.liveType2.id = "liveType2";
        this.liveType2.addEventListener("click", this, false);

        this.li3.appendChild(document.createTextNode("PPT直播"));

        //row 4
        var row4 = document.createElement("DIV");
        parent.appendChild(row4);
        row4.className = "row";
        var col4_1 = document.createElement("DIV");
        row4.appendChild(col4_1);
        col4_1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        //create book name
        this.imageDIV = document.createElement("DIV");
        col4_1.appendChild(this.imageDIV);
        this.imageDIV.className = "form-group";

        this.imageName = document.createElement("LABEL");
        this.imageDIV.appendChild(this.imageName);
        this.imageName.className = "col-sm-2 control-label";
        this.imageName.innerHTML = "直播时间";

        this.imageFileDIV = document.createElement("DIV");
        this.imageDIV.appendChild(this.imageFileDIV);
        this.imageFileDIV.className = "col-sm-5";

        this.imageFile = document.createElement("INPUT");
        this.imageFileDIV.appendChild(this.imageFile);
        this.imageFile.className = "form-control";
        laydate.render({
            elem: this.imageFile, //指定元素
            type: 'datetime'
        });

        //row
        var row7 = document.createElement("DIV");
        parent.appendChild(row7);
        row7.className = "row";
        var col7_1 = document.createElement("DIV");
        row7.appendChild(col7_1);
        col7_1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        //create book name
        this.timeDIV = document.createElement("DIV");
        col7_1.appendChild(this.timeDIV);
        this.timeDIV.className = "form-group";

        this.timeName = document.createElement("LABEL");
        this.timeDIV.appendChild(this.timeName);
        this.timeName.className = "col-sm-2 control-label";
        this.timeName.innerHTML = "直播时长";

        this.timeSelect = document.createElement("DIV");
        this.timeDIV.appendChild(this.timeSelect);
        this.timeSelect.className = "col-sm-5";

        this.Select = document.createElement("SELECT");
        this.timeSelect.appendChild(this.Select);
        this.Select.className = "form-control";
        this.addOptions(this.Select, "--请选择--", -1, -1);
        this.addOptions(this.Select, "一小时", 1, 0);
        this.addOptions(this.Select, "二小时", 2, 1);
        this.addOptions(this.Select, "三小时", 3, 2);

        //row 8
        var row8 = document.createElement("DIV");
        parent.appendChild(row8);
        row8.className = "row";
        var col8_1 = document.createElement("DIV");
        row8.appendChild(col8_1);
        col8_1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        //create cover name
        this.infoDIV = document.createElement("DIV");
        col8_1.appendChild(this.infoDIV);
        this.infoDIV.className = "form-group";

        this.infoName = document.createElement("LABEL");
        this.infoDIV.appendChild(this.infoName);
        this.infoName.className = "col-sm-2 control-label";
        this.infoName.innerHTML = "详情封面";

        //create cover
        this.infoImageDIV = document.createElement("DIV");
        this.infoDIV.appendChild(this.infoImageDIV);
        this.infoImageDIV.style.backgroundColor = "#D3D3D3";
        this.infoImageDIV.className = "col-sm-2";
        this.infoImageDIV.style.width = "250px";
        this.infoImageDIV.style.height = "100px";

        this.infoImage = document.createElement("image");
        this.infoImageDIV.appendChild(this.infoImage);

        this.infoFileDIV = document.createElement("DIV");
        this.infoDIV.appendChild(this.infoFileDIV);
        this.infoFileDIV.className = "col-sm-4";
        this.infoFile = document.createElement("INPUT");
        this.infoFileDIV.appendChild(this.infoFile);
        this.infoFile.type = "file";
        this.infoFile.className = "form-control";

        this.infoDescribe = document.createElement("DIV");
        this.infoDIV.appendChild(this.infoDescribe);

        this.infoDescribe.className = "col-sm-4";
        this.infoDescribe.innerText = "视频封面用于展示，建议使用JPG、PNG格式，图片建议小于3M";

        //row 5
        var row5 = document.createElement("DIV");
        parent.appendChild(row5);
        row5.className = "row";
        var col5_1 = document.createElement("DIV");
        row5.appendChild(col5_1);
        col5_1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        //create video describe name
        this.videoDescribeDIV = document.createElement("DIV");
        col5_1.appendChild(this.videoDescribeDIV);
        this.videoDescribeDIV.className = "form-group";

        this.DescribeLabel = document.createElement("LABEL");
        this.videoDescribeDIV.appendChild(this.DescribeLabel);
        this.DescribeLabel.className = "col-sm-2 control-label";
        this.DescribeLabel.innerHTML = "直播详情";
        //create describe
        this.describel = document.createElement("DIV");
        this.describel.className = "col-sm-10";
        this.videoDescribeDIV.appendChild(this.describel);

        this.livedescribeInput = document.createElement("textarea");
        this.describel.appendChild(this.livedescribeInput);
        this.livedescribeInput.id = "live" + options.id;
    };

    Editor.prototype.commodityInfor = function (parent, options) {
        //row6
        var row6 = document.createElement("DIV");
        parent.appendChild(row6);
        row6.className = "row";
        var col6_1 = document.createElement("DIV");
        row6.appendChild(col6_1);
        col6_1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        //create sell type
        this.sellDIV = document.createElement("DIV");
        col6_1.appendChild(this.sellDIV);
        this.sellDIV.className = "form-group";

        this.sellType = document.createElement("LABEL");
        this.sellDIV.appendChild(this.sellType);

        this.sellType.className = "col-sm-2 control-label";
        this.sellType.innerHTML = "售卖方式:";

        this.sell = document.createElement("DIV");
        this.sellDIV.appendChild(this.sell);
        this.sell.className = "col-sm-10";


        var sellLabel = document.createElement("LABEL");
        this.sell.appendChild(sellLabel);
        sellLabel.className = "radio-inline";

        this.pay = document.createElement("INPUT");
        sellLabel.appendChild(this.pay);
        this.pay.type = "radio";
        this.pay.checked = true;
        this.pay.name = "sell";
        this.pay.value = 0;
        this.pay.id = "pay";
        this.pay.addEventListener("click", this, false);
        sellLabel.appendChild(document.createTextNode("付费"));


        var sellLabel1 = document.createElement("LABEL");
        this.sell.appendChild(sellLabel1);
        sellLabel1.className = "radio-inline";

        this.pay1 = document.createElement("INPUT");
        sellLabel1.appendChild(this.pay1);

        this.pay1.type = "radio";
        this.pay1.name = "sell";
        this.pay1.value = 1;
        this.pay1.id = "free";
        this.pay1.addEventListener("click", this, false);
        sellLabel1.appendChild(document.createTextNode("免费"));

        //row9
        var row9 = document.createElement("DIV");
        parent.appendChild(row9);
        row9.className = "row";
        var row9_1 = document.createElement("DIV");
        row9.appendChild(row9_1);
        row9_1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.prise = document.createElement("DIV");
        row9_1.appendChild(this.prise);

        //create goods prise
        this.divGoodsPrise = document.createElement("DIV");
        this.prise.appendChild(this.divGoodsPrise);
        this.divGoodsPrise.className = "form-group";

        this.priseName = document.createElement("LABEL");
        this.divGoodsPrise.appendChild(this.priseName);
        this.priseName.className = "col-sm-2 control-label";
        this.priseName.innerHTML = "商品价格";

        this.priseDIV = document.createElement("DIV");
        this.divGoodsPrise.appendChild(this.priseDIV);
        this.priseDIV.className = "col-sm-10";

        this.priseInput = document.createElement("INPUT");
        this.priseDIV.appendChild(this.priseInput);
        this.priseInput.id = "prise" + options.id;
        this.priseInput.className = "form-control";
        this.priseInput.type = "number";
        this.priseInput.setAttribute("placeholder", "请输入商品价格");

        //create Discount prise
        this.divDiscountsPrise = document.createElement("DIV");
        this.prise.appendChild(this.divDiscountsPrise);
        this.divDiscountsPrise.className = "form-group";

        this.discountName = document.createElement("LABEL");
        this.divDiscountsPrise.appendChild(this.discountName);
        this.discountName.className = "col-sm-2 control-label";
        this.discountName.innerHTML = "折扣价格";

        this.discountpriseDIV = document.createElement("DIV");
        this.divDiscountsPrise.appendChild(this.discountpriseDIV);
        this.discountpriseDIV.className = "col-sm-10";

        this.discountpriseInput = document.createElement("INPUT");
        this.discountpriseDIV.appendChild(this.discountpriseInput);
        this.discountpriseInput.id = "discountprise" + options.id;
        this.discountpriseInput.className = "form-control";
        this.discountpriseInput.type = "number";
        this.discountpriseInput.setAttribute("placeholder", "请输入商品价格");
    };

    Editor.prototype.loadDataFormDB = function (data) {
        this.infoFile.disabled = "disabled";
        this.saveButton.style.display = "none";
        this.updateButton.style.display = "";
        this.options.userId = data.userId + "|" + data.id;
        this.options.ownerId = data.ownerId;
        this.inputName.value = data.liveName;
        this.liveIntroduce.value = data.liveDesc;
        if (data.liveType == "语言图文直播") {
            this.liveType.checked = true;
        } else if (data.liveType == "视频录播+语言直播") {
            this.liveType1.checked = true;
        } else if (data.liveType == "ppt直播") {
            this.liveType2.checked = true;
        }
        this.imageFile.value = data.liveDate;
        if (data.liveTime == "一小时") {
            this.Select[0].selected = true;
        } else if (data.liveTime == "二小时") {
            this.Select[1].selected = true;
        } else if (data.liveTime == "三小时") {
            this.Select[2].selected = true;
        }
        // live.liveTime = this.Select.value;
        if (this.enditorInstance == undefined) {
            this.enditorInstance = CKEDITOR.replace(this.livedescribeInput.id, {
                language: 'zh-cn',
                height: 120,
                width: "100%",
            })
        }
        this.enditorInstance.setData(data.liveInfo);
        if (data.sellType == "否") {
            this.pay.checked = true;
            this.pay1.checked = false;
            this.prise.style.display = "block";
        } else if (data.sellType == "是") {
            this.pay1.checked = true;
            this.pay.checked = false;
            this.prise.style.display = "none";
        }
        this.priseInput.value = data.goodPrise;
        this.discountpriseInput.value = data.discountPrise;
    };

    Editor.prototype.getHeaderSize = function () {
        return 6;
    };

    Editor.prototype.addOptions = function (parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    Editor.prototype.loadData = function (entity, create) {
        if (this.enditorInstance == undefined) {
            this.enditorInstance = CKEDITOR.replace(this.livedescribeInput.id, {
                language: 'zh-cn',
                height: 120,
                width: "100%",
            });
        }
        var that = this;
        this.createNews = create;
        this.enditorInstance.on('change', function () {
            entity.liveInfo = this.getData();
            that.livedescribeInput.value = entity.liveInfo;
        });
        this.currObject = entity;
        if (entity.id == null || entity.id == "") { // create
            // this.currObject.publishDateTime = new Date().getTime();
            // this.currObject.author = this.options.userfullname;
            this.getId(this.currObject); // modify
        } else {
            this.loading(this.currObject);
        }
    };

    Editor.prototype.loading = function (obj) {
        // 设置数据到组件
        // this.input1.value = obj.title;
        // this.enditorInstance.setData(obj.content);
        // this.catSelect.value = obj.newsCategory;
        // this.levelSelect.value = obj.accessLevel;
        // this.input0.value = obj.author;
        // this.fromDateInput.value = Utils.getDateTime(obj.publishDateTime);

        //$(this.divTitleImage).children().remove();
        //$(this.divAttachments).children().remove();
        // if (this.currObject.titleImage != null
        //     && this.currObject.titleImage != "") {
        //
        // }
        //this.setAttachments(this.currObject);
    };

    Editor.prototype.getId = function (obj) {
        $("#progressbar").show();
        var that = this;
        $.getJSON(service.api(26), {}).complete(function (data) {
            obj.id = data.responseText;
            that.loading(obj);
            that.show();
            $("#progressbar").hide();
        });
    };

    Editor.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
        Utils.stopBubble(e);
    };

    Editor.prototype.doClick = function (evt) {
        if (evt.target == this.addNew || (evt.target.id == ("free"))) {
            this.prise.style.display = "none";
        } else if (evt.target == this.addNew || (evt.target.id == ("pay"))) {
            this.prise.style.display = "block";
        }
        if (evt.target == this.addNew || (evt.target.id == ("OKButton" + this.options.id))) {
            //console.log($('input:radio[name="sell"]:checked').val())
            //console.log(typeof ($('input:radio[name="sell"]:checked').val()));
            var data = this.checkData();
            if (data) {
                var array = new Array();
                array.push(this.infoFile);
                var live1 = this.packagename();
                this.live = JSON.stringify(live1);
                this.upload.url = service.uploadapi1(5, this.options.ownerId), // uploading arget url
                    this.upload.doUpload(array, this.live, 4, this);
            }
        } else if (evt.target == this.addNew || (evt.target.id == ("UPButton" + this.options.id))) {
            var data = this.checkDataForUpdate();
            if (data) {
                var liveData = new Live();
                var arrayId = this.options.userId.split("|");
                liveData.id = arrayId[1];
                liveData.userId = arrayId[0];
                liveData.ownerId = this.options.ownerId;
                liveData.liveName = this.inputName.value;
                liveData.liveDesc = this.liveIntroduce.value;
                liveData.liveType = $('input:radio[name="type"]:checked').val();
                liveData.liveTime = this.Select.value;
                liveData.liveInfo = this.enditorInstance.getData();
                liveData.sellType = $('input:radio[name="sell"]:checked').val();
                liveData.goodPrise = this.priseInput.value;
                liveData.discountPrise = this.discountpriseInput.value;
                this.live1 = JSON.stringify(liveData);
                this.updateLive(this.live1);
            }
        }
    };

    Editor.prototype.updateLive = function (obj) {
        $("#progressbar").show();
        var that = this;
        $.post(service.api(36), {
            data: obj,
            type: 4,
        }).complete(function (data) {
            that.updateButton.setAttribute("data-dismiss", "modal");
            // that.listViewPane.loadData(data.responseJSON);
            that.options.parent.loading(1, 12, "", that.options.userId);
            $("#progressbar").hide();
        });
    };

    Editor.prototype.packagename = function () {
        var live = new Live();
        live.userId = this.options.userId;
        live.ownerId = this.options.ownerId;
        live.liveName = this.inputName.value;
        live.liveDesc = this.liveIntroduce.value;
        live.liveType = $('input:radio[name="type"]:checked').val();
        live.liveDate = this.imageFile.value;
        live.liveTime = this.Select.value;
        live.liveInfo = this.livedescribeInput.value;
        live.sellType = $('input:radio[name="sell"]:checked').val();
        live.goodPrise = this.priseInput.value;
        live.discountPrise = this.discountpriseInput.value;
        return live;
    };

    Editor.prototype.checkDataForUpdate = function () {
        var flag = false;
        if (this.inputName.value == null || this.inputName.value == "") {
            this.messageBox.show(3, "请输入直播名称", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if (this.liveIntroduce.value == "") {
            this.messageBox.show(3, "请输入直播介绍", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if ($('input:radio[name="type"]:checked').val() == undefined) {
            this.messageBox.show(3, "请选择直播形式", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if (this.imageFile.value == "") {
            this.messageBox.show(3, "请选择直播时间", true);
            flag = false;
            return;
        } else {
            var choseDate = this.imageFile.value.replace(new RegExp(/-/g), "/");
            var nowDate = new Date();
            var timeFlag = this.validTime(choseDate, nowDate);
            if (timeFlag) {
                flag = true;
            } else {
                flag = false;
                this.messageBox.show(3, "直播日期必须晚于当前时间", true);
                return;
            }
        }
        if (this.Select.value == -1) {
            this.messageBox.show(3, "请选择直播时长", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if (this.livedescribeInput.value == "") {
            this.messageBox.show(3, "请输入直播详情", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if ($('input:radio[name="sell"]:checked').val() == "0") {
            if (this.priseInput.value == "") {
                this.messageBox.show(3, "请输入商品价格", true);
                flag = false;
                return;
            } else {
                flag = true;
            }
        }
        return flag;
    }
    Editor.prototype.checkData = function () {
        var flag = false;
        if (this.inputName.value == null || this.inputName.value == "") {
            this.messageBox.show(3, "请输入直播名称", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if (this.liveIntroduce.value == "") {
            this.messageBox.show(3, "请输入直播介绍", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if ($('input:radio[name="type"]:checked').val() == undefined) {
            this.messageBox.show(3, "请选择直播形式", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if (this.imageFile.value == "") {
            this.messageBox.show(3, "请选择直播时间", true);
            flag = false;
            return;
        } else {
            var choseDate = this.imageFile.value.replace(new RegExp(/-/g), "/");
            var nowDate = new Date();
            var timeFlag = this.validTime(choseDate, nowDate);
            if (timeFlag) {
                flag = true;
            } else {
                flag = false;
                this.messageBox.show(3, "直播日期必须晚于当前时间", true);
                return;
            }
        }
        if (this.Select.value == -1) {
            this.messageBox.show(3, "请选择直播时长", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if (this.infoFile.value == "") {
            this.messageBox.show(3, "请选择详情封面", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if (this.livedescribeInput.value == "") {
            this.messageBox.show(3, "请输入直播详情", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if ($('input:radio[name="sell"]:checked').val() == "0") {
            if (this.priseInput.value == "") {
                this.messageBox.show(3, "请输入商品价格", true);
                flag = false;
                return;
            } else {
                flag = true;
            }
        }
        return flag;
    };
    Editor.prototype.uploadSuccess = function () {
        this.messageDialog.show("发布成功,等待审核");
        this.options.parent.loading(1, 10, "", this.options.userId);
    };

    Editor.prototype.uploadFial = function () {
        this.messageDialog.show("发布失败");
    };
    Editor.prototype.show = function () {
        this.inputName.value = "";
        this.liveIntroduce.value = "";
        this.imageFile.value = "";
        this.Select.value = "";
        this.livedescribeInput.value = "";
        this.priseInput.value = "";
        this.discountpriseInput.value = "";
        this.updateButton.style.display = "none";
        this.saveButton.style.display = "";
        $(this.modalframe).modal({
            backdrop: 'static',
            keyboard: true
        });
    };

    Editor.prototype.validTime = function (startTime, endTime) {
        var startDateTime = startTime.split(" ");
        var arr1 = startDateTime[0].split("/");
        var arr1_1 = startDateTime[1].split(":")

        var date1 = new Date(parseInt(arr1[0]), parseInt(arr1[1]) - 1, parseInt(arr1[2]), parseInt(arr1_1[0]), parseInt(arr1_1[1]), parseInt(arr1_1[2]));

        if (date1.getTime() < endTime.getTime()) {
            return false;
        } else {
            return true;
        }
        return false;
    };
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Editor(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);
