package com.cloudibpm.core.ui.mobile;

public class MbTopBarItem extends MobileUIComponent {
	private int width = 20;
	private int height = 56;
	private double x0 = 0.5; // top left corner X
	private double y0 = 0.5; // top left corner Y
	private double x1 = this.width + 0.5; // bottom right corner X
	private double y1 = this.height + 0.5; // bottom right corner X
	private int fontsize = 16;
	private String fontfamilty = "Arial Black";

    public MbTopBarItem() {
        setClasstypename("MbTopBarItem");
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
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

    public int getFontsize() {
        return fontsize;
    }

    public void setFontsize(int fontsize) {
        this.fontsize = fontsize;
    }

    public String getFontfamilty() {
        return fontfamilty;
    }

    public void setFontfamilty(String fontfamilty) {
        this.fontfamilty = fontfamilty;
    }

    public MbContentPanel getMbContentPanel() {
        return (MbContentPanel)this.getChildren()[0];
    }
}
