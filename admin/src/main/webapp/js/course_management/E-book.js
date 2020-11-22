/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "EbookViewEditor";
    var defaults = {
        id: "",
        owner: "",
        userId: "",
        userfullname: "",
        ownername: "",
        basicpropsheet: "",
        propsheet: "",
        ownerId: "",
        width: "",
        height: "",
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
            width: "",
            height: "",
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
            // url: service.uploadapi1(5, this.options.ownerId), // uploading arget url
            userId: options.uid,
            userfullname: options.userfullname,
            ownername: options.ownername,
            //  parent: this.options, // parent plugin
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

        var titleH4 = document.createElement("H4");
        titleH4.className = "modal-title";
        titleH4.id = "modal" + options.id;
        dialogHeaderDIV.appendChild(titleH4);

        var infoIcon = document.createElement("i");
        infoIcon.className = "fa fa-plus-circle";
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
        label1.innerHTML = "书籍名称";

        this.colDIV1 = document.createElement("DIV");
        this.divName.appendChild(this.colDIV1);
        this.colDIV1.className = "col-sm-10";
        this.colDIV1.id = "inputbody1";

        this.inputName = document.createElement("INPUT");
        this.colDIV1.appendChild(this.inputName);
        this.inputName.id = "videoName" + options.cid;
        this.inputName.className = "form-control";
        this.inputName.type = "text";
        this.inputName.setAttribute("placeholder",
            "视频名称，(建议字数在14个字以内)");
        this.inputName.addEventListener("blur", this, false);
        this.inputName.addEventListener("change", this, false);
        this.inputName.addEventListener("keyup", this, false);

        //create row2
        var row2 = document.createElement("DIV");
        parent.appendChild(row2);
        row2.className = "row";

        var col2_1 = document.createElement("DIV");
        row2.appendChild(col2_1);
        col2_1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        // create upload video name
        this.bookFile = document.createElement("DIV");
        col2_1.appendChild(this.bookFile);
        this.bookFile.className = "form-group";
        this.bookName = document.createElement("LABEL");
        this.bookFile.appendChild(this.bookName);
        this.bookName.className = "col-sm-2 control-label";
        this.bookName.innerHTML = "上传书籍";
        //create book
        this.colDIV1 = document.createElement("DIV");
        this.bookFile.appendChild(this.colDIV1);
        this.colDIV1.className = "col-sm-10";
        this.colDIV1.id = "inputbody2";
        this.inputName1 = document.createElement("INPUT");
        this.colDIV1.appendChild(this.inputName1);
        this.inputName1.id = "videoName" + options.cid;
        this.inputName1.className = "form-control";
        this.inputName1.type = "file";
        this.bookFile.appendChild(this.colDIV1);
        //row 3
        var row3 = document.createElement("DIV");
        parent.appendChild(row3);
        row3.className = "row";
        var col3_1 = document.createElement("DIV");
        row3.appendChild(col3_1);
        col3_1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        //create author name
        this.authorDIV = document.createElement("DIV");
        col3_1.appendChild(this.authorDIV);
        this.authorDIV.className = "form-group";
        this.authorName = document.createElement("LABEL");
        this.authorName.className = "col-sm-2 control-label";
        this.authorDIV.appendChild(this.authorName);
        this.authorName.innerHTML = "书籍作者";

        //create author
        this.authorFileDIV = document.createElement("DIV");
        this.authorFileDIV.className = "col-sm-10";
        this.authorDIV.appendChild(this.authorFileDIV);
        this.authorFile = document.createElement("INPUT");
        this.authorFile.className = "form-control";
        this.authorFile.type = "text";
        this.authorFile.setAttribute("placeholder", "请输入书籍作者");
        this.authorFile.addEventListener("blur", this, false);
        this.authorFile.addEventListener("change", this, false);
        this.authorFile.addEventListener("keyup", this, false);
        this.authorFileDIV.appendChild(this.authorFile);
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
        this.imageName.innerHTML = "书籍封面";
        //create patch
        this.ImageDIV = document.createElement("DIV");
        this.imageDIV.appendChild(this.ImageDIV);
        this.ImageDIV.style.backgroundColor = "#D3D3D3";
        this.ImageDIV.className = "col-sm-2";
        this.ImageDIV.style.width = "250px";
        this.ImageDIV.style.height = "100px";

        this.bookImage = document.createElement("image");
        this.ImageDIV.appendChild(this.bookImage);
        this.bookImage.style.width = "250px";
        this.bookImage.style.height = "100px";

        this.imageFileDIV = document.createElement("DIV");
        this.imageDIV.appendChild(this.imageFileDIV);
        this.imageFileDIV.className = "col-sm-4";

        this.inputName2 = document.createElement("INPUT");
        this.imageFileDIV.appendChild(this.inputName2);
        this.inputName2.type = "file";
        this.inputName2.className = "form-control";

        this.imageDescribe = document.createElement("DIV");
        this.imageDescribe.className = "col-sm-4";
        this.imageDIV.appendChild(this.imageDescribe);
        this.imageDescribe.innerText = "书籍封面用于展示，建议使用JPG、PNG格式，图片建议小于3M";

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
        this.DescribeLabel.innerHTML = "书籍描述";

        // create description rich text editor
        this.describel = document.createElement("DIV");
        this.videoDescribeDIV.appendChild(this.describel);
        this.describel.className = "col-sm-10";

        this.describeInput = document.createElement("textarea");
        this.describel.appendChild(this.describeInput);
        this.describeInput.className = "form-control";
        this.describeInput.id = "book" + options.id;
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

        //row7
        var row7 = document.createElement("DIV");
        parent.appendChild(row7);
        row7.className = "row";
        var row7_1 = document.createElement("DIV");
        row7.appendChild(row7_1);
        row7_1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.prise = document.createElement("DIV");
        row7_1.appendChild(this.prise);

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
        this.priseInput.value = "0.00";
        this.priseInput.id = "prise" + options.id;
        this.priseInput.className = "form-control";
        this.priseInput.type = "number";
        this.priseInput.setAttribute("placeholder", "请输入商品价格");

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
        this.discountpriseInput.value = 0.00;
        this.discountpriseInput.className = "form-control";
        this.discountpriseInput.type = "number";
        this.discountpriseInput.setAttribute("placeholder",
            "请输入折扣价格");
    };

    Editor.prototype.getHeaderSize = function () {
        return 6;
    };

    Editor.prototype.loadDataFormDB = function (data) {
        this.inputName1.disabled = "disabled";
        this.inputName2.disabled = "disabled";
        this.saveButton.style.display = "none";
        this.updateButton.style.display = "";
        this.options.userId = data.userId + "|" + data.id;
        this.options.ownerId = data.ownerId;
        this.inputName.value = data.bookName;
        this.authorFile.value = data.bookAuthor;
        //this.describeInput.value = data.descript;
        //CKEDITOR.instances.content.setData(data.descript);
        if (this.enditorInstance == undefined) {
            this.enditorInstance = CKEDITOR.replace(this.describeInput.id, {
                language: 'zh-cn',
                height: 120,
                width: "100%",
            })
        }
        this.enditorInstance.setData(data.descript);
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

    Editor.prototype.loadData = function (entity, create) {
        if (this.enditorInstance == undefined) {
            this.enditorInstance = CKEDITOR.replace(this.describeInput.id, {
                language: 'zh-cn',
                height: 120,
                width: "100%",
            })
        }
        this.enditorInstance.setData("");
        var that = this;
        this.createNews = create;
        this.enditorInstance.on('change', function () {
            entity.descript = this.getData();
            that.describeInput.value = entity.descript;
        });
        this.currObject = entity;
        this.currObject.owner = this.options.ownerId;
        if (entity.id == null || entity.id == "") { // create
            // this.currObject.publishDateTime = new Date().getTime();
            // this.currObject.author = this.options.userfullname;
            this.getId(this.currObject); // modify
        } else {
            this.loading(this.currObject);
        }
        this.describeInput.value = this.currObject.descript;
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
    };

    Editor.prototype.doClick = function (evt) {
        if (evt.target == this.addNew || (evt.target.id == ("free"))) {
            this.prise.style.display = "none";
        } else if (evt.target == this.addNew || (evt.target.id == ("pay"))) {
            this.prise.style.display = "block";
        }
        if (evt.target == this.addNew || (evt.target.id == ("OKButton" + this.options.id))) {
            var data = this.checkData();
            if (data) {
                var array = new Array()
                array.push(this.inputName1);//this.inputName1 是文件的input框，将这个对象存到数组即可
                array.push(this.inputName2);
                var bookData = new Book();
                bookData.id = "";
                bookData.userId = this.options.userId;
                bookData.ownerId = this.options.ownerId;
                bookData.bookName = this.inputName.value;
                bookData.bookAuthor = this.authorFile.value;
                bookData.descript = this.describeInput.value;
                bookData.sellType = $('input:radio[name="sell"]:checked').val();
                bookData.goodPrise = this.priseInput.value;
                bookData.discountPrise = this.discountpriseInput.value;
                this.book = JSON.stringify(bookData);
                this.upload.url = service.uploadapi1(5, this.options.ownerId);
                this.upload.doUpload(array, this.book, 1, this);
            }
        } else if (evt.target == this.addNew || (evt.target.id == ("UPButton" + this.options.id))) {
            var data = this.checkDataForUpdate();
            if (data) {
                var bookData = new Book();
                var arrayId = this.options.userId.split("|");
                bookData.id = arrayId[1];
                bookData.userId = arrayId[0];
                bookData.ownerId = this.options.ownerId;
                bookData.bookName = this.inputName.value;
                bookData.bookAuthor = this.authorFile.value;
                bookData.descript = this.enditorInstance.getData();
                bookData.sellType = $('input:radio[name="sell"]:checked').val();
                bookData.goodPrise = this.priseInput.value;
                bookData.discountPrise = this.discountpriseInput.value;
                this.book1 = JSON.stringify(bookData);
                this.updateBook(this.book1);
            }
        }
    };

    Editor.prototype.updateBook = function (obj) {
        $("#progressbar").show();
        var that = this;
        $.post(service.api(36), {
            data: obj,
            type: 1,
        }).complete(function (data) {
            that.updateButton.setAttribute("data-dismiss", "modal");
            // that.listViewPane.loadData(data.responseJSON);
            that.options.parent.loading(1, 12, "", that.options.userId);
            $("#progressbar").hide();
        });
    };

    Editor.prototype.checkData = function () {
        var flag = false;
        if (this.inputName.value == null || this.inputName.value == "") {
            this.messageBox.show(3, "请输入书籍名称", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if (this.inputName1.value == "") {
            this.messageBox.show(3, "请选择书籍", true);
            flag = false;
            return;
        } else {
            var str = this.inputName1.value.substr(this.inputName1.value.length - 3);
            if (str != "pdf") {
                this.messageBox.show(3, "请选择pdf格式", true);
                flag = false;
                return;
            } else {
                flag = true;
            }
        }
        if (this.authorFile.value == null || this.authorFile.value == "") {
            this.messageBox.show(3, "请输入作者", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if (this.inputName2.value == "") {
            this.messageBox.show(3, "请选择书籍封面", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if (this.describeInput.value == "" || this.describeInput.value == null) {
            this.messageBox.show(3, "请输入书籍描述", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if ($('input:radio[name="sell"]:checked').val() == 0) {
            if (this.priseInput.value == "" || this.describeInput.value == null) {
                this.messageBox.show(3, "请输入商品价格", true);
                flag = false;
                return;
            } else {
                flag = true;
            }
        }
        return flag;
    };

    Editor.prototype.checkDataForUpdate = function () {
        var flag = false;
        if (this.inputName.value == null || this.inputName.value == "") {
            this.messageBox.show(3, "请输入书籍名称", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if (this.authorFile.value == null || this.authorFile.value == "") {
            this.messageBox.show(3, "请输入作者", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if (this.enditorInstance.getData() == "" || this.enditorInstance.getData() == null) {
            this.messageBox.show(3, "请输入书籍描述", true);
            flag = false;
            return;
        } else {
            flag = true;
        }
        if ($('input:radio[name="sell"]:checked').val() == 0) {
            if (this.priseInput.value == "" || this.describeInput.value == null) {
                this.messageBox.show(3, "请输入商品价格", true);
                flag = false;
                return;
            } else {
                flag = true;
            }
        }
        return flag;
    };

    Editor.prototype.show = function () {
        this.inputName.value = "";
        this.authorFile.value = "";
        this.describeInput.value = "";
        this.priseInput.value = "";
        this.discountpriseInput.value = "";
        this.pay.setAttribute("checked", true);
        this.updateButton.style.display = "none";
        this.saveButton.style.display = "";
        $(this.modalframe).modal({
            backdrop: 'static',
            keyboard: true
        });
    };
    Editor.prototype.uploadSuccess = function () {
        this.messageDialog.show("发布成功,等待审核");
        this.options.parent.loading(1, 10, "", this.options.userId);
    };

    Editor.prototype.uploadFial = function () {
        this.messageDialog.show("发布成功");
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
