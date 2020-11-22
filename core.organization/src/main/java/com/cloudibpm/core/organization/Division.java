/**
 * AdaptiveFlo.com
 */
package com.cloudibpm.core.organization;

/**
 * @author CAO Dahai
 * @version 1.0.0
 * @modified on 2016-07-27 14:36pm
 */
public class Division extends AbstractOrganizationComponent {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -5464655369685729836L;
	
	
	private String country = null;
	private String province = null;
	private String city = null;
	private String county = null;
	private String address;
	private String postCode;
	private String phoneNumber;
	private String faxNumber;
	private String email;
	private int type = -1;
	private String image = null;

	/**
	 * WfDivision Constructor
	 */
	public Division() {
		super();
		setName("Division");
		setClasstypename("Division");
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
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

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPostCode() {
		return postCode;
	}

	public void setPostCode(String postCode) {
		this.postCode = postCode;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getFaxNumber() {
		return faxNumber;
	}

	public void setFaxNumber(String faxNumber) {
		this.faxNumber = faxNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String toString() {
		return getName();
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	
}