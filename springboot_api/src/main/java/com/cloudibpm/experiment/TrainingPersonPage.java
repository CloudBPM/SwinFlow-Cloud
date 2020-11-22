package com.cloudibpm.experiment;

import com.cloudibpm.core.Page;

/**
 * 
 * @author Dahai Cao
 * @date 2018-05-20
 *
 */
public class TrainingPersonPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -8011084697940670049L;
	private TrainingPerson[] pageEntities = new TrainingPerson[0];

	public TrainingPersonPage() {
	}

	public TrainingPersonPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	public TrainingPerson[] getPageEntities() {
		return pageEntities;
	}

	public void setPageEntities(TrainingPerson[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
