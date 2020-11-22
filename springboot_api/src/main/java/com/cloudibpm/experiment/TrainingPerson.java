/**
 * 
 */
package com.cloudibpm.experiment;

import com.cloudibpm.core.WorkflowEntity;

/**
 * @author great sea
 * @date 2018-05-20
 *
 */
public class TrainingPerson extends WorkflowEntity {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 1054284952122827672L;
	private String firstName = "";
	private String lastName = "";
	private int gender = 0;// 0： male; 1:female;
	private String birthday = null;
	private String address = "";
	private String postcode = "";
	private int degree = 0;
	private String mobile="";
	private String introduction="";
	private String lastUpdate=null;
	

	/**
	 * Constructor
	 */
	public TrainingPerson() {
	}

	/**
	 * Constructor
	 * 
	 * @param id
	 *            String
	 */
	public TrainingPerson(String id) {
		super(id);
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public int getGender() {
		return gender;
	}

	public void setGender(int gender) {
		this.gender = gender;
	}

	public String getBirthday() {
		return birthday;
	}

	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	public String getPostcode() {
		return postcode;
	}

	public void setPostcode(String postcode) {
		this.postcode = postcode;
	}

	public int getDegree() {
		return degree;
	}

	public void setDegree(int degree) {
		this.degree = degree;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getIntroduction() {
		return introduction;
	}

	public void setIntroduction(String introduction) {
		this.introduction = introduction;
	}

	public String getLastUpdate() {
		return lastUpdate;
	}

	public void setLastUpdate(String lastUpdate) {
		this.lastUpdate = lastUpdate;
	}
}
