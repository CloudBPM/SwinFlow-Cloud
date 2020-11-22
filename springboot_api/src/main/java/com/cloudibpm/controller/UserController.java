package com.cloudibpm.controller;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.om.authorization.WfGroupMemberBlo;
import com.cloudibpm.blo.om.job.JobAssignmentBlo;
import com.cloudibpm.blo.om.organization.DepartmentBlo;
import com.cloudibpm.blo.om.organization.OrganizationBlo;
import com.cloudibpm.blo.om.organization.PositionBlo;
import com.cloudibpm.blo.om.user.WfLoginHistoryBlo;
import com.cloudibpm.blo.om.user.WfStaffBlo;
import com.cloudibpm.blo.om.user.WfUserBlo;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.user.StaffListPage;
import com.cloudibpm.core.user.User;
import com.cloudibpm.core.user.UserLoginHistoryPage;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.core.util.encode.MD5Util;
import com.cloudibpm.core.util.file.FileUtil;
import com.cloudibpm.eso.om.authorization.AutorityGroupEso;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * <pre>
 * http://localhost:8080/user/page/login?userId=concretePage&location=Varanasi
 * </pre>
 *
 * @author Caodahai
 */
@RestController
@RequestMapping("/service5")
public class UserController {
    private final WfStaffBlo wfStaffBlo;
    private final WfUserBlo wfUserBlo;
    private final OrganizationBlo organizationBlo;
    private final JobAssignmentBlo jobAssignmentBlo;
    private final PositionBlo positionBlo;
    private final DepartmentBlo departmentBlo;
    private final BuildtimeIDGenerator buildtimeIDGenerator;
    private final WfLoginHistoryBlo wfLoginHistoryBlo;
    private final AutorityGroupEso autorityGroupEso;
    private final WfGroupMemberBlo wfGroupMemberBlo;

    @Autowired
    public UserController(WfStaffBlo wfStaffBlo, WfUserBlo wfUserBlo, OrganizationBlo organizationBlo, JobAssignmentBlo jobAssignmentBlo, PositionBlo positionBlo, DepartmentBlo departmentBlo, BuildtimeIDGenerator buildtimeIDGenerator, WfLoginHistoryBlo wfLoginHistoryBlo, AutorityGroupEso autorityGroupEso, WfGroupMemberBlo wfGroupMemberBlo) {
        this.wfStaffBlo = wfStaffBlo;
        this.wfUserBlo = wfUserBlo;
        this.organizationBlo = organizationBlo;
        this.jobAssignmentBlo = jobAssignmentBlo;
        this.positionBlo = positionBlo;
        this.departmentBlo = departmentBlo;
        this.buildtimeIDGenerator = buildtimeIDGenerator;
        this.wfLoginHistoryBlo = wfLoginHistoryBlo;
        this.autorityGroupEso = autorityGroupEso;
        this.wfGroupMemberBlo = wfGroupMemberBlo;
    }

    /**
     * Find all users without any condition from repository.
     *
     * @return User array
     */
    @RequestMapping(value = "/api0", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public StaffListPage getAllStaffs(String condition, String ownerid, int pageno, int pagesize) {
        try {
            return wfStaffBlo.searchStaff(condition, ownerid, pageno, pagesize);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api1", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Staff searchStaffforAdding(String idnumber,String numbertype, String ownerid) {
        try {
            User user=null;
            switch(numbertype){
                case "0":
                    user=wfUserBlo.getUserByMobile(idnumber);
                    break;
                case "1":
                    user = wfUserBlo.getUserByIDNumber(idnumber);
                    break;
            }
            if (user != null) {
                Staff staff = wfStaffBlo.checkStaffforUser(user.getId(), ownerid);
                if (staff == null) {
                    staff = new Staff();
                }
                staff.setUser(user);
                return staff;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api2", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public Staff saveStaff(String strStaff, String newone) {
        try {
            if (newone.equals("1")) {
                JSONObject obj = new JSONObject(strStaff);
                Staff staff = parseJson(obj);
                wfStaffBlo.createStaff(staff);
                return staff; // success
            } else {
                JSONObject obj = new JSONObject(strStaff);
                Staff staff = parseJson(obj);
                wfStaffBlo.modifyStaff(staff);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private Staff parseJson(JSONObject obj) throws Exception {
        Staff staff = new Staff();
        if (!obj.isNull("user")) {
            JSONObject uObj = obj.getJSONObject("user");
            User user = new User();
            if (uObj.isNull("id")) {
                user.setId(buildtimeIDGenerator.getNewBuildTimeID());
            } else {
                user.setId(uObj.getString("id"));
            }
            if (!uObj.isNull("name")) {
                user.setName(uObj.getString("name"));
            }
            if (!uObj.isNull("givenname")) {
                user.setGivenname(uObj.getString("givenname"));
            }
            if (!uObj.isNull("surname")) {
                user.setSurname(uObj.getString("surname"));
            }
            if (!uObj.isNull("gender")) {
                user.setGender(uObj.getString("gender"));
            }
            if (!uObj.isNull("birthday")) {
                user.setBirthday(DateUtility.parseDate(uObj.getString("birthday")));
            }
            if (!uObj.isNull("idType")) {
                user.setIdType(uObj.getString("idType"));
            }
            if (!uObj.isNull("idNumber")) {
                user.setIdNumber(uObj.getString("idNumber"));
            }
            if (!uObj.isNull("address")) {
                user.setAddress(uObj.getString("address"));
            }
            if (!uObj.isNull("postcode")) {
                user.setPostcode(uObj.getString("postcode"));
            }
            if (!uObj.isNull("registrationDate")) {
                user.setRegistrationDate(DateUtility.parseDatetime(uObj.getString("registrationDate")));
            }
            if (!uObj.isNull("email")) {
                user.setEmail(uObj.getString("email"));
            }
            if (!uObj.isNull("mobile")) {
                user.setMobile(uObj.getString("mobile"));
            }
            if (!uObj.isNull("lastupdate")) {
                user.setLastupdate(DateUtility.parseDatetime(uObj.getString("lastupdate")));
            }
            // added
            if (!uObj.isNull("usedName")) {
                user.setUsedName(uObj.getString("usedName"));
            }
            if (!uObj.isNull("age")) {
                String s = uObj.getString("age");
                if (!s.trim().equals("")) {
                    user.setAge(Integer.parseInt(s));
                }
            }
            if (!uObj.isNull("weight")) {
                String s = uObj.getString("weight");
                if (!s.trim().equals("")) {
                    user.setWeight(Integer.parseInt(s));
                }
            }
            if (!uObj.isNull("height")) {
                String s = uObj.getString("height");
                if (!s.trim().equals("")) {
                    user.setHeight(Integer.parseInt(s));
                }
            }
            if (!uObj.isNull("country")) {
                user.setCountry(uObj.getString("country"));
            }
            if (!uObj.isNull("province")) {
                user.setProvince(uObj.getString("province"));
            }
            if (!uObj.isNull("city")) {
                user.setCity(uObj.getString("city"));
            }
            if (!uObj.isNull("county")) {
                user.setCounty(uObj.getString("county"));
            }
            if (!uObj.isNull("householdAddress")) {
                user.setHouseholdAddress(uObj.getString("householdAddress"));
            }
            if (!uObj.isNull("householdPostcode")) {
                user.setHouseholdPostcode(uObj.getString("householdPostcode"));
            }
            if (!uObj.isNull("bloodType")) {
                user.setBloodType(uObj.getString("bloodType"));
            }
            if (!uObj.isNull("nation")) {
                user.setNation(uObj.getString("nation"));
            }
            if (uObj.isNull("id")) { // 如果没有ID，则意味着新用户。
                String newpass = "12345";// PassGenerator.getInstance().getPassword(8);
                // send email to notify...
                // SMTPSender.sendEmail(user.getEmail(), "轩琦科技 - 用户注册确认邮件",
                // "您的新密码已经生成：" + newpass);
                // encrypt password using MD5 before storage
                String newpass1 = MD5Util.getMD5(newpass);
                user.setPasswd(newpass1);
                user.setPasswdExpirationDate(null);// never expire
                wfUserBlo.createNewUser(user);
            }
            staff.setUser(user);
        }
        if (obj.isNull("id")) {
            staff.setId(buildtimeIDGenerator.getNewBuildTimeID());
        } else {
            staff.setId(obj.getString("id"));
        }
        if (!obj.isNull("staffCode")) {
            staff.setStaffCode(obj.getString("staffCode"));
        } else {
            staff.setStaffCode(buildtimeIDGenerator.getNewBuildTimeCode());
        }
        if (!obj.isNull("professionalTitle")) {
            staff.setProfessionalTitle(obj.getString("professionalTitle"));
        }
        if (!obj.isNull("workPhoneNumber")) {
            staff.setWorkPhoneNumber(obj.getString("workPhoneNumber"));
        }
        if (!obj.isNull("workMobileNumber")) {
            staff.setWorkMobileNumber(obj.getString("workMobileNumber"));
        }
        if (!obj.isNull("workFaxNumber")) {
            staff.setWorkFaxNumber(obj.getString("workFaxNumber"));
        }
        if (!obj.isNull("workEmail")) {
            staff.setWorkEmail(obj.getString("workEmail"));
        }
        if (!obj.isNull("officeLocation")) {
            staff.setOfficeLocation(obj.getString("officeLocation"));
        }
        if (!obj.isNull("onBoardingDate")) {
            staff.setOnBoardingDate(DateUtility.parseDate(obj.getString("onBoardingDate")));
        }
        if (!obj.isNull("workType")) {
            staff.setWorkType(obj.getInt("workType"));
        }
        if (!obj.isNull("owner")) {
            staff.setOwner(obj.getString("owner"));
        }
        if (!obj.isNull("lastupdate")) {
            staff.setLastupdate(DateUtility.parseDatetime(obj.getString("lastupdate")));
        }
        return staff;
    }

    @RequestMapping(value = "/api3", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String existsUserName(String username) {
        try {
            if (wfUserBlo.existsUsername(username))
                return "1";
            else
                return "0";
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "0";
    }

    @RequestMapping(value = "/api4", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String updateStaff(String staffs) {
        try {
            List<Staff> stfs = new ArrayList<Staff>();
            JSONArray staffArray = new JSONArray(staffs);
            for (int i = 0; i < staffArray.length(); i++) {
                JSONObject object = (JSONObject) staffArray.get(i);
                stfs.add(parseJson1(object));
            }
            wfStaffBlo.updateStaffs(stfs);
            return "{\"status\": \"1\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"-5\"}"; // failed
        }

    }

    private Staff parseJson1(JSONObject obj) throws Exception {
        Staff staff = new Staff();
        if (!obj.isNull("user")) {
            JSONObject uObj = obj.getJSONObject("user");
            User user = new User();
            if (!uObj.isNull("id")) {
                user.setId(uObj.getString("id"));
            }
            if (!uObj.isNull("name")) {
                user.setName(uObj.getString("name"));
            }
            if (!uObj.isNull("givenname")) {
                user.setGivenname(uObj.getString("givenname"));
            }
            if (!uObj.isNull("surname")) {
                user.setSurname(uObj.getString("surname"));
            }
            if (!uObj.isNull("gender")) {
                user.setGender(uObj.getString("gender"));
            }
            if (!uObj.isNull("birthday")) {
                user.setBirthday(DateUtility.parseDate(uObj.getString("birthday")));
            }
            if (!uObj.isNull("idType")) {
                user.setIdType(uObj.getString("idType"));
            }
            if (!uObj.isNull("idNumber")) {
                user.setIdNumber(uObj.getString("idNumber"));
            }
            if (!uObj.isNull("address")) {
                user.setAddress(uObj.getString("address"));
            }
            if (!uObj.isNull("postcode")) {
                user.setPostcode(uObj.getString("postcode"));
            }
            if (!uObj.isNull("registrationDate")) {
                user.setRegistrationDate(DateUtility.parseDatetime(uObj.getString("registrationDate")));
            }
            if (!uObj.isNull("email")) {
                user.setEmail(uObj.getString("email"));
            }
            if (!uObj.isNull("mobile")) {
                user.setMobile(uObj.getString("mobile"));
            }
            if (!uObj.isNull("lastupdate")) {
                user.setLastupdate(DateUtility.parseDatetime(uObj.getString("lastupdate")));
            }
            // added
            if (!uObj.isNull("usedName")) {
                user.setUsedName(uObj.getString("usedName"));
            }
            if (!uObj.isNull("age") && !uObj.equals("")) {
                user.setAge(uObj.getInt("age"));
            }
            if (!uObj.isNull("weight") && !uObj.equals("")) {
                user.setWeight(uObj.getInt("weight"));
            }
            if (!uObj.isNull("height") && !uObj.equals("")) {
                user.setHeight(uObj.getInt("height"));
            }
            if (!uObj.isNull("country")) {
                user.setCountry(uObj.getString("country"));
            }
            if (!uObj.isNull("province")) {
                user.setProvince(uObj.getString("province"));
            }
            if (!uObj.isNull("city")) {
                user.setCity(uObj.getString("city"));
            }
            if (!uObj.isNull("county")) {
                user.setCounty(uObj.getString("county"));
            }
            if (!uObj.isNull("householdAddress")) {
                user.setHouseholdAddress(uObj.getString("householdAddress"));
            }
            if (!uObj.isNull("householdPostcode")) {
                user.setHouseholdPostcode(uObj.getString("householdPostcode"));
            }
            if (!uObj.isNull("bloodType")) {
                user.setBloodType(uObj.getString("bloodType"));
            }
            if (!uObj.isNull("nation")) {
                user.setNation(uObj.getString("nation"));
            }
            staff.setUser(user);
        }
        if (!obj.isNull("id")) {
            staff.setId(obj.getString("id"));
        }
        if (!obj.isNull("staffCode")) {
            staff.setStaffCode(obj.getString("staffCode"));
        } else {
            staff.setStaffCode(buildtimeIDGenerator.getNewBuildTimeCode());
        }
        if (!obj.isNull("professionalTitle")) {
            staff.setProfessionalTitle(obj.getString("professionalTitle"));
        }
        if (!obj.isNull("workPhoneNumber")) {
            staff.setWorkPhoneNumber(obj.getString("workPhoneNumber"));
        }
        if (!obj.isNull("workMobileNumber")) {
            staff.setWorkMobileNumber(obj.getString("workMobileNumber"));
        }
        if (!obj.isNull("workFaxNumber")) {
            staff.setWorkFaxNumber(obj.getString("workFaxNumber"));
        }
        if (!obj.isNull("workEmail")) {
            staff.setWorkEmail(obj.getString("workEmail"));
        }
        if (!obj.isNull("officeLocation")) {
            staff.setOfficeLocation(obj.getString("officeLocation"));
        }
        if (!obj.isNull("onBoardingDate")) {
            staff.setOnBoardingDate(new Date(obj.getLong("onBoardingDate")));
        }
        if (!obj.isNull("workType")) {
            staff.setWorkType(obj.getInt("workType"));
        }
        if (!obj.isNull("owner")) {
            staff.setOwner(obj.getString("owner"));
        }
        if (!obj.isNull("lastupdate")) {
            staff.setLastupdate(DateUtility.parseDatetime(obj.getString("lastupdate")));
        }
        return staff;
    }

    @RequestMapping(value = "/api5", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public UserLoginHistoryPage getLoginHistory(String userid, int pageno, int pagesize) {
        try {
            return wfLoginHistoryBlo.getAllHostory(userid, pageno, pagesize);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api6", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String existsEmail(String email) {
        try {
            if (wfUserBlo.existsEmail(email))
                return "1";
            else
                return "0";
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "0";
    }

    @RequestMapping(value = "/api7", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String existsMobile(String mobile) {
        try {
            if (wfUserBlo.existsMobile(mobile))
                return "1";
            else
                return "0";
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "0";
    }

    @RequestMapping(value = "/api8", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public User getUser(String uid) {
        try {
            return wfUserBlo.getUserByID(uid);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api9", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String existsidNumber(String idNumber) {
        try {
            if (wfUserBlo.existsidNumber(idNumber))
                return "1";
            else
                return "0";
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "0";
    }

    @RequestMapping(value = "/api10", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public String updateUser(String userinfo) {
        try {
            JSONObject obj = new JSONObject(userinfo);
            User user = new User();
            if (!obj.isNull("id")) {
                user.setId(obj.getString("id"));
            }
            if (!obj.isNull("givenname")) {
                user.setGivenname(obj.getString("givenname"));
            }
            if (!obj.isNull("surname")) {
                user.setSurname(obj.getString("surname"));
            }
            if (!obj.isNull("email")) {
                user.setEmail(obj.getString("email"));
            }
            if (!obj.isNull("mobile")) {
                user.setMobile(obj.getString("mobile"));
            }
            if (!obj.isNull("idType")) {
                user.setIdType(obj.getString("idType"));
            }
            if (!obj.isNull("idNumber")) {
                user.setIdNumber(obj.getString("idNumber"));
            }
            if (!obj.isNull("gender")) {
                user.setGender(obj.getString("gender"));
            }
            if (!obj.isNull("province")) {
                user.setProvince(obj.getString("province"));
            }
            if (!obj.isNull("city")) {
                user.setCity(obj.getString("city"));
            }
            if (!obj.isNull("county")) {
                user.setCounty(obj.getString("county"));
            }
            if (!obj.isNull("postcode")) {
                user.setPostcode(obj.getString("postcode"));
            }
            if (!obj.isNull("address")) {
                user.setAddress(obj.getString("address"));
            }
            if (!obj.isNull("birthday")) {
                user.setBirthday(DateUtility.parseDate(obj.getString("birthday")));
            }
            // added
            if (!obj.isNull("usedName")) {
                user.setUsedName(obj.getString("usedName"));
            }
            if (!obj.isNull("age") && !obj.equals("")) {
                user.setAge(obj.getInt("age"));
            }
            if (!obj.isNull("weight") && !obj.equals("")) {
                user.setWeight(obj.getInt("weight"));
            }
            if (!obj.isNull("height") && !obj.equals("")) {
                user.setHeight(obj.getInt("height"));
            }
            if (!obj.isNull("country")) {
                user.setCountry(obj.getString("country"));
            }
            if (!obj.isNull("province")) {
                user.setProvince(obj.getString("province"));
            }
            if (!obj.isNull("city")) {
                user.setCity(obj.getString("city"));
            }
            if (!obj.isNull("county")) {
                user.setCounty(obj.getString("county"));
            }
            if (!obj.isNull("householdAddress")) {
                user.setHouseholdAddress(obj.getString("householdAddress"));
            }
            if (!obj.isNull("householdPostcode")) {
                user.setHouseholdPostcode(obj.getString("householdPostcode"));
            }
            if (!obj.isNull("bloodType")) {
                user.setBloodType(obj.getString("bloodType"));
            }
            if (!obj.isNull("nation")) {
                user.setNation(obj.getString("nation"));
            }
            user.setLastupdate(new Date());
            if (wfUserBlo.updateUser(user) == 1) {
                return "{\"status\": \"1\"}";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}";
    }

    @RequestMapping(value = "/api11", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public String updatePassword(String mobile, String sessiondata, String password, String token) {
        try {
            if (check(mobile, sessiondata, password, token)) {
                if (wfUserBlo.updatePasswordMobile(mobile, password) == 1) {
                    return "{\"status\": \"1\"}"; // 更新成功
                } else {
                    return "{\"status\": \"-1\"}"; // 更新失败
                }
            } else {
                return "{\"status\": \"-2\"}"; // 验证失败，请重试
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}"; // 失败
    }

    @SuppressWarnings("unused")
    @RequestMapping(value = "/api12", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String importNormalStaff(String strNormalStaff, String ownerId, String userName, String orgName,
                                    String positionName) throws Exception {
        if (strNormalStaff.equals("")) {
            return null;
        }
        ArrayList list = new ArrayList(Arrays.asList(strNormalStaff.split(",")));
        wfUserBlo.importNormalStaff(list);
        return null;
    }

    @RequestMapping(value = "/api13", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public String updatePasswordByUserName(String userName, String password) {
        try {
            wfUserBlo.updatePasswordUserName(userName, password);
            return "{\"status\": \"1\"}"; // 更新成功
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}"; // 失败
    }
//	public String importNormalStaff(String strNormalStaff, String oid) {
//
//		try {
//			JSONObject obj = new JSONObject(strNormalStaff);
//			// 信息是否缺失
//			String ownerName = obj.getString("ownerName");
//			String userIdNumber = obj.getString("idNumber");
//			String userName = obj.getString("name");
//			String userGender = obj.getString("gender");
//			WfOrganizationEso organizationEso = new WfOrganizationEso();
//			Organization organization = organizationEso.queryByNameLocal(ownerName);
//			// 查找公司权限组
//
//			AuthorityGroup group = autorityGroupEso.queryByOwner(organization.getId());
//			if (organization == null) {
//				return "organization is null";
//			} else if (!oid.equals(organization.getId())) {
//				return "You do not have this authority";
//			} else if (userIdNumber == null || userIdNumber.equals("")) {
//				return "idNumber is null";
//			} else if (userName == null || userName.equals("")) {
//				return "name is null";
//			} else if (userGender == null || userGender.equals("")) {
//				return "gender is null";
//			} else {
//				User normalUser = wfUserBlo.getUserByUserName(userIdNumber);
//				Staff normalStaff = new Staff();
//				if (normalUser != null) {
//					// 查找公司是否有这个职员
//					normalStaff = wfStaffBlo.getUserByUserId(normalUser.getId(), organization.getId());
//				}
//				if (normalUser == null) {
//
//					User user = new User();
//					user.setId(buildtimeIDGenerator.getNewBuildTimeID());
//					user.setName(obj.getString("idNumber"));
//					if (obj.getString("gender").equals("男")) {
//						user.setGender("M");
//					} else {
//						user.setGender("W");
//					}
//					user.setIdNumber(obj.getString("idNumber"));
//					user.setAddress(obj.getString("address"));
//					user.setNation(obj.getString("nation"));
//					user.setHouseholdAddress(obj.getString("permanentAddress"));
//					user.setPasswd("827ccb0eea8a706c4c34a16891f84e7b");
//					user.setMobile(obj.getString("telephone"));
//					user.setIsBanned(0);
//					String name = obj.getString("name");
//					String xing = name.substring(0, 1);
//					String ming = name.substring(1, name.length());
//					user.setGivenname(ming);
//					user.setSurname(xing);
//					user.setLastupdate(new Date());
//					wfUserBlo.createNewUser(user);
//					// 创建Staff
//					Staff staff = new Staff();
//					staff.setId(buildtimeIDGenerator.getNewBuildTimeID());
//					staff.setUser(user);
//					staff.setOwner(organization.getId());
//					staff.setWorkMobileNumber(obj.getString("telephone"));
//					staff.setLastupdate(new Date());
//					wfStaffBlo.createStaff(staff);
//					// 添加权限组
//					AuthorityGroup ag = new AuthorityGroup();
//					ag.setId(group.getId());
//					ag.setOwner(organization.getId());
//					wfGroupMemberBlo.addUserIntoGroup(staff, ag);
//					return "success"; // success
//
//				} else if (normalUser != null && normalStaff == null) {
//					// 查找员工staffID
//					Staff staff = new Staff();
//					staff.setId(buildtimeIDGenerator.getNewBuildTimeID());
//					staff.setUser(normalUser);
//					staff.setOwner(organization.getId());
//					staff.setWorkMobileNumber(obj.getString("telephone"));
//					staff.setLastupdate(new Date());
//					wfStaffBlo.createStaff(staff);
//					// 添加权限组
//					AuthorityGroup ag = new AuthorityGroup();
//					ag.setId(group.getId());
//					ag.setOwner(organization.getId());
//					wfGroupMemberBlo.addUserIntoGroup(staff, ag);
//					return "success"; // success
//				} else {
//					return "repeat";
//				}
//
//			}
//
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		return null;
//	}

    // 验证发送的数据
    private boolean check(String mobile, String sessiondata, String password, String token) {
        String sessiondata1 = MD5Util.getMD5(token + mobile + "cloudbpm" + password + DateUtility.getCurrentDate());
        if (sessiondata1.equals(sessiondata)) {
            return true;
        }
        return false;

    }

    /**
     * Android上传头像
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api14", headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String uploadPortrait(@RequestParam("file") MultipartFile file, String userId, String fileName){
        String destination = "";
        String syspath = "";
        String storagetype = SystemConfig.getProp("filestorage.type");
//					System.out.println(image);
//					System.out.println();
        //这里需要“\\”来转义
//					String[] imageName1 = imageName.split("\\|");
//					String[] image1 = image.split("\\|");
        if (storagetype.trim().equals("win")) {
            syspath = SystemConfig.getProp("windows.filestorage.lib");
            //syspath = D:/data/org
        } else if (storagetype.trim().equals("linux")) {
            syspath = SystemConfig.getProp("linux.filestorage.lib");
        }
        destination = syspath + "/" + "usr/" + userId + "/portrait";
        File f = new File(destination + "/" + fileName);
        if (!f.exists()) {
            FileUtil.createDir(destination);
            try {
                FileUtil.writeFile(file.getBytes(), destination, fileName);
                return "success";
            } catch (IOException e) {
                e.printStackTrace();
                return "fail";
            }
        }else {
            try {
                FileUtil.writeFile(file.getBytes(), destination, fileName);
                return "success";
            } catch (IOException e) {
                e.printStackTrace();
                return "fail";
            }
        }

    }
}