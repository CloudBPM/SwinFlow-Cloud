package com.cloudibpm.core.user;

import com.cloudibpm.core.WorkflowEntity;

import java.util.Date;

/**
 * 该类描述了一个自然人的各种属性，包括自然属性：姓名、性别、年龄、生日、身高、体重等，
 * 还包括其社会属性，包括其身份证、民族、实际家庭住址、身份证地址、常用手机号码、常用邮箱等
 * 
 * @author Cao.Da.hai
 * @version 3.0.1, 16/08/2008
 * @since Workflow Peoject 2.0.0 Cloud BPM project 1.0.0
 * @Copyright 2006-2018
 */
public class User extends WorkflowEntity {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -6090796212314695599L;
	/**
	 * User is on duty, this property describes that he(she) is able to accept
	 * and cope with new work items
	 */
	public static final String MALE = "M";
	/**
	 * User leaves corporation. This property describes he(she) has applied to
	 * leave this position and company.
	 */
	public static final String FEMALE = "F";
	private String passwd = "";
	private Date passwdExpirationDate = null;
	private String givenname = "";// fist name, 名字
	private String surname = ""; // last name, family name, 姓
	private String usedName = "";
	private String gender = MALE;
	private Date birthday = null;
	// O, A, B, AB, T, 
	private String bloodType = "O";
	private int age = 0;
	private String idType = "0";
	private String idNumber = "";
	// 体重，以千克为单位。
	private int weight = 0;
	// 身高，以厘米为单位
	private int height = 0;
	private String country = "";// 实际家庭所在国
	private String province = "";// 实际家庭所在省、自治区、直辖市
	private String city = "";// 实际家庭所在市
	private String county = "";// 实际家庭所在区、镇
	private String address = "";// 实际家庭所在地址
	private String postcode = "";// 实际家庭邮编
	private Date registrationDate = null; // 注册日期
	private String email = "";
	private String mobile = "";
	private String ownerName = "";
	private Date lastupdate = null;
	// 0: active，该账户还是可用账户;
	// 1: banned,该账户已经被封掉;
	private int isBanned = 0;
	private String banningDescription = "";
	private boolean dirty = false;
	private int loginCounting = 0;
	private String nation = "";
	private String householdAddress = "";
	private String householdPostcode = "";

	public User() {
		super();
	}

	public User(String id) {
		super();
		setId(id);
	}

	/**
	 * @return the passwd
	 */
	public String getPasswd() {
		return passwd;
	}

	/**
	 * @param passwd
	 *            the passwd to set
	 */
	public void setPasswd(String passwd) {
		this.passwd = passwd;
	}

	public Date getPasswdExpirationDate() {
		return passwdExpirationDate;
	}

	public void setPasswdExpirationDate(Date passwdExpirationDate) {
		this.passwdExpirationDate = passwdExpirationDate;
	}

	/**
	 * @return the gender
	 */
	public String getGender() {
		return gender;
	}

	/**
	 * @param gender
	 *            the gender to set
	 */
	public void setGender(String gender) {
		this.gender = gender;
	}

	/**
	 * @return the birthday
	 */
	public Date getBirthday() {
		return birthday;
	}

	/**
	 * @param birthday
	 *            the birthday to set
	 */
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	/**
	 * @return the idType
	 */
	public String getIdType() {
		return idType;
	}

	/**
	 * @param idType
	 *            the idType to set
	 */
	public void setIdType(String idType) {
		this.idType = idType;
	}

	/**
	 * @return the idNumber
	 */
	public String getIdNumber() {
		return idNumber;
	}

	/**
	 * @param idNumber
	 *            the idNumber to set
	 */
	public void setIdNumber(String idNumber) {
		this.idNumber = idNumber;
	}

	/**
	 * @return the address
	 */
	public String getAddress() {
		return address;
	}

	/**
	 * @param address
	 *            the address to set
	 */
	public void setAddress(String address) {
		this.address = address;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCounty() {
		return county;
	}

	public void setCounty(String county) {
		this.county = county;
	}

	/**
	 * @return the postcode
	 */
	public String getPostcode() {
		return postcode;
	}

	/**
	 * @param postcode
	 *            the postcode to set
	 */
	public void setPostcode(String postcode) {
		this.postcode = postcode;
	}

	/**
	 * @return the registrationDate
	 */
	public Date getRegistrationDate() {
		return registrationDate;
	}

	/**
	 * @param registrationDate
	 *            the registrationDate to set
	 */
	public void setRegistrationDate(Date registrationDate) {
		this.registrationDate = registrationDate;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public Date getLastupdate() {
		return lastupdate;
	}

	public void setLastupdate(Date lastupdate) {
		this.lastupdate = lastupdate;
	}

	public int getIsBanned() {
		return isBanned;
	}

	public void setIsBanned(int isBanned) {
		this.isBanned = isBanned;
	}

	public String getBanningDescription() {
		return banningDescription;
	}

	public void setBanningDescription(String banningDescription) {
		this.banningDescription = banningDescription;
	}

	public boolean isDirty() {
		return dirty;
	}

	public void setDirty(boolean dirty) {
		this.dirty = dirty;
	}

	/**
	 * @return the loginCounting
	 */
	public int getLoginCounting() {
		return loginCounting;
	}

	/**
	 * @param loginCounting
	 *            the loginCounting to set
	 */
	public void setLoginCounting(int loginCounting) {
		this.loginCounting = loginCounting;
	}

	/**
	 * @return the givenname
	 */
	public String getGivenname() {
		return givenname;
	}

	/**
	 * @param givenname
	 *            the givenname to set
	 */
	public void setGivenname(String givenname) {
		this.givenname = givenname;
	}

	public String getFullName() {
		if (this.surname == null && this.givenname == null) {
			return "";
		} else if (this.surname != null && this.givenname == null) {
			return this.surname;
		} else if (this.surname == null && this.givenname != null) {
			return this.givenname;
		} else {
			return this.surname + this.givenname;
		}
	}

	/**
	 * @return the surname
	 */
	public String getSurname() {
		return surname;
	}

	/**
	 * @param surname
	 *            the surname to set
	 */
	public void setSurname(String surname) {
		this.surname = surname;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	/**
	 * @return the usedName
	 */
	public String getUsedName() {
		return usedName;
	}

	/**
	 * @param usedName
	 *            the usedName to set
	 */
	public void setUsedName(String usedName) {
		this.usedName = usedName;
	}

	/**
	 * @return the age
	 */
	public int getAge() {
		return age;
	}

	/**
	 * @param age
	 *            the age to set
	 */
	public void setAge(int age) {
		this.age = age;
	}

	/**
	 * @return the weight
	 */
	public int getWeight() {
		return weight;
	}

	/**
	 * @param weight
	 *            the weight to set
	 */
	public void setWeight(int weight) {
		this.weight = weight;
	}

	/**
	 * @return the height
	 */
	public int getHeight() {
		return height;
	}

	/**
	 * @param height
	 *            the height to set
	 */
	public void setHeight(int height) {
		this.height = height;
	}

	public String getOwnerName() {
		return ownerName;
	}

	public void setOwnerName(String ownerName) {
		this.ownerName = ownerName;
	}

	public String getNation() {
		return nation;
	}

	public void setNation(String nation) {
		this.nation = nation;
	}

	public String getHouseholdAddress() {
		return householdAddress;
	}

	public void setHouseholdAddress(String householdAddress) {
		this.householdAddress = householdAddress;
	}

	/**
	 * @return the bloodType
	 */
	public String getBloodType() {
		return bloodType;
	}

	/**
	 * @param bloodType the bloodType to set
	 */
	public void setBloodType(String bloodType) {
		this.bloodType = bloodType;
	}

	/**
	 * @return the householdPostcode
	 */
	public String getHouseholdPostcode() {
		return householdPostcode;
	}

	/**
	 * @param householdPostcode the householdPostcode to set
	 */
	public void setHouseholdPostcode(String householdPostcode) {
		this.householdPostcode = householdPostcode;
	}

}