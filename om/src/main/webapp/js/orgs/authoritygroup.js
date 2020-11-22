/**
 * 
 */
function AuthorityGroup() {
	this.id = null;
	this.name = null;
	this.description = null;
	this.createDate = null;
	this.type = 0;
	this.addedAuthIds = [];
	this.removedAuthIds = [];
	this.authoritiesIds = [];
	this.owner = null;
};

AuthorityGroup.prototype = new WorkflowEntity();

AuthorityGroup.prototype.parseFromJSON = function(json, ownerid) {
	this.id = json.id;
	this.name = json.name;
	this.description = json.description;
	this.createDate = Utils.getDateTime(json.createDate);
	this.type = json.type;
	this.authoritiesIds = json.authoritiesIds;
	this.owner = ownerid;
};

AuthorityGroup.prototype.putAddedAuthId = function(id) {
	var f = false;
	for (var j = 0; j < this.addedAuthIds.length; j++) {
		if (this.addedAuthIds[j] == id) {
			f = true;
			break;
		}
	}
	if (!f) {
		this.addedAuthIds.push(id);
	}
};

AuthorityGroup.prototype.putRemovedAuthId = function(id) {
	var f = false;
	for (var j = 0; j < this.removedAuthIds.length; j++) {
		if (this.removedAuthIds[j] == id) {
			f = true;
			break;
		}
	}
	if (!f) {
		this.removedAuthIds.push(id);
	}
};

AuthorityGroup.prototype.clearChangedAuthIds = function() {
	var t1 = [];
	for (var i = 0; i < this.addedAuthIds.length; i++) {
		if (!this.existAuthId(this.addedAuthIds[i])
				&& !this.existRemovedIds(this.addedAuthIds[i])) {
			t1.push(this.addedAuthIds[i]);
		}
	}
	this.addedAuthIds = t1;
	var t2 = [];
	for (var i = 0; i < this.removedAuthIds.length; i++) {
		if (this.existAuthId(this.removedAuthIds[i])) {
			t2.push(this.removedAuthIds[i]);
		}
	}
	this.removedAuthIds = t2;
};

AuthorityGroup.prototype.existAuthId = function(id) {
	for (var j = 0; j < this.authoritiesIds.length; j++) {
		if (this.authoritiesIds[j] == id) {
			return true;
		}
	}
	return false;
};

AuthorityGroup.prototype.existRemovedIds = function(id) {
	for (var j = 0; j < this.removedAuthIds.length; j++) {
		if (this.removedAuthIds[j] == id) {
			return true;
		}
	}
	return false;
};

