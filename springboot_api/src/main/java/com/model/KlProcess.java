package com.model;

/**
 * @author Dahai Cao
 */
public class KlProcess { 

	private String id = null;
	private String name = null;
	private String code=null;
	private String type=null;
	private String alias=null;
	//行业资讯
	private String industryName=null;
	private String industryContent=null;
	private String industryOwner=null;
	private String industryUser=null;
	private String industryType=null;
	private String industryStatus=null;
	private long lastupdate=0;

	public String getIndustryName() {
		return industryName;
	}
	public void setIndustryName(String industryName) {
		this.industryName = industryName;
	}
	
	public String getIndustryContent() {
		return industryContent;
	}
	public void setIndustryContent(String industryContent) {
		this.industryContent = industryContent;
	}
	
	public String getIndustryOwner() {
		return industryOwner;
	}

	public void setIndustryOwner(String industryOwner) {
		this.industryOwner = industryOwner;
	}
	public String getIndustryUser() {
		return industryUser;
	}

	public void setIndustryUser(String industryUser) {
		this.industryUser = industryUser;
	}
	public String getIndustryType() {
		return industryType;
	}

	public void setIndustryType(String industryType) {
		this.industryType = industryType;
	}
	public String getIndustryStatus() {
		return industryStatus;
	}

	public void setIndustryStatus(String industryStatus) {
		this.industryStatus = industryStatus;
	}
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return this.code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	
	public void setLastupdate(long lastupdate) {
		this.lastupdate = lastupdate;
	}

	public long getLastupdate() {
		return lastupdate;
	}


	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}
}