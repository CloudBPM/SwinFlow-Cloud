package com.xq.myxuanqi.model.layoutBean;

import android.content.Context;
import android.graphics.Color;
import android.support.constraint.ConstraintLayout;
import android.support.constraint.ConstraintSet;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.view.ViewPager;
import android.view.ViewGroup;
import android.widget.RelativeLayout;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.adapter.ViewPagerAdapter;
import com.xq.myxuanqi.ui.fragment.viewPagerAFragment;

import java.util.ArrayList;
import java.util.List;

public class MbBoard extends MobileUIComponent {
	private int index = -1;
    // board border range area
	private double x0 = 10.5; // top left corner X of board content
	private double y0 = 10.5; // top left corner Y of board content
	private double x1 = 550.5; // bottom right corner X of board content
	private double y1 = 1090.5; // bottom right corner Y of board content
    // main menu item border area range
	private double x10 = 0.5; // main menu item of board content
	private double y10 = 0.5; // main menu item of board content
	private double x11 = 0.5; // main menu item of board content
	private double y11 = 0.5; // main menu item of board content
	private String boardIcon = "\uf015";
    private ConstraintLayout layout = null;

    public MbBoard() {
        setClasstypename("MbBoard");
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
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

    public double getX10() {
        return x10;
    }

    public void setX10(double x10) {
        this.x10 = x10;
    }

    public double getY10() {
        return y10;
    }

    public void setY10(double y10) {
        this.y10 = y10;
    }

    public double getX11() {
        return x11;
    }

    public void setX11(double x11) {
        this.x11 = x11;
    }

    public double getY11() {
        return y11;
    }

    public void setY11(double y11) {
        this.y11 = y11;
    }


    public String getBoardIcon() {
        return boardIcon;
    }

    public void setBoardIcon(String boardIcon) {
        this.boardIcon = boardIcon;
    }

    public int getChildObjectNum(){
        return getChildren().length;
    }
    public MobileUIComponent getChildObject(int i) {
        return (MobileUIComponent)getChildren()[i];
    }

}
