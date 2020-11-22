/**
 * 
 */
function HTTPHeader() {
	this.key = "";
	this.value = "";
};

HTTPHeader.prototype.toString = function() {
	return this.key + ":" + this.value;
};

HTTPHeader.prototype.clone = function() {
	var h = new HTTPHeader();
	h.key = this.key;
	h.value = this.value;
	return h;
};