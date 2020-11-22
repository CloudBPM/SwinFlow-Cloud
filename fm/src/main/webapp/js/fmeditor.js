;
(function ($, window, document, undefined) {
    var pluginName = "fmEditor";
    var defaults = {
        id: "",// form ID
        basicpropsheet: "",
        propsheet: "",
        owner: "", // org ID
        width: 0,
        height: 0,
        sid: "",
        uid: "",
        uname: "",
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            basicpropsheet: "",
            propsheet: "",
            owner: "",
            width: 0,
            height: 0,
            sid: "",
            uid: "",
            uname: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.painterRow = null;
        this.toolbarRow = null;
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;

        this.init(options);
        this.pallet(options);
        this.shading(options);
        this.createToolbar(options);

        var currObject = new Form();
        currObject.id = options.id;
        currObject.owner = options.ownerId;
        currObject.createDatetime = new Date().getTime();
        currObject.lastupdate = new Date().getTime();
        this.currObject = currObject;
        this.loadingObject(options);// loading
        this.selected = null; // the selected object;

        window.addEventListener('keydown', this, true);

        // var p4 = $(this.element).previewDialog({
        // 	id : "FM039",
        // 	title : "轩琦科技 - 表单界面预览效果",
        // 	parent : this,
        // });
        // this.previewDlg = p4.data("previewDialog");

        var p4 = $(this.element).releaseFormDialog({
            id: "FM093",
            title: "轩琦科技 - 创建版本",
            topparent: options.parent, // man content panel
            owner: options.owner,// organization ID
            uid: options.uid,
            uname: options.uname,
        });
        this.releaseFormDlg = p4.data("releaseFormDialog");
    };

    Editor.prototype.loadingObject = function (options) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(5), {
            id: options.id,
            r: "0",
        }).complete(function (data) {
            that.currObject.parseFromJSON(data.responseJSON, 0);
            //that.canvasPane.appendChild(that.currObject.dom);
            that.currObject.toDom(that.canvasPane);
            that.setPropertySheet();
            $("#progressbar").hide();
            if (that.currObject.children.length > 0) {
                that.enableButton(that.deletebutton);
            } else {
                that.disableButton(that.deletebutton);
            }
        });
    };

    Editor.prototype.init = function (options) {
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);
        editorPanel.style.margin = "0px";
        editorPanel.style.padding = "0px";
        editorPanel.style.overflow = "auto";
        this.toolbarRow = document.createElement("DIV");
        editorPanel.appendChild(this.toolbarRow);
        this.toolbarRow.className = "row";
        this.toolbarRow.style.margin = "0px";
        this.toolbarRow.style.padding = "0px";
        this.painterRow = document.createElement("DIV");
        editorPanel.appendChild(this.painterRow);
        this.painterRow.className = "row";
        this.painterRow.style.margin = "0px";
        this.painterRow.style.padding = "0px";
    };

    Editor.prototype.createToolbar = function (options) {
        var parent = document.createElement("DIV");
        this.toolbarRow.appendChild(parent);
        parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        parent.style.margin = "0px";
        parent.style.padding = "2px";

        var c = "btn btn-default";
        var c1 = "btn btn-danger";
        var c2 = "btn btn-primary";
        var g1 = this.createGroup(parent);
        // fa-lg: 24px; fa-2x ：32px
        this.undobutton = this.createTool(g1, "undo" + options.id, "撤销",
            c, "i", "fa fa-reply fa-lg");
        this.redobutton = this.createTool(g1, "redo" + options.id, "恢复",
            c, "i", "fa fa-share fa-lg");
        this.stack.undoButton = this.undobutton;
        this.stack.redoButton = this.redobutton;
        this.disableButton(this.undobutton);
        this.disableButton(this.redobutton);

        var g2 = this.createGroup(parent);
        this.copybutton = this.createTool(g2, "copy" + options.id, "复制",
            "btn btn-default", "i", "fa fa-files-o fa-lg");
        this.pastebutton = this.createTool(g2, "paste" + options.id, "粘贴",
            c, "i", "fa fa-clipboard fa-lg");
        this.cutbutton = this.createTool(g2, "cut" + options.id, "剪切", c,
            "i", "fa fa-scissors fa-lg");
        this.deletebutton = this.createTool(g2, "delete" + options.id,
            "清除当前表单上的所有组件", c1, "i", "fa fa-trash-o fa-lg");
        this.disableButton(this.copybutton);
        this.disableButton(this.pastebutton);
        this.disableButton(this.cutbutton);

        var g3 = this.createGroup(parent);
        this.printbutton = this.createTool(g3, "print" + options.id, "打印",
            c2, "i", "fa fa-print fa-lg");

        var g5 = this.createGroup(parent);
        this.mobile = this.createTool(g5, "mobile" + options.id, "智能手机",
            c, "i", "fa fa-mobile fa-lg");
        this.tablet = this.createTool(g5, "tablet" + options.id, "平板电脑",
            c, "i", "fa fa-tablet fa-lg");
        this.laptop = this.createTool(g5, "laptop" + options.id, "手提电脑",
            c, "i", "fa fa-laptop fa-lg");
        this.desktop = this.createTool(g5, "desktop" + options.id, "台式电脑",
            c, "i", "fa fa-desktop fa-lg");
        this.tablet.classList.add("active");

        var g4 = this.createGroup(parent);
        this.portrait = this.createTool(g4, "portrait" + options.id,
            "设备竖放的界面效果", c, "i", "fa fa-arrows-v fa-lg");
        this.landscape = this.createTool(g4, "landscape" + options.id,
            "设备横放的界面效果", c, "i", "fa fa-arrows-h fa-lg");
        this.portrait.classList.add("active");

        var g5 = this.createGroup(parent);
        this.preview = this.createTool(g5, "preview" + options.id,
            "预览实际运行效果", c2, "i", "fa fa-coffee fa-lg");

        var g6 = this.createGroup(parent);
        this.release = this.createTool(g6, "release" + options.id,
            "创建一个新版本", c2, "i", "fa fa-globe fa-lg");

    };

    Editor.prototype.createGroup = function (parent) {
        var group = document.createElement("DIV");
        parent.appendChild(group);
        group.className = "btn-group";
        group.style.padding = "2px";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "");
        return group;
    };

    Editor.prototype.createTool = function (group, id, title, style, fonttag,
                                            fontclass) {
        var button = document.createElement("button");
        group.appendChild(button);
        button.className = style;
        button.setAttribute("title", title);
        button.type = "button";
        button.id = id;
        button.addEventListener('click', this, false);
        var icon = document.createElement(fonttag);
        button.appendChild(icon);
        icon.className = fontclass;
        icon.setAttribute("title", title);
        icon.id = id;
        return button;
    };

    Editor.prototype.enableEditButtons = function () {
        this.enableButton(this.copybutton);
        this.enableButton(this.cutbutton);
        this.enableButton(this.deletebutton);
    };

    Editor.prototype.disableEditButtons = function () {
        this.disableButton(this.copybutton);
        this.disableButton(this.cutbutton);
        this.disableButton(this.deletebutton);
    };

    Editor.prototype.enableButton = function (button) {
        button.removeAttribute("disabled");
    };

    Editor.prototype.disableButton = function (button) {
        button.setAttribute("disabled", "true");
    };

    Editor.prototype.createPalletBar = function (id, barname, expanded, clpin,
                                                 parent, title) {
        var panel = document.createElement("DIV");
        parent.appendChild(panel);
        panel.className = "panel panel-default";

        var panelHeading = document.createElement("DIV");
        panel.appendChild(panelHeading);
        panelHeading.className = "panel-heading";
        panelHeading.setAttribute("role", "tab");
        panelHeading.id = "heading" + id;

        var h4title = document.createElement("h4");
        panelHeading.appendChild(h4title);
        h4title.className = "panel-title";

        var atitle = document.createElement("a");
        h4title.appendChild(atitle);
        atitle.setAttribute("role", "button");
        atitle.setAttribute("data-toggle", "collapse");
        atitle.setAttribute("data-parent", "#accordion");
        atitle.setAttribute("href", "#collapse" + id);
        atitle.setAttribute("aria-expanded", "" + expanded + "");
        atitle.setAttribute("aria-controls", "collapse" + id);
        atitle.text = barname;
        atitle.setAttribute("title", title);

        var panelBody = document.createElement("DIV");
        panel.appendChild(panelBody);
        panelBody.id = "collapse" + id;
        panelBody.className = "panel-collapse collapse " + clpin;
        panelBody.setAttribute("role", "tabpanel");
        panelBody.setAttribute("aria-labelledby", "heading" + id);

        var componentList = document.createElement("ul");
        panelBody.appendChild(componentList);
        componentList.className = "list-group";

        return componentList;
    };

    Editor.prototype.pallet = function (options) {
        var palletPanel = document.createElement("DIV");
        this.painterRow.appendChild(palletPanel);
        palletPanel.id = "accordion" + options.id;
        palletPanel.className = "col";
        palletPanel.style.width = "72px";
        palletPanel.style.margin = "0px";
        palletPanel.style.padding = "0px";
        palletPanel.style.overflowY = "auto";
        palletPanel.style.height = (options.height - 84) + "px";
        var group = document.createElement("DIV");
        palletPanel.appendChild(group);
        group.id = "accordion";
        group.className = "panel-group";
        group.style.margin = "0px";
        group.style.padding = "0px";
        group.style.width = "72px";
        group.style.minWidth = "72px";
        group.style.maxWidth = "72px";

        group.setAttribute('role', 'tablist');// $("input").attr("value","txt");
        group.setAttribute('aria-multiselectable', 'true');

        var taskbar1 = this.createPalletBar("One" + options.id, "布局", false, "", group,
            "用户界面上的组件分布格局");
        taskbar1.appendChild(new OneColumn(options.id).toItem());
        taskbar1.appendChild(new TwoColumns(options.id).toItem());
        taskbar1.appendChild(new ThreeColumns(options.id).toItem());
        taskbar1.appendChild(new FourColumns(options.id).toItem());
        taskbar1.appendChild(new SixColumns(options.id).toItem());
        taskbar1.appendChild(new EightFourColumns(options.id).toItem());
        taskbar1.appendChild(new FourEightColumns(options.id).toItem());

        var taskbar2 = this.createPalletBar("Two" + options.id, "静态", false, "", group,
            "基本的静态非交互组件");
        taskbar2.appendChild(new HeaderComponent(options.id).toItem());
        taskbar2.appendChild(new ParagraphComponent(options.id).toItem());
        taskbar2.appendChild(new StaticListComponent(options.id).toItem());
        taskbar2.appendChild(new ImageComponent(options.id).toItem());
        taskbar2.appendChild(new AnchorComponent(options.id).toItem());

        var taskbar3 = this.createPalletBar("Three" + options.id, "动态", true, "in", group,
            "基本的动态可交互组件");
        taskbar3.appendChild(new SingleInputComponent(options.id).toItem());
        taskbar3.appendChild(new SingleSelectComponent(options.id).toItem());
        //taskbar3.appendChild(new ListSelectComponent(options.id).toItem());
        taskbar3.appendChild(new MultipleLineInputComponent(options.id)
            .toItem());
        taskbar3.appendChild(new CheckboxComponent(options.id).toItem());
        taskbar3.appendChild(new RadioComponent(options.id).toItem());
        taskbar3.appendChild(new ButtonComponent(options.id).toItem());
        //taskbar3.appendChild(new LargeButtonComponent(options.id).toItem());
        taskbar3.appendChild(new FileUploadComponent(options.id).toItem());
        taskbar3.appendChild(new IntegerInputComponent(options.id).toItem());
        taskbar3.appendChild(new RealInputComponent(options.id).toItem());
        taskbar3.appendChild(new CurrencyInputComponent(options.id).toItem());
        taskbar3.appendChild(new NaturalNumberInputComponent(options.id).toItem());
        taskbar3.appendChild(new DateTimeComponent(options.id).toItem());
        taskbar3.appendChild(new DateTimeRangeComponent(options.id).toItem());
        taskbar3.appendChild(new FileReaderComponent(options.id).toItem());
        taskbar3.appendChild(new FileReadersComponent(options.id).toItem());
        var taskbar4 = this.createPalletBar("Four" + options.id, "高级", false, "", group,
            "提供特定功能的组件");
        //taskbar4.appendChild(new RichTextInputComponent(options.id).toItem());
        taskbar4.appendChild(new PageableTableViewComponent(options.id).toItem());
        taskbar4.appendChild(new TableViewComponent(options.id).toItem());
        taskbar4.appendChild(new BarChartComponent(options.id).toItem());
        taskbar4.appendChild(new CurveChartComponent(options.id).toItem());
        taskbar4.appendChild(new PieChartComponent(options.id).toItem());
        taskbar4.appendChild(new MapComponent(options.id).toItem());

        var taskbar5 = this.createPalletBar("Five" + options.id, "容器", true, "", group,
            "可容纳多个组件的容器组件");

        var taskbar6 = this.createPalletBar("Five" + options.id, "复合", true, "", group,
            "包含了预定义组件的容器组件（复杂组件）");
    };

    Editor.prototype.shading = function (options) {
        var canvasPanel = document.createElement("DIV");
        this.painterRow.appendChild(canvasPanel);
        canvasPanel.id = "canvasPanel" + options.id;
        canvasPanel.className = "col";
        canvasPanel.style.width = (options.width - 76) + "px";
        canvasPanel.style.margin = "0px";
        canvasPanel.style.marginLeft = "4px";
        canvasPanel.style.padding = "0px";
        canvasPanel.style.position = "relative";

        this.canvasPane = document.createElement("DIV");
        canvasPanel.appendChild(this.canvasPane);

        // root container
        this.canvasPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.canvasPane.id = "convasPane" + options.id;
        this.canvasPane.style.margin = "0px";
        this.canvasPane.style.padding = "0px";
        this.canvasPane.style.backgroundColor = "#f6f6f6";
        this.canvasPane.style.overflowX = "auto";
        this.canvasPane.style.overflowY = "auto";
        this.canvasPane.style.border = "1px solid #ddd";
        this.canvasPane.style.height = (options.height - 84) + "px";
        this.canvasPane.style.position = "relative";

        // Create a new style tag
        this.style = document.createElement("style");
        // Append the style tag to head
        document.head.appendChild(this.style);
        this.style.setAttribute("type", "text/css");
        this.style.appendChild(this.addFormStyle());
        this.style.appendChild(this.addRowStyle());
        this.style.appendChild(this.addColStyle());
        this.style.appendChild(this.addRemoveLabel());
        this.style.appendChild(this.addRemoveHover());

        this.style.appendChild(this.newComponentLabel());
        this.style.appendChild(this.newComponentHover());

        this.style.appendChild(this.addRowMoveHover());
        this.style.appendChild(this.addColHover());
        this.style.appendChild(this.addFormTitleLabel("表单"));
        this.style.appendChild(this.addRowTitleLabel("行"));
        this.style.appendChild(this.addColTitleLabel("列"));
        this.style.appendChild(this.addComponentOutline());
        this.style.appendChild(this.addOptionStyle());
        this.style.appendChild(this.addComHover());
    };

    Editor.prototype.removeStyle = function (v) {
        this.style.removeChild(v);
    };

    Editor.prototype.getDirty = function () {
        return this.stack.isDirty();
    };

    Editor.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "keypress":
                this.doKeypress(e);
                break;
            case "click":
                this.doClick(e);
                break;
        }
    };

    Editor.prototype.doClick = function (evt) {
        if (evt.target == this.undobutton
            || evt.target.id == ("undo" + this.options.id)) {
            this.stack.undo();
        } else if (evt.target == this.redobutton
            || evt.target.id == ("redo" + this.options.id)) {
            this.stack.redo();
        } else if (evt.target == this.copybutton
            || evt.target.id == ("copy" + this.options.id)) {
        } else if (evt.target == this.pastebutton
            || evt.target.id == ("paste" + this.options.id)) {
        } else if (evt.target == this.cutbutton
            || evt.target.id == ("cut" + this.options.id)) {
        } else if (evt.target == this.deletebutton
            || evt.target.id == ("delete" + this.options.id)) {
            this.clearAll(evt);
        } else if (evt.target == this.printbutton
            || evt.target.id == ("print" + this.options.id)) {
        } else if (evt.target == this.mobile
            || evt.target.id == ("mobile" + this.options.id)) {
            this.mobile.classList.add("active");
            this.tablet.classList.remove("active");
            this.laptop.classList.remove("active");
            this.desktop.classList.remove("active");
            this.currObject.dom.style.width = "483px";
        } else if (evt.target == this.tablet
            || evt.target.id == ("tablet" + this.options.id)) {
            this.tablet.classList.add("active");
            this.mobile.classList.remove("active");
            this.laptop.classList.remove("active");
            this.desktop.classList.remove("active");
            this.currObject.dom.style.width = "738px";
        } else if (evt.target == this.laptop
            || evt.target.id == ("laptop" + this.options.id)) {
            this.laptop.classList.add("active");
            this.mobile.classList.remove("active");
            this.tablet.classList.remove("active");
            this.desktop.classList.remove("active");
            this.currObject.dom.style.width = "1360px";
        } else if (evt.target == this.desktop
            || evt.target.id == ("desktop" + this.options.id)) {
            this.desktop.classList.add("active");
            this.mobile.classList.remove("active");
            this.tablet.classList.remove("active");
            this.laptop.classList.remove("active");
            this.currObject.dom.style.width = "1920px";
        } else if (evt.target == this.landscape
            || evt.target.id == ("landscape" + this.options.id)) {
            this.landscape.classList.add("active");
            this.portrait.classList.remove("active");
        } else if (evt.target == this.portrait
            || evt.target.id == ("portrait" + this.options.id)) {
            this.portrait.classList.add("active");
            this.landscape.classList.remove("active");
        } else if (evt.target == this.preview
            || evt.target.id == ("preview" + this.options.id)) {
            // this.currObject is form;
            //this.previewDlg.show(this.currObject.clone());
            window.open("fmpreview.jsp?sessionId=" + this.options.sid + "&fid=" + this.options.id + "&r=0");
        } else if (evt.target == this.release
            || evt.target.id == ("release" + this.options.id)) {
            this.releaseFormDlg.setForm(this.currObject);
            this.releaseFormDlg.show();
        }
        Utils.stopBubble(evt);
    };

    Editor.prototype.setPropertySheet = function () {
        var obj = this.currObject;
        if (this.selected != null) {
            obj = this.selected;
        }
        if (this.basicpropsheet != null) {
            this.basicpropsheet.setSheet(obj, this.currObject);
        }
        if (this.propsheet != null) {
            this.propsheet.setSheet(obj, this.currObject, this.propsheet
                .getCurrTabIndex(obj));
        }
    };

    Editor.prototype.updateDom = function () {
        //var obj = this.currObject;
        //if (this.selected != null) {
        //    obj = this.selected;
        //}
        //if (obj != undefined) {
            $(this.canvasPane).empty();
            this.currObject.toDom(this.canvasPane);
            //this.selected.updateDom(this.selected.dom.parentElement);
       // }
    };

    Editor.prototype.clearAll = function (evt) {
        this.stack.execute(new FMRemoveAllRowsCmd(this.currObject));
    };

    Editor.prototype.doKeypress = function (evt) {
        evt = evt || window.event;
        // if (evt.ctrlKey) {
        // if (evt.keyCode == '65') { // A
        // this.selectAllObjects(this.currObject.children);
        // } else if (evt.keyCode == '38') { // up arrow
        // this.move(this.selected, 0, -1);
        // } else if (evt.keyCode == '40') { // down arrow
        // this.move(this.selected, 0, 1);
        // } else if (evt.keyCode == '37') { // left arrow
        // this.move(this.selected, -1, 0);
        // } else if (evt.keyCode == '39') { // right arrow
        // this.move(this.selected, 1, 0);
        // // } else if (evt.keyCode == '67') { // Copy
        // // } else if (evt.keyCode == '86') { // Paste
        // // } else if (evt.keyCode == '88') { // Cut
        // } else if (evt.keyCode == '80') { // Print
        // } else if (evt.keyCode == '122') { // Ctrl + Z: undo
        // this.stack.undo();
        // } else if (evt.keyCode == '121') { // Ctrl + Y: redo
        // this.stack.redo();
        // }
        // } else {
        // if (evt.keyCode == '27') { // Esc key
        // this.disableSelectedObjects(this.currObject.children);
        // } else if (evt.keyCode == '38') { // up arrow
        // this.move(this.selected, 0, -5);
        // } else if (evt.keyCode == '40') { // down arrow
        // this.move(this.selected, 0, 5);
        // } else if (evt.keyCode == '37') { // left arrow
        // this.move(this.selected, -5, 0);
        // } else if (evt.keyCode == '39') { // right arrow
        // this.move(this.selected, 5, 0);
        // } else if (evt.keyCode == '112') { // F1 help
        // //
        // }
        // }
        // this.repaint();
        Utils.stopBubble(evt);
    };

    Editor.prototype.addMediaStyle = function () {
        return document
            .createTextNode("@media only preview and (min-width : 321px) {}");
    }

    Editor.prototype.addFormStyle = function () {
        return document
            .createTextNode(".formedit{cursor:default;position:relative;"
                + "border:1px solid #ccc;background-color:#FAFAFA;"
                + "box-sizing:border-box;box-shadow:inset 0 1px 13px rgba(0,0,0,.1);"
                + "border-radius:4px;margin:0px;padding:25px;width:738px;min-height:790px;overflow:auto;}"
                + "");
    };

    Editor.prototype.addRowStyle = function () {
        return document
            .createTextNode(".rowedit{display:block;position:relative;"
                + "border:1px solid #ddd;background-color:#F5F5F5;"
                + "box-sizing:border-box;border-radius:4px;margin-top:5px; "
                + "padding:25px 19px 24px;min-height:195px;overflow:auto;}");
    };

    Editor.prototype.addColStyle = function () {
        return document.createTextNode(".coledit{position:relative;"
            + "border:1px solid #ddd;background-color:#fff;"
            + "box-sizing:border-box;border-radius:4px;margin-top:5px;"
            + "padding:25px 19px 24px;min-height:152px;overflow:auto;}");
    };

    Editor.prototype.addRemoveLabel = function () {
        return document
            .createTextNode(".remove{position:absolute;"
                + "top:5px;right:5px;z-index:10;opacity:.2;background-color:#d9534f;display:inline;"
                + "padding:.2em .6em .3em;font-size:75%;color:#fff;border-radius:.25em;"
                + "text-align:center;font-weight:700;line-height:1;white-space:nowrap;text-decoration:none;}");
    };

    Editor.prototype.newComponentLabel = function () {
        return document
            .createTextNode(".newcomponent{position:absolute;"
                + "top:5px;right:30px;z-index:11;opacity:.2;background-color:#d9534f;display:inline;"
                + "padding:.2em .6em .3em;font-size:75%;color:#fff;border-radius:.25em;"
                + "text-align:center;font-weight:700;line-height:1;white-space:nowrap;text-decoration:none;}");
    };

    Editor.prototype.addRowMoveHover = function () {
        return document.createTextNode(".rowedit:hover{cursor:move;}");
    };

    Editor.prototype.addColHover = function () {
        return document.createTextNode(".coledit:hover{cursor:default;}");
    };

    Editor.prototype.addRemoveHover = function () {
        return document
            .createTextNode(".remove:hover{opacity:1;text-decoration:none;color:#fff;cursor:default;}");
    };

    Editor.prototype.newComponentHover = function () {
        return document
            .createTextNode(".newcomponent:hover{opacity:1;text-decoration:none;color:#fff;cursor:default;}");
    };

    Editor.prototype.addFormTitleLabel = function (title) {
        return document.createTextNode(".formtitle::after{content: '" + title
            + "';border:1px solid #DDD;"
            + "border-radius:4px 0;background-color:#F5F5F5;"
            + "left:-1px;padding:3px 7px;"
            + "position:absolute;color:#9DA0A4;top:-1px;}");
    };

    Editor.prototype.addRowTitleLabel = function (title) {
        return document.createTextNode(".rowtitle::after{content:'" + title
            + "';border:1px solid #DDD;"
            + "border-radius:4px 0;background-color:#F5F5F5;"
            + "left:-1px;padding:3px 7px;"
            + "position:absolute;color:#9DA0A4;top:-1px;}");
    };

    Editor.prototype.addColTitleLabel = function (title) {
        return document.createTextNode(".coltitle::after{content:'" + title
            + "';border:1px solid #DDD;"
            + "border-radius:4px 0;background-color:#F5F5F5;"
            + "left:-1px;padding:3px 7px;"
            + "position:absolute;color:#9DA0A4;top:-1px;}");
    };

    Editor.prototype.addComponentOutline = function (title) {
        return document.createTextNode(".comp_outline{position:relative;"
            + "border:#ddd dashed 1px;background-color:#fff;"
            + "box-sizing:border-box;visibility:visible!important;"
            + "border-radius:4px;margin:0px;padding:10px;}");
    };

    Editor.prototype.addOptionStyle = function () {
        return document
            .createTextNode(".checkradioedit{border:1px solid #ddd;"
                + "background-color:#F5F5F5;padding-left:40px;padding-top:10px;padding-bottom:5px;"
                + "padding-right:45px;border-radius:4px;}");
    };

    Editor.prototype.addComHover = function () {
        return document.createTextNode(".checkradioedit:hover{cursor:move;}");
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