package com.cloudibpm.controller;

import com.alibaba.fastjson.JSON;
import com.aliyuncs.exceptions.ClientException;
import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.message.AliyunMessageBlo;
import com.cloudibpm.blo.om.organization.OrganizationBlo;
import com.cloudibpm.blo.om.user.WfLoginHistoryBlo;
import com.cloudibpm.blo.om.user.WfStaffBlo;
import com.cloudibpm.blo.om.user.WfUserBlo;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.encode.MD5Util;
import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.cloudibpm.redis.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.Date;

/**
 * This service is an authentication service for authenticating a user as a
 * valid user for a company.
 * 
 * @author Dahai Cao
 *
 */

/**
 * <pre>
 * Status code: positive is success code, negative is error code
 *  
 * 2: email sent successfully
 * 1: successful
 * 0: user does't exist;
 * -1: password incorrect; 
 * -2: be not a staff in all organizations;  
 * -3: be a staff in some organization but has no authorizations in the organization yet; 
 * -4: invalid login (might be hacker login);
 * -5: other error
 * -6: email does not exists
 * -7: sent email failed
 * -8: security code checking failed.
 * -9: password expired;
 * -10: this account has been banned permanently;
 * 
 * </pre>
 * 
 * @author Dahai Cao on 2016-05-20
 * 
 */
@RestController
@RequestMapping("/service0")
public class AuthenticateController {
	private final WfUserBlo wfUserBlo;
	private final WfStaffBlo wfStaffBlo;
	private final BuildtimeIDGenerator buildtimeIDGenerator;
	private final WfLoginHistoryBlo wfLoginHistoryBlo;
	private final OrganizationBlo organizationBlo;
	private final AliyunMessageBlo aliyunMessageBlo;
	private final RedisUtil redisUtil;
	

	@Autowired
	public AuthenticateController(WfUserBlo wfUserBlo, WfStaffBlo wfStaffBlo, BuildtimeIDGenerator buildtimeIDGenerator, WfLoginHistoryBlo wfLoginHistoryBlo, OrganizationBlo organizationBlo, AliyunMessageBlo aliyunMessageBlo, RedisUtil redisUtil) {
		this.wfUserBlo = wfUserBlo;
		this.wfStaffBlo = wfStaffBlo;
		this.buildtimeIDGenerator = buildtimeIDGenerator;
		this.wfLoginHistoryBlo = wfLoginHistoryBlo;
		this.organizationBlo = organizationBlo;
		this.aliyunMessageBlo = aliyunMessageBlo;
		this.redisUtil = redisUtil;
	}

	@RequestMapping(value = "/api0", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public ServiceResult authenticate(String username, String sessiondata, String password, String token, String[] details) throws Exception {
		return wfUserBlo.authenticate(username, sessiondata, password, token, details, 0);
	}
	
	@RequestMapping(value = "/api2", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public ServiceResult loginByVerifyCode(String mobile, String sessiondata, String code, String token, String[] details) throws Exception{
//		try {
//			Login login = null;
//			if (check(mobile, sessiondata, code, token)) {
//				// return Logged in Staff or -10, -9, -1, 0, or 1;
//				login = wfUserBlo.checkMobile(mobile);
//				if (login.getUser() != null) {
//					// return Logged in Staff or -2 or -3;
//					login = wfStaffBlo.getStaffShips(login);
//				} else {
//					login = new Login(StatusCode.PASSWORD_INCORRECT, null, null);
//				}
//			} else { // -4: invalid login (might be hacker login);
//				login = new Login(StatusCode.INVALID_LOGIN, null, null);
//			}
//			if (login.getStatusCode() == StatusCode.BANNED || login.getStatusCode() == StatusCode.NOT_A_STAFF || login.getStatusCode() == StatusCode.NO_AUTHORIZATION
//					|| login.getStatusCode() == StatusCode.INVALID_LOGIN || login.getStatusCode() == StatusCode.PASSWORD_INCORRECT || login.getStatusCode() == StatusCode.SUCCESS) {
//				UserLoginHistory history = new UserLoginHistory();
//				history.setId(buildtimeIDGenerator.getNewRunTimeID());
//				if (login.getUser() != null)
//					history.setFk_User(login.getUser().getId());
//				history.setLastLoginTime(new Date());
//				history.setStatusCode(login.getStatusCode());
//				history.setDevice(details[0]);
//				history.setDeviceType(details[1]);
//				history.setDeviceManufacturer(details[2]);
//				history.setOs(details[3]);
//				history.setOsType(details[4]);
//				history.setOsManufacturer(details[5]);
//				history.setBrowser(details[6]);
//				history.setBrowserType(details[7]);
//				history.setBrowserVersion(details[8]);
//				history.setBrowserManufacturer(details[9]);
//				history.setIPv4(details[10]);
//				history.setIPv6(details[11]);
//				history.setCountry(details[12]);
//				history.setProvince(details[13]);
//				history.setCity(details[14]);
//				history.setTown(details[15]);
//				history.setSessionId(details[16]);
//				if (login.getStatusCode() == StatusCode.SUCCESS) {
//					history.setLoginDescription(StringEscapeUtils.escapeJava(mobile + "登录成功"));
//				} else if (login.getStatusCode() == StatusCode.PASSWORD_INCORRECT) {
//					history.setLoginDescription(StringEscapeUtils.escapeJava(mobile + "尝试登录，但密码不正确"));
////				} else if (login.getStatusCode() == -2) {
////					history.setLoginDescription(StringEscapeUtils.escapeJava(username + "尝试登录，因不是任何公司的职员而无法登录"));
////				} else if (login.getStatusCode() == -3) {
////					history.setLoginDescription(
////							StringEscapeUtils.escapeJava(username + "尝试登录，是某公司职员，但因还没有该公司的授权而无法登录"));
//				} else if (login.getStatusCode() == StatusCode.INVALID_LOGIN) {
//					history.setLoginDescription(StringEscapeUtils.escapeJava(mobile + "无效登录，可能是黑客在尝试登录"));
//				} else if (login.getStatusCode() == StatusCode.PASSWORD_ERROR) {
//					history.setLoginDescription(StringEscapeUtils.escapeJava(mobile + "密码已经过期，请重新设置密码"));
//				} else if (login.getStatusCode() == StatusCode.BANNED) {
//					history.setLoginDescription(StringEscapeUtils.escapeJava(mobile + "无效登录，该账号已经被永久封禁"));
//				}
//				wfLoginHistoryBlo.createLoginHistory(history);
//				if (login.getUser() != null && login.getStatusCode() == StatusCode.SUCCESS) {
//					wfUserBlo.updateUserLoginCounting(login.getUser().getId());
//				}
//				if (login.getStatusCode() != StatusCode.SUCCESS) {
//					login.setUser(null);
//					login.setStaffships(null);
//				}
//			}
//			return login;
//		} catch (Exception e) {
//			e.printStackTrace();
//			return new Login(); // return 0:user does't exist;
//		}
		return wfUserBlo.authenticate(mobile, sessiondata, code, token, details, 1);
	}

	private boolean check(String username, String sessiondata, String password, String token) {
		String sessiondata1 = MD5Util.getMD5(token + username + "cloudbpm" + password + DateUtility.getCurrentDate());
		if (sessiondata1.equals(sessiondata)) {
			return true;
		}
		return false;

	}

	@RequestMapping(value = "/api1", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public void logout(String datetime, String sessionid) {
		try {
			Date logouttime = DateUtility.parseDatetime(datetime);
			wfLoginHistoryBlo.updateLogoutTime(logouttime, sessionid);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	/**
	 * check user permissions 
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/api3", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public String checkUserClient(String uid) throws Exception {
		int result = wfUserBlo.checkStatus(uid);
		return "{\"status\": \""+result+"\"}";
	}
	
	/**
	 * check organization or user permissions 
	 * @param uid
	 * @param prsn
	 * @param oid
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/api4", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public String checkPermissions(String uid, String prsn, String oid) throws Exception {

		int result = organizationBlo.checkStatus(uid, prsn, oid);
		return "{\"status\": \""+result+"\"}";
	}

	@PostMapping("/api5")
	public String sendCode(String phoneNumber) throws ClientException {
		return wfUserBlo.sendCode(phoneNumber);
	}

	/**
	 * 校验验证码并做登录操作，若无该用户进行注册操作（app）
	 * @param phoneNumber
	 * @param code
	 * @return
	 * @throws Exception
	 */
	@PostMapping("/api6")
	public String checkCode(String phoneNumber,String code) throws Exception {
		return wfUserBlo.checkCode(phoneNumber, code);
	}

	/**
	 * 更新用户昵称（手机APP使用）
	 * @param userId
	 * @param name
	 * @return
	 */
	@PostMapping("/api7")
	public String updateUsedName(String userId,String name) throws SQLException {
		return wfUserBlo.updateUsedName(userId, name);
	}

	/**
	 * 浏览器验证码注册
	 * @param phoneNumber 手机号
	 * @param code 验证码
	 * @return
	 */
	@PostMapping("/api8")
	public ServiceResult registerUserByCodeForPC(String phoneNumber,String code) throws Exception{
		return wfUserBlo.registerUserByCodeForPC(phoneNumber, code);
	}

	/**
	 * 刷新session （若过期进行自动登录）
	 * @param userName
	 * @param userId
	 * @param sessionId
	 * @return
	 * @throws Exception
	 */
	@PostMapping("/api9")
	public ServiceResult refreshSession(String userName,String sessionId) throws Exception {
		ServiceResult serviceResult = wfUserBlo.refreshSession(userName, sessionId);
		System.out.println(JSON.toJSONString(serviceResult));
		return serviceResult;
	}

	@PostMapping("/api10")
	public ServiceResult registerUser(String code,String phoneNumber,String name,String orgId,String password) throws Exception {
		return wfUserBlo.registerUser(code, phoneNumber, name, orgId,password);
	}

}
