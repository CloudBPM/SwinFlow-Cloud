package com.cloudibpm.core.organization;

import com.cloudibpm.core.Page;

public class OrganizationCategoryPage extends Page {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2854509740227957816L;
	private OrganizationCategory[] pageEntities = new OrganizationCategory[0];
	
	public OrganizationCategoryPage() {
	}

	public OrganizationCategoryPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	public OrganizationCategory[] getPageEntities() {
		return pageEntities;
	}

	public void setPageEntities(OrganizationCategory[] pageEntities) {
		this.pageEntities = pageEntities;
	}
	
	
	
	
	
	
}
