package com.cloudibpm.core.ui.mobile;

public class MbButton extends MobileUIComponent {
    private double x0 = 0.5; // top left corner X
    private double y0 = 0.5; // top left corner Y
    private double x1 = 0.5; // bottom right corner X
    private double y1 = 0.5; // bottom right corner X
    private int width = 50;
    private int height = 50;
    private int fontsize = 26;
    private String fontfamilty = "Arial Black";
    private int clickMe = 0;
    private int clickMeOption = 0;
    private String clickMeUrl = null;
    private int longPressMe = 0;
    private int longPressMeOption = 0;
    private String longPressMeUrl = null;
    // 0: italic; 1: normal; 2: bold
    private String fontWeight = "normal";
    private String frontgroundColor = null;  // #000000
    private String backgroundColor = null; // #ffffff
    private String frontgroundIcon = null; // URL
    private String backgroundImage = null; // URL
    private String alias = null;

    public MbButton() {
        setClasstypename("MbButton");
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

    public int getClickMe() {
        return clickMe;
    }

    public void setClickMe(int clickMe) {
        this.clickMe = clickMe;
    }

    public int getClickMeOption() {
        return clickMeOption;
    }

    public void setClickMeOption(int clickMeOption) {
        this.clickMeOption = clickMeOption;
    }

    public String getClickMeUrl() {
        return clickMeUrl;
    }

    public void setClickMeUrl(String clickMeUrl) {
        this.clickMeUrl = clickMeUrl;
    }

    public int getLongPressMe() {
        return longPressMe;
    }

    public void setLongPressMe(int longPressMe) {
        this.longPressMe = longPressMe;
    }

    public int getLongPressMeOption() {
        return longPressMeOption;
    }

    public void setLongPressMeOption(int longPressMeOption) {
        this.longPressMeOption = longPressMeOption;
    }

    public String getLongPressMeUrl() {
        return longPressMeUrl;
    }

    public void setLongPressMeUrl(String longPressMeUrl) {
        this.longPressMeUrl = longPressMeUrl;
    }

    public String getFontWeight() {
        return fontWeight;
    }

    public void setFontWeight(String fontWeight) {
        this.fontWeight = fontWeight;
    }

    public String getFrontgroundColor() {
        return frontgroundColor;
    }

    public void setFrontgroundColor(String frontgroundColor) {
        this.frontgroundColor = frontgroundColor;
    }

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public String getFrontgroundIcon() {
        return frontgroundIcon;
    }

    public void setFrontgroundIcon(String frontgroundIcon) {
        this.frontgroundIcon = frontgroundIcon;
    }

    public String getBackgroundImage() {
        return backgroundImage;
    }

    public void setBackgroundImage(String backgroundImage) {
        this.backgroundImage = backgroundImage;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }
}
