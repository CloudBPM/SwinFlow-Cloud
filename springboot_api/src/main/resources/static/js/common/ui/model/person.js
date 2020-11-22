function Person() {
	this.userId = null;
	this.fname = null;
//	this.gender = 0;// 0:male;1:female;
	this.companyName = null;
	this.position = null;
	this.department = null;
	this.clickTime = new Date().getTime();
};

Person.prototype.parseFromJSON = function(json) {
	this.userId = json.userId;
	this.fname = json.fname;
//	this.gender = json.gender;
	this.companyName = json.companyName;
	this.position = json.position;
	this.department = json.department;
	this.clickTime = json.clickTime;
}
