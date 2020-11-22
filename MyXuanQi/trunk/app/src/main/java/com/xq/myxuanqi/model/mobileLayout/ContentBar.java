package com.xq.myxuanqi.model.mobileLayout;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.constraint.ConstraintLayout;
import android.support.constraint.ConstraintSet;
import android.view.View;
import android.view.ViewGroup;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.model.layoutBean.MbContentPanel;
import com.xq.myxuanqi.model.layoutBean.MbRow;
import com.xq.myxuanqi.ui.fragment.BaseFragment;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by wm on 2019/1/24.
 * 内容面板
 */

public class ContentBar {
    /*
    * 顶部菜单内的内容面板
    * */
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    public ConstraintLayout getContentBar(ConstraintLayout mCl, BaseFragment parent, Context context, Activity activity, MbContentPanel mbContentPanel,int mStateBar) {
        ConstraintLayout constraintLayout = new ConstraintLayout(context);
        mCl.addView(constraintLayout);
        constraintLayout.setId(View.generateViewId());
        ConstraintLayout.LayoutParams layoutParams = new ConstraintLayout.LayoutParams(ConstraintLayout.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        constraintLayout.setLayoutParams(layoutParams);
        int mbRowNum = mbContentPanel.getMbRowNum();
        List<Integer> idList = new ArrayList<>();
        for (int i = 0; i < mbRowNum; i++) {
            MbRow mbRow = mbContentPanel.getMbRow(i);
            mbRow.toAndroidUI(idList, constraintLayout, parent, context, activity,mStateBar);
        }
        return constraintLayout;
    }
}
