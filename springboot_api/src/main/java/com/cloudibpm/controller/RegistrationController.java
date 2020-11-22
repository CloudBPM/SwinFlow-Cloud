package com.cloudibpm.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.cloudibpm.blo.om.organization.OrganizationBlo;
import com.cloudibpm.blo.om.organization.RegistrateOrganizationBlo;
import com.cloudibpm.core.organization.Organization;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

/**
 * This service is registration organization service in cloud BPM system.
 * 
 * @author Dahai Cao
 * @date 20160722
 */
@RestController
@RequestMapping("/service3")
public class RegistrationController {
	private final RegistrateOrganizationBlo registerNewOrganization;
	private final OrganizationBlo organizationBlo;

	@Autowired
	public RegistrationController(RegistrateOrganizationBlo registerNewOrganization, OrganizationBlo organizationBlo) {
		this.registerNewOrganization = registerNewOrganization;
		this.organizationBlo = organizationBlo;
	}

	@RequestMapping(value = "/api0", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public String registerCompany(String strOrg) {
		try {
			if (strOrg != null) {
				// String orgn = Base64Util.dencode(strOrg);
				// to do: remove noise ...
//				ObjectMapper mapper = new ObjectMapper();
				// mapper.configure(SerializationConfig.Feature.INDENT_OUTPUT,
				// Boolean.TRUE);
				// 设置输入时忽略在JSON字符串中存在但Java对象实际没有的属性
//				mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
				// 禁止使用int代表Enum的order()來反序列化Enum,非常危險
				// mapper.configure(DeserializationConfig.Feature.FAIL_ON_NUMBERS_FOR_ENUMS,
				// true);
				JSONObject jsonObject= JSON.parseObject(strOrg);
				String date=jsonObject.getString("registrationDate");
				DateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
				jsonObject.put("registrationDate",format1.parse(date).getTime());
				String result = "";
				Organization org = jsonObject.toJavaObject(Organization.class);
				if (org.getEmail() != "" && org.getEmail() != null) {
					result = checkDuplicatedOrgEmail(org.getEmail());
					if(result.contains("\"emailExisting\": \"Y\"")){
						return result;
					}
				}
				
				String regCode  = org.getRegistrationCode();
				if(!StringUtils.isEmpty(regCode)){
					result = checkDuplicatedOrgCode(regCode); 
					if(result.contains("\"OrgRegCodeExisting\": \"Y\"")){
						return result;
					}
				}

				// System.out.println(org);
				registerNewOrganization.registerNewOrganization(org);
			} else {
				return "{\"status\": \"0\"}"; // failed
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "{\"status\": \"1\"}"; // success
	}

	@RequestMapping(value = "/api1", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public String checkDuplicatedOrgName(String orgname) {
		try {
			if (orgname != null) {
				boolean existing = organizationBlo
						.checkDuplicatedOrganizationName(StringEscapeUtils.escapeJava(orgname));
				String exist = "N";
				if (existing)
					exist = "Y";
				return "{\"status\": \"1\", \"existing\": \"" + exist + "\"}"; // failed
			} else {
				return "{\"status\": \"0\"}"; // failed
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "{\"status\": \"1\"}"; // success
	}

	@RequestMapping(value = "/api2", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public String checkDuplicatedOrgEmail(String email) {
		try {
			if (email != null) {
				boolean existing = organizationBlo
						.checkDuplicatedOrganizationEmail(StringEscapeUtils.escapeJava(email));
				String exist = "N";
				if (existing)
					exist = "Y";
				return "{\"status\": \"1\", \"emailExisting\": \"" + exist + "\"}"; // failed
			} else {
				return "{\"status\": \"0\"}"; // failed
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "{\"status\": \"1\"}"; // success
	}
	
	@RequestMapping(value = "/api3", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public String checkDuplicatedOrgCode(String regCode) {
		try {
			if (regCode != null) {
				boolean existing = organizationBlo
						.checkDuplicatedOrganizationCode(StringEscapeUtils.escapeJava(regCode));
				String exist = "N";
				if (existing)
					exist = "Y";
				return "{\"status\": \"1\", \"OrgRegCodeExisting\": \"" + exist + "\"}"; // failed
			} else {
				return "{\"status\": \"0\"}"; // failed
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "{\"status\": \"0\"}"; // success
	}

}
