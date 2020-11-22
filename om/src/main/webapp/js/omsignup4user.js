;
(function($, window, document, undefined) {
	var pluginName = "omSignin";
	var defaults = {
		title : "",
		greeting : "",
		user : "",
	};

	var OMSignin = function(element, options) {
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

	OMSignin.prototype.init = function(options) {
		var container = document.createElement("DIV");
		container.className = "container-fluid";
		this.element.appendChild(container);

		var head = document.createElement("DIV");
		head.className = "col-xs-12 col-sm-12 col-md-3 col-lg-3";
		container.appendChild(head);

		var formbody = document.createElement("DIV");
		formbody.className = "col-xs-12 col-sm-12 col-md-6 col-lg-6";
		container.appendChild(formbody);
		formbody.style.height = "800px";

		var panel = document.createElement("DIV");
		panel.className = "panel panel-default";
		formbody.appendChild(panel);

		// var panelhead = document.createElement("DIV");
		// panelhead.className = "panel-heading";
		// panel.appendChild(panelhead);

		// var paneltitle = document.createElement("h3");
		// paneltitle.className = "panel-title"
		// paneltitle.innerHTML = "基本信息";
		// panelhead.appendChild(paneltitle);

		var panelbody = document.createElement("DIV");
		panelbody.className = "panel-body";
		panel.appendChild(panelbody);

		var form = document.createElement("form");
		form.className = "form-horizontal";
		panelbody.appendChild(form);

		/*
		 * var formgroup1 = document.createElement("DIV"); formgroup1.className =
		 * "form-group"; form.appendChild(formgroup1);
		 * 
		 * var inputname1 = document.createElement("LABEL"); inputname1.htmlFor =
		 * "username"; inputname1.className = "col-sm-3 control-label";
		 * inputname1.innerHTML = "*会员账号"; formgroup1.appendChild(inputname1);
		 * 
		 * var inputbody1 = document.createElement("DIV"); inputbody1.className =
		 * "col-sm-8"; formgroup1.appendChild(inputbody1);
		 * 
		 * var inputvalue1 = document.createElement("INPUT");
		 * inputvalue1.setAttribute("type", "text"); inputvalue1.className =
		 * "form-control"; inputvalue1.id = "username"; inputvalue1.placeholder =
		 * "登陆用户名"; inputvalue1.required = true;
		 * inputbody1.appendChild(inputvalue1);
		 */

		// 姓,LastName
		// var formgroup2 = document.createElement("DIV");
		// formgroup2.className = "form-group";
		// form.appendChild(formgroup2);
		//
		// var inputname2 = document.createElement("LABEL");
		// inputname2.htmlFor = "lastname";
		// inputname2.className = "col-sm-3 control-label";
		// inputname2.innerHTML = "* 真实姓名";
		// formgroup2.appendChild(inputname2);
		//
		// var inputbody2 = document.createElement("DIV");
		// inputbody2.className = "col-sm-4";
		// formgroup2.appendChild(inputbody2);
		//
		// this.inputvalue2 = document.createElement("INPUT");
		// this.inputvalue2.setAttribute("type", "text");
		// this.inputvalue2.className = "form-control";
		// this.inputvalue2.id = "lastname";
		// this.inputvalue2.placeholder = "姓氏";
		// this.inputvalue2.required = true;
		// this.inputvalue2.setAttribute("validity", true);
		// inputbody2.appendChild(this.inputvalue2);
		//
		// // 名,FirstName
		// var inputbody3 = document.createElement("DIV");
		// inputbody3.className = "col-sm-5";
		// formgroup2.appendChild(inputbody3);
		//
		// this.inputvalue3 = document.createElement("INPUT");
		// this.inputvalue3.setAttribute("type", "text");
		// this.inputvalue3.className = "form-control";
		// this.inputvalue3.id = "firstname";
		// this.inputvalue3.placeholder = "名字";
		// this.inputvalue3.required = true;
		// this.inputvalue3.setAttribute("validity", true);
		// inputbody3.appendChild(this.inputvalue3);
		//
		// // 邮箱 Email
		// this.formgroup5 = document.createElement("DIV");
		// this.formgroup5.className = "form-group";
		// form.appendChild(this.formgroup5);
		//
		// var inputname5 = document.createElement("LABEL");
		// inputname5.htmlFor = "email";
		// inputname5.className = "col-sm-3 control-label";
		// inputname5.innerHTML = "* 邮箱";
		// this.formgroup5.appendChild(inputname5);
		//
		// var inputbody5 = document.createElement("DIV");
		// inputbody5.className = "col-sm-9";
		// this.formgroup5.appendChild(inputbody5);
		//
		// this.inputvalue5 = document.createElement("INPUT");
		// this.inputvalue5.setAttribute("type", "email");
		// this.inputvalue5.className = "form-control";
		// this.inputvalue5.id = "email";
		// this.inputvalue5.placeholder = "电子邮箱地址";
		// this.inputvalue5.required = true;
		// this.inputvalue5.setAttribute("validity", false);
		// this.inputvalue5.addEventListener("keyup", this, false);
		// this.inputvalue5.addEventListener("change", this, false);
		// this.inputvalue5.addEventListener("blur", this, false);
		// inputbody5.appendChild(this.inputvalue5);
		//
		// this.inputvalueSPAN5 = document.createElement("SPAN");
		// this.inputvalueSPAN5.innerHTML = "请输入正确的电子邮箱地址";
		// this.inputvalueSPAN5.className = "help-block";
		// this.inputvalueSPAN5.style.display = "none";
		// inputbody5.appendChild(this.inputvalueSPAN5);

		// 首次输入密码
		// var formgroup6 = document.createElement("DIV");
		// formgroup6.className = "form-group";
		// form.appendChild(formgroup6);
		//
		// var inputname6 = document.createElement("LABEL");
		// inputname6.htmlFor = "password";
		// inputname6.className = "col-sm-3 control-label";
		// inputname6.innerHTML = "* 密码";
		// formgroup6.appendChild(inputname6);
		//
		// var inputbody6 = document.createElement("DIV");
		// inputbody6.className = "col-sm-9";
		// formgroup6.appendChild(inputbody6);
		//
		// this.inputvalue6 = document.createElement("INPUT");
		// this.inputvalue6.setAttribute("type", "password");
		// this.inputvalue6.className = "form-control";
		// this.inputvalue6.id = "password";
		// this.inputvalue6.placeholder = "密码长度应该大于6位，由数组加字母组合而成";
		// this.inputvalue6.required = true;
		// this.inputvalue6.setAttribute("validity", false);
		// this.inputvalue6.setAttribute("autocomplete", "password");
		// inputbody6.appendChild(this.inputvalue6);
		//
		// // 确认密码
		// this.formgroup7 = document.createElement("DIV");
		// this.formgroup7.className = "form-group";
		// form.appendChild(this.formgroup7);
		//
		// var inputname7 = document.createElement("LABEL");
		// inputname7.className = "col-sm-3 control-label";
		// inputname7.innerHTML = "* 确认密码";
		// this.formgroup7.appendChild(inputname7);
		//
		// var inputbody7 = document.createElement("DIV");
		// inputbody7.className = "col-sm-9";
		// this.formgroup7.appendChild(inputbody7);
		//
		// this.inputvalue7 = document.createElement("INPUT");
		// this.inputvalue7.setAttribute("type", "password");
		// this.inputvalue7.className = "form-control";
		// this.inputvalue7.placeholder = "确认密码";
		// this.inputvalue7.required = true;
		// this.inputvalue7.id = "confirmpassword";
		// this.inputvalue7.addEventListener("keyup", this, false);
		// this.inputvalue7.addEventListener("change", this, false);
		// this.inputvalue7.addEventListener("blur", this, false);
		// inputbody7.appendChild(this.inputvalue7);
		//
		// this.inputvalueSPAN7 = document.createElement("SPAN");
		// this.inputvalueSPAN7.innerHTML = "输入密码";
		// this.inputvalueSPAN7.className = "help-block";
		// this.inputvalueSPAN7.style.display = "none";
		// inputbody7.appendChild(this.inputvalueSPAN7);

		// 手机号，Mobile
		this.formgroup8 = document.createElement("DIV");
		this.formgroup8.className = "form-group";
		form.appendChild(this.formgroup8);

		var inputname8 = document.createElement("LABEL");
		inputname8.className = "col-sm-3 control-label";
		inputname8.innerHTML = "* 手机验证";
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
		inputname9.innerHTML = "* 验证码";
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
		this.inputvalue9.addEventListener("keyup", this, false);
		this.inputvalue9.addEventListener("change", this, false);
		this.inputvalue9.addEventListener("blur", this, false);
		inputbody9.appendChild(this.inputvalue9);

		this.inputvalueSPAN9 = document.createElement("SPAN");
		this.inputvalueSPAN9.innerHTML = "输入验证码";
		this.inputvalueSPAN9.className = "help-block";
		this.inputvalueSPAN9.style.display = "none";
		inputbody9.appendChild(this.inputvalueSPAN9);

		// read agreement
		var gDiv15 = document.createElement("DIV");
		form.appendChild(gDiv15);
		gDiv15.className = "form-group";
		gDiv15.id = "fm15";

		var gColDiv15 = document.createElement("DIV");
		gDiv15.appendChild(gColDiv15);
		gColDiv15.className = "checkbox col-sm-offset-2 col-sm-10";

		var gLabel15 = document.createElement("label");
		gColDiv15.appendChild(gLabel15);

		this.inputvalue11 = document.createElement("INPUT");
		gLabel15.appendChild(this.inputvalue11);
		this.inputvalue11.type = "checkbox";
		this.inputvalue11.id = "agreement";
		this.inputvalue11.checked = false;
		this.inputvalue11.addEventListener("click", this, false);

		gLabel15.appendChild(document.createTextNode("我已阅读并同意轩琦科技"));

		var agreeA = document.createElement("A");
		gLabel15.appendChild(agreeA);
		agreeA.href = "agreement.html";
		agreeA.target = "_blank";
		agreeA.innerText = "《用户服务协议及隐私政策》";

		// var agreement = document.createElement("LABLE");
		// agreement.innerHTML = "同意轩琦科技<a
		// href=http://localhost:8080/om/agreement.html target='_blank'>
		// 用户协议及隐私政策</a><br>已有账号 <a href='http://localhost:8080/login/'
		// class='link-signin'>直接登录</a>";
		// inputbody11.appendChild(agreement);

		// 注册按钮
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
		this.inputvalue10.innerText = "确认注册";
		this.inputvalue10.disabled = true;
		this.inputvalue10.id = "regUserOK";
		this.inputvalue10.addEventListener("click", this, false);
		inputbody10.appendChild(this.inputvalue10);

		this.inputvalueSPAN10 = document.createElement("SPAN");
		this.inputvalueSPAN10.innerHTML = "注册失败！";
		this.inputvalueSPAN10.className = "help-block";
		this.inputvalueSPAN10.style.display = "none";
		inputbody10.appendChild(this.inputvalueSPAN10);
	};

	OMSignin.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "keyup":
			var keyvalue = e.which;
			if (keyvalue == 13) {
				this.doKeyUp(e);
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

	OMSignin.prototype.doBlur = function(evt) { // 焦点离开本输入框
		if (evt.target.id == "email") {
			//this.verifyEmail(evt);
		} else if (evt.target.id == "confirmpassword") {
			//this.confirmpassword(evt);
		} else if (evt.target.id == "code") {
			 this.doVerifyCode(evt);
		}
	};

	OMSignin.prototype.doChange = function(evt) { // 输入框文本改变
		if (evt.target.id == "email") {
			//this.verifyEmail(evt);
		} else if (evt.target.id == "confirmpassword") {
			//this.confirmpassword(evt);
		} else if (evt.target.id == "code") {
			 this.doVerifyCode(evt);
		}
	};

	OMSignin.prototype.doClick = function(evt) { // 点击事件
		if (evt.target.id == "agreement") {
			if (evt.target.checked == true) {
				this.inputvalue10.disabled = false;
			} else {
				this.inputvalue10.disabled = true;
			}
		} else if (evt.target.id == "sendMessage") {
			this.isPhoneNum(evt);
		} else if (evt.target.id == "regUserOK") {
			this.registraion();
			// this.registraion();// 测试
		}
	};

	OMSignin.prototype.doKeyUp = function(evt) { // enter事件
		if (evt.target.id == "email") {
			//this.verifyEmail(evt);
		} else if (evt.target.id == "confirmpassword") {
			//this.confirmpassword(evt);
		} else if (evt.target.id == "code") {
			//this.doVerifyCode(evt);
		}
	};

	// 手机号合法性验证
	OMSignin.prototype.isPhoneNum = function(evt) {
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
			this.doSendMessage(mobile);
			this.inputvalue9.focus();
		}
	};

	// 发送手机号
	OMSignin.prototype.doSendMessage = function(mobile) {
		var that = this;
		$.post("registrationService?api=4", {
			phoneNumber : mobile,
		}, function() {
			that.phoneNumber=mobile;
		});
	};

	OMSignin.prototype.addError=function(msg){
		this.formgroup9.classList.add("has-error");
		this.inputvalueSPAN9.style.display = "block";
		this.inputvalue9.setAttribute("validity", false);
		this.inputvalueSPAN9.innerHTML =msg;
	};

	OMSignin.prototype.cleanError=function(){
		this.formgroup9.classList.remove("has-error");
		this.inputvalueSPAN9.style.display = "none";
		this.inputvalue9.setAttribute("validity", true);
	};

	// 检查验证码
	OMSignin.prototype.doVerifyCode = function(evt) {
		var patt = new RegExp("^[0-9]{6}$");
		this.code=this.inputvalue9.value;
		if (this.code == null || this.code == "") {
			this.addError("请输入验证码！");
			return false;
		}else if (!patt.test(this.code)) {
			this.addError("请输入正确的验证码！");
			return false;
		}else{
			this.cleanError();
			return true;
		}
	};

	// 注册个人账户
	OMSignin.prototype.registraion = function() {
		var that=this;
		if(!this.doVerifyCode()){
			return;
		}
		if(this.phoneNumber==null||this.phoneNumber===""){
			alert("请输入手机号并重新发送验证码！");
		}
		console.log("111111111111111111111")
		$.post("registrationService", {
			api : 5,
			phoneNumber : that.phoneNumber,
			code:that.code
		}, function(data) {
			console.log(data);
			if (data.success) {
				document.cookie = "sessionId=" + data.data.sessionId;
				alert("注册成功，默认密码为12345");
				window.location = "/client/me.jsp?sessionId=" + data.data.sessionId;
			} else {
				alert(data.codeMessage.message);
			}
		})
		// 	if (data.status == 0) {
		// 		$.post("Omregister", {
		// 			api : 1,
		// 			user : JSON.stringify(user),
		// 			//username : user.name,
		// 			//password : user.password,
		// 			rememberme : "false",
		// 		}, function(data) {
		// 			if (data.status == 1) {
		// 				window.location.replace(data.url);
		// 				that.inputvalue10.disabled = true;
		// 			} else {
		// 				that.inputvalueSPAN10.style.display = "block";
		// 				that.inputvalue10.setAttribute("validity", false);
		// 				that.inputvalueSPAN10.innerHTML = "注册失败！";
		// 			}
		// 		});
		// 	} else if (data.status == 1) {
		// 		//that.inputvalueSPAN10.style.display = "block";
		// 		//that.inputvalue10.setAttribute("validity", false);
		// 		//that.inputvalueSPAN10.innerHTML = "注册失败,账户已存在！";
		// 	} else if (data.status == 2) {
		// 		//that.inputvalueSPAN10.style.display = "block";
		// 		//that.inputvalue10.setAttribute("validity", false);
		// 		//that.inputvalueSPAN10.innerHTML = "注册失败,邮箱已注册！";
		// 	} else if (data.status == 3) {
		// 		that.inputvalueSPAN10.style.display = "block";
		// 		that.inputvalue10.setAttribute("validity", false);
		// 		that.inputvalueSPAN10.innerHTML = "注册失败,手机号已注册！";
		// 	}
		// });
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new OMSignin(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);