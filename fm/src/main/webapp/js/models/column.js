/**
 *
 */
function Column() {
    this.id = null;
    this.title = "列";
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    this.children = []; // children.
    this.className = "";
    this.classtypename = "Column";
    this.evn = 0; // environment: 0: design time; 1; runtime
};

Column.prototype = new UIComponent();

// for previewing
Column.prototype.clone = function () {
    var c = new Column();
    // c.id = this.id;
    // c.title = this.title;
    // c.parent = this.parent; // parent Id
    // c.currOwner = this.currOwner; // form Id
    // c.evn = this.evn; // environment: 0: design time; 1; runtime
    // c.toDomForHTML();
    // c.dom.className = this.dom.className;
    // c.dom.classList.remove("coledit", "coltitle");
    // for (var i = 0; i < this.children.length; i++) {
    //     var cln = this.children[i].clone();
    //     c.children.push(cln);
    //     c.dom.appendChild(cln.dom);
    // }
    return c;
};

Column.prototype.cloneRules = function (owner, old) {
    for (var i = 0; i < this.children.length; i++) {
        if (!(owner.children[i] instanceof Header)
            && !(owner.children[i] instanceof Paragraph)
            && !(owner.children[i] instanceof StaticList)
            && !(owner.children[i] instanceof Anchor)
            && !(owner.children[i] instanceof Image)
            && !(owner.children[i] instanceof FileDisplayer)
            && !(owner.children[i] instanceof FilesDisplayer)
            && !(owner.children[i] instanceof BarChart)
            && !(owner.children[i] instanceof PieChart)
            && !(owner.children[i] instanceof CurveChart)
            && !(owner.children[i] instanceof EarthMap)) {
            this.children[i].cloneRules(owner, old);
        }
    }
};

Column.prototype.addChild = function (child) {
    child.parent = this.id;
    child.currOwner = this.currOwner;
    this.children.push(child);
    //this.dom.appendChild(child.dom);
};

Column.prototype.insertChild = function (child, siblingId) {
    child.parent = this.id;
    child.currOwner = this.currOwner; // form Id
    var f = 0;
    var t = null;
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].id == siblingId) {
            f = i;
            t = this.children[i];
            break;
        }
    }
    if (t != null) {
        this.children.splice(f, 0, child);
        this.dom.insertBefore(child.dom, t.dom);
    }
};

Column.prototype.removeChild = function (child) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].id == child.id) {
            this.children.splice(i, 1);
            this.dom.removeChild(child.dom);
            break;
        }
    }
};

// 递归，先根遍历
Column.prototype.seekObjectByID = function (id) {
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
Column.prototype.seekObjects = function () {
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

Column.prototype.parseFromJSON = function (json, evn) {
    this.id = json.id;
    this.parent = json.parent; // parent Id
    this.title = json.title;
    this.currOwner = json.currOwner; // form Id
    this.className = json.className;
    this.parseChildrenFromJSON(json.children, evn);
};

Column.prototype.parseChildrenFromJSON = function (content, evn) {
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
                } else if (content[i].classtypename == "FileUpload") {
                    var r = new FileUpload();
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

Column.prototype.parseRules = function (owner) {
    // parsing some rules for column object
    // to do ...
    // parsing some children rules
    this.parseChildrenRules(owner);
};

Column.prototype.parseChildrenRules = function (owner) {
    if (this.children != undefined && this.children != null
        && this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].classtypename == "SingleLineText"
                || this.children[i].classtypename == "SingleSelect"
                || this.children[i].classtypename == "MultipleLineText"
                || this.children[i].classtypename == "CheckBox"
                || this.children[i].classtypename == "Radio"
                || this.children[i].classtypename == "Button"
                || this.children[i].classtypename == "LargeButton"
                || this.children[i].classtypename == "ListSelect"
                || this.children[i].classtypename == "Image"
                || this.children[i].classtypename == "FileUpload"
                || this.children[i].classtypename == "Anchor"
                || this.children[i].classtypename == "IntegerInput"
                || this.children[i].classtypename == "NaturalNumberInput"
                || this.children[i].classtypename == "CurrencyInput"
                || this.children[i].classtypename == "DecimalsInput"
                || this.children[i].classtypename == "DateTimeInput"
                || this.children[i].classtypename == "DateTimeRangeInput") {
                this.children[i].parseExpressions(owner);
            }
        }
    }
};

Column.prototype.toDomForHTML = function (parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    //this.dom.style.height  = "100%";

    var classlist = this.className.split(" ");
    for (var i = 0; i < classlist.length; i++) {
        this.dom.classList.add(classlist[i]);
    }

    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].toDomForHTML(this.dom);
        }
    }
    return this.dom;
};

Column.prototype.toDom = function (parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "coledit coltitle ";
    this.dom.addEventListener('dragenter', this, false);
    this.dom.addEventListener('dragover', this, false);
    this.dom.addEventListener('dragleave', this, false);
    this.dom.addEventListener('drop', this, false);

    var classlist = this.className.split(" ");
    for (var i = 0; i < classlist.length; i++) {
        this.dom.classList.add(classlist[i]);
    }

    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].toDom(this.dom);
        }
    }

    return this.dom;
};

Column.prototype.handleEvent = function (e) {
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
    }
};

Column.prototype.doDragEnter = function (evt) {
    if (map[this.currOwner] != null
        && map[this.currOwner].currObject instanceof Form) {
        Utils.stopDefault(evt);
        bgcache = evt.target.style.backgroundColor;
        Utils.stopBubble(evt);
    }
};

Column.prototype.doDragOver = function (evt) {
    if (map[this.currOwner] != null
        && map[this.currOwner].currObject instanceof Form) {
        Utils.stopDefault(evt);
        evt.target.style.backgroundColor = Utils.highLight();
        evt.dataTransfer.dropEffect = evt.dataTransfer.effectAllowed;
        Utils.stopBubble(evt);
        return false;
    }
};

Column.prototype.doDragLeave = function (evt) {
    if (map[this.currOwner] != null
        && map[this.currOwner].currObject instanceof Form) {
        Utils.stopDefault(evt);
        evt.target.style.backgroundColor = bgcache;
        bgcache = null;
        Utils.stopBubble(evt);
    }
};

Column.prototype.doDrop = function (e) {
    if (map[this.currOwner] != null
        && map[this.currOwner].currObject instanceof Form) {
        Utils.stopDefault(e);
        e.target.style.backgroundColor = bgcache;
        bgcache = null;
        if (copyclip != null) {
            if (this.dom.children.length == 0) {
                if (e.dataTransfer.effectAllowed == "copy") { // create
                    this.newComponent(copyclip);
                } else if (e.dataTransfer.effectAllowed == "move") { // move
                    map[this.currOwner].stack.execute(new FMMoveLayoutNodeCmd(
                        this, copyclip, map[this.currOwner].currObject));
                } else if (e.dataTransfer.effectAllowed == "copyMove") {// copy+move

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
                    if (e.dataTransfer.effectAllowed == "copy") { // create
                        this.newInsertComponent(copyclip, t.nextSibling.id);
                    } else if (e.dataTransfer.effectAllowed == "move") { // move
                        map[this.currOwner].stack
                            .execute(new FMMoveBeforeLayoutNodeCmd(this, copyclip, t.id,
                                map[this.currOwner].currObject));
                    } else if (e.dataTransfer.effectAllowed == "copyMove") {// copy+move

                    }
                } else { // insert after
                    if (t != null && t.nextSibling != null) {
                        if (e.dataTransfer.effectAllowed == "copy") { // create
                            this.newInsertComponent(copyclip, t.nextSibling.id);
                        } else if (e.dataTransfer.effectAllowed == "move") {// move
                            map[this.currOwner].stack
                                .execute(new FMMoveBeforeLayoutNodeCmd(
                                    this, copyclip, t.nextSibling.id,
                                    map[this.currOwner].currObject));
                        } else if (e.dataTransfer.effectAllowed == "copyMove") {// copy+move

                        }
                    } else {
                        if (e.dataTransfer.effectAllowed == "copy") { // create
                            this.newComponent(copyclip);
                        } else if (e.dataTransfer.effectAllowed == "move") {// move
                            map[this.currOwner].stack
                                .execute(new FMMoveLayoutNodeCmd(this, copyclip,
                                    map[this.currOwner].currObject));
                        } else if (e.dataTransfer.effectAllowed == "copyMove") {// copy+move

                        }
                    }
                }
            }
            copyclip = null;
        }
        Utils.stopBubble(e);
    }
};

Column.prototype.newComponent = function (copyclip) {
    var that = this;
    if (copyclip instanceof CheckBoxes || copyclip instanceof Radios) {
        $.getJSON(service.api(27), {num: "4"}).complete(function (data) {
            var ids = JSON.parse(data.responseText);
            copyclip.id = ids[0];
            copyclip.children[0].id = ids[1];
            copyclip.children[1].id = ids[2];
            copyclip.children[2].id = ids[3];
            map[that.currOwner].stack.execute(new FMAppendNodeCmd(that, copyclip));
        });
    } else if (copyclip instanceof Row) {
        if (copyclip.children.length == 1) {
            $.getJSON(service.api(27), {num: "2"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                map[that.currOwner].stack.execute(new FMAppendNodeCmd(that, copyclip));
            });
        } else if (copyclip.children.length == 2) {
            $.getJSON(service.api(27), {num: "3"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                map[that.currOwner].stack.execute(new FMAppendNodeCmd(that, copyclip));
            });
        } else if (copyclip.children.length == 3) {
            $.getJSON(service.api(27), {num: "4"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                copyclip.children[2].id = ids[3];
                map[that.currOwner].stack.execute(new FMAppendNodeCmd(that, copyclip));
            });
        } else if (copyclip.children.length == 4) {
            $.getJSON(service.api(27), {num: "5"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                copyclip.children[2].id = ids[3];
                copyclip.children[3].id = ids[4];
                map[that.currOwner].stack.execute(new FMAppendNodeCmd(that, copyclip));
            });
        } else if (copyclip.children.length == 6) {
            $.getJSON(service.api(27), {num: "6"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                copyclip.children[2].id = ids[3];
                copyclip.children[3].id = ids[4];
                copyclip.children[4].id = ids[5];
                copyclip.children[5].id = ids[6];
                map[that.currOwner].stack.execute(new FMAppendNodeCmd(that, copyclip));
            });
        }
    } else {
        $.getJSON(service.api(2)).complete(
            function (data) {
                copyclip.id = data.responseText;
                map[that.currOwner].stack.execute(new FMAppendNodeCmd(that, copyclip));
            });
    }
};

Column.prototype.newInsertComponent = function (copyclip, id) {
    var that = this;
    if (copyclip instanceof CheckBoxes || copyclip instanceof Radios) {
        $.getJSON(service.api(27), {num: "4"}).complete(function (data) {
            var ids = JSON.parse(data.responseText);
            copyclip.id = ids[0];
            copyclip.children[0].id = ids[1];
            copyclip.children[1].id = ids[2];
            copyclip.children[2].id = ids[3];
            map[that.currOwner].stack
                .execute(new FMInsertBeforeLayoutNodeCmd(that, copyclip, id));
        });
    } else if (copyclip instanceof Row) {
        if (copyclip.children.length == 1) {
            $.getJSON(service.api(27), {num: "2"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                map[that.currOwner].stack
                    .execute(new FMInsertBeforeLayoutNodeCmd(that, copyclip, id));
            });
        } else if (copyclip.children.length == 2) {
            $.getJSON(service.api(27), {num: "3"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                map[that.currOwner].stack
                    .execute(new FMInsertBeforeLayoutNodeCmd(that, copyclip, id));
            });
        } else if (copyclip.children.length == 3) {
            $.getJSON(service.api(27), {num: "4"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                copyclip.children[2].id = ids[3];
                map[that.currOwner].stack
                    .execute(new FMInsertBeforeLayoutNodeCmd(that, copyclip, id));
            });
        } else if (copyclip.children.length == 4) {
            $.getJSON(service.api(27), {num: "5"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                copyclip.children[2].id = ids[3];
                copyclip.children[3].id = ids[4];
                map[that.currOwner].stack
                    .execute(new FMInsertBeforeLayoutNodeCmd(that, copyclip, id));
            });
        } else if (copyclip.children.length == 6) {
            $.getJSON(service.api(27), {num: "6"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                copyclip.children[2].id = ids[3];
                copyclip.children[3].id = ids[4];
                copyclip.children[4].id = ids[5];
                copyclip.children[5].id = ids[6];
                map[that.currOwner].stack
                    .execute(new FMInsertBeforeLayoutNodeCmd(that, copyclip, id));
            });
        }
    } else {
        $.getJSON(service.api(2)).complete(
            function (data) {
                copyclip.id = data.responseText;
                map[that.currOwner].stack
                    .execute(new FMInsertBeforeLayoutNodeCmd(that, copyclip, id));
            });
    }
};

Column.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "fa fa-columns",
        data: "列|",
        children: this.toTreeChildren(),
    }
};

Column.prototype.toTreeChildren = function () {
    var children = [];
    for (var i = 0; i < this.children.length; i++) {
        children.push(this.children[i].toTree());
    }
    return children;
};

Column.prototype.fetchBoundComponents = function () {
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