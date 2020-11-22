package com.cloudibpm.blo.om.user;

import com.alibaba.fastjson.JSON;
import com.aliyuncs.exceptions.ClientException;
import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.message.AliyunMessageBlo;
import com.cloudibpm.core.authorization.AuthorityGroup;
import com.cloudibpm.core.code.StatusCode;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.User;
import com.cloudibpm.core.user.UserLoginHistory;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.VerifyCode;
import com.cloudibpm.core.util.encode.MD5Util;
import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.cloudibpm.eso.om.authorization.AutorityGroupEso;
import com.cloudibpm.eso.om.organization.WfOrganizationEso;
import com.cloudibpm.eso.om.user.WfGroupMemberEso;
import com.cloudibpm.eso.om.user.WfStaffEso;
import com.cloudibpm.eso.om.user.WfUserEso;
import com.cloudibpm.redis.RedisUtil;
import com.model.Contact;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
//@Transactional
public class WfUserBlo extends BusinessLogicObject {
    private final WfOrganizationEso wfOrganizationEso;
    private final WfUserEso wfUserEso;
    private final WfStaffBlo wfStaffBlo;
    private final WfStaffEso wfStaffEso;
    private final WfGroupMemberEso wfGroupMemberEso;
    private final AutorityGroupEso autorityGroupEso;
    private final BuildtimeIDGenerator buildtimeIDGenerator;
    private final WfLoginHistoryBlo wfLoginHistoryBlo;
    private final RedisUtil redisUtil;
    private final AliyunMessageBlo aliyunMessageBlo;

    @Autowired
    public WfUserBlo(WfOrganizationEso wfOrganizationEso, WfUserEso wfUserEso, WfStaffBlo wfStaffBlo, WfStaffEso wfStaffEso, WfGroupMemberEso wfGroupMemberEso, AutorityGroupEso autorityGroupEso, BuildtimeIDGenerator buildtimeIDGenerator, WfLoginHistoryBlo wfLoginHistoryBlo, RedisUtil redisUtil, AliyunMessageBlo aliyunMessageBlo) {
        this.wfOrganizationEso = wfOrganizationEso;
        this.wfUserEso = wfUserEso;
        this.wfStaffBlo = wfStaffBlo;
        this.wfStaffEso = wfStaffEso;
        this.wfGroupMemberEso = wfGroupMemberEso;
        this.autorityGroupEso = autorityGroupEso;
        this.buildtimeIDGenerator = buildtimeIDGenerator;
        this.wfLoginHistoryBlo = wfLoginHistoryBlo;
        this.redisUtil = redisUtil;
        this.aliyunMessageBlo = aliyunMessageBlo;
    }


    /**
     * Add new workflow user.
     *
     * @param user
     * @return
     */

    public int createNewUser(User user) throws Exception {

        return wfUserEso.insert(user);
    }

    public int updateUser(User user) throws Exception {

        return wfUserEso.update(user);
    }

    public void updateUserLoginCounting(String userid) throws Exception {
        wfUserEso.updateLoginCounting(userid);
    }

    //根据用户名查询用户
    public User getUserByUserName(String username) throws Exception {

        return wfUserEso.queryByUserName(username);
    }

    //根据用户名查询用户
    public User getUserByMobile(String username) throws Exception {
        return wfUserEso.queryUserByMobile(username);
    }

    public Login checkUserName(String username, String password) throws Exception {

        User usr = wfUserEso.queryUsername(username);
        if (usr == null) {
            // 0: user does not exist
            return new Login(0, null, null); // user name does't exists
        } else if (usr.getIsBanned() == 1) {
            // -10: user has been banned
            return new Login(-10, usr, null);
        } else if (!password.equals(usr.getPasswd())) {
            // -1: password is incorrect
            return new Login(-1, usr, null);
        } else if (usr.getPasswdExpirationDate() != null
                && usr.getPasswdExpirationDate().getTime() < Calendar.getInstance().getTimeInMillis()) {
            // -9: password expired
            return new Login(-9, usr, null);
        } else {
            usr.setPasswd(null);// clean password to protect password.
            return new Login(1, usr, null); // successful
        }
    }

    public Login checkMobile(String mobile) throws Exception {

        User usr = wfUserEso.queryMobile(mobile);
        if (usr == null) {
            // 0: user does not exist
            return new Login(0, null, null); // user name does't exists
        } else if (usr.getIsBanned() == 1) {
            // -10: user has been banned
            return new Login(-10, usr, null);
        } else if (usr.getPasswdExpirationDate() != null
                && usr.getPasswdExpirationDate().getTime() < Calendar.getInstance().getTimeInMillis()) {
            // -9: password expired
            return new Login(-9, usr, null);
        } else {
            usr.setPasswd(null);// clean password to protect password.
            return new Login(1, usr, null); // successful
        }

    }

    public void importNormalStaff(ArrayList<String> list) throws Exception {
        ArrayList<String> userlist = new ArrayList<String>();
        ArrayList<String> stafflist = new ArrayList<String>();// 已有useid的staff列表
        ArrayList<String> stafflist2 = new ArrayList<String>();// 表里没有的useid的staff列表
        ArrayList<String> staffResultList = new ArrayList<String>();
        ArrayList<String> repeatUserlist = new ArrayList<String>();
        ArrayList<String> repeatUserOrglist = new ArrayList<String>();
        ArrayList<String> idNumberList = new ArrayList<String>();
        Map<String, String> companyMap = new LinkedHashMap<>();
        Map<String, String> companyAuthorityMap = new LinkedHashMap<>();
        Map<String, String> repeatIdNumberMap = new LinkedHashMap<>();
        Map<String, String> repeatUserIdMap = new LinkedHashMap<>();
        Map<String, String> userCompanyRelationship = new LinkedHashMap<>();
        java.sql.Date date = new java.sql.Date(System.currentTimeMillis());
        // 存储员工公司对应关系
        for (int i = 0; i < list.size(); i = i + 14) {
            userCompanyRelationship.put(list.get(i + 4), list.get(i));
        }
        // idNumber查重
        for (int i = 0; i < list.size(); i = i + 14) {
            idNumberList.add(list.get(i + 4));
        }
        // 查询已存在user
        ArrayList<String> idNumberResultList = wfUserEso.queryInIdNumber(idNumberList);// 返回了idnumber和userid
        if (idNumberResultList != null && idNumberResultList.size() > 0) {
            for (int i = 0; i < idNumberResultList.size(); i = i + 2) {
                repeatIdNumberMap.put(idNumberResultList.get(i), idNumberResultList.get(i + 1));
            }
        }
        // 公司查询
        for (int i = 0; i < list.size(); i = i + 14) {
            companyMap.put(list.get(i), null);
            companyAuthorityMap.put(list.get(i), null);
        }
        for (java.util.Map.Entry<String, String> entry : companyMap.entrySet()) {
            // 将原来MAP的VALUE放入新的MAP的VALUE里面
            Organization organization = wfOrganizationEso.queryByNameLocal(entry.getKey());
            if (organization != null) {
                companyMap.put(entry.getKey(), organization.getId());
                // 查找公司权限组
                AuthorityGroup group = autorityGroupEso.queryByOwner(organization.getId());
                companyAuthorityMap.put(entry.getKey(), group.getId());
            }
        }
        // 把重复user对应的userid和orgId插入stafflist和stafforglist
        if (idNumberResultList != null && idNumberResultList.size() > 0) {
            for (int i = 0; i < idNumberResultList.size(); i = i + 2) {
                if (companyMap.get(userCompanyRelationship.get(idNumberResultList.get(i))) != null) {
                    repeatUserlist.add(idNumberResultList.get(i + 1));
                }
            }
            for (int i = 0; i < idNumberResultList.size(); i = i + 2) {
                if (companyMap.get(userCompanyRelationship.get(idNumberResultList.get(i))) != null) {
                    repeatUserOrglist.add(companyMap.get(userCompanyRelationship.get(idNumberResultList.get(i))));
                }
            }
        }
        // 查询重复user在公司有无staff，没有则批量插入
        if (repeatUserlist.size() > 0) {
            staffResultList = wfStaffEso.queryInUserId(repeatUserlist, repeatUserOrglist);// 返回了staffid、userid、orgid
        }
        if (staffResultList != null && staffResultList.size() > 0) {
            for (int i = 0; i < staffResultList.size(); i = i + 3) {
                repeatUserIdMap.put(staffResultList.get(i + 1), staffResultList.get(i + 2));
            }
        }
        if (idNumberResultList != null && idNumberResultList.size() > 0) {
            for (int i = 0; i < idNumberResultList.size(); i = i + 2) {
                if (repeatUserIdMap.get(idNumberResultList.get(i + 1)) == null) {
                    stafflist.add(buildtimeIDGenerator.getNewBuildTimeID());
                    stafflist.add(idNumberResultList.get(i + 1)); // useid
                    stafflist.add(companyMap.get(userCompanyRelationship.get(idNumberResultList.get(i)))); // orgid
                    stafflist.add(companyAuthorityMap.get(userCompanyRelationship.get(idNumberResultList.get(i)))); // 权限组id
                }
            }
        }
        if (stafflist.size() > 0) {
            wfStaffEso.updateBatchStaff(stafflist, date);// 返回一个userid和idnumber列表，进行批量插入staff和权限组
            wfGroupMemberEso.updateBatchAuthorityGroup(stafflist);
        }
        // 开始批量插入不存在的user
        for (int i = 0; i < list.size(); i = i + 14) {
            if (companyMap.get(list.get(i)) != null && repeatIdNumberMap.get(list.get(i + 4)) == null) {
                userlist.add(buildtimeIDGenerator.getNewBuildTimeID());// Pk_User
                userlist.add(list.get(i + 4));// UserName 2 1
                userlist.add("827ccb0eea8a706c4c34a16891f84e7b");// Passwd 3 2
                String name = list.get(i + 1);
                String xing = name.substring(0, 1);
                String ming = name.substring(1, name.length());
                userlist.add(ming);// FirstName 5 3
                userlist.add(xing);// LastName 6 4
                if (list.get(i + 2).equals("女")) {
                    userlist.add("W");// Gender 7 5
                } else {
                    userlist.add("M");// Gender 7 5
                }
                if (list.get(i + 4).length() != 18) {
                    userlist.add("1");// IdType 9 6
                } else {
                    userlist.add("0");// IdType 9 6
                }
                userlist.add(list.get(i + 4));// IdNumber 10 7
                userlist.add(list.get(i + 6));// Address 15 8
                userlist.add(list.get(i + 8));// Mobile 19 9
                userlist.add(list.get(i + 3));// Nation 21 10
                userlist.add(list.get(i + 7));// HouseholdAddress 22 11
                userlist.add(companyMap.get(list.get(i)));// HouseholdAddress 22
                // 11
            }
        }
        if (userlist.size() > 0) {
            wfUserEso.updateBatchUser(userlist, date);
            // 开始批量插入staff
            for (int i = 0; i < userlist.size(); i = i + 13) {
                stafflist2.add(buildtimeIDGenerator.getNewBuildTimeID());
                stafflist2.add(userlist.get(i)); // useid
                stafflist2.add(companyMap.get(userCompanyRelationship.get(userlist.get(i + 1)))); // orgid
                stafflist2.add(companyAuthorityMap.get(userCompanyRelationship.get(userlist.get(i + 1)))); // 权限组id
            }
        }

        if (stafflist2.size() > 0) {
            wfStaffEso.updateBatchStaff(stafflist2, date);// 返回一个userid和idnumber列表，进行批量插入staff和权限组
            wfGroupMemberEso.updateBatchAuthorityGroup(stafflist2);
        }
    }

    public int checkUserNameandEmail(String username, String email) throws Exception {

        if (wfUserEso.existsUsername(username)) {
            User user = wfUserEso.queryByUsername(username);
            if (user.getEmail() != null) {
                if (user.getEmail().equals(email)) {
                    return 1; // correct
                } else {
                    return -6; // -6: email is not correct
                }
            } else {
                return -6; // -6: email is not correct
            }
        }
        return 0; // user does't exist;
    }

    public void updatePasswordUserName(String username, String password) throws Exception {

        wfUserEso.updatePassword(username, password);
    }

    public int updatePasswordMobile(String mobile, String password) throws Exception {

        return wfUserEso.updatePasswordByMobile(mobile, password);
    }

    public boolean existsUsername(String username) throws Exception {

        return wfUserEso.existsUsername(username);
    }

    public boolean existsEmail(String email) throws SQLException {

        return wfUserEso.existsEmail(email);
    }

    public boolean existsMobile(String mobile) throws SQLException {

        return wfUserEso.existsMobile(mobile);
    }

    public boolean existsidNumber(String idNumber) throws SQLException {

        return wfUserEso.existsidNumber(idNumber);
    }

    /**
     * Get a cloud BPM user according to ID.
     *
     * @param id
     * @return
     * @throws SQLException
     */
    public User getUserByID(String id) throws Exception {

        return wfUserEso.queryByPKnoPW(id);
    }

    public User getUserByIDNumber(String idnumber) throws Exception {

        return wfUserEso.queryByIdNumber(idnumber);
    }

    /**
     * 根据用户ID查询用户
     *
     * @param ids
     * @return
     * @throws SQLException
     */
    public List<User> getAllUserById(List<String> ids) throws SQLException {
        List<User> userList = null;
        for (String id : ids) {
            userList.add(wfUserEso.queryByPK(id));
        }
        return userList;
    }

    // public User[] getNotInGroupUsers(User[] users, Group group)
    // throws Exception {
    // List<User> notingroup = new ArrayList<User>();
    // List<User> allUsers = getAllOrganizationUsers();
    // for (User user : allUsers) {
    // // belong to same owner
    // boolean found = false;
    // if (user.getOwner().getId().equals((group).getOwner().getId())) {
    // for (User usr : users) {
    // WorkflowEntity entity = usr;
    // if (entity.getId().equals(user.getId())) {
    // found = true;
    // }
    // }
    // if (!found)
    // notingroup.add(user);
    // }
    // }
    // User[] notingroupUsers = new User[notingroup.size()];
    // for (int i = 0; i < notingroup.size(); i++) {
    // notingroupUsers[i] = (User) notingroup.get(i);
    // }
    // return notingroupUsers;
    // }

    /**
     * Get a workflow user according to user code.
     *
     * @param id
     * @return
     */
    // public User getUserByCode(String code) throws Exception {
    // WfUserEso userEso = new WfUserEso();
    // WfUserRo userRo = (WfUserRo) userEso.queryByCode(code);
    // if (userRo != null) {
    // return (User) userRo.getEntity();
    // }
    // return null;
    // }

    /**
     * Gets all workflow users in all organizatons in current repository;
     *
     * @return
     * @throws SQLException
     */
    // public List<User> getAllOrganizationUsers() throws Exception {
    //
    // List<User> users = new ArrayList<User>();
    // List<RecordObject> userRos = wfUserEso.queryAll();
    // for (RecordObject userRo : userRos) {
    // users.add((User) userRo.getEntity());
    // }
    // return users;
    // }

    /**
     * 该方法查询出来用户选择对话框的左边列表中所有用户。
     *
     * @param in
     *            任务中所有的参与者的ID列表。
     * @return
     * @throws SQLException
     */
    // public User[] getAllOrganizationUsersNotIn(Object[] in) throws Exception
    // {
    //
    // List<User> users = new ArrayList<User>();
    // List<RecordObject> userRos = wfUserEso.queryAll();
    // if (in != null && in.length > 0) {
    // for (RecordObject userRo : userRos) {
    // boolean found = false;
    // for (int i = 0; i < in.length; i++) {
    // if (in[i].equals(userRo.getPrimaryKey())) {
    // found = true;
    // break;
    // }
    // }
    // if (!found)
    // users.add((User) userRo.getEntity());
    // }
    // } else {
    // for (RecordObject userRo : userRos) {
    // users.add((User) userRo.getEntity());
    // }
    // }
    // User[] selectedUsers = new User[users.size()];
    // for (int i = 0; i < users.size(); i++) {
    // selectedUsers[i] = (User) users.get(i);
    // }
    // return selectedUsers;
    // }

    /**
     * 该方法查询出来用户选择对话框的右边列表中所有用户。
     *
     * @param in
     *            任务中所有的参与者的ID列表。
     * @return
     * @throws SQLException
     */
    // public User[] getAllOrganizationUsersIn(Object[] in) throws Exception {
    // List<User> users = getOrganizationUsersIn(in);
    // User[] selectedUsers = new User[users.size()];
    // for (int i = 0; i < users.size(); i++) {
    // selectedUsers[i] = (User) users.get(i);
    // }
    // return selectedUsers;
    // }

    /**
     * 获取公司用户
     *
     * @param in
     * @return
     * @throws SQLException
     */
    // public List<User> getOrganizationUsersIn(Object[] in) throws Exception {
    //
    // List<User> users = new ArrayList<User>();
    // if (in != null && in.length > 0) {
    // for (int i = 0; i < in.length; i++) {
    // RecordObject userRo = wfUserEso.queryByPK(in[i].toString());
    // if (userRo != null)
    // users.add((User) userRo.getEntity());
    // }
    // }
    // return users;
    // }
    //
    // public List<User> getOrganizationUsers(Object[] in, Organization org)
    // throws Exception {
    //
    // List<User> users = new ArrayList<User>();
    // List<RecordObject> userRos = wfUserEso.queryAll(org.getId());
    // for (RecordObject userRo : userRos) {
    // if (in != null && in.length > 0) {
    // for (int i = 0; i < in.length; i++) {
    // if (!in[i].equals(userRo.getPrimaryKey()))
    // users.add((User) userRo.getEntity());
    // }
    // } else
    // users.add((User) userRo.getEntity());
    // }
    // return users;
    // }

    /**
     * Delete an unused user according to user database primary key.
     *
     * @param id
     *            String
     */
    // public void deleteUserByID(String id) throws Exception {
    // // 先从列表中把该用户删除。
    // WfContactEso cESO = new WfContactEso();
    // cESO.delete(id);
    //
    // wfUserEso.delete(id);
    // }

    /**
     * Modify workflow user information
     *
     * @param user
     */
    // public void modifyUser(User user) throws Exception {
    // // 此处要对列表中的同一个ID的用户对象进行重新赋值。并通知更新到数据库中。
    //
    // WfUserRo uRO = new WfUserRo();
    // uRO.setRecordObject(user);
    // wfUserEso.update(uRO);
    // // delete all old contacts and save all new contacts for user
    // WfContactEso cESO = new WfContactEso();
    // cESO.delete(user.getId());
    // saveContact(user.getContacts(), user);
    // }

    /**
     * save all contacts of user.
     *
     * @param list
     * @param usr
     */
    // private void saveContact(ContactList list, User usr) throws Exception {
    // if (list.size() > 0) {
    // for (int i = 0; i < list.size(); i++) {
    // Contact contact = list.get(i);
    // contact.setOwner(usr);
    // WfContactRo cRO = new WfContactRo();
    // cRO.setRecordObject(contact);
    // WfContactEso cESO = new WfContactEso();
    // cESO.insert(cRO);
    // }
    // }
    // }

    /**
     * Return true if the specified user code has existed.
     *
     * @param code
     * @return
     * @throws SQLException
     */
    // public boolean codeExisted(String code) throws Exception {
    //
    // return wfUserEso.queryCode(code);
    // }

    /**
     * Get page count of all records of workflow users.
     *
     * @param pagesize
     * @return
     */
    // private int getPageCount(int pagesize, List<User> users) {
    // int count = users.size();
    // int p = count / pagesize;
    // int r = count % pagesize;
    // int pagecount = 0;
    // if (r == 0)
    // pagecount = p;
    // else
    // pagecount = p + 1;
    // return pagecount;
    // }

    /**
     * Gets workflow user list of current page. The condition firstly filters
     * out available users according to organization <code>owner</code>, if
     * <code>owner</code> is not null, and return users of No
     * <code>currentpage</code> page according to the specified
     * <code>pagesize</code>.
     *
     * @param pagesize
     * @param currentpage
     * @param condition
     * @param owner
     * @return
     * @throws Exception
     */
    // public Page getCurrentPageUsers(int pagesize, int currentpage,
    // String condition, String ownerId) throws Exception {
    // Page currentPage = new Page();
    // List<User> allPagesUsersList = getUsersByCondition(condition, ownerId);
    // currentPage.setCurrentPageNumber(currentpage);
    // currentPage.setPageCount(getPageCount(pagesize, allPagesUsersList));
    // currentPage.setCurrentPageEntities(filterCurrentPageUsers(
    // allPagesUsersList, pagesize, currentpage));
    // return currentPage;
    // }
    //
    // private static User[] filterCurrentPageUsers(List<User> users,
    // int pagesize, int currentpage) {
    // List<User> userList = new ArrayList<User>();
    // int start = (currentpage - 1) * pagesize;
    // int end = currentpage * pagesize;
    // for (int i = start; i < end; i++) {
    // if (i <= users.size() - 1) {
    // userList.add(users.get(i));
    // }
    // }
    // if (userList.size() > 0) {
    // User[] wfusers = new User[userList.size()];
    // for (int i = 0; i < wfusers.length; i++) {
    // wfusers[i] = (User) userList.get(i);
    // }
    // return wfusers;
    // }
    // return null;
    // }
    //
    // private List<User> getUsersByCondition(String condition, String ownerId)
    // throws Exception {
    // List<User> userList = new ArrayList<User>();
    // List<User> allUsers = getAllOrganizationUsers();
    // for (User user : allUsers) {
    // if (ownerId != null && !user.getOwner().getId().equals(ownerId))
    // continue;
    // if (condition != null && !condition.equals("")) {
    // if (user.getUserCode().indexOf(condition) > 0
    // || user.getFullName().indexOf(condition) > 0
    // || user.getName().indexOf(condition) > 0) {
    // userList.add(user);
    // }
    // } else {
    // userList.add(user);
    // }
    // }
    // return userList;
    // }

    /**
     * Update user password policy.
     *
     * @param usr
     * @throws SQLException
     */
    // public void modifyPasswordPolicy(User usr) throws Exception {
    //
    // WfUserRo uRO = new WfUserRo();
    // uRO.setPrimaryKey(usr.getId());
    // // uRO.setCanModifyPassword(usr.canModifyPassword());
    // // uRO.setRememberPassword(usr.rememberPassword());
    // // uRO.setMustModifyPassword(usr.mustModifyPassword());
    // wfUserEso.updatePasswordPolicy(uRO);
    // }


    /**
     * check user is banned
     *
     * @param userid
     * @return
     * @throws Exception
     */
    public int checkStatus(String userid) throws Exception {
        int result = 1;// 1: success;
        // check organization status;

        // check user status;

        User usr = wfUserEso.queryByPK(userid);
        if (usr == null) {
            // 0: user does not exist
            return StatusCode.USER_NOT_EXISTS; // user name does't exists
        } else if (usr.getIsBanned() == 1) {
            // -10: user has been banned
            return StatusCode.BANNED;
        }
        return result;
    }

    /**
     * @param username
     * @param sessiondata
     * @param password
     * @param token
     * @param details
     * @param loginType   判断登录方使，0：用户名密码登录， 1：手机验证码登录
     * @return
     * @throws Exception
     */
    public ServiceResult authenticate(String username, String sessiondata, String password, String token, String[] details, int loginType) throws Exception {

        Login login = null;
        String sessionId = null;
        ServiceResult serviceResult = null;
        if (check(username, sessiondata, password, token)) {
            // return Logged in Staff or -10, -9, -1, 0, or 1;
            if (loginType == 0) {
                login = this.checkUserName(username, password);
            } else {
                login = this.checkMobile(username);
            }
            if (login.getUser() != null) {
                // return Logged in Staff
                login = wfStaffBlo.getStaffShips(login);
            } else {
                login = new Login(StatusCode.PASSWORD_INCORRECT, null, null);
            }
        } else { // -4: invalid login (might be hacker login);
            //ServiceResult<?, Integer> e2 = ServiceResult.error(1, "error"));
            login = new Login(StatusCode.INVALID_LOGIN, null, null);
            serviceResult = ServiceResult.error(StatusCode.INVALID_LOGIN, "登录校验失败！");
        }
        // 1: success
        // 0: user does not exist
        // -1: password is incorrect
        // -6: email is not correct
        // -9: password expired
        // -10: user has been banned
        if (login.getStatusCode() == StatusCode.BANNED || login.getStatusCode() == StatusCode.NOT_A_STAFF || login.getStatusCode() == StatusCode.NO_AUTHORIZATION
                || login.getStatusCode() == StatusCode.INVALID_LOGIN || login.getStatusCode() == StatusCode.PASSWORD_INCORRECT || login.getStatusCode() == StatusCode.SUCCESS) {
            UserLoginHistory history = new UserLoginHistory();
            history.setId(buildtimeIDGenerator.getNewRunTimeID());
            if (login.getUser() != null)
                history.setFk_User(login.getUser().getId());
            history.setLastLoginTime(new Date());
            history.setStatusCode(login.getStatusCode());
            history.setDevice(details[0]);
            history.setDeviceType(details[1]);
            history.setDeviceManufacturer(details[2]);
            history.setOs(details[3]);
            history.setOsType(details[4]);
            history.setOsManufacturer(details[5]);
            history.setBrowser(details[6]);
            history.setBrowserType(details[7]);
            history.setBrowserVersion(details[8]);
            history.setBrowserManufacturer(details[9]);
            history.setIPv4(details[10]);
            history.setIPv6(details[11]);
            history.setCountry(details[12]);
            history.setProvince(details[13]);
            history.setCity(details[14]);
            history.setTown(details[15]);
            history.setSessionId(details[16]);
            if (login.getStatusCode() == StatusCode.SUCCESS) {
                String id = login.getUser().getId();

//                sessionId = MD5Util.getMD5(username + id + DateUtility.getCurrentDate());

                User user = login.getUser();
                if (StringUtils.isBlank(user.getFullName())) {
                    String userdName = user.getUsedName();
                    if (StringUtils.isNotBlank(userdName)) {
                        user.setSurname(userdName.substring(0, 1));
                        user.setGivenname(userdName.substring(1));
                    }
                }

                sessionId = MD5Util.getMD5(username + id);
                redisUtil.set("SESSION_" + sessionId, JSON.toJSONString(login));
                redisUtil.expire("SESSION_" + sessionId, 7200, TimeUnit.SECONDS);
                this.updateUserLoginCounting(login.getUser().getId());
                history.setLoginDescription(StringEscapeUtils.escapeJava(username + "登录成功"));
                Map<String, Object> map = new HashMap<>();
                map.put("sessionId", "SESSION_" + sessionId);
                map.put("login", login);
                map.put("expire", System.currentTimeMillis() + 7200000);
                serviceResult = ServiceResult.success(map);
            } else if (login.getStatusCode() == StatusCode.PASSWORD_INCORRECT) {
                history.setLoginDescription(StringEscapeUtils.escapeJava(username + "尝试登录，但密码不正确"));
                serviceResult = ServiceResult.error(StatusCode.PASSWORD_INCORRECT, "尝试登录，但密码不正确");
            } else if (login.getStatusCode() == StatusCode.INVALID_LOGIN) {
                history.setLoginDescription(StringEscapeUtils.escapeJava(username + "无效登录，可能是黑客在尝试登录"));
                serviceResult = ServiceResult.error(StatusCode.INVALID_LOGIN, "无效登录，可能是黑客在尝试登录");
            } else if (login.getStatusCode() == StatusCode.PASSWORD_ERROR) {
                history.setLoginDescription(StringEscapeUtils.escapeJava(username + "密码已经过期，请重新设置密码"));
                serviceResult = ServiceResult.error(StatusCode.PASSWORD_ERROR, "密码已经过期，请重新设置密码");
            } else if (login.getStatusCode() == StatusCode.BANNED) {
                history.setLoginDescription(StringEscapeUtils.escapeJava(username + "无效登录，该账号已经被永久封禁"));
                serviceResult = ServiceResult.error(StatusCode.BANNED, "无效登录，该账号已经被永久封禁");
            }
            wfLoginHistoryBlo.createLoginHistory(history);
        }
        return serviceResult;
    }

    private boolean check(String username, String sessiondata, String password, String token) {
        String sessiondata1 = MD5Util.getMD5(token + username + "cloudbpm" + password + DateUtility.getCurrentDate());
        if (sessiondata1.equals(sessiondata)) {
            return true;
        }
        return false;

    }

    public List<Contact> getAllUserByOrgId(String orgId, String userId) throws Exception {
        return wfUserEso.getAllUserByOrgId(orgId, userId);
    }

    public List<Contact> getUsersWithoutOwner(String userId) throws Exception {
        return wfUserEso.getUsersWithoutOwner(userId);
    }

    /**
     * 发送验证码
     *
     * @param phoneNumber
     * @return
     * @throws ClientException
     */
    public String sendCode(String phoneNumber) throws ClientException {
        String code = VerifyCode.getVerifyCode(6);//生成6位随机码
        aliyunMessageBlo.sendSms(phoneNumber, code);
        String key = "codePhone_" + phoneNumber;
        redisUtil.set(key, code);
        redisUtil.expire(key, 5, TimeUnit.MINUTES);
        return "true";
    }

    /**
     * 重新发送验证码
     *
     * @param phoneNumber
     * @return
     * @throws ClientException
     */
    public ServiceResult reSendCode(String phoneNumber) throws ClientException {
        String key = "codePhone_" + phoneNumber;
        String code = redisUtil.get(key);
        if (!StringUtils.isBlank(code)) {
            aliyunMessageBlo.sendSms(phoneNumber, code);
        } else {
            code = VerifyCode.getVerifyCode(6);//生成6位随机码
            aliyunMessageBlo.sendSms(phoneNumber, code);
            redisUtil.set(key, code);
            redisUtil.expire(key, 5, TimeUnit.MINUTES);
        }
        return ServiceResult.success();
    }

    /**
     * 校验验证码，成功返回login信息以及sessionID，错误返回错误码
     *
     * @param phoneNumber
     * @param code
     * @return
     */
    public String checkCode(String phoneNumber, String code) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();
        String key = "codePhone_" + phoneNumber;
        String redisCode = redisUtil.get(key);
        if (StringUtils.isBlank(redisCode)) {//验证码已过期
            resultMap.put("status", "0");
            return JSON.toJSONString(resultMap);
        }
        if (StringUtils.isBlank(code)) {//验证码不得为空
            resultMap.put("status", "1");
            return JSON.toJSONString(resultMap);
        }

        if (!StringUtils.equals(code, redisCode)) {//验证失败
            resultMap.put("status", "2");
            return JSON.toJSONString(resultMap);
        }

        //处理验证成功情况

        Login login = this.checkMobile(phoneNumber);
        if (login.getStatusCode() == 0) {//没有这个用户
            resultMap.put("status", "3");
            return JSON.toJSONString(resultMap);
//            User user = new User();
//            try {
//                user.setId(buildtimeIDGenerator.getNewBuildTimeID());
//            } catch (Exception e1) {
//                e1.printStackTrace();
//            }
//            user.setName(phoneNumber);
//            user.setGivenname("");
//            user.setSurname("");
//            user.setEmail(" ");
//            user.setPasswd(MD5Util.getMD5("12345"));
//            user.setMobile(phoneNumber);
//            user.setRegistrationDate(new Date());
//            user.setLastupdate(new Date());
//            this.createNewUser(user);
//            login.setUser(user);
//            login = wfStaffBlo.getStaffShips(login);
//            String id = login.getUser().getId();
//            String sessionId = MD5Util.getMD5(phoneNumber + id);
//            redisUtil.set("SESSION_" + sessionId, JSON.toJSONString(login));
//            redisUtil.expire("SESSION_" + sessionId, 7200, TimeUnit.SECONDS);
//            resultMap.put("status", "3");
//            resultMap.put("sessionId", "SESSION_" + sessionId);
//            resultMap.put("login", login);
//            resultMap.put("expire", System.currentTimeMillis() + 7200000);
//            return JSON.toJSONString(resultMap);
        }

        login = wfStaffBlo.getStaffShips(login);
        String id = login.getUser().getId();
        String sessionId = MD5Util.getMD5(phoneNumber + id);
        redisUtil.set("SESSION_" + sessionId, JSON.toJSONString(login));
        redisUtil.expire("SESSION_" + sessionId, 7200, TimeUnit.SECONDS);

        resultMap.put("status", "4");
        resultMap.put("sessionId", sessionId);
        resultMap.put("login", login);
        resultMap.put("expire", System.currentTimeMillis() + 7200000);
        return JSON.toJSONString(resultMap);


    }

    public String updateUsedName(String userId, String name) throws SQLException {
        User user=wfUserEso.queryByPK(userId);
        if(StringUtils.isBlank(user.getFullName())){
            wfUserEso.updateName(userId, name);
        }

        wfUserEso.updateUsedName(userId, name);
        return "true";
    }

    /**
     * 浏览器验证码注册
     *
     * @param phoneNumber 手机号
     * @param code        验证码
     * @return
     */
    public ServiceResult registerUserByCodeForPC(String phoneNumber, String code) throws Exception {
        String key = "codePhone_" + phoneNumber;
        String redisCode = redisUtil.get(key);
        Map<String, Object> resultMap = new HashMap<>();
        if (StringUtils.isBlank(redisCode)) {//验证码已过期
            return ServiceResult.error(1001, "验证码已过期！");
        }
        if (StringUtils.isBlank(code)) {//验证码不得为空
            return ServiceResult.error(1002, "验证码不得为空！");
        }
        if (!StringUtils.equals(code, redisCode)) {//验证失败
            return ServiceResult.error(1003, "验证码输入错误，请重试！");
        }

        Login login = this.checkMobile(phoneNumber);
        if (login.getStatusCode() == 0) {//没有这个用户
            User user = new User();
            try {
                user.setId(buildtimeIDGenerator.getNewBuildTimeID());
            } catch (Exception e1) {
                e1.printStackTrace();
            }
            user.setName(phoneNumber);
            user.setGivenname("");
            user.setSurname("");
            user.setEmail("");
            user.setUsedName(generateName());
            user.setGivenname(user.getUsedName().substring(1));
            user.setSurname(user.getUsedName().substring(0,1));
            user.setPasswd(MD5Util.getMD5("12345"));
            user.setMobile(phoneNumber);
            user.setRegistrationDate(new Date());
            user.setLastupdate(new Date());
            this.createNewUser(user);
            login.setUser(user);
            login = wfStaffBlo.getStaffShips(login);
            String id = login.getUser().getId();
            String sessionId = MD5Util.getMD5(phoneNumber + id);
            redisUtil.set("SESSION_" + sessionId, JSON.toJSONString(login));
            redisUtil.expire("SESSION_" + sessionId, 7200, TimeUnit.SECONDS);
            resultMap.put("status", "new");
            resultMap.put("sessionId", "SESSION_" + sessionId);
            resultMap.put("login", login);
        } else {//
            return ServiceResult.error(1004, "您已经是轩琦云会员了，请勿重复注册！");
        }
        return ServiceResult.success(resultMap);
    }

    public ServiceResult refreshSession(String userName, String sessionId) throws Exception {
        if (StringUtils.isNotBlank(sessionId)) {
            String session = redisUtil.get(sessionId);
            if (StringUtils.isNotBlank(session)) {
                redisUtil.expire(sessionId, 2, TimeUnit.HOURS);
                Map<String, Long> map = new HashMap<>();
                map.put("expire", System.currentTimeMillis() + 7200000);
                return ServiceResult.success(map);
            }
        }

        Map<String, Object> resultMap = new HashMap<>();
        User usr = wfUserEso.queryUsername(userName);
        Login login = new Login(1, usr, null);
        login = wfStaffBlo.getStaffShips(login);
        String userId = usr.getId();
        sessionId = MD5Util.getMD5(userName + userId);
        redisUtil.set("SESSION_" + sessionId, JSON.toJSONString(login));
        redisUtil.expire("SESSION_" + sessionId, 7200, TimeUnit.SECONDS);
        resultMap.put("expire", System.currentTimeMillis() + 7200000);
        resultMap.put("sessionId", "SESSION_" + sessionId);
        resultMap.put("login", login);
        return ServiceResult.success(resultMap);
    }

    public ServiceResult registerUser(String code,String phoneNumber,String name,String orgId,String password) throws Exception {
        if(StringUtils.isBlank(code)){
            return ServiceResult.error(1001,"验证码不得为空");
        }
        if(StringUtils.isBlank(phoneNumber)){
            return ServiceResult.error(1002,"手机号不得为空");
        }
        if(StringUtils.isBlank(name)){
            return ServiceResult.error(1003,"昵称不得为空");
        }
        String key = "codePhone_" + phoneNumber;
        String redisCode = redisUtil.get(key);
        if(!StringUtils.equals(code, redisCode)){
            return ServiceResult.error(1004,"验证码校验失败");
        }

        Login login = this.checkMobile(phoneNumber);
        if(login.getStatusCode()!=0){
            return ServiceResult.error(1005,"该手机号已经注册，请勿重复注册");
        }

        User user = new User();
        try {
            String userId = buildtimeIDGenerator.getNewBuildTimeID();
            user.setId(userId);
        } catch (Exception e1) {
            e1.printStackTrace();
        }
        Organization organization=null;
        if(StringUtils.isNotBlank(orgId)){
            organization = wfOrganizationEso.queryByPK(orgId);
            if(organization==null){
                return ServiceResult.error(1005,"该组织不存在");
            }
        }

        user.setName(phoneNumber);
        user.setGivenname("");
        user.setSurname("");
        user.setEmail(" ");
        user.setUsedName(name);
        user.setPasswd(password);
        user.setMobile(phoneNumber);
        user.setRegistrationDate(new Date());
        user.setLastupdate(new Date());
        this.createNewUser(user);
        if(organization!=null){
            wfStaffBlo.createStaff(user,organization);
        }
        return ServiceResult.success();
    }




    private String generateName() {
        Random random = new Random();
        StringBuilder name = new StringBuilder("匿名用户_");
        for (int i = 0; i < 4; i++) {
            int i1 = random.nextInt(9);//生成随机数字
            name.append(i1);
        }
        return name.toString();
    }


}

