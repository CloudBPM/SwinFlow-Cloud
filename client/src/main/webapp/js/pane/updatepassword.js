/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "updatePasswordPane";
	var defaults = {
		id : "",
		uid : "",
	};

	var Board = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			uid : options.uid,
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
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

		this.createTitle(panelCol0, "fa fa-key", "更改密码", "#ffb045");

		// row1
		var panelRow1 = document.createElement("DIV");
		panel.appendChild(panelRow1);
		panelRow1.className = "row";
		panelRow1.style.marginTop = "4px";

		var colpane1 = document.createElement("DIV");
		panelRow1.appendChild(colpane1);
		colpane1.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12";

		var colpane = document.createElement("DIV");
		panelRow1.appendChild(colpane);
		colpane.className = "col-lg-7 col-md-7 col-sm-12 col-xs-12";

		var colpane2 = document.createElement("DIV");
		panelRow1.appendChild(colpane2);
		colpane2.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";

		var form = document.createElement("form");
		colpane.appendChild(form);
		form.className = "form-horizontal";
		
		var fieldset = document.createElement("fieldset");
		form.appendChild(fieldset);

		// 手机号，Mobile
		this.formgroup8 = document.createElement("DIV");
		this.formgroup8.className = "form-group";
		form.appendChild(this.formgroup8);

		var inputname8 = document.createElement("LABEL");
		inputname8.className = "col-sm-3 control-label";
		inputname8.innerHTML = "手机验证";
		inputname8.htmlFor = "mobile";
		this.formgroup8.appendChild(inputname8);

		var gDiv131 = document.createElement("DIV");
		this.formgroup8.appendChild(gDiv131);
		gDiv131.className = "col-sm-9";

		var table1 = document.createElement("Table");
		gDiv131.appendChild(table1);
		table1.style.width = "100%";

		var tr1 = document.createElement("Tr");
		table1.appendChild(tr1);

		var td1 = document.createElement("Td");
		tr1.appendChild(td1);

		var colDIV13 = document.createElement("DIV");
		td1.appendChild(colDIV13);
		colDIV13.id = "inputbody12";

		this.inputvalue8 = document.createElement("INPUT");
		colDIV13.appendChild(this.inputvalue8);
		this.inputvalue8.setAttribute("type", "text");
		this.inputvalue8.className = "form-control";
		this.inputvalue8.id = "mobile1";
		this.inputvalue8.placeholder = "手机号码";
		this.inputvalue8.setAttribute("validity", false);
		this.inputvalue8.readOnly = true;

		var td2 = document.createElement("Td");
		tr1.appendChild(td2);
		td2.style.paddingLeft = "2px";
		td2.style.valign = "top";

		this.submit8 = document.createElement("BUTTON");
		td2.appendChild(this.submit8);
		this.submit8.setAttribute("type", "button");
		this.submit8.className = "btn btn-default btn-primary btn-block";
		this.submit8.id = "sendMessage1";
		this.submit8.innerText = "发送";
		this.submit8.addEventListener("click", this, false);

		this.inputvalueSPAN8 = document.createElement("SPAN");
		gDiv131.appendChild(this.inputvalueSPAN8);
		this.inputvalueSPAN8.innerHTML = "输入手机号";
		this.inputvalueSPAN8.className = "help-block";
		this.inputvalueSPAN8.style.display = "none";

		// 验证码
		this.formgroup9 = document.createElement("DIV");
		this.formgroup9.className = "form-group";
		form.appendChild(this.formgroup9);

		var inputname9 = document.createElement("LABEL");
		inputname9.htmlFor = "mobile";
		inputname9.className = "col-sm-3 control-label";
		inputname9.innerHTML = "验证码";
		this.formgroup9.appendChild(inputname9);

		var inputbody9 = document.createElement("DIV");
		inputbody9.className = "col-sm-9";
		this.formgroup9.appendChild(inputbody9);

		this.inputvalue9 = document.createElement("INPUT");
		this.inputvalue9.setAttribute("type", "text");
		this.inputvalue9.className = "form-control";
		this.inputvalue9.id = "code1";
		this.inputvalue9.placeholder = "输入验证码";
		this.inputvalue9.required = true;
		this.inputvalue9.setAttribute("validity", false);
		this.inputvalue9.addEventListener("change", this, false);
		this.inputvalue9.addEventListener("blur", this, false);
		inputbody9.appendChild(this.inputvalue9);

		this.inputvalueSPAN9 = document.createElement("SPAN");
		this.inputvalueSPAN9.innerHTML = "输入验证码";
		this.inputvalueSPAN9.className = "help-block";
		this.inputvalueSPAN9.style.display = "none";
		inputbody9.appendChild(this.inputvalueSPAN9);
		
		// 首次输入密码
		var formgroup6 = document.createElement("DIV");
		formgroup6.className = "form-group";
		form.appendChild(formgroup6);

		var inputname6 = document.createElement("LABEL");
		inputname6.htmlFor = "password";
		inputname6.className = "col-sm-3 control-label";
		inputname6.innerHTML = "新密码";
		formgroup6.appendChild(inputname6);

		var inputbody6 = document.createElement("DIV");
		inputbody6.className = "col-sm-9";
		formgroup6.appendChild(inputbody6);

		this.inputvalue6 = document.createElement("INPUT");
		this.inputvalue6.setAttribute("type", "password");
		this.inputvalue6.className = "form-control";
		this.inputvalue6.id = "password";
		this.inputvalue6.placeholder = "密码长度应该大于6位，由数组加字母组合而成";
		this.inputvalue6.required = true;
		this.inputvalue6.setAttribute("validity", false);
		this.inputvalue6.setAttribute("autocomplete", "password");
		inputbody6.appendChild(this.inputvalue6);

		// 确认密码
		this.formgroup7 = document.createElement("DIV");
		this.formgroup7.className = "form-group";
		form.appendChild(this.formgroup7);

		var inputname7 = document.createElement("LABEL");
		inputname7.className = "col-sm-3 control-label";
		inputname7.innerHTML = "确认密码";
		this.formgroup7.appendChild(inputname7);

		var inputbody7 = document.createElement("DIV");
		inputbody7.className = "col-sm-9";
		this.formgroup7.appendChild(inputbody7);

		this.inputvalue7 = document.createElement("INPUT");
		this.inputvalue7.setAttribute("type", "password");
		this.inputvalue7.className = "form-control";
		this.inputvalue7.placeholder = "请再次输入密码";
		this.inputvalue7.required = true;
		this.inputvalue7.id = "confirmpassword";
		this.inputvalue7.setAttribute("autocomplete", "confirmpassword");
		this.inputvalue7.addEventListener("change", this, false);
		this.inputvalue7.addEventListener("blur", this, false);
		inputbody7.appendChild(this.inputvalue7);

		this.inputvalueSPAN7 = document.createElement("SPAN");
		this.inputvalueSPAN7.innerHTML = "输入密码";
		this.inputvalueSPAN7.className = "help-block";
		this.inputvalueSPAN7.style.display = "none";
		inputbody7.appendChild(this.inputvalueSPAN7);
		
		// 保存按钮
		var formgroup10 = document.createElement("DIV");
		formgroup10.className = "form-group";
		form.appendChild(formgroup10);

		var i10 = document.createElement("DIV");
		i10.className = "col-sm-2";
		formgroup10.appendChild(i10);

		var inputbody10 = document.createElement("DIV");
		inputbody10.className = "col-sm-10";
		formgroup10.appendChild(inputbody10);

		this.inputvalue10 = document.createElement("BUTTON");
		this.inputvalue10.setAttribute("type", "button");
		this.inputvalue10.className = "btn btn-default btn-lg btn-primary btn-block";
		this.inputvalue10.innerText = "修改密码";
		this.inputvalue10.id = "updatePasswordButton";
		this.inputvalue10.addEventListener("click", this, false);
		inputbody10.appendChild(this.inputvalue10);
		
		this.inputvalueSPAN10 = document.createElement("SPAN");
		this.inputvalueSPAN10.innerHTML = "修改密码失败！";
		this.inputvalueSPAN10.className = "help-block";
		this.inputvalueSPAN10.style.display = "none";
		inputbody10.appendChild(this.inputvalueSPAN10);
		
		if (user.id == null) {  //加载初始数据
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
			that.loadData(user);
		});
	};

	Board.prototype.loadData = function(obj) { //默认填写手机号
		this.inputvalue6.value = "";
		this.inputvalue7.value = "";
		this.inputvalue8.value = obj.mobile;
		this.inputvalue9.value = "";
		this.inputvalue10.value = "";
	}

	Board.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "change":
			this.doChange(e);
			break;
		case "blur":
			this.doBlur(e);
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

	Board.prototype.doClick = function(evt) {// 点击事件
		if (evt.target.id == "sendMessage1") {       //发送短信
			this.isPhoneNum(evt);
		} else if (evt.target.id == "updatePasswordButton") {   //点击更新按钮
			if (this.inputvalue6.getAttribute("validity") == 'true'  //判断密码合法
					&& this.inputvalue9.getAttribute("validity") == 'true') {  //判断验证码正确
				this.disabledupdatePasswordButton();
				document.body.style.cursor = "wait";//鼠标加载状态
				this.updatePassword(this);
				return;
			}
		}
	};
	
	Board.prototype.doChange = function(evt) { //验证码验证
		if (evt.target.id == "code1") {
			this.doVerifyCode(evt);
		} else if (evt.target.id == "confirmpassword") {
			this.confirmpassword(evt);
		}
	};
	
	Board.prototype.doBlur = function(evt) { // 焦点离开本输入框
		if (evt.target.id == "confirmpassword") {
			this.confirmpassword(evt);
		} else if (evt.target.id == "code1") {
			this.doVerifyCode(evt);
		}
	};
	
	// 手机号合法性验证
	Board.prototype.isPhoneNum = function(evt) {
		var mobile  = this.inputvalue8.value;
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
		this.inputvalue9.focus();
	};
	
	// 发送手机号
	Board.prototype.doSendMessage = function(that, mobile) {
		$.post(service.api1(1), {
			mobile : mobile,
		}, function(data) {
			if (data.status == 1) {
				that.inputvalueSPAN8.innerHTML = "已发送短信！";
				that.inputvalueSPAN8.style.display = "block";
			} else {
				that.inputvalueSPAN8.innerHTML = "短信发送失败！";
				that.inputvalueSPAN8.style.display = "block";
			}
		});
	};
	// 检查验证码
	Board.prototype.doVerifyCode = function(evt) {
		var code = evt.target.value;
		var patt = new RegExp("^[0-9]{6}$");
		var that = this;
		if (code == null || code == "") {
			this.formgroup9.classList.add("has-error");
			this.inputvalueSPAN9.style.display = "block";
			this.inputvalue9.setAttribute("validity", false);
			this.inputvalueSPAN9.innerHTML = "请输入验证码！";
			return;
		}
		if (!patt.test(code)) {
			this.formgroup9.classList.add("has-error");
			this.inputvalueSPAN9.style.display = "block";
			this.inputvalue9.setAttribute("validity", false);
			this.inputvalueSPAN9.innerHTML = "验证码错误！";
			return;
		}
		$.post(service.api1(2), {
			api : 2,
			code : code,
			mobile : this.inputvalue8.value,
		}, function(data) {
			if (data.status == 200) {
				that.inputvalueSPAN9.style.display = "block";
				that.inputvalue9.setAttribute("validity", true);
				that.inputvalueSPAN9.innerHTML = data.msg; //验证成功
			} else {
				that.formgroup9.classList.add("has-error");
				that.inputvalueSPAN9.style.display = "block";
				that.inputvalue9.setAttribute("validity", false);
				that.inputvalueSPAN9.innerHTML = data.msg; //验证码失效
			}
		});
	};
	
	// 二次输入密码验证
	//这里没有控制密码的格式
	Board.prototype.confirmpassword = function(evt) {
		this.formgroup7.classList.remove("has-error");
		this.inputvalueSPAN7.style.display = "none";
		this.inputvalueSPAN7.style.innerHTML = "";
		if (this.inputvalue6.value == "" || this.inputvalue6.value == null
				|| evt.target.value == null || evt.target.value == "") {
			this.formgroup7.classList.add("has-error");
			this.inputvalueSPAN7.style.display = "block";
			this.inputvalue6.setAttribute("validity", false);
			this.inputvalueSPAN7.innerHTML = "请输入密码!";
			return;
		} else if (this.inputvalue6.value != evt.target.value) {
			this.formgroup7.classList.add("has-error");
			this.inputvalueSPAN7.style.display = "block";
			this.inputvalue6.setAttribute("validity", false);
			this.inputvalueSPAN7.innerHTML = "两次密码输入不相同,请重新输入!";
			return;
		} else {
			//两次密码相同
			this.inputvalue6.setAttribute("validity", true);
		}
	};
	
	// 提交修改的密码
	//可能的问题：在验证码失效以后修改手机号再发送密码，这里没有做验证-------------------------------------
	//由于手机号本身不可修改问题不大
	Board.prototype.updatePassword = function(that) {
		var mobile  = that.inputvalue8.value;
		var password  = that.inputvalue6.value;
		$.post(service.api(11), {
			mobile : mobile,
			password : calcMD5(password),
		}, function(data) {
			if (data.status == 1) {
				that.inputvalueSPAN10.innerHTML = "修改密码成功";
				that.inputvalueSPAN10.style.display = "block";
				that.enableupdatePasswordButton();
				document.body.style.cursor = "default";
				that.inputvalueSPAN8.style.display = "none";
				that.inputvalueSPAN9.style.display = "none";
				that.inputvalue6.value = "";
				that.inputvalue7.value = "";
				that.inputvalue9.value = "";
			} else {
				that.inputvalueSPAN10.innerHTML = "滴！没有保存上！";
				that.inputvalueSPAN10.style.display = "block";
			}
		});
	};

	
	Board.prototype.disabledupdatePasswordButton = function() {
		this.inputvalue10.setAttribute("disabled", "");
	};
	Board.prototype.enableupdatePasswordButton = function() {
		this.inputvalue10.removeAttribute("disabled");
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