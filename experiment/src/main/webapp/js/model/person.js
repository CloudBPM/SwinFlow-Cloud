/**
 * 
 */
function TrainingPerson() {
	this.id = null;
	this.firstName = null;
	this.lastName = null;
	this.gender = 0; // 0:male;1:female;
	this.birthday = "";
	this.address = null;
	this.postcode = null;
	this.degree = 0;
	this.mobile = null;
	this.introduction = null;
	this.lastupdate = "";
	this.classtypename = "TrainingPerson";
};

TrainingPerson.prototype = new WorkflowEntity();

TrainingPerson.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.firstName = json.firstName;
	this.lastName = json.lastName;
	this.gender = json.gender; // 
	this.birthday = json.birthday; //
	this.address = json.address;
	this.postcode = json.postcode;
	this.degree = json.degree;
	this.mobile = json.mobile;
	this.introduction = json.introduction;
	this.lastupdate = json.lastupdate;
};

TrainingPerson.prototype.stringifyforJSON = function() {
	var p = new TrainingPerson();
	p.id = this.id;
	p.firstName = this.firstName;
	p.lastName = this.lastName;
	p.gender = this.gender; // 
	p.birthday = this.birthday; // 
	p.address = this.address;
	p.postcode = this.postcode;
	p.degree = this.degree;
	p.mobile = this.mobile;
	p.introduction = this.introduction;
	p.lastupdate = this.lastupdate;
	return p;
};