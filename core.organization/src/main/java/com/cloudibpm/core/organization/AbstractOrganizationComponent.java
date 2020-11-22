/**
 * 
 */
package com.cloudibpm.core.organization;

//import com.cloudibpm.core.CornerMark;

/**
 * @author TKuser
 * @created on 2008-07
 * @modified on 2016-07-27 14:36pm
 */
public class AbstractOrganizationComponent extends AbstractOrganization {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 3478425993691715306L;
	private String abbrName = "general abbr"; // short name
	private int rank = 1;//


	private double x0 = 0; // top left corner X
	private double y0 = 0; // top left corner Y
	private double x1 = 0; // bottom right corner X
	private double y1 = 0; // bottom right corner X
	// private boolean selected = false; // is selected on canvas
	// private boolean isnewparent = false; // temp property
	// private CornerMark[] marks = null; // eight corner marks
	// private Relationship input = null; // top/left relationships
	private String classtypename = "AbstractOrganizationComponent";

	/**
	 * 
	 */
	public AbstractOrganizationComponent() {
	}

	/**
	 * @param id
	 */
	public AbstractOrganizationComponent(String id) {
		super(id);
	}

	public String getAbbrName() {
		return abbrName;
	}

	public void setAbbrName(String abbrName) {
		this.abbrName = abbrName;
	}

	public int getRank() {
		return rank;
	}

	public void setRank(int rank) {
		this.rank = rank;
	}

	public double getX0() {
		return x0;
	}

	public void setX0(double x0) {
		this.x0 = x0;
	}

	public double getY0() {
		return y0;
	}

	public void setY0(double y0) {
		this.y0 = y0;
	}

	public double getX1() {
		return x1;
	}

	public void setX1(double x1) {
		this.x1 = x1;
	}

	public double getY1() {
		return y1;
	}

	public void setY1(double y1) {
		this.y1 = y1;
	}

	public String getClasstypename() {
		return classtypename;
	}

	public void setClasstypename(String classtypename) {
		this.classtypename = classtypename;
	}

}