package com.cloudibpm.core.runtime.workitem;

import com.cloudibpm.core.Page;

public class WorkitemInfoDescriptorPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 5721994383674855493L;
	private WorkitemInfoDescriptor[] pageEntities = new WorkitemInfoDescriptor[0];

	public WorkitemInfoDescriptorPage() {
	}

	public WorkitemInfoDescriptorPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	/**
	 * @return the pageEntities
	 */
	public WorkitemInfoDescriptor[] getPageEntities() {
		return pageEntities;
	}

	/**
	 * @param pageEntities
	 *            the pageEntities to set
	 */
	public void setPageEntities(WorkitemInfoDescriptor[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
