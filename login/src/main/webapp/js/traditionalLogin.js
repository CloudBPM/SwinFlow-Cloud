;
(function($, window, document, undefined) {
	var pluginName = "traditionalLogin";
	var defaults = {
		title : "",
		user : "",
		url : "",
	};

	var TraditionalLogin = function(element, options) {
		this.element = element;
		this.options = $.extend({
			title : "",
			user : "",
			url : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.topparent;
		this.title = options.title;
		this.init(options);
		//this.check_cookie();
	};

	TraditionalLogin.prototype.init = function(options) {

		var container = document.createElement("DIV");
		this.element.appendChild(container);
		container.style.marginTop = "2px";
		
		var panel = document.createElement("DIV");
		panel.className = "panel panel-default";
		container.appendChild(panel);
		panel.style.border = "0px";

		var panelbody = document.createElement("DIV");
		panelbody.className = "panel-body";
		panel.appendChild(panelbody);

		//登录框
		this.form = document.createElement("form");
		this.form.className = "form-horizontal";
		panelbody.appendChild(this.form);

		// 账号/手机号/邮箱/证件号码
		this.formgroup1 = document.createElement("DIV");
		this.formgroup1.className = "form-group";
		this.form.appendChild(this.formgroup1);

		var inputbody1 = document.createElement("DIV");
		inputbody1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.formgroup1.appendChild(inputbody1);

		//username输入框
		this.inputvalue1 = document.createElement("INPUT");
		this.inputvalue1.setAttribute("type", "username");
		this.inputvalue1.className = "form-control";
		this.inputvalue1.id = "username";
		this.inputvalue1.placeholder = "用户账号/手机号/邮箱/证件号码";
		this.inputvalue1.required = true;
		this.inputvalue1.setAttribute("validity", false);
		this.inputvalue1.addEventListener("keypress", this, false);  //监听enter
		this.inputvalue1.addEventListener("blur", this, false);  //监听光标
		inputbody1.appendChild(this.inputvalue1);
		
		//验证账号错误结果
		this.inputvalueSPAN1 = document.createElement("SPAN");
		this.inputvalueSPAN1.innerHTML = "输入账号";
		this.inputvalueSPAN1.className = "help-block";
		this.inputvalueSPAN1.style.display = "none";
		inputbody1.appendChild(this.inputvalueSPAN1);

		// 输入密码
		this.formgroup2 = document.createElement("DIV");
		this.formgroup2.className = "form-group";
		this.form.appendChild(this.formgroup2);

		var inputbody2 = document.createElement("DIV");
		inputbody2.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		this.formgroup2.appendChild(inputbody2);

		//password输入框
		this.inputvalue2 = document.createElement("INPUT");
		this.inputvalue2.setAttribute("type", "password");
		this.inputvalue2.className = "form-control";
		this.inputvalue2.id = "password";
		this.inputvalue2.placeholder = "请输入密码";
		this.inputvalue2.required = true;
		this.inputvalue2.setAttribute("validity", false);
		this.inputvalue2.addEventListener("keypress", this, false);  //监听enter
		this.inputvalue2.setAttribute("autocomplete", "password");
		this.inputvalue2.addEventListener("blur", this, false);  //监听光标离开
		inputbody2.appendChild(this.inputvalue2);

		//验证密码错误结果
		this.inputvalueSPAN2 = document.createElement("SPAN");
		this.inputvalueSPAN2.innerHTML = "输入密码";
		this.inputvalueSPAN2.className = "help-block";
		this.inputvalueSPAN2.style.display = "none";
		inputbody2.appendChild(this.inputvalueSPAN2);
		
		
		// 记住密码
		var gDiv3 = document.createElement("DIV");
		this.form.appendChild(gDiv3);
		gDiv3.className = "form-group";
		gDiv3.id = "fm3";

		var gColDiv3 = document.createElement("DIV");
		gDiv3.appendChild(gColDiv3);
		gColDiv3.className = "checkbox col-sm-offset-2 col-sm-6";
		var gLabel3 = document.createElement("label");
		gColDiv3.appendChild(gLabel3);
		this.inputvalue3 = document.createElement("INPUT");
		gLabel3.appendChild(this.inputvalue3);
		this.inputvalue3.type = "checkbox";
		this.inputvalue3.id = "rememberme";
		this.inputvalue3.checked = true;
		this.inputvalue3.addEventListener("click", this, false);
		gLabel3.appendChild(document.createTextNode("记住我"));

//		var forgotpassword = document.createElement("A");
//		gDiv3.appendChild(forgotpassword);
//		forgotpassword.href = "forgotpassword.html";
//		forgotpassword.target = "_blank";
//		forgotpassword.innerText = "忘记密码？";

		
		// 登录按钮
		var formgroup4 = document.createElement("DIV");
		formgroup4.className = "form-group";
		this.form.appendChild(formgroup4);


		var inputbody4 = document.createElement("DIV");
		inputbody4.className = "col-sm-12";
		formgroup4.appendChild(inputbody4);

		this.inputvalue4 = document.createElement("BUTTON");
		this.inputvalue4.setAttribute("type", "button");
		this.inputvalue4.className = "btn btn-default btn-lg btn-primary btn-block";
		this.inputvalue4.innerText = "登录";
		this.inputvalue4.id = "traditionalLoginButton";
		this.inputvalue4.addEventListener("click", this, false);
		inputbody4.appendChild(this.inputvalue4);

		var formGroup5=document.createElement("div");
		formGroup5.className="form-group";
		this.form.appendChild(formGroup5);

		var a=document.createElement("a");
		a.innerText="还没有轩琦云账号？10秒注册";
		a.className="pull-right";
		a.href="/om/signup4user.jsp";
		formGroup5.appendChild(a);


		// //显示服务器ip的二维码
		// this.ipQrCode = document.createElement("div");
		// form.appendChild(this.ipQrCode);
        // this.ipQrCode.id = "serverIpQrCode";
		// this.ipQrCode.src = this.createIpQrCode();
		// this.ipQrCode.className = "col-xs-6 col-sm-6 col-md-6 col-lg-6";

		// //下载apk的二维码
		// this.downloadQrCode = document.createElement("div");
		// form.appendChild(this.downloadQrCode);
		// this.downloadQrCode.id = "serverDownloadQrCode";
		// this.downloadQrCode.src = this.createDownloadQrCode();
		// this.downloadQrCode.className = "col-xs-6 col-sm-6 col-md-6 col-lg-6";


	};


	TraditionalLogin.prototype.handleEvent = function(e) {
		switch (e.type) {
			case "click":
				this.doClick(e);
				break;
			case "keypress":
				var keyvalue = e.which;
				if (keyvalue == 13) { //enter
					this.doKeyPress(e);
				}
				break;
			case "blur":
				this.doBlur(e);
				break;
			}
	};
	
	TraditionalLogin.prototype.setStatus = function(active) { // 焦点离开本输入框
		this.inputvalue4.disabled = active;
		this.inputvalue3.disabled = active;
		this.inputvalue1.disabled = active;
		this.inputvalue2.disabled = active;
	};
	
	TraditionalLogin.prototype.doBlur = function(evt) { // 焦点离开本输入框
		if (evt.target.id == "username") {
			this.verifyUsername(evt);
		} else if (evt.target.id == "password") {
			this.verifyPassword(evt);
		}
	};


	TraditionalLogin.prototype.doClick = function(evt) { // 点击事件
		if (evt.target.id == "traditionalLoginButton") {
			//点击登录按钮
			if (this.inputvalue1.getAttribute("validity") == 'true'  //判断密码合法
				&& this.inputvalue2.getAttribute("validity") == 'true') {
				if(this.inputvalue3.checked){	
					//this.remember();
				}else{
					 //this.remove();
				}
				this.disabledLoginButton();
				document.body.style.cursor = "wait";//鼠标加载状态
				this.sendLoginInformation();//发送用户登录信息
			} else if (this.inputvalue1.getAttribute("validity") == 'true'  //判断密码合法
				&& this.inputvalue2.getAttribute("validity") == 'false') {
				this.formgroup2.classList.add("has-error");
				this.inputvalueSPAN2.style.display = "block";
				this.inputvalue2.setAttribute("validity", false);
				this.inputvalueSPAN2.innerHTML = "请输入密码";
				this.disabledLoginButton();
				return;
			} else if (this.inputvalue1.getAttribute("validity") == 'false'  //判断密码合法
				&& this.inputvalue2.getAttribute("validity") == 'true') {
				this.formgroup1.classList.add("has-error");
				this.inputvalueSPAN1.style.display = "block";
				this.inputvalue1.setAttribute("validity", false);
				this.inputvalueSPAN1.innerHTML = "请输入账号/手机号/邮箱/身份证号！";
				this.disabledLoginButton();
				return;
			} else {
				this.formgroup2.classList.add("has-error");
				this.inputvalueSPAN2.style.display = "block";
				this.inputvalue2.setAttribute("validity", false);
				this.inputvalueSPAN2.innerHTML = "请输入密码";
				this.formgroup1.classList.add("has-error");
				this.inputvalueSPAN1.style.display = "block";
				this.inputvalue1.setAttribute("validity", false);
				this.inputvalueSPAN1.innerHTML = "请输入账号/手机号/邮箱/身份证号！";
				this.disabledLoginButton();
				return;
			}
		}
	};

	TraditionalLogin.prototype.doKeyPress = function(evt) { // enter事件
		if (evt.target.id == "password") {
			this.verifyUsername(evt);
		}
	};
	
	TraditionalLogin.prototype.verifyUsername = function(evt) {
		this.formgroup1.classList.remove("has-error");
		this.inputvalueSPAN1.style.display = "none";
		this.inputvalueSPAN1.innerHTML = "";
		this.enableLoginButton();
		var username = evt.target.value;
		if (username == null || username == "") {
			this.formgroup1.classList.add("has-error");
			this.inputvalueSPAN1.style.display = "block";
			this.inputvalue1.setAttribute("validity", false);
			this.inputvalueSPAN1.innerHTML = "请输入账号/手机号/邮箱/身份证号！";
			//this.disabledLoginButton();
			return;
		} else {
			this.inputvalue1.setAttribute("validity", true);
		}
	};
	
	TraditionalLogin.prototype.verifyPassword = function(evt) {
		//首先取消错误提示，在根据情况判断是否添加错误提示
		this.formgroup2.classList.remove("has-error");
		this.inputvalueSPAN2.style.display = "none";
		this.inputvalueSPAN2.innerHTML = "";
		this.enableLoginButton();
		var password = evt.target.value;
		if (password == null || password == "") {
			this.formgroup2.classList.add("has-error");
			this.inputvalueSPAN2.style.display = "block";
			this.inputvalue2.setAttribute("validity", false);
			this.inputvalueSPAN2.innerHTML = "请输入密码";
			//this.disabledLoginButton();
			return;
		} else {
			this.inputvalue2.setAttribute("validity", true);
		}
	};
	
	TraditionalLogin.prototype.sendLoginInformation = function() {  //登录方法
		that = this;
		var username = that.inputvalue1.value;
		username = username.replace(/\s+/g,"");
		var password = that.inputvalue2.value;
		password = password.replace(/\s+/g,"");
		$.post(this.options.url, {
			username : username,
			password : calcMD5(password),
			rememberme : $("#rememberme").is(':checked'),
		}, function(data) {
			if (data.status == 1) {
				window.location.replace(data.url1+data.url2+data.url3);
				that.enableLoginButton();
				document.body.style.cursor = "default";
			} else if (data.status == 0) {
				that.shownMessage("您所输入的用户帐号不存在");
				that.enableLoginButton();
				document.body.style.cursor = "default";
			} else if (data.status == -1) {
				that.shownMessage("您所输入的账号或密码不正确");
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
				that.shownMessage("您的密码已经过期了，请点击忘记密码，然后进入该页重置密码页");
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
			}
		});
	};
	TraditionalLogin.prototype.shownMessage = function(msg) {
		this.formgroup2.classList.add("has-error");
		this.inputvalueSPAN2.style.display = "block";
		this.inputvalue2.setAttribute("validity", false);
		this.inputvalueSPAN2.innerHTML = msg;
	};
	
	TraditionalLogin.prototype.remember = function() {  //记住我
		if(typeof(Storage)!=="undefined"){   //判断是否可以用localStorage
			var localStorage = window.localStorage;
			var inputUsername = this.inputvalue1.value;
			var inputPassword = this.inputvalue2.value;
			// localStorage.setItem("Username",inputUsername);
			// localStorage.setItem("Password",inputPassword);
		}else{
			if(navigator.cookieEnabled){       //判断cookie是否可用
				var inputUsername = this.inputvalue1.value;
				var inputPassword = this.inputvalue2.value;
				// setCookie("username", inputUsername, 7);//调用设置Cooke的方法
				// setCookie("password", inputPassword, 7)
			}else{
				alert("浏览器Cooike被禁用");
			}
		}
	};
	TraditionalLogin.prototype.check_cookie = function() {
		var localStorage = window.localStorage;
		var username = null;
		var password = null;
		$("#rememberme").prop("checked",true);
		if(typeof(Storage)!=="undefined"){
			var inputUsername = localStorage.hasOwnProperty("Username");
			if(inputUsername==null||inputUsername==""){
				if (document.cookie !== null) {
					if (document.cookie !== "") {
						username = getCookie("username");
						password = getCookie("password");
					} else {
						username = "";
						password = "";
					}
				}
			}else{
				username = localStorage.getItem("Username");
				password = localStorage.getItem("Password");
			}
			username = this.inputvalue1.value;
			password = this.inputvalue2.value;
		}
	};
	TraditionalLogin.prototype.remove = function(){ //删除cookie
		if (typeof(Storage)!=="undefined") {
			localStorage.removeItem("Username");
			localStorage.removeItem("Password");
		} else {
			if (navigator.cookieEnabled) {
				setCookie("username","",-1);//调用设置Cooke的方法
				setCookie("password","",-1)
			}
		}
	};
	
	TraditionalLogin.prototype.disabledLoginButton = function() {
		this.inputvalue4.setAttribute("disabled", "");
	};
	TraditionalLogin.prototype.enableLoginButton = function() {
		this.inputvalue4.removeAttribute("disabled");
	};



	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new TraditionalLogin(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);