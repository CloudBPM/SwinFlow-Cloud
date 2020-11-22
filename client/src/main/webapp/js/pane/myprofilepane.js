/**
 * 
 */
;
var user = new User();

(function($, window, document, undefined) {
	var pluginName = "personalDetailPane";
	var defaults = {
		id : "",
		uid : "",
	};

	var Board = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			uid : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.user = new User();
		this.init(options);
	};

	Board.prototype.init = function(options) {
		this.board = document.createElement("DIV");
		this.element.appendChild(this.board);
		this.show(false);

		var panel = document.createElement("DIV");
		this.board.appendChild(panel);
		panel.className = "container-fluid";

		// row0
		var panelRow0 = document.createElement("DIV");
		panel.appendChild(panelRow0);
		panelRow0.className = "row";

		var panelCol0 = document.createElement("DIV");
		panelRow0.appendChild(panelCol0);
		panelCol0.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

		this.createTitle(panelCol0, "fa fa-user", "个人资料", "#006699");

		// row1
		var panelRow1 = document.createElement("DIV");
		panel.appendChild(panelRow1);
		panelRow1.className = "row";
		panelRow1.style.marginTop = "4px";

		var colpane1 = document.createElement("DIV");
		panel.appendChild(colpane1);
		colpane1.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12";

		var colpane = document.createElement("DIV");
		panel.appendChild(colpane);
		colpane.className = "col-lg-8 col-md-8 col-sm-12 col-xs-12";

		var colpane2 = document.createElement("DIV");
		panel.appendChild(colpane2);
		colpane2.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12";

		this.form = document.createElement("form");
		colpane.appendChild(this.form);
		this.form.className = "form-horizontal";

		this.fieldset = document.createElement("fieldset");
		this.form.appendChild(this.fieldset);

		// 姓名 group0
		var group0 = document.createElement("DIV");
		this.form.appendChild(group0);
		group0.className = "form-group";

		this.createLabel(group0, "", "姓名",
				"col-xs-12 col-sm-12 col-md-3 col-lg-3 control-label",
				"firstname");

		var div0 = document.createElement("DIV");
		group0.appendChild(div0);
		div0.className = "col-xs-12 col-sm-12 col-md-4 col-lg-4";

		this.input0 = document.createElement("INPUT");
		div0.appendChild(this.input0);
		this.input0.id = "lastname";
		this.input0.placeholder = "姓氏";
		this.input0.className = "form-control";
		this.input0.addEventListener("keyup", this, true);
		this.input0.addEventListener("change", this, false);

		var div1 = document.createElement("DIV");
		group0.appendChild(div1);
		div1.className = "col-xs-12 col-sm-12 col-md-5 col-lg-5";

		this.input0a = document.createElement("INPUT");
		div1.appendChild(this.input0a);
		this.input0a.id = "firstname";
		this.input0a.placeholder = "名字";
		this.input0a.className = "form-control";
		this.input0a.addEventListener("keyup", this, false);
		this.input0a.addEventListener("change", this, false);

		// email 1
		this.input1 = this.createKVPair(this.form, "邮箱", "email");
		this.input1.setAttribute("change", false);
		this.span1 = document.createElement("SPAN");
		this.span1.innerHTML = "提示 邮箱";
		this.span1.className = "help-block";
		this.span1.style.display = "none";
		this.input1.parentNode.appendChild(this.span1);

		// 手机号，Mobile2
		var group2 = document.createElement("DIV");
		group2.className = "form-group";
		this.form.appendChild(group2);

		this.createLabel(group2, "", "手机号码",
						"col-xs-12 col-sm-12 col-md-3 col-lg-3 control-label",
						"mobile");

		var div2 = document.createElement("DIV");
		div2.className = "col-xs-12 col-sm-12 col-md-7 col-lg-7";
		group2.appendChild(div2);

		this.input2 = document.createElement("INPUT");
		div2.appendChild(this.input2);
		this.input2.setAttribute("type", "text");
		this.input2.className = "form-control";
		this.input2.id = "mobile";
		this.input2.placeholder = "手机号码";
		this.input2.setAttribute("validity", false);
		this.input2.setAttribute("change", false);
		this.input2.addEventListener("change", this, false);

		this.span2 = document.createElement("SPAN");
		this.span2.innerHTML = "提示 手机号";
		this.span2.className = "help-block";
		this.span2.style.display = "none";
		div2.appendChild(this.span2);

		var div2a = document.createElement("DIV");
		div2a.className = "col-xs-12 col-sm-12 col-md-2 col-lg-2";
		group2.appendChild(div2a);

		this.input2a = document.createElement("BUTTON");
		this.input2a.setAttribute("type", "button");
		this.input2a.className = "btn btn-default btn-primary btn-block";
		this.input2a.id = "sendMessage";
		this.input2a.innerText = "发送";
		this.input2a.addEventListener("click", this, false);
		div2a.appendChild(this.input2a);

		// 验证码
		var group2a = document.createElement("DIV");
		this.form.appendChild(group2a);
		group2a.className = "form-group";

		this.createLabel(group2a, "", "验证码",
						"col-xs-12 col-sm-12 col-md-3 col-lg-3 control-label",
						"mobile");

		var div2b = document.createElement("DIV");
		group2a.appendChild(div2b);
		div2b.className = "col-xs-12 col-sm-12 col-md-9 col-lg-9";

		this.input2b = document.createElement("INPUT");
		div2b.appendChild(this.input2b);
		this.input2b.setAttribute("type", "text");
		this.input2b.className = "form-control";
		this.input2b.id = "code";
		this.input2b.placeholder = "输入验证码";
		this.input2b.addEventListener("keyup", this, false);
		this.input2b.addEventListener("change", this, false);
		this.input2b.addEventListener("blur", this, false);

		this.span2a = document.createElement("SPAN");
		this.span2a.innerHTML = "输入验证码";
		this.span2a.className = "help-block";
		this.span2a.style.display = "none";
		div2b.appendChild(this.span2a);

		// 证件 group3
		var group3 = document.createElement("DIV");
		this.form.appendChild(group3);
		group3.className = "form-group";

		this
				.createLabel(group3, "", "证件类型",
						"col-xs-12 col-sm-12 col-md-3 col-lg-3 control-label",
						"idtype");

		var div3 = document.createElement("DIV");
		group3.appendChild(div3);
		div3.className = "col-xs-12 col-sm-12 col-md-9 col-lg-9";

		this.input3 = document.createElement("select");
		div3.appendChild(this.input3);
		this.input3.id = "idType";
		this.input3.className = "form-control";
		this.input3.addEventListener("keyup", this, false);
		this.input3.addEventListener("change", this, false);

		var option1 = document.createElement("option");
		this.input3.appendChild(option1);
		option1.value = 1;
		option1.innerText = "身份证";

		var option2 = document.createElement("option");
		this.input3.appendChild(option2);
		option2.value = 2;
		option2.innerText = "护照";
		// 证件号码 group4
		this.input4 = this.createKVPair(this.form, "证件号码", "idNumber");
		this.input4.setAttribute("change", false);
		this.span4 = document.createElement("SPAN");
		this.span4.innerHTML = "提示 证件号码";
		this.span4.className = "help-block";
		this.span4.style.display = "none";
		this.input4.parentNode.appendChild(this.span4);
		// 性别 group5
		var group5 = document.createElement("DIV");
		this.form.appendChild(group5);
		group5.className = "form-group";

		this
				.createLabel(group5, "", "性别",
						"col-xs-12 col-sm-12 col-md-3 col-lg-3 control-label",
						"gender");

		var div5 = document.createElement("DIV");
		group5.appendChild(div5);
		div5.className = "col-xs-12 col-sm-12 col-md-9 col-lg-9";

		this.input5 = document.createElement("select");
		div5.appendChild(this.input5);
		this.input5.id = "gender";
		this.input5.className = "form-control";
		this.input5.addEventListener("keyup", this, false);
		this.input5.addEventListener("change", this, false);

		var option3 = document.createElement("option");
		this.input5.appendChild(option3);
		option3.value = "M";
		option3.innerText = "男";

		var option4 = document.createElement("option");
		this.input5.appendChild(option4);
		option4.value = "F";
		option4.innerText = "女";

		// 生日日期 group6
		var group6 = document.createElement("DIV");
		this.form.appendChild(group6);
		group6.className = "form-group";

		this.createLabel(group6, "", "生日",
				"col-xs-12 col-sm-12 col-md-3 col-lg-3 control-label",
				"birthday");

		var div6 = document.createElement("DIV");
		group6.appendChild(div6);
		div6.className = "col-xs-12 col-sm-12 col-md-9 col-lg-9";

		this.input6 = document.createElement("INPUT");
		div6.appendChild(this.input6);
		this.input6.type = "button";
		this.input6.style.textAlign = "left";
		this.input6.className = "form-control";
		this.input6.id = "birthday";

		$(this.input6).datepicker({
			dateFormat: "yy-mm-dd",
			onClose: function () {
				user.birthday = this.value;// read
			},
		});


		// this.div6a = document.createElement("DIV");
		// div6.appendChild(this.div6a);
		// this.div6a.className = "input-group date birthday";
		//
		// this.input6 = document.createElement("INPUT");
		// this.div6a.appendChild(this.input6);
		// this.input6.type = "text";
		// this.input6.className = "form-control";
		// this.input6.readOnly = "true";
		// this.input6.id = "birthday";
		//
		// var span = document.createElement("span");
		// this.div6a.appendChild(span);
		// span.className = "input-group-addon";
		//
		// var i = document.createElement("i");
		// span.appendChild(i);
		// i.className = "glyphicon glyphicon-remove";
		//
		// var span1 = document.createElement("span");
		// this.div6a.appendChild(span1);
		// span1.className = "input-group-addon";
		//
		// var i1 = document.createElement("i");
		// span1.appendChild(i1);
		// i1.className = "glyphicon glyphicon-calendar";
		//
		// that = this;
		// $(".birthday").datetimepicker({
		// 	language : "zh-CN",
		// 	format : "yyyy-mm-dd",
		// 	weekStart : 1,
		// 	todayBtn : 1,
		// 	autoclose : 1,
		// 	todayHighlight : 1,
		// 	startView : 2,
		// 	minView : 2,
		// 	forceParse : 0,
		// 	startDate : "1900-01-01",
		// 	endDate : "2020-01-01",
		// 	pickerPosition : "bottom-left"
		// }).on('changeDate', function(ev) {
		// 	user.birthday = that.input6.value;
		// });


		// address group7
		this.group7 = document.createElement("DIV");
		this.form.appendChild(this.group7);
		this.group7.id = "address";
		this.group7.className = "form-group";

		this.createLabel(this.group7, "", "地址区域",
				"col-xs-12 col-sm-12 col-md-3 col-lg-3 control-label",
				"address");

		var div7 = document.createElement("DIV");
		this.group7.appendChild(div7);
		div7.className = "col-xs-12 col-sm-12 col-md-3 col-lg-3";

		this.input7 = document.createElement("select");
		div7.appendChild(this.input7);
		this.input7.id = "province";
		this.input7.className = "form-control";
		this.input7.addEventListener("keyup", this, false);
		this.input7.addEventListener("change", this, false);

		var div7a = document.createElement("DIV");
		this.group7.appendChild(div7a);
		div7a.className = "col-xs-12 col-sm-12 col-md-3 col-lg-3";

		this.input7a = document.createElement("select");
		div7a.appendChild(this.input7a);
		this.input7a.id = "city";
		this.input7a.className = "form-control";
		this.input7a.addEventListener("keyup", this, false);
		this.input7a.addEventListener("change", this, false);

		var div7b = document.createElement("DIV");
		this.group7.appendChild(div7b);
		div7b.className = "col-xs-12 col-sm-12 col-md-3 col-lg-3";

		this.input7b = document.createElement("select");
		div7b.appendChild(this.input7b);
		this.input7b.id = "county";
		this.input7b.className = "form-control";
		this.input7b.addEventListener("keyup", this, false);
		this.input7b.addEventListener("change", this, false);

		$("#address").distpicker({
			autoSelect : false,
			placeholder : true,
			province : " 省（直辖市） ",
			city : " 市（区）",
			district : " 县（区）",
		});
		
		// address details
		this.input71 = this.createKVPair(this.form, "详细地址", "adressdetail");

		// post code group8
		this.input8 = this.createKVPair(this.form, "邮编", "postcode");

		var group9 = document.createElement("DIV");
		this.form.appendChild(group9);
		group9.className = "form-group";

		var div9 = document.createElement("DIV");
		group9.appendChild(div9);
		div9.className = "col-xs-12 col-sm-12 col-md-12 col-lg-12";

		var button = document.createElement("BUTTON");
		div9.appendChild(button);
		button.type = "button";
		button.id = "save";
		button.className = "btn btn-primary btn-block";
		button.innerText = "保存";
		button.addEventListener("click", this, false);

		this.span9 = document.createElement("SPAN");
		this.span9.innerHTML = "";
		this.span9.className = "help-block";
		this.span9.style.display = "none";
		div9.appendChild(this.span9);

		if (user.id == null) {
			this.loading(options);
		} else {
			this.loadData(this, user);
		}

	};

	Board.prototype.createTitle = function(parent, icon, title, color) {
		var titleSpan = document.createElement("SPAN");
		parent.appendChild(titleSpan);

		var h3 = document.createElement("H3");
		titleSpan.appendChild(h3);
		h3.className = "page-header";
		h3.style.margin = "0";

		var span = document.createElement("SPAN");
		h3.appendChild(span);
		span.className = icon;
		span.setAttribute("aria-hidden","true");
		span.style.color = color;

		var text = document.createTextNode(" " + title);
		h3.appendChild(text);

		return titleSpan;
	};

	Board.prototype.loading = function(options) {
		var that = this;
		$.get(service.api(8), {
			uid : options.uid, // user uid;
		}).complete(function(data) {
			user.parseFromJSON(data.responseJSON);
			that.loadData(that, user);
		});
	};

	Board.prototype.loadData = function(that, obj) {
		that.input0.value = obj.surname;
		that.input0a.value = obj.givenname;
		that.input1.value = obj.email;
		that.input2.value = obj.mobile;
		if (obj.idType != null) {
			that.input3.value = obj.idType;
		} else {
			user.idType = "1";
		}
		if (obj.idNumber != null) {
			that.input4.value = obj.idNumber;
		}
		if (obj.gender != null) {
			that.input5.value = obj.gender;
		}
		if (obj.birthday != null) {
			that.input6.value = obj.birthday;
		}
		if (obj.province != null) {
			that.input7.value = obj.province;
			that.input7.dispatchEvent(new Event('change'));
		}
		if (obj.city != null) {
			that.input7a.value = obj.city;
			that.input7a.dispatchEvent(new Event('change'));
		}
		if (obj.county != null) {
			that.input7b.value = obj.county;
		}
		if (obj.postcode != null) {
			that.input8.value = obj.postcode;
		}
		if (obj.address != null) {
			that.input71.value = obj.address;
		}
	}

	Board.prototype.createKVPair = function(parent, field, id) {
		var group = document.createElement("DIV");
		parent.appendChild(group);
		group.className = "form-group";

		this.createLabel(group, "", field,
				"col-xs-12 col-sm-12 col-md-3 col-lg-3 control-label", id);

		var div = document.createElement("DIV");
		group.appendChild(div);
		div.className = "col-xs-12 col-sm-12 col-md-9 col-lg-9";

		var input = document.createElement("INPUT");
		div.appendChild(input);
		input.type = "text";
		input.className = "form-control";
		input.id = id;
		input.setAttribute("placeholder", "输入" + field);
		input.addEventListener("keyup", this, false);
		input.addEventListener("change", this, false);
		return input;

	};

	Board.prototype.createLabel = function(group, id, title, classname, fors) {
		var label = document.createElement("Label");
		label.innerHTML = title;
		label.className = classname;
		label.id = id;
		label.setAttribute("for", fors);
		group.appendChild(label);
		return label;
	};

	Board.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(this, e);
			break;
		case "change":
			this.doChange(e);
			break;
		case "keyup":
			if (e.which == 13) {
				this.doChange(e);
			}
			break;
		case "blur":
			this.doChange(e);
			break;
		}
	};

	Board.prototype.show = function(show) {
		if (show) {
			this.board.style.display = "";
		} else {
			this.board.style.display = "none";
		}
	};

	Board.prototype.doChange = function(evt) {
		var ivalue = evt.target.value;
		if (ivalue == null || ivalue == "") {
			return;
		}
		if (evt.target.id == "lastname") {
			user.surname = ivalue;
		} else if (evt.target.id == "firstname") {
			user.givenname = ivalue;
		} else if (evt.target.id == "email") {
			if (this.verifyEmail(this, evt)) {
				this.span1.style.display = "none";
				if (evt.target.value != user.email) {
					evt.target.setAttribute("change", true);
				}
			} else {
				this.span1.classList.add("has-error");
				this.span1.style.display = "block";
				this.span1.innerHTML = "邮箱地址不正确！";
			}
		} else if (evt.target.id == "mobile") {
			if (evt.target.value != user.mobile) {
				evt.target.setAttribute("change", true);
			}
		} else if (evt.target.id == "code") {
			this.doVerifyCode(this, evt);
		} else if (evt.target.id == "idType") {
			user.idType = ivalue;
		} else if (evt.target.id == "idNumber") {
			if (evt.target.value != user.idNumber) {
				evt.target.setAttribute("change", true);
			}
		} else if (evt.target.id == "gender") {
			user.gender = ivalue;
		} else if (evt.target.id == "province") {
			user.province = ivalue;
		} else if (evt.target.id == "city") {
			user.city = ivalue;
		} else if (evt.target.id == "county") {
			user.county = ivalue;
		} else if (evt.target.id == "postcode") {
			user.postcode = ivalue;
		} else if (evt.target.id == "adressdetail") {
			user.address = ivalue;
		}
	};

	Board.prototype.doClick = function(that, evt) {
		if (evt.target.id == "save") {
			var t = 1;
			$.post(service.api(10), {
				email : that.input1.value,
				mobile : that.input2.value,
				idNumber : that.input4.value,
			}, function(data) {
				if (that.input1.getAttribute("change") == 'true') {
					if (data.email == 0) {
						user.email = that.input1.value;
						that.input1.setAttribute("change", false);
					} else {
						that.span1.innerHTML = "邮箱地址已存在！";
						that.span1.style.display = "block";
						that.span9.style.display = "none";
						t = 0;
					}
				}

				if (that.input2.getAttribute("validity") == 'true'
						&& that.input2.getAttribute("change") == 'true') {
					if (data.mobile == 0) {
						user.mobile = that.input2.value;
						that.input2.setAttribute("validity", false);
						that.input2.setAttribute("change", false);
					} else {
						that.span2.innerHTML = "手机号已存在！";
						that.span2.style.display = "block";
						that.span9.style.display = "none";
						t = 0;
					}
				}

				if (that.input4.getAttribute("change") == 'true') {
					if (data.idNumber == 0) {
						user.idNumber = that.input4.value;
						that.input4.setAttribute("change", false);
					} else {
						that.span4.innerHTML = "证件号码已存在！";
						that.span4.style.display = "block";
						that.span9.style.display = "none";
						t = 0;
					}
				}
				if (t == 1) {
					that.updateUser(that);
				}
			});

		} else if (evt.target.id == "sendMessage") {
			that.isPhoneNum(evt);
		}
	};

	// 邮箱地址合法性验证
	Board.prototype.verifyEmail = function(that, evt) {
		var email = evt.target.value;
		var patt = new RegExp(
				/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/);
		if (!patt.test(email)) {
			return false;
		} else {
			return true;
		}
	};

	// 手机号合法性验证
	Board.prototype.isPhoneNum = function(evt) {
		var mobile = this.input2.value;
		var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
		if (myreg.test(mobile)) {
			var btn = evt.target;
			btn.disabled = true;
			var time = 59;// 定义时间变量。用于倒计时用
			var timer = null;// 定义一个定时器；
			btn.innerText = "60秒后重新发送"; // 点击发生后，按钮的文本内容变成之前定义好的时间值。
			timer = setInterval(function() {// /开启定时器。函数内执行
				btn.innerText = time + "秒后重新发送"; // 点击发生后，按钮的文本内容变成之前定义好的时间值。
				time--;// 时间值自减
				if (time == 0) { // 判断,当时间值小于等于0的时候
					btn.innerText = '重新发送验证码'; // 其文本内容变成……点击重新发送……
					btn.disabled = false;
					clearInterval(timer); // 清除定时器
				}
			}, 1000)
			this.doSendMessage(this, mobile);
		} else {
			this.span2.classList.add("has-error");
			this.span2.style.display = "block";
			this.span2.innerHTML = "手机号不正确！";
		}

	};

	// 发送手机号
	Board.prototype.doSendMessage = function(that, mobile) {
		$.post(service.api1(1), {
			mobile : mobile,
		}, function(data) {
			if (data.status == 1) {
				that.span2.innerHTML = "已发送短信！";
				that.span2.style.display = "block";
			} else {
				that.span2.innerHTML = "短信发送失败！";
				that.span2.style.display = "block";
			}
		});
	};

	// 检查验证码
	Board.prototype.doVerifyCode = function(that, evt) {
		var code = evt.target.value;
		var patt = new RegExp("^[0-9]{6}$");
		if (patt.test(code)) {
			$.post(service.api1(2), {
				code : code,
			}, function(data) {
				if (data.status == 200) {
					that.input2.setAttribute("validity", true);
					that.span2a.innerHTML = "验证成功！";
					that.span2a.style.display = "block";
				} else {
					that.span2a.classList.add("has-error");
					that.span2a.innerHTML = "短信验证失败！";
					that.span2a.style.display = "block";
				}
			});
			return true;
		} else {
			that.span2a.classList.add("has-error");
			that.span2a.innerHTML = "验证码不正确！";
			that.span2a.style.display = "block";
		}
	};

	// 提交表单
	Board.prototype.updateUser = function(that) {
		$.post(service.api(9), {
			user : JSON.stringify(user),
		}, function(data) {
			if (data.status == 1) {
				that.span9.innerHTML = "保存成功！";
				that.span9.style.display = "block";
				that.span1.style.display = "none";
				that.span2.style.display = "none";
				that.span4.style.display = "none";
			} else {
				that.span9.innerHTML = "滴！没有保存上！";
				that.span9.style.display = "block";
			}
		});
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new Board(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);