/**
 * 
 */
function WebAppService() {
	this.id = null;
	this.name = null;
	this.keywords = null;
	// 1: internal access; 2: public access.
	this.accessType = 1;
	// 0: general web service; 1: RESTful Web service
	this.restful = 0;
	this.comments = null;
	this.methodName = "GET";
	this.host = null;
	this.url = null;
	this.authenticationType = 0;
	this.authentication = [];
	this.headerSolution = 0;
	this.headers = [];
	// this property is used to store parameters of RESTful web service
	this.pathParams = [];
	this.formParams = [];
	this.returnObject = null;
	// 0: void return; 1: text/html; 2: file;
	this.returnType = 0;
	this.returnTypeDescription = null;
	this.securityAccessKey = null;
	this.price = 0;
	this.createDateTime;
	this.lastupdate;
	this.parent = null;
	this.owner = null;
	this.status = -1;
	this.classtypename = "WebAppService";
};

WebAppService.prototype = new WorkflowEntity();

WebAppService.prototype.parseForPM = function(json, owner) {
	this.id = json.id;
	this.name = json.name;
	if (json.pathParams != null && json.pathParams.length > 0) {
		for (var i = 0; i < json.pathParams.length; i++) {
			var p = new Parameter();
			p.name = json.pathParams[i].name;
			p.datatype = json.pathParams[i].datatype;
			p.comments = json.pathParams[i].comments;
			if (json.pathParams[i].value != null) {
				if (p.datatype == "int") {
					var c = new IntegerConstant();
					c.parseObject(json.pathParams[i].value);
					p.value = c;
				} else if (p.datatype == "double") {
					var c = new DoubleConstant();
					c.parseObject(json.pathParams[i].value);
					p.value = c;
				} else {
					var c = new StringConstant();
					c.parseObject(json.pathParams[i].value);
					p.value = c;
				}
			}
			this.pathParams.push(p);
		}
	}
	if (json.formParams != null && json.formParams.length > 0) {
		for (var i = 0; i < json.formParams.length; i++) {
			var p = new Parameter();
			p.name = json.formParams[i].name;
			p.datatype = json.formParams[i].datatype;
			p.comments = json.formParams[i].comments;
			if (json.formParams[i].value != null) {
				if (p.datatype == "int") {
					var c = new IntegerConstant();
					c.parseObject(json.formParams[i].value);
					p.value = c;
				} else if (p.datatype == "file" || p.datatype == "File") {
					var c = new FileConstant();
					c.parseObject(json.formParams[i].value);
					p.value = c;
				} else if (p.datatype == "double") {
					var c = new DoubleConstant();
					c.parseObject(json.formParams[i].value);
					p.value = c;
				} else {
					var c = new StringConstant();
					c.parseObject(json.formParams[i].value);
					p.value = c;
				}
			}
			this.formParams.push(p);
		}
	}
	this.returnType = json.returnType;
	this.returnTypeDescription = json.returnTypeDescription;
	if (json.returnType != 0) {
		if (json.returnType == 2) {
			this.returnObject = new DataVariable();
			this.returnObject.datatype = "File";
			this.returnObject.value = new FileConstant();
			this.returnObject.description = this.returnTypeDescription;
		} else {
			this.returnObject = new DataVariable();
			this.returnObject.datatype = "String";
			this.returnObject.value = new StringConstant();
			this.returnObject.description = this.returnTypeDescription;
		}
	}
};

WebAppService.prototype.parse = function(json) {
	console.log(json);
	this.id = json.id;
	this.name = json.name;
	this.keywords = json.keywords;
	this.accessType = json.accessType;
	this.restful = json.restful;
	this.comments = json.comments;
	if (json.methodName == undefined || json.methodName == null) 
		this.methodName = "GET";
	else
		this.methodName = json.methodName;
	this.host = json.host;
	this.url = json.url;
	this.returnType = json.returnType;
	this.returnTypeDescription = json.returnTypeDescription;
	if (json.pathParams != null && json.pathParams.length > 0) {
		for (var i = 0; i < json.pathParams.length; i++) {
			var p = new Parameter();
			p.name = json.pathParams[i].name;
			p.datatype = json.pathParams[i].datatype;
			if (json.pathParams[i].value != null)
				p.value = json.pathParams[i].value.value;
			p.comments = json.pathParams[i].comments;
			this.pathParams.push(p);
		}
	}
	this.authenticationType = json.authenticationType;
	this.headerSolution = json.headerSolution;
	if (json.authentication != null && json.authentication.length > 0) {
		for (var i = 0; i < json.authentication.length; i++) {
			var p = new HTTPHeader();
			p.key = json.authentication[i].key;
			p.value = json.authentication[i].value;
			this.authentication.push(p);
		}
	}
	if (json.headers != null && json.headers.length > 0) {
		for (var i = 0; i < json.headers.length; i++) {
			var p = new HTTPHeader();
			p.key = json.headers[i].key;
			p.value = json.headers[i].value;
			this.headers.push(p);
		}
	}
	if (json.formParams != null && json.formParams.length > 0) {
		for (var i = 0; i < json.formParams.length; i++) {
			var p = new Parameter();
			p.name = json.formParams[i].name;
			p.datatype = json.formParams[i].datatype;
			if (json.formParams[i].value != null)
				p.value = json.formParams[i].value.value;
			p.comments = json.formParams[i].comments;
			this.formParams.push(p);
		}
	}
	this.securityAccessKey = json.securityAccessKey;
	this.price = json.price;
	this.createDateTime = Utils.getDateTime(json.createDateTime);
	this.lastupdate = Utils.getDateTime(json.lastupdate);
	this.parent = json.parent;
	this.status = json.status;
	this.owner = json.owner; // organization ID
};

WebAppService.prototype.generateUniqueParaName = function(name, headbody) {
	var newname = name;
	if (headbody == 1) {
		while (true) {
			var f = false;
			for (var i = 0; i < this.pathParams.length; i++) {
				if (this.pathParams[i].name == name) {
					f = true;
					break;
				}
			}
			if (!f) {
				break;
			} else {
				newname = name + name;
			}
		}
	} else if (headbody == 2) {
		while (true) {
			var f1 = false;
			for (var i = 0; i < this.formParams.length; i++) {
				if (this.formParams[i].name == name) {
					f1 = true;
					break;
				}
			}
			if (!f1) {
				break;
			} else {
				newname = name + name;
			}
		}
	}
	return newname;
};

WebAppService.prototype.findParamPosition = function(key, headbody) {
	if (headbody == 1) {
		if (this.pathParams != null && this.pathParams.length > 0) {
			for (var i = 0; i < this.pathParams.length; i++) {
				if (key == this.pathParams[i].name) {
					return i;
				}
			}
		}
	} else if (headbody == 2) {
		if (this.formParams != null && this.formParams.length > 0) {
			for (var i = 0; i < this.formParams.length; i++) {
				if (key == this.formParams[i].name) {
					return i;
				}
			}
		}
	}
	return -1;
};

WebAppService.prototype.findParam = function(key, headbody) {
	if (headbody == 1) {
		if (this.pathParams != null && this.pathParams.length > 0) {
			for (var i = 0; i < this.pathParams.length; i++) {
				if (key == this.pathParams[i].name) {
					return this.pathParams[i];
				}
			}
		}
	} else if (headbody == 2) {
		if (this.formParams != null && this.formParams.length > 0) {
			for (var i = 0; i < this.formParams.length; i++) {
				if (key == this.formParams[i].name) {
					return this.formParams[i];
				}
			}
		}
	}
	return -1;
};

WebAppService.prototype.findHeaderPosition = function(key) {
	if (this.headers != null && this.headers.length > 0) {
		for (var i = 0; i < this.headers.length; i++) {
			if (key == this.headers[i].key) {
				return i;
			}
		}
	}
	return -1;
};

WebAppService.prototype.hasFileFields = function() {
	if (this.methodName == "POST") {
		if (this.formParams != null && this.formParams.length > 0) {
			for (var i = 0; i < this.formParams.length; i++) {
				if ("file" == this.formParams[i].datatype || "File" == this.formParams[i].datatype) {
					return 1;
				}
			}
		}
	}
	return 0;
};

WebAppService.prototype.paramDuplicated = function(key, headbody, loc) {
	if (headbody == 1) {
		if (this.pathParams != null && this.pathParams.length > 0) {
			for (var i = 0; i < this.pathParams.length; i++) {
				if (key == this.pathParams[i].name && i != loc) {
					return true;
				}
			}
		}
	} else if (headbody == 2) {
		if (this.formParams != null && this.formParams.length > 0) {
			for (var i = 0; i < this.formParams.length; i++) {
				if (key == this.formParams[i].name && i != loc) {
					return true;
				}
			}
		}
	}
	return false;
};

WebAppService.prototype.headerDuplicated = function(key, loc) {
	if (this.headers != null && this.headers.length > 0) {
		for (var i = 0; i < this.headers.length; i++) {
			if (key == this.headers[i].key && i != loc) {
				return true;
			}
		}
	}
	return false;
};

WebAppService.prototype.toString = function() {
	var requestStr = "";
	var parastr = "";
	if (this.pathParams != null && this.pathParams.length) {
		if (this.restful == 0) {
			for (var i = 0; i < this.pathParams.length; i++) {
				if (parastr == "")
					parastr = this.pathParams[i].toStringForConsole();
				else
					parastr += "&" + this.pathParams[i].toStringForConsole();
			}
			if (parastr != "")
				parastr = "?" + parastr;
		} else {
			for (var i = 0; i < this.pathParams.length; i++) {
				if (parastr == "")
					parastr = this.pathParams[i].value;
				else
					parastr += "/" + this.pathParams[i].value;
			}
			if (parastr != "")
				parastr = "/" + parastr;

		}
	}
	requestStr = this.methodName + " " + (this.url == null ? "" : this.url)
			+ parastr + " HTTP 1.1" + "\r\n";
	if (this.host != null)
		requestStr += "Host: " + this.host + "\r\n";
	if (this.headers != null && this.headers.length) {
		for (var i = 0; i < this.headers.length; i++) {
			requestStr += this.headers[i].toString() + "\r\n";
		}
	}
	if (this.authorizationType == 1) {// basic auth
		var tok = this.authorization[0].value + ':'
				+ this.authorization[1].value;
		var hash = Base64.encode(tok);
		var hash1 = tok;
		requestStr += "Authorization: Basic " + hash + "(" + hash1 + ")\r\n";
	} else if (this.authorizationType == 2) {// digest auth
		if (this.authorization.length == 9) {
			var username = "username=\"" + this.authorization[0].value + "\", ";
			var password = "realm=\"" + this.authorization[1].value + "\", ";
			var nonce = "nonce=\"" + this.authorization[3].value + "\", ";
			var uri = "uri=\"\"\", ";
			var reponse = "response=\"\"?????\", ";
			var opaque = "opaque=\"\"" + this.authorization[8].value + "\"";
			requestStr += "Authorization: Digest " + username + password
					+ nonce + uri + reponse + opaque + "\r\n";
		}
	}
	requestStr += "\r\n";

	if (this.authorizationType == 3) {// open auth
		if (this.authorization.length == 8) {
			var oatuhstr = "oauth_consumer_key=" + this.authorization[0].value
					+ "&oauth_token=" + this.authorization[2].value
					+ "&oauth_signature_method=" + this.authorization[4].value
					+ "&oauth_timestamp=0000&oauth_nonce="
					+ this.authorization[5].value + "&oauth_version="
					+ this.authorization[6].value + "&oauth_signature=";
			requestStr += oatuhstr + "\r\n";
		}
	}

	var formstr = "";
	if (this.formParams != null && this.formParams.length) {
		for (var i = 0; i < this.formParams.length; i++) {
			if (formstr == "")
				formstr = this.formParams[i].toStringForConsole();
			else
				formstr += "&" + this.formParams[i].toStringForConsole();
		}
	}
	requestStr += formstr + "\r\n";

	return requestStr;
};