/**
 * AdaptiveFlo.com
 */
package com.cloudibpm.core.organization;

import com.cloudibpm.core.TreeNode;

/**
 * @author CAO Dahai
 * @modified on 2016-07-27 14:36pm
 */
public class Organization extends AbstractOrganization {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 4729193491831402149L;
	private String abbrLocal = null;
	private String nameInternational = null;
	private String abbrInternational = null;
	private String registrationCode = null;
	private long registrationDate = 0L;
	private String registeredcapital = null;
	// 法人
	private String representative = null;
	private String address = null;
	private String county = null;
	private String city = null;
	private String province = null;
	private String country = null;
	private String postCode = null;
	private String phoneNumber = null;
	private String faxNumber = null;
	private String website = null;
	private String email = null;
	private String microblog = null;
	private String webchat = null;
	private String customerService = null;
	private String isHeadOffice = "N";
	private String businessScope = null;
	private String introduction = null;

	private String bankAccountNumber = null;
	private String bankAccountName = null;
	private String bankAddress = null;
	private String bsb = null;
	private String fkStaff = null;
	private String apiAccessKey = null;
	private String apiSecretKey = null;
	private String businessCategory = null;
	private String businessContent = null;
	private String businessType = null;
	private String staffNumber = null;
	private int uniCount = -1;
	// 所属派出所
	private String policeStation = null;
	// 负责民警
	private String police = null;
	private String policeIdNumber = null;
	private String policeMobile = null;
	// 类目名称
	private String categoryName;
	// 实际负责人
	private String realChargement = null;
	// 实际负责人ID
	private String realChargementId = null;
	// 单位性质
	private String unitProperties = null;
	private String representaivIdNumber = null;
	private String realChargementIdNumber = null;
	private String representaivMobile = null;
	private String realChargementMobile = null;
	// 联络员
	private String liaisonMan = null;
	private String liaisonManIdNumber = null;
	private String liaisonManMobile = null;
	// 安全负责人
	private String headOfSecurity = null;
	private String headOfSecurityIdNumber = null;
	private String headOfSecurityMobile = null;
	// 辅警
	private String auxiliaryPolice = null;
	private String auxiliaryPoliceIdNumber = null;
	private String auxiliaryPoliceMobile = null;

	public String getAuxiliaryPoliceMobile() {
		return auxiliaryPoliceMobile;
	}

	public void setAuxiliaryPoliceMobile(String auxiliaryPoliceMobile) {
		this.auxiliaryPoliceMobile = auxiliaryPoliceMobile;
	}
	public String getAuxiliaryPoliceIdNumber() {
		return auxiliaryPoliceIdNumber;
	}

	public void setAuxiliaryPoliceIdNumber(String auxiliaryPoliceIdNumber) {
		this.auxiliaryPoliceIdNumber = auxiliaryPoliceIdNumber;
	}
	public String getAuxiliaryPolice() {
		return auxiliaryPolice;
	}

	public void setAuxiliaryPolice(String auxiliaryPolice) {
		this.auxiliaryPolice = auxiliaryPolice;
	}
	public String getPoliceIdNumber() {
		return policeIdNumber;
	}

	public void setPoliceIdNumber(String policeIdNumber) {
		this.policeIdNumber = policeIdNumber;
	}

	public String getPoliceMobile() {
		return policeMobile;
	}

	public void setPoliceMobile(String policeMobile) {
		this.policeMobile = policeMobile;
	}

	public String getRepresentaivIdNumber() {
		return representaivIdNumber;
	}

	public void setRepresentaivIdNumber(String representaivIdNumber) {
		this.representaivIdNumber = representaivIdNumber;
	}

	public String getRealChargementIdNumber() {
		return realChargementIdNumber;
	}

	public void setRealChargementIdNumber(String realChargementIdNumber) {
		this.realChargementIdNumber = realChargementIdNumber;
	}

	public String getLiaisonManIdNumber() {
		return liaisonManIdNumber;
	}

	public void setLiaisonManIdNumber(String liaisonManIdNumber) {
		this.liaisonManIdNumber = liaisonManIdNumber;
	}

	public String getHeadOfSecurityIdNumber() {
		return headOfSecurityIdNumber;
	}

	public void setHeadOfSecurityIdNumber(String headOfSecurityIdNumber) {
		this.headOfSecurityIdNumber = headOfSecurityIdNumber;
	}

	public String getPolice() {
		return police;
	}

	public void setPolice(String police) {
		this.police = police;
	}

	public String getPoliceStation() {
		return policeStation;
	}

	public void setPoliceStation(String policeStation) {
		this.policeStation = policeStation;
	}

	public String getLiaisonMan() {
		return liaisonMan;
	}

	public void setLiaisonMan(String liaisonMan) {
		this.liaisonMan = liaisonMan;
	}

	public String getLiaisonManMobile() {
		return liaisonManMobile;
	}

	public void setLiaisonManMobile(String liaisonManMobile) {
		this.liaisonManMobile = liaisonManMobile;
	}

	public String getHeadOfSecurity() {
		return headOfSecurity;
	}

	public void setHeadOfSecurity(String headOfSecurity) {
		this.headOfSecurity = headOfSecurity;
	}

	public String getHeadOfSecurityMobile() {
		return headOfSecurityMobile;
	}

	public void setHeadOfSecurityMobile(String headOfSecurityMobile) {
		this.headOfSecurityMobile = headOfSecurityMobile;
	}

	public String getFkStaff() {
		return fkStaff;
	}

	public void setFkStaff(String fkStaff) {
		this.fkStaff = fkStaff;
	}

	public String getUnitProperties() {
		return unitProperties;
	}

	public void setUnitProperties(String unitProperties) {
		this.unitProperties = unitProperties;
	}

	public String getRepresentaivMobile() {
		return representaivMobile;
	}

	public void setRepresentaivMobile(String representaivMobile) {
		this.representaivMobile = representaivMobile;
	}

	public String getRealChargementMobile() {
		return realChargementMobile;
	}

	public void setRealChargementMobile(String realChargementMobile) {
		this.realChargementMobile = realChargementMobile;
	}

	public String getRealChargement() {
		return realChargement;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public void setRealChargement(String realChargement) {
		this.realChargement = realChargement;
	}

	public String getRealChargementId() {
		return realChargementId;
	}

	public void setRealChargementId(String realChargementId) {
		this.realChargementId = realChargementId;
	}

	/**
	 * WfOrganization Constructor
	 * 
	 * @date 2008-9-30 下午05:07:14
	 * @modified 2016-07-27 14:34pm
	 * @author CAO Dahai
	 */
	public Organization() {
	}

	/**
	 * @param id
	 */
	public Organization(String id) {
		super(id);
	}

	public int compareTo(TreeNode o) {
		if (o instanceof Organization) {
			this.getName().compareTo(((Organization) o).getName());
		}
		return 0;
	}

	/**
	 * @return the abbrLocal
	 */
	public String getAbbrLocal() {
		return abbrLocal;
	}

	/**
	 * @param abbrLocal
	 *            the abbrLocal to set
	 */
	public void setAbbrLocal(String abbrLocal) {
		this.abbrLocal = abbrLocal;
	}

	/**
	 * @return the nameInternational
	 */
	public String getNameInternational() {
		return nameInternational;
	}

	/**
	 * @param nameInternational
	 *            the nameInternational to set
	 */
	public void setNameInternational(String nameInternational) {
		this.nameInternational = nameInternational;
	}

	/**
	 * @return the abbrInternational
	 */
	public String getAbbrInternational() {
		return abbrInternational;
	}

	/**
	 * @param abbrInternational
	 *            the abbrInternational to set
	 */
	public void setAbbrInternational(String abbrInternational) {
		this.abbrInternational = abbrInternational;
	}

	/**
	 * @return the registrationCode
	 */
	public String getRegistrationCode() {
		return registrationCode;
	}

	/**
	 * @param registrationCode
	 *            the registrationCode to set
	 */
	public void setRegistrationCode(String registrationCode) {
		this.registrationCode = registrationCode;
	}

	public String getRegisteredcapital() {
		return registeredcapital;
	}

	/**
	 * @param registrationCode
	 *            the registrationCode to set
	 */
	public void setRegisteredcapital(String registeredcapital) {
		this.registeredcapital = registeredcapital;
	}

	/**
	 * @return the registrationDate
	 */
	public long getRegistrationDate() {
		return registrationDate;
	}

	/**
	 * @param registrationDate
	 *            the registrationDate to set
	 */
	public void setRegistrationDate(long registrationDate) {
		this.registrationDate = registrationDate;
	}

	/**
	 * @return the representative
	 */
	public String getRepresentative() {
		return representative;
	}

	/**
	 * @param representative
	 *            the representative to set
	 */
	public void setRepresentative(String representative) {
		this.representative = representative;
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

	/**
	 * @return the postCode
	 */
	public String getPostCode() {
		return postCode;
	}

	/**
	 * @param postCode
	 *            the postCode to set
	 */
	public void setPostCode(String postCode) {
		this.postCode = postCode;
	}

	/**
	 * @return the phoneNumber
	 */
	public String getPhoneNumber() {
		return phoneNumber;
	}

	/**
	 * @param phoneNumber
	 *            the phoneNumber to set
	 */
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	/**
	 * @return the faxNumber
	 */
	public String getFaxNumber() {
		return faxNumber;
	}

	/**
	 * @param faxNumber
	 *            the faxNumber to set
	 */
	public void setFaxNumber(String faxNumber) {
		this.faxNumber = faxNumber;
	}

	/**
	 * @return the website
	 */
	public String getWebsite() {
		return website;
	}

	/**
	 * @param website
	 *            the website to set
	 */
	public void setWebsite(String website) {
		this.website = website;
	}

	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * @param email
	 *            the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * @return the microblog
	 */
	public String getMicroblog() {
		return microblog;
	}

	/**
	 * @param microblog
	 *            the microblog to set
	 */
	public void setMicroblog(String microblog) {
		this.microblog = microblog;
	}

	/**
	 * @return the webchat
	 */
	public String getWebchat() {
		return webchat;
	}

	/**
	 * @param webchat
	 *            the webchat to set
	 */
	public void setWebchat(String webchat) {
		this.webchat = webchat;
	}

	/**
	 * @return the customerService
	 */
	public String getCustomerService() {
		return customerService;
	}

	/**
	 * @param customerService
	 *            the customerService to set
	 */
	public void setCustomerService(String customerService) {
		this.customerService = customerService;
	}

	/**
	 * @return the isHeadOffice
	 */
	public String isHeadOffice() {
		return isHeadOffice;
	}

	/**
	 * @param isHeadOffice
	 *            the isHeadOffice to set
	 */
	public void setHeadOffice(String isHeadOffice) {
		this.isHeadOffice = isHeadOffice;
	}

	/**
	 * @return the businessScope
	 */
	public String getBusinessScope() {
		return businessScope;
	}

	/**
	 * @param businessScope
	 *            the businessScope to set
	 */
	public void setBusinessScope(String businessScope) {
		this.businessScope = businessScope;
	}

	public String getBusinessContent() {
		return businessContent;
	}

	/**
	 * @param businessScope
	 *            the businessScope to set
	 */
	public void setBusinessContent(String businessContent) {
		this.businessContent = businessContent;
	}

	/**
	 * @return the introduction
	 */
	public String getIntroduction() {
		return introduction;
	}

	/**
	 * @param introduction
	 *            the introduction to set
	 */
	public void setIntroduction(String introduction) {
		this.introduction = introduction;
	}

	/**
	 * @return the bankAccountNumber
	 */
	public String getBankAccountNumber() {
		return bankAccountNumber;
	}

	/**
	 * @param bankAccountNumber
	 *            the bankAccountNumber to set
	 */
	public void setBankAccountNumber(String bankAccountNumber) {
		this.bankAccountNumber = bankAccountNumber;
	}

	/**
	 * @return the bankAccountName
	 */
	public String getBankAccountName() {
		return bankAccountName;
	}

	/**
	 * @param bankAccountName
	 *            the bankAccountName to set
	 */
	public void setBankAccountName(String bankAccountName) {
		this.bankAccountName = bankAccountName;
	}

	/**
	 * @return the bankAddress
	 */
	public String getBankAddress() {
		return bankAddress;
	}

	/**
	 * @param bankAddress
	 *            the bankAddress to set
	 */
	public void setBankAddress(String bankAddress) {
		this.bankAddress = bankAddress;
	}

	/**
	 * @return the bsb
	 */
	public String getBsb() {
		return bsb;
	}

	/**
	 * @param bsb
	 *            the bsb to set
	 */
	public void setBsb(String bsb) {
		this.bsb = bsb;
	}

	/**
	 * @return the apiAccessKey
	 */
	public String getApiAccessKey() {
		return apiAccessKey;
	}

	/**
	 * @param apiAccessKey
	 *            the apiAccessKey to set
	 */
	public void setApiAccessKey(String apiAccessKey) {
		this.apiAccessKey = apiAccessKey;
	}

	/**
	 * @return the apiSecretKey
	 */
	public String getApiSecretKey() {
		return apiSecretKey;
	}

	/**
	 * @param apiSecretKey
	 *            the apiSecretKey to set
	 */
	public void setApiSecretKey(String apiSecretKey) {
		this.apiSecretKey = apiSecretKey;
	}

	/**
	 * @return the businessType
	 */
	public String getBusinessType() {
		return businessType;
	}

	/**
	 * @param businessType
	 *            the businessType to set
	 */
	public void setBusinessType(String businessType) {
		this.businessType = businessType;
	}

	public String toString() {
		return this.getName();
	}

	/**
	 * @return the staffNumberId
	 */
	public String getStaffNumber() {
		return staffNumber;
	}

	/**
	 * @param staffNumber
	 *            the staffNumber to set
	 */
	public void setStaffNumber(String staffNumber) {
		this.staffNumber = staffNumber;
	}

	/**
	 * @return the businessCategory
	 */
	public String getBusinessCategory() {
		return businessCategory;
	}

	/**
	 * @param businessCategory
	 *            the businessCategory to set
	 */
	public void setBusinessCategory(String businessCategory) {
		this.businessCategory = businessCategory;
	}

	public String getCounty() {
		return county;
	}

	public void setCounty(String county) {
		this.county = county;
	}

	/**
	 * @return the city
	 */
	public String getCity() {
		return city;
	}

	/**
	 * @param city
	 *            the city to set
	 */
	public void setCity(String city) {
		this.city = city;
	}

	/**
	 * @return the province
	 */
	public String getProvince() {
		return province;
	}

	/**
	 * @param province
	 *            the province to set
	 */
	public void setProvince(String province) {
		this.province = province;
	}

	/**
	 * @return the country
	 */
	public String getCountry() {
		return country;
	}

	/**
	 * @param country
	 *            the country to set
	 */
	public void setCountry(String country) {
		this.country = country;
	}

	public int getUniCount() {
		return uniCount;
	}

	public void setUniCount(int uniCount) {
		this.uniCount = uniCount;
	}
}