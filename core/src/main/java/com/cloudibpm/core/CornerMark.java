package com.cloudibpm.core;

public class CornerMark implements java.io.Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 7414899590273156269L;
	
	private double x0 = 0;
	private double x1 = 0;
	private double y0 = 0;
	private double y1 = 0;
	private double width = 8;
	private double height = 8;
	private double half = 4;

	public CornerMark() {
	}

	public double getX0() {
		return x0;
	}

	public void setX0(double x0) {
		this.x0 = x0;
	}

	public double getX1() {
		return x1;
	}

	public void setX1(double x1) {
		this.x1 = x1;
	}

	public double getY0() {
		return y0;
	}

	public void setY0(double y0) {
		this.y0 = y0;
	}

	public double getY1() {
		return y1;
	}

	public void setY1(double y1) {
		this.y1 = y1;
	}

	public double getWidth() {
		return width;
	}

	public void setWidth(double width) {
		this.width = width;
	}

	public double getHeight() {
		return height;
	}

	public void setHeight(double height) {
		this.height = height;
	}

	public double getHalf() {
		return half;
	}

	public void setHalf(double half) {
		this.half = half;
	}

}
