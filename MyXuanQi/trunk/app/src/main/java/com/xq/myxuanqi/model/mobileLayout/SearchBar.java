package com.xq.myxuanqi.model.mobileLayout;

import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.constraint.ConstraintLayout;
import android.support.constraint.ConstraintSet;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.model.layoutBean.MbSearchBar;

/**
 * Created by wm on 2019/1/24.
 * 搜索栏
 */

public class SearchBar {

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    public ConstraintLayout getSearchBar(ConstraintLayout cl, Context context, MbSearchBar mbSearchBar, int mStateBar) {
        ConstraintSet constraintSet = new ConstraintSet();
        ConstraintLayout constraintLayout = new ConstraintLayout(context);
        constraintLayout.setId(View.generateViewId());
        cl.addView(constraintLayout);
        int clId = constraintLayout.getId();
        ConstraintLayout.LayoutParams layoutParams = new ConstraintLayout.LayoutParams(
                ConstraintLayout.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        constraintLayout.setLayoutParams(layoutParams);
        RelativeLayout relativeLayout = new RelativeLayout(context);
        relativeLayout.setId(R.id.sb_rl);
        constraintLayout.addView(relativeLayout);
        int rlId = relativeLayout.getId();
        ConstraintLayout.LayoutParams layoutParams1 = new ConstraintLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        relativeLayout.setBackgroundResource(R.drawable.news_search_line);
        relativeLayout.setLayoutParams(layoutParams1);
        //给relativeLayout摆放位置
        constraintSet.clone(constraintLayout);
        constraintSet.connect(rlId,ConstraintSet.BOTTOM,clId,ConstraintSet.BOTTOM,20);
        constraintSet.connect(rlId,ConstraintSet.LEFT,clId,ConstraintSet.LEFT,60);
        constraintSet.connect(rlId,ConstraintSet.RIGHT,clId,ConstraintSet.RIGHT,60);
        constraintSet.connect(rlId,ConstraintSet.TOP,clId,ConstraintSet.TOP,mStateBar+20);
        constraintSet.applyTo(constraintLayout);
        ImageView imageView = new ImageView(context);
        imageView.setBackgroundResource(R.mipmap.search1);
        imageView.setId(R.id.sb_iv);
        relativeLayout.addView(imageView);
        int ivId = imageView.getId();
        RelativeLayout.LayoutParams layoutParams2 = new RelativeLayout.LayoutParams(60, 60);
        layoutParams2.addRule(RelativeLayout.CENTER_VERTICAL);
        layoutParams2.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
        layoutParams2.leftMargin = 40;
        imageView.setLayoutParams(layoutParams2);
        EditText editText = new EditText(context);
        RelativeLayout.LayoutParams layoutParams3 = new RelativeLayout.LayoutParams(
        RelativeLayout.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        editText.setLayoutParams(layoutParams3);
        relativeLayout.addView(editText);
        editText.setBackgroundColor(Color.TRANSPARENT);
        editText.setHint("搜索");
        layoutParams3.addRule(RelativeLayout.RIGHT_OF,ivId);
        layoutParams3.leftMargin = 20;
        editText.setTextSize(14);
        editText.setTextColor(Color.BLACK);
        editText.setMaxLines(1);
        editText.setLines(1);
        return constraintLayout;
    }
}
