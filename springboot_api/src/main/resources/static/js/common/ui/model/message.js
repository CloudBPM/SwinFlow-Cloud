/**
 * 
 */

function Message() {
	this.id = null;
	this.uid = null;
	this.uname = null;
	this.img = null;
	this.senttime = Date.now();
	this.receivedtime = 0;
	this.content = null;
};

Message.prototype.parsefromJSON = function(json) {
	this.id = json.id;
	this.uid = json.uid;
	this.uname = json.uname;
	this.img = json.img;
	this.senttime = json.senttime;
	this.receivedtime = json.receivedtime;
	this.content = json.content;
}
