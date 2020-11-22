;
(function($, window, document, undefined) {
	var pluginName = "forgotpassword";
	var defaults = {
		title : "",
		greeting : "",
		user : "",
	};

	var ForgotPassword = function(element, options) {
		this.element = element;
		this.options = $.extend({
			title : "",
			greeting : "",
			user : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent;
		this.title = options.title;
		this.init(options);
	};
//---------------------------------------------------------------------------------
	ForgotPassword.prototype.init = function(options) {
		var container = document.createElement("DIV");
		container.className = "container-fluid";
		this.element.appendChild(container);

		var head = document.createElement("DIV");
		head.className = "col-xs-12 col-sm-12 col-md-4 col-lg-4";
		container.appendChild(head);

		var formbody = document.createElement("DIV");
		formbody.className = "col-xs-12 col-sm-12 col-md-4 col-lg-4";
		container.appendChild(formbody);

		var panel = document.createElement("DIV");
		panel.className = "panel panel-default";
		formbody.appendChild(panel);

		var panelhead = document.createElement("DIV");
		panelhead.className = "panel-heading";
		panel.appendChild(panelhead);

		var paneltitle = document.createElement("h3");
		paneltitle.className = "panel-title"
		paneltitle.innerHTML = "忘记密码";
		panelhead.appendChild(paneltitle);

		var panelbody = document.createElement("DIV");
		panelbody.className = "panel-body";
		panel.appendChild(panelbody);

		var form = document.createElement("form");
		form.className = "form-horizontal";
		panelbody.appendChild(form);



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
		this.inputvalue8.id = "mobile";
		this.inputvalue8.placeholder = "手机号码";
		this.inputvalue8.required = true;
		this.inputvalue8.setAttribute("validity", false);

		var td2 = document.createElement("Td");
		tr1.appendChild(td2);
		td2.style.paddingLeft = "2px";
		td2.style.valign = "top";

		//发送按钮
		this.submit8 = document.createElement("BUTTON");
		td2.appendChild(this.submit8);
		this.submit8.setAttribute("type", "button");
		this.submit8.className = "btn btn-default btn-primary btn-block";
		this.submit8.id = "sendMessage";
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
		this.inputvalue9.id = "code";
		this.inputvalue9.placeholder = "输入验证码";
		this.inputvalue9.required = true;
		this.inputvalue9.setAttribute("validity", false);
		this.inputvalue9.addEventListener("keypress", this, false);
		this.inputvalue9.addEventListener("change", this, false);
		this.inputvalue9.addEventListener("blur", this, false);
		inputbody9.appendChild(this.inputvalue9);

		this.inputvalueSPAN9 = document.createElement("SPAN");
		this.inputvalueSPAN9.innerHTML = "输入验证码";
		this.inputvalueSPAN9.className = "help-block";
		this.inputvalueSPAN9.style.display = "none";
		inputbody9.appendChild(this.inputvalueSPAN9);


		// 重置密码按钮
		var formgroup10 = document.createElement("DIV");
		formgroup10.className = "form-group";
		form.appendChild(formgroup10);

		var i10 = document.createElement("DIV");
		i10.className = "col-sm-2";
		formgroup10.appendChild(i10);

		var inputbody10 = document.createElement("DIV");
		inputbody10.className = "col-sm-12";
		formgroup10.appendChild(inputbody10);

		this.inputvalue10 = document.createElement("BUTTON");
		this.inputvalue10.setAttribute("type", "button");
		this.inputvalue10.className = "btn btn-default btn-lg btn-primary btn-block";
		this.inputvalue10.innerText = "确认重置密码";
		this.inputvalue10.id = "confirmResetPasswordButton";
		this.inputvalue10.addEventListener("click", this, false);
		inputbody10.appendChild(this.inputvalue10);
		
		this.inputvalueSPAN10 = document.createElement("SPAN");
		this.inputvalueSPAN10.innerHTML = "发送短信失败！";
		this.inputvalueSPAN10.className = "help-block";
		this.inputvalueSPAN10.style.display = "none";
		inputbody10.appendChild(this.inputvalueSPAN10);

	};

	ForgotPassword.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "keypress":
			var keyvalue = e.which;
			if (keyvalue == 13) {
				this.doKeyPress(e);
			}
			break;
		case "change":
			this.doChange(e);
			break;
		case "blur":
			this.doBlur(e);
			break;
		}
	};

	ForgotPassword.prototype.doBlur = function(evt) { // 焦点离开本输入框
		if (evt.target.id == "code") {
			//this.doVerifyCode(evt);
		}
	};

	ForgotPassword.prototype.doChange = function(evt) { //验证码验证
		if (evt.target.id == "code") {
			//this.doVerifyCode(evt);
		}
	};

	ForgotPassword.prototype.doClick = function(evt) { // 点击事件
		if (evt.target.id == "sendMessage") {       //发送短信
			this.isPhoneNum(evt);
		} else if (evt.target.id == "confirmResetPasswordButton") {   //点击登录按钮
			if (this.inputvalue9.getAttribute("validity") == 'true') {
				this.disabledConfirmResetPasswordButton();
				document.body.style.cursor = "wait";//鼠标加载状态
				this.confirmResetPassword();
				return;
			}
		}
	};

	ForgotPassword.prototype.doKeyPress = function(evt) { // enter事件
		if (evt.target.id == "code") {
			this.doVerifyCode(evt);
		}
	};



	// 手机号合法性验证
	ForgotPassword.prototype.isPhoneNum = function(evt) {
		var that = this;
		this.formgroup8.classList.remove("has-error");
		this.inputvalueSPAN8.style.display = "none";
		this.inputvalueSPAN8.style.innerHTML = "";
		var mobile = this.inputvalue8.value;
		var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
		if (mobile == null || mobile == "") {
			this.formgroup8.classList.add("has-error");
			this.inputvalueSPAN8.style.display = "block";
			this.inputvalue8.setAttribute("validity", false); // 手机不合法，状态置false
			this.inputvalueSPAN8.innerHTML = "请输入手机号！";
			return;
		} else if (!myreg.test(mobile)) {
			this.formgroup8.classList.add("has-error");
			this.inputvalueSPAN8.style.display = "block";
			this.inputvalue8.setAttribute("validity", false);
			this.inputvalueSPAN8.innerHTML = "请输入正确的手机号码！";
			return;
		} else {
			//验证手机号是否存在
			$.post("LoginFindMobile", {
				mobile : mobile,
			}, function(data) {
				if (data.status == 1) {   // 1 ： 存在 ， 3 ： 其他（不存在）
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
					that.doSendMessage(mobile);
					that.inputvalue9.focus();
				} else {
					that.inputvalueSPAN8.style.display = "block";
					that.inputvalue8.setAttribute("validity", false);
					that.inputvalueSPAN8.innerHTML = "发送失败,手机号不存在,请注册！";
				}

			});
		}
	};

	// 发送手机号
	ForgotPassword.prototype.doSendMessage = function(mobile) {
		var that = this;
		$.post("requestVerifyCodeService", {   //发送手机号获取验证码
			api : 1,
			mobile : mobile,
		}, function(data) {
			if (data.status == 1) {
			}
			if (that.inputvalue9.getAttribute("validity")) {    //在验证验证码的时候，同时设置手机号合法
				that.inputvalue8.setAttribute("validity", true);
			} else {
				that.inputvalue8.setAttribute("validity", false);
			}
		});
	};

	// 检查验证码
	ForgotPassword.prototype.doVerifyCode = function(evt) {
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
		$.post("requestVerifyCodeService", {  //验证验证码是否正确
			api : 2,
			code : code,
			mobile : this.inputvalue8.value,
		}, function(data) {
			if (data.status == 200) {
				that.inputvalueSPAN9.style.display = "block";
				that.inputvalue9.setAttribute("validity", true);
				that.inputvalueSPAN9.innerHTML = "验证成功！";
			} else {
				that.formgroup9.classList.add("has-error");
				that.inputvalueSPAN9.style.display = "block";
				that.inputvalue9.setAttribute("validity", false);
				that.inputvalueSPAN9.innerHTML = data.msg;
			}
		});
	};

	// 确认重置密码
	ForgotPassword.prototype.confirmResetPassword = function() {
		that = this;
		var mobile = this.inputvalue8.value;
		var code = this.inputvalue9.value;
		$.post("requestVerifyCodeService", {    //判断手机号和验证码是否配对
			api : 4,
			mobile : mobile,
			code : code,
			type : "forgetPassword",
		}, function(data) {
			if (data.status == 1) {
				//成功发送带有新密码的短信和邮件
				window.location.replace(data.url1 + "/client/me.jsp?usr=" + data.id + data.url3);
				that.enableLoginButton();
				document.body.style.cursor = "default";
			} else if (data.status == 0) {
				that.shownMessage("您所输入的手机号不存在");
				that.enableLoginButton();
				document.body.style.cursor = "default";
			} else if (data.status == -1) {
				that.shownMessage("您所输入的手机号不正确");
				that.enableLoginButton();
				document.body.style.cursor = "default";
			} else if (data.status == -2) {
				that.shownMessage("您的账号已经被禁用");
				this.enableLoginButton();
				document.body.style.cursor = "default";
			} else if (data.status == -3) {
				that.shownMessage("您还没有得到授权进入系统");
				this.enableLoginButton();
				document.body.style.cursor = "default";
			} else if (data.status == -9) {
				that.shownMessage("您的密码已经过期了，请重置密码");
				this.enableLoginButton();
				document.body.style.cursor = "default";
			} else if (data.status == -4) {
				that.shownMessage("无效登录");
				this.enableLoginButton();
				document.body.style.cursor = "default";
			} else if (data.status == -10) {
				that.shownMessage("您的帐号已经被永久封掉，请联系云BPM公司系统管理员");
				this.enableLoginButton();
				document.body.style.cursor = "default";
			}  else if (data.status == -12) {
				//验证码已经失效
				that.shownMessage(data.msg);
				this.enableConfirmResetPasswordButton();
				document.body.style.cursor = "default";
			} else if (data.status == -13) {
				//验证失败
				that.shownMessage(data.msg);
				this.enableConfirmResetPasswordButton();
				document.body.style.cursor = "default";
			}
		});
	};
	
	ForgotPassword.prototype.shownMessage = function(msg) {
		this.formgroup10.classList.add("has-error");
		this.inputvalueSPAN10.style.display = "block";
		this.inputvalue9.setAttribute("validity", false);
		this.inputvalueSPAN10.innerHTML = msg;
	};
	
	ForgotPassword.prototype.disabledConfirmResetPasswordButton = function() {
		this.inputvalue10.setAttribute("disabled", "");
	};
	ForgotPassword.prototype.enableConfirmResetPasswordButton = function() {
		this.inputvalue10.removeAttribute("disabled");
	};
	

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new ForgotPassword(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);