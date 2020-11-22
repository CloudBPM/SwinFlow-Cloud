/**
 * 
 */

;
(function($, window, document, undefined) {
	var pluginName = "newStaffDetailsDialog";
	var defaults = {
		id : "",
		title : "",
		parent : "", // process manager plugin handler
		ownerId : "",
	};

	var NewStaffDialog = function(element, options) {
		this.element = element;
		this.options = $.extend({
			id : "",
			title : "",
			parent : "",
			ownerId : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.modalframe;
		this.topparent;
		this.init(options);
	};

	NewStaffDialog.prototype.init = function(options) {
		this.topparent = options.topparent;
		this.modalframe = document.createElement("div");
		this.element.appendChild(this.modalframe);

		// dialog
		this.modalframe.className = "modal fade";
		this.modalframe.id = "myModal" + options.id;
		this.modalframe.setAttribute("role", "dialog");
		this.modalframe.setAttribute("aria-labelledby", "modal" + options.id);

		var modaldialogDIV = document.createElement("div");
		modaldialogDIV.className = "modal-dialog";
		modaldialogDIV.setAttribute("role", "document");
		modaldialogDIV.style.width = "900px"
		this.modalframe.appendChild(modaldialogDIV);

		var dialogContentDIV = document.createElement("div");
		dialogContentDIV.className = "modal-content";
		modaldialogDIV.appendChild(dialogContentDIV);

		// dialog headding
		var dialogHeaderDIV = document.createElement("div");
		dialogHeaderDIV.className = "modal-header";
		dialogContentDIV.appendChild(dialogHeaderDIV);

		var closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.className = "close";
		closeButton.setAttribute("data-dismiss", "modal");
		closeButton.setAttribute("aria-label", "Close");

		var closeSpan = document.createElement("span");
		closeSpan.setAttribute("aria-hidden", "true");
		closeSpan.innerHTML = "&times;";
		closeButton.appendChild(closeSpan);
		dialogHeaderDIV.appendChild(closeButton);

		var titleH4 = document.createElement("h4");
		titleH4.className = "modal-title";
		titleH4.id = "modal" + options.id;
		dialogHeaderDIV.appendChild(titleH4);

		var infoIcon = document.createElement("i");
		infoIcon.className = "fa fa-plus-circle fa-lg";
		infoIcon.style.color = "green";
		titleH4.appendChild(infoIcon);

		var info = document.createElement("label");
		info.innerHTML = options.title;
		titleH4.appendChild(info);

		// dialog body
		var dialogForm = document.createElement("form");
		dialogContentDIV.appendChild(dialogForm);

		var dialogBodyDIV = document.createElement("div");
		dialogBodyDIV.className = "modal-body";
		dialogForm.appendChild(dialogBodyDIV);

		var dialogBodyFrameDIV = document.createElement("div");
		dialogBodyFrameDIV.className = "container-fluid";
		dialogBodyDIV.appendChild(dialogBodyFrameDIV);

		var bodyRow = document.createElement("div");
		bodyRow.className = "row";
		bodyRow.id = "bodyrow" + options.id;
		dialogBodyFrameDIV.appendChild(bodyRow);

		// add form panel here...
		this.loadPanel(bodyRow);

		// dialog footer
		var dialogFooterDIV = document.createElement("div");
		dialogFooterDIV.className = "modal-footer";
		dialogForm.appendChild(dialogFooterDIV);

		this.saveButton = document.createElement("button");
		this.saveButton.type = "OKButton";
		this.saveButton.id = "OKButton" + options.id;
		this.saveButton.className = "btn btn-primary";
		this.saveButton.addEventListener("click", this, false);
		this.saveButton.innerHTML = "确定";
		// this.saveButton.setAttribute("disabled", "");
		dialogFooterDIV.appendChild(this.saveButton);

		var cancelButton = document.createElement("button");
		cancelButton.type = "CancelButton";
		cancelButton.id = "CancelButton" + options.id;
		cancelButton.className = "btn btn-default";
		cancelButton.innerHTML = "取消";
		cancelButton.setAttribute("data-dismiss", "modal");
		dialogFooterDIV.appendChild(cancelButton);

		var dialog = $(dialogBodyDIV).alertBox({
			id : options.id,
		});
		this.messageBox = dialog.data("alertBox");

	};

	NewStaffDialog.prototype.loadPanel = function(parent) {
		var star = "<font style='color:red;font-weight:bold;'>*</font>&nbsp;";
		var form = document.createElement("form");
		form.className = "form-horizontal";
		parent.appendChild(form);

		// 姓
		var usernamediv = document.createElement("div");
		usernamediv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(usernamediv);

		var div0 = document.createElement("div");
		div0.className = "form-group";
		usernamediv.appendChild(div0);

		var label0 = document.createElement("label");
		label0.className = "col-sm-3 control-label";
		label0.innerHTML = star + "姓";
		div0.appendChild(label0);

		var div01 = document.createElement("div");
		div0.appendChild(div01);
		div01.className = "col-sm-9";

		this.inputFullName = document.createElement("input");
		this.inputFullName.className = "form-control";
		this.inputFullName.setAttribute("required", "true");
		this.inputFullName.setAttribute("placeholder", "姓");
		div01.appendChild(this.inputFullName);

		// 名
		var fullnamediv = document.createElement("div");
		fullnamediv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(fullnamediv);

		var div1 = document.createElement("div");
		div1.className = "form-group";
		fullnamediv.appendChild(div1);

		var label1 = document.createElement("label");
		label1.className = "col-sm-3 control-label";
		label1.innerHTML = star + "名";
		div1.appendChild(label1);

		var div11 = document.createElement("div");
		div1.appendChild(div11);
		div11.className = "col-sm-9";

		this.inputFullGName = document.createElement("input");
		this.inputFullGName.className = "form-control";
		this.inputFullGName.setAttribute("required", "true");
		this.inputFullGName.setAttribute("placeholder", "名");
		div11.appendChild(this.inputFullGName);

		// 曾用名
		var usednamediv = document.createElement("div");
		usednamediv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(usednamediv);

		var div101 = document.createElement("div");
		div101.className = "form-group";
		usednamediv.appendChild(div101);

		var label101 = document.createElement("label");
		label101.className = "col-sm-3 control-label";
		label101.innerHTML = "曾用名";
		div101.appendChild(label101);

		var div1101 = document.createElement("div");
		div101.appendChild(div1101);
		div1101.className = "col-sm-9";

		this.inputUsedName = document.createElement("input");
		this.inputUsedName.className = "form-control";
		this.inputUsedName.setAttribute("placeholder", "请输入曾用名");
		div1101.appendChild(this.inputUsedName);

		// 民族
		var nationalitydiv = document.createElement("div");
		nationalitydiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(nationalitydiv);

		var div201 = document.createElement("div");
		div201.className = "form-group";
		nationalitydiv.appendChild(div201);

		var nationalitylabel1 = document.createElement("label");
		div201.appendChild(nationalitylabel1);
		nationalitylabel1.className = "col-sm-3 control-label";
		nationalitylabel1.innerHTML = star + "民族";

		var nationalitycdiv = document.createElement("div");
		div201.appendChild(nationalitycdiv);
		nationalitycdiv.className = "col-sm-9";

		this.selectNationality = document.createElement("SELECT");
		this.selectNationality.className = "form-control";
		nationalitycdiv.appendChild(this.selectNationality);

		var i = 0;
		for (x in ch_nationality) {
			this.addOptions(this.selectNationality, ch_nationality[x], x, i);
			i++;
		}

		// 性别
		var genderdiv = document.createElement("div");
		genderdiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(genderdiv);

		var div2 = document.createElement("div");
		div2.className = "form-group";
		genderdiv.appendChild(div2);

		var genderlabel1 = document.createElement("label");
		div2.appendChild(genderlabel1);
		genderlabel1.className = "col-sm-3 control-label";
		genderlabel1.innerHTML = star + "性别";

		var gendercdiv = document.createElement("div");
		div2.appendChild(gendercdiv);
		gendercdiv.className = "col-sm-9";

		var label2 = document.createElement("label");
		label2.className = "radio-inline";
		gendercdiv.appendChild(label2);

		this.radioOption1 = document.createElement("input");
		this.radioOption1.type = "radio";
		this.radioOption1.name = "gender" + this.options.id;
		this.radioOption1.id = "gender" + this.options.id;
		this.radioOption1.setAttribute("value", "M");
		this.radioOption1.setAttribute("checked", "true");
		this.radioOption1.addEventListener("click", this, false);
		label2.appendChild(this.radioOption1);
		var font1 = document.createElement("font");
		font1.innerHTML = "男";
		label2.appendChild(font1);

		var label3 = document.createElement("label");
		label3.className = "radio-inline";
		gendercdiv.appendChild(label3);

		this.radioOption2 = document.createElement("input");
		this.radioOption2.type = "radio";
		this.radioOption2.name = "gender" + this.options.id;
		this.radioOption2.id = "gender" + this.options.id;
		this.radioOption2.setAttribute("value", "F");
		this.radioOption2.addEventListener("click", this, false);
		label3.appendChild(this.radioOption2);
		var font2 = document.createElement("font");
		font2.innerHTML = "女";
		label3.appendChild(font2);

		// DOB
		var dobdiv = document.createElement("div");
		dobdiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(dobdiv);

		var div3 = document.createElement("div");
		div3.className = "form-group";
		dobdiv.appendChild(div3);

		var doblabel1 = document.createElement("label");
		div3.appendChild(doblabel1);
		doblabel1.className = "col-sm-3 control-label";
		doblabel1.innerHTML = "出生年月日";

		var dobdiv00 = document.createElement("div");
		div3.appendChild(dobdiv00);
		dobdiv00.className = "col-sm-9";

		// initialize a date editor
		var dobdivPane = document.createElement("div");
		dobdiv00.appendChild(dobdivPane);
		dobdivPane.id = "divBirthdate";

		var p = $(dobdivPane).dateSelector({
			"maxYear" : new Date().getFullYear(),
			"minYear" : "1910",
			"defaultYear" : 0,
			"defaultMonth" : 0,
			"defaultDate" : 0,
		});
		this.dob = p.data("dateSelector");

		// 年龄
		var agediv = document.createElement("div");
		agediv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(agediv);

		var agediv4 = document.createElement("div");
		agediv4.className = "form-group";
		agediv.appendChild(agediv4);

		var agelabel2 = document.createElement("label");
		agelabel2.className = "col-sm-3 control-label";
		agelabel2.innerHTML = "年龄";
		agediv4.appendChild(agelabel2);

		var agediv21 = document.createElement("div");
		agediv4.appendChild(agediv21);
		agediv21.className = "col-sm-9";

		this.inputAge = document.createElement("input");
		this.inputAge.className = "form-control";
		this.inputAge.setAttribute("placeholder", "请输入年龄");
		this.inputAge.addEventListener("keypress", this, false);
		agediv21.appendChild(this.inputAge);

		// 血型
		var bloodtypediv = document.createElement("div");
		bloodtypediv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(bloodtypediv);

		var bloodtypediv4 = document.createElement("div");
		bloodtypediv4.className = "form-group";
		bloodtypediv.appendChild(bloodtypediv4);

		var bloodtypelabel2 = document.createElement("label");
		bloodtypelabel2.className = "col-sm-3 control-label";
		bloodtypelabel2.innerHTML = "血型";
		bloodtypediv4.appendChild(bloodtypelabel2);

		var bloodtypediv21 = document.createElement("div");
		bloodtypediv4.appendChild(bloodtypediv21);
		bloodtypediv21.className = "col-sm-9";

		this.selectBloodType = document.createElement("select");
		this.selectBloodType.className = "form-control";
		bloodtypediv21.appendChild(this.selectBloodType);

		this.addOptions(this.selectBloodType, bloodtype["A"], "A", 0);
		this.addOptions(this.selectBloodType, bloodtype["B"], "B", 1);
		this.addOptions(this.selectBloodType, bloodtype["AB"], "AB", 2);
		this.addOptions(this.selectBloodType, bloodtype["O"], "O", 3);
		this.addOptions(this.selectBloodType, bloodtype["Rh"], "Rh", 4);
		this.addOptions(this.selectBloodType, bloodtype["Unknown"], "Unknown",
				5);

		// 身高
		var heightdiv = document.createElement("div");
		heightdiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(heightdiv);

		var heightdiv4 = document.createElement("div");
		heightdiv4.className = "form-group";
		heightdiv.appendChild(heightdiv4);

		var heightlabel2 = document.createElement("label");
		heightlabel2.className = "col-sm-3 control-label";
		heightlabel2.innerHTML = "身高";
		heightdiv4.appendChild(heightlabel2);

		var heightdiv21 = document.createElement("div");
		heightdiv4.appendChild(heightdiv21);
		heightdiv21.className = "col-sm-9";

		var gheightdiv21 = document.createElement("div");
		gheightdiv21.className = "input-group";
		heightdiv21.appendChild(gheightdiv21);

		this.inputHeight = document.createElement("input");
		this.inputHeight.className = "form-control";
		this.inputHeight.setAttribute("placeholder", "请输入身高厘米数");
		this.inputHeight.addEventListener("keypress", this, false);
		gheightdiv21.appendChild(this.inputHeight);

		var heightSPAN21 = document.createElement("SPAN");
		heightSPAN21.className = "input-group-addon";
		heightSPAN21.innerHTML = "厘米";
		gheightdiv21.appendChild(heightSPAN21);

		// 体重
		var weightdiv = document.createElement("div");
		weightdiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(weightdiv);

		var weightdiv4 = document.createElement("div");
		weightdiv4.className = "form-group";
		weightdiv.appendChild(weightdiv4);

		var weightlabel2 = document.createElement("label");
		weightlabel2.className = "col-sm-3 control-label";
		weightlabel2.innerHTML = "体重";
		weightdiv4.appendChild(weightlabel2);

		var weightdiv21 = document.createElement("div");
		weightdiv4.appendChild(weightdiv21);
		weightdiv21.className = "col-sm-9";

		var gweightdiv21 = document.createElement("div");
		gweightdiv21.className = "input-group";
		weightdiv21.appendChild(gweightdiv21);

		this.inputWeight = document.createElement("input");
		this.inputWeight.className = "form-control";
		this.inputWeight.setAttribute("placeholder", "请输入体重公斤数");
		this.inputWeight.addEventListener("keypress", this, false);
		gweightdiv21.appendChild(this.inputWeight);

		var weightSPAN21 = document.createElement("SPAN");
		weightSPAN21.className = "input-group-addon";
		weightSPAN21.innerHTML = "公斤";
		gweightdiv21.appendChild(weightSPAN21);

		// ID type
		var idtypediv = document.createElement("div");
		idtypediv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(idtypediv);

		var div4 = document.createElement("div");
		div4.className = "form-group";
		idtypediv.appendChild(div4);

		var idtypelabel2 = document.createElement("label");
		idtypelabel2.className = "col-sm-3 control-label";
		idtypelabel2.innerHTML = star + "证件类型";
		div4.appendChild(idtypelabel2);

		var idtypediv21 = document.createElement("div");
		div4.appendChild(idtypediv21);
		idtypediv21.className = "col-sm-9";

		this.selectIdType = document.createElement("select");
		this.selectIdType.className = "form-control";
		idtypediv21.appendChild(this.selectIdType);

		var i = 0;
		for (x in idtype) {
			this.addOptions(this.selectIdType, idtype[x], x, i);
			i++;
		}

		// ID number
		var idnumberdiv = document.createElement("div");
		idnumberdiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(idnumberdiv);

		var div5 = document.createElement("div");
		div5.className = "form-group";
		idnumberdiv.appendChild(div5);

		var idnumberlabel3 = document.createElement("label");
		idnumberlabel3.className = "col-sm-3 control-label";
		idnumberlabel3.innerHTML = star + "证件号码";
		div5.appendChild(idnumberlabel3);

		var div51 = document.createElement("div");
		div5.appendChild(div51);
		div51.className = "col-sm-9";

		this.inputIdNumber = document.createElement("input");
		this.inputIdNumber.className = "form-control";
		this.inputIdNumber.setAttribute("required", "true");
		// this.inputIdNumber.setAttribute("disabled", "");
		div51.appendChild(this.inputIdNumber);

		// address on ID card
		var addrdiv1 = document.createElement("div");
		addrdiv1.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(addrdiv1);

		var div61 = document.createElement("div");
		div61.className = "form-group";
		addrdiv1.appendChild(div61);

		var addrlabel31 = document.createElement("label");
		addrlabel31.className = "col-sm-3 control-label";
		addrlabel31.innerHTML = "户籍地址";
		div61.appendChild(addrlabel31);

		var div611 = document.createElement("div");
		div61.appendChild(div611);
		div611.className = "col-sm-9";

		this.inputHAddress = document.createElement("input");
		this.inputHAddress.className = "form-control";
		this.inputHAddress.setAttribute("placeholder", "请输入户籍地址（身份证地址）");
		div611.appendChild(this.inputHAddress);

		// post code for ID card
		var postcodediv1 = document.createElement("div");
		postcodediv1.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(postcodediv1);

		var div71 = document.createElement("div");
		div71.className = "form-group";
		postcodediv1.appendChild(div71);

		var postcodelabel31 = document.createElement("label");
		postcodelabel31.className = "col-sm-3 control-label";
		postcodelabel31.innerHTML = "户籍邮编";
		div71.appendChild(postcodelabel31);

		var div711 = document.createElement("div");
		div71.appendChild(div711);
		div711.className = "col-sm-9";

		this.inputHPostcode = document.createElement("input");
		this.inputHPostcode.className = "form-control";
		this.inputHPostcode.setAttribute("placeholder", "请输入户籍邮编（身份证邮编）");
		this.inputHPostcode.addEventListener("keypress", this, false);
		div711.appendChild(this.inputHPostcode);

		// 省市县
		var provincediv = document.createElement("div");
		provincediv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		form.appendChild(provincediv);

		var provincediv6 = document.createElement("div");
		provincediv6.className = "form-group";
		provincediv.appendChild(provincediv6);
		provincediv.id = "address";

		var provincelabel3 = document.createElement("label");
		provincelabel3.className = "col-sm-2 control-label";
		provincelabel3.innerHTML = "现居省市区";
		provincediv6.appendChild(provincelabel3);

		// 省
		var colDIV31 = document.createElement("DIV");
		provincediv6.appendChild(colDIV31);
		colDIV31.className = "col-sm-3";
		colDIV31.id = "inputbody5";

		this.select1 = document.createElement("SELECT");
		colDIV31.appendChild(this.select1);
		this.select1.id = "province";
		this.select1.className = "form-control";

		// 市
		var colDIV32 = document.createElement("DIV");
		provincediv6.appendChild(colDIV32);
		colDIV32.className = "col-sm-3";
		colDIV32.id = "inputbody6";

		this.select2 = document.createElement("SELECT");
		colDIV32.appendChild(this.select2);
		this.select2.id = "city";
		this.select2.className = "form-control";

		// 县
		var colDIV33 = document.createElement("DIV");
		provincediv6.appendChild(colDIV33);
		colDIV33.className = "col-sm-4";
		colDIV33.id = "inputbody7";

		this.select3 = document.createElement("SELECT");
		colDIV33.appendChild(this.select3);
		this.select3.id = "county";
		this.select3.className = "form-control";

		(function($) {
			$(provincediv).distpicker({
				autoSelect : false,
				province : "----- 所在省/市 -----",
				city : "----- 所在市/区 -----",
				district : "----- 所在区/县 -----",
			});
		})(jQuery);

		// address
		var addrdiv = document.createElement("div");
		addrdiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(addrdiv);

		var div6 = document.createElement("div");
		div6.className = "form-group";
		addrdiv.appendChild(div6);

		var addrlabel3 = document.createElement("label");
		addrlabel3.className = "col-sm-3 control-label";
		addrlabel3.innerHTML = "现居地址";
		div6.appendChild(addrlabel3);

		var div61 = document.createElement("div");
		div6.appendChild(div61);
		div61.className = "col-sm-9";

		this.inputAddress = document.createElement("input");
		this.inputAddress.className = "form-control";
		this.inputAddress.setAttribute("placeholder", "请输入现在居住的家庭住址");
		div61.appendChild(this.inputAddress);

		// post code
		var postcodediv = document.createElement("div");
		postcodediv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(postcodediv);

		var div7 = document.createElement("div");
		div7.className = "form-group";
		postcodediv.appendChild(div7);

		var postcodelabel3 = document.createElement("label");
		postcodelabel3.className = "col-sm-3 control-label";
		postcodelabel3.innerHTML = "现居邮编";
		div7.appendChild(postcodelabel3);

		var div71 = document.createElement("div");
		div7.appendChild(div71);
		div71.className = "col-sm-9";

		this.inputPostcode = document.createElement("input");
		this.inputPostcode.className = "form-control";
		this.inputPostcode.setAttribute("placeholder", "请输入现在居住的家庭地址邮编");
		this.inputPostcode.addEventListener("keypress", this, false);
		div71.appendChild(this.inputPostcode);

		// email code
		var emaildiv = document.createElement("div");
		emaildiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(emaildiv);

		var div8 = document.createElement("div");
		div8.className = "form-group";
		emaildiv.appendChild(div8);

		var emaillabel3 = document.createElement("label");
		emaillabel3.className = "col-sm-3 control-label";
		emaillabel3.innerHTML = "私人邮箱";
		div8.appendChild(emaillabel3);

		var div81 = document.createElement("div");
		div8.appendChild(div81);
		div81.className = "col-sm-9";

		this.inputEmail = document.createElement("input");
		this.inputEmail.className = "form-control";
		this.inputEmail.setAttribute("placeholder", "请输入您的电子邮箱地址");
		div81.appendChild(this.inputEmail);

		// mobile code
		var mobilediv = document.createElement("div");
		mobilediv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(mobilediv);

		var div9 = document.createElement("div");
		div9.className = "form-group";
		mobilediv.appendChild(div9);

		var mobilelabel3 = document.createElement("label");
		mobilelabel3.className = "col-sm-3 control-label";
		mobilelabel3.innerHTML = star + "私人手机";
		div9.appendChild(mobilelabel3);

		var div91 = document.createElement("div");
		div9.appendChild(div91);
		div91.className = "col-sm-9";

		this.inputMobile = document.createElement("input");
		this.inputMobile.className = "form-control";
		this.inputMobile.setAttribute("placeholder", "请输入手机号码");
		this.inputMobile.addEventListener("keypress", this, false);
		div91.appendChild(this.inputMobile);

		// office details
		// staff number
		var staffnodiv = document.createElement("div");
		staffnodiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(staffnodiv);

		var div10 = document.createElement("div");
		div10.className = "form-group";
		staffnodiv.appendChild(div10);

		var staffnolabel3 = document.createElement("label");
		staffnolabel3.className = "col-sm-3 control-label";
		staffnolabel3.innerHTML = "职员编号";
		div10.appendChild(staffnolabel3);

		var div101 = document.createElement("div");
		div10.appendChild(div101);
		div101.className = "col-sm-9";

		this.inputStaffNumber = document.createElement("input");
		this.inputStaffNumber.className = "form-control";
		this.inputStaffNumber.setAttribute("placeholder",
				"请输入职员编号，该编号依据各单位的不同而不同。");
		div101.appendChild(this.inputStaffNumber);

		// staff title row
		var stafftitlediv = document.createElement("div");
		stafftitlediv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(stafftitlediv);

		var div11 = document.createElement("div");
		div11.className = "form-group";
		stafftitlediv.appendChild(div11);

		var stafftitlelabel = document.createElement("label");
		stafftitlelabel.className = "col-sm-3 control-label";
		stafftitlelabel.innerHTML = "职称";
		div11.appendChild(stafftitlelabel);

		var div111 = document.createElement("div");
		div11.appendChild(div111);
		div111.className = "col-sm-9";

		this.selectProfessionalTitle = document.createElement("select");
		this.selectProfessionalTitle.className = "form-control";
		div111.appendChild(this.selectProfessionalTitle);

		var j = 0;
		for (x in stafftitle) {
			this.addOptions(this.selectProfessionalTitle, stafftitle[x], x, j);
			j++;
		}

		// work phone
		var workphonediv = document.createElement("div");
		workphonediv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(workphonediv);

		var div12 = document.createElement("div");
		div12.className = "form-group";
		workphonediv.appendChild(div12);

		var workphonelabel = document.createElement("label");
		workphonelabel.className = "col-sm-3 control-label";
		workphonelabel.innerHTML = "办公电话";
		div12.appendChild(workphonelabel);

		var div121 = document.createElement("div");
		div12.appendChild(div121);
		div121.className = "col-sm-9";

		this.inputWorkphone = document.createElement("input");
		this.inputWorkphone.className = "form-control";
		this.inputWorkphone.setAttribute("placeholder", "请输入办公电话或分机号");
		this.inputWorkphone.addEventListener("keypress", this, false);
		div121.appendChild(this.inputWorkphone);

		// work mobile
		var workmbdiv = document.createElement("div");
		workmbdiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(workmbdiv);

		var div13 = document.createElement("div");
		div13.className = "form-group";
		workmbdiv.appendChild(div13);

		var workmblabel = document.createElement("label");
		workmblabel.className = "col-sm-3 control-label";
		workmblabel.innerHTML = "办公手机";
		div13.appendChild(workmblabel);

		var div131 = document.createElement("div");
		div13.appendChild(div131);
		div131.className = "col-sm-9";

		this.inputWorkmobile = document.createElement("input");
		this.inputWorkmobile.className = "form-control";
		this.inputWorkmobile.setAttribute("placeholder", "请输入办公手机");
		this.inputWorkmobile.addEventListener("keypress", this, false);
		div131.appendChild(this.inputWorkmobile);

		// work fax
		var workfaxdiv = document.createElement("div");
		workfaxdiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(workfaxdiv);

		var div14 = document.createElement("div");
		div14.className = "form-group";
		workfaxdiv.appendChild(div14);

		var workfaxlabel = document.createElement("label");
		workfaxlabel.className = "col-sm-3 control-label";
		workfaxlabel.innerHTML = "办公传真";
		div14.appendChild(workfaxlabel);

		var div141 = document.createElement("div");
		div14.appendChild(div141);
		div141.className = "col-sm-9";

		this.inputWorkfax = document.createElement("input");
		this.inputWorkfax.className = "form-control";
		this.inputWorkfax.setAttribute("placeholder", "请输入办公传真");
		this.inputWorkfax.addEventListener("keypress", this, false);
		div141.appendChild(this.inputWorkfax);

		// work email
		var workemaildiv = document.createElement("div");
		workemaildiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(workemaildiv);

		var div15 = document.createElement("div");
		div15.className = "form-group";
		workemaildiv.appendChild(div15);

		var workemaillabel = document.createElement("label");
		workemaillabel.className = "col-sm-3 control-label";
		workemaillabel.innerHTML = "办公邮件";
		div15.appendChild(workemaillabel);

		var div151 = document.createElement("div");
		div15.appendChild(div151);
		div151.className = "col-sm-9";

		this.inputWorkemail = document.createElement("input");
		this.inputWorkemail.className = "form-control";
		this.inputWorkemail.setAttribute("placeholder", "请输入办公邮件");
		div151.appendChild(this.inputWorkemail);

		// office location
		var worklocdiv = document.createElement("div");
		worklocdiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(worklocdiv);

		var div16 = document.createElement("div");
		div16.className = "form-group";
		worklocdiv.appendChild(div16);

		var workloclabel = document.createElement("label");
		workloclabel.className = "col-sm-3 control-label";
		workloclabel.innerHTML = "办公位置";
		div16.appendChild(workloclabel);

		var div161 = document.createElement("div");
		div16.appendChild(div161);
		div161.className = "col-sm-9";

		this.inputWorkloc = document.createElement("input");
		this.inputWorkloc.className = "form-control";
		this.inputWorkloc.setAttribute("placeholder", "请输入办公位置（办公地点或工位）");
		div161.appendChild(this.inputWorkloc);

		// enrollment date
		var regdatediv = document.createElement("div");
		regdatediv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(regdatediv);

		var div17 = document.createElement("div");
		div17.className = "form-group";
		regdatediv.appendChild(div17);

		var regdatedivlabel = document.createElement("label");
		div17.appendChild(regdatedivlabel);
		regdatedivlabel.className = "col-sm-3 control-label";
		regdatedivlabel.innerHTML = "入职时间";

		var div171 = document.createElement("div");
		div17.appendChild(div171);
		div171.className = "col-sm-9";

		// initialize a date editor
		var enrollPane = document.createElement("div");
		div171.appendChild(enrollPane);
		enrollPane.id = "divEnrollmentdate";

		var p1 = $(enrollPane).dateSelector({
			"maxYear" : new Date().getFullYear(),
			"minYear" : "1980",
			"defaultYear" : 0,
			"defaultMonth" : 0,
			"defaultDate" : 0,
		});

		this.enrolldate = p1.data("dateSelector");

		// work type
		var worktypediv = document.createElement("div");
		worktypediv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
		form.appendChild(worktypediv);

		var div18 = document.createElement("div");
		div18.className = "form-group";
		regdatediv.appendChild(div18);

		var worktypelabel = document.createElement("label");
		div18.appendChild(worktypelabel);
		worktypelabel.className = "col-sm-3 control-label";
		worktypelabel.innerHTML = "工作类型";

		var div181 = document.createElement("div");
		div18.appendChild(div181);
		div181.className = "col-sm-9";

		this.selectWorktype = document.createElement("select");
		this.selectWorktype.className = "form-control";
		div181.appendChild(this.selectWorktype);

		var k = 0;
		for (x in worktype) {
			this.addOptions(this.selectWorktype, worktype[x], x, k);
			k++;
		}

	};

	NewStaffDialog.prototype.loadData = function(staff) {
		this.inputFullName.value = "";// 姓
		this.inputFullGName.value = "";// 名

		this.radioOption1.checked = true; // 男
		this.radioOption2.checked = false; // 女
		this.dob.setDate(new Date()); // 出生年月日
		this.selectIdType.selectedIndex = 0; // 证件类型
		this.inputIdNumber.value = ""; // 证件号码
		this.inputAddress.value = ""; // 现居地址
		this.inputPostcode.value = ""; // 现居邮编
		this.inputEmail.value = ""; // 私人邮箱
		this.inputMobile.value = ""; // 私人手机
		this.inputStaffNumber.value = ""; // 职员编号
		this.selectProfessionalTitle.selectedIndex = 0; // 职称
		this.inputWorkphone.value = ""; // 办公电话
		this.inputWorkfax.value = ""; // 办公传真
		this.inputWorkmobile.value = ""; // 办公手机
		this.inputWorkemail.value = ""; // 办公邮箱
		this.inputWorkloc.value = ""; // 办公位置
		this.enrolldate.setDate(new Date()); // 入职日期
		this.selectWorktype.selectedIndex = 0; // 工作类型
		// added
		this.selectNationality.selectedIndex = 0; // 民族
		this.inputUsedName.value = "";// 曾用名
		this.inputAge.value = "";// 年龄
		this.selectBloodType.selectedIndex = 0; // 血型
		this.inputHeight.value = "";// 身高
		this.inputWeight.value = "";// 体重
		this.inputHAddress.value = ""; // 户籍地址
		this.inputHPostcode.value = ""; // 户籍邮编
		this.select1.selectedIndex = 0; // 省、自治区、直辖市
		this.select2.selectedIndex = 0; // 地市区
		this.select3.selectedIndex = 0; // 县区

		this.staff = staff;
		if (staff != null) {
			if (staff.user.id != null) {
				this.inputFullName.value = Utils.parse(staff.user.surname);// 姓
				this.inputFullGName.value = Utils.parse(staff.user.givenname);// 名
				this.inputUsedName.value = Utils.parse(staff.user.usedName);
				if (staff.user.gender == "M" || staff.user.gender == "男") {
					this.radioOption1.checked = true;
					this.radioOption2.checked = false;
				} else if (staff.user.gender == "F" || staff.user.gender == "W"
						|| staff.user.gender == "女") {
					this.radioOption1.checked = false;
					this.radioOption2.checked = true;
				}
				this.dob.setDate(staff.user.birthday);
				if (staff.user.idType != null) {
					for (var i = 0; i < this.selectIdType.length; i++) {
						if (this.selectIdType.options[i].value == staff.user.idType) {
							this.selectIdType.selectedIndex = i;
							break;
						}
					}
				}
				this.inputIdNumber.value = staff.user.idNumber;
				this.inputAddress.value = Utils.parse(staff.user.address);
				this.inputPostcode.value = staff.user.postcode;
				this.inputEmail.value = staff.user.email;
				this.inputMobile.value = staff.user.mobile;
				// added
				if (staff.user.nation != null) {// 民族
					for (var i = 0; i < this.selectNationality.length; i++) {
						if (this.selectNationality.options[i].value == staff.user.nation) {
							this.selectNationality.selectedIndex = i;
							break;
						}
					}
				}
				this.inputUsedName.value = staff.user.usedName;// 曾用名
				this.inputAge.value = staff.user.age;// 年龄
				if (staff.user.bloodType != null) { // 血型
					for (var i = 0; i < this.selectBloodType.length; i++) {
						if (this.selectBloodType.options[i].value == staff.user.bloodType) {
							this.selectBloodType.selectedIndex = i;
							break;
						}
					}
				}
				this.inputHeight.value = staff.user.height;// 身高
				this.inputWeight.value = staff.user.weight;// 体重
				this.inputHAddress.value = Utils
						.parse(staff.user.householdAddress); // 户籍地址
				this.inputHPostcode.value = staff.user.householdPostcode; // 户籍邮编
				if (staff.user.province != null) { // 省、自治区、直辖市
					for (var i = 0; i < this.select1.length; i++) {
						if (this.select1.options[i].value == staff.user.province) {
							this.select1.selectedIndex = i;
							break;
						}
					}
				}
				if (staff.user.city != null) { // 地市区
					for (var i = 0; i < this.select2.length; i++) {
						if (this.select2.options[i].value == staff.user.city) {
							this.select2.selectedIndex = i;
							break;
						}
					}
				}
				if (staff.user.county != null) { // 县区
					for (var i = 0; i < this.select3.length; i++) {
						if (this.select3.options[i].value == staff.user.county) {
							this.select3.selectedIndex = i;
							break;
						}
					}
				}
				this.inputIdNumber.setAttribute("disabled", "");
				this.selectIdType.setAttribute("disabled", "");
				this.inputUsedName.setAttribute("disabled", "");
				this.inputFullName.setAttribute("disabled", "");
				this.inputFullGName.setAttribute("disabled", "");
				this.radioOption1.setAttribute("disabled", "");
				this.radioOption2.setAttribute("disabled", "");
				this.dob.setEnabled(false);
				this.inputAddress.setAttribute("disabled", "");
				this.inputPostcode.setAttribute("disabled", "");
				this.inputEmail.setAttribute("disabled", "");
				this.inputMobile.setAttribute("disabled", "");
				// added
				this.selectNationality.setAttribute("disabled", ""); // 民族
				this.inputUsedName.setAttribute("disabled", "");// 曾用名
				this.inputAge.setAttribute("disabled", "");// 年龄
				this.selectBloodType.setAttribute("disabled", ""); // 血型
				this.inputHeight.setAttribute("disabled", "");// 身高
				this.inputWeight.setAttribute("disabled", "");// 体重
				this.inputHAddress.setAttribute("disabled", ""); // 户籍地址
				this.inputHPostcode.setAttribute("disabled", ""); // 户籍邮编
				this.select1.setAttribute("disabled", ""); // 省、自治区、直辖市
				this.select2.setAttribute("disabled", ""); // 地市区
				this.select3.setAttribute("disabled", ""); // 县区
			} else {
				this.inputIdNumber.value = staff.user.idNumber;
				this.inputIdNumber.setAttribute("disabled", "");
				this.selectIdType.setAttribute("disabled", "");
				this.inputUsedName.removeAttribute("disabled");
				this.inputFullName.removeAttribute("disabled");
				this.inputFullGName.removeAttribute("disabled");
				this.radioOption1.removeAttribute("disabled");
				this.radioOption2.removeAttribute("disabled");
				this.selectIdType.removeAttribute("disabled");
				this.dob.setEnabled(true);
				this.inputAddress.removeAttribute("disabled");
				this.inputPostcode.removeAttribute("disabled");
				this.inputEmail.removeAttribute("disabled");
				this.inputMobile.removeAttribute("disabled");
				// added
				this.selectNationality.removeAttribute("disabled"); // 民族
				this.inputUsedName.removeAttribute("disabled");// 曾用名
				this.inputAge.removeAttribute("disabled");// 年龄
				this.selectBloodType.removeAttribute("disabled"); // 血型
				this.inputHeight.removeAttribute("disabled");// 身高
				this.inputWeight.removeAttribute("disabled");// 体重
				this.inputHAddress.removeAttribute("disabled"); // 户籍地址
				this.inputHPostcode.removeAttribute("disabled"); // 户籍邮编
				this.select1.removeAttribute("disabled"); // 省、自治区、直辖市
				this.select2.removeAttribute("disabled"); // 地市区
				this.select3.removeAttribute("disabled"); // 县区
			}
			this.inputStaffNumber.value = staff.staffCode;
			if (staff.professionalTitle != null) {
				for (var i = 0; i < this.selectProfessionalTitle.length; i++) {
					if (this.selectProfessionalTitle.options[i].value == staff.professionalTitle) {
						this.selectProfessionalTitle.selectedIndex = i;
						break;
					}
				}
			}
			this.inputWorkphone.value = staff.workPhoneNumber;
			this.inputWorkfax.value = staff.workFaxNumber;
			this.inputWorkmobile.value = staff.workMobileNumber;
			this.inputWorkemail.value = staff.workEmail;
			this.inputWorkloc.value = Utils.parse(staff.officeLocation);
			this.enrolldate.setDate(staff.onBoardingDate);
			if (staff.workType != null) {
				for (var i = 0; i < this.selectWorktype.length; i++) {
					if (this.selectWorktype.options[i].value == staff.workType) {
						this.selectWorktype.selectedIndex = i;
						break;
					}
				}
			}
		}
		// if (staff.id == null) {
		// this.saveButton.removeAttribute("disabled");
		// } else {
		// this.saveButton.setAttribute("disabled", "");
		// }
	};

	NewStaffDialog.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	NewStaffDialog.prototype.show = function() {
		$(this.modalframe).modal({
			backdrop : 'static',
			keyboard : true
		});
	};

	NewStaffDialog.prototype.hide = function() {
		$(this.modalframe).modal('hide');
	};

	NewStaffDialog.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "blur":
			this.doBlur(e);
			break;
		case "keypress":
			this.doKeypress(e);
			break;
		}
	};

	NewStaffDialog.prototype.doKeypress = function(e) {
		if (e.target == this.inputAge || e.target == this.inputWeight
				|| e.target == this.inputHeight
				|| e.target == this.inputHPostcode
				|| e.target == this.inputPostcode
				|| e.target == this.inputMobile
				|| e.target == this.inputWorkphone
				|| e.target == this.inputWorkmobile
				|| e.target == this.inputWorkfax) {
			Utils.blockNonNumbers(e.target, e, false, false);
		}
	};

	NewStaffDialog.prototype.doBlur = function(evt) {
		evt.preventDefault();
		// if (evt.target == this.inputUserName) {
		// if (this.inputUserName.value.trim() == "") {
		// this.messageBox.show(4, "用户帐号不能为空，请输入一个用户帐号", false);
		// this.inputUserName.focus();
		// return false;
		// } else {
		// var that = this;
		// $.getJSON(omservices.api(14), {
		// acc : this.inputUserName.value.trim(),
		// }).complete(
		// function(data) {
		// console.log(data);
		// if (data.responseJSON == 1) {
		// that.messageBox.show(4,
		// "用户帐号已经存在于云BPM平台中，请换一个帐号", false);
		// that.inputUserName.focus();
		// return;
		// }
		// });
		// }
		// }
	};

	NewStaffDialog.prototype.doClick = function(evt) {
		if (evt.target.id == "OKButton" + this.options.id) {
			evt.preventDefault();
			// if (this.inputUserName.value.trim() == "") {
			// this.messageBox.show(4, "帐号不能为空，请输入一个用户帐号", false);
			// return false;
			// }
			if (this.inputFullName.value.trim() == "") {
				this.messageBox.show(4, "姓不能为空", false);
				return false;
			}
			if (this.inputFullGName.value.trim() == "") {
				this.messageBox.show(4, "名不能为空", false);
				return false;
			}
			// if (this.inputIdNumber.value.trim() == "") {
			// 	this.messageBox.show(4, "证件号码不能为空", false);
			// 	return false;
			// }
			// if (this.inputEmail.value.trim() == "") {
			// this.messageBox.show(4, "电子邮箱不能为空，创建用户以后，将发一封确认邮件给用户", false);
			// return false;
			// }
			if (this.inputMobile.value.trim() == "") {
				this.messageBox.show(4, "手机号码不能为空", false);
				return false;
			}
			// if (this.inputStaffNumber.value.trim() == "") {
			// this.messageBox.show(4, "职员编号不能为空", false);
			// return false;
			// }
			// if (this.inputWorkphone.value.trim() == "") {
			// this.messageBox.show(4, "办公电话不能为空", false);
			// return false;
			// }
			// if (this.inputWorkmobile.value.trim() == "") {
			// this.messageBox.show(4, "办公手机不能为空", false);
			// return false;
			// }
			// if (this.inputWorkemail.value.trim() == "") {
			// this.messageBox.show(4, "办公电子邮箱不能为空", false);
			// return false;
			// }

			if (this.staff.user == null) {
				this.staff.user = new User();
			}
			this.staff.user.name = this.inputIdNumber.value.trim();
			this.staff.user.surname = Utils.stringify(this.inputFullName.value
					.trim());
			this.staff.user.givenname = Utils
					.stringify(this.inputFullGName.value.trim());
			if (this.radioOption1.checked) {
				this.staff.user.gender = "男";
			} else {
				this.staff.user.gender = "女";
			}
			this.staff.user.birthday = this.dob.fetchDateString();
			this.staff.user.idType = this.selectIdType.options[this.selectIdType.selectedIndex].value;
			this.staff.user.idNumber = this.inputIdNumber.value.trim();
			this.staff.user.address = Utils.stringify(this.inputAddress.value
					.trim()); // -
			this.staff.user.postcode = this.inputPostcode.value.trim(); // -
			this.staff.user.email = this.inputEmail.value.trim();
			this.staff.user.mobile = this.inputMobile.value.trim();
			this.staff.user.registrationDate = Utils.getCurrentDateTime();
			this.staff.user.lastupdate = Utils.getCurrentDateTime();

			this.selectNationality.removeAttribute("disabled"); // 民族
			this.inputUsedName.removeAttribute("disabled");// 曾用名
			this.inputAge.removeAttribute("disabled");// 年龄
			this.selectBloodType.removeAttribute("disabled"); // 血型
			this.inputHeight.removeAttribute("disabled");// 身高
			this.inputWeight.removeAttribute("disabled");// 体重
			this.inputHAddress.removeAttribute("disabled"); // 户籍地址
			this.inputHPostcode.removeAttribute("disabled"); // 户籍邮编
			this.select1.removeAttribute("disabled"); // 省、自治区、直辖市
			this.select2.removeAttribute("disabled"); // 地市区
			this.select3.removeAttribute("disabled"); // 县区

			// added
			this.staff.user.usedName = this.inputUsedName.value.trim(); // 曾用名
			this.staff.user.age = this.inputAge.value.trim(); // 年龄
			this.staff.user.weight = this.inputWeight.value.trim(); // 体重
			this.staff.user.height = this.inputHeight.value.trim(); // 身高
			this.staff.user.nation = this.selectNationality.value; // 民族
			this.staff.user.bloodType = this.selectBloodType.value; // 血型
			this.staff.user.householdAddress = this.inputHAddress.value.trim(); // 户籍地址
			this.staff.user.householdPostcode = this.inputHPostcode.value
					.trim(); // 户籍邮编
			this.staff.user.province = this.select1.value; // 省、自治区、直辖市
			this.staff.user.city = this.select2.value; // 地区、市、区
			this.staff.user.county = this.select3.value; // 县、区、镇

			this.staff.staffCode = this.inputStaffNumber.value.trim();
			this.staff.professionalTitle = this.selectProfessionalTitle.options[this.selectWorktype.selectedIndex].value;
			this.staff.workPhoneNumber = this.inputWorkphone.value.trim();
			this.staff.workFaxNumber = this.inputWorkfax.value.trim(); // -
			this.staff.workMobileNumber = this.inputWorkmobile.value.trim();
			this.staff.workEmail = this.inputWorkemail.value.trim();
			this.staff.officeLocation = Utils.stringify(this.inputWorkloc.value
					.trim()); // -
			this.staff.onBoardingDate = this.enrolldate.fetchDateString();
			this.staff.workType = this.selectWorktype.options[this.selectWorktype.selectedIndex].value;
			this.staff.lastupdate = Utils.getCurrentDateTime();
			this.staff.owner = this.options.ownerId;
			// console.log(this.staff);
			$("#progressbar").show();
			var newone = 0;
			if (this.staff.id == null) {
				newone = 1;
			}
			var that = this;
			$.post(service.api(13, this.options.ownerId), {
				staff : JSON.stringify(this.staff),
				newone : newone,
			}).complete(
					function(data) {
						that.options.parent.listViewPane.refresh();
						that.hide();
						$("#progressbar").hide();
					});

		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new NewStaffDialog(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);