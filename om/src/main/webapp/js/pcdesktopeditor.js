;
(function ($, window, document, undefined) {
    var pluginName = "pcDesktopEditor";
    var defaults = {
        id: "",// form ID
        basicpropsheet: "",
        propsheet: "",
        owner: "", // org ID
        width: 0,
        height: 0,
        sid: "",
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
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = options.parent.stack;
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.init(options);
        this.selected = null; // the selected object;
        window.addEventListener('keydown', this, true);
    };

    Editor.prototype.getDirty = function () {
        return this.stack.isDirty();
    };

    Editor.prototype.loading = function (object) {
        this.category = object; // current category
        if (object.pcUIContent != null) {
            this.currObject = object.pcUIContent;
            this.currObject.cateId = this.category.id;
            this.initialize();
        } else {
            this.currObject = new PCDesktopUI();
            this.currObject.name = "桌面";
            this.currObject.cateId = this.category.id;
            this.currObject.createDatetime = new Date().getTime();
            this.currObject.lastupdate = new Date().getTime();
            this.currObject.owner = this.category.owner;
            //this.currObject.toDom();
            object.pcUIContent = this.currObject;
            var that = this;
            $.getJSON(service.api(2)).complete(function(data) {
                that.currObject.id = data.responseText;
                that.initialize();
            });
        }
    };

    Editor.prototype.initialize = function () {
        this.pallet(this.options);
        this.shading(this.options);
        this.currObject.toDom(this.canvasPane);
        this.setPropertySheet();
        //this.canvasPane.appendChild(this.currObject.dom);
        if (this.currObject.children.length > 0) {
            this.options.parent.enableRemoveButton();
        } else {
            this.options.parent.disableRemoveButton();
        }
    };

    Editor.prototype.init = function (options) {
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);
        editorPanel.style.margin = "0px";
        editorPanel.style.padding = "0px";
        editorPanel.style.paddingTop = "2px";
        editorPanel.style.overflow = "auto";
        this.painterRow = document.createElement("DIV");
        editorPanel.appendChild(this.painterRow);
        this.painterRow.className = "row";
        this.painterRow.style.margin = "0px";
        this.painterRow.style.padding = "0px";
    };

    Editor.prototype.createPalletBar = function (id, barname, expanded, clpin, parent, title) {
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
        h4title.className = "panel-title text-center";

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
        palletPanel.id = "pcaccordion" + options.pid;
        palletPanel.className = "col";
        palletPanel.style.width = "72px";
        palletPanel.style.margin = "0px";
        palletPanel.style.padding = "0px";
        palletPanel.style.overflowY = "auto";
        palletPanel.style.height = (options.height) + "px";
        var group = document.createElement("DIV");
        palletPanel.appendChild(group);
        group.id = "pcaccordion";
        group.className = "panel-group";
        group.style.margin = "0px";
        group.style.padding = "0px";
        group.style.width = "72px";
        group.style.minWidth = "72px";
        group.style.maxWidth = "72px";

        group.setAttribute('role', 'tablist');// $("input").attr("value","txt");
        group.setAttribute('aria-multiselectable', 'true');
        var taskbar2 = this.createPalletBar("Two1" + options.pid, "图标", true, "in", group,
            "桌面上的图标组件");
        var taskbar1 = this.createPalletBar("One1" + options.pid, "布局", false, "", group,
            "用户界面上的分布格局");
        taskbar1.appendChild(new OneColumn(options.pid, this.currObject.id).toItem());
        taskbar1.appendChild(new TwoColumns(options.pid, this.currObject.id).toItem());
        taskbar1.appendChild(new ThreeColumns(options.pid, this.currObject.id).toItem());
        taskbar1.appendChild(new BigThreeColumns(options.pid, this.currObject.id).toItem());
        taskbar1.appendChild(new FourColumns(options.pid, this.currObject.id).toItem());
        taskbar1.appendChild(new SixColumns(options.pid, this.currObject.id).toItem());
        taskbar1.appendChild(new EightFourColumns(options.pid, this.currObject.id).toItem());
        taskbar1.appendChild(new FourEightColumns(options.pid, this.currObject.id).toItem());

        taskbar2.appendChild(new Desktopicon(options.pid, this.currObject.id).toItem());
        // taskbar2.appendChild(new ParagraphComponent(options.pid).toItem());
        // taskbar2.appendChild(new StaticListComponent(options.pid).toItem());
        // taskbar2.appendChild(new ImageComponent(options.pid).toItem());
        // taskbar2.appendChild(new AnchorComponent(options.pid).toItem());

        // var taskbar3 = this.createPalletBar("Three1" + options.pid, "动态", true, "in", group,
        //     "基本的动态可交互组件");

    };

    Editor.prototype.shading = function (options) {
        var canvasPanel = document.createElement("DIV");
        this.painterRow.appendChild(canvasPanel);
        canvasPanel.id = "pcdesktopPanel" + options.pid;
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
        this.canvasPane.id = "pcdesktopPane" + options.pid;
        this.canvasPane.style.margin = "0px";
        this.canvasPane.style.padding = "0px";
        this.canvasPane.style.backgroundColor = "#f6f6f6";
        this.canvasPane.style.overflowX = "auto";
        this.canvasPane.style.overflowY = "auto";
        this.canvasPane.style.border = "1px solid #ddd";
        this.canvasPane.style.height = (options.height) + "px";
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
        this.style.appendChild(this.addFormTitleLabel("桌面"));
        this.style.appendChild(this.addRowTitleLabel("行"));
        this.style.appendChild(this.addColTitleLabel("列"));
        this.style.appendChild(this.addComponentOutline());
        this.style.appendChild(this.addComHover());
    };

    Editor.prototype.removeStyle = function (v) {
        this.style.removeChild(v);
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
         // Utils.stopBubble(evt);
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
            this.propsheet.setSheet(obj, this.currObject, null,
                this.propsheet.getCurrTabIndex(obj));
        }
    };

    Editor.prototype.updateDom = function () {
        $(this.canvasPane).empty();
        this.currObject.toDom(this.canvasPane);
    };

    Editor.prototype.clearAll = function (evt) {
        this.stack.execute(new FMDesktopUIRemoveAllRowsCmd(this.currObject));
    };

    Editor.prototype.doKeypress = function (evt) {
        evt = evt || window.event;
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
                + "border-radius:4px;margin:0px;padding:25px;width:1920px;min-height:790px;overflow:auto;}"
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
        return document.createTextNode(".icon_outline{position:relative;"
            + "border:#ddd dashed 1px;background-color:#fff;"
            + "box-sizing:border-box;visibility:visible!important;"
            + "border-radius:4px;margin:0px;padding:20px;}");
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