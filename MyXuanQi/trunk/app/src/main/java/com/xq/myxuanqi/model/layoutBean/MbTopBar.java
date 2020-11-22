package com.xq.myxuanqi.model.layoutBean;

public class MbTopBar extends MobileUIComponent {
    private double x0 = 0.5; // top left corner X
    private double y0 = 0.5; // top left corner Y
    private double x1 = 0.5; // bottom right corner X
    private double y1 = 0.5; // bottom right corner X
    private int selectedIndex = 0;
    private int width = 0;
    private int height = 0;

    public MbTopBar() {
        setClasstypename("MbTopBar");
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

    public int getSelectedIndex() {
        return selectedIndex;
    }

    public void setSelectedIndex(int selectedIndex) {
        this.selectedIndex = selectedIndex;
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

    public int getMbTopBarItemNum() {
        return getChildren().length;
    }

    public MbTopBarItem getMbTopBarItem(int i) {
        return (MbTopBarItem) getChildren()[i];
    }
}
