package com.xq.myxuanqi.model.layoutBean;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.constraint.ConstraintLayout;

import com.xq.myxuanqi.ui.fragment.BaseFragment;

import java.util.ArrayList;
import java.util.List;

public class MbContentPanel extends MobileUIComponent {
	private double x0 = 0.5; // top left corner X
	private double y0 = 0.5; // top left corner Y
	private double x1 = 0.5; // bottom right corner X
	private double y1 = 0.5; // bottom right corner X
	private int selectedIndex = 0;

    public MbContentPanel() {
        setClasstypename("MbContentPanel");
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

    public int getMbRowNum() {
        return getChildren().length;
    }

    public MbRow getMbRow(int i) {
        return (MbRow) getChildren()[i];
    }


}
