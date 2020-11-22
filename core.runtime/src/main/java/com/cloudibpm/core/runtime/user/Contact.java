/**
 * 
 */
package com.cloudibpm.core.runtime.user;

import com.cloudibpm.core.WorkflowEntity;

/**
 * @author Dahai Cao created at 20:16 on 2018-08-24
 */
public class Contact extends WorkflowEntity {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 7200309084349575462L;
	private String staffId = null;
	private String surname = null;
	private String givenName = null;
	private String privateMobile = null;
	private String workMobile = null;
	private String privateEmail = null;
	private String workEmail = null;

	/**
	 * 
	 */
	public Contact() {
	}

	/**
	 * @param id
	 */
	public Contact(String id) {
		super(id);
	}

	/**
	 * @return the staffId
	 */
	public String getStaffId() {
		return staffId;
	}

	/**
	 * @param staffId
	 *            the staffId to set
	 */
	public void setStaffId(String staffId) {
		this.staffId = staffId;
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

	/**
	 * @return the givenName
	 */
	public String getGivenName() {
		return givenName;
	}

	/**
	 * @param givenName
	 *            the givenName to set
	 */
	public void setGivenName(String givenName) {
		this.givenName = givenName;
	}

	/**
	 * @return the privateMobile
	 */
	public String getPrivateMobile() {
		return privateMobile;
	}

	/**
	 * @param privateMobile
	 *            the privateMobile to set
	 */
	public void setPrivateMobile(String privateMobile) {
		this.privateMobile = privateMobile;
	}

	/**
	 * @return the workMobile
	 */
	public String getWorkMobile() {
		return workMobile;
	}

	/**
	 * @param workMobile
	 *            the workMobile to set
	 */
	public void setWorkMobile(String workMobile) {
		this.workMobile = workMobile;
	}

	/**
	 * @return the privateEmail
	 */
	public String getPrivateEmail() {
		return privateEmail;
	}

	/**
	 * @param privateEmail
	 *            the privateEmail to set
	 */
	public void setPrivateEmail(String privateEmail) {
		this.privateEmail = privateEmail;
	}

	/**
	 * @return the workEmail
	 */
	public String getWorkEmail() {
		return workEmail;
	}

	/**
	 * @param workEmail
	 *            the workEmail to set
	 */
	public void setWorkEmail(String workEmail) {
		this.workEmail = workEmail;
	}

}
