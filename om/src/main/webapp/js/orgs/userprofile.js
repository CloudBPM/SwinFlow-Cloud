/**
 * 
 */

function User() {
	this.id = null;
	this.name = null;
	this.surname = null; // last name, family name, 姓
	this.givenname = null;// fist name, 名  
	this.usedName = null; // 曾用名
	this.fullName = "";
	this.gender = "M";
	this.birthday = null;
	this.age = 0; // 年龄，默认0岁
	this.weight = 0; // 体重，以千克为单位。
	this.height = 0; // 身高，以厘米为单位
	this.idType = "0";
	this.idNumber = null;
	this.address = null;
	this.country = "中国";
	this.province = null;
	this.city = "";
	this.county = "";
	this.postcode = null;
	this.email = null;
	this.mobile = null;
	this.registrationDate = null;
	this.loginCounting = 0;
	this.lastupdate = null;
	this.isBanned = 0;
	this.banningDescription = null;
	this.passwd = null;
	this.passwdExpirationDate = null;
	this.dirty = false;
	this.ownerName = null;// 所在公司名？
	this.nation = "1"; // 民族
	this.householdAddress = null; // 户籍地址
	this.householdPostcode = null; // 户籍邮编
	this.bloodType = "O"; // 血型, O, A, AB, B
	
};

User.prototype = new WorkflowEntity();

User.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.passwd = json.passwd;
	if (json.passwdExpirationDate != null)
		this.passwdExpirationDate = Utils
				.getDateTime(json.passwdExpirationDate);
	else
		this.passwdExpirationDate = null;
	this.givenname = json.givenname;
	this.surname = json.surname;
	this.usedName = json.usedName; // 曾用名
	this.fullName = json.fullName;
	this.age = json.age;// 年龄，默认0岁
	this.weight = json.weight; // 体重，以千克为单位。
	this.height = json.height; // 身高，以厘米为单位
	this.gender = json.gender;
	this.birthday = Utils.getDate(json.birthday);
	this.idType = json.idType;
	this.idNumber = json.idNumber;
	this.address = json.address;
	this.country = json.country;
	this.province = json.province;
	this.city = json.city;
	this.county = json.county;
	this.postcode = json.postcode;
	this.registrationDate = Utils.getDateTime(json.registrationDate);
	this.email = json.email;
	this.mobile = json.mobile;
	this.lastupdate = Utils.getDateTime(json.lastupdate);
	this.isBanned = json.isBanned;
	this.banningDescription = json.banningDescription;
	this.loginCounting = json.loginCounting;
	this.ownerName = json.ownerName;// 所在公司名？
	this.nation = json.nation; // 民族
	this.householdAddress = json.householdAddress; // 户籍地址
	this.householdPostcode = json.householdPostcode; // 户籍邮编
	this.bloodType = json.bloodType; // 血型, O, A, AB, B
};