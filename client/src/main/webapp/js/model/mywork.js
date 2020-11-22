function MyWorkList() {
    this.uid = null;
    this.worklist = [];
};

MyWorkList.prototype.findItem = function (id) {
    for (var i = 0; i < this.worklist.length; i++) {
        if (this.worklist[i].tid == id) {
            return this.worklist[i];
        }
    }
    return null;
};

MyWorkList.prototype.clearExpiredItems = function () {
    for (var i = 0; i < this.worklist.length; i++) {
        if (this.worklist[i].expired == 1) {
            this.worklist.splice(i, 1);
            break;
        }
    }
};

MyWorkList.prototype.parseFromJSON = function (json) {
    this.uid = json.uid;
    for (var i = 0; i < json.worklist.length; i++) {
         var itm = new MyWorkItem();
         itm.parseFromJSON(json.worklist[i]);
        this.worklist.push(itm);
    }
};

function MyWorkItem() {
    this.tid = null; // string
    this.arrivalTime = -1; // long
    this.priority = 0;// 0: general; 1:important; 2: urgent
    this.read = 0;// 0: unread; 1:read
    this.expired = 1;// 0: not expired; 1: expired
};

MyWorkItem.prototype.parseFromJSON = function (json) {
    this.tid = json.tid; // string
    this.arrivalTime = json.arrivalTime; // long
    this.priority = json.priority;// 0: general; 1:important; 2: urgent
    this.read = json.read;// 0: unread; 1:read
};