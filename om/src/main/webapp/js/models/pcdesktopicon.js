/**
 * @author Dahai Cao designed at 15:52 on 2019-04-15
 */
function PCDesktopIcon(cateId) {
    this.id = null;
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    // basic properties
    this.title = "桌面图标";
    this.tabIndex = "-1";
    this.disabled = 0; // 0:false; 1:true
    this.fillWidth = 0; // 0: actual width; 1: 100% width
    this.hidden = 0; // 0: visible; 1: invisible
    this.cateId = cateId;
    this.classtypename = "PCDesktopIcon";

    // icon: the application is shown as an icon,
    // click the icon to show details
    // viewer: the application is shown as a viewer
    this.type = "icon"; // type: icon/view
    this.textIcon = "";
    this.tip = "点击这里";
    this.height = 100;
    // 0: Xuan Qi applications (from Xuan Qi app search engine)
    // 1: external URL
    this.bindType = "0";
    this.applicationId = "";
    this.applicationName = "";
    this.applicationType = "0";
    this.externalUrl = "";

    this.evn = 0;
};

PCDesktopIcon.prototype = new UIComponent();

// for previewing
PCDesktopIcon.prototype.clone = function () {
    var t = new PCDesktopIcon(this.cateId);
    // t.id = this.id;
    // t.parent = this.parent; // parent Id
    // t.currOwner = this.currOwner; // form Id
    //
    // t.title = this.title;
    // t.type = this.type;
    // t.bindType = this.bindType;
    // t.applicationId = this.applicationId;
    // t.applicationName = this.applicationName;
    // t.applicationType = this.applicationType;
    // t.externalUrl = this.externalUrl;
    // t.textIcon = this.textIcon;
    // t.height = this.height;
    // t.tip = this.tip;
    //
    // t.tabIndex = this.tabIndex;
    // t.disabled = this.disabled; // 0:false; 1:true
    // t.fillWidth = this.fillWidth;
    // t.hidden = this.hidden;
    // t.evn = this.evn;
    // t.toDomForHTML();
    return t;
};

// for previewing
PCDesktopIcon.prototype.toDomForHTML = function (parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group";
    this.dom.tabIndex = "-1";
    this.updateDom();
    return this.dom;
};

PCDesktopIcon.prototype.toDom = function (parent) {
    this.toDomforFormGroup(parent);
    this.updateDom();
};

PCDesktopIcon.prototype.updateDom = function () {
    while (this.dom.hasChildNodes()) { // clear dom
        if (this.dom.lastChild.id != "rm" + this.id) {
            this.dom.removeChild(this.dom.lastChild);
        } else if (this.dom.children.length == 1) {
            break;
        }
    }
    if (this.type == "icon") {
        var buttonPane = document.createElement("DIV");
        buttonPane.className = "panel panel-default";
        var bodyDiv = document.createElement("DIV");
        buttonPane.appendChild(bodyDiv);
        bodyDiv.className = "panel-body";
        bodyDiv.addEventListener("click", this, false);
        bodyDiv.style.height = this.height + "px";
        var icon = "";
        if (this.bindType == "0") {// Xuan Qi application
            if (this.textIcon == "") {
                icon = "fa fa-home fa-2x";
            } else {
                icon = "fa " + this.textIcon + " fa-2x";
            }
            this.createAppIcon(bodyDiv, icon, this.title,
                this.tip, this.applicationId, this.applicationType);
        } else if (this.bindType == "1") {// External micro service URL
            if (this.textIcon == "") {
                icon = "fa fa-globe fa-2x";
            } else {
                icon = "fa " + this.textIcon + " fa-2x";
            }
            this.createURLIcon(bodyDiv, icon, this.title,
                this.tip, this.applicationId, this.applicationType);
        }
        this.dom.appendChild(buttonPane);
    } else if (this.type == "view") {
        var bodyDiv = document.createElement("DIV");
        this.dom.appendChild(bodyDiv);
        bodyDiv.addEventListener("click", this, false);
        bodyDiv.style.height = this.height + "px";
        bodyDiv.style.padding = "0px";
        bodyDiv.style.margin = "0px";
        if (this.bindType == "0") { // Xuan Qi application
            var pane = null;
            if (this.applicationType == "1") {
                bodyDiv.style.overflowY = "auto";
                if ($(bodyDiv).launchSWfPane != undefined) {
                    var board = $(bodyDiv).desktopUISWfView({
                        id: "desktopUISWfView" + this.id,
                        parent: this,
                        height: parseInt(this.height),
                    });
                    pane = board.data("desktopUISWfView");
                }
            } else if (this.applicationType == "2") {
                bodyDiv.style.overflowY = "auto";
                if ($(bodyDiv).desktopUIMWfView != undefined) {
                    var board = $(bodyDiv).desktopUIMWfView({
                        id: "desktopUIMWfView" + this.id,
                        parent: this,
                        height: parseInt(this.height),
                    });
                    pane = board.data("desktopUIMWfView");
                }
            } else if (this.applicationType == "3" ||
                this.applicationType == "4" ||
                this.applicationType == "5" ||
                this.applicationType == "6") {
                if ($(bodyDiv).desktopUIAppView != undefined) {
                    var board = $(bodyDiv).desktopUIAppView({
                        id: "desktopUIAppView" + this.id,
                        parent: this,
                        height: parseInt(this.height),
                    });
                    pane = board.data("desktopUIAppView");
                }
            }
            if (pane != null) {
                pane.loading(this.applicationId);
            } else {
                bodyDiv.style.border = "solid 1px #eee";
                bodyDiv.style.backgroundColor = "#dedede";
                bodyDiv.style.borderRadius = "4px";
                bodyDiv.style.textAlign = "center";
                bodyDiv.style.verticalAlign = "middle";
                bodyDiv.innerHTML = "请设置应用...";
            }
        } else if (this.bindType == "1") { // External micro service URL
            var iframe = document.createElement("iframe");
            bodyDiv.appendChild(iframe);
            iframe.frameborder = "0";
            iframe.border = "0";
            iframe.scrolling = "yes";
            iframe.height = this.height + "px";
            iframe.width = "100%";
            iframe.src = this.externalUrl;//"http://news.sina.com.cn";
        }

    }

    // if (this.fillWidth == 1)
    // 	button.classList.add("btn-block");
    // if (this.disabled == 1)
    // 	button.disabled = true;
    //bodyDiv.appendChild(document.createTextNode(this.title));
    //button.tabIndex = this.tabIndex;
    if (this.hidden == 0)
        this.dom.style.display = "";
    else
        this.dom.style.display = "none";

};

PCDesktopIcon.prototype.createURLIcon = function (parent, icon, title, tip, url) {
    var appBodyPane = document.createElement("DIV");
    parent.appendChild(appBodyPane);

    var bodyRow1 = document.createElement("DIV");
    appBodyPane.appendChild(bodyRow1);
    bodyRow1.className = "row";

    var bodyCol1 = document.createElement("DIV");
    bodyRow1.appendChild(bodyCol1);
    bodyCol1.className = "col-lg-2 col-md-2 col-sm-2 col-xs-2";

    var appIcon = document.createElement("I");
    bodyCol1.appendChild(appIcon);
    appIcon.className = icon;
    appIcon.style.color = "#006699";
    appIcon.style.margin = "15px";

    var bodyCol2 = document.createElement("DIV");
    bodyRow1.appendChild(bodyCol2);
    bodyCol2.className = "col-lg-10 col-md-10 col-sm-10 col-xs-10";

    var appnInfo1 = document.createElement("DIV");
    bodyCol2.appendChild(appnInfo1);

    var that = this;
    var urlAppPane = document.createElement("A");
    bodyCol2.appendChild(urlAppPane);
    urlAppPane.addEventListener('click', function () {
        if (that.evn == 0) {

        } else if (that.evn == 1) {
            if (clientmain != undefined) {
                clientmain.hiddenAll();
                clientmain.addBoard.show(true);
                clientmain.addBoard.openUrl(url);
            }
        }
    });

    var appnName = document.createElement("h4");
    urlAppPane.appendChild(appnName);
    appnName.style.color = "#006699";
    appnName.style.textAlign = "center";
    appnName.innerHTML = title;
    appnName.setAttribute("title", tip);
};

PCDesktopIcon.prototype.createAppIcon = function (parent, icon, title, tip, pid, wtype) {
    var appBodyPane = document.createElement("DIV");
    parent.appendChild(appBodyPane);
    appBodyPane.setAttribute("pid", pid);
    appBodyPane.setAttribute("wftype", wtype);
    appBodyPane.setAttribute("title", tip);
    var that = this;
    appBodyPane.addEventListener('click', function () {
        var serviceType = this.getAttribute("wftype");
        var pid = this.getAttribute("pid");
        if (that.evn == 0) {

        } else if (that.evn == 1) {
            if (clientmain != undefined) {
                clientmain.hiddenAll();
                if (serviceType == 1) {
                    clientmain.launchSWfPane.loading(pid);
                } else if (serviceType == 2) {
                    clientmain.launchMWfPane.loading(pid);
                } else if (serviceType == 3) {
                } else if (serviceType == 4) {
                } else if (serviceType == 5) {
                } else if (serviceType == 6) {
                }
            }
        }
    });

    var bodyRow1 = document.createElement("DIV");
    appBodyPane.appendChild(bodyRow1);
    bodyRow1.className = "row";

    var bodyCol1 = document.createElement("DIV");
    bodyRow1.appendChild(bodyCol1);
    bodyCol1.className = "col-lg-2 col-md-2 col-sm-2 col-xs-2";

    var appIcon = document.createElement("I");
    bodyCol1.appendChild(appIcon);
    appIcon.className = icon;
    appIcon.style.color = "#006699";
    appIcon.style.margin = "15px";

    var bodyCol2 = document.createElement("DIV");
    bodyRow1.appendChild(bodyCol2);
    bodyCol2.className = "col-lg-10 col-md-10 col-sm-10 col-xs-10";

    var appnInfo1 = document.createElement("DIV");
    bodyCol2.appendChild(appnInfo1);

    var appnName = document.createElement("h4");
    appnInfo1.appendChild(appnName);
    appnName.style.color = "#006699";
    appnName.style.textAlign = "center";
    appnName.innerHTML = title;
};

PCDesktopIcon.prototype.toDomforFormGroup = function (parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group icon_outline";
    this.dom.tabIndex = "-1";
    this.dom.draggable = "true";
    // this.dom.style.minHeight = "100%";
    // this.dom.style.height = "100%";
    // dragged component
    this.dom.addEventListener("dragstart", this, false);
    this.dom.addEventListener("drag", this, false);
    this.dom.addEventListener("dragend", this, false);
    this.dom.addEventListener("click", this, false);
    this.dom.addEventListener("focus", this, false);
    this.dom.addEventListener("blur", this, false);

    var remove = document.createElement("A");
    remove.id = "rm" + this.id;
    remove.className = "remove";
    this.dom.appendChild(remove);
    var removeSpan = document.createElement("i");
    remove.appendChild(removeSpan);
    removeSpan.className = "glyphicon glyphicon-remove";
    removeSpan.addEventListener("click", this, false);
};

PCDesktopIcon.prototype.handleEvent = function (e) {
    switch (e.type) {
        case "dragstart":// Events fired on the draggable target(source element)
            this.doDragStart(e);
            break;
        case "drag":// Events fired on the draggable target (the source element)
            this.doDrag(e);
            break;
        case "dragend":// Events fired on the draggable target(source element)
            this.doDragEnd(e);
            break;
        case "click":
            this.doClick(e);
            break;
        case "focus":
            this.doFocus(e);
            break;
        case "blur":
            this.doBlur(e);
            break;
    }
};

PCDesktopIcon.prototype.doClick = function (evt) {
    if (this.evn == 0) {
        if (evt.target.className == "glyphicon glyphicon-remove") {
            if (map[this.cateId].pcDesktopEditor != null &&
                map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
                map[this.cateId].stack.execute(new FMDesktopUIRemoveRowCmd(
                    evt.target.parentNode.parentNode.id,
                    map[this.cateId].pcDesktopEditor.currObject));
            }
        } else {
            evt.target.focus();
            map[this.cateId].pcDesktopEditor.selected = this;
            //map[this.cateId].enableEditButtons();
            map[this.cateId].setPropertySheet();
        }
    } else if (this.evn == 1) {

    }
    Utils.stopBubble(evt);
};

PCDesktopIcon.prototype.doFocus = function (evt) {
    bgcache = evt.target.style.backgroundColor;
    evt.target.style.backgroundColor = Utils.highLight();
    Utils.stopBubble(evt);
};

PCDesktopIcon.prototype.doBlur = function (evt) {
    evt.target.style.backgroundColor = bgcache;
    bgcache = null;
    Utils.stopBubble(evt);
};

PCDesktopIcon.prototype.doDragStart = function (evt) {
    if (this.evn == 0) {
        if (map[this.cateId].pcDesktopEditor != null &&
            map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
            // this / e.target is the source node.
            evt.target.style.opacity = '0.7';
            evt.dataTransfer.effectAllowed = 'move';
            copyclip = evt.target.id; // critical
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

PCDesktopIcon.prototype.doDrag = function (evt) {
    Utils.stopBubble(evt);
};

PCDesktopIcon.prototype.doDragEnd = function (evt) {
    if (this.evn == 0) {
        if (map[this.cateId].pcDesktopEditor != null &&
            map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
            evt.target.style.opacity = '1';
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

PCDesktopIcon.prototype.parseFromJSON = function (json, evn) {
    this.id = json.id;
    this.parent = json.parent; // parent Id
    this.currOwner = json.currOwner; // form Id
    this.title = json.title;
    this.type = json.type;
    this.tabIndex = json.tabIndex;
    this.cateId = json.cateId;
    this.fillWidth = json.fillWidth;
    this.disabled = json.disabled; // 0:false; 1:true
    this.hidden = json.hidden;
    this.cateId = json.cateId;
    this.tip = json.tip;
    this.bindType = json.bindType;
    this.applicationId = json.applicationId;
    this.applicationName = json.applicationName;
    this.applicationType = json.applicationType;
    this.externalUrl = json.externalUrl;
    this.textIcon = json.textIcon;
    this.height = json.height;
    this.evn = evn;
    //this.toDom();
};

PCDesktopIcon.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "glyphicon glyphicon-unchecked",
        data: "桌面图标|",
    }
};
