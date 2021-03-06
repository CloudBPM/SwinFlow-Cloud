/**
 * 
 */
function KnowledgePage() {
	this.id = null;
	this.dangerName = null;
	this.dangerUrl = null;
	this.dangerAlias = null;
	this.description = null;
	this.dangerEname = null;
	this.dangerType = null;
	this.dangerFormula = null;
	this.code = null;
	this.remarks = null;
	this.disposalMethod = null;
	this.industryName = null;
	this.industryContent = null;
	this.industryOwner = null;
	this.industryUser = null;
	this.industryType = null;
	this.industryStatus = null;
	this.recordingTime = "";
	this.lastupdate = "";
	this.version = null;
	this.releaser = null;
	this.releaseStatement = null;
	this.releaseDate =  "";
	this.deprecated = 0;
	this.likeCounting = 0;
	this.totalUseCounting = 0;
	this.successCounting = 0;
	this.terminationCounting = 0;
	this.suspensionCounting = 0;
	this.classtypename = "KnowledgePage";
};

KnowledgePage.prototype = new WorkflowEntity();

KnowledgePage.prototype.parseFromJSON = function(json) {
		this.id = json.id;
		this.dangerName = json.dangerName;
		this.dangerUrl = json.dangerUrl;
		this.dangerAlias = json.dangerAlias;
		this.description = json.description;
		this.dangerEname = json.dangerEname;
		this.dangerType = json.dangerType;
		this.dangerFormula = json.dangerFormula;
		this.code = json.code;
		this.remarks = json.remarks;
		this.disposalMethod = json.disposalMethod;
		this.industryName = json.industryName;
		this.industryContent = json.industryContent;
		this.industryOwner = json.industryOwner;
		this.industryUser = json.industryUser;
		this.industryType = json.industryType;
		this.industryStatus = json.industryStatus;
		this.recordingTime = json.recordingTime;
		this.lastupdate = json.lastupdate;
		this.version = json.version;
		this.releaser = json.releaser;
		this.releaseStatement = json.releaseStatement;
		this.releaseDate =  json.releaseDate;
		this.deprecated = json.deprecated;
		this.likeCounting =json.likeCounting;
		this.totalUseCounting = json.totalUseCounting;
		this.successCounting = json.successCounting;
		this.terminationCounting = json.terminationCounting;
		this.suspensionCounting = json.suspensionCounting;
};

KnowledgePage.prototype.stringifyforJSON = function() {
	var p = new KnowledgePage();
	p.id = this.id;
	p.dangerName = this.dangerName;
	p.dangerUrl = this.dangerUrl;
	p.dangerAlias = this.dangerAlias;
	p.description = this.description;
	p.dangerEname = this.dangerEname;
	p.dangerType = this.dangerType;
	p.dangerFormula = this.dangerFormula;
	p.code = this.code;
	p.remarks = this.remarks;
	p.disposalMethod = this.disposalMethod;
	p.industryName = this.industryName;
	p.industryContent = this.industryContent;
	p.industryOwner = this.industryOwner;
	p.industryUser = this.industryUser;
	p.industryType = this.industryType;
	p.industryStatus = this.industryStatus;
	p.recordingTime = this.recordingTime;
	p.lastupdate = this.lastupdate;
	p.version = this.version;
	p.releaser = this.releaser;
	p.releaseStatement = this.releaseStatement;
	p.releaseDate =  this.releaseDate;
	p.deprecated = this.deprecated;
	p.likeCounting =this.likeCounting;
	p.totalUseCounting = this.totalUseCounting;
	p.successCounting = this.successCounting;
	p.terminationCounting = this.terminationCounting;
	p.suspensionCounting = this.suspensionCounting;
	return p;
};