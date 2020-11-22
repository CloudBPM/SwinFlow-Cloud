/**
 * 
 */
function FileObject() {
	this.id = null;
	this.name = null;
	this.size = null;
	this.lastUpdate = null;
	this.mimeType = null;
	this.url = null;
	this.host = null;
	this.path = null;
	this.sufix = null;
	this.binaryContent = null;
};

FileObject.prototype.parse = function(json) {
    this.id = json.id;
	this.name = json.name;
	this.size = json.size;
	this.lastUpdate = json.lastUpdate;
	this.mimeType = json.mimeType;
	this.url = json.url;
	this.host = json.host;
	this.path = json.path;
	this.sufix = json.sufix;
	this.binaryContent = json.binaryContent;
};