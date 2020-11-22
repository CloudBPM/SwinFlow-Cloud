/**
 * 
 */
package com.cloudibpm.core.organization;

import com.cloudibpm.core.WorkflowEntity;

/**
 * @author dev
 *
 */
public class Relationship extends WorkflowEntity {
	/**
	 * 
	 */
	private static final long serialVersionUID = 8360823989522590582L;

	private double x0 = 0;
	private double y0;
	private double x1;
	private double y1;
	private double bx = 0;
	private double by = 0;
	private double cx = 0;
	private double cy = 0;

	private double hx = 0; // handle x for changing parent
	private double hy = 0; // handle y for changing parent

	private AbstractOrganizationComponent source = null; // organization component
	private AbstractOrganizationComponent target = null; // organization component
	private int status = 0;

	private boolean selected = false;

	/**
	 * 
	 */
	public Relationship() {
		setId("Relationship 00");
		setName("Relationship 00");
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

	public double getBx() {
		return bx;
	}

	public void setBx(double bx) {
		this.bx = bx;
	}

	public double getBy() {
		return by;
	}

	public void setBy(double by) {
		this.by = by;
	}

	public double getCx() {
		return cx;
	}

	public void setCx(double cx) {
		this.cx = cx;
	}

	public double getCy() {
		return cy;
	}

	public void setCy(double cy) {
		this.cy = cy;
	}

	public double getHx() {
		return hx;
	}

	public void setHx(double hx) {
		this.hx = hx;
	}

	public double getHy() {
		return hy;
	}

	public void setHy(double hy) {
		this.hy = hy;
	}

	public AbstractOrganizationComponent getSource() {
		return source;
	}

	public void setSource(AbstractOrganizationComponent source) {
		this.source = source;
	}

	public AbstractOrganizationComponent getTarget() {
		return target;
	}

	public void setTarget(AbstractOrganizationComponent target) {
		this.target = target;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public boolean isSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}

}
