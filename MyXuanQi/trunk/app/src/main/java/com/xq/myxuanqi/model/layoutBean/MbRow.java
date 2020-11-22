package com.xq.myxuanqi.model.layoutBean;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.constraint.ConstraintLayout;
import android.support.constraint.ConstraintSet;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.xq.myxuanqi.ui.fragment.BaseFragment;

import java.util.List;

public class MbRow extends MobileUIComponent {
	private double x0 = 0.5; // top left corner X
    private double y0 = 0.5; // top left corner Y
    private double x1 = 0.5; // bottom right corner X
    private double y1 = 0.5; // bottom right corner X
    // column number, 1 by default
	private int colnum = 1;
	private int width = 20;
    private int height = 56;

    public MbRow() {
        setClasstypename("MbRow");
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

    public int getColnum() {
        return colnum;
    }

    public void setColnum(int colnum) {
        this.colnum = colnum;
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

    public int getMbColumnNum() {
        return getChildren().length;
    }

    public MbColumn getMbColumn(int j) {
        return (MbColumn) getChildren()[j];
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    public void toAndroidUI(List<Integer> idList, ConstraintLayout mCl, final BaseFragment parent, final Context context, final Activity activity, int mStateBar) {
        int mbColumnNum = getMbColumnNum();
        LinearLayout linearLayout = new LinearLayout(context);
        linearLayout.setId(View.generateViewId());
        int linearLayoutId = linearLayout.getId();
        idList.add(linearLayoutId);
        linearLayout.setGravity(LinearLayout.HORIZONTAL);
        mCl.addView(linearLayout);
        ConstraintLayout.LayoutParams constraLayoutParams = new ConstraintLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        linearLayout.setLayoutParams(constraLayoutParams);
        for (int j = 0; j < mbColumnNum; j++) {
            MbColumn mbColumn = getMbColumn(j);
            mbColumn.toAndroidUI(parent, linearLayout, context, activity);

        }
        ConstraintSet constraintSet = new ConstraintSet();
        constraintSet.clone(mCl);
        if (linearLayoutId == idList.get(0)) {
            constraintSet.connect(linearLayoutId, ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 20+mStateBar);
        } else {
            constraintSet.connect(linearLayoutId, ConstraintSet.TOP, idList.get(idList.size() - 2), ConstraintSet.BOTTOM, 5);
        }
        constraintSet.applyTo(mCl);
    }
}
