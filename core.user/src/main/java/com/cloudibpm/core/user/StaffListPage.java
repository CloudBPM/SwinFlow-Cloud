package com.cloudibpm.core.user;

import com.cloudibpm.core.Page;

public class StaffListPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -5397947054534330967L;
	private Staff[] pageEntities = new Staff[0];

	public StaffListPage() {
	}

	public StaffListPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	public Staff[] getPageEntities() {
		return pageEntities;
	}

	public void setPageEntities(Staff[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
