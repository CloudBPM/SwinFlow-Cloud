/**
 *
 */
package com.cloudibpm.blo.om.organization;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.folder.WfFolderBlo;
import com.cloudibpm.blo.om.authorization.WfAuthorityBlo;
import com.cloudibpm.blo.om.authorization.WfAuthorityGroupBlo;
import com.cloudibpm.blo.om.authorization.WfGroupMemberBlo;
import com.cloudibpm.blo.om.user.WfStaffBlo;
import com.cloudibpm.core.authorization.AuthorityGroup;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.folder.FolderType;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.runtime.util.mail.SMTPSender;
import com.cloudibpm.core.user.User;
import com.cloudibpm.core.util.PassGenerator;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.core.util.encode.MD5Util;
import com.cloudibpm.core.util.encode.SecretKeyUtil;
import com.cloudibpm.core.util.file.FileUtil;
import com.cloudibpm.eso.om.organization.WfOrganizationEso;
import com.cloudibpm.eso.om.user.WfUserEso;
import com.cloudibpm.eso.sftp.SFTPUtils;
import com.jcraft.jsch.ChannelSftp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

/**
 * @author Dahai
 * @version 1.10.1
 * @since 2016-07-20
 */
@Service
//@Transactional
public class RegistrateOrganizationBlo extends BusinessLogicObject {
	private final BuildtimeIDGenerator buildtimeIDGenerator;
	private final WfFolderBlo wfFolderBlo;
	private final WfAuthorityGroupBlo wfAuthorityGroupBlo;
	private final WfAuthorityBlo wfAuthorityBlo;
	private final WfGroupMemberBlo wfGroupMemberBlo;
	private final WfOrganizationEso wfOrganizationEso;
	private final WfUserEso wfUserEso;
	private final WfStaffBlo wfStaffBlo;

	@Autowired
	public RegistrateOrganizationBlo(BuildtimeIDGenerator buildtimeIDGenerator,
									 WfFolderBlo wfFolderBlo,
									 WfAuthorityGroupBlo wfAuthorityGroupBlo,
									 WfAuthorityBlo wfAuthorityBlo,
									 WfGroupMemberBlo wfGroupMemberBlo,
									 OrganizationBlo organizationBlo,
									 WfUserEso wfUserEso,
									 WfStaffBlo wfStaffBlo,
									 WfOrganizationEso wfOrganizationEso) {
		this.buildtimeIDGenerator = buildtimeIDGenerator;
		this.wfFolderBlo = wfFolderBlo;
		this.wfAuthorityGroupBlo = wfAuthorityGroupBlo;
		this.wfAuthorityBlo = wfAuthorityBlo;
		this.wfGroupMemberBlo = wfGroupMemberBlo;
		this.wfUserEso = wfUserEso;
		this.wfStaffBlo = wfStaffBlo;
        this.wfOrganizationEso = wfOrganizationEso;
    }


	/**
	 * 在系统中创建（注册）一家组织，如政府，企事业单位，非政府组织。该组织最初处于未激活状态，
	 * 等待轩琦科技的系统管理员审查通过了，就可以激活了，并未该组织配备一些资源，如为该组织组织空间等。
	 *
	 * @author CAO Dahai
	 * @date 2008-10-2 下午03:05:07
	 * @param org
	 *            Organization
	 * @throws Exception
	 */
	public void registerNewOrganization(Organization org) throws Exception {
		// 创建一个新的组织
		org.setId(buildtimeIDGenerator.getNewBuildTimeID());
		org.setLastupdate(System.currentTimeMillis());
		org.setSerialNumber(buildtimeIDGenerator.getNewBuildTimeCode());
		org.setApiAccessKey(SecretKeyUtil.getInstance().createKey());
		org.setApiSecretKey(PassGenerator.getInstance().getPassword(32));
		org.setUniCount(Integer.parseInt(buildtimeIDGenerator.getNewBuildTimeUniCounting()));
		// Status: 3:not in use; 4:in use; 5:write off;
		// 设置组织状态为冻结状态，意味着该组织处于未审核或者未使用状态。
		org.setStatus(3);
		org.setCountry("中国");

		wfOrganizationEso.insert(org);
	}

	/**
	 * This method is used to update organization's status.
	 *
	 * @author Dahai Cao created at 22:23 on 2018/07/03
	 * @param id
	 *            organization Id
	 * @param status
	 *            organization Status. 0: no use (unused or banned), 1: in use
	 * @param date
	 *            time stamp
	 * @throws Exception
	 */
	public void modifyOrganizationStatus(String id, int status, long date) throws Exception {
		Organization org = wfOrganizationEso.queryByPK(id);
		wfOrganizationEso.updateStatus(id, status, date);
		if (status == 4 && CollectionUtils.isEmpty(wfFolderBlo.queryFolderByOwnerId(id))) {
			this.createFolders(org);
			this.createAuthorizationGroups(org);
			this.createOrganizationFileDir(id);
			String type=SystemConfig.getProp("filestorage.type");
			if(type.equals("win")){
				String path = SystemConfig.getProp("windows.filestorage.lib");
				Path dir= Paths.get(path, "org",id);
				Files.createDirectories(dir);
			}else if(type.equals("linux")){
				String path = SystemConfig.getProp("linux.filestorage.lib");
				ChannelSftp connectSFTP = SFTPUtils.connectSFTP();
				connectSFTP.cd(path);
				connectSFTP.mkdir("org");
				connectSFTP.cd(path+"/org");
				connectSFTP.mkdir(id);
			}

		}
	}

	/**
	 * 为组织创建文件夹，这个文件夹是在数据库中的Folder表里的记录，而不是在硬盘中的文件夹，它类似于菜单，添加一个文件夹，就等于添加一个菜单。
	 *
	 * @param org
	 *            Organization
	 * @throws Exception
	 */
	public void createFolders(Organization org) throws Exception {
		// 组织人事部
		wfFolderBlo.create("组织结构", Folder.SYSTEM, FolderType.STRUCTURE_FOLDER, org, org.getId());
		wfFolderBlo.create("办公日历", Folder.SYSTEM, FolderType.CALENDAR_FOLDER, org, org.getId());
		wfFolderBlo.create("假期表", Folder.SYSTEM, FolderType.HOLIDAY_FOLDER, org, org.getId());
		wfFolderBlo.create("全体职员", Folder.SYSTEM, FolderType.USER_FOLDER, org, org.getId());
		wfFolderBlo.create("权限组", Folder.SYSTEM, FolderType.GROUP_FOLDER, org, org.getId());
//		wfFolderBlo.create("主页制作", Folder.SYSTEM, FolderType.HOMEPABGE_FOLDER, org, org.getId());
		wfFolderBlo.create("资料上传", Folder.SYSTEM, FolderType.LICENSE_FOLDER, org, org.getId());
		wfFolderBlo.create("文件管理", Folder.SYSTEM, FolderType.FILE_FOLDER, org, org.getId());
		wfFolderBlo.create("公司账号", Folder.SYSTEM, FolderType.PAYMENT_FOLDER, org, org.getId());
		// 应用坊
		wfFolderBlo.create("已发布应用", Folder.SYSTEM, FolderType.RELEASED_PROCESS_FOLDER, org, org.getId());
		wfFolderBlo.create("未发布应用", Folder.SYSTEM, FolderType.PROCESS_FOLDER, org, org.getId());
		// 表单据
		wfFolderBlo.create("基础数据", Folder.SYSTEM, FolderType.BASIC_DATA_FOLDER, org, org.getId());
		wfFolderBlo.create("引用数据", Folder.SYSTEM, FolderType.REFERENCE_DATA_FOLDER, org, org.getId());
		wfFolderBlo.create("未发布表单", Folder.SYSTEM, FolderType.FORM_FOLDER, org, org.getId());
		wfFolderBlo.create("已发布表单", Folder.SYSTEM, FolderType.RELEASED_FORM_FOLDER, org, org.getId());
		// 微服务库
		wfFolderBlo.create("手机APP微服务", Folder.SYSTEM, FolderType.MOBILE_APP_FOLDER, org, org.getId());
		wfFolderBlo.create("Web微服务器", Folder.SYSTEM, FolderType.DOCKER_FOLDER, org, org.getId());
		wfFolderBlo.create("Web微服务API", Folder.SYSTEM, FolderType.WEB_SERVICE_FOLDER, org, org.getId());
		wfFolderBlo.create("短信发送模板", Folder.SYSTEM, FolderType.SMS_SENDING_TEMPLATE_FOLDER, org, org.getId());
		wfFolderBlo.create("邮件发送模板", Folder.SYSTEM, FolderType.EMAIL_SENDING_TEMPLATE_FOLDER, org,
				org.getId());
		// 服务台
		wfFolderBlo.create("新闻发布", Folder.SYSTEM, FolderType.NEWS_FOLDER, org, org.getId());
		wfFolderBlo.create("提醒发送", Folder.SYSTEM, FolderType.NOTICE_FOLDER, org, org.getId());
		// 大数据
		// 账房
	}

	/**
	 * 为组织在硬盘上创建一个文件夹，这个文件夹就是组织空间。包括am，pm，om等子目录。
	 *
	 * @param oid
	 *            Organization ID
	 */
	public void createOrganizationFileDir(String oid) {
		String storagetype = SystemConfig.getProp("filestorage.type");
		String syspath = "";
		if (storagetype.trim().equals("win")) {
			syspath = SystemConfig.getProp("windows.filestorage.lib");
		} else if (storagetype.trim().equals("linux")) {
			syspath = SystemConfig.getProp("linux.filestorage.lib");
		} else {

		}

		if (!syspath.equals("")) {
			String amPath = syspath + "/" + oid + "/am"; // 微服务管理的文件目录
			String omPath = syspath + "/" + oid + "/om"; // 组织管理的文件目录
			String adminPath = syspath + "/" + oid + "/adm"; // 服务台文件目录
			String bdmPath = syspath + "/" + oid + "/bdm"; // 大数据管理的文件目录
			String fmPath = syspath + "/" + oid + "/fm"; // 表单管理的文件目录
			String rlfPath = syspath + "/" + oid + "/rlf"; // 表单管理的文件目录
			String pmPath = syspath + "/" + oid + "/pm"; // 构造时应用的文件目录
			String rlpPath = syspath + "/" + oid + "/rlp"; // 发布后应用的文件目录
			String rtPath = syspath + "/" + oid + "/rt"; // 运行中的应用文件目录
			String trPath = syspath + "/" + oid + "/train"; // 内容服务文件目录
			// 创建组织目录
			FileUtil.createDir(syspath + "/" + oid);
			// 创建基本文件夹目录
			FileUtil.createDir(amPath);
			FileUtil.createDir(omPath);
			FileUtil.createDir(pmPath);
			FileUtil.createDir(adminPath);
			FileUtil.createDir(bdmPath);
			FileUtil.createDir(fmPath);
			FileUtil.createDir(rlfPath);
			FileUtil.createDir(rlpPath);
			FileUtil.createDir(rtPath);
			FileUtil.createDir(trPath);
			// 创建子目录
			// 创建邮件附件文件夹
			FileUtil.createDir(amPath + "/emltp");
			// 创建组织资料文件夹
			FileUtil.createDir(omPath + "/idcard");
			FileUtil.createDir(omPath + "/licence");
			FileUtil.createDir(omPath + "/logo");
		}
	}

	public void createAuthorizationGroups(Organization owner) throws Exception {
		// 为该组织创建用户权限组。
		// 一般公司都有这几个组。所以默认在创建组织的时候，应该将这几个权限组同时创建。
		AuthorityGroup group1 = wfAuthorityGroupBlo.add("系统管理员组", "该组具有系统的所有权限", owner.getId());
		wfAuthorityBlo.authorization(group1.getId(), "0000000001", owner.getId());
		wfAuthorityBlo.authorization(group1.getId(), "0000000002", owner.getId());
		wfAuthorityBlo.authorization(group1.getId(), "0000000003", owner.getId());
		wfAuthorityBlo.authorization(group1.getId(), "0000000004", owner.getId());
		wfAuthorityBlo.authorization(group1.getId(), "0000000005", owner.getId());
		wfAuthorityBlo.authorization(group1.getId(), "0000000006", owner.getId());
		wfAuthorityBlo.authorization(group1.getId(), "0000000008", owner.getId());
		wfAuthorityBlo.authorization(group1.getId(), "0000000009", owner.getId());

//		User user1 = systemCreateNewUser("admin" + owner.getUniCount(), "系统管理员" + owner.getUniCount(), owner);
//		Staff staff1 = wfStaffBlo.createStaff(user1, owner, false);
//		wfGroupMemberBlo.addUserIntoGroup(staff1, group1);

		// -- The following codes add a back door user to new organization
		// User userAdmin =
		// WfUserBlo.getInstance().getUserByID("00000000000001b");
		// Staff staffAdmin = WfStaffBlo.getInstance().createStaff(userAdmin,
		// owner, true);
		// WfGroupMemberBlo.getInstance().addUserIntoGroup(staffAdmin, group1);
		// -- The above codes add a back door user to new organization

//		AuthorityGroup group2 = wfAuthorityGroupBlo.add("应用研发组", "该组具有应用管理、政府企事业单位管理、微服务管理、表单及数据管理等权限",
//				owner.getId());
//		wfAuthorityBlo.authorization(group2.getId(), "0000000001", owner.getId());
//		wfAuthorityBlo.authorization(group2.getId(), "0000000002", owner.getId());
//		wfAuthorityBlo.authorization(group2.getId(), "0000000003", owner.getId());
//		wfAuthorityBlo.authorization(group2.getId(), "0000000004", owner.getId());
//
//		AuthorityGroup group3 = wfAuthorityGroupBlo.add("应用管理组", "该组具有应用管理全部权限", owner.getId());
//		wfAuthorityBlo.authorization(group3.getId(), "0000000005", owner.getId());

		AuthorityGroup group4 = wfAuthorityGroupBlo.add("非系统管理员组", "该组仅具登录查看客户端权限", owner.getId());
		wfAuthorityBlo.authorization(group4.getId(), "0000000006", owner.getId());

//		AuthorityGroup group7 = wfAuthorityGroupBlo.add("大数据组", "该组具有云BPM流程大数据分析权限", owner.getId());
//		wfAuthorityBlo.authorization(group7.getId(), "0000000008", owner.getId());
//
//		AuthorityGroup group8 = wfAuthorityGroupBlo.add("计费管理组", "该组具有计费管理权限", owner.getId());
//		wfAuthorityBlo.authorization(group8.getId(), "0000000009", owner.getId());
	}

	public User systemCreateNewUser(String username, String fullname, Organization owner) throws Exception {
		User user = new User();
		user.setId(buildtimeIDGenerator.getNewBuildTimeID());
		user.setName(username);
		String newpass = PassGenerator.getInstance().getPassword(8);
		SMTPSender.sendEmail(owner.getEmail(), "轩琦科技 - 通知邮件", "您的新密码已经生成：" + newpass);
		String newpass1 = MD5Util.getMD5(newpass);
		// Password: "98GTu9Qj"
		// String newpass1 = "364de30ec6b39054408e981168bed6d7";
		user.setPasswd(newpass1);
		user.setPasswdExpirationDate(null);// never expire
		user.setGivenname(fullname);
		user.setSurname(fullname);
		user.setOwner(owner.getId());
		user.setRegistrationDate(new Date());
		user.setLastupdate(new Date());
		wfUserEso.insert(user);
		return user;
	}





	// // 创建以一个管理组织，也就是具有超级权限的管理组织。
	// public void registerAdminOrganization(Organization org) throws Exception
	// {
	// // 创建一个新的组织
	// org.setId(buildtimeIDGenerator.getNewBuildTimeID());
	// org.setLastupdate(new Date());
	// org.setSerialNumber(buildtimeIDGenerator.getNewBuildTimeCode());
	// org.setApiAccessKey(SecretKeyUtil.getInstance().createKey());
	// org.setApiSecretKey(PassGenerator.getInstance().getPassword(32));
	// org.setUniCount(Integer.parseInt(buildtimeIDGenerator.getNewBuildTimeUniCounting()));
	// WfOrganizationEso organizationEso = new WfOrganizationEso();
	// organizationEso.insert(org);
	// wfFolderBlo.create("流程", Folder.SYSTEM,
	// Folder.PROCESS_FOLDER, org, org.getId());
	// wfFolderBlo.create("数据及表单", Folder.SYSTEM,
	// Folder.FORM_FOLDER, org, org.getId());
	// wfFolderBlo.create("组织结构", Folder.SYSTEM,
	// Folder.STRUCTURE_FOLDER, org, org.getId());
	// wfFolderBlo.create("办公日历", Folder.SYSTEM,
	// Folder.CALENDAR_FOLDER, org, org.getId());
	// wfFolderBlo.create("全体职员", Folder.SYSTEM,
	// Folder.USER_FOLDER, org, org.getId());
	// wfFolderBlo.create("权限组", Folder.SYSTEM,
	// Folder.GROUP_FOLDER, org, org.getId());
	// wfFolderBlo.create("已发布流程", Folder.SYSTEM,
	// Folder.RELEASED_PROCESS_FOLDER, org, org.getId());
	// wfFolderBlo.create("短信发送模板", Folder.SYSTEM,
	// Folder.SMS_SENDING_TEMPLATE_FOLDER, org, org.getId());
	// wfFolderBlo.create("邮件发送模板", Folder.SYSTEM,
	// Folder.EMAIL_SENDING_TEMPLATE_FOLDER, org,
	// org.getId());
	// wfFolderBlo.create("组织注册审核", Folder.SYSTEM,
	// Folder.ORG_APPROVAL_FOLDER, org, org.getId());
	// wfFolderBlo.create("内嵌微服务", Folder.SYSTEM,
	// Folder.DOCKER_FOLDER, org, org.getId());
	// wfFolderBlo.create("外部微服务", Folder.SYSTEM,
	// Folder.WEB_SERVICE_FOLDER, org, org.getId());
	// createAuthorizationGroups(org);
	// createAdminAuthorizationGroups(org);
	// }
	//
	// public void createAdminAuthorizationGroups(Organization owner) throws
	// Exception {
	// // 为该组织创建用户权限组。
	// // 一般公司都有这几个组。所以默认在创建组织的时候，应该将这几个权限组同时创建。
	// // ----------------------------------------
	// // Create authorization group
	// AuthorityGroup group1 =
	// wfAuthorityGroupBlo.addNewGroup("超级管理员组",
	// "该组具有云BPM系统的所有权限",
	// owner.getId());
	// // Authorization (Add authorities)
	// wfAuthorityBlo.authorization(group1.getId(), "0000000001",
	// owner.getId());
	// wfAuthorityBlo.authorization(group1.getId(), "0000000002",
	// owner.getId());
	// wfAuthorityBlo.authorization(group1.getId(), "0000000003",
	// owner.getId());
	// wfAuthorityBlo.authorization(group1.getId(), "0000000004",
	// owner.getId());
	// wfAuthorityBlo.authorization(group1.getId(), "0000000005",
	// owner.getId());
	// wfAuthorityBlo.authorization(group1.getId(), "0000000006",
	// owner.getId());
	// wfAuthorityBlo.authorization(group1.getId(), "0000000007",
	// owner.getId());
	// wfAuthorityBlo.authorization(group1.getId(), "0000000008",
	// owner.getId());
	// wfAuthorityBlo.authorization(group1.getId(), "0000000009",
	// owner.getId());
	// int c = owner.getUniCount();
	// // Create a user
	// User user1 = systemCreateNewUser("admin" + c, "系统管理员" + c, owner);
	// // Add user to organization
	// Staff staff1 = WfStaffBlo.getInstance().createStaff(user1, owner);
	// // Add staff into group
	// WfGroupMemberBlo.getInstance().addUserIntoGroup(staff1, group1);
	//
	// // ----------------------------------------
	// // Create authorization group
	// AuthorityGroup group2 =
	// wfAuthorityGroupBlo.addNewGroup("流程研发组",
	// "该组具有流程管理、政府企事业单位管理、应用访问管理、表单及数据管理等权限", owner.getId());
	// // Authorization (Add authorities)
	// wfAuthorityBlo.authorization(group2.getId(), "0000000001",
	// owner.getId());
	// wfAuthorityBlo.authorization(group2.getId(), "0000000002",
	// owner.getId());
	// wfAuthorityBlo.authorization(group2.getId(), "0000000003",
	// owner.getId());
	// wfAuthorityBlo.authorization(group2.getId(), "0000000004",
	// owner.getId());
	// // Create a user
	// User user2 = systemCreateNewUser("designer" + c, "流程设计师" + c, owner);
	// // Add user to organization
	// Staff staff2 = WfStaffBlo.getInstance().createStaff(user2, owner);
	// // Add staff into group
	// WfGroupMemberBlo.getInstance().addUserIntoGroup(staff2, group2);
	//
	// // ----------------------------------------
	// // Create authorization group
	// AuthorityGroup group3 =
	// wfAuthorityGroupBlo.addNewGroup("流程管理组", "该组具有流程实例管理全部权限",
	// owner.getId());
	// // Authorization (Add authorities)
	// wfAuthorityBlo.authorization(group3.getId(), "0000000005",
	// owner.getId());
	// // Create a user
	// User user3 = systemCreateNewUser("officer" + c, "流程管理员" + c, owner);
	// // Add user to organization
	// Staff staff3 = WfStaffBlo.getInstance().createStaff(user3, owner);
	// // Add staff into group
	// WfGroupMemberBlo.getInstance().addUserIntoGroup(staff3, group3);
	// // ----------------------------------------
	// // Create authorization group
	// AuthorityGroup group4 =
	// wfAuthorityGroupBlo.addNewGroup("普通用户组",
	// "该组具有普通用户登录操作流程实例权限",
	// owner.getId());
	// // Authorization (Add authorities)
	// wfAuthorityBlo.authorization(group4.getId(), "0000000006",
	// owner.getId());
	// // ----------------------------------------
	// // 一般单位不提供该权限。
	// // Create authorization group
	// AuthorityGroup group6 =
	// wfAuthorityGroupBlo.addNewGroup("服务器管理组", "该组具有管理服务器权限",
	// owner.getId());
	// // Authorization (Add authorities)
	// wfAuthorityBlo.authorization(group6.getId(), "0000000007",
	// owner.getId());
	// // Create a user
	// User user6 = systemCreateNewUser("severadm" + c, "服务器管理员" + c, owner);
	// // Add user to organization
	// Staff staff6 = WfStaffBlo.getInstance().createStaff(user6, owner);
	// // Add staff into group
	// WfGroupMemberBlo.getInstance().addUserIntoGroup(staff6, group6);
	// // ----------------------------------------
	// // Create authorization group
	// AuthorityGroup group7 =
	// wfAuthorityGroupBlo.addNewGroup("流程大数据分析组",
	// "该组具有云BPM流程大数据分析权限",
	// owner.getId());
	// // Authorization (Add authorities)
	// wfAuthorityBlo.authorization(group7.getId(), "0000000008",
	// owner.getId());
	// // Create a user
	// User user7 = systemCreateNewUser("biller" + c, "大数据分析员" + c, owner);
	// // Add user to organization
	// Staff staff7 = WfStaffBlo.getInstance().createStaff(user7, owner);
	// // Add staff into group
	// WfGroupMemberBlo.getInstance().addUserIntoGroup(staff7, group7);
	// // ----------------------------------------
	// // Create authorization group
	// AuthorityGroup group8 =
	// wfAuthorityGroupBlo.addNewGroup("计费管理组", "该组具有计费管理权限",
	// owner.getId());
	// // Authorization (Add authorities)
	// wfAuthorityBlo.authorization(group8.getId(), "0000000009",
	// owner.getId());
	// // Create a user
	// User user8 = systemCreateNewUser("ba" + c, "计费管理员" + c, owner);
	// // Add user to organization
	// Staff staff8 = WfStaffBlo.getInstance().createStaff(user8, owner);
	// // Add staff into group
	// WfGroupMemberBlo.getInstance().addUserIntoGroup(staff8, group8);
	// }


}
