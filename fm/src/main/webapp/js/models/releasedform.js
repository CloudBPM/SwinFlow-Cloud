/**
 *
 */
function ReleasedForm() {
    this.id = null;
    this.code = null;
    this.name = null;
    this.status = 0;
    this.description = null;
    this.keywords = null;
    this.authorId = null;
    this.author = null;
    this.createDatetime = null;
    this.lastupdate = null;
    this.purchasePrice = 0.00;
    this.usagePrice = 0.00;
    this.parent = null;
    this.owner = null;
    this.classtypename = "Form";
    this.children = []; // children.

    this.version = null;
    this.releaserId = null;
    this.releaser = null;
    this.releaseStatement = null;
    this.releaseDate = null;
    // 0: no trial; 1: 1 month trial; 2: 3 months;
    // 3: 6 months; 4: 9 months; 5: 12 months;
    this.trialPeriod = 0;
    this.totalDownloading = 0;
    this.totalUseCounting = 0;
    this.successCounting = 0;
    this.likeCounting = 0;
    // 1:deprecated(not use any more);0:still use
    this.deprecated = 1;
    // 3: data-collecting UI application service
    // 4: data-presentation UI application service
    // 5: data-listing UI application service
    // 6: data-statistics UI application service
    this.serviceType = 3;
    this.evn = 0; // environment: 0: design time; 1; runtime
};

ReleasedForm.prototype = new UIComponent();

// this clone is for preview function
ReleasedForm.prototype.clone = function () {
    var f = new ReleasedForm();
    f.id = this.id;
    f.code = this.code;
    f.name = this.name;
    f.status = this.status;
    f.description = this.description;
    f.keywords = this.keywords;
    f.authorId = this.authorId;
    f.author = this.author;
    f.purchasePrice = this.purchasePrice;
    f.usagePrice = this.usagePrice;
    f.lastupdate = this.lastupdate;
    f.parent = this.parent;
    f.serviceType = this.serviceType;
    f.toDomForHTML();
    for (var i = 0; i < this.children.length; i++) {
        var c = this.children[i].clone();
        f.children.push(c);
        f.dom.appendChild(c.dom);
    }
    this.cloneRules(f, this);
    return f;
};

ReleasedForm.prototype.cloneRules = function (owner, old) {
    for (var i = 0; i < owner.children.length; i++) {
        if (!owner.children[i] instanceof Header
            && !owner.children[i] instanceof Paragraph
            && !owner.children[i] instanceof StaticList
            && !owner.children[i] instanceof Anchor
            && !owner.children[i] instanceof Image
            && !(owner.children[i] instanceof FileDisplayer)
            && !(owner.children[i] instanceof FilesDisplayer)
            && !(owner.children[i] instanceof BarChart)
            && !(owner.children[i] instanceof PieChart)
            && !(owner.children[i] instanceof CurveChart)
            && !(owner.children[i] instanceof EarthMap)) {
            owner.children[i].cloneRules(owner, old);
        }
    }
};

ReleasedForm.prototype.addChild = function (child) {
    child.parent = this.id;
    this.children.push(child);
    //this.dom.appendChild(child.dom);
};

ReleasedForm.prototype.insertChild = function (child, siblingId) {
    child.parent = this.id;
    var f = 0;
    var t = null;
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].id == siblingId) {
            f = i;
            t = this.children[i];
            break;
        }
    }
    this.children.splice(f, 0, child);
    this.dom.insertBefore(child.dom, t.dom);
};

ReleasedForm.prototype.removeChild = function (child) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].id == child.id) {
            this.children.splice(i, 1);
            this.dom.removeChild(child.dom);
            break;
        }
    }
};

ReleasedForm.prototype.removeAllChildren = function () {
    for (var i = 0; i < this.children.length; i++) {
        this.dom.removeChild(this.children[i].dom);
    }
    this.children = [];
};

// 递归，先根遍历
ReleasedForm.prototype.seekObjectByID = function (id) {
    var target = null;
    if (this.id == id) {
        target = this;
    } else if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i] instanceof Row) {
                target = this.children[i].seekObjectByID(id);
            } else if (this.children[i] instanceof CheckBoxes
                || this.children[i] instanceof Radios) {
                if (this.children[i].id == id) {
                    target = this.children[i];
                } else {
                    target = this.children[i].seekObjectByID(id);
                }
            } else if (this.children[i].id == id) {
                target = this.children[i];
            }
            if (target != null) {
                break;
            }
        }
    }
    return target;
};

// 递归，get the component list
ReleasedForm.prototype.seekObjects = function () {
    var list = [];
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            list.push(this.children[i]);
            if (this.children[i] instanceof Row) {
                list = list.concat(this.children[i].seekObjects());
            }
        }
    }
    return list;
};

ReleasedForm.prototype.parseProps = function (json) {
    this.id = json.id;
    this.code = json.code;
    this.name = json.name;
    this.status = json.status;
    this.description = json.description;
    this.keywords = json.keywords;
    this.authorId = json.authorId;
    this.author = json.author;
    this.createDatetime = json.createDatetime;
    this.lastupdate = json.lastupdate;
    this.purchasePrice = json.purchasePrice;
    this.usagePrice = json.usagePrice;
    this.parent = json.parent;
    this.owner = json.owner;
    this.formContent = null;
    this.serviceType = json.serviceType;
    this.version = json.version;
    this.releaserId = json.releaserId;
    this.releaser = json.releaser;
    this.releaseStatement = json.releaseStatement;
    this.releaseDate = json.releaseDate;
    this.deprecated = json.deprecated;
    this.likeCounting = json.likeCounting;
    this.totalUseCounting = json.totalUseCounting;
    this.successCounting = json.successCounting;
    this.trialPeriod = json.trialPeriod;
    this.totalDownloading = json.totalDownloading;
};

// this method is used to parse the form content from form repository
ReleasedForm.prototype.parseFromJSON = function (json) {
    this.parseProps(json);
    this.evn = 0;
    if (json.formContent != null) {
        var o = JSON.parse(json.formContent);
        this.parseChildrenFromJSON(o.children, this.evn);
    }
    // parse all propagation rules.
    this.parseRules(this);
};

// this method is used to parse the form content in StartPoint/EndPoint/ManualTask
ReleasedForm.prototype.parseFormFromJSON = function(json) {
    this.parseProps(json);
    this.evn = 0
    if (json.children != null && json.children.length > 0) {
        this.parseChildrenFromJSON(json.children, 0);
    }
    // parse all propagation rules.
    this.parseRules(this);
};

ReleasedForm.prototype.parseJSONforRuntime = function (o) {
    var json = JSON.parse(o);
    this.parseProps(json);
    this.evn = 1; // environment: 0: design time; 1; runtime
    if (json.children != null && json.children.length > 0) {
        this.parseChildrenFromJSON(json.children, this.evn);
    }
    // parse all propagation rules.
    this.parseRules(this);
};

ReleasedForm.prototype.parseChildrenFromJSON = function (content, evn) {
    if (content != undefined && content != null && content.length > 0) {
        for (var i = 0; i < content.length; i++) {
            if (content[i].classtypename == "Row") {
                var r = new Row();
                r.parseFromJSON(content[i], evn);
                this.addChild(r);
            } else {
                if (content[i].classtypename == "SingleLineText") {
                    var r = new SingleLineText();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "SingleSelect") {
                    var r = new SingleSelect();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "MultipleLineText") {
                    var r = new MultipleLineText();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "CheckBoxes") {
                    var r = new CheckBoxes();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "Radios") {
                    var r = new Radios();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "Button") {
                    var r = new Button();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "LargeButton") {
                    var r = new LargeButton();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "ListSelect") {
                    var r = new ListSelect();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "Image") {
                    var r = new Image();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "FileUpload") {
                    var r = new FileUpload();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "Anchor") {
                    var r = new Anchor();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "Header") {
                    var r = new Header();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "Paragraph") {
                    var r = new Paragraph();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "StaticList") {
                    var r = new StaticList();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "PageableTableView") {
                    var r = new PageableTableView();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "TableView") {
                    var r = new TableView();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "IntegerInput") {
                    var r = new IntegerInput();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "NaturalNumberInput") {
                    var r = new NaturalNumberInput();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "CurrencyInput") {
                    var r = new CurrencyInput();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "DecimalsInput") {
                    var r = new DecimalsInput();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "DateTimeInput") {
                    var r = new DateTimeInput();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "DateTimeRangeInput") {
                    var r = new DateTimeRangeInput();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "FileDisplayer") {
                    var r = new FileDisplayer();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "FilesDisplayer") {
                    var r = new FilesDisplayer();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "BarChart") {
                    var r = new BarChart();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "CurveChart") {
                    var r = new CurveChart();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "PieChart") {
                    var r = new PieChart();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                } else if (content[i].classtypename == "EarthMap") {
                    var r = new EarthMap();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                }
            }
        }
    }
};

ReleasedForm.prototype.parseRules = function (owner) {
    // parsing some rules for form object
    // to do ...
    // parsing some children rules
    this.parseChildrenRules(owner);
};

ReleasedForm.prototype.parseChildrenRules = function (owner) {
    if (this.children != undefined && this.children != null
        && this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].classtypename == "SingleLineText"
                || this.children[i].classtypename == "SingleSelect"
                || this.children[i].classtypename == "MultipleLineText"
                || this.children[i].classtypename == "CheckBox"
                || this.children[i].classtypename == "Radio"
                || this.children[i].classtypename == "Button"
                || this.children[i].classtypename == "IntegerInput"
                || this.children[i].classtypename == "NaturalNumberInput"
                || this.children[i].classtypename == "CurrencyInput"
                || this.children[i].classtypename == "DecimalsInput"
                || this.children[i].classtypename == "DateTimeInput"
                || this.children[i].classtypename == "DateTimeRangeInput") {
                this.children[i].parseExpressions(owner);
            } else if (this.children[i].classtypename == "Row") {
                this.children[i].parseRules(owner);
            }
        }
    }
};

ReleasedForm.prototype.stringifyforJSON = function () {
    var f = new ReleasedForm();
    f.id = this.id;
    f.code = this.code;
    f.name = this.name;
    f.status = this.status;
    f.description = this.description;
    f.keywords = this.keywords;
    f.authorId = this.authorId;
    f.author = this.author;
    f.purchasePrice = this.purchasePrice;
    f.usagePrice = this.usagePrice;
    f.lastupdate = this.lastupdate;
    f.parent = this.parent;
    f.owner = this.owner;
    f.serviceType = this.serviceType;
    f.version = this.version;
    f.releaserId = this.releaserId;
    f.releaser = this.releaser;
    f.releaseStatement = this.releaseStatement;
    f.releaseDate = this.releaseDate;
    f.deprecated = this.deprecated;
    f.trialPeriod = this.trialPeriod;
    f.evn = this.evn;

    f.formContent = JSON.stringify(this, Utils.replacer);
    return f;
};

ReleasedForm.prototype.toDomForHTML = function (parent) {
    this.dom = document.createElement("div");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.style.height = "100%";
    // form children to DOM
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].toDomForHTML(this.dom);
        }
    }
    return this.dom;
};

ReleasedForm.prototype.toDom = function (parent) {
    this.dom = document.createElement("form");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "formedit formtitle";
    this.dom.addEventListener("click", this, false);
    this.dom.addEventListener('dragenter', this, false);
    this.dom.addEventListener('dragover', this, false);
    this.dom.addEventListener('dragleave', this, false);
    this.dom.addEventListener('drop', this, false);
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].toDom(this.dom);
        }
    }
    return this.dom;
};

ReleasedForm.prototype.updateDom = function () {
    if (this.dom == undefined || this.dom == null) {
        this.toDom();
    }
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].updateDom();
        }
    }
};

ReleasedForm.prototype.handleEvent = function (e) {
    switch (e.type) {
        case "dragenter": // Events fired on the drop target
            this.doDragEnter(e);
            break;
        case "dragover": // Events fired on the drop target
            this.doDragOver(e);
            break;
        case "dragleave": // Events fired on the drop target
            this.doDragLeave(e);
            break;
        case "drop":// Events fired on the drop target
            this.doDrop(e);
            break;
        case "click":
            this.doClick(e);
            break;
    }
    Utils.stopBubble(e);
};

// reference: https://www.html5rocks.com/zh/tutorials/dnd/basics/
ReleasedForm.prototype.doDragEnter = function (evt) {
    Utils.stopDefault(evt);
    bgcache = evt.target.style.backgroundColor;
    Utils.stopBubble(evt);
};

ReleasedForm.prototype.doDragOver = function (evt) {
    Utils.stopDefault(evt);
    evt.target.style.backgroundColor = Utils.highLight();
    evt.dataTransfer.dropEffect = evt.dataTransfer.effectAllowed;
    Utils.stopBubble(evt);
    return false;
};

ReleasedForm.prototype.doDragLeave = function (evt) {
    Utils.stopDefault(evt);
    evt.target.style.backgroundColor = bgcache;
    bgcache = null;
    Utils.stopBubble(evt);
};

ReleasedForm.prototype.doDrop = function (e) {
    Utils.stopDefault(e);
    e.target.style.backgroundColor = bgcache;
    bgcache = null;
    if (copyclip != null) {
        if (this.dom.children.length == 0) {
            if (e.dataTransfer.effectAllowed == "copy") {// create
                map[this.id].stack.execute(new FMAppendLayoutNodeCmd(this,
                    copyclip));
            }
        } else {
            var x = e.clientX
                - (this.dom.getBoundingClientRect().left + this.dom.scrollLeft);
            var y = e.clientY
                - (this.dom.getBoundingClientRect().top + this.dom.scrollTop);
            var t = null;
            var before = false;
            for (var i = 0; i < this.dom.children.length; i++) {
                if (y < this.dom.children[i].getBoundingClientRect().top) {
                    before = true;
                    t = this.dom.children[i];
                    break;
                }
                if (y > this.dom.children[i].getBoundingClientRect().bottom) {
                    before = false;
                    break;
                }
            }
            if (before) { // insert before
                if (e.dataTransfer.effectAllowed == "copy") {// create
                    map[this.id].stack.execute(new FMInsertBeforeLayoutNodeCmd(
                        this, copyclip, t.id));
                } else if (e.dataTransfer.effectAllowed == "move") {
                    map[this.id].stack.execute(new FMMoveBeforeLayoutNodeCmd(
                        this, copyclip, t.id, this));
                } else if (e.dataTransfer.effectAllowed == "copyMove") {// copy+move

                }
            } else { // insert after
                if (t != null && t.nextSibling != null) {
                    if (e.dataTransfer.effectAllowed == "copy") {// create
                        map[this.id].stack
                            .execute(new FMInsertBeforeLayoutNodeCmd(this,
                                copyclip, t.nextSibling.id, this));
                    } else if (e.dataTransfer.effectAllowed == "move") {// move
                        map[this.id].stack
                            .execute(new FMMoveBeforeLayoutNodeCmd(this,
                                copyclip, t.nextSibling.id, this));
                    } else if (e.dataTransfer.effectAllowed == "copyMove") {// copy+move

                    }
                } else {
                    if (e.dataTransfer.effectAllowed == "copy") {// create
                        map[this.id].stack.execute(new FMAppendLayoutNodeCmd(
                            this, copyclip));
                    } else if (e.dataTransfer.effectAllowed == "move") {
                        map[this.id].stack.execute(new FMMoveLayoutNodeCmd(
                            this, copyclip, this));// moved row Id
                    } else if (e.dataTransfer.effectAllowed == "copyMove") {// copy+move

                    }
                }
            }
        }
        copyclip = null;
    }
    Utils.stopBubble(e);
};

ReleasedForm.prototype.doClick = function (evt) {
    copyclip = map[this.id].currObject;
    map[this.id].selected = this;
    map[this.id].setPropertySheet();
    Utils.stopBubble(evt);
};

ReleasedForm.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.name,
        icon: "glyphicon glyphicon-file",
        data: "表单|",
        children: this.toTreeChildren(),
    }
};

ReleasedForm.prototype.toTreeChildren = function () {
    var children = [];
    for (var i = 0; i < this.children.length; i++) {
        children.push(this.children[i].toTree());
    }
    return children;
};

ReleasedForm.prototype.fetchBoundComponents = function () {
    var coms = [];
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].classtypename == "SingleLineText"
            || this.children[i].classtypename == "SingleSelect"
            || this.children[i].classtypename == "MultipleLineText"
            || this.children[i].classtypename == "StaticList"
            || this.children[i].classtypename == "Radios"
            || this.children[i].classtypename == "Paragraph"
            || this.children[i].classtypename == "ListSelect"
            || this.children[i].classtypename == "Image"
            || this.children[i].classtypename == "Header"
            || this.children[i].classtypename == "FileUpload"
            || this.children[i].classtypename == "Anchor"
            || this.children[i].classtypename == "IntegerInput"
            || this.children[i].classtypename == "NaturalNumberInput"
            || this.children[i].classtypename == "CurrencyInput"
            || this.children[i].classtypename == "DecimalsInput"
            || this.children[i].classtypename == "DateTimeInput"
            || this.children[i].classtypename == "DateTimeRangeInput") {
            if (this.children[i].varId != null) {
                coms.push(this.children[i]);
            }
        } else if (this.children[i].classtypename == "Row"
            || this.children[i] instanceof UIContainer) {
            coms = coms.concat(this.children[i].fetchBoundComponents());
        }
    }
    return coms;
};