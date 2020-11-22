/**
 * 
 */

function Organization() {
	this.id = null;
	this.serialNumber = null; // internal code
	this.name = null;
	this.abbrLocal = null; // Chinese short name
	this.nameInternational = null; // English short name
	this.abbrInternational = null; // English short name
	this.businessCategory = 'C';
	this.businessType = 'C13';
	this.staffNumber = 1;
	this.address = null; // street name, street no
	this.city = null; // city name
	this.province = null; // province/state code
	this.county = null;
	this.postCode = null; // 
	this.country = null; // country id
	this.phoneNumber = null;
	this.faxNumber = null;
	this.website = null;
	this.email = null;
	this.microblog = null; // microblog number
	this.webchat = null; // wechat number
	this.customerService = null; // customer service number
	this.businessScope = null; // company business scope
	this.introduction = null; // company introduction
	this.isHeadOffice = "N"; // if "Y", can create new sub-company
	this.motherName = null; // mother company id (group)

	this.registrationCode = null; // the code from official authorization
	this.registrationDate = "2016-07-14"; // registration date
	this.representative = null; // legal representative
	this.categoryId = null;

	// this.officeCalendar;
	this.status = 0; // 0: not operating, 1: operating; 2: write off
	this.lastupdate = null;

	this.bankAccountNumber = "0000 0000 0000 0000 00";
	this.bankAccountName = "姓名";
	this.bankAddress = "地址";
	this.bsb = null;

	this.apiAccessKey = "abNsBomenJdh";
	this.apiSecretKey = "73hysJKUdh7k9sfjf&*(($$";

	this.motherId = null; // mother company id (group)
	this.children = []; // 
	this.classtypename = "Organization";

};

Organization.prototype = new AbstractDepartment();

Organization.prototype.toString = function() {
	return this.name;
};

Organization.prototype.addChild = function(child) {
	this.children.push(child);
};

Organization.prototype.removeChild = function(obj) {
	if (obj == null)
		return;
	if (this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			if (obj.id == this.children[i].id) {
				this.children.splice(i, 1);
				break;
			}
		}
	}
};

Organization.prototype.generateNewNumber = function() {
	return this.countChildren(this);
};

Organization.prototype.countChildren = function(root) {
	var count = 1;
	if (root.children.length > 0) {
		for (var i = 0; i < root.children.length; i++) {
			count = count + this.countChildren(root.children[i]);
		}
	}
	return count;
};

Organization.prototype.drawToContext = function() {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].drawToContext();
	}
};

Organization.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.serialNumber = json.serialNumber; // internal code
	this.name = json.name;
	this.abbrLocal = json.abbrLocal; // Chinese short name
	this.nameInternational = json.nameInternational; // English short name
	this.abbrInternational = json.abbrInternational; // English short name
	this.businessCategory = json.businessCategory;
	this.businessType = json.businessType;
	this.staffNumber = json.staffNumber;
	this.address = json.address; // street name, street no
	this.city = json.city; // city name
	this.province = json.province; // province/state code
	this.county = json.county;
	this.postCode = json.postCode; // 
	this.country = json.country; // country id
	this.phoneNumber = json.phoneNumber;
	this.faxNumber = json.faxNumber;
	this.website = json.website;
	this.email = json.email;
	this.microblog = json.microblog; // microblog number
	this.webchat = json.webchat; // wechat number
	this.customerService = json.customerService; // customer service number
	this.businessScope = json.businessScope; // company business scope
	this.introduction = json.introduction; // company introduction
	this.isHeadOffice = json.isHeadOffice; // if "Y", can create new sub-company
	this.motherName = json.motherName; // mother company id (group)

	this.registrationCode = json.registrationCode; // the code from official authorization
	this.registrationDate = json.registrationDate; // registration date
	this.representative = json.representative; // legal representative

	this.categoryId = json.categoryId;

	// this.officeCalendar;
	this.status = json.status; // 0: not operating, 1: operating; 2: write off
	this.lastupdate = json.lastupdate;

	this.bankAccountNumber = json.bankAccountNumber;
	this.bankAccountName = json.bankAccountName;
	this.bankAddress = json.bankAddress;
	this.bsb = json.bsb;

	this.apiAccessKey = json.apiAccessKey;
	this.apiSecretKey = json.apiSecretKey;

	this.motherId = ""; // mother company id (group)
	
	if (json.children.length > 0) {
		for (var i = 0; i < json.children.length; i++) {
			this.parseChildrenFromJSON(json.children[i], this, this);
		}
	}
	// top department has no parent and input.
	if (this.children.length>0) {
		this.children[0].parent = null;
		this.children[0].input = null;
	}
	
};

Organization.prototype.parseChildrenFromJSON = function(jsonchild, parent, owner) {
	var d = null;
	if (jsonchild.classtypename == "Department") {
		d = new Department();
	} else if (jsonchild.classtypename == "Division") {
		d = new Division();
	} else if (jsonchild.classtypename == "ProjectTeam") {
		d = new ProjectTeam();
	}
	d.context = parent.context;
	d.owner = owner.id;
	d.parseFromJSON(jsonchild, parent);
	parent.addChild(d);
	if (jsonchild.children.length > 0) {
		for (var i = 0; i < jsonchild.children.length; i++) {
			this.parseChildrenFromJSON(jsonchild.children[i], d, owner);
		}
	}
};

Organization.prototype.stringifyforJSON = function() {
	var org = new Organization();
	org.id = this.id;
	org.serialNumber = this.serialNumber; // internal code
	org.name = this.name;
	org.abbrLocal = this.abbrLocal; // Chinese short name
	org.nameInternational = this.nameInternational; // English short name
	org.abbrInternational = this.abbrInternational; // English short name
	org.businessCategory = this.businessCategory;
	org.businessType = this.businessType;
	org.staffNumber = this.staffNumber;
	org.address = this.address; // street name, street no
	org.city = this.city; // city name
	org.province = this.province; // province/state code
	org.county = this.county;
	org.postCode = this.postCode; // 
	org.country = this.country; // country id
	org.phoneNumber = this.phoneNumber;
	org.faxNumber = this.faxNumber;
	org.website = this.website;
	org.email = this.email;
	org.microblog = this.microblog; // microblog number
	org.webchat = this.webchat; // wechat number
	org.customerService = this.customerService; // customer service number
	org.businessScope = this.businessScope; // company business scope
	org.introduction = this.introduction; // company introduction
	org.isHeadOffice = this.isHeadOffice; // if "Y", can create new sub-company
	org.motherName = this.motherName; // mother company id (group)

	org.registrationCode = this.registrationCode; // the code from official authorization
	org.registrationDate = this.registrationDate; // registration date
	org.representative = this.representative; // legal representative

	org.categoryId = this.categoryId;

	// org.officeCalendar;
	org.status = this.status; // 0: not operating, 1: operating; 2: write off
	org.lastupdate = this.lastupdate;

	org.bankAccountNumber = this.bankAccountNumber;
	org.bankAccountName = this.bankAccountName;
	org.bankAddress = this.bankAddress;
	org.bsb = this.bsb;

	org.apiAccessKey = this.apiAccessKey;
	org.apiSecretKey = this.apiSecretKey;

	org.motherId = this.motherId; // mother company id (group)

	if (this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			org.addChild(this.children[i].stringifyforJSON());
		}
	}
	return org;
};




