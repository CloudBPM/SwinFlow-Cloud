/**
 *
 */
function FilesDisplayer() {
    this.id = null;
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    // basic properties
    this.title = "多文件阅读播放器";
    this.alt = "多文件阅读播放器";
    this.tabIndex = "-1";
    this.src = "img/sample.pdf";
    this.shapeType = 0; // 0:rounded;1:circle;2:thumbnail
    this.href = null;
    this.width = "100%";
    this.height = "600";
    this.hidden = 0; // 0: visible; 1: invisible
    this.classtypename = "FilesDisplayer";
    this.currtabindex = 0;
    this.varId = null;
    this.ac = null;
    this.evn = 0;
};

FilesDisplayer.prototype = new UIComponent();

// for previewing
FilesDisplayer.prototype.clone = function () {
    var t = new FilesDisplayer();
    t.id = this.id;
    t.parent = this.parent; // parent Id
    t.currOwner = this.currOwner; // form Id
    t.title = this.title;
    t.alt = this.alt;
    t.tabIndex = this.tabIndex;
    t.src = this.src;
    t.shapeType = this.shapeType;
    t.href = this.href;
    t.width = this.width;
    t.height = this.height;
    t.hidden = this.hidden;
    t.varId = this.varId;
    t.ac = this.ac;
    t.evn = this.evn;
    t.currtabindex = this.currtabindex;
    t.toDomForHTML();
    return t;
};

// for previewing
FilesDisplayer.prototype.toDomForHTML = function(parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group";
    this.dom.tabIndex = "-1";
    this.updateDom();
    return this.dom;
};

FilesDisplayer.prototype.toDom = function (parent) {
    this.toDomforFormGroup(parent);
    this.updateDom();
};

FilesDisplayer.prototype.updateDom = function () {
    while (this.dom.hasChildNodes()) { // clear dom
        if (this.dom.lastChild.id != "rm" + this.id) {
            this.dom.removeChild(this.dom.lastChild);
        } else if (this.dom.children.length == 1) {
            break;
        }
    }
    var filereaderDiv = document.createElement("DIV");
    this.dom.appendChild(filereaderDiv);

    var tabDIV = document.createElement("DIV");
    filereaderDiv.appendChild(tabDIV);
    tabDIV.style.margin = "1px";

    var tabUL = document.createElement("UL");
    tabUL.className = "nav nav-tabs filreadertabs-nav-tabs";
    tabUL.id = "filreadertabs-nav-tabs" + this.id;
    tabUL.setAttribute("role", "tablist");
    tabDIV.appendChild(tabUL);

    var tabContents = document.createElement("DIV");
    tabDIV.appendChild(tabContents);
    tabContents.className = "tab-content";
    tabContents.id = "filreadertabs";

    for (var i = 0; i < 3; i++) {
        var selected = false;
        if (i == 0) {
            selected = true;
        }
        this.newTabHead(tabUL, i, "文件" + i, selected);
        var tabContent1 = this.newTabContent(tabContents, i, selected);
        var filereader = document.createElement("A");
        tabContent1.appendChild(filereader);
        filereader.id = "filesreader" + this.id;
        filereader.name = "fsrdtab" + (i + 1);
        filereader.className = "media";
        filereader.tabIndex = this.tabIndex;
        filereader.title = this.title;
        filereader.href = this.src;
        $(filereader).media({
            width: this.width,
            height: this.height
        });
        var that = this;
        $("#filreadertabs-nav-tabs" + this.id).on("click", "a", function(e) {
            console.log("hhhh");
           // e.preventDefault();
            $(this).tab('show');
            that.currtabindex = parseInt($(this).attr('href').substring(8));
        });
    }

    if (this.hidden == 0)
        this.dom.style.display = "";
    else
        this.dom.style.display = "none";
};

FilesDisplayer.prototype.newTabHead = function (parent, index, caption, active) {
    var tabLi = document.createElement("li");
    parent.appendChild(tabLi);
    if (active)
        tabLi.className = "active";
    tabLi.setAttribute("role", "presentation");
    var tabLink = document.createElement("a");
    tabLi.appendChild(tabLink);
    tabLink.setAttribute("href", "#fsrdtab" + index);
    tabLink.setAttribute("aria-controls", "fsrdtab" + index);
    tabLink.setAttribute("role", "tab");
    tabLink.setAttribute("data-toggle", "tab");
    tabLink.innerHTML = caption;
};

FilesDisplayer.prototype.newTabContent = function (parent, index, active) {
    var tabContent = document.createElement("DIV");
    parent.appendChild(tabContent);
    tabContent.setAttribute("data", "fsrdtab" + index);
    tabContent.setAttribute("role", "tabpanel");
    if (active)
        tabContent.className = "tab-pane active";
    else
        tabContent.className = "tab-pane";
    tabContent.id = "fsrdtab" + index;
    return tabContent;
};

FilesDisplayer.prototype.toDomforFormGroup = function (parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group comp_outline";
    this.dom.tabIndex = "-1";
    this.dom.draggable = "true";
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

FilesDisplayer.prototype.handleEvent = function (e) {
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

FilesDisplayer.prototype.doClick = function (evt) {
    if (evt.target.id == "btn" + this.id) {
        Utils.stopDefault();
    } else if (evt.target.className == "glyphicon glyphicon-remove") {
        if (this.evn == 0) {
            if (map[this.currOwner] != null
                && map[this.currOwner].currObject instanceof Form) {
                map[this.currOwner].stack.execute(new FMRemoveRowCmd(
                    evt.target.parentNode.parentNode.id,
                    map[this.currOwner].currObject));
            }
        }
    } else if (evt.target.tagName == "A" &&
        evt.target.getAttribute("role") == "tab") {
        // this handle is to display the tab for file constants
        var f = evt.target.getAttribute("aria-controls");
        $('#filreadertabs-nav-tabs' + this.id + ' a[href="#'+f+'"]').tab('show');
        Utils.stopDefaultEvent(evt);
    } else {
        if (this.evn == 0) {
            evt.target.focus();
            map[this.currOwner].selected = this;
            map[this.currOwner].enableEditButtons();
            map[this.currOwner].setPropertySheet();
        }
    }
    Utils.stopBubble(evt);
};

FilesDisplayer.prototype.doFocus = function (evt) {
    bgcache = evt.target.style.backgroundColor;
    evt.target.style.backgroundColor = Utils.highLight();
    Utils.stopBubble(evt);
};

FilesDisplayer.prototype.doBlur = function (evt) {
    evt.target.style.backgroundColor = bgcache;
    bgcache = null;
    Utils.stopBubble(evt);
};

FilesDisplayer.prototype.doDragStart = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            // this / e.target is the source node.
            evt.target.style.opacity = '0.7';
            evt.dataTransfer.effectAllowed = 'move';
            copyclip = evt.target.id; // critical
        }
    } else if (this.evn == 1) {

    }
    Utils.stopBubble(evt);
};

FilesDisplayer.prototype.doDrag = function (evt) {
    Utils.stopBubble(evt);
};

FilesDisplayer.prototype.doDragEnd = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '1';
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

FilesDisplayer.prototype.parseFromJSON = function (json, evn) {
    this.id = json.id;
    this.parent = json.parent; // parent Id
    this.currOwner = json.currOwner; // form Id
    this.title = json.title;
    this.alt = json.alt;
    this.tabIndex = json.tabIndex;
    this.src = json.src;
    this.shapeType = json.shapeType;
    this.href = json.href;
    this.width = json.width;
    this.height = json.height;
    this.hidden = json.hidden;
    this.varId = json.varId;
    this.ac = json.ac;
    this.evn = evn;
    this.currtabindex = json.currtabindex;
};

FilesDisplayer.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "glyphicon glyphicon-picture",
        data: "多文件阅读器|" + this.src,
    }
};
