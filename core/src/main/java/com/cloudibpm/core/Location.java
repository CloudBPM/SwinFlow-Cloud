/**
 * @user Dahai CAO
 * @date 19/10/2011 3:56:05 PM
 */
package com.cloudibpm.core;

import java.io.Serializable;

public class Location implements Cloneable, Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -8910472929083800052L;
	private double x = 0;
	private double y = 0;

	/**
	 * Constructor
	 */
	public Location() {
	}

	/**
	 * 
	 * Constructor
	 * 
	 * @param x
	 * @param y
	 */
	public Location(double x, double y) {
		this.x = x;
		this.y = y;
	}

	public Location(Location loc) {
		this.x = loc.getX();
		this.y = loc.getY();
	}

	/**
	 * 
	 */
	@Override
	public boolean equals(Object loc) {
		if (!(loc instanceof Location))
			return false;
		return this.x == ((Location) loc).getX() && this.y == ((Location) loc).getY();
	}

	/**
	 * 
	 */
	@Override
	public Object clone() throws CloneNotSupportedException {
		return super.clone();
		// Location l = new Location();
		// l.setX(this.x);
		// l.setY(this.y);
		// return l;
	}

	/**
	 * @date 19/10/2011 4:00:43 PM
	 * @return x
	 */
	public double getX() {
		return x;
	}

	/**
	 * @date 19/10/2011 4:00:43 PM
	 * @param The
	 *            x to set
	 */
	public void setX(double x) {
		this.x = x;
	}

	/**
	 * @date 19/10/2011 4:00:43 PM
	 * @return y
	 */
	public double getY() {
		return y;
	}

	/**
	 * @date 19/10/2011 4:00:43 PM
	 * @param The
	 *            y to set
	 */
	public void setY(double y) {
		this.y = y;
	}

	/**
	 * 
	 * @author Dahai CAO
	 * @date 19/10/2011 4:02:08 PM
	 * @return
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return "x=" + x + ";" + "y=" + y;
	}

}
