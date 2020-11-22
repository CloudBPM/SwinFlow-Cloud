package com.xq.myxuanqi.model.mobileLayout;

import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.constraint.ConstraintLayout;
import android.support.constraint.ConstraintSet;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.adapter.ViewPagerAdapter;
import com.xq.myxuanqi.model.layoutBean.MbContentPanel;
import com.xq.myxuanqi.model.layoutBean.MbTopBar;
import com.xq.myxuanqi.model.layoutBean.MbTopBarItem;
import com.xq.myxuanqi.ui.fragment.viewPagerAFragment;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by wm on 2019/1/24.
 * 菜单栏UI
 */

public class MenuBar {
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    public ConstraintLayout getTablayout(ConstraintLayout mCl, Context context, FragmentManager fm, int mStateBar, MbTopBar mbTopBar) {
        android.support.design.widget.TabLayout mTab;
        ViewPager mVp;//创建顶部菜单栏 tablayout
        ConstraintLayout constraintLayout = new ConstraintLayout(context);
        mCl.addView(constraintLayout);
        constraintLayout.setId(View.generateViewId());
        ConstraintLayout.LayoutParams consLayoutParams = new ConstraintLayout.LayoutParams(
                ConstraintLayout.LayoutParams.MATCH_PARENT,
                ConstraintLayout.LayoutParams.WRAP_CONTENT);
        constraintLayout.setLayoutParams(consLayoutParams);
        ConstraintSet constraintSet = new ConstraintSet();
        RelativeLayout relativeLayout = new RelativeLayout(context);
        relativeLayout.setId(View.generateViewId());
        constraintLayout.addView(relativeLayout);
        ConstraintLayout.LayoutParams relayoutParams = new ConstraintLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        int reId = relativeLayout.getId();
        relativeLayout.setLayoutParams(relayoutParams);
        android.support.design.widget.TabLayout tableLayout = new android.support.design.widget.TabLayout(context);
        tableLayout.setId(View.generateViewId());
        int tb = tableLayout.getId();
//        mTab = tableLayout.findViewById(R.id.tb);
        tableLayout.setTabGravity(android.support.design.widget.TabLayout.GRAVITY_FILL);
        tableLayout.setSelectedTabIndicatorColor(Color.BLUE);
        tableLayout.setSelectedTabIndicatorHeight(3);//下划线宽度
        relativeLayout.addView(tableLayout);
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        layoutParams.setMargins(0,mStateBar+10,0,0);
        tableLayout.setLayoutParams(layoutParams);
        //创建viewPager
        ViewPager viewPager = new ViewPager(context);
        viewPager.setId(R.id.viewPager);
        constraintLayout.addView(viewPager);
        if (mStateBar>0){
            relativeLayout.setBackgroundColor(Color.parseColor("#FF41B8FC"));
            tableLayout.setTabTextColors(Color.WHITE,Color.YELLOW);
        }else {
            relativeLayout.setBackgroundColor(Color.parseColor("#FFFFFF"));
            tableLayout.setTabTextColors(Color.BLUE,Color.BLACK);
        }

        int itemNum = mbTopBar.getMbTopBarItemNum();
        List<Fragment> list = new ArrayList<>();
        List<String> titleList = new ArrayList<>();
        for (int i=0;i<itemNum;i++){
            MbTopBarItem mbTopBarItem = mbTopBar.getMbTopBarItem(i);
            MbContentPanel mbContentPanel = mbTopBarItem.getMbContentPanel();
            list.add(new viewPagerAFragment(mbContentPanel));
            titleList.add(mbTopBarItem.getName());
        }
        int vpId = viewPager.getId();
//        mVp = viewPager.findViewById(R.id.viewPager);
        ViewPagerAdapter adapter = new ViewPagerAdapter(fm, list, titleList);
        viewPager.setAdapter(adapter);
        viewPager.setOffscreenPageLimit(list.size());
        tableLayout.setupWithViewPager(viewPager);
        tableLayout.setTabsFromPagerAdapter(adapter);
        int clId = constraintLayout.getId();
        constraintSet.clone(constraintLayout);
        constraintSet.connect(reId,ConstraintSet.TOP,clId,ConstraintSet.TOP);
        constraintSet.connect(vpId, ConstraintSet.TOP,reId,ConstraintSet.BOTTOM);
        constraintSet.applyTo(constraintLayout);
        return constraintLayout;
    }
}
