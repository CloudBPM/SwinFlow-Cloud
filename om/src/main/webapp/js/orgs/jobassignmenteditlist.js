/**
 * 
 */
function JobAssignmentEditList() {
	// newly added staff ID array on the position or the project role
	this.addedStaffIds = [];
	// removed staff ID array on the position or the project role
	this.removedStaffIds = [];

	// the position ID or project role ID
	this.positionId = null;
	// 0: position; 1: project role
	this.source = 0;
	// organization ID
	this.ownerId = null;

	// current staff array list on the position and the project role
	this.leftList = [];
	// current staff array list NOT on the position and the project role
	this.rightList = [];

	// the description for changed assignments
	this.description = null;

};

JobAssignmentEditList.prototype.parseFromJSON = function(json, ownerid) {
	this.positionId = json.positionId;
	if (json.leftList.length > 0) {
		this.leftList = [];
		for (var i = 0; i < json.leftList.length; i++) {
			var member = new JobAssignment();
			member.parseFromJSON(json.leftList[i], ownerid);
			this.leftList.push(member);
		}
	}
	if (json.rightList.length > 0) {
		this.rightList = [];
		for (var i = 0; i < json.rightList.length; i++) {
			var member = new JobAssignment();
			member.parseFromJSON(json.rightList[i], ownerid);
			this.rightList.push(member);
		}
	}
	this.ownerId = ownerid;
};

JobAssignmentEditList.prototype.findMember = function(id) {
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

JobAssignmentEditList.prototype.searchLeftList = function(condition) {
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

JobAssignmentEditList.prototype.searchRightList = function(condition) {
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

JobAssignmentEditList.prototype.clearChangedStaffIds = function() {
	var t1 = [];
	for (var i = 0; i < this.addedStaffIds.length; i++) {
		if (!this.existLeftStaffIds(this.addedStaffIds[i])
				&& !this.existRemovedStaffIds(this.addedStaffIds[i])) {
			t1.push(this.addedStaffIds[i]);
		}
	}
	// console.log(t1);
	this.addedStaffIds = t1;
	var t2 = [];
	for (var i = 0; i < this.removedStaffIds.length; i++) {
		if (this.existLeftStaffIds(this.removedStaffIds[i])) {
			t2.push(this.removedStaffIds[i]);
		}
	}
	// console.log(t2);
	this.removedStaffIds = t2;
};

JobAssignmentEditList.prototype.existLeftStaffIds = function(id) {
	for (var j = 0; j < this.leftList.length; j++) {
		if (this.leftList[j].staffId == id) {
			return true;
		}
	}
	return false;
};

JobAssignmentEditList.prototype.existRemovedStaffIds = function(id) {
	for (var j = 0; j < this.removedStaffIds.length; j++) {
		if (this.removedStaffIds[j] == id) {
			return true;
		}
	}
	return false;
};
