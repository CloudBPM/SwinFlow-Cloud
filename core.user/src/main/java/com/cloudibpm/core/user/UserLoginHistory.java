package com.cloudibpm.core.user;

import java.util.Date;

import com.cloudibpm.core.WorkflowEntity;

public class UserLoginHistory extends WorkflowEntity {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 7411760039830599193L;
	private String fk_User = null;
	private String sessionId = null;
	private Date lastLoginTime = null;
	private Date lastLogoutTime = null;
	private int statusCode = 0;
	private String device = null;
	private String deviceType = null;
	private String deviceManufacturer = null;
	private String os = null;
	private String osType = null;
	private String osManufacturer = null;
	private String browser = null;
	private String browserType = null;
	private String browserVersion = null;
	private String browserManufacturer = null;
	private String ipv4 = null;
	private String ipv6 = null;
	private String country = null;
	private String province = null;
	private String city = null;
	private String town = null;
	private String loginDescription = null;

	public UserLoginHistory() {
	}

	public String getFk_User() {
		return fk_User;
	}

	public void setFk_User(String fk_User) {
		this.fk_User = fk_User;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public Date getLastLoginTime() {
		return lastLoginTime;
	}

	public void setLastLoginTime(Date lastLoginTime) {
		this.lastLoginTime = lastLoginTime;
	}

	public Date getLastLogoutTime() {
		return lastLogoutTime;
	}

	public void setLastLogoutTime(Date lastLogoutTime) {
		this.lastLogoutTime = lastLogoutTime;
	}

	public String getDevice() {
		return device;
	}

	public void setDevice(String device) {
		this.device = device;
	}

	public String getDeviceType() {
		return deviceType;
	}

	public void setDeviceType(String deviceType) {
		this.deviceType = deviceType;
	}

	public String getDeviceManufacturer() {
		return deviceManufacturer;
	}

	public void setDeviceManufacturer(String deviceManufacturer) {
		this.deviceManufacturer = deviceManufacturer;
	}

	public String getOs() {
		return os;
	}

	public void setOs(String os) {
		this.os = os;
	}

	public String getOsType() {
		return osType;
	}

	public void setOsType(String osType) {
		this.osType = osType;
	}

	public String getOsManufacturer() {
		return osManufacturer;
	}

	public void setOsManufacturer(String osManufacturer) {
		this.osManufacturer = osManufacturer;
	}

	public String getBrowser() {
		return browser;
	}

	public void setBrowser(String browser) {
		this.browser = browser;
	}

	public String getBrowserVersion() {
		return browserVersion;
	}

	public void setBrowserVersion(String browserVersion) {
		this.browserVersion = browserVersion;
	}

	public String getBrowserType() {
		return browserType;
	}

	public void setBrowserType(String browserType) {
		this.browserType = browserType;
	}

	public String getBrowserManufacturer() {
		return browserManufacturer;
	}

	public void setBrowserManufacturer(String browserManufacturer) {
		this.browserManufacturer = browserManufacturer;
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

	public String getTown() {
		return town;
	}

	public void setTown(String town) {
		this.town = town;
	}

	public String getIPv4() {
		return ipv4;
	}

	public void setIPv4(String ipv4) {
		this.ipv4 = ipv4;
	}

	public String getIPv6() {
		return ipv6;
	}

	public void setIPv6(String ipv6) {
		this.ipv6 = ipv6;
	}

	public String getLoginDescription() {
		return loginDescription;
	}

	public void setLoginDescription(String loginDescription) {
		this.loginDescription = loginDescription;
	}

	public int getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}
}
