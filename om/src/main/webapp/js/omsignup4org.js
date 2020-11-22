/**
 * 
 */
;
(function($, window, document, undefined) {
	var pluginName = "omOrganizationSignup";
	var defaults = {
		title : "",
	};

	var SignupPanel = function(element, options) {
		this.element = element;
		this.options = $.extend({
			title : "",
			greeting : "",
			user : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.title = options.title;
		this.init(options);
	};

	SignupPanel.prototype.init = function(options) {
		var containerPanel = document.createElement("DIV");
		this.element.appendChild(containerPanel);
		containerPanel.className = "container-fluid";

		var panel1 = document.createElement("DIV");
		containerPanel.appendChild(panel1);
		panel1.className = "col-xs-12 col-sm-12 col-md-3 col-lg-3";

		var panel2 = document.createElement("DIV");
		containerPanel.appendChild(panel2);
		panel2.className = "col-xs-12 col-sm-12 col-md-6 col-lg-6";

		// 公司基本信息
		this.initBasicInfoPane(panel2, options);

		// 工商登记注册信息
		this.initAdInfoPane(panel2, options);

		// 企业联系信息
		this.initContactInfoPane(panel2, options);

		var panel3 = document.createElement("DIV");
		containerPanel.appendChild(panel3);
		panel3.className = "col-xs-12 col-sm-12 col-md-3 col-lg-3";
		
		var dialog = $(panel2).alertBox({
			id : options.id,
		});
		this.messageBox = dialog.data("alertBox");
		
	};

	SignupPanel.prototype.initBasicInfoPane = function(parent, options) {
		var panelDiv = document.createElement("DIV");
		parent.appendChild(panelDiv);
		panelDiv.className = "panel panel-default";

		var panelHeadDiv = document.createElement("DIV");
		panelDiv.appendChild(panelHeadDiv);
		panelHeadDiv.className = "panel-heading";
		panelHeadDiv.innerHTML = "基本信息";

		var panelBodyDiv = document.createElement("DIV");
		panelDiv.appendChild(panelBodyDiv);
		panelBodyDiv.className = "panel-body";

		var panelForm = document.createElement("Form");
		panelBodyDiv.appendChild(panelForm);
		panelForm.className = "form-horizontal";

		// organization name;
		this.gDiv1 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv1);
		this.gDiv1.className = "form-group";
		this.gDiv1.id = "OrgName";

		var label1 = document.createElement("Label");
		this.gDiv1.appendChild(label1);
		label1.className = "col-sm-3 control-label";
		label1.innerHTML = "* 中文全称";

		this.colDIV1 = document.createElement("DIV");
		this.gDiv1.appendChild(this.colDIV1);
		this.colDIV1.className = "col-sm-9";
		this.colDIV1.id = "inputbody1";

		this.inputvalue1 = document.createElement("INPUT");
		this.colDIV1.appendChild(this.inputvalue1);
		this.inputvalue1.className = "form-control";
		this.inputvalue1.type = "text";
		this.inputvalue1.id = "inputOrgName";
		this.inputvalue1.setAttribute("placeholder", "工商局注册全名");
		this.inputvalue1.addEventListener("blur", this, false);

		this.inputvalueSpan1 = document.createElement("SPAN");
		this.colDIV1.appendChild(this.inputvalueSpan1);

		// abbr. name
		this.gDiv2 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv2);
		this.gDiv2.className = "form-group";
		this.gDiv2.id = "fm4";

		var label2 = document.createElement("Label");
		this.gDiv2.appendChild(label2);
		label2.className = "col-sm-3 control-label";
		label2.innerHTML = "* 中文简称";
		label2.setAttribute("for", "inputOrgAbbrName");

		this.colDIV2 = document.createElement("DIV");
		this.gDiv2.appendChild(this.colDIV2);
		this.colDIV2.className = "col-sm-9";
		this.colDIV2.id = "inputbody4";

		this.inputvalue2 = document.createElement("INPUT");
		this.colDIV2.appendChild(this.inputvalue2);
		this.inputvalue2.className = "form-control";
		this.inputvalue2.type = "text";
		this.inputvalue2.id = "inputOrgAbbrName";
		this.inputvalue2.setAttribute("placeholder", "简称");
		
		this.inputvalueSpan2 = document.createElement("SPAN");
		this.colDIV2.appendChild(this.inputvalueSpan2);

		// address
		this.gDiv3 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv3);
		this.gDiv3.className = "form-group";
		this.gDiv3.id = "address";

		var label3 = document.createElement("Label");
		this.gDiv3.appendChild(label3);
		label3.className = "col-sm-3 control-label";
		label3.innerHTML = "* 省市区";
		label3.setAttribute("for", "province");

		this.colDIV31 = document.createElement("DIV");
		this.gDiv3.appendChild(this.colDIV31);
		this.colDIV31.className = "col-sm-3";
		this.colDIV31.id = "inputbody5";

		this.select1 = document.createElement("SELECT");
		this.colDIV31.appendChild(this.select1);
		this.select1.id = "province";
		this.select1.className = "form-control";
		
		this.inputvalueSpan4 = document.createElement("SPAN");
		this.colDIV31.appendChild(this.inputvalueSpan4);

		var colDIV32 = document.createElement("DIV");
		this.gDiv3.appendChild(colDIV32);
		colDIV32.className = "col-sm-3";
		colDIV32.id = "inputbody6";

		this.select2 = document.createElement("SELECT");
		colDIV32.appendChild(this.select2);
		this.select2.id = "city";
		this.select2.className = "form-control";

		var colDIV33 = document.createElement("DIV");
		this.gDiv3.appendChild(colDIV33);
		colDIV33.className = "col-sm-3";
		colDIV33.id = "inputbody7";

		this.select3 = document.createElement("SELECT");
		colDIV33.appendChild(this.select3);
		this.select3.id = "county";
		this.select3.className = "form-control";

		(function($) {

			$('#address').distpicker({
				autoSelect : false,
				province : "---- 所在省/市 ----",
				city : "---- 所在市/区 ----",
				district : "---- 所在区/县 ----",
			});

		})(jQuery);

		// address details
		this.gDiv34 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv34);
		this.gDiv34.className = "form-group";
		this.gDiv34.id = "addressdetail";

		var label34 = document.createElement("Label");
		this.gDiv34.appendChild(label34);
		label34.className = "col-sm-3 control-label";
		label34.innerHTML = "* 详细地址";
		label34.setAttribute("for", "addressdetails");

		this.colDIV34 = document.createElement("DIV");
		this.gDiv34.appendChild(this.colDIV34);
		this.colDIV34.className = "col-sm-9";
		this.colDIV34.id = "inputbody5";

		this.inputvalue3 = document.createElement("INPUT");
		this.colDIV34.appendChild(this.inputvalue3);
		this.inputvalue3.className = "form-control";
		this.inputvalue3.type = "text";
		this.inputvalue3.id = "addressdetails";
		this.inputvalue3.setAttribute("placeholder", "详细地址");

		// post code
		this.gDiv4 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv4);
		this.gDiv4.className = "form-group";
		this.gDiv4.id = "fm6";

		var label4 = document.createElement("Label");
		this.gDiv4.appendChild(label4);
		label4.className = "col-sm-3 control-label";
		label4.innerHTML = "* 邮编";
		label4.setAttribute("for", "inputOrgPostcode");

		this.colDIV4 = document.createElement("DIV");
		this.gDiv4.appendChild(this.colDIV4);
		this.colDIV4.className = "col-sm-9";
		this.colDIV4.id = "inputbody6";



		this.inputvalue4 = document.createElement("INPUT");
		this.colDIV4.appendChild(this.inputvalue4);
		this.inputvalue4.className = "form-control";
		this.inputvalue4.type = "text";
		this.inputvalue4.id = "inputOrgPostcode";
		this.inputvalue4.setAttribute("placeholder", "邮政编码");
		
		this.inputvalueSpan5 = document.createElement("SPAN");
		this.colDIV4.appendChild(this.inputvalueSpan5);

		// 
		this.gDiv5 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv5);
		this.gDiv5.className = "form-group";
		this.gDiv5.id = "fm7";

		var label5 = document.createElement("Label");
		this.gDiv5.appendChild(label5);
		label5.className = "col-sm-3 control-label";
		label5.innerHTML = "* 法定代表人";
		label5.setAttribute("for", "inputOrgRepresentative");

		this.colDIV5 = document.createElement("DIV");
		this.gDiv5.appendChild(this.colDIV5);
		this.colDIV5.className = "col-sm-9";
		this.colDIV5.id = "inputbody7";


		this.inputvalue5 = document.createElement("INPUT");
		this.colDIV5.appendChild(this.inputvalue5);
		this.inputvalue5.className = "form-control";
		this.inputvalue5.type = "text";
		this.inputvalue5.id = "inputOrgRepresentative";
		this.inputvalue5.setAttribute("placeholder", "法定代表人");
		
		this.inputvalueSpan6 = document.createElement("SPAN");
		this.colDIV5.appendChild(this.inputvalueSpan6);

		// phone
		this.gDiv6 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv6);
		this.gDiv6.className = "form-group";
		this.gDiv6.id = "fm8";

		var label6 = document.createElement("Label");
		this.gDiv6.appendChild(label6);
		label6.className = "col-sm-3 control-label";
		label6.innerHTML = "* 联系电话";
		label6.setAttribute("for", "inputOrgPhoneNumber");

		this.colDIV6 = document.createElement("DIV");
		this.gDiv6.appendChild(this.colDIV6);
		this.colDIV6.className = "col-sm-9";
		this.colDIV6.id = "inputbody8";



		this.inputvalue6 = document.createElement("INPUT");
		this.colDIV6.appendChild(this.inputvalue6);
		this.inputvalue6.className = "form-control";
		this.inputvalue6.type = "text";
		this.inputvalue6.id = "inputOrgPhoneNumber";
		this.inputvalue6.setAttribute("placeholder", "10 88886666");
		
		this.inputvalueSpan7 = document.createElement("SPAN");
		this.colDIV6.appendChild(this.inputvalueSpan7);

		$(this.inputvalue6).intlTelInput({
			autoFormat : true,
			autoHideDialCode : false,
			defaultCountry : "cn",
			nationalMode : true,
			// numberType: "MOBILE",
			onlyCountries : [ 'cn' ],
			responsiveDropdown : true,
			utilsScript : "../api/plugins/intltel/js/utils.js"
		});

		// fax
		var gDiv7 = document.createElement("DIV");
		panelForm.appendChild(gDiv7);
		gDiv7.className = "form-group";
		gDiv7.id = "fm9";

		var label7 = document.createElement("Label");
		gDiv7.appendChild(label7);
		label7.className = "col-sm-3 control-label";
		label7.innerHTML = "传真";
		label7.setAttribute("for", "inputOrgFaxNumber");

		var colDIV7 = document.createElement("DIV");
		gDiv7.appendChild(colDIV7);
		colDIV7.className = "col-sm-9";
		colDIV7.id = "inputbody9";

		this.inputvalue7 = document.createElement("INPUT");
		colDIV7.appendChild(this.inputvalue7);
		this.inputvalue7.className = "form-control";
		this.inputvalue7.type = "text";
		this.inputvalue7.id = "inputOrgFaxNumber";
		this.inputvalue7.setAttribute("placeholder", "10 88886666");

		$(this.inputvalue7).intlTelInput({
			autoFormat : true,
			autoHideDialCode : false,
			defaultCountry : "cn",
			nationalMode : true,
			// numberType: "MOBILE",
			onlyCountries : [ 'cn' ],
			responsiveDropdown : true,
			utilsScript : "../api/plugins/intltel/js/utils.js"
		});

		// email
		this.gDiv8 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv8);
		this.gDiv8.className = "form-group";
		this.gDiv8.id = "fm10";

		var label8 = document.createElement("Label");
		this.gDiv8.appendChild(label8);
		label8.className = "col-sm-3 control-label";
		label8.innerHTML = "* 电子邮箱";
		label8.setAttribute("for", "inputOrgEmail");

		this.colDIV8 = document.createElement("DIV");
		this.gDiv8.appendChild(this.colDIV8);
		this.colDIV8.className = "col-sm-9";
		this.colDIV8.id = "inputbody10";



		this.inputvalue8 = document.createElement("INPUT");
		this.colDIV8.appendChild(this.inputvalue8);
		this.inputvalue8.className = "form-control";
		this.inputvalue8.type = "mail";
		this.inputvalue8.id = "inputOrgEmail";
		this.inputvalue8.setAttribute("placeholder", "电子邮箱");
		
		this.inputvalueSpan8 = document.createElement("SPAN");
		this.colDIV8.appendChild(this.inputvalueSpan8);

		// industrial category
		this.gDiv9 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv9);
		this.gDiv9.className = "form-group";
		this.gDiv9.id = "fm11";

		var label9 = document.createElement("Label");
		this.gDiv9.appendChild(label9);
		label9.className = "col-sm-3 control-label";
		label9.innerHTML = "* 所属行业大类";
		label9.setAttribute("for", "selectOrgBusinessCategory");

		this.colDIV9 = document.createElement("DIV");
		this.gDiv9.appendChild(this.colDIV9);
		this.colDIV9.className = "col-sm-9";
		this.colDIV9.id = "inputbody11";



		this.select4 = document.createElement("SELECT");
		this.colDIV9.appendChild(this.select4);
		
		this.inputvalueSpan9 = document.createElement("SPAN");
		this.colDIV9.appendChild(this.inputvalueSpan9);
		
		this.select4.id = "selectOrgBusinessCategory";
		this.select4.className = "form-control";
		this.select4.addEventListener("change", this, false);
		// 此列表来自国家统计局2013年国民经济行业分类(GB/T 4754-2011)
		this.addOptions(this.select4, "- 请选择 -", "0", 0);
		this.addOptions(this.select4, category["A"], "A", 1);
		this.addOptions(this.select4, category["B"], "B", 2);
		this.addOptions(this.select4, category["C"], "C", 3);
		this.addOptions(this.select4, category["D"], "D", 4);
		this.addOptions(this.select4, category["E"], "E", 5);
		this.addOptions(this.select4, category["F"], "F", 6);
		this.addOptions(this.select4, category["G"], "G", 7);
		this.addOptions(this.select4, category["H"], "H", 8);
		this.addOptions(this.select4, category["I"], "I", 9);
		this.addOptions(this.select4, category["J"], "J", 10);
		this.addOptions(this.select4, category["K"], "K", 11);
		this.addOptions(this.select4, category["L"], "L", 12);
		this.addOptions(this.select4, category["M"], "M", 13);
		this.addOptions(this.select4, category["N"], "N", 14);
		this.addOptions(this.select4, category["O"], "O", 15);
		this.addOptions(this.select4, category["P"], "P", 16);
		this.addOptions(this.select4, category["Q"], "Q", 17);
		this.addOptions(this.select4, category["R"], "R", 18);
		this.addOptions(this.select4, category["S"], "S", 19);
		this.addOptions(this.select4, category["T"], "T", 20);

		// industry
		this.gDiv10 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv10);
		this.gDiv10.className = "form-group";
		this.gDiv10.id = "fm12";

		var labe10 = document.createElement("Label");
		this.gDiv10.appendChild(labe10);
		labe10.className = "col-sm-3 control-label";
		labe10.innerHTML = "* 所属行业";
		labe10.setAttribute("for", "selectOrgBusinessType");

		this.colDIV10 = document.createElement("DIV");
		this.gDiv10.appendChild(this.colDIV10);
		this.colDIV10.className = "col-sm-9";
		this.colDIV10.id = "inputbody12";



		this.select5 = document.createElement("SELECT");
		this.colDIV10.appendChild(this.select5);
		
		this.inputvalueSpan10 = document.createElement("SPAN");
		this.colDIV10.appendChild(this.inputvalueSpan10);
		this.select5.id = "selectOrgBusinessType";
		this.select5.className = "form-control";
		// 此列表来自国家统计局2013年国民经济行业分类(GB/T 4754-2011)
		this.addOptions1(this.select5, "- 请选择 -", "0", 0);
		this.addOptions1(this.select5, categorydtails["A01"], "A01", 1);
		this.addOptions1(this.select5, categorydtails["A02"], "A02", 2);
		this.addOptions1(this.select5, categorydtails["A03"], "A03", 3);
		this.addOptions1(this.select5, categorydtails["A04"], "A04", 4);
		this.addOptions1(this.select5, categorydtails["A05"], "A05", 5);

		this.addOptions1(this.select5, categorydtails["B06"], "B06", 6);
		this.addOptions1(this.select5, categorydtails["B07"], "B06", 7);
		this.addOptions1(this.select5, categorydtails["B08"], "B08", 8);
		this.addOptions1(this.select5, categorydtails["B09"], "B09", 9);
		this.addOptions1(this.select5, categorydtails["B10"], "B10", 10);
		this.addOptions1(this.select5, categorydtails["B11"], "B11", 11);
		this.addOptions1(this.select5, categorydtails["B12"], "B12", 12);

		this.addOptions1(this.select5, categorydtails["C13"], "C13", 13);
		this.addOptions1(this.select5, categorydtails["C14"], "C14", 14);
		this.addOptions1(this.select5, categorydtails["C15"], "C15", 15);
		this.addOptions1(this.select5, categorydtails["C16"], "C16", 16);
		this.addOptions1(this.select5, categorydtails["C17"], "C17", 17);
		this.addOptions1(this.select5, categorydtails["C18"], "C18", 18);
		this.addOptions1(this.select5, categorydtails["C19"], "C19", 19);
		this.addOptions1(this.select5, categorydtails["C20"], "C20", 20);
		this.addOptions1(this.select5, categorydtails["C21"], "C21", 21);
		this.addOptions1(this.select5, categorydtails["C22"], "C22", 22);
		this.addOptions1(this.select5, categorydtails["C23"], "C23", 23);
		this.addOptions1(this.select5, categorydtails["C24"], "C24", 24);
		this.addOptions1(this.select5, categorydtails["C25"], "C25", 25);
		this.addOptions1(this.select5, categorydtails["C26"], "C26", 26);
		this.addOptions1(this.select5, categorydtails["C27"], "C27", 27);
		this.addOptions1(this.select5, categorydtails["C28"], "C28", 28);
		this.addOptions1(this.select5, categorydtails["C29"], "C29", 29);
		this.addOptions1(this.select5, categorydtails["C30"], "C30", 30);
		this.addOptions1(this.select5, categorydtails["C31"], "C31", 31);
		this.addOptions1(this.select5, categorydtails["C32"], "C32", 32);
		this.addOptions1(this.select5, categorydtails["C33"], "C33", 33);
		this.addOptions1(this.select5, categorydtails["C34"], "C34", 34);
		this.addOptions1(this.select5, categorydtails["C35"], "C35", 35);
		this.addOptions1(this.select5, categorydtails["C36"], "C36", 36);
		this.addOptions1(this.select5, categorydtails["C37"], "C37", 37);
		this.addOptions1(this.select5, categorydtails["C38"], "C38", 38);
		this.addOptions1(this.select5, categorydtails["C39"], "C39", 39);
		this.addOptions1(this.select5, categorydtails["C40"], "C40", 40);
		this.addOptions1(this.select5, categorydtails["C41"], "C41", 41);
		this.addOptions1(this.select5, categorydtails["C42"], "C42", 42);
		this.addOptions1(this.select5, categorydtails["C43"], "C43", 43);

		this.addOptions1(this.select5, categorydtails["D44"], "D44", 44);
		this.addOptions1(this.select5, categorydtails["D45"], "D45", 45);
		this.addOptions1(this.select5, categorydtails["D46"], "D46", 46);

		this.addOptions1(this.select5, categorydtails["E47"], "E47", 47);
		this.addOptions1(this.select5, categorydtails["E48"], "E48", 48);
		this.addOptions1(this.select5, categorydtails["E49"], "E49", 49);
		this.addOptions1(this.select5, categorydtails["E50"], "E50", 50);

		this.addOptions1(this.select5, categorydtails["F51"], "F51", 51);
		this.addOptions1(this.select5, categorydtails["F52"], "F52", 52);

		this.addOptions1(this.select5, categorydtails["G53"], "G53", 53);
		this.addOptions1(this.select5, categorydtails["G54"], "G54", 54);
		this.addOptions1(this.select5, categorydtails["G55"], "G54", 55);
		this.addOptions1(this.select5, categorydtails["G56"], "G56", 56);
		this.addOptions1(this.select5, categorydtails["G57"], "G57", 57);
		this.addOptions1(this.select5, categorydtails["G58"], "G58", 58);
		this.addOptions1(this.select5, categorydtails["G59"], "G59", 59);
		this.addOptions1(this.select5, categorydtails["G60"], "G60", 60);

		this.addOptions1(this.select5, categorydtails["H61"], "H61", 61);
		this.addOptions1(this.select5, categorydtails["H62"], "H62", 62);

		this.addOptions1(this.select5, categorydtails["I63"], "I63", 63);
		this.addOptions1(this.select5, categorydtails["I64"], "I64", 64);
		this.addOptions1(this.select5, categorydtails["I65"], "I65", 65);

		this.addOptions1(this.select5, categorydtails["J66"], "J66", 66);
		this.addOptions1(this.select5, categorydtails["J67"], "J67", 67);
		this.addOptions1(this.select5, categorydtails["J68"], "J68", 68);
		this.addOptions1(this.select5, categorydtails["J69"], "J69", 69);

		this.addOptions1(this.select5, categorydtails["K70"], "K70", 70);

		this.addOptions1(this.select5, categorydtails["L71"], "L71", 71);
		this.addOptions1(this.select5, categorydtails["L72"], "L72", 72);

		this.addOptions1(this.select5, categorydtails["M73"], "M73", 73);
		this.addOptions1(this.select5, categorydtails["M74"], "M74", 74);
		this.addOptions1(this.select5, categorydtails["M75"], "M75", 75);

		this.addOptions1(this.select5, categorydtails["N76"], "N76", 76);
		this.addOptions1(this.select5, categorydtails["N77"], "N77", 77);
		this.addOptions1(this.select5, categorydtails["N78"], "N78", 78);

		this.addOptions1(this.select5, categorydtails["O79"], "O79", 79);
		this.addOptions1(this.select5, categorydtails["O80"], "O80", 80);
		this.addOptions1(this.select5, categorydtails["O81"], "O81", 81);

		this.addOptions1(this.select5, categorydtails["P82"], "P82", 82);

		this.addOptions1(this.select5, categorydtails["Q83"], "Q83", 83);
		this.addOptions1(this.select5, categorydtails["Q84"], "Q84", 84);

		this.addOptions1(this.select5, categorydtails["R85"], "R85", 85);
		this.addOptions1(this.select5, categorydtails["R86"], "R86", 86);
		this.addOptions1(this.select5, categorydtails["R87"], "R87", 87);
		this.addOptions1(this.select5, categorydtails["R88"], "R88", 88);
		this.addOptions1(this.select5, categorydtails["R89"], "R89", 89);

		this.addOptions1(this.select5, categorydtails["S90"], "S90", 90);
		this.addOptions1(this.select5, categorydtails["S91"], "S90", 91);
		this.addOptions1(this.select5, categorydtails["S92"], "S90", 92);
		this.addOptions1(this.select5, categorydtails["S93"], "S90", 93);
		this.addOptions1(this.select5, categorydtails["S94"], "S90", 94);
		this.addOptions1(this.select5, categorydtails["S95"], "S90", 95);

		this.addOptions1(this.select5, categorydtails["T96"], "T96", 96);

		// /
	};

	SignupPanel.prototype.addOptions = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		parent.options.add(option, index);
	};

	SignupPanel.prototype.addOptions1 = function(parent, title, value, index) {
		var option = document.createElement("option");
		option.text = title;
		option.value = value;
		option.style.display = "none";
		parent.options.add(option, index);
	};

	SignupPanel.prototype.initAdInfoPane = function(parent, options) {
		var panelDiv = document.createElement("DIV");
		parent.appendChild(panelDiv);
		panelDiv.className = "panel panel-info";

		var panelHeadDiv = document.createElement("DIV");
		panelDiv.appendChild(panelHeadDiv);
		panelHeadDiv.className = "panel-heading";
		panelHeadDiv.innerHTML = "工商登记信息";

		var panelBodyDiv = document.createElement("DIV");
		panelDiv.appendChild(panelBodyDiv);
		panelBodyDiv.className = "panel-body";

		var panelForm = document.createElement("Form");
		panelBodyDiv.appendChild(panelForm);
		panelForm.className = "form-horizontal";

		// organization unified code
		this.gDiv11 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv11);
		this.gDiv11.className = "form-group";
		this.gDiv11.id = "fm13";

		var label11 = document.createElement("Label");
		this.gDiv11.appendChild(label11);
		label11.className = "col-sm-3 control-label";
		label11.innerHTML = "* 统一社会信用代码";
		label11.setAttribute("for", "inputOrgRegID");

		this.colDIV11 = document.createElement("DIV");
		this.gDiv11.appendChild(this.colDIV11);
		this.colDIV11.className = "col-sm-9";
		this.colDIV11.id = "inputbody10";

		this.inputvalue9 = document.createElement("INPUT");
		this.colDIV11.appendChild(this.inputvalue9);
		this.inputvalue9.className = "form-control";
		this.inputvalue9.type = "text";
		this.inputvalue9.id = "inputOrgRegID";
		this.inputvalue9.setAttribute("placeholder", "统一社会信用代码");
		
		this.inputvalueSpan11 = document.createElement("SPAN");
		this.colDIV11.appendChild(this.inputvalueSpan11);

		// registration date
		this.gDiv12 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv12);
		this.gDiv12.className = "form-group";
		this.gDiv12.id = "fm13";

		var label12 = document.createElement("Label");
		this.gDiv12.appendChild(label12);
		label12.className = "col-sm-3 control-label";
		label12.innerHTML = "* 成立日期";
		label12.setAttribute("for", "inputOrgRegDate");

		this.colDIV12 = document.createElement("DIV");
		this.gDiv12.appendChild(this.colDIV12);
		this.colDIV12.className = "col-sm-9";
		this.colDIV12.id = "inputbody11";



		var inputvalue10 = document.createElement("div");
		this.colDIV12.appendChild(inputvalue10);
		inputvalue10.className = "form-inline";
		inputvalue10.id = "inputOrgRegDate";

		var fieldset = document.createElement("fieldset");
		inputvalue10.appendChild(fieldset);
		fieldset.className = "birthdayPicker";

		$(inputvalue10).birthdayPicker({
			"defaultDate" : "2016, 08, 06",
			"maxYear" : "2025",
			"maxAge" : 100,
			"monthFormat" : "long",
			"dateFormat" : "bigEndian",
		});
		
		this.inputvalueSpan12 = document.createElement("SPAN");
		this.colDIV12.appendChild(this.inputvalueSpan12);

	};

	SignupPanel.prototype.initContactInfoPane = function(parent, options) {
		var panelDiv = document.createElement("DIV");
		parent.appendChild(panelDiv);
		panelDiv.className = "panel panel-warning";

		var panelHeadDiv = document.createElement("DIV");
		panelDiv.appendChild(panelHeadDiv);
		panelHeadDiv.className = "panel-heading";
		panelHeadDiv.innerHTML = "联系人";

		var panelBodyDiv = document.createElement("DIV");
		panelDiv.appendChild(panelBodyDiv);
		panelBodyDiv.className = "panel-body";

		var panelForm = document.createElement("Form");
		panelBodyDiv.appendChild(panelForm);
		panelForm.className = "form-horizontal";

		// contact information
		this.gDiv13 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv13);
		this.gDiv13.className = "form-group";
		this.gDiv13.id = "fm13";

		var label13 = document.createElement("Label");
		this.gDiv13.appendChild(label13);
		label13.className = "col-sm-3 control-label";
		label13.innerHTML = "* 手机验证";
		label13.setAttribute("for", "mobile");

		this.gDiv131 = document.createElement("DIV");
		this.gDiv13.appendChild(this.gDiv131);
		this.gDiv131.className = "col-sm-9";

		var table1 = document.createElement("Table");
		this.gDiv131.appendChild(table1);
		table1.style.width = "100%";

		var tr1 = document.createElement("Tr");
		table1.appendChild(tr1);

		var td1 = document.createElement("Td");
		tr1.appendChild(td1);

		this.colDIV13 = document.createElement("DIV");
		td1.appendChild(this.colDIV13);
		this.colDIV13.id = "inputbody12";


		this.inputvalue10 = document.createElement("INPUT");
		this.colDIV13.appendChild(this.inputvalue10);
		this.inputvalue10.className = "form-control";
		this.inputvalue10.type = "text";
		this.inputvalue10.id = "mobile";
		this.inputvalue10.setAttribute("placeholder", "请输入手机号");
		
		this.inputvalueSpan3 = document.createElement("SPAN");
		this.gDiv131.appendChild(this.inputvalueSpan3);

		var td2 = document.createElement("Td");
		tr1.appendChild(td2);
		td2.style.paddingLeft = "2px";
		td2.style.valign = "top";

		this.button1 = document.createElement("Button");
		td2.appendChild(this.button1);
		this.button1.type = "button";
		this.button1.className = "btn btn-default btn-primary btn-block";
		this.button1.id = "sendMessage";
		this.button1.innerHTML = "发送";
		this.button1.addEventListener("click", this, false);

		// verification code.
		this.gDiv14 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv14);
		this.gDiv14.className = "form-group";
		this.gDiv14.id = "fm14";

		var label14 = document.createElement("Label");
		this.gDiv14.appendChild(label14);
		label14.className = "col-sm-3 control-label";
		label14.innerHTML = "* 验证码";
		label14.setAttribute("for", "verifyCode");

		this.colDIV14 = document.createElement("DIV");
		this.gDiv14.appendChild(this.colDIV14);
		this.colDIV14.className = "col-sm-9";
		this.colDIV14.id = "inputbody13";



		this.inputvalue11 = document.createElement("INPUT");
		this.colDIV14.appendChild(this.inputvalue11);
		this.inputvalue11.className = "form-control";
		this.inputvalue11.type = "text";
		this.inputvalue11.id = "verifyCode";
		this.inputvalue11.setAttribute("placeholder", "请输入验证码");
		
		this.inputvalueSpan13 = document.createElement("SPAN");
		this.colDIV14.appendChild(this.inputvalueSpan13);

		// read agreement
		this.gDiv15 = document.createElement("DIV");
		panelForm.appendChild(this.gDiv15);
		this.gDiv15.className = "form-group";
		this.gDiv15.id = "fm15";

		this.gColDiv15 = document.createElement("DIV");
		this.gDiv15.appendChild(this.gColDiv15);
		this.gColDiv15.className = "checkbox col-sm-offset-2 col-sm-10";

		var gLabel15 = document.createElement("label");
		this.gColDiv15.appendChild(gLabel15);

		this.inputvalue12 = document.createElement("INPUT");
		gLabel15.appendChild(this.inputvalue12);
		this.inputvalue12.type = "checkbox";
		this.inputvalue12.id = "policy";
		this.inputvalue12.checked = true;
		this.inputvalue12.addEventListener("change", this, false);
		
		this.inputvalueSpan14 = document.createElement("SPAN");
		this.gColDiv15.appendChild(this.inputvalueSpan14);

		gLabel15.appendChild(document.createTextNode("我已阅读并同意轩琦科技"));

		var agreeA = document.createElement("A");
		gLabel15.appendChild(agreeA);
		agreeA.href = "agreement.html";
		agreeA.target = "_blank";
		agreeA.innerText = "《用户服务协议及隐私政策》";

		// OK button
		var gDiv16 = document.createElement("DIV");
		panelForm.appendChild(gDiv16);
		gDiv16.className = "form-group";
		gDiv16.id = "fm16";

		var gColDiv16 = document.createElement("DIV");
		gDiv16.appendChild(gColDiv16);
		gColDiv16.className = "col-sm-12";

		this.gOKButton = document.createElement("Button");
		gColDiv16.appendChild(this.gOKButton);
		this.gOKButton.className = "btn btn-default btn-lg btn-primary btn-block";
		this.gOKButton.innerText = "注册";
		this.gOKButton.id = "submitOK";
		this.gOKButton.name = "submitOK";
		this.gOKButton.addEventListener("click", this, false);
	};

	SignupPanel.prototype.handleEvent = function(e) {
		switch (e.type) {
		case "click":
			this.doClick(e);
			break;
		case "blur":
			this.doBlur(e);
			break;
		case "change":
			this.doChange(e);
			break;
		}
	};

	SignupPanel.prototype.doClick = function(e) {
		if (e.target == this.button1) {
			var mobile = $("#mobile").val();
			if (mobile == null || mobile == "") {
				this.gDiv13.classList.add("has-error");
				this.inputvalueSpan3.style.display = "block";
				this.inputvalueSpan3.className = "help-block";
				this.inputvalueSpan3.setAttribute("validity", false);
				this.inputvalueSpan3.innerHTML = "请输入手机号";
				return false;
			} else if (!this.isPhoneNum(mobile)) {
				this.gDiv13.classList.add("has-error");
				this.inputvalueSpan3.style.display = "block";
				this.inputvalueSpan3.className = "help-block";
				this.inputvalueSpan3.setAttribute("validity", false);
				this.inputvalueSpan3.innerHTML = "请输入正确的手机号";
				return false;
			} else {
				this.gDiv13.classList.remove("has-error");
				this.inputvalueSpan3.style.display = "none";
				this.inputvalueSpan3.innerHTML = "";
			}
			var btn = document.getElementById("sendMessage");
			var time = 60;// 定义时间变量。用于倒计时用
			// 定义一个定时器；
			var timer = setInterval(function() {// /开启定时器。函数内执行
				btn.disabled = true;
				btn.innerText = time + "秒后重新发送"; // 点击发生后，按钮的文本内容变成之前定义好的时间值。
				time--;// 时间值自减
				if (time == 0) { // 判断,当时间值小于等于0的时候
					btn.innerText = '重新发送验证码'; // 其文本内容变成……点击重新发送……
					btn.disabled = false;
					clearInterval(timer); // 清除定时器
				}
			}, 1000);

			this.doSendMessage(mobile);
		} else if (e.target == this.gOKButton) {
			e.preventDefault();
			var msg = "";

			var inputOrgName = $("#inputOrgName").val();
			msg = "请输入中文全称";
			if (!this.paramVerify(inputOrgName)) {
				this.gDiv1.classList.add("has-error");
				this.inputvalueSpan1.style.display = "block";
				this.inputvalueSpan1.className = "help-block";
				this.inputvalueSpan1.setAttribute("validity", false);
				this.inputvalueSpan1.innerHTML = "请输入中文全称";
				$("#inputOrgName").focus();
				return false;
			} else {
				this.gDiv1.classList.remove("has-error");
				this.inputvalueSpan1.style.display = "none";
				this.inputvalueSpan1.innerHTML = "";
			}

			var inputOrgAbbrName = $("#inputOrgAbbrName").val();
			msg = "请输入中文简称";
			if (this.paramVerify(inputOrgAbbrName)) {
				this.gDiv2.classList.remove("has-error");
				this.inputvalueSpan2.style.display = "none";
				this.inputvalueSpan2.innerHTML = "";
			} else {
				this.gDiv2.classList.add("has-error");
				this.inputvalueSpan2.style.display = "block";
				this.inputvalueSpan2.className = "help-block";
				this.inputvalueSpan2.setAttribute("validity", false);
				this.inputvalueSpan2.innerHTML = msg;
				$("#inputOrgAbbrName").focus();
				return false;
			}

			var province = $("#province").val();
			var city = $("#city").val();
			var county = $("#county").val();
			var addressdetails = $("#addressdetails").val();
			var address = province + city + county + addressdetails;
			msg = "请选择地址";

			if (this.paramVerify(province) && this.paramVerify(city)) {
				this.gDiv3.classList.remove("has-error");
				this.inputvalueSpan4.style.display = "none";
				this.inputvalueSpan4.innerHTML = "";
			} else {
				this.gDiv3.classList.add("has-error");
				this.inputvalueSpan4.style.display = "block";
				this.inputvalueSpan4.className = "help-block";
				this.inputvalueSpan4.setAttribute("validity", false);
				this.inputvalueSpan4.innerHTML = msg;
				$("#province").focus();
				return false;
			}

			var inputOrgPostcode = $("#inputOrgPostcode").val();
			msg = "请输入邮编";

			if (this.paramVerify(inputOrgPostcode)) {
				this.gDiv4.classList.remove("has-error");
				this.inputvalueSpan5.style.display = "none";
				this.inputvalueSpan5.innerHTML = "";
			} else {
				this.gDiv4.classList.add("has-error");
				this.inputvalueSpan5.style.display = "block";
				this.inputvalueSpan5.className = "help-block";
				this.inputvalueSpan5.setAttribute("validity", false);
				this.inputvalueSpan5.innerHTML = msg;
				$("#inputOrgPostcode").focus();
				return false;
			}
			var inputOrgRepresentative = $("#inputOrgRepresentative").val();
			msg = "请输入法定代表人";

			if (this.paramVerify(inputOrgRepresentative)) {
				this.gDiv5.classList.remove("has-error");
				this.inputvalueSpan6.style.display = "none";
				this.inputvalueSpan6.innerHTML = "";
			} else {
				this.gDiv5.classList.add("has-error");
				this.inputvalueSpan6.style.display = "block";
				this.inputvalueSpan6.className = "help-block";
				this.inputvalueSpan6.setAttribute("validity", false);
				this.inputvalueSpan6.innerHTML = msg;
				$("#inputOrgRepresentative").focus();
				return false;
			}

			var inputOrgPhoneNumber = $("#inputOrgPhoneNumber").val();
			msg = "请输入联系电话";

			if (this.paramVerify(inputOrgPhoneNumber)) {
				this.gDiv6.classList.remove("has-error");
				this.inputvalueSpan7.style.display = "none";
				this.inputvalueSpan7.innerHTML = "";
			} else {
				this.gDiv6.classList.add("has-error");
				this.inputvalueSpan7.style.display = "block";
				this.inputvalueSpan7.className = "help-block";
				this.inputvalueSpan7.setAttribute("validity", false);
				this.inputvalueSpan7.innerHTML = msg;
				$("#inputOrgPhoneNumber").focus();
				return false;
			}

			var email = $("#inputOrgEmail").val();
			msg = "请填写邮箱";

			if (this.paramVerify(email)) {
				this.gDiv8.classList.remove("has-error");
				this.inputvalueSpan8.style.display = "none";
				this.inputvalueSpan8.innerHTML = "";
			} else {
				this.gDiv8.classList.add("has-error");
				this.inputvalueSpan8.style.display = "block";
				this.inputvalueSpan8.className = "help-block";
				this.inputvalueSpan8.setAttribute("validity", false);
				this.inputvalueSpan8.innerHTML = msg;
				$("#inputOrgEmail").focus();
				return false;
			}

			var selectOrgBusinessCategory = $("#selectOrgBusinessCategory")
					.val();
			msg = "请选择行业大类";

			if (this.paramVerify(selectOrgBusinessCategory)) {
				this.gDiv9.classList.remove("has-error");
				this.inputvalueSpan9.style.display = "none";
				this.inputvalueSpan9.innerHTML = "";
			} else {
				this.gDiv9.classList.add("has-error");
				this.inputvalueSpan9.style.display = "block";
				this.inputvalueSpan9.className = "help-block";
				this.inputvalueSpan9.setAttribute("validity", false);
				this.inputvalueSpan9.innerHTML = msg;
				$("#selectOrgBusinessCategory").focus();
				return false;
			}

			var selectOrgBusinessType = $("#selectOrgBusinessType").val();
			msg = "请选择行业";

			if (this.paramVerify(selectOrgBusinessType)) {
				this.gDiv10.classList.remove("has-error");
				this.inputvalueSpan10.style.display = "none";
				this.inputvalueSpan10.innerHTML = "";
			} else {
				this.gDiv10.classList.add("has-error");
				this.inputvalueSpan10.style.display = "block";
				this.inputvalueSpan10.className = "help-block";
				this.inputvalueSpan10.setAttribute("validity", false);
				this.inputvalueSpan10.innerHTML = msg;
				$("#selectOrgBusinessType").focus();
				return false;
			}

			var inputOrgRegCode = $("#inputOrgRegID").val();
			msg = "请输入社会信用代码";

			if (this.paramVerify(inputOrgRegCode)) {
				this.gDiv11.classList.remove("has-error");
				this.inputvalueSpan11.style.display = "none";
				this.inputvalueSpan11.innerHTML = "";
			} else {
				this.gDiv11.classList.add("has-error");
				this.inputvalueSpan11.style.display = "block";
				this.inputvalueSpan11.className = "help-block";
				this.inputvalueSpan11.setAttribute("validity", false);
				this.inputvalueSpan11.innerHTML = msg;
				$("#inputOrgRegID").focus();
				return false;
			}

			var registrationDate = $("input[name='inputOrgRegDate_birthDay']").val();
			msg = "请选择成立日期";

			if (this.paramVerify(registrationDate)) {
				this.gDiv12.classList.remove("has-error");
				this.inputvalueSpan12.style.display = "none";
				this.inputvalueSpan12.innerHTML = "";
			} else {
				this.gDiv12.classList.add("has-error");
				this.inputvalueSpan12.style.display = "block";
				this.inputvalueSpan12.className = "help-block";
				this.inputvalueSpan12.setAttribute("validity", false);
				this.inputvalueSpan12.innerHTML = msg;
				$("input[name='divOrgRegDate_birthDay']").focus();
				return false;
			}

			var mobile = $("#mobile").val();
			msg = "请输入手机号";
			if (this.paramVerify(mobile)) {
				this.gDiv13.classList.remove("has-error");
				this.inputvalueSpan3.style.display = "none";
				this.inputvalueSpan3.innerHTML = "";
			} else {
				this.gDiv13.classList.add("has-error");
				this.inputvalueSpan3.style.display = "block";
				this.inputvalueSpan3.className = "help-block";
				this.inputvalueSpan3.setAttribute("validity", false);
				this.inputvalueSpan3.innerHTML = msg;
				$("#mobile").focus();
				return false;
			}

			var verifyCode = $("#verifyCode").val();
			if (verifyCode == "" || verifyCode == null) {
				this.gDiv14.classList.add("has-error");
				this.inputvalueSpan13.style.display = "block";
				this.inputvalueSpan13.className = "help-block";
				this.inputvalueSpan13.setAttribute("validity", false);
				this.inputvalueSpan13.innerHTML = "请输入验证码";
				return false;
			} else {
				this.gDiv14.classList.remove("has-error");
				this.inputvalueSpan13.style.display = "none";
				this.inputvalueSpan13.innerHTML = "";
			}
			var policy = $("#policy").is(":checked");
			msg = "阅读相关协议后，才可点击确定";
			if (policy) {
				this.gDiv15.classList.remove("has-error");
				this.inputvalueSpan14.style.display = "none";
				this.inputvalueSpan14.innerHTML = "";
				this.gOKButton.disabled = false;
			} else {
				this.gDiv15.classList.add("has-error");
				this.inputvalueSpan14.style.display = "block";
				this.inputvalueSpan14.className = "help-block";
				this.inputvalueSpan14.setAttribute("validity", false);
				this.inputvalueSpan14.innerHTML = msg;
				return false;
			}

			
			var that = this;
			var org = new Organization();
			org.name = Utils.stringify($.trim(inputOrgName));

			org.abbrLocal = Utils.stringify($.trim(inputOrgAbbrName));
			org.address = Utils.stringify($.trim(address));
			org.province = Utils.stringify($.trim(province));
			org.city = Utils.stringify($.trim(city));
			org.county = Utils.stringify($.trim(county));
			org.postcode = $.trim(inputOrgPostcode); // 
			org.representative = Utils.stringify($.trim(inputOrgRepresentative));
			org.phoneNumber = $.trim(inputOrgPhoneNumber);
			org.faxNumber = $.trim($("#inputOrgFaxNumber").val());
			org.email = $.trim($("#inputOrgEmail").val());
			org.postCode = $.trim($("#inputOrgPostcode").val());
			org.businessCategory = $.trim(selectOrgBusinessCategory);
			org.businessType = selectOrgBusinessType;
			org.registrationCode = $.trim(inputOrgRegCode);
			org.registrationDate = registrationDate;

			
			$.post("registrationService", {
			api : 2,
			code : verifyCode,
			mobile:mobile,
			}, function(data) {
				if (data.status == "200") {
					that.shownMessage(data.msg);
					that.register(org);
				} else {
					that.gDiv14.classList.add("has-error");
					that.inputvalueSpan13.style.display = "block";
					that.inputvalueSpan13.className = "help-block";
					that.inputvalueSpan13.setAttribute("validity", false);

					var time = 10;// 定义时间变量。用于倒计时用
					var timer = null;// 定义一个定时器；
					timer = setInterval(function() {// /开启定时器。函数内执行
						that.gOKButton.disabled = true;
						that.inputvalueSpan13.innerHTML = "您的验证码不正确,"+time + "秒后请重新输入"; // 点击发生后，按钮的文本内容变成之前定义好的时间值。
						time--;// 时间值自减
						if (time == 0) { // 判断,当时间值小于等于0的时候
							that.inputvalueSpan13.classList.remove("has-error");
							that.inputvalueSpan13.style.display = "none";
							that.inputvalueSpan13.innerHTML = "";
							that.gOKButton.disabled = false;
							clearInterval(timer); // 清除定时器
						}
					}, 1000)
				}
			});
		}
	};
	
	
	SignupPanel.prototype.register = function(org) {
		var s = JSON.stringify(org);
		var str = Base64.encode(s);
		var str2 = Base64.decode(str);
		var that = this;
		$.post(
			"registrationService",
			{
				api : 3,
				strOrg : s,
			},
			function(data) {
				if (data.status == "1") {
					if (data.emailExisting == "Y") {
						that.gDiv8.classList.add("has-error");
						that.inputvalueSpan8.style.display = "block";
						that.inputvalueSpan8.className = "help-block";
						that.inputvalueSpan8.setAttribute(
								"validity", false);
						that.inputvalueSpan8.innerHTML = "您注册的官方邮箱已经存在，请换一个邮箱。";
						$("#inputOrgName").focus();
						/* refreshShuffle(); */
						return false;
					} else if (data.mobileExisting == "Y") {

					} else if (data.orgRegIdExisting == "Y") {
						that.gDiv11.classList.add("has-error");
						that.inputvalueSpan11.style.display = "block";
						that.inputvalueSpan11.className = "help-block";
						that.inputvalueSpan11.setAttribute("validity", false);
						that.inputvalueSpan11.innerHTML = "您的社会信用代码已被注册过了";
						$("#inputOrgRegID").focus();
						return false;
					} else {
//						that.gDiv8.classList
//								.remove("has-error");
//						that.inputvalueSpan8.style.display = "none";
//						that.inputvalueSpan8.innerHTML = "";
						that.shownMessage("您的资料已经成功注册到轩琦科技！我们需对您的请等待审核，我们会尽快联系您！谢谢！"); // hide
					}
				} else {
					that.shownMessage("注册失败");
				}
			});
	}
	

	SignupPanel.prototype.paramVerify = function(param) {
		if (param != null && param != "" && param != 0) {
			return true;
		}
		return false;
	}

	SignupPanel.prototype.doSendMessage = function(mobile) {
		$.post("registrationService", {
			api : 1,
			mobile : mobile,
		}, function(data) {
			if (data.status == 1) {

			}
			$("#progressbar").hide();
		});
	}

	SignupPanel.prototype.shownMessage = function(msg) {
		this.messageBox.show(1, msg);
	};

	SignupPanel.prototype.isPhoneNum = function(mobile) {
		var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
		if (!myreg.test(mobile)) {
			return false;
		} else {
			return true;
		}
	};

	SignupPanel.prototype.doBlur = function(e) {
		if (e.target == this.inputvalue1) {

			var orgName = $("#inputOrgName").val();
			if (orgName == "") {
				this.gDiv1.classList.add("has-error");
				this.inputvalueSpan1.style.display = "block";
				this.inputvalueSpan1.className = "help-block";
				this.inputvalueSpan1.setAttribute("validity", false);
				this.inputvalueSpan1.innerHTML = "请输入中文全称";
				this.inputvalue1.focus();
				return;
			} else if (orgName.match(/[^\u4E00-\u9FA5]/g) != ""
					&& null != orgName.match(/[^\u4E00-\u9FA5]/g)) {
				this.gDiv1.classList.add("has-error");
				this.inputvalueSpan1.style.display = "block";
				this.inputvalueSpan1.className = "help-block";
				this.inputvalueSpan1.setAttribute("validity", false);
				this.inputvalueSpan1.innerHTML = "请输入中文,不能使用英文数字或其他特殊符号";
				this.inputvalue1.focus();
				return;
			} else {
				this.gDiv1.classList.remove("has-error");
				this.inputvalueSpan1.style.display = "none";
				this.inputvalueSpan1.innerHTML = "";
			}

			var that = this;
			$.get(
				"registrationService",
				{
					api : 4,
					orgname : orgName,
				},
				function(data) {
					if (data.status == "1") {
						if (data.existing == "Y") {
							that.gDiv1.classList.add("has-error");
							that.inputvalueSpan1.style.display = "block";
							that.inputvalueSpan1.className = "help-block";
							that.inputvalueSpan1.setAttribute(
									"validity", false);
							that.inputvalueSpan1.innerHTML = "您注册的企事业单位、公司名称已经被注册过了";
							$("#inputOrgName").focus();
							return false;
						}
					}
				});
		}
	};

	SignupPanel.prototype.doChange = function(e) {
		if (e.target == this.select4) {
//			this.formgroup2 = document.getElementById("fm2");
//			var thatFormgroup2 = this.formgroup2;
//			this.inputbody2 = document.getElementById("inputbody2");
//			var thatInputbody2 = this.inputbody2;
//
//			this.inputvalueSpan2 = document.createElement("SPAN");
//			var thatInputvalueSpan2 = this.inputvalueSpan2;
//			this.inputbody2.appendChild(this.inputvalueSpan2);

			var bc = $("#selectOrgBusinessCategory").val();
			var btype = document.getElementById("selectOrgBusinessType");
			if (bc != 0) {
				if (btype.options.length > 1) {
					for (var i = 0; i < btype.options.length; i++) {
						btype.options[i].style.display = "none";
					}
					btype.selectedIndex = 0;
					for (var i = 0; i < btype.options.length; i++) {
						if (btype.options[i].value.indexOf(bc) >= 0) {
							if (btype.selectedIndex == 0) {
								btype.selectedIndex = i;
							}
							btype.options[i].style.display = "";
						}
					}

				}
			}
		} else if (e.target == this.inputvalue12) {
			if (e.target.checked) {
				this.gOKButton.disabled = false;
			} else {
				this.gOKButton.disabled = true;
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new SignupPanel(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};
})(jQuery, window, document);