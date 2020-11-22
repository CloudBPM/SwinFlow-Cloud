/**
 * 
 */
function GroupMemberEditList() {
	this.addedMemberIds = [];
	this.removedMemberIds = [];

	this.groupId = null;
	this.ownerId = null;

	this.leftList = [];
	this.rightList = [];
};

GroupMemberEditList.prototype.parseFromJSON = function(json, ownerid) {
	this.groupId = json.groupId;
	if (json.leftList.length > 0) {
		this.leftList = [];
		for (var i = 0; i < json.leftList.length; i++) {
			var member = new GroupMember();
			member.parseFromJSON(json.leftList[i], ownerid);
			this.leftList.push(member);
		}
	}
	if (json.rightList.length > 0) {
		this.rightList = [];
		for (var i = 0; i < json.rightList.length; i++) {
			var member = new GroupMember();
			member.parseFromJSON(json.rightList[i], ownerid);
			this.rightList.push(member);
		}
	}
	this.ownerId = ownerid;
};

GroupMemberEditList.prototype.findMember = function(id) {
	var gm = null;
	for (var i = 0; i < this.leftList.length; i++) {
		if (this.leftList[i].staffId == id) {
			gm = this.leftList[i];
		}
	}
	if (gm == null) {
		for (var i = 0; i < this.rightList.length; i++) {
			if (this.rightList[i].staffId == id) {
				gm = this.rightList[i];
			}
		}
	}
	return gm;
};

GroupMemberEditList.prototype.searchLeftList = function(condition) {
	var result = [];
	var list = this.leftList;
	for (var i = 0; i < list.length; i++) {
		if ((list[i].staffCode != null && list[i].staffCode.search(condition) >= 0)
				|| (list[i].staffFullName != null && list[i].staffFullName
						.search(condition) >= 0)) {
			result.push(list[i]);
		}
	}
	return result;
};

GroupMemberEditList.prototype.searchRightList = function(condition) {
	var result = [];
	var list = this.rightList;
	for (var i = 0; i < list.length; i++) {
		if ((list[i].staffCode != null && list[i].staffCode.search(condition) >= 0)
				|| (list[i].staffFullName != null && list[i].staffFullName
						.search(condition) >= 0)) {
			result.push(list[i]);
		}
	}
	return result;
};


GroupMemberEditList.prototype.clearChangedStaffIds = function() {
	var t1 = [];
	for (var i = 0; i < this.addedMemberIds.length; i++) {
		if (!this.existLeftStaffIds(this.addedMemberIds[i])
				&& !this.existRemovedStaffIds(this.addedMemberIds[i])) {
			t1.push(this.addedMemberIds[i]);
		}
	}
	//console.log(t1);
	this.addedMemberIds = t1;
	var t2 = [];
	for (var i = 0; i < this.removedMemberIds.length; i++) {
		if (this.existLeftStaffIds(this.removedMemberIds[i])) {
			t2.push(this.removedMemberIds[i]);
		}
	}
	//console.log(t2);
	this.removedMemberIds = t2;
};

GroupMemberEditList.prototype.existLeftStaffIds = function(id) {
	for (var j = 0; j < this.leftList.length; j++) {
		if (this.leftList[j].staffId == id) {
			return true;
		}
	}
	return false;
};

GroupMemberEditList.prototype.existRemovedStaffIds = function(id) {
	for (var j = 0; j < this.removedMemberIds.length; j++) {
		if (this.removedMemberIds[j] == id) {
			return true;
		}
	}
	return false;
};
