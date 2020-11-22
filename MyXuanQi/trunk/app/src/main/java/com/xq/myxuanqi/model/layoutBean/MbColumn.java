package com.xq.myxuanqi.model.layoutBean;

import android.app.Activity;
import android.content.Context;
import android.support.constraint.ConstraintLayout;
import android.view.View;
import android.widget.LinearLayout;

import com.xq.myxuanqi.ui.fragment.BaseFragment;
import com.xq.myxuanqi.util.SingleClick;

public class MbColumn extends MobileUIComponent {
    private double x0 = 0.5; // top left corner X
    private double y0 = 0.5; // top left corner Y
    private double x1 = 0.5; // bottom right corner X
    private double y1 = 0.5; // bottom right corner X
    private int width = 128;
    private int height = 128;

    public MbColumn() {
        setClasstypename("MbColumn");
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

    public int getMbButtonNum() {
        return getChildren().length;
    }

    public MbButton getMbButton(int k) {
        return (MbButton) getChildren()[k];
    }

    public void toAndroidUI(final BaseFragment parent, final LinearLayout linearLayout, final Context context, final Activity activity) {
        int mbButtonNum = getMbButtonNum();
        for (int k = 0; k < mbButtonNum; k++) {
            final MbButton mbButton = getMbButton(k);
            //动态生成布局
            ConstraintLayout constraintLayout = new ConstraintLayout(context);
            mbButton.toAndroidUI(linearLayout, context, activity,constraintLayout);
            constraintLayout.setOnClickListener(new View.OnClickListener() {
                @SingleClick(2000)
                @Override
                public void onClick(View v) {
                    mbButton.doClickMe(mbButton.getAlias(),activity, parent,context,mbButton.getClickMeUrl());
                }
            });
            //布局长按点击事件
            constraintLayout.setOnLongClickListener(new View.OnLongClickListener() {
                @Override
                @SingleClick(2000)
                public boolean onLongClick(View v) {
                    return mbButton.doLongPress(mbButton.getAlias(),activity, parent,context,mbButton.getClickMeUrl());
                }
            });

        }
    }
}
